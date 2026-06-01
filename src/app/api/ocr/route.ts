import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import { createWorker } from "tesseract.js";
import { writeFile, unlink, mkdir } from "fs/promises";
import { join } from "path";
import { tmpdir } from "os";
import { randomUUID } from "crypto";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// POST /api/ocr
export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const language = (formData.get("language") as string) || "eng";

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/bmp",
    "image/tiff",
    "application/pdf",
  ];

  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json(
      { error: "Unsupported file type. Use JPG, PNG, WEBP, or PDF." },
      { status: 400 }
    );
  }

  // Save temp file
  const tmpDir = join(tmpdir(), "convertai-ocr");
  await mkdir(tmpDir, { recursive: true });
  const ext = file.name.split(".").pop() || "jpg";
  const tmpPath = join(tmpDir, `${randomUUID()}.${ext}`);

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(tmpPath, buffer);

  try {
    // Step 1: Tesseract OCR
    const worker = await createWorker(language);
    const { data } = await worker.recognize(tmpPath);
    await worker.terminate();

    const rawText = data.text.trim();
    const confidence = data.confidence;

    // Step 2: Enhance with Groq AI (format + fix OCR mistakes)
    let enhancedText = rawText;

    if (rawText.length > 10 && process.env.GROQ_API_KEY) {
      try {
        const groqResponse = await groq.chat.completions.create({
          model: "llama-3.1-8b-instant",
          messages: [
            {
              role: "system",
              content: `You are an OCR text correction assistant. 
You receive raw OCR output and must:
1. Fix OCR errors and typos
2. Preserve original formatting (headings, paragraphs, bullet points, tables)
3. Maintain the document structure
4. Do NOT add new content or change meaning
5. Return only the corrected text, nothing else`,
            },
            {
              role: "user",
              content: `Please clean up and fix this OCR output:\n\n${rawText.slice(0, 8000)}`,
            },
          ],
          max_tokens: 4096,
          temperature: 0.1,
        });

        const groqText =
          groqResponse.choices[0]?.message?.content?.trim();
        if (groqText && groqText.length > rawText.length * 0.3) {
          enhancedText = groqText;
        }
      } catch (groqErr) {
        console.error("Groq enhancement failed, using raw text:", groqErr);
      }
    }

    await unlink(tmpPath).catch(() => {});

    return NextResponse.json({
      text: enhancedText,
      rawText,
      confidence,
      wordCount: enhancedText.split(/\s+/).filter(Boolean).length,
      charCount: enhancedText.length,
      language,
      enhanced: enhancedText !== rawText,
    });
  } catch (err: any) {
    await unlink(tmpPath).catch(() => {});
    console.error("OCR error:", err);
    return NextResponse.json(
      { error: err.message || "OCR processing failed" },
      { status: 500 }
    );
  }
}

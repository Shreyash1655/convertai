import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import { writeFile, unlink, readFile, mkdir } from "fs/promises";
import { join } from "path";
import { tmpdir } from "os";
import { randomUUID } from "crypto";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const mode = (formData.get("mode") as string) || "color";

  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

  const tmpDir = join(tmpdir(), "convertai-enhance");
  await mkdir(tmpDir, { recursive: true });
  const inputPath = join(tmpDir, `${randomUUID()}.jpg`);
  const outputPath = join(tmpDir, `${randomUUID()}-out.jpg`);

  await writeFile(inputPath, Buffer.from(await file.arrayBuffer()));

  try {
    let pipeline = sharp(inputPath)
      .resize({ width: 2400, withoutEnlargement: true })
      .rotate();

    if (mode === "bw") {
      pipeline = pipeline
        .grayscale()
        .normalise({ lower: 5, upper: 95 })
        .linear(1.8, -60)        // aggressive contrast boost
        .sharpen({ sigma: 2, m1: 1.5, m2: 2 })
        .threshold(130);
    } else if (mode === "grayscale") {
      pipeline = pipeline
        .grayscale()
        .normalise({ lower: 5, upper: 95 })
        .linear(1.5, -30)        // contrast boost
        .sharpen({ sigma: 1.8, m1: 1, m2: 1.5 })
        .modulate({ brightness: 1.2 });
    } else {
      pipeline = pipeline
        .normalise({ lower: 5, upper: 95 })
        .linear(1.4, -20)        // contrast boost
        .sharpen({ sigma: 1.5, m1: 1, m2: 1.5 })
        .modulate({ brightness: 1.15, saturation: 0.8 });
    }

    await pipeline.jpeg({ quality: 95 }).toFile(outputPath);

    const outBuffer = await readFile(outputPath);
    const base64 = outBuffer.toString("base64");

    await unlink(inputPath).catch(() => {});
    await unlink(outputPath).catch(() => {});

    return NextResponse.json({ image: `data:image/jpeg;base64,${base64}` });
  } catch (err: any) {
    await unlink(inputPath).catch(() => {});
    console.error("Enhance error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

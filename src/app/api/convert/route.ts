import { NextRequest, NextResponse } from "next/server";
import { PDFDocument } from "pdf-lib";
import sharp from "sharp";
import { writeFile, unlink, readFile, mkdir } from "fs/promises";
import { join } from "path";
import { tmpdir } from "os";
import { randomUUID } from "crypto";
import libre from "libreoffice-convert";
import { promisify } from "util";

const libreConvert = promisify(libre.convert);

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const outputFormat = (formData.get("outputFormat") as string)?.toLowerCase();

  if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });
  if (!outputFormat) return NextResponse.json({ error: "No output format specified" }, { status: 400 });

  const tmpDir = join(tmpdir(), "convertai-convert");
  await mkdir(tmpDir, { recursive: true });

  const ext = file.name.split(".").pop()?.toLowerCase() || "bin";
  const inputPath = join(tmpDir, `${randomUUID()}.${ext}`);
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(inputPath, buffer);

  const baseName = file.name.replace(/\.[^.]+$/, "");

  try {
    let result: { buffer: Buffer; mimeType: string; ext: string } | null = null;

    // IMAGE → PDF
    if (["jpg", "jpeg", "png", "webp"].includes(ext) && outputFormat === "pdf") {
      const imgBuffer = await readFile(inputPath);
      const pdfDoc = await PDFDocument.create();
      let embeddedImage;
      if (ext === "png") {
        embeddedImage = await pdfDoc.embedPng(imgBuffer);
      } else {
        const jpegBuffer = ext === "webp" ? await sharp(imgBuffer).jpeg().toBuffer() : imgBuffer;
        embeddedImage = await pdfDoc.embedJpg(jpegBuffer);
      }
      const page = pdfDoc.addPage([embeddedImage.width, embeddedImage.height]);
      page.drawImage(embeddedImage, { x: 0, y: 0, width: embeddedImage.width, height: embeddedImage.height });
      result = { buffer: Buffer.from(await pdfDoc.save()), mimeType: "application/pdf", ext: "pdf" };
    }

    // IMAGE ↔ IMAGE
    else if (["jpg", "jpeg", "png", "webp"].includes(ext) && ["jpg", "jpeg", "png", "webp"].includes(outputFormat)) {
      const imgBuffer = await readFile(inputPath);
      let outBuffer: Buffer;
      let mimeType: string;
      let outExt: string;
      if (outputFormat === "jpg" || outputFormat === "jpeg") {
        outBuffer = await sharp(imgBuffer).jpeg({ quality: 90 }).toBuffer();
        mimeType = "image/jpeg"; outExt = "jpg";
      } else if (outputFormat === "png") {
        outBuffer = await sharp(imgBuffer).png().toBuffer();
        mimeType = "image/png"; outExt = "png";
      } else {
        outBuffer = await sharp(imgBuffer).webp({ quality: 90 }).toBuffer();
        mimeType = "image/webp"; outExt = "webp";
      }
      result = { buffer: outBuffer, mimeType, ext: outExt };
    }

    // PDF → TXT
    else if (ext === "pdf" && outputFormat === "txt") {
      result = {
        buffer: Buffer.from(`Text extracted from: ${file.name}\n`),
        mimeType: "text/plain", ext: "txt",
      };
    }

    // PPTX / DOCX / ODT / etc → PDF (via LibreOffice)
    else if (["pptx", "ppt", "docx", "doc", "odt", "odp", "xlsx", "xls", "csv"].includes(ext) && outputFormat === "pdf") {
      const inputBuffer = await readFile(inputPath);
      const pdfBuffer = await libreConvert(inputBuffer, ".pdf", undefined);
      result = { buffer: pdfBuffer, mimeType: "application/pdf", ext: "pdf" };
    }

    else {
      await unlink(inputPath).catch(() => {});
      return NextResponse.json(
        { error: `Conversion from ${ext.toUpperCase()} to ${outputFormat.toUpperCase()} is not supported.` },
        { status: 422 }
      );
    }

    await unlink(inputPath).catch(() => {});
    const outputFilename = `${baseName}.${result.ext}`;

    return new NextResponse(result.buffer, {
      headers: {
        "Content-Type": result.mimeType,
        "Content-Disposition": `attachment; filename="${outputFilename}"`,
        "X-Filename": outputFilename,
        "X-Original": file.name,
        "X-Output-Format": outputFormat,
      },
    });
  } catch (err: any) {
    await unlink(inputPath).catch(() => {});
    console.error("Conversion error:", err);
    return NextResponse.json({ error: err.message || "Conversion failed" }, { status: 500 });
  }
}

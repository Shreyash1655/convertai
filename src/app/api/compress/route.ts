import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import { writeFile, unlink, readFile, mkdir } from "fs/promises";
import { join } from "path";
import { tmpdir } from "os";
import { randomUUID } from "crypto";
import { execFile } from "child_process";
import { promisify } from "util";

const execFileAsync = promisify(execFile);
const GS_PATH = "gs";

async function compressPdfToTarget(inputPath: string, targetBytes: number, tmpDir: string): Promise<Buffer> {
  const presets = ["prepress", "printer", "ebook", "screen"];
  let bestBuffer: Buffer | null = null;
  let bestDiff = Infinity;

  for (const preset of presets) {
    const outputPath = join(tmpDir, `${randomUUID()}-out.pdf`);
    try {
      await execFileAsync(GS_PATH, [
        "-sDEVICE=pdfwrite",
        "-dCompatibilityLevel=1.4",
        `-dPDFSETTINGS=/${preset}`,
        "-dNOPAUSE", "-dQUIET", "-dBATCH",
        `-sOutputFile=${outputPath}`,
        inputPath,
      ]);
      const buf = await readFile(outputPath);
      await unlink(outputPath).catch(() => {});
      const diff = Math.abs(buf.length - targetBytes);
      if (diff < bestDiff) {
        bestDiff = diff;
        bestBuffer = buf;
      }
      // If we're within 15% of target or under target, stop
      if (buf.length <= targetBytes * 1.15) break;
    } catch {
      await unlink(outputPath).catch(() => {});
    }
  }

  return bestBuffer!;
}

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const targetMB = parseFloat(formData.get("targetMB") as string) || 1;

  if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

  const tmpDir = join(tmpdir(), "convertai-compress");
  await mkdir(tmpDir, { recursive: true });

  const ext = file.name.split(".").pop()?.toLowerCase() || "bin";
  const inputPath = join(tmpDir, `${randomUUID()}.${ext}`);
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(inputPath, buffer);
  const originalSize = buffer.length;
  const targetBytes = Math.round(targetMB * 1024 * 1024);
  const baseName = file.name.replace(/\.[^.]+$/, "");

  try {
    let resultBuffer: Buffer;
    let mimeType: string;
    let outExt: string;

    if (["jpg", "jpeg", "png", "webp"].includes(ext)) {
      let lo = 1, hi = 95;
      let bestBuffer = buffer;

      for (let i = 0; i < 10; i++) {
        const mid = Math.round((lo + hi) / 2);
        let buf: Buffer;
        if (ext === "png") {
          buf = await sharp(await readFile(inputPath)).png({ compressionLevel: Math.round(9 - (mid / 100) * 9) }).toBuffer();
        } else if (ext === "webp") {
          buf = await sharp(await readFile(inputPath)).webp({ quality: mid }).toBuffer();
        } else {
          buf = await sharp(await readFile(inputPath)).jpeg({ quality: mid, progressive: true, mozjpeg: true }).toBuffer();
        }
        bestBuffer = buf;
        if (Math.abs(buf.length - targetBytes) < targetBytes * 0.05) break;
        if (buf.length > targetBytes) hi = mid - 1;
        else lo = mid + 1;
        if (lo > hi) break;
      }

      resultBuffer = bestBuffer;
      mimeType = ext === "png" ? "image/png" : ext === "webp" ? "image/webp" : "image/jpeg";
      outExt = ext === "png" ? "png" : ext === "webp" ? "webp" : "jpg";
    }

    else if (ext === "pdf") {
      resultBuffer = await compressPdfToTarget(inputPath, targetBytes, tmpDir);
      mimeType = "application/pdf";
      outExt = "pdf";
    }

    else {
      await unlink(inputPath).catch(() => {});
      return NextResponse.json({ error: `Compression for ${ext.toUpperCase()} is not supported.` }, { status: 422 });
    }

    await unlink(inputPath).catch(() => {});

    const compressedSize = resultBuffer.length;
    const savedBytes = originalSize - compressedSize;
    const savedPercent = ((savedBytes / originalSize) * 100).toFixed(1);

    return new NextResponse(resultBuffer, {
      headers: {
        "Content-Type": mimeType,
        "Content-Disposition": `attachment; filename="${baseName}-compressed.${outExt}"`,
        "X-Original-Size": originalSize.toString(),
        "X-Compressed-Size": compressedSize.toString(),
        "X-Saved-Bytes": savedBytes.toString(),
        "X-Saved-Percent": savedPercent,
      },
    });
  } catch (err: any) {
    await unlink(inputPath).catch(() => {});
    console.error("Compression error:", err);
    return NextResponse.json({ error: err.message || "Compression failed" }, { status: 500 });
  }
}

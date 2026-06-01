import { NextRequest, NextResponse } from "next/server";
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from "docx";
import PDFDocument from "pdfkit";

// POST /api/ocr/download
export async function POST(req: NextRequest) {
  const { text, format, filename } = await req.json();

  if (!text || !format) {
    return NextResponse.json({ error: "Missing text or format" }, { status: 400 });
  }

  const baseName = (filename || "ocr-result").replace(/\.[^.]+$/, "");

  try {
    if (format === "txt") {
      return new NextResponse(text, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Content-Disposition": `attachment; filename="${baseName}.txt"`,
        },
      });
    }

    if (format === "docx") {
      const lines = text.split("\n");
      const paragraphs = lines.map((line: string) => {
        const trimmed = line.trim();
        // Detect headings (ALL CAPS or ends with ":")
        if (trimmed.length > 0 && trimmed === trimmed.toUpperCase() && trimmed.length < 80) {
          return new Paragraph({
            children: [new TextRun({ text: trimmed, bold: true })],
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 240, after: 120 },
          });
        }
        return new Paragraph({
          children: [new TextRun({ text: line })],
          spacing: { before: 0, after: 120 },
        });
      });

      const doc = new Document({
        sections: [{
          properties: {},
          children: [
            new Paragraph({
              children: [new TextRun({ text: baseName, bold: true, size: 32 })],
              heading: HeadingLevel.HEADING_1,
              spacing: { before: 0, after: 360 },
            }),
            ...paragraphs,
          ],
        }],
      });

      const buffer = await Packer.toBuffer(doc);
      return new NextResponse(buffer, {
        headers: {
          "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "Content-Disposition": `attachment; filename="${baseName}.docx"`,
        },
      });
    }

    if (format === "pdf") {
      const chunks: Buffer[] = [];
      const pdfDoc = new PDFDocument({ margin: 50 });

      await new Promise<void>((resolve, reject) => {
        pdfDoc.on("data", (chunk) => chunks.push(chunk));
        pdfDoc.on("end", resolve);
        pdfDoc.on("error", reject);

        pdfDoc
          .font("Helvetica-Bold")
          .fontSize(18)
          .text(baseName, { align: "left" });

        pdfDoc.moveDown(0.5);

        pdfDoc
          .font("Helvetica")
          .fontSize(11)
          .text(text, { align: "left", lineGap: 4 });

        pdfDoc.end();
      });

      const pdfBuffer = Buffer.concat(chunks);
      return new NextResponse(pdfBuffer, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="${baseName}.pdf"`,
        },
      });
    }

    return NextResponse.json({ error: "Invalid format" }, { status: 400 });
  } catch (err: any) {
    console.error("Download generation error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

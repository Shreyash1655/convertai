"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ScanLine, Camera, Download, Plus, Trash2,
  Sun, Contrast, FileText, Layers, RefreshCw, CheckCircle2,
} from "lucide-react";
import { useDropzone } from "react-dropzone";
import { useToast } from "@/lib/hooks/use-toast";

interface ScannedPage {
  id: string;
  originalUrl: string;
  processedUrl?: string;
  file: File;
}

type FilterMode = "color" | "grayscale" | "bw";

export default function ScannerPage() {
  const [pages, setPages] = useState<ScannedPage[]>([]);
  const [filterMode, setFilterMode] = useState<FilterMode>("color");
  const [processing, setProcessing] = useState(false);
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newPages: ScannedPage[] = acceptedFiles.map((f) => ({
      id: Math.random().toString(36).slice(2),
      file: f,
      originalUrl: URL.createObjectURL(f),
    }));
    setPages((prev) => [...prev, ...newPages]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpg", ".jpeg", ".png", ".webp"] },
    maxSize: 50 * 1024 * 1024,
  });

  const removePage = (id: string) => setPages((prev) => prev.filter((p) => p.id !== id));

  const processPages = async () => {
    if (pages.length === 0) return;
    setProcessing(true);

    const processed = await Promise.all(
      pages.map(async (page) => {
        try {
          const formData = new FormData();
          formData.append("file", page.file);
          formData.append("mode", filterMode);

          const res = await fetch("/api/enhance", { method: "POST", body: formData });
          const data = await res.json();

          return { ...page, processedUrl: data.image || page.originalUrl };
        } catch {
          return page;
        }
      })
    );

    setPages(processed);
    setProcessing(false);
    toast({ title: "Pages enhanced!", description: `${pages.length} page(s) ready.` });
  };

  const exportToPDF = async () => {
    if (pages.length === 0) return;
    const { PDFDocument } = await import("pdf-lib");
    const pdfDoc = await PDFDocument.create();

    for (const page of pages) {
      const imgUrl = page.processedUrl || page.originalUrl;
      const response = await fetch(imgUrl);
      const imgBytes = await response.arrayBuffer();

      let image;
      try {
        image = await pdfDoc.embedJpg(imgBytes);
      } catch {
        const canvas = document.createElement("canvas");
        const img = new Image();
        await new Promise<void>((res) => { img.onload = () => res(); img.src = imgUrl; });
        canvas.width = img.width;
        canvas.height = img.height;
        canvas.getContext("2d")!.drawImage(img, 0, 0);
        const jpgBlob = await new Promise<Blob>((res) => canvas.toBlob((b) => res(b!), "image/jpeg", 0.92));
        image = await pdfDoc.embedJpg(await jpgBlob.arrayBuffer());
      }

      const pdfPage = pdfDoc.addPage([image.width, image.height]);
      pdfPage.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
    }

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `scanned-document-${Date.now()}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "PDF exported!", description: `${pages.length} pages saved.` });
  };

  return (
    <main className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-10">
          <Badge variant="secondary" className="mb-4 gap-1.5">
            <ScanLine className="w-3.5 h-3.5" /> Document Scanner
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: "Syne, sans-serif" }}>
            Scan <span className="gradient-text">Documents</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Upload photos of documents. Apply filters, enhance visibility, and export to PDF.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="space-y-5">
            <div {...getRootProps()} className={`upload-zone ${isDragActive ? "active" : ""}`}>
              <input {...getInputProps()} />
              <div className="flex flex-col items-center gap-3 py-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isDragActive ? "gradient-bg" : "bg-green-100 dark:bg-green-900/30"}`}>
                  <Camera className={`w-6 h-6 ${isDragActive ? "text-white" : "text-green-600"}`} />
                </div>
                <div className="text-center">
                  <p className="font-medium text-sm">Upload document photos</p>
                  <p className="text-xs text-muted-foreground mt-1">JPG, PNG, WEBP — multiple files OK</p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border bg-card p-4 space-y-3">
              <p className="text-sm font-semibold">Scan Mode</p>
              <div className="grid grid-cols-3 gap-2">
                {([
                  { value: "color", label: "Color", icon: Sun },
                  { value: "grayscale", label: "Grayscale", icon: Contrast },
                  { value: "bw", label: "B&W", icon: FileText },
                ] as const).map((m) => (
                  <button
                    key={m.value}
                    onClick={() => setFilterMode(m.value)}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-lg border text-xs transition-all ${
                      filterMode === m.value
                        ? "border-primary bg-primary/10 text-primary font-medium"
                        : "hover:bg-muted"
                    }`}
                  >
                    <m.icon className="w-4 h-4" />
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Button
                onClick={processPages}
                disabled={pages.length === 0 || processing}
                className="w-full gradient-bg text-white hover:opacity-90 gap-2 h-11"
              >
                {processing
                  ? <><RefreshCw className="w-4 h-4 animate-spin" /> Enhancing...</>
                  : <><ScanLine className="w-4 h-4" /> Enhance Pages</>}
              </Button>
              <Button
                onClick={exportToPDF}
                disabled={pages.length === 0}
                variant="outline"
                className="w-full gap-2 h-11"
              >
                <Download className="w-4 h-4" /> Export to PDF ({pages.length} pages)
              </Button>
            </div>
          </div>

          <div className="lg:col-span-2">
            {pages.length === 0 ? (
              <div className="rounded-2xl border bg-card h-full min-h-[400px] flex items-center justify-center">
                <div className="text-center space-y-3 p-8">
                  <Layers className="w-12 h-12 text-muted-foreground mx-auto" />
                  <p className="font-medium text-muted-foreground">No pages added yet</p>
                  <p className="text-sm text-muted-foreground">Upload document photos to get started</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {pages.map((page, idx) => (
                  <motion.div
                    key={page.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative group rounded-xl overflow-hidden border bg-card aspect-[3/4]"
                  >
                    <img
                      src={page.processedUrl || page.originalUrl}
                      alt={`Page ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        onClick={() => removePage(page.id)}
                        className="p-2 rounded-lg bg-red-500/80 text-white hover:bg-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full">
                      p.{idx + 1}
                    </div>
                    {page.processedUrl && (
                      <div className="absolute top-2 right-2">
                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                      </div>
                    )}
                  </motion.div>
                ))}
                <div {...getRootProps()} className="aspect-[3/4] rounded-xl border-2 border-dashed flex items-center justify-center cursor-pointer hover:border-primary/50 hover:bg-muted/30 transition-all">
                  <input {...getInputProps()} />
                  <Plus className="w-8 h-8 text-muted-foreground" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

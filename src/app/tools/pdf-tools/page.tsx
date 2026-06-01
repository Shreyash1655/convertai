"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  FileText, Merge, Scissors, Lock, Unlock,
  RotateCw, Download, Upload, RefreshCw, Plus
} from "lucide-react";
import { useToast } from "@/lib/hooks/use-toast";
import { formatBytes } from "@/lib/utils";

export default function PdfToolsPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const [password, setPassword] = useState("");
  const { toast } = useToast();

  const onDrop = useCallback((f: File[]) => setFiles((prev) => [...prev, ...f]), []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    maxSize: 500 * 1024 * 1024,
  });

  const handleMerge = async () => {
    if (files.length < 2) {
      toast({ title: "Need at least 2 PDFs to merge", variant: "destructive" });
      return;
    }
    setProcessing(true);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const mergedPdf = await PDFDocument.create();
      for (const file of files) {
        const bytes = await file.arrayBuffer();
        const pdf = await PDFDocument.load(bytes);
        const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        pages.forEach((p) => mergedPdf.addPage(p));
      }
      const merged = await mergedPdf.save();
      const blob = new Blob([merged], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "merged.pdf";
      a.click();
      URL.revokeObjectURL(url);
      toast({ title: "PDFs merged successfully!" });
    } catch (err: any) {
      toast({ title: "Merge failed", description: err.message, variant: "destructive" });
    } finally {
      setProcessing(false);
    }
  };

  const tools = [
    { icon: Merge, label: "Merge PDFs", desc: "Combine multiple PDFs into one", action: handleMerge, minFiles: 2 },
    { icon: Scissors, label: "Split PDF", desc: "Extract pages from a PDF", action: () => toast({ title: "Upload a PDF to split" }), minFiles: 1 },
    { icon: RotateCw, label: "Rotate Pages", desc: "Rotate all or specific pages", action: () => toast({ title: "Select PDF and rotation" }), minFiles: 1 },
    { icon: Lock, label: "Password Protect", desc: "Add password to PDF", action: () => toast({ title: "Password protection coming soon" }), minFiles: 1 },
  ];

  return (
    <main className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: "Syne, sans-serif" }}>
            PDF <span className="gradient-text">Tools</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Merge, split, rotate, protect and more — complete PDF toolkit in your browser.
          </p>
        </div>

        {/* Tool Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {tools.map((tool) => (
            <motion.button
              key={tool.label}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={tool.action}
              disabled={files.length < tool.minFiles || processing}
              className="p-5 rounded-2xl border bg-card text-left hover:border-primary/30 hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/20 flex items-center justify-center mb-3">
                <tool.icon className="w-5 h-5 text-red-500" />
              </div>
              <p className="font-semibold text-sm">{tool.label}</p>
              <p className="text-xs text-muted-foreground mt-1">{tool.desc}</p>
            </motion.button>
          ))}
        </div>

        {/* Upload Zone */}
        <div {...getRootProps()} className={`upload-zone mb-6 ${isDragActive ? "active" : ""}`}>
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-3 py-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${isDragActive ? "gradient-bg" : "bg-red-100 dark:bg-red-900/20"}`}>
              <FileText className={`w-7 h-7 ${isDragActive ? "text-white" : "text-red-500"}`} />
            </div>
            <p className="font-medium">{isDragActive ? "Drop PDFs here" : "Upload PDF files"}</p>
            <p className="text-sm text-muted-foreground">Drag multiple files for merge operations</p>
          </div>
        </div>

        {/* File List */}
        {files.length > 0 && (
          <div className="rounded-xl border bg-card overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b">
              <p className="text-sm font-medium">{files.length} file(s) loaded</p>
              <Button size="sm" variant="ghost" onClick={() => setFiles([])}>Clear all</Button>
            </div>
            <div className="divide-y">
              {files.map((f, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-3">
                  <FileText className="w-4 h-4 text-red-500 shrink-0" />
                  <span className="text-sm flex-1 truncate">{f.name}</span>
                  <span className="text-xs text-muted-foreground">{formatBytes(f.size)}</span>
                  <Button size="sm" variant="ghost" className="h-7 w-7 p-0" onClick={() => setFiles((prev) => prev.filter((_, j) => j !== i))}>×</Button>
                </div>
              ))}
            </div>
            <div className="px-4 py-3 border-t">
              <Button
                onClick={handleMerge}
                disabled={files.length < 2 || processing}
                className="gradient-bg text-white hover:opacity-90 gap-2"
              >
                {processing ? <><RefreshCw className="w-4 h-4 animate-spin" /> Processing...</> : <><Merge className="w-4 h-4" /> Merge All PDFs</>}
              </Button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

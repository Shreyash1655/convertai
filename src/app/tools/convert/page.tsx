"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Upload,
  Download,
  FileText,
  RefreshCw,
  X,
  CheckCircle2,
  ArrowRight,
  Plus,
} from "lucide-react";
import { useToast } from "@/lib/hooks/use-toast";
import { formatBytes } from "@/lib/utils";

type ConversionStatus = "idle" | "converting" | "done" | "error";

interface FileItem {
  id: string;
  file: File;
  status: ConversionStatus;
  progress: number;
  outputUrl?: string;
  outputFilename?: string;
  error?: string;
  originalSize?: number;
  outputSize?: number;
}

const conversionOptions: Record<string, { label: string; formats: { value: string; label: string }[] }[]> = {
  "image/jpeg": [
    {
      label: "Image Formats",
      formats: [
        { value: "png", label: "PNG Image" },
        { value: "webp", label: "WEBP Image" },
        { value: "pdf", label: "PDF Document" },
      ],
    },
  ],
  "image/png": [
    {
      label: "Image Formats",
      formats: [
        { value: "jpg", label: "JPG Image" },
        { value: "webp", label: "WEBP Image" },
        { value: "pdf", label: "PDF Document" },
      ],
    },
  ],
  "image/webp": [
    {
      label: "Image Formats",
      formats: [
        { value: "jpg", label: "JPG Image" },
        { value: "png", label: "PNG Image" },
        { value: "pdf", label: "PDF Document" },
      ],
    },
  ],
  "application/pdf": [
    {
      label: "Document Formats",
      formats: [
        { value: "txt", label: "Plain Text (.txt)" },
      ],
    },
  ],
};

const getDefaultFormat = (mimeType: string): string => {
  const opts = conversionOptions[mimeType];
  return opts?.[0]?.formats[0]?.value || "pdf";
};

export default function ConvertPage() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [globalFormat, setGlobalFormat] = useState("pdf");
  const { toast } = useToast();

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newItems: FileItem[] = acceptedFiles.map((f) => ({
        id: Math.random().toString(36).slice(2),
        file: f,
        status: "idle",
        progress: 0,
        originalSize: f.size,
      }));
      setFiles((prev) => [...prev, ...newItems]);
    },
    []
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 10,
    maxSize: 500 * 1024 * 1024,
  });

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const convertFile = async (item: FileItem) => {
    setFiles((prev) =>
      prev.map((f) =>
        f.id === item.id ? { ...f, status: "converting", progress: 10 } : f
      )
    );

    const format = globalFormat;

    try {
      const formData = new FormData();
      formData.append("file", item.file);
      formData.append("outputFormat", format);

      // Progress animation
      const progressInterval = setInterval(() => {
        setFiles((prev) =>
          prev.map((f) =>
            f.id === item.id && f.status === "converting"
              ? { ...f, progress: Math.min(f.progress + 15, 85) }
              : f
          )
        );
      }, 300);

      const res = await fetch("/api/convert", {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Conversion failed");
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const contentDisposition = res.headers.get("Content-Disposition") || "";
      const filename =
        contentDisposition.match(/filename="([^"]+)"/)?.[1] ||
        `converted.${format}`;

      setFiles((prev) =>
        prev.map((f) =>
          f.id === item.id
            ? {
                ...f,
                status: "done",
                progress: 100,
                outputUrl: url,
                outputFilename: filename,
                outputSize: blob.size,
              }
            : f
        )
      );
    } catch (err: any) {
      setFiles((prev) =>
        prev.map((f) =>
          f.id === item.id
            ? { ...f, status: "error", progress: 0, error: err.message }
            : f
        )
      );
      toast({ title: "Conversion failed", description: err.message, variant: "destructive" });
    }
  };

  const convertAll = () => {
    const pending = files.filter((f) => f.status === "idle");
    pending.forEach((f) => convertFile(f));
  };

  const downloadFile = (item: FileItem) => {
    if (!item.outputUrl || !item.outputFilename) return;
    const a = document.createElement("a");
    a.href = item.outputUrl;
    a.download = item.outputFilename;
    a.click();
  };

  return (
    <main className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-5xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ fontFamily: "Syne, sans-serif" }}
          >
            File <span className="gradient-text">Converter</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Convert files between 50+ formats. Fast, free, and secure.
            No file size limits on Pro.
          </p>
        </div>

        {/* Settings Bar */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-6 p-4 rounded-xl border bg-card">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium whitespace-nowrap">Convert to:</span>
            <Select value={globalFormat} onValueChange={setGlobalFormat}>
              <SelectTrigger className="w-52">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Images</SelectLabel>
                  <SelectItem value="jpg">JPG Image</SelectItem>
                  <SelectItem value="png">PNG Image</SelectItem>
                  <SelectItem value="webp">WEBP Image</SelectItem>
                  <SelectItem value="pdf">PDF Document</SelectItem>
                </SelectGroup>
                <SelectGroup>
                  <SelectLabel>Documents</SelectLabel>
                  <SelectItem value="txt">Plain Text (.txt)</SelectItem>
                  <SelectItem value="docx">Word (.docx)</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {files.some((f) => f.status === "idle") && (
            <Button
              onClick={convertAll}
              className="gradient-bg text-white hover:opacity-90 gap-2"
            >
              <Zap className="w-4 h-4" />
              Convert All ({files.filter((f) => f.status === "idle").length})
            </Button>
          )}
        </div>

        {/* Drop Zone */}
        <div
          {...getRootProps()}
          className={`upload-zone mb-6 ${isDragActive ? "active" : ""}`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-3">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${isDragActive ? "gradient-bg" : "bg-muted"}`}>
              <Plus className={`w-7 h-7 ${isDragActive ? "text-white" : "text-muted-foreground"}`} />
            </div>
            <div className="text-center">
              <p className="font-medium">
                {isDragActive ? "Drop files here" : "Add files to convert"}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                PDF, Word, Excel, Images — up to 50MB each
              </p>
            </div>
          </div>
        </div>

        {/* File List */}
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-3"
          >
            {files.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-4 p-4 rounded-xl border bg-card"
              >
                {/* File Icon */}
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 text-muted-foreground" />
                </div>

                {/* File Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{item.file.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <p className="text-xs text-muted-foreground">
                      {formatBytes(item.originalSize || 0)}
                    </p>
                    {item.status === "done" && item.outputSize && (
                      <>
                        <ArrowRight className="w-3 h-3 text-muted-foreground" />
                        <p className="text-xs text-muted-foreground">
                          {formatBytes(item.outputSize)}
                        </p>
                      </>
                    )}
                  </div>
                  {item.status === "converting" && (
                    <Progress value={item.progress} className="h-1 mt-2" />
                  )}
                  {item.error && (
                    <p className="text-xs text-destructive mt-1">{item.error}</p>
                  )}
                </div>

                {/* Status + Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  {item.status === "idle" && (
                    <Button
                      size="sm"
                      onClick={() => convertFile(item)}
                      className="h-8 gradient-bg text-white text-xs"
                    >
                      Convert
                    </Button>
                  )}
                  {item.status === "converting" && (
                    <RefreshCw className="w-4 h-4 animate-spin text-primary" />
                  )}
                  {item.status === "done" && (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 text-xs gap-1"
                        onClick={() => downloadFile(item)}
                      >
                        <Download className="w-3.5 h-3.5" /> Download
                      </Button>
                    </>
                  )}
                  {item.status === "error" && (
                    <Badge variant="destructive" className="text-xs">Error</Badge>
                  )}
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7"
                    onClick={() => removeFile(item.id)}
                  >
                    <X className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {files.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-sm">No files added yet. Drop files above to get started.</p>
          </div>
        )}
      </div>
    </main>
  );
}

// Missing import
function Zap({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

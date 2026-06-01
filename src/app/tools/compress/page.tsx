"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Archive, Download, CheckCircle2, RefreshCw, Target } from "lucide-react";
import { useToast } from "@/lib/hooks/use-toast";
import { formatBytes } from "@/lib/utils";

type CompressState = "idle" | "compressing" | "done" | "error";

export default function CompressPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [state, setState] = useState<CompressState>("idle");
  const [progress, setProgress] = useState(0);
  const [targetMB, setTargetMB] = useState<number>(1);
  const [results, setResults] = useState<{
    originalSize: number;
    compressedSize: number;
    savedBytes: number;
    savedPercent: string;
    url: string;
    filename: string;
  } | null>(null);
  const { toast } = useToast();

  const onDrop = useCallback((files: File[]) => {
    const f = files[0];
    if (!f) return;
    setFile(f);
    setState("idle");
    setResults(null);
    // Set default target to ~50% of original size
    const defaultTarget = Math.max(0.1, parseFloat((f.size / 1024 / 1024 / 2).toFixed(1)));
    setTargetMB(defaultTarget);
    if (f.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(f);
    } else {
      setPreview(null);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [], "image/png": [], "image/webp": [], "application/pdf": [],
    },
    maxFiles: 1,
    maxSize: 500 * 1024 * 1024,
  });

  const fileSizeMB = file ? file.size / 1024 / 1024 : 100;
  const maxSlider = Math.max(1, Math.ceil(fileSizeMB * 0.95));

  const handleCompress = async () => {
    if (!file) return;
    setState("compressing");
    setProgress(0);

    const progressInterval = setInterval(() => {
      setProgress((p) => Math.min(p + 15, 90));
    }, 400);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("targetMB", targetMB.toString());

      const res = await fetch("/api/compress", { method: "POST", body: formData });
      clearInterval(progressInterval);

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Compression failed");
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      const originalSize = parseInt(res.headers.get("X-Original-Size") || "0");
      const compressedSize = parseInt(res.headers.get("X-Compressed-Size") || "0");
      const savedBytes = parseInt(res.headers.get("X-Saved-Bytes") || "0");
      const savedPercent = res.headers.get("X-Saved-Percent") || "0";
      const contentDisposition = res.headers.get("Content-Disposition") || "";
      const filename = contentDisposition.match(/filename="([^"]+)"/)?.[1] || "compressed-file";

      setProgress(100);
      setResults({ originalSize, compressedSize, savedBytes, savedPercent, url, filename });
      setState("done");
      toast({ title: `Compressed by ${savedPercent}%!`, description: `Saved ${formatBytes(savedBytes)}` });
    } catch (err: any) {
      clearInterval(progressInterval);
      setState("error");
      toast({ title: "Compression failed", description: err.message, variant: "destructive" });
    }
  };

  const handleDownload = () => {
    if (!results) return;
    const a = document.createElement("a");
    a.href = results.url;
    a.download = results.filename;
    a.click();
  };

  return (
    <main className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: "Syne, sans-serif" }}>
            File <span className="gradient-text">Compressor</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Set your target file size and we'll compress it to fit. Supports PDF, JPG, PNG, WEBP.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div
              {...getRootProps()}
              className={`upload-zone min-h-[240px] flex flex-col items-center justify-center ${isDragActive ? "active" : ""}`}
            >
              <input {...getInputProps()} />
              {preview ? (
                <div className="space-y-3 w-full text-center">
                  <img src={preview} alt="Preview" className="max-h-40 mx-auto object-contain rounded-lg border" />
                  <p className="text-sm font-medium">{file?.name}</p>
                  <p className="text-xs text-muted-foreground">{formatBytes(file?.size || 0)}</p>
                </div>
              ) : file ? (
                <div className="text-center space-y-2">
                  <Archive className="w-12 h-12 mx-auto text-orange-500" />
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-muted-foreground">{formatBytes(file.size)}</p>
                </div>
              ) : (
                <div className="text-center space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mx-auto">
                    <Archive className="w-7 h-7 text-orange-500" />
                  </div>
                  <p className="font-medium">Drop file to compress</p>
                  <p className="text-sm text-muted-foreground">PDF, JPG, PNG, WEBP — up to 500MB</p>
                </div>
              )}
            </div>

            {/* Target Size Slider */}
            <div className="rounded-xl border bg-card p-5 space-y-5">
              <h3 className="font-semibold flex items-center gap-2">
                <Target className="w-4 h-4" /> Target File Size
              </h3>
              <div className="space-y-4">
                {/* Big size display */}
                <div className="text-center">
                  <span className="text-5xl font-bold gradient-text">{targetMB < 1 ? targetMB.toFixed(1) : targetMB % 1 === 0 ? targetMB : targetMB.toFixed(1)}</span>
                  <span className="text-2xl font-semibold text-muted-foreground ml-2">MB</span>
                </div>

                <Slider
                  value={[targetMB]}
                  onValueChange={(val) => setTargetMB(parseFloat(val[0].toFixed(1)))}
                  min={0.1}
                  max={maxSlider}
                  step={0.1}
                  disabled={!file}
                  className="cursor-pointer"
                />

                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0.1 MB</span>
                  {file && <span className="text-primary font-medium">Original: {fileSizeMB.toFixed(1)} MB</span>}
                  <span>{maxSlider} MB</span>
                </div>

                {file && (
                  <p className="text-xs text-center text-muted-foreground">
                    Target is {((targetMB / fileSizeMB) * 100).toFixed(0)}% of original size
                  </p>
                )}
              </div>

              <Button
                onClick={handleCompress}
                disabled={!file || state === "compressing"}
                className="w-full gradient-bg text-white hover:opacity-90 h-11 gap-2"
              >
                {state === "compressing" ? (
                  <><RefreshCw className="w-4 h-4 animate-spin" /> Compressing...</>
                ) : (
                  <><Archive className="w-4 h-4" /> Compress to {targetMB} MB</>
                )}
              </Button>

              {state === "compressing" && (
                <div className="space-y-1.5">
                  <Progress value={progress} className="h-2" />
                  <p className="text-xs text-center text-muted-foreground">{Math.round(progress)}%</p>
                </div>
              )}
            </div>
          </div>

          {/* Results */}
          <div>
            {results ? (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <div className="rounded-xl border bg-green-50 dark:bg-green-900/10 border-green-200 p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                    <div>
                      <p className="font-semibold">Compressed successfully!</p>
                      <p className="text-sm text-muted-foreground">Saved {results.savedPercent}% of file size</p>
                    </div>
                    <Badge className="ml-auto text-lg px-3 py-1 bg-green-500 text-white">
                      -{results.savedPercent}%
                    </Badge>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="rounded-lg bg-background p-3">
                      <p className="text-xs text-muted-foreground mb-1">Original</p>
                      <p className="font-bold text-sm">{formatBytes(results.originalSize)}</p>
                    </div>
                    <div className="flex items-center justify-center text-muted-foreground">→</div>
                    <div className="rounded-lg bg-background p-3">
                      <p className="text-xs text-muted-foreground mb-1">Compressed</p>
                      <p className="font-bold text-sm text-green-600">{formatBytes(results.compressedSize)}</p>
                    </div>
                  </div>

                  <div className="mt-3 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 rounded-full transition-all duration-1000"
                      style={{ width: `${100 - parseFloat(results.savedPercent)}%` }}
                    />
                  </div>
                </div>

                <Button onClick={handleDownload} className="w-full h-11 gradient-bg text-white gap-2">
                  <Download className="w-4 h-4" /> Download Compressed File
                </Button>
              </motion.div>
            ) : (
              <div className="rounded-xl border bg-card h-full min-h-[400px] flex items-center justify-center">
                <div className="text-center space-y-3 p-8">
                  <div className="w-16 h-16 rounded-2xl bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center mx-auto">
                    <Archive className="w-8 h-8 text-orange-400" />
                  </div>
                  <p className="text-muted-foreground font-medium">
                    {state === "error" ? "Compression failed. Try again." : "Results will appear here"}
                  </p>
                  <p className="text-sm text-muted-foreground">Upload a file and set your target size</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

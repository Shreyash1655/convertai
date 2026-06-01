"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Upload,
  Cpu,
  Download,
  FileText,
  Copy,
  CheckCircle2,
  Sparkles,
  Globe,
  RefreshCw,
} from "lucide-react";
import { useToast } from "@/lib/hooks/use-toast";

const languages = [
  { value: "eng", label: "English" },
  { value: "hin", label: "Hindi (हिंदी)" },
  { value: "mar", label: "Marathi (मराठी)" },
  { value: "fra", label: "French" },
  { value: "deu", label: "German" },
  { value: "spa", label: "Spanish" },
  { value: "chi_sim", label: "Chinese (Simplified)" },
  { value: "jpn", label: "Japanese" },
  { value: "ara", label: "Arabic" },
  { value: "por", label: "Portuguese" },
];

const outputFormats = [
  { value: "txt", label: "Plain Text (.txt)" },
  { value: "docx", label: "Word Document (.docx)" },
  { value: "pdf", label: "PDF Document (.pdf)" },
];

type OcrState = "idle" | "uploading" | "processing" | "done" | "error";

export default function OcrPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [state, setState] = useState<OcrState>("idle");
  const [progress, setProgress] = useState(0);
  const [extractedText, setExtractedText] = useState("");
  const [confidence, setConfidence] = useState(0);
  const [language, setLanguage] = useState("eng");
  const [outputFormat, setOutputFormat] = useState("docx");
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const f = acceptedFiles[0];
    if (!f) return;
    setFile(f);
    setState("idle");
    setExtractedText("");

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
      "image/*": [".jpg", ".jpeg", ".png", ".webp", ".bmp", ".tiff"],
      "application/pdf": [".pdf"],
    },
    maxFiles: 1,
    maxSize: 20 * 1024 * 1024,
  });

  const handleOCR = async () => {
    if (!file) return;

    setState("processing");
    setProgress(0);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress((p) => {
        if (p >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return p + Math.random() * 15;
      });
    }, 400);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("language", language);
      formData.append("outputFormat", outputFormat);

      const res = await fetch("/api/ocr", {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "OCR failed");
      }

      const data = await res.json();
      setProgress(100);
      setExtractedText(data.text || "");
      setConfidence(data.confidence || 0);
      setState("done");

      toast({
        title: "Text extracted successfully!",
        description: `Confidence: ${Math.round(data.confidence || 0)}%`,
      });
    } catch (err: any) {
      clearInterval(progressInterval);
      setState("error");
      toast({
        title: "OCR Failed",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(extractedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = async () => {
    if (!file || !extractedText) return;

    const res = await fetch("/api/ocr/download", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: extractedText, format: outputFormat, filename: file.name }),
    });

    if (!res.ok) return;
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ocr-result.${outputFormat}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-3 py-1 rounded-full text-sm font-medium mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Groq AI Powered
          </div>
          <h1
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ fontFamily: "Syne, sans-serif" }}
          >
            AI OCR –{" "}
            <span className="gradient-text">Image to Text</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Extract text from images, scanned PDFs, and photos. AI-powered for
            accuracy. Supports 50+ languages including Hindi and Marathi.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Upload + Settings */}
          <div className="space-y-6">
            {/* Upload */}
            <div
              {...getRootProps()}
              className={`upload-zone min-h-[280px] flex flex-col items-center justify-center ${isDragActive ? "active" : ""}`}
            >
              <input {...getInputProps()} />
              {preview ? (
                <div className="space-y-4 w-full">
                  <img
                    src={preview}
                    alt="Preview"
                    className="max-h-48 mx-auto object-contain rounded-lg border"
                  />
                  <p className="text-sm text-center font-medium">{file?.name}</p>
                  <p className="text-xs text-center text-muted-foreground">
                    Click or drop to change
                  </p>
                </div>
              ) : file ? (
                <div className="text-center space-y-2">
                  <FileText className="w-12 h-12 mx-auto text-primary" />
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              ) : (
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mx-auto">
                    <Cpu className="w-8 h-8 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium">Upload image or scanned PDF</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      JPG, PNG, WEBP, PDF — up to 20MB
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Settings */}
            <div className="rounded-xl border bg-card p-5 space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Globe className="w-4 h-4" /> OCR Settings
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Language</label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((l) => (
                        <SelectItem key={l.value} value={l.value}>
                          {l.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Output Format</label>
                  <Select value={outputFormat} onValueChange={setOutputFormat}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {outputFormats.map((f) => (
                        <SelectItem key={f.value} value={f.value}>
                          {f.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                onClick={handleOCR}
                disabled={!file || state === "processing"}
                className="w-full gradient-bg text-white hover:opacity-90 h-11"
              >
                {state === "processing" ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Extracting Text...
                  </>
                ) : (
                  <>
                    <Cpu className="w-4 h-4 mr-2" />
                    Extract Text with AI
                  </>
                )}
              </Button>

              {state === "processing" && (
                <div className="space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Processing...</span>
                    <span className="font-medium">{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              )}
            </div>
          </div>

          {/* Right: Results */}
          <div className="space-y-4">
            {state === "done" ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                {/* Confidence */}
                <div className="rounded-xl border bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800 p-4 flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                  <div>
                    <p className="font-medium text-sm">Text extracted successfully</p>
                    <p className="text-xs text-muted-foreground">
                      Confidence: {Math.round(confidence)}% · {extractedText.split(" ").length} words
                    </p>
                  </div>
                  <Badge className="ml-auto" variant="secondary">
                    {Math.round(confidence)}%
                  </Badge>
                </div>

                {/* Text Output */}
                <div className="rounded-xl border bg-card">
                  <div className="flex items-center justify-between p-3 border-b">
                    <span className="text-sm font-medium">Extracted Text</span>
                    <Button size="sm" variant="ghost" onClick={handleCopy} className="h-7 gap-1.5">
                      {copied ? (
                        <><CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> Copied!</>
                      ) : (
                        <><Copy className="w-3.5 h-3.5" /> Copy</>
                      )}
                    </Button>
                  </div>
                  <textarea
                    value={extractedText}
                    onChange={(e) => setExtractedText(e.target.value)}
                    className="w-full h-80 p-4 text-sm font-mono bg-transparent resize-none outline-none"
                    placeholder="Extracted text will appear here..."
                  />
                </div>

                {/* Download */}
                <Button
                  onClick={handleDownload}
                  className="w-full h-11 gradient-bg text-white hover:opacity-90 gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download as {outputFormat.toUpperCase()}
                </Button>
              </motion.div>
            ) : (
              <div className="rounded-xl border bg-card h-full min-h-[400px] flex items-center justify-center">
                <div className="text-center space-y-4 p-8">
                  <div className="w-20 h-20 rounded-2xl gradient-bg-soft flex items-center justify-center mx-auto">
                    <FileText className="w-10 h-10 text-primary/60" />
                  </div>
                  <p className="font-medium text-muted-foreground">
                    {state === "error"
                      ? "Extraction failed. Try again."
                      : "Upload an image to extract text"}
                  </p>
                  <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                    AI will detect text, preserve formatting, and output an editable document
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

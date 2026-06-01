"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Upload,
  Zap,
  ArrowRight,
  FileText,
  Image,
  FileSpreadsheet,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

const floatingFiles = [
  { icon: FileText, label: "PDF", color: "bg-red-100 text-red-600", delay: 0 },
  { icon: Image, label: "JPG", color: "bg-blue-100 text-blue-600", delay: 0.5 },
  { icon: FileSpreadsheet, label: "XLSX", color: "bg-green-100 text-green-600", delay: 1 },
  { icon: FileText, label: "DOCX", color: "bg-purple-100 text-purple-600", delay: 1.5 },
];

const stats = [
  { value: "50+", label: "File Formats" },
  { value: "10M+", label: "Files Processed" },
  { value: "99.9%", label: "Uptime" },
  { value: "< 2s", label: "Avg. Convert Time" },
];

export function HeroSection() {
  const [isDragActive, setIsDragActive] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      window.location.href = `/tools/convert?file=${encodeURIComponent(acceptedFiles[0].name)}`;
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
    maxFiles: 10,
  });

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] opacity-30 blur-3xl"
          style={{ background: "radial-gradient(ellipse, #4F46E5 0%, #7C3AED 40%, transparent 70%)" }} />
        <div className="absolute bottom-0 right-0 w-[500px] h-[400px] opacity-20 blur-3xl"
          style={{ background: "radial-gradient(ellipse, #EC4899 0%, transparent 70%)" }} />
      </div>

      {/* Grid pattern */}
      <div className="absolute inset-0 -z-10 opacity-[0.02] dark:opacity-[0.05]"
        style={{
          backgroundImage: "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }} />

      <div className="container mx-auto px-4 max-w-7xl py-20">
        <div className="flex flex-col items-center text-center gap-8">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge
              variant="secondary"
              className="gap-2 px-4 py-1.5 text-sm font-medium border"
            >
              <Sparkles className="w-3.5 h-3.5 text-yellow-500" />
              Powered by Groq AI — Ultra-fast processing
            </Badge>
          </motion.div>

          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="max-w-4xl"
          >
            <h1
              className="text-5xl md:text-7xl font-bold tracking-tight leading-tight"
              style={{ fontFamily: "Syne, sans-serif" }}
            >
              Convert Any File{" "}
              <span className="gradient-text">With AI</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              The all-in-one platform for file conversion, AI OCR, document scanning,
              and compression. 50+ formats. Lightning fast. No limits on Pro.
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <Link href="/tools/convert">
              <Button size="lg" className="gradient-bg text-white h-12 px-8 text-base hover:opacity-90 gap-2">
                <Zap className="w-4 h-4" /> Start Converting Free
              </Button>
            </Link>
            <Link href="/#features">
              <Button size="lg" variant="outline" className="h-12 px-8 text-base gap-2">
                See All Features <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </motion.div>

          {/* Feature Pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="flex flex-wrap gap-2 justify-center"
          >
            {["No signup required", "50+ formats", "AI-powered OCR", "Mobile-friendly", "100% secure"].map((f) => (
              <div key={f} className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                {f}
              </div>
            ))}
          </motion.div>

          {/* Drop Zone */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="w-full max-w-2xl"
          >
            <div
              {...getRootProps()}
              className={`upload-zone ${isDragActive ? "active" : ""} transition-all`}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center gap-4">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${isDragActive ? "gradient-bg scale-110" : "bg-muted"}`}>
                  <Upload className={`w-7 h-7 ${isDragActive ? "text-white" : "text-muted-foreground"}`} />
                </div>
                <div>
                  <p className="text-base font-medium">
                    {isDragActive ? "Drop your files here!" : "Drop files here or click to upload"}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Supports PDF, Word, Excel, Images — up to 10MB free
                  </p>
                </div>
                <Button size="sm" variant="secondary" className="pointer-events-none">
                  Choose Files
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-4 border-t w-full max-w-2xl"
          >
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl font-bold" style={{ fontFamily: "Syne, sans-serif" }}>
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

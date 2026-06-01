"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Image, Download, RefreshCw, Crop, Contrast, Sun, Droplets } from "lucide-react";
import { useToast } from "@/lib/hooks/use-toast";

export default function ImageToolsPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const { toast } = useToast();

  const onDrop = useCallback((files: File[]) => {
    const f = files[0];
    if (!f) return;
    setFile(f);
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(f);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpg", ".jpeg", ".png", ".webp"] },
    maxFiles: 1,
    maxSize: 20 * 1024 * 1024,
  });

  const filterStyle = {
    filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`,
  };

  const handleDownload = async () => {
    if (!preview) return;
    const canvas = document.createElement("canvas");
    const img = new window.Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d")!;
      ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;
      ctx.drawImage(img, 0, 0);
      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `edited-${file?.name || "image.jpg"}`;
        a.click();
        URL.revokeObjectURL(url);
      }, "image/jpeg", 0.95);
    };
    img.src = preview;
    toast({ title: "Image downloaded!" });
  };

  return (
    <main className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: "Syne, sans-serif" }}>
            Image <span className="gradient-text">Tools</span>
          </h1>
          <p className="text-lg text-muted-foreground">Adjust brightness, contrast, and saturation. Export in any format.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Preview */}
          <div>
            {preview ? (
              <div className="rounded-2xl overflow-hidden border bg-card">
                <img src={preview} alt="Preview" style={filterStyle} className="w-full object-contain max-h-96" />
              </div>
            ) : (
              <div {...getRootProps()} className={`upload-zone min-h-[320px] flex flex-col items-center justify-center ${isDragActive ? "active" : ""}`}>
                <input {...getInputProps()} />
                <div className="w-14 h-14 rounded-2xl bg-pink-100 dark:bg-pink-900/20 flex items-center justify-center mb-4">
                  <Image className="w-7 h-7 text-pink-500" />
                </div>
                <p className="font-medium">Upload an image</p>
                <p className="text-sm text-muted-foreground mt-1">JPG, PNG, WEBP — up to 20MB</p>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="space-y-6">
            {file && (
              <div {...getRootProps()} className="rounded-xl border border-dashed p-3 text-center text-sm text-muted-foreground cursor-pointer hover:bg-muted/30 transition-colors">
                <input {...getInputProps()} />
                Click to change image
              </div>
            )}

            <div className="rounded-xl border bg-card p-5 space-y-6">
              <h3 className="font-semibold">Adjustments</h3>

              {[
                { label: "Brightness", icon: Sun, value: brightness, setter: setBrightness, min: 0, max: 200 },
                { label: "Contrast", icon: Contrast, value: contrast, setter: setContrast, min: 0, max: 200 },
                { label: "Saturation", icon: Droplets, value: saturation, setter: setSaturation, min: 0, max: 300 },
              ].map(({ label, icon: Icon, value, setter, min, max }) => (
                <div key={label} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-muted-foreground" />
                      <span>{label}</span>
                    </div>
                    <span className="font-mono text-xs bg-muted px-2 py-0.5 rounded">{value}%</span>
                  </div>
                  <Slider value={[value]} onValueChange={(v) => setter(v[0])} min={min} max={max} step={1} />
                </div>
              ))}

              <Button
                onClick={() => { setBrightness(100); setContrast(100); setSaturation(100); }}
                variant="outline"
                size="sm"
                className="w-full gap-2"
              >
                <RefreshCw className="w-4 h-4" /> Reset Adjustments
              </Button>
            </div>

            <Button
              onClick={handleDownload}
              disabled={!preview}
              className="w-full h-11 gradient-bg text-white hover:opacity-90 gap-2"
            >
              <Download className="w-4 h-4" /> Download Edited Image
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}

"use client";
import { motion } from "framer-motion";
import { FileText, Image, FileSpreadsheet, Presentation, Archive } from "lucide-react";

const categories = [
  {
    label: "Documents",
    icon: FileText,
    color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
    formats: ["PDF", "DOCX", "TXT", "HTML", "ODT"],
  },
  {
    label: "Images",
    icon: Image,
    color: "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
    formats: ["JPG", "PNG", "WEBP", "SVG", "GIF"],
  },
  {
    label: "Spreadsheets",
    icon: FileSpreadsheet,
    color: "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
    formats: ["XLSX", "CSV", "ODS", "XLS"],
  },
  {
    label: "Presentations",
    icon: Archive,
    color: "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
    formats: ["PPTX", "PPT", "ODP"],
  },
];

export function FormatsSection() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4" style={{ fontFamily: "Syne, sans-serif" }}>
            50+ <span className="gradient-text">Supported Formats</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Convert between all major file formats instantly
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl border bg-card p-6"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${cat.color}`}>
                <cat.icon className="w-6 h-6" />
              </div>
              <h3 className="font-bold mb-3" style={{ fontFamily: "Syne, sans-serif" }}>{cat.label}</h3>
              <div className="flex flex-wrap gap-2">
                {cat.formats.map((fmt) => (
                  <span key={fmt} className="px-2 py-0.5 bg-muted rounded text-xs font-mono font-medium">
                    {fmt}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

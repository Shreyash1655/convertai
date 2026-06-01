"use client";

import { motion } from "framer-motion";
import {
  FileText,
  Cpu,
  ScanLine,
  Archive,
  Zap,
  Shield,
  Globe,
  Layers,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: FileText,
    title: "Universal File Converter",
    description:
      "Convert between 50+ formats. PDF ↔ Word, Excel, PowerPoint, images and more. Batch convert multiple files simultaneously.",
    href: "/tools/convert",
    color: "from-blue-500/20 to-blue-600/5",
    iconColor: "text-blue-500",
    highlights: ["PDF, Word, Excel, PPT", "Batch conversion", "Preserve formatting"],
  },
  {
    icon: Cpu,
    title: "AI OCR – Image to Text",
    description:
      "Extract text from images, scanned PDFs, and photos with AI. Preserve formatting, tables, and structure. Supports English, Hindi, Marathi + 50 languages.",
    href: "/tools/ocr",
    color: "from-purple-500/20 to-purple-600/5",
    iconColor: "text-purple-500",
    highlights: ["Groq AI powered", "50+ languages", "Tables & formatting"],
    badge: "AI Powered",
  },
  {
    icon: ScanLine,
    title: "Document Scanner",
    description:
      "Turn your camera into a professional scanner. Auto edge detection, perspective correction, shadow removal, and multi-page PDF export.",
    href: "/tools/scanner",
    color: "from-green-500/20 to-green-600/5",
    iconColor: "text-green-500",
    highlights: ["Auto edge detection", "Perspective fix", "Multi-page PDF"],
  },
  {
    icon: Archive,
    title: "Smart Compression",
    description:
      "Reduce file sizes without losing quality. Compress PDFs, images, and Word documents. See before/after size comparison instantly.",
    href: "/tools/compress",
    color: "from-orange-500/20 to-orange-600/5",
    iconColor: "text-orange-500",
    highlights: ["Up to 90% reduction", "Quality control", "Before/after preview"],
  },
  {
    icon: Layers,
    title: "PDF Tools Suite",
    description:
      "Complete PDF toolkit. Merge, split, rotate pages, add passwords, remove watermarks, and reorder pages — all in your browser.",
    href: "/tools/pdf-tools",
    color: "from-red-500/20 to-red-600/5",
    iconColor: "text-red-500",
    highlights: ["Merge & split", "Password protect", "Page reorder"],
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description:
      "Groq-powered AI processing ensures sub-second response times. Queue-based architecture handles millions of files reliably.",
    href: "/#pricing",
    color: "from-yellow-500/20 to-yellow-600/5",
    iconColor: "text-yellow-500",
    highlights: ["< 2s avg process", "Redis queue", "99.9% uptime"],
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 relative">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">
            Everything you need
          </p>
          <h2
            className="text-4xl md:text-5xl font-bold"
            style={{ fontFamily: "Syne, sans-serif" }}
          >
            Powerful Tools,{" "}
            <span className="gradient-text">Simple Interface</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            From quick conversions to complex OCR pipelines — ConvertAI handles
            it all with speed and precision.
          </p>
        </motion.div>

        {/* Feature Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature) => (
            <motion.div key={feature.title} variants={itemVariants}>
              <Link href={feature.href} className="group block h-full">
                <div
                  className={`feature-card h-full bg-gradient-to-br ${feature.color} border group-hover:border-primary/30`}
                >
                  {/* Icon + Badge */}
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-background border`}>
                      <feature.icon className={`w-6 h-6 ${feature.iconColor}`} />
                    </div>
                    {feature.badge && (
                      <span className="badge-pro">{feature.badge}</span>
                    )}
                  </div>

                  {/* Content */}
                  <h3 className="font-bold text-lg mb-2" style={{ fontFamily: "Syne, sans-serif" }}>
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    {feature.description}
                  </p>

                  {/* Highlights */}
                  <ul className="space-y-1.5 mb-4">
                    {feature.highlights.map((h) => (
                      <li key={h} className="flex items-center gap-2 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full gradient-bg" />
                        {h}
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <div className="flex items-center gap-1 text-sm font-medium text-primary group-hover:gap-2 transition-all">
                    Try it free <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground"
        >
          {[
            { icon: Shield, text: "Bank-grade security" },
            { icon: Globe, text: "50+ languages" },
            { icon: Zap, text: "Groq-powered AI" },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-2">
              <Icon className="w-4 h-4" />
              {text}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

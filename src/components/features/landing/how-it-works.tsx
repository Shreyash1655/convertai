"use client";
import { motion } from "framer-motion";
import { Upload, Cpu, Download } from "lucide-react";

const steps = [
  { icon: Upload, title: "1. Upload", desc: "Drag & drop or choose your file. Any format, any size (up to plan limit).", color: "bg-blue-100 text-blue-600" },
  { icon: Cpu, title: "2. AI Processes", desc: "Groq AI converts, compresses, or extracts text — in under 2 seconds.", color: "bg-purple-100 text-purple-600" },
  { icon: Download, title: "3. Download", desc: "Instantly download your converted file. No email required.", color: "bg-green-100 text-green-600" },
];

export function HowItWorksSection() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4 max-w-5xl">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <h2 className="text-4xl font-bold" style={{ fontFamily: "Syne, sans-serif" }}>
            How It <span className="gradient-text">Works</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">Convert any file in 3 simple steps</p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <motion.div key={step.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center space-y-4">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto ${step.color}`}>
                <step.icon className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-lg" style={{ fontFamily: "Syne, sans-serif" }}>{step.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

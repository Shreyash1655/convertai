"use client";
import { motion } from "framer-motion";
import { Star, ArrowRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const testimonials = [
  { name: "Priya Sharma", role: "Content Manager", text: "ConvertAI saved me hours of work. The OCR is incredibly accurate for Hindi documents!", avatar: "PS" },
  { name: "Rahul Mehta", role: "Freelance Designer", text: "Best file converter I've used. Lightning fast and the batch conversion feature is a game changer.", avatar: "RM" },
  { name: "Sarah Johnson", role: "Legal Assistant", text: "The PDF tools are excellent. I use the merger and compressor daily for client documents.", avatar: "SJ" },
  { name: "Aditya Patil", role: "Student", text: "Free plan is super generous. Converted 50+ documents for my thesis without paying a rupee.", avatar: "AP" },
];

const faqs = [
  { q: "Is ConvertAI free to use?", a: "Yes! Our free plan includes 10 conversions per day with up to 10MB file size. No credit card required." },
  { q: "What file formats do you support?", a: "We support 50+ formats including PDF, Word, Excel, PowerPoint, JPG, PNG, WEBP, and many more." },
  { q: "Is my data secure?", a: "Absolutely. All files are encrypted in transit and at rest. We auto-delete uploaded files after 24 hours. We never sell your data." },
  { q: "How accurate is the OCR?", a: "Our AI OCR (powered by Groq + Tesseract) achieves 95%+ accuracy on clear images. It supports 50+ languages including Hindi and Marathi." },
  { q: "Can I use ConvertAI on mobile?", a: "Yes! ConvertAI is fully responsive and works great on mobile browsers. A dedicated mobile app is coming soon." },
  { q: "What payment methods do you accept?", a: "We accept all major credit/debit cards via Stripe, and UPI/Netbanking via Razorpay for Indian customers." },
];

export function TestimonialsSection() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <h2 className="text-4xl font-bold" style={{ fontFamily: "Syne, sans-serif" }}>
            Loved by <span className="gradient-text">10,000+ Users</span>
          </h2>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((t, i) => (
            <motion.div key={t.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="rounded-2xl border bg-card p-5 space-y-4">
              <div className="flex gap-1">{[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}</div>
              <p className="text-sm leading-relaxed text-muted-foreground">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full gradient-bg flex items-center justify-center text-white text-xs font-bold">{t.avatar}</div>
                <div>
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FaqSection() {
  return (
    <section id="faq" className="py-24">
      <div className="container mx-auto px-4 max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <h2 className="text-4xl font-bold" style={{ fontFamily: "Syne, sans-serif" }}>
            Frequently Asked <span className="gradient-text">Questions</span>
          </h2>
        </motion.div>
        <Accordion type="single" collapsible className="space-y-2">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border rounded-xl px-4">
              <AccordionTrigger className="text-sm font-medium text-left">{faq.q}</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground leading-relaxed">{faq.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

export function CtaSection() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-3xl gradient-bg p-12 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
          <h2 className="text-4xl md:text-5xl font-bold mb-4 relative" style={{ fontFamily: "Syne, sans-serif" }}>
            Start Converting for Free
          </h2>
          <p className="text-xl opacity-90 mb-8 relative">No credit card. No signup required. Just upload and convert.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center relative">
            <Link href="/tools/convert">
              <Button size="lg" variant="secondary" className="h-12 px-8 gap-2">
                <Zap className="w-4 h-4" /> Start Converting Free
              </Button>
            </Link>
            <Link href="/#pricing">
              <Button size="lg" variant="outline" className="h-12 px-8 gap-2 border-white/30 text-white hover:bg-white/10">
                View Pricing <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

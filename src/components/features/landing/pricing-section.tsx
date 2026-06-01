"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { CheckCircle2, X, Zap, Crown } from "lucide-react";
import Link from "next/link";

const plans = [
  {
    id: "free",
    name: "Free",
    monthlyPrice: 0,
    yearlyPrice: 0,
    description: "Perfect for occasional use",
    icon: Zap,
    iconColor: "text-blue-500",
    features: [
      { text: "10 conversions per day", included: true },
      { text: "10 MB file size limit", included: true },
      { text: "All format conversions", included: true },
      { text: "Basic image compression", included: true },
      { text: "AI OCR (limited)", included: false },
      { text: "Priority processing", included: false },
      { text: "API access", included: false },
      { text: "Batch conversion", included: false },
    ],
    cta: "Get Started Free",
    href: "/auth/register",
    highlighted: false,
  },
  {
    id: "pro",
    name: "Pro",
    monthlyPrice: 9,
    yearlyPrice: 7,
    description: "For professionals and teams",
    icon: Crown,
    iconColor: "text-yellow-500",
    features: [
      { text: "Unlimited conversions", included: true },
      { text: "100 MB file size limit", included: true },
      { text: "All format conversions", included: true },
      { text: "Advanced compression", included: true },
      { text: "Full AI OCR (50+ languages)", included: true },
      { text: "Priority processing", included: true },
      { text: "API access", included: true },
      { text: "Batch conversion", included: true },
    ],
    cta: "Start Pro Trial",
    href: "/auth/register?plan=pro",
    highlighted: true,
    badge: "Most Popular",
  },
];

export function PricingSection() {
  const [yearly, setYearly] = useState(false);

  return (
    <section id="pricing" className="py-24">
      <div className="container mx-auto px-4 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">Pricing</p>
          <h2
            className="text-4xl md:text-5xl font-bold"
            style={{ fontFamily: "Syne, sans-serif" }}
          >
            Simple, <span className="gradient-text">Transparent</span> Pricing
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Start free. Upgrade when you need more.
          </p>

          {/* Billing toggle */}
          <div className="flex items-center justify-center gap-3 mt-8">
            <span className={`text-sm ${!yearly ? "font-semibold" : "text-muted-foreground"}`}>Monthly</span>
            <Switch checked={yearly} onCheckedChange={setYearly} />
            <span className={`text-sm ${yearly ? "font-semibold" : "text-muted-foreground"}`}>
              Yearly
              <Badge variant="secondary" className="ml-2 text-xs">Save 22%</Badge>
            </span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative rounded-2xl border p-8 ${
                plan.highlighted
                  ? "border-primary shadow-xl shadow-primary/10 bg-card"
                  : "bg-card"
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="gradient-bg text-white px-4 py-1">
                    {plan.badge}
                  </Badge>
                </div>
              )}

              {/* Plan Header */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                    <plan.icon className={`w-5 h-5 ${plan.iconColor}`} />
                  </div>
                  <div>
                    <p className="font-bold text-lg" style={{ fontFamily: "Syne, sans-serif" }}>
                      {plan.name}
                    </p>
                    <p className="text-sm text-muted-foreground">{plan.description}</p>
                  </div>
                </div>

                <div className="flex items-end gap-1">
                  <span className="text-5xl font-bold" style={{ fontFamily: "Syne, sans-serif" }}>
                    ${yearly ? plan.yearlyPrice : plan.monthlyPrice}
                  </span>
                  <span className="text-muted-foreground mb-2">/month</span>
                </div>
                {yearly && plan.monthlyPrice > 0 && (
                  <p className="text-sm text-muted-foreground">
                    Billed annually (${plan.yearlyPrice * 12}/yr)
                  </p>
                )}
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature.text} className="flex items-center gap-3 text-sm">
                    {feature.included ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                    ) : (
                      <X className="w-4 h-4 text-muted-foreground/50 shrink-0" />
                    )}
                    <span className={feature.included ? "" : "text-muted-foreground"}>
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>

              <Link href={plan.href}>
                <Button
                  className={`w-full h-11 ${
                    plan.highlighted
                      ? "gradient-bg text-white hover:opacity-90"
                      : ""
                  }`}
                  variant={plan.highlighted ? "default" : "outline"}
                >
                  {plan.cta}
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-sm text-muted-foreground mt-8"
        >
          All plans include SSL encryption and GDPR compliance. Cancel anytime.
        </motion.p>
      </div>
    </section>
  );
}

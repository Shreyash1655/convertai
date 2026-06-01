"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Zap,
  ChevronDown,
  Sun,
  Moon,
  Menu,
  X,
  FileText,
  Image,
  Archive,
  ScanLine,
  Cpu,
} from "lucide-react";
import { cn } from "@/lib/utils";

const tools = [
  {
    icon: FileText,
    label: "File Converter",
    href: "/tools/convert",
    desc: "PDF, Word, Excel & more",
    color: "text-blue-500",
  },
  {
    icon: Cpu,
    label: "AI OCR",
    href: "/tools/ocr",
    desc: "Extract text from images",
    color: "text-purple-500",
  },
  {
    icon: ScanLine,
    label: "Document Scanner",
    href: "/tools/scanner",
    desc: "Scan & enhance documents",
    color: "text-green-500",
  },
  {
    icon: Archive,
    label: "File Compressor",
    href: "/tools/compress",
    desc: "Reduce file size",
    color: "text-orange-500",
  },
  {
    icon: Image,
    label: "Image Tools",
    href: "/tools/image-tools",
    desc: "Edit & convert images",
    color: "text-pink-500",
  },
  {
    icon: FileText,
    label: "PDF Tools",
    href: "/tools/pdf-tools",
    desc: "Merge, split, secure PDFs",
    color: "text-red-500",
  },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-background/80 backdrop-blur-xl border-b shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span
              className="font-bold text-xl"
              style={{ fontFamily: "Syne, sans-serif" }}
            >
              Convert<span className="gradient-text">AI</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-1">
                  Tools <ChevronDown className="w-3.5 h-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="w-72 p-2">
                <div className="grid grid-cols-2 gap-1">
                  {tools.map((tool) => (
                    <DropdownMenuItem key={tool.href} asChild>
                      <Link href={tool.href} className="flex items-start gap-3 p-2 rounded-lg cursor-pointer">
                        <tool.icon className={cn("w-5 h-5 mt-0.5 shrink-0", tool.color)} />
                        <div>
                          <p className="text-sm font-medium">{tool.label}</p>
                          <p className="text-xs text-muted-foreground">{tool.desc}</p>
                        </div>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
            <Link href="/#pricing">
              <Button variant="ghost" size="sm">Pricing</Button>
            </Link>
            <Link href="/#faq">
              <Button variant="ghost" size="sm">FAQ</Button>
            </Link>
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-2">
            {mounted && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                {theme === "dark" ? (
                  <Sun className="w-4 h-4" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
              </Button>
            )}
            <Link href="/auth/login" className="hidden md:block">
              <Button variant="ghost" size="sm">Log in</Button>
            </Link>
            <Link href="/auth/register">
              <Button size="sm" className="gradient-bg text-white hover:opacity-90 hidden md:flex">
                Get Started Free
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden h-8 w-8"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden border-t bg-background/95 backdrop-blur-xl"
        >
          <div className="container px-4 py-4 space-y-1">
            {tools.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                <tool.icon className={cn("w-5 h-5", tool.color)} />
                <span className="text-sm font-medium">{tool.label}</span>
              </Link>
            ))}
            <div className="pt-2 border-t flex flex-col gap-2">
              <Link href="/auth/login" onClick={() => setMobileOpen(false)}>
                <Button variant="outline" className="w-full">Log in</Button>
              </Link>
              <Link href="/auth/register" onClick={() => setMobileOpen(false)}>
                <Button className="w-full gradient-bg text-white">Get Started Free</Button>
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </header>
  );
}

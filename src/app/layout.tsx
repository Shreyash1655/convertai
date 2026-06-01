import type { Metadata } from "next";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: {
    default: "ConvertAI – AI-Powered File Conversion & OCR Platform",
    template: "%s | ConvertAI",
  },
  description:
    "Convert, compress, scan, and extract text from any file with AI. Support for PDF, Word, Excel, images and more. Free online tool.",
  keywords: [
    "file converter",
    "PDF converter",
    "OCR",
    "document scanner",
    "image to text",
    "compress PDF",
    "AI document",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: "ConvertAI",
    title: "ConvertAI – AI-Powered File Conversion & OCR Platform",
    description:
      "Convert, compress, scan, and extract text from any file with AI.",
  },
  twitter: {
    card: "summary_large_image",
    title: "ConvertAI",
    description: "AI-Powered File Conversion & OCR Platform",
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  ),
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}

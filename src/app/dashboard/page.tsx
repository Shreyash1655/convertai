"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FileText, Cpu, Archive, Clock, Download, Zap,
  TrendingUp, Plus, ChevronRight, CheckCircle2, XCircle, Loader2,
} from "lucide-react";
import { formatBytes, formatDateTime } from "@/lib/utils";

interface DashboardStats {
  conversionsToday: number;
  totalConversions: number;
  ocrScans: number;
  compressions: number;
  plan: string;
  dailyLimit: number;
}

interface RecentJob {
  id: string;
  type: string;
  status: string;
  inputFormat?: string;
  outputFormat?: string;
  createdAt: string;
  inputFile?: { originalName: string; size: number };
}

const quickActions = [
  { icon: FileText, label: "Convert File", href: "/tools/convert", color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/20" },
  { icon: Cpu, label: "OCR / Scan", href: "/tools/ocr", color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-900/20" },
  { icon: Archive, label: "Compress", href: "/tools/compress", color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-900/20" },
];

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [jobs, setJobs] = useState<RecentJob[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulated dashboard data — replace with real API calls
    setTimeout(() => {
      setStats({
        conversionsToday: 3,
        totalConversions: 47,
        ocrScans: 12,
        compressions: 8,
        plan: "FREE",
        dailyLimit: 10,
      });
      setJobs([
        { id: "1", type: "CONVERSION", status: "COMPLETED", inputFormat: "PDF", outputFormat: "DOCX", createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(), inputFile: { originalName: "report.pdf", size: 1024000 } },
        { id: "2", type: "OCR", status: "COMPLETED", createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), inputFile: { originalName: "scan.jpg", size: 512000 } },
        { id: "3", type: "COMPRESSION", status: "FAILED", createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(), inputFile: { originalName: "photo.png", size: 2048000 } },
      ]);
      setLoading(false);
    }, 800);
  }, []);

  const statusIcon = (status: string) => {
    if (status === "COMPLETED") return <CheckCircle2 className="w-4 h-4 text-green-500" />;
    if (status === "FAILED") return <XCircle className="w-4 h-4 text-red-500" />;
    return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 max-w-6xl py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold" style={{ fontFamily: "Syne, sans-serif" }}>Dashboard</h1>
            <p className="text-muted-foreground mt-1 text-sm">Welcome back! Here's your activity overview.</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant={stats?.plan === "PRO" ? "default" : "secondary"} className="px-3 py-1">
              {stats?.plan === "PRO" ? "⭐ Pro" : "Free Plan"}
            </Badge>
            {stats?.plan === "FREE" && (
              <Link href="/#pricing">
                <Button size="sm" className="gradient-bg text-white gap-1.5">
                  <Zap className="w-3.5 h-3.5" /> Upgrade
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {[
            { label: "Today's Conversions", value: `${stats?.conversionsToday}/${stats?.dailyLimit}`, icon: FileText, color: "text-blue-500" },
            { label: "Total Conversions", value: stats?.totalConversions, icon: TrendingUp, color: "text-green-500" },
            { label: "OCR Scans", value: stats?.ocrScans, icon: Cpu, color: "text-purple-500" },
            { label: "Compressions", value: stats?.compressions, icon: Archive, color: "text-orange-500" },
          ].map((stat) => (
            <Card key={stat.label} className="border-0 shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <p className="text-2xl font-bold" style={{ fontFamily: "Syne, sans-serif" }}>{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="space-y-4">
            <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Quick Actions</h2>
            <div className="space-y-2">
              {quickActions.map((action) => (
                <Link key={action.href} href={action.href}>
                  <div className="flex items-center gap-4 p-4 rounded-xl border bg-card hover:border-primary/30 hover:shadow-sm transition-all cursor-pointer group">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${action.bg}`}>
                      <action.icon className={`w-5 h-5 ${action.color}`} />
                    </div>
                    <span className="font-medium text-sm flex-1">{action.label}</span>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </div>
                </Link>
              ))}
            </div>

            {/* Daily Usage Bar */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-5">
                <p className="text-sm font-medium mb-3">Daily Usage</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{stats?.conversionsToday} used</span>
                    <span>{stats?.dailyLimit} limit</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full gradient-bg transition-all"
                      style={{ width: `${((stats?.conversionsToday || 0) / (stats?.dailyLimit || 10)) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {(stats?.dailyLimit || 10) - (stats?.conversionsToday || 0)} conversions remaining today
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Jobs */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Recent Activity</h2>
              <Link href="/dashboard/history">
                <Button variant="ghost" size="sm" className="text-xs gap-1">
                  View all <ChevronRight className="w-3 h-3" />
                </Button>
              </Link>
            </div>

            <Card className="border-0 shadow-sm">
              <CardContent className="p-0">
                {jobs.length === 0 ? (
                  <div className="text-center py-12">
                    <Clock className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">No conversions yet.</p>
                    <Link href="/tools/convert">
                      <Button size="sm" className="mt-4 gradient-bg text-white gap-1.5">
                        <Plus className="w-3.5 h-3.5" /> Start Converting
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="divide-y">
                    {jobs.map((job) => (
                      <div key={job.id} className="flex items-center gap-4 p-4 hover:bg-muted/30 transition-colors">
                        {statusIcon(job.status)}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {job.inputFile?.originalName || "File"}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {job.type} · {job.inputFormat && job.outputFormat ? `${job.inputFormat} → ${job.outputFormat}` : job.type}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">
                            {formatDateTime(job.createdAt)}
                          </p>
                          {job.status === "COMPLETED" && (
                            <button className="text-xs text-primary hover:underline mt-0.5 flex items-center gap-1 ml-auto">
                              <Download className="w-3 h-3" /> Download
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

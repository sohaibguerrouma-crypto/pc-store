"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  BrainCircuit,
  ChevronDown,
  ChevronUp,
  Filter,
  Search,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react"
import { cn, formatPrice } from "@/lib/utils"

type Outcome = "all" | "confirmed" | "refused" | "suspicious"

type AILog = {
  id: string
  orderId: string
  customer: string
  method: string
  confidence: number
  outcome: "confirmed" | "refused" | "suspicious"
  attempts: number
  transcript: string[]
  date: string
  amount: number
}

const aiLogs: AILog[] = [
  {
    id: "AI-001", orderId: "#ORD-1084", customer: "خالد الأحمدي",
    method: "تحليل السلوك", confidence: 96.4, outcome: "confirmed", attempts: 1,
    transcript: [
      "🔍 بدء التحقق من الطلب #ORD-1084",
      "✓ تطابق عنوان IP مع الموقع المسجل",
      "✓ نمط الشراء مطابق للسجل السابق",
      "✓ مبلغ الطلب ضمن الحدود المسموحة",
      "✅ تم التأكيد - درجة الثقة 96.4%",
    ],
    date: "2026-07-17 14:32", amount: 32999,
  },
  {
    id: "AI-002", orderId: "#ORD-1080", customer: "عمر الشمري",
    method: "تحليل السلوك", confidence: 23.1, outcome: "refused", attempts: 3,
    transcript: [
      "🔍 بدء التحقق من الطلب #ORD-1080",
      "⚠ عنوان IP من منطقة عالية المخاطر",
      "⚠ محاولة شراء متكررة (المحاولة 3)",
      "✗ مبلغ الطلب غير معتاد للعميل",
      "❌ تم الرفض - درجة الثقة 23.1%",
    ],
    date: "2026-07-15 09:15", amount: 32999,
  },
  {
    id: "AI-003", orderId: "#ORD-1082", customer: "فيصل الغامدي",
    method: "بصمة الجهاز", confidence: 88.7, outcome: "confirmed", attempts: 1,
    transcript: [
      "🔍 بدء التحقق من الطلب #ORD-1082",
      "✓ بصمة الجهاز متطابقة مع التسجيل",
      "✓ المتصفح محدث ومعروف",
      "✓ المنطقة الزمنية متوافقة",
      "✅ تم التأكيد - درجة الثقة 88.7%",
    ],
    date: "2026-07-16 11:45", amount: 31998,
  },
  {
    id: "AI-004", orderId: "#ORD-1074", customer: "سلطان المالكي",
    method: "تحليل الدفع", confidence: 15.8, outcome: "refused", attempts: 2,
    transcript: [
      "🔍 بدء التحقق من الطلب #ORD-1074",
      "⚠ بطاقة ائتمان من Bank غير معروف",
      "⚠ CVV غير متطابق (المحاولة 2)",
      "✗ عنوان الفوترة لا يتطابق",
      "❌ تم الرفض - درجة الثقة 15.8%",
    ],
    date: "2026-07-12 16:20", amount: 24999,
  },
  {
    id: "AI-005", orderId: "#ORD-1081", customer: "نورة الزهراني",
    method: "بصمة الجهاز", confidence: 51.2, outcome: "suspicious", attempts: 1,
    transcript: [
      "🔍 بدء التحقق من الطلب #ORD-1081",
      "⚠ بصمة جهاز جديدة لهذا العميل",
      "⚠ متصفح غير معروف (Tor)",
      "✓ مبلغ الطلب ضمن الحدود",
      "⚠ تم التصنيف مشبوه - درجة الثقة 51.2% - يتطلب مراجعة يدوية",
    ],
    date: "2026-07-16 08:30", amount: 17999,
  },
  {
    id: "AI-006", orderId: "#ORD-1076", customer: "بدر العتيبي",
    method: "تحليل السلوك", confidence: 94.2, outcome: "confirmed", attempts: 1,
    transcript: [
      "🔍 بدء التحقق من الطلب #ORD-1076",
      "✓ نمط الشراء طبيعي",
      "✓ جميع البيانات متطابقة",
      "✓ العميل لديه تاريخ شراء جيد",
      "✅ تم التأكيد - درجة الثقة 94.2%",
    ],
    date: "2026-07-13 13:10", amount: 45498,
  },
  {
    id: "AI-007", orderId: "#ORD-1079", customer: "هدى القحطاني",
    method: "تحليل الدفع", confidence: 31.6, outcome: "refused", attempts: 4,
    transcript: [
      "🔍 بدء التحقق من الطلب #ORD-1079",
      "⚠ محاولات دفع متعددة (4 محاولات)",
      "⚠ بطاقة منتهية الصلاحية",
      "✗ فشل التحقق من الرمز السري",
      "❌ تم الرفض - درجة الثقة 31.6%",
    ],
    date: "2026-07-15 18:55", amount: 8999,
  },
  {
    id: "AI-008", orderId: "#ORD-1078", customer: "ماجد الدوسري",
    method: "بصمة الجهاز", confidence: 78.3, outcome: "confirmed", attempts: 2,
    transcript: [
      "🔍 بدء التحقق من الطلب #ORD-1078",
      "⚠ بصمة جهاز مختلفة عن التسجيل",
      "✓ تم إرسال رمز تحقق للإيميل",
      "✓ تم التحقق من الرمز بنجاح",
      "✅ تم التأكيد بعد التحقق - درجة الثقة 78.3%",
    ],
    date: "2026-07-14 10:05", amount: 27998,
  },
  {
    id: "AI-009", orderId: "#ORD-1083", customer: "سارة النمر",
    method: "تحليل السلوك", confidence: 91.8, outcome: "confirmed", attempts: 1,
    transcript: [
      "🔍 بدء التحقق من الطلب #ORD-1083",
      "✓ نمط الشراء متوافق مع السجل",
      "✓ طلب متعدد المنتجات (طبيعي)",
      "✓ عنوان التوصيل معروف",
      "✅ تم التأكيد - درجة الثقة 91.8%",
    ],
    date: "2026-07-17 09:22", amount: 13249,
  },
  {
    id: "AI-010", orderId: "#ORD-1077", customer: "لينا الحربي",
    method: "تحليل الدفع", confidence: 67.4, outcome: "suspicious", attempts: 1,
    transcript: [
      "🔍 بدء التحقق من الطلب #ORD-1077",
      "⚠ مبلغ الطلب أعلى من المعدل الطبيعي للعميل",
      "✓ وسيلة الدفع موثوقة",
      "⚠ عنوان التوصيل جديد",
      "⚠ تم التصنيف مشبوه - درجة الثقة 67.4% - مراجعة يدوية مطلوبة",
    ],
    date: "2026-07-14 14:40", amount: 11898,
  },
]

const outcomeConfig: Record<string, { label: string; icon: any; colors: string }> = {
  confirmed: {
    label: "مؤكد",
    icon: CheckCircle,
    colors: "text-[#76B900] bg-[#76B900]/10 border-[#76B900]/20",
  },
  refused: {
    label: "مرفوض",
    icon: XCircle,
    colors: "text-[#ED1C24] bg-[#ED1C24]/10 border-[#ED1C24]/20",
  },
  suspicious: {
    label: "مشبوه",
    icon: AlertTriangle,
    colors: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  },
}

const outcomeTabs: { key: Outcome; label: string }[] = [
  { key: "all", label: "الكل" },
  { key: "confirmed", label: "مؤكد" },
  { key: "refused", label: "مرفوض" },
  { key: "suspicious", label: "مشبوه" },
]

function glassCard(className?: string) {
  return cn("bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl", className)
}

export default function AdminAILogs() {
  const [search, setSearch] = useState("")
  const [outcomeFilter, setOutcomeFilter] = useState<Outcome>("all")
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const filtered = aiLogs.filter((log) => {
    const matchesSearch =
      log.orderId.toLowerCase().includes(search.toLowerCase()) ||
      log.customer.includes(search)
    const matchesOutcome = outcomeFilter === "all" || log.outcome === outcomeFilter
    return matchesSearch && matchesOutcome
  })

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id)
  }

  return (
    <div className="space-y-6" dir="rtl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#ED1C24] via-[#76B900] to-[#0071C5] flex items-center justify-center">
            <BrainCircuit className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">سجلات الذكاء الاصطناعي</h1>
            <p className="text-sm text-white/50">سجل عمليات تأكيد الطلبات بواسطة AI</p>
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {outcomeTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setOutcomeFilter(tab.key)}
              className={cn(
                "px-4 py-2 rounded-xl text-sm whitespace-nowrap transition-colors",
                outcomeFilter === tab.key
                  ? "bg-white/10 text-white border border-white/10"
                  : "text-white/50 hover:text-white hover:bg-white/5 border border-transparent"
              )}
            >
              {tab.label}
              <span className="mr-1.5 text-xs opacity-50">
                ({tab.key === "all" ? aiLogs.length : aiLogs.filter((l) => l.outcome === tab.key).length})
              </span>
            </button>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={glassCard("p-5")}
      >
        <div className="flex items-center gap-3 mb-5">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="text"
              placeholder="ابحث بالطلب أو العميل..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pr-10 pl-4 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/20 transition-colors"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-white/50">
                <th className="text-right pb-3 font-medium w-1"></th>
                <th className="text-right pb-3 font-medium">المعرف</th>
                <th className="text-right pb-3 font-medium">الطلب</th>
                <th className="text-right pb-3 font-medium">العميل</th>
                <th className="text-right pb-3 font-medium">طريقة التحقق</th>
                <th className="text-center pb-3 font-medium">درجة الثقة</th>
                <th className="text-center pb-3 font-medium">النتيجة</th>
                <th className="text-center pb-3 font-medium">المحاولات</th>
                <th className="text-left pb-3 font-medium">التاريخ</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((log) => {
                const isExpanded = expandedId === log.id
                const outcome = outcomeConfig[log.outcome]
                const Icon = outcome.icon
                return (
                  <motion.tr key={log.id} layout className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-3 text-center">
                      <button
                        onClick={() => toggleExpand(log.id)}
                        className="p-1 rounded-lg hover:bg-white/10 transition-colors"
                      >
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-white/40" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-white/40" />
                        )}
                      </button>
                    </td>
                    <td className="py-3 font-mono text-xs">{log.id}</td>
                    <td className="py-3 font-medium">{log.orderId}</td>
                    <td className="py-3 text-white/70">{log.customer}</td>
                    <td className="py-3 text-white/60">{log.method}</td>
                    <td className="py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${log.confidence}%` }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className={cn(
                              "h-full rounded-full",
                              log.confidence >= 70
                                ? "bg-[#76B900]"
                                : log.confidence >= 40
                                ? "bg-yellow-400"
                                : "bg-[#ED1C24]"
                            )}
                          />
                        </div>
                        <span
                          className={cn(
                            "text-xs font-mono",
                            log.confidence >= 70
                              ? "text-[#76B900]"
                              : log.confidence >= 40
                              ? "text-yellow-400"
                              : "text-[#ED1C24]"
                          )}
                        >
                          {log.confidence}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3 text-center">
                      <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium border inline-flex items-center gap-1", outcome.colors)}>
                        <Icon className="w-3.5 h-3.5" />
                        {outcome.label}
                      </span>
                    </td>
                    <td className="py-3 text-center">
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded-lg text-xs font-mono",
                          log.attempts > 2
                            ? "text-[#ED1C24] bg-[#ED1C24]/10"
                            : "text-white/50 bg-white/5"
                        )}
                      >
                        {log.attempts}
                      </span>
                    </td>
                    <td className="py-3 text-white/50 text-left text-xs">{log.date}</td>
                  </motion.tr>
                )
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-white/30">
                    لا توجد سجلات مطابقة
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <AnimatePresence>
          {expandedId && (
            <motion.div
              key={expandedId}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              {(() => {
                const log = aiLogs.find((l) => l.id === expandedId)
                if (!log) return null
                const outcome = outcomeConfig[log.outcome]
                const Icon = outcome.icon
                return (
                  <div className="border-t border-white/10 p-4 space-y-3">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-bold">نص التحقق - {log.orderId}</h4>
                      <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium border inline-flex items-center gap-1", outcome.colors)}>
                        <Icon className="w-3.5 h-3.5" />
                        {outcome.label} ({log.confidence}%)
                      </span>
                    </div>
                    <div className="space-y-1.5 bg-black/20 rounded-xl p-4 font-mono text-xs leading-relaxed">
                      {log.transcript.map((line, i) => (
                        <motion.p
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className={cn(
                            line.startsWith("✅") && "text-[#76B900]",
                            line.startsWith("❌") && "text-[#ED1C24]",
                            line.startsWith("⚠") && "text-yellow-400",
                            line.startsWith("🔍") && "text-[#0071C5]",
                            !line.startsWith("✅") && !line.startsWith("❌") && !line.startsWith("⚠") && !line.startsWith("🔍") && "text-white/60"
                          )}
                        >
                          {line}
                        </motion.p>
                      ))}
                    </div>
                    <div className="flex items-center justify-between text-xs text-white/30 pt-1">
                      <span>المبلغ: {formatPrice(log.amount)}</span>
                      <span>{log.date}</span>
                    </div>
                  </div>
                )
              })()}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

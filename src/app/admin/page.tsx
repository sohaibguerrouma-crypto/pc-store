"use client"

import { motion } from "framer-motion"
import {
  ShoppingCart,
  DollarSign,
  Package,
  Users,
  LayoutGrid,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react"
import { cn, formatPrice } from "@/lib/utils"

const stats = [
  {
    label: "إجمالي الطلبات",
    value: "1,284",
    change: "+12.5%",
    trend: "up",
    icon: ShoppingCart,
    gradient: "from-[#ED1C24] to-[#ff4d4d]",
  },
  {
    label: "الإيرادات",
    value: formatPrice(584_920),
    change: "+8.2%",
    trend: "up",
    icon: DollarSign,
    gradient: "from-[#76B900] to-[#9bdb36]",
  },
  {
    label: "المنتجات",
    value: "342",
    change: "+3.1%",
    trend: "up",
    icon: Package,
    gradient: "from-[#0071C5] to-[#3399ff]",
  },
  {
    label: "المستخدمين",
    value: "5,621",
    change: "-2.4%",
    trend: "down",
    icon: Users,
    gradient: "from-[#ED1C24] to-[#0071C5]",
  },
]

const recentOrders = [
  { id: "#ORD-1084", customer: "خالد الأحمدي", total: 12499, status: "مؤكد", date: "2026-07-17" },
  { id: "#ORD-1083", customer: "سارة النمر", total: 8750, status: "قيد التوصيل", date: "2026-07-17" },
  { id: "#ORD-1082", customer: "فيصل الغامدي", total: 32299, status: "تم التوصيل", date: "2026-07-16" },
  { id: "#ORD-1081", customer: "نورة الزهراني", total: 5499, status: "معلق", date: "2026-07-16" },
  { id: "#ORD-1080", customer: "عمر الشمري", total: 18999, status: "مؤكد", date: "2026-07-15" },
  { id: "#ORD-1079", customer: "هدى القحطاني", total: 7650, status: "ملغي", date: "2026-07-15" },
  { id: "#ORD-1078", customer: "ماجد الدوسري", total: 23450, status: "قيد التوصيل", date: "2026-07-14" },
  { id: "#ORD-1077", customer: "لينا الحربي", total: 10990, status: "تم التوصيل", date: "2026-07-14" },
  { id: "#ORD-1076", customer: "بدر العتيبي", total: 45000, status: "مؤكد", date: "2026-07-13" },
  { id: "#ORD-1075", customer: "رنا الزهراني", total: 3200, status: "معلق", date: "2026-07-13" },
]

const lowStockProducts = [
  { name: "RTX 5090", brand: "NVIDIA", stock: 2, threshold: 10 },
  { name: "Ryzen 9 9950X", brand: "AMD", stock: 3, threshold: 10 },
  { name: "Core i9-14900K", brand: "Intel", stock: 1, threshold: 8 },
  { name: "RTX 5080", brand: "NVIDIA", stock: 4, threshold: 10 },
]

const salesData = [
  { label: "يناير", value: 85 },
  { label: "فبراير", value: 92 },
  { label: "مارس", value: 78 },
  { label: "أبريل", value: 110 },
  { label: "مايو", value: 95 },
  { label: "يونيو", value: 120 },
  { label: "يوليو", value: 105 },
]

const aiSummary = {
  confirmed: 47,
  refused: 12,
  pending: 5,
  suspicious: 3,
}

const statusColors: Record<string, string> = {
  مؤكد: "text-[#76B900] bg-[#76B900]/10",
  "قيد التوصيل": "text-[#0071C5] bg-[#0071C5]/10",
  "تم التوصيل": "text-white/60 bg-white/5",
  معلق: "text-yellow-400 bg-yellow-400/10",
  ملغي: "text-[#ED1C24] bg-[#ED1C24]/10",
}

function glassCard(className?: string) {
  return cn("bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl", className)
}

export default function AdminDashboard() {
  return (
    <div className="space-y-6" dir="rtl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#ED1C24] via-[#76B900] to-[#0071C5] flex items-center justify-center">
          <LayoutGrid className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">لوحة التحكم</h1>
          <p className="text-sm text-white/50">نظرة عامة على المتجر</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className={glassCard("p-5 relative overflow-hidden group")}
            >
              <div
                className={cn(
                  "absolute -top-6 -left-6 w-20 h-20 rounded-full bg-gradient-to-br opacity-20 blur-xl group-hover:opacity-30 transition-opacity",
                  stat.gradient
                )}
              />
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-white/50 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br", stat.gradient)}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-3 text-xs">
                {stat.trend === "up" ? (
                  <TrendingUp className="w-3 h-3 text-[#76B900]" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-[#ED1C24]" />
                )}
                <span className={stat.trend === "up" ? "text-[#76B900]" : "text-[#ED1C24]"}>
                  {stat.change}
                </span>
                <span className="text-white/30">مقارنة بالشهر الماضي</span>
              </div>
            </motion.div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={glassCard("lg:col-span-2 p-5")}
        >
          <h3 className="text-lg font-bold mb-4">المبيعات الشهرية</h3>
          <div className="flex items-end gap-3 h-40">
            {salesData.map((item) => (
              <div key={item.label} className="flex-1 flex flex-col items-center gap-1 group">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${item.value}%` }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className={cn(
                    "w-full rounded-t-lg relative cursor-pointer",
                    "bg-gradient-to-t from-[#0071C5] to-[#76B900]"
                  )}
                  style={{ height: `${item.value}%` }}
                >
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-xs bg-white/10 px-2 py-0.5 rounded whitespace-nowrap">
                    {item.value}%
                  </div>
                </motion.div>
                <span className="text-xs text-white/40 mt-1">{item.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className={glassCard("p-5")}
        >
          <h3 className="text-lg font-bold mb-4">ملخص تأكيد AI</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#76B900]/10 border border-[#76B900]/20">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#76B900]" />
                <span className="text-sm">مؤكد</span>
              </div>
              <span className="text-lg font-bold text-[#76B900]">{aiSummary.confirmed}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#ED1C24]/10 border border-[#ED1C24]/20">
              <div className="flex items-center gap-2">
                <XCircle className="w-4 h-4 text-[#ED1C24]" />
                <span className="text-sm">مرفوض</span>
              </div>
              <span className="text-lg font-bold text-[#ED1C24]">{aiSummary.refused}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-yellow-400/10 border border-yellow-400/20">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-400" />
                <span className="text-sm">مشبوه</span>
              </div>
              <span className="text-lg font-bold text-yellow-400">{aiSummary.suspicious}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-white/50" />
                <span className="text-sm">قيد الانتظار</span>
              </div>
              <span className="text-lg font-bold text-white/50">{aiSummary.pending}</span>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={glassCard("lg:col-span-2 p-5")}
        >
          <h3 className="text-lg font-bold mb-4">آخر الطلبات</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-white/50">
                  <th className="text-right pb-3 font-medium">الطلب</th>
                  <th className="text-right pb-3 font-medium">العميل</th>
                  <th className="text-left pb-3 font-medium">المبلغ</th>
                  <th className="text-center pb-3 font-medium">الحالة</th>
                  <th className="text-left pb-3 font-medium">التاريخ</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-3 font-medium">{order.id}</td>
                    <td className="py-3 text-white/70">{order.customer}</td>
                    <td className="py-3 text-left">{formatPrice(order.total)}</td>
                    <td className="py-3 text-center">
                      <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium", statusColors[order.status])}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 text-white/50 text-left">{order.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className={glassCard("p-5")}
        >
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-yellow-400" />
            <h3 className="text-lg font-bold">منتجات منخفضة المخزون</h3>
          </div>
          <div className="space-y-3">
            {lowStockProducts.map((product) => (
              <div
                key={product.name}
                className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between"
              >
                <div>
                  <p className="text-sm font-medium">{product.name}</p>
                  <p className="text-xs text-white/40">{product.brand}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <p className={cn("text-sm font-bold", product.stock <= 2 ? "text-[#ED1C24]" : "text-yellow-400")}>
                      {product.stock}
                    </p>
                    <p className="text-xs text-white/30">/{product.threshold}</p>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-[#ED1C24] animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

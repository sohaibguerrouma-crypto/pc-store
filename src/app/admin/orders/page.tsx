"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ShoppingCart,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Eye,
} from "lucide-react"
import { cn, formatPrice } from "@/lib/utils"

type OrderStatus = "all" | "pending" | "confirmed" | "shipped" | "delivered" | "cancelled"

type Order = {
  id: string
  customer: string
  email: string
  items: { name: string; qty: number; price: number }[]
  total: number
  status: string
  date: string
  paymentMethod: string
  aiConfirmed: boolean | null
}

const orders: Order[] = [
  {
    id: "#ORD-1084", customer: "خالد الأحمدي", email: "khalid@email.com",
    items: [{ name: "RTX 5090", qty: 1, price: 32999 }],
    total: 32999, status: "confirmed", date: "2026-07-17", paymentMethod: "بطاقة ائتمان",
    aiConfirmed: true,
  },
  {
    id: "#ORD-1083", customer: "سارة النمر", email: "sara@email.com",
    items: [{ name: "Ryzen 9 9950X", qty: 1, price: 12499 }, { name: "RGB Fans", qty: 3, price: 250 }],
    total: 13249, status: "shipped", date: "2026-07-17", paymentMethod: "تحويل بنكي",
    aiConfirmed: true,
  },
  {
    id: "#ORD-1082", customer: "فيصل الغامدي", email: "faisal@email.com",
    items: [{ name: "Core i9-14900K", qty: 1, price: 9999 }, { name: "RTX 5080", qty: 1, price: 21999 }],
    total: 31998, status: "delivered", date: "2026-07-16", paymentMethod: "مدى",
    aiConfirmed: true,
  },
  {
    id: "#ORD-1081", customer: "نورة الزهراني", email: "noura@email.com",
    items: [{ name: "Radeon RX 8800 XT", qty: 1, price: 17999 }],
    total: 17999, status: "pending", date: "2026-07-16", paymentMethod: "بطاقة ائتمان",
    aiConfirmed: null,
  },
  {
    id: "#ORD-1080", customer: "عمر الشمري", email: "omar@email.com",
    items: [{ name: "RTX 5090", qty: 1, price: 32999 }],
    total: 32999, status: "pending", date: "2026-07-15", paymentMethod: "تحويل بنكي",
    aiConfirmed: false,
  },
  {
    id: "#ORD-1079", customer: "هدى القحطاني", email: "huda@email.com",
    items: [{ name: "Ryzen 7 9800X3D", qty: 1, price: 8999 }],
    total: 8999, status: "cancelled", date: "2026-07-15", paymentMethod: "مدى",
    aiConfirmed: false,
  },
  {
    id: "#ORD-1078", customer: "ماجد الدوسري", email: "majed@email.com",
    items: [{ name: "GeForce RTX 5070", qty: 2, price: 13999 }],
    total: 27998, status: "shipped", date: "2026-07-14", paymentMethod: "بطاقة ائتمان",
    aiConfirmed: true,
  },
  {
    id: "#ORD-1077", customer: "لينا الحربي", email: "lena@email.com",
    items: [{ name: "Core i9-14900K", qty: 1, price: 9999 }, { name: "RGB RAM 32GB", qty: 1, price: 1899 }],
    total: 11898, status: "delivered", date: "2026-07-14", paymentMethod: "تحويل بنكي",
    aiConfirmed: true,
  },
  {
    id: "#ORD-1076", customer: "بدر العتيبي", email: "badr@email.com",
    items: [{ name: "RTX 5090", qty: 1, price: 32999 }, { name: "Ryzen 9 9950X", qty: 1, price: 12499 }],
    total: 45498, status: "confirmed", date: "2026-07-13", paymentMethod: "بطاقة ائتمان",
    aiConfirmed: true,
  },
  {
    id: "#ORD-1075", customer: "رنا الزهراني", email: "rana@email.com",
    items: [{ name: "Core Ultra 9 285K", qty: 1, price: 11499 }],
    total: 11499, status: "pending", date: "2026-07-13", paymentMethod: "مدى",
    aiConfirmed: null,
  },
  {
    id: "#ORD-1074", customer: "سلطان المالكي", email: "sultan@email.com",
    items: [{ name: "Radeon RX 8900 XTX", qty: 1, price: 24999 }],
    total: 24999, status: "cancelled", date: "2026-07-12", paymentMethod: "تحويل بنكي",
    aiConfirmed: false,
  },
  {
    id: "#ORD-1073", customer: "مريم الشهراني", email: "maryam@email.com",
    items: [{ name: "GeForce RTX 5080", qty: 1, price: 21999 }, { name: "Ryzen 7 9800X3D", qty: 1, price: 8999 }],
    total: 30998, status: "confirmed", date: "2026-07-12", paymentMethod: "بطاقة ائتمان",
    aiConfirmed: true,
  },
]

const statusTabs: { key: OrderStatus; label: string }[] = [
  { key: "all", label: "الكل" },
  { key: "pending", label: "قيد الانتظار" },
  { key: "confirmed", label: "مؤكد" },
  { key: "shipped", label: "قيد التوصيل" },
  { key: "delivered", label: "تم التوصيل" },
  { key: "cancelled", label: "ملغي" },
]

const statusBadge: Record<string, string> = {
  pending: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  confirmed: "text-[#76B900] bg-[#76B900]/10 border-[#76B900]/20",
  shipped: "text-[#0071C5] bg-[#0071C5]/10 border-[#0071C5]/20",
  delivered: "text-white/60 bg-white/5 border-white/10",
  cancelled: "text-[#ED1C24] bg-[#ED1C24]/10 border-[#ED1C24]/20",
}

const statusLabels: Record<string, string> = {
  pending: "قيد الانتظار",
  confirmed: "مؤكد",
  shipped: "قيد التوصيل",
  delivered: "تم التوصيل",
  cancelled: "ملغي",
}

function glassCard(className?: string) {
  return cn("bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl", className)
}

export default function AdminOrders() {
  const [activeTab, setActiveTab] = useState<OrderStatus>("all")
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [statusUpdates, setStatusUpdates] = useState<Record<string, string>>({})

  const filtered =
    activeTab === "all" ? orders : orders.filter((o) => o.status === activeTab)

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id)
  }

  const updateStatus = (orderId: string, newStatus: string) => {
    setStatusUpdates((prev) => ({ ...prev, [orderId]: newStatus }))
  }

  return (
    <div className="space-y-6" dir="rtl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#ED1C24] via-[#76B900] to-[#0071C5] flex items-center justify-center">
            <ShoppingCart className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">الطلبات</h1>
            <p className="text-sm text-white/50">إدارة وتتبع الطلبات</p>
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {statusTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "px-4 py-2 rounded-xl text-sm whitespace-nowrap transition-colors",
                activeTab === tab.key
                  ? "bg-white/10 text-white border border-white/10"
                  : "text-white/50 hover:text-white hover:bg-white/5 border border-transparent"
              )}
            >
              {tab.label}
              <span className="mr-1.5 text-xs opacity-50">
                ({tab.key === "all" ? orders.length : orders.filter((o) => o.status === tab.key).length})
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
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-white/50">
                <th className="text-right pb-3 font-medium w-1"></th>
                <th className="text-right pb-3 font-medium">الطلب</th>
                <th className="text-right pb-3 font-medium">العميل</th>
                <th className="text-left pb-3 font-medium">المبلغ</th>
                <th className="text-center pb-3 font-medium">الحالة</th>
                <th className="text-center pb-3 font-medium">تأكيد AI</th>
                <th className="text-center pb-3 font-medium">التاريخ</th>
                <th className="text-center pb-3 font-medium">تحديث الحالة</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((order) => {
                const isExpanded = expandedId === order.id
                const currentStatus = statusUpdates[order.id] || order.status
                return (
                  <motion.tr key={order.id} layout className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="py-3 text-center">
                      <button
                        onClick={() => toggleExpand(order.id)}
                        className="p-1 rounded-lg hover:bg-white/10 transition-colors"
                      >
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-white/40" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-white/40" />
                        )}
                      </button>
                    </td>
                    <td className="py-3 font-medium">{order.id}</td>
                    <td className="py-3">
                      <div>
                        <p className="font-medium">{order.customer}</p>
                        <p className="text-xs text-white/40">{order.email}</p>
                      </div>
                    </td>
                    <td className="py-3 text-left font-medium">{formatPrice(order.total)}</td>
                    <td className="py-3 text-center">
                      <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium border", statusBadge[currentStatus])}>
                        {statusLabels[currentStatus] || currentStatus}
                      </span>
                    </td>
                    <td className="py-3 text-center">
                      <span
                        className={cn(
                          "px-2.5 py-1 rounded-full text-xs font-medium",
                          order.aiConfirmed === true
                            ? "text-[#76B900] bg-[#76B900]/10"
                            : order.aiConfirmed === false
                            ? "text-[#ED1C24] bg-[#ED1C24]/10"
                            : "text-yellow-400 bg-yellow-400/10"
                        )}
                      >
                        {order.aiConfirmed === true ? "مؤكد" : order.aiConfirmed === false ? "مرفوض" : "معلق"}
                      </span>
                    </td>
                    <td className="py-3 text-white/50 text-center">{order.date}</td>
                    <td className="py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <select
                          value={currentStatus}
                          onChange={(e) => updateStatus(order.id, e.target.value)}
                          className="bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-white/20 cursor-pointer"
                        >
                          <option value="pending">قيد الانتظار</option>
                          <option value="confirmed">مؤكد</option>
                          <option value="shipped">قيد التوصيل</option>
                          <option value="delivered">تم التوصيل</option>
                          <option value="cancelled">ملغي</option>
                        </select>
                        <button
                          className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-white/40 hover:text-white"
                          title="تجاوز AI"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                )
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-white/30">
                    لا توجد طلبات في هذه الفئة
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
                const order = orders.find((o) => o.id === expandedId)
                if (!order) return null
                return (
                  <div className="border-t border-white/10 p-4 space-y-3">
                    <h4 className="text-sm font-bold mb-2">تفاصيل الطلب {order.id}</h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-white/40">وسيلة الدفع: </span>
                        <span>{order.paymentMethod}</span>
                      </div>
                      <div>
                        <span className="text-white/40">البريد الإلكتروني: </span>
                        <span>{order.email}</span>
                      </div>
                    </div>
                    <table className="w-full text-sm mt-2">
                      <thead>
                        <tr className="text-white/40 text-xs border-b border-white/5">
                          <th className="text-right pb-2 font-medium">المنتج</th>
                          <th className="text-center pb-2 font-medium">الكمية</th>
                          <th className="text-left pb-2 font-medium">السعر</th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.items.map((item, i) => (
                          <tr key={i} className="border-b border-white/5">
                            <td className="py-2 text-right">{item.name}</td>
                            <td className="py-2 text-center">{item.qty}</td>
                            <td className="py-2 text-left">{formatPrice(item.price)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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

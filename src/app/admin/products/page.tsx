"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Package,
  Search,
  Plus,
  Edit3,
  Trash2,
  X,
  Filter,
} from "lucide-react"
import { cn, formatPrice } from "@/lib/utils"

type Product = {
  id: string
  name: string
  image: string
  brand: "NVIDIA" | "AMD" | "Intel"
  price: number
  stock: number
  category: string
  status: "active" | "draft" | "archived"
}

const products: Product[] = [
  { id: "P-001", name: "GeForce RTX 5090", image: "RTX 5090", brand: "NVIDIA", price: 32999, stock: 2, category: "GPU", status: "active" },
  { id: "P-002", name: "Ryzen 9 9950X", image: "R9 9950X", brand: "AMD", price: 12499, stock: 3, category: "CPU", status: "active" },
  { id: "P-003", name: "Core i9-14900K", image: "i9-14900K", brand: "Intel", price: 9999, stock: 1, category: "CPU", status: "active" },
  { id: "P-004", name: "Radeon RX 8900 XTX", image: "RX 8900", brand: "AMD", price: 24999, stock: 8, category: "GPU", status: "active" },
  { id: "P-005", name: "GeForce RTX 5080", image: "RTX 5080", brand: "NVIDIA", price: 21999, stock: 4, category: "GPU", status: "active" },
  { id: "P-006", name: "Core Ultra 9 285K", image: "Ultra 9", brand: "Intel", price: 11499, stock: 12, category: "CPU", status: "active" },
  { id: "P-007", name: "Ryzen 7 9800X3D", image: "R7 9800X3D", brand: "AMD", price: 8999, stock: 15, category: "CPU", status: "active" },
  { id: "P-008", name: "GeForce RTX 5070", image: "RTX 5070", brand: "NVIDIA", price: 13999, stock: 0, category: "GPU", status: "archived" },
  { id: "P-009", name: "Core i7-14700K", image: "i7-14700K", brand: "Intel", price: 6999, stock: 6, category: "CPU", status: "draft" },
  { id: "P-010", name: "Radeon RX 8800 XT", image: "RX 8800", brand: "AMD", price: 17999, stock: 9, category: "GPU", status: "active" },
]

const brandColors: Record<string, string> = {
  NVIDIA: "text-[#76B900] bg-[#76B900]/10 border-[#76B900]/20",
  AMD: "text-[#ED1C24] bg-[#ED1C24]/10 border-[#ED1C24]/20",
  Intel: "text-[#0071C5] bg-[#0071C5]/10 border-[#0071C5]/20",
}

const statusStyles: Record<string, string> = {
  active: "text-[#76B900] bg-[#76B900]/10",
  draft: "text-yellow-400 bg-yellow-400/10",
  archived: "text-white/40 bg-white/5",
}

function glassCard(className?: string) {
  return cn("bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl", className)
}

export default function AdminProducts() {
  const [search, setSearch] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6" dir="rtl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#ED1C24] via-[#76B900] to-[#0071C5] flex items-center justify-center">
            <Package className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">المنتجات</h1>
            <p className="text-sm text-white/50">إدارة المنتجات ({products.length})</p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-l from-[#ED1C24] via-[#76B900] to-[#0071C5] rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          إضافة منتج
        </motion.button>
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
              placeholder="ابحث عن منتج..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pr-10 pl-4 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/20 transition-colors"
            />
          </div>
          <button className="p-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
            <Filter className="w-4 h-4 text-white/50" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-white/50">
                <th className="text-right pb-3 font-medium">المنتج</th>
                <th className="text-right pb-3 font-medium">الفئة</th>
                <th className="text-right pb-3 font-medium">العلامة التجارية</th>
                <th className="text-left pb-3 font-medium">السعر</th>
                <th className="text-center pb-3 font-medium">المخزون</th>
                <th className="text-center pb-3 font-medium">الحالة</th>
                <th className="text-center pb-3 font-medium">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => (
                <motion.tr
                  key={product.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors"
                >
                  <td className="py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-xs font-bold text-white/40">
                        {product.image.split(" ").slice(0, 2).map((w) => w[0]).join("")}
                      </div>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-xs text-white/40">{product.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 text-white/60">{product.category}</td>
                  <td className="py-3">
                    <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium border", brandColors[product.brand])}>
                      {product.brand}
                    </span>
                  </td>
                  <td className="py-3 text-left font-medium">{formatPrice(product.price)}</td>
                  <td className="py-3 text-center">
                    <span
                      className={cn(
                        "px-2.5 py-1 rounded-full text-xs font-medium",
                        product.stock === 0
                          ? "text-[#ED1C24] bg-[#ED1C24]/10"
                          : product.stock <= 5
                          ? "text-yellow-400 bg-yellow-400/10"
                          : "text-[#76B900] bg-[#76B900]/10"
                      )}
                    >
                      {product.stock === 0 ? "نفذ" : product.stock <= 5 ? "منخفض" : product.stock}
                    </span>
                  </td>
                  <td className="py-3 text-center">
                    <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium", statusStyles[product.status])}>
                      {product.status === "active" ? "نشط" : product.status === "draft" ? "مسودة" : "مؤرشف"}
                    </span>
                  </td>
                  <td className="py-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white/40 hover:text-white">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button className="p-2 rounded-lg hover:bg-[#ED1C24]/10 transition-colors text-white/40 hover:text-[#ED1C24]">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-white/30">
                    لا توجد نتائج مطابقة
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      <AnimatePresence>
        {showAddModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              onClick={() => setShowAddModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className={cn(glassCard("w-full max-w-lg p-6"), "relative")}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">إضافة منتج جديد</h2>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-4">
                  {["اسم المنتج", "العلامة التجارية", "الفئة", "السعر", "المخزون"].map((label) => (
                    <div key={label}>
                      <label className="block text-sm text-white/60 mb-1.5">{label}</label>
                      <input
                        type="text"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-white/20 transition-colors"
                        placeholder={`أدخل ${label}`}
                      />
                    </div>
                  ))}
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => setShowAddModal(false)}
                      className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm hover:bg-white/10 transition-colors"
                    >
                      إلغاء
                    </button>
                    <button className="flex-1 px-4 py-2.5 bg-gradient-to-l from-[#ED1C24] via-[#76B900] to-[#0071C5] rounded-xl text-sm font-medium hover:opacity-90 transition-opacity">
                      حفظ
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

"use client"

import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  LayoutGrid,
  Package,
  ShoppingCart,
  BrainCircuit,
  ChevronLeft,
  ChevronRight,
  User,
  LogOut,
  Monitor,
} from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

const sidebarLinks = [
  { href: "/admin", label: "لوحة التحكم", icon: LayoutGrid },
  { href: "/admin/products", label: "المنتجات", icon: Package },
  { href: "/admin/orders", label: "الطلبات", icon: ShoppingCart },
  { href: "/admin/ai-logs", label: "سجلات الذكاء الاصطناعي", icon: BrainCircuit },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white" dir="rtl">
      <div className="flex">
        <AnimatePresence mode="wait">
          <motion.aside
            initial={{ width: collapsed ? 280 : 80 }}
            animate={{ width: collapsed ? 80 : 280 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={cn(
              "fixed right-0 top-0 h-screen z-50",
              "bg-white/5 backdrop-blur-xl border-l border-white/10",
              "flex flex-col"
            )}
          >
            <div className="flex items-center gap-3 px-4 h-16 border-b border-white/10">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#ED1C24] via-[#76B900] to-[#0071C5] flex items-center justify-center shrink-0">
                <Monitor className="w-5 h-5 text-white" />
              </div>
              <AnimatePresence mode="wait">
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-lg font-bold whitespace-nowrap"
                  >
                    PC-Store
                  </motion.span>
                )}
              </AnimatePresence>
            </div>

            <nav className="flex-1 py-4 px-2 space-y-1 overflow-hidden">
              {sidebarLinks.map((link) => {
                const isActive = pathname === link.href
                const Icon = link.icon
                return (
                  <Link key={link.href} href={link.href}>
                    <motion.div
                      whileHover={{ x: collapsed ? 0 : -4 }}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                        isActive
                          ? "bg-white/10 text-white"
                          : "text-white/50 hover:text-white hover:bg-white/5"
                      )}
                    >
                      <Icon className="w-5 h-5 shrink-0" />
                      <AnimatePresence mode="wait">
                        {!collapsed && (
                          <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-sm whitespace-nowrap"
                          >
                            {link.label}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </Link>
                )
              })}
            </nav>

            <div className="p-2 border-t border-white/10">
              <button
                onClick={() => setCollapsed(!collapsed)}
                className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-white/50 hover:text-white hover:bg-white/5 transition-colors"
              >
                {collapsed ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
              </button>
            </div>
          </motion.aside>
        </AnimatePresence>

        <div
          className={cn(
            "flex-1 transition-all duration-300",
            "mr-[80px]",
            !collapsed && "mr-[280px]"
          )}
        >
          <header className="h-16 border-b border-white/10 bg-white/5 backdrop-blur-xl flex items-center justify-between px-6 sticky top-0 z-40">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#ED1C24] to-[#0071C5] flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">أحمد المدير</p>
                <p className="text-xs text-white/50">ahmed@pc-store.com</p>
              </div>
            </div>
            <button className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm">
              <LogOut className="w-4 h-4" />
              <span>تسجيل خروج</span>
            </button>
          </header>

          <main className="p-6">{children}</main>
        </div>
      </div>
    </div>
  )
}

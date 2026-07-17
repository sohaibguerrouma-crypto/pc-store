"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, Cpu, Shield, Truck } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/utils";
import type { CartItem } from "@/types";

const FEATURES = [
  { icon: Shield, text: "منتجات أصلية 100%" },
  { icon: Truck, text: "توصيل لكل الولايات" },
];

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem("pc-store-cart");
      if (stored) setCart(JSON.parse(stored));
    } catch { /* skip */ }
  }, []);

  useEffect(() => {
    if (mounted) localStorage.setItem("pc-store-cart", JSON.stringify(cart));
  }, [cart, mounted]);

  const updateQty = (id: string, delta: number) =>
    setCart((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, Math.min(item.stock, item.quantity + delta)) }
          : item
      )
    );

  const removeItem = (id: string) => setCart((prev) => prev.filter((i) => i.id !== id));

  const subtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const itemCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <header className="glass border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <Cpu className="w-5 h-5 text-[#ED1C24]" />
            PC Store
          </Link>
          <Link href="/shop" className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" />
            العودة للتسوق
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-4xl font-black mb-8"
        >
          سلة التسوق
          {itemCount > 0 && (
            <span className="text-lg font-normal text-gray-400 mr-3">({itemCount} قطع)</span>
          )}
        </motion.h1>

        {cart.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass rounded-3xl p-16 text-center max-w-lg mx-auto"
          >
            <ShoppingBag className="w-20 h-20 mx-auto mb-6 text-gray-600" />
            <h2 className="text-2xl font-bold mb-3">سلتك فارغة</h2>
            <p className="text-gray-400 mb-8">لم تقم بإضافة أي منتجات بعد</p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-bold rounded-xl hover:scale-105 transition-transform"
            >
              تسوق الآن
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <AnimatePresence>
                {cart.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 50, height: 0, marginBottom: 0 }}
                    className="glass rounded-2xl p-4 flex gap-4 items-center"
                  >
                    <div className="w-20 h-20 rounded-xl bg-white/5 flex-shrink-0 flex items-center justify-center overflow-hidden">
                      {item.image ? (
                        <img src={item.image} alt={item.nameAr} className="w-full h-full object-cover" />
                      ) : (
                        <Cpu className="w-8 h-8 text-gray-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold truncate">{item.nameAr || item.name}</h3>
                      <p className="text-sm text-gray-400 mt-1">{item.sku}</p>
                      <p className="text-lg font-bold mt-1">{formatPrice(item.price)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQty(item.id, -1)}
                        disabled={item.quantity <= 1}
                        className="w-9 h-9 rounded-lg glass flex items-center justify-center hover:bg-white/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center font-bold tabular-nums">{item.quantity}</span>
                      <button
                        onClick={() => updateQty(item.id, 1)}
                        disabled={item.quantity >= item.stock}
                        className="w-9 h-9 rounded-lg glass flex items-center justify-center hover:bg-white/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="text-left min-w-[90px]">
                      <p className="font-bold text-[#76B900]">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-2 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass rounded-2xl p-6 sticky top-24"
              >
                <h2 className="text-xl font-bold mb-6">ملخص الطلب</h2>
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-400">
                    <span>المجموع الفرعي</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>الشحن</span>
                    <span>يُحدد لاحقاً</span>
                  </div>
                  <div className="h-px bg-white/5" />
                  <div className="flex justify-between text-lg font-bold">
                    <span>الإجمالي</span>
                    <span className="bg-gradient-to-r from-[#ED1C24] via-[#76B900] to-[#0071C5] bg-clip-text text-transparent">
                      {formatPrice(subtotal)}
                    </span>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => router.push("/checkout")}
                  className="w-full py-4 bg-white text-black font-bold rounded-xl text-lg hover:scale-[1.02] transition-transform mb-4"
                >
                  متابعة الشراء
                </motion.button>

                <div className="space-y-3">
                  {FEATURES.map((f, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-gray-400">
                      <f.icon className="w-4 h-4 text-[#76B900]" />
                      <span>{f.text}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cpu, Search, Package, CheckCircle, XCircle, Truck, Clock, AlertCircle, RefreshCw, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/utils";
import type { OrderStatus } from "@/types";

interface StatusStep {
  status: OrderStatus;
  label: string;
  labelAr: string;
  icon: typeof Package;
  color: string;
}

const STEPS: StatusStep[] = [
  { status: "PENDING", label: "Pending", labelAr: "قيد المراجعة", icon: Clock, color: "text-yellow-400" },
  { status: "AI_CONFIRMING", label: "AI Confirming", labelAr: "تأكيد آلي", icon: RefreshCw, color: "text-blue-400" },
  { status: "CONFIRMED", label: "Confirmed", labelAr: "تم التأكيد", icon: CheckCircle, color: "text-[#76B900]" },
  { status: "SHIPPED", label: "Shipped", labelAr: "تم الشحن", icon: Truck, color: "text-[#0071C5]" },
  { status: "DELIVERED", label: "Delivered", labelAr: "تم التوصيل", icon: Package, color: "text-[#76B900]" },
];

const CANCEL_STATUSES: OrderStatus[] = ["CANCELLED", "REFUSED"];

interface OrderItem {
  name: string;
  nameAr: string;
  quantity: number;
  price: number;
  image: string;
}

interface OrderData {
  orderNumber: string;
  status: OrderStatus;
  date: string;
  customerName: string;
  phone: string;
  wilaya: string;
  commune: string;
  address: string;
  paymentMethod: string;
  total: number;
  deliveryCost: number;
  subtotal: number;
  items: OrderItem[];
}

const MOCK_ORDER: OrderData = {
  orderNumber: "PC-K7X2-A9B3",
  status: "SHIPPED",
  date: "15 يوليو 2026",
  customerName: "محمد علي",
  phone: "0550123456",
  wilaya: "الجزائر",
  commune: "بوزريعة",
  address: "رقم 12، شارع فلسطين",
  paymentMethod: "COD",
  total: 515000,
  deliveryCost: 500,
  subtotal: 514500,
  items: [
    { name: "AMD Ryzen 7 7800X3D", nameAr: "AMD Ryzen 7 7800X3D", quantity: 1, price: 195000, image: "" },
    { name: "NVIDIA GeForce RTX 4070 Ti", nameAr: "NVIDIA GeForce RTX 4070 Ti", quantity: 1, price: 320000, image: "" },
  ],
};

const STATUS_BADGE: Record<string, { label: string; color: string }> = {
  PENDING: { label: "قيد المراجعة", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
  AI_CONFIRMING: { label: "تأكيد آلي", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  CONFIRMED: { label: "تم التأكيد", color: "bg-[#76B900]/20 text-[#76B900] border-[#76B900]/30" },
  CANCELLED: { label: "ملغي", color: "bg-red-500/20 text-red-400 border-red-500/30" },
  SHIPPED: { label: "تم الشحن", color: "bg-[#0071C5]/20 text-[#0071C5] border-[#0071C5]/30" },
  DELIVERED: { label: "تم التوصيل", color: "bg-[#76B900]/20 text-[#76B900] border-[#76B900]/30" },
  REFUSED: { label: "مرفوض", color: "bg-red-500/20 text-red-400 border-red-500/30" },
};

function getActiveSteps(status: OrderStatus): number {
  const idx = STEPS.findIndex((s) => s.status === status);
  return idx >= 0 ? idx : -1;
}

export default function OrderTrackingPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [order, setOrder] = useState<OrderData | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber.trim() || !phone.trim()) return;
    setSearched(true);
    setOrder(MOCK_ORDER);
  };

  const isCancelled = order && CANCEL_STATUSES.includes(order.status);
  const activeStep = order ? getActiveSteps(order.status) : -1;

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <header className="glass border-b border-white/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2 font-bold text-lg">
            <Cpu className="w-5 h-5 text-[#ED1C24]" />
            PC Store
          </a>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl md:text-4xl font-black mb-3">تتبع الطلب</h1>
          <p className="text-gray-400 mb-8">أدخل رقم الطلب ورقم الهاتف لتتبع حالة طلبك</p>
        </motion.div>

        <motion.form
          onSubmit={handleSearch}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-6 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
              <label className="block text-sm text-gray-400 mb-2">رقم الطلب</label>
              <input
                type="text"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                placeholder="PC-K7X2-A9B3"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-white/30 transition-colors"
              />
            </div>
            <div className="md:col-span-1">
              <label className="block text-sm text-gray-400 mb-2">رقم الهاتف</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="05XX XX XX XX"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-white/30 transition-colors"
              />
            </div>
            <div className="md:col-span-1 flex items-end">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full py-4 bg-white text-black font-bold rounded-xl flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform"
              >
                <Search className="w-5 h-5" />
                بحث
              </motion.button>
            </div>
          </div>
        </motion.form>

        <AnimatePresence>
          {searched && !order && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-2xl p-12 text-center"
            >
              <AlertCircle className="w-16 h-16 mx-auto mb-4 text-gray-600" />
              <h2 className="text-xl font-bold mb-2">لم يتم العثور على الطلب</h2>
              <p className="text-gray-400">تأكد من رقم الطلب ورقم الهاتف وحاول مرة أخرى</p>
            </motion.div>
          )}

          {order && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="glass rounded-2xl p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <p className="text-sm text-gray-400">رقم الطلب</p>
                    <p className="text-2xl font-black bg-gradient-to-r from-[#ED1C24] via-[#76B900] to-[#0071C5] bg-clip-text text-transparent">
                      {order.orderNumber}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={cn(
                      "px-4 py-2 rounded-xl text-sm font-bold border",
                      STATUS_BADGE[order.status]?.color || "bg-white/10 text-gray-400"
                    )}>
                      {STATUS_BADGE[order.status]?.label || order.status}
                    </span>
                    <span className="text-sm text-gray-400">{order.date}</span>
                  </div>
                </div>

                {isCancelled ? (
                  <div className="glass rounded-2xl p-6 text-center">
                    <XCircle className="w-16 h-16 mx-auto mb-4 text-red-400" />
                    <h3 className="text-xl font-bold text-red-400 mb-2">تم إلغاء الطلب</h3>
                    <p className="text-gray-400">للأسف، تم إلغاء هذا الطلب. يمكنك التواصل مع الدعم للمزيد من المعلومات.</p>
                  </div>
                ) : (
                  <div className="relative">
                    <div className="absolute right-[19px] top-0 bottom-0 w-0.5 bg-white/5 hidden md:block" />
                    <div className="space-y-0">
                      {STEPS.map((step, idx) => {
                        const StepIcon = step.icon;
                        const isActive = idx <= activeStep;
                        const isCurrent = idx === activeStep;
                        return (
                          <div key={step.status} className="flex items-start gap-4 relative pb-8 last:pb-0">
                            <div className={cn(
                              "relative z-10 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all",
                              isActive ? "bg-white text-black" : "bg-white/5 text-gray-600"
                            )}>
                              <StepIcon className="w-5 h-5" />
                            </div>
                            <div className="flex-1 pt-1.5">
                              <p className={cn(
                                "font-bold transition-colors",
                                isActive ? "text-white" : "text-gray-600",
                                isCurrent && "text-lg"
                              )}>
                                {step.labelAr}
                              </p>
                              <p className="text-sm text-gray-500">{step.label}</p>
                            </div>
                            {isCurrent && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="hidden md:flex items-center gap-1 px-3 py-1 rounded-lg bg-[#76B900]/20 text-[#76B900] text-xs font-bold"
                              >
                                <span>الحالي</span>
                              </motion.div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass rounded-2xl p-6">
                  <h3 className="font-bold mb-4 flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-[#0071C5]" />
                    منتجات الطلب
                  </h3>
                  <div className="space-y-3">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                          <Cpu className="w-5 h-5 text-gray-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold truncate">{item.nameAr}</p>
                          <p className="text-xs text-gray-400">الكمية: {item.quantity}</p>
                        </div>
                        <p className="text-sm font-bold">{formatPrice(item.price * item.quantity)}</p>
                      </div>
                    ))}
                  </div>
                  <div className="h-px bg-white/5 my-4" />
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-gray-400">
                      <span>المجموع الفرعي</span>
                      <span>{formatPrice(order.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-gray-400">
                      <span>التوصيل</span>
                      <span>{formatPrice(order.deliveryCost)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg">
                      <span>الإجمالي</span>
                      <span className="bg-gradient-to-r from-[#ED1C24] via-[#76B900] to-[#0071C5] bg-clip-text text-transparent">
                        {formatPrice(order.total)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="glass rounded-2xl p-6">
                  <h3 className="font-bold mb-4 flex items-center gap-2">
                    <Package className="w-5 h-5 text-[#76B900]" />
                    معلومات التوصيل
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-gray-400">الاسم</p>
                      <p className="font-bold">{order.customerName}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">رقم الهاتف</p>
                      <p className="font-bold" dir="ltr">{order.phone}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">الولاية</p>
                      <p className="font-bold">{order.wilaya}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">البلدية</p>
                      <p className="font-bold">{order.commune}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">العنوان</p>
                      <p className="font-bold">{order.address}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">طريقة الدفع</p>
                      <p className="font-bold">{order.paymentMethod === "COD" ? "الدفع عند الاستلام" : order.paymentMethod}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

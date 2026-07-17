"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Cpu, CreditCard, Building2, Smartphone, Wallet, ArrowLeft, CheckCircle, Truck, Shield, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatPrice, generateOrderNumber } from "@/lib/utils";
import { checkoutSchema } from "@/lib/validations";
import type { CartItem, PaymentMethod, WilayaOption } from "@/types";

const WILAYAS: WilayaOption[] = [
  { id: "16", wilaya: "الجزائر", cost: 500, order: 1 },
  { id: "31", wilaya: "وهران", cost: 600, order: 2 },
  { id: "25", wilaya: "قسنطينة", cost: 600, order: 3 },
  { id: "other", wilaya: "ولايات أخرى", cost: 800, order: 4 },
];

const COMMUNES: Record<string, string[]> = {
  "16": ["الجزائر الوسطى", "باب الوادي", "القبة", "بوزريعة", "الحراش", "باب الزوار", "العاشور", "الدار البيضاء"],
  "31": ["وهران", "قديل", "بني مراد", "السانية", "الكرمة", "بطيوة", "مرسى الكبير", "العنصر"],
  "25": ["قسنطينة", "الخروب", "حامة بوزيان", "أولاد رحمون", "عين عبيد", "ابن باديس", "بني حميدان", "زيغود يوسف"],
  "other": ["أخرى"],
};

const PAYMENT_METHODS: { value: PaymentMethod; label: string; icon: typeof CreditCard; desc: string }[] = [
  { value: "COD", label: "الدفع عند الاستلام", icon: Wallet, desc: "ادفع نقداً عند استلام الطلب" },
  { value: "CCP", label: "CCP", icon: Building2, desc: "تحويل عبر بريد الجزائر" },
  { value: "BARIDIMOB", label: "BaridiMob", icon: Smartphone, desc: "تطبيق بريدي موب" },
  { value: "USDT", label: "USDT (TRC20)", icon: CreditCard, desc: "عملة رقمية USDT" },
];

const defaultCart: CartItem[] = [
  { id: "1", name: "AMD Ryzen 7 7800X3D", nameAr: "AMD Ryzen 7 7800X3D", price: 195000, quantity: 1, image: "", sku: "RYZ-7800X3D", stock: 10 },
  { id: "2", name: "NVIDIA GeForce RTX 4070 Ti", nameAr: "NVIDIA GeForce RTX 4070 Ti", price: 320000, quantity: 1, image: "", sku: "RTX-4070TI", stock: 5 },
];

interface FormData {
  fullName: string;
  phone: string;
  wilaya: string;
  commune: string;
  address: string;
  paymentMethod: PaymentMethod;
  notes: string;
}

interface FormErrors {
  [key: string]: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [placed, setPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");

  const [form, setForm] = useState<FormData>({
    fullName: "",
    phone: "",
    wilaya: "",
    commune: "",
    address: "",
    paymentMethod: "COD",
    notes: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem("pc-store-cart");
      if (stored) {
        const parsed = JSON.parse(stored);
        setCart(parsed.length > 0 ? parsed : []);
      }
    } catch { /* skip */ }
  }, []);

  const selectedWilaya = WILAYAS.find((w) => w.id === form.wilaya);
  const communes = form.wilaya ? COMMUNES[form.wilaya] || COMMUNES["other"] : [];
  const deliveryCost = selectedWilaya?.cost ?? 0;
  const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const total = subtotal + deliveryCost;

  const validateField = (name: string, value: string) => {
    try {
      (checkoutSchema as any).shape[name].parse(value);
      setErrors((prev) => ({ ...prev, [name]: "" }));
    } catch (e: any) {
      setErrors((prev) => ({ ...prev, [name]: e.errors?.[0]?.message || "حقل غير صالح" }));
    }
  };

  const handleChange = (name: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) validateField(name, value);
  };

  const handleSubmit = async () => {
    const result = checkoutSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: FormErrors = {};
      for (const issue of result.error.issues) {
        fieldErrors[issue.path[0] as string] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1500));
    const num = generateOrderNumber();
    setOrderNumber(num);
    setPlaced(true);
    localStorage.removeItem("pc-store-cart");
    setSubmitting(false);
  };

  if (!mounted) return null;

  if (placed) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass rounded-3xl p-12 text-center max-w-md w-full"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
          >
            <CheckCircle className="w-20 h-20 mx-auto mb-6 text-[#76B900]" />
          </motion.div>
          <h2 className="text-2xl font-bold mb-3">تم تقديم الطلب بنجاح!</h2>
          <p className="text-gray-400 mb-2">رقم الطلب</p>
          <p className="text-3xl font-black bg-gradient-to-r from-[#ED1C24] via-[#76B900] to-[#0071C5] bg-clip-text text-transparent mb-6">
            {orderNumber}
          </p>
          <p className="text-sm text-gray-500 mb-8">سيتم تأكيد طلبك عبر الاتصال الهاتفي قريباً</p>
          <div className="flex flex-col gap-3">
            <Link href="/order-tracking" className="w-full py-4 bg-white text-black font-bold rounded-xl text-center hover:scale-105 transition-transform">
              تتبع الطلب
            </Link>
            <Link href="/shop" className="w-full py-4 glass rounded-xl text-center hover:bg-white/10 transition-colors">
              العودة للتسوق
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <header className="glass border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <Cpu className="w-5 h-5 text-[#ED1C24]" />
            PC Store
          </Link>
          <Link href="/cart" className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" />
            العودة للسلة
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl md:text-4xl font-black mb-8">
          إتمام الطلب
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 space-y-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-6">معلومات الشحن</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-400 mb-2">الاسم الكامل</label>
                  <input
                    type="text"
                    value={form.fullName}
                    onChange={(e) => handleChange("fullName", e.target.value)}
                    placeholder="محمد علي"
                    className={cn(
                      "w-full px-4 py-3 rounded-xl bg-white/5 border text-white placeholder-gray-600 focus:outline-none transition-colors",
                      errors.fullName ? "border-red-500" : "border-white/10 focus:border-white/30"
                    )}
                  />
                  {errors.fullName && <p className="text-red-400 text-sm mt-1">{errors.fullName}</p>}
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">رقم الهاتف</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    placeholder="05XX XX XX XX"
                    className={cn(
                      "w-full px-4 py-3 rounded-xl bg-white/5 border text-white placeholder-gray-600 focus:outline-none transition-colors",
                      errors.phone ? "border-red-500" : "border-white/10 focus:border-white/30"
                    )}
                  />
                  {errors.phone && <p className="text-red-400 text-sm mt-1">{errors.phone}</p>}
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">الولاية</label>
                  <select
                    value={form.wilaya}
                    onChange={(e) => handleChange("wilaya", e.target.value)}
                    className={cn(
                      "w-full px-4 py-3 rounded-xl bg-white/5 border text-white focus:outline-none transition-colors",
                      errors.wilaya ? "border-red-500" : "border-white/10 focus:border-white/30"
                    )}
                  >
                    <option value="" className="bg-[#0a0a0f]">اختر الولاية</option>
                    {WILAYAS.map((w) => (
                      <option key={w.id} value={w.id} className="bg-[#0a0a0f]">{w.wilaya}</option>
                    ))}
                  </select>
                  {errors.wilaya && <p className="text-red-400 text-sm mt-1">{errors.wilaya}</p>}
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">البلدية</label>
                  <select
                    value={form.commune}
                    onChange={(e) => handleChange("commune", e.target.value)}
                    disabled={!form.wilaya}
                    className={cn(
                      "w-full px-4 py-3 rounded-xl bg-white/5 border text-white focus:outline-none transition-colors disabled:opacity-40",
                      errors.commune ? "border-red-500" : "border-white/10 focus:border-white/30"
                    )}
                  >
                    <option value="" className="bg-[#0a0a0f]">اختر البلدية</option>
                    {communes.map((c) => (
                      <option key={c} value={c} className="bg-[#0a0a0f]">{c}</option>
                    ))}
                  </select>
                  {errors.commune && <p className="text-red-400 text-sm mt-1">{errors.commune}</p>}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-400 mb-2">العنوان الكامل</label>
                  <input
                    type="text"
                    value={form.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                    placeholder="رقم 12، شارع فلسطين، بوزريعة"
                    className={cn(
                      "w-full px-4 py-3 rounded-xl bg-white/5 border text-white placeholder-gray-600 focus:outline-none transition-colors",
                      errors.address ? "border-red-500" : "border-white/10 focus:border-white/30"
                    )}
                  />
                  {errors.address && <p className="text-red-400 text-sm mt-1">{errors.address}</p>}
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-6">طريقة الدفع</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PAYMENT_METHODS.map((pm) => {
                  const selected = form.paymentMethod === pm.value;
                  return (
                    <button
                      key={pm.value}
                      onClick={() => handleChange("paymentMethod", pm.value)}
                      className={cn(
                        "p-4 rounded-xl border text-right transition-all",
                        selected
                          ? "border-[#76B900] bg-[#76B900]/10"
                          : "border-white/10 bg-white/5 hover:bg-white/10"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", selected ? "bg-[#76B900] text-black" : "bg-white/10 text-gray-400")}>
                          <pm.icon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold">{pm.label}</p>
                          <p className="text-xs text-gray-400">{pm.desc}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-4">ملاحظات (اختياري)</h2>
              <textarea
                value={form.notes}
                onChange={(e) => handleChange("notes", e.target.value)}
                placeholder="أي ملاحظات إضافية..."
                rows={3}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-white/30 transition-colors resize-none"
              />
            </motion.div>
          </div>

          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass rounded-2xl p-6 sticky top-24 space-y-6"
            >
              <h2 className="text-xl font-bold">ملخص الطلب</h2>

              <div className="space-y-3 max-h-60 overflow-y-auto">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                      <Cpu className="w-5 h-5 text-gray-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold truncate">{item.nameAr || item.name}</p>
                      <p className="text-xs text-gray-400">الكمية: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-bold whitespace-nowrap">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>

              <div className="h-px bg-white/5" />

              <div className="space-y-3">
                <div className="flex justify-between text-gray-400">
                  <span>المجموع الفرعي</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>التوصيل</span>
                  <span>{deliveryCost > 0 ? formatPrice(deliveryCost) : "اختر الولاية"}</span>
                </div>
                {form.wilaya && (
                  <div className="text-xs text-gray-500 bg-white/5 rounded-lg p-2">
                    <p>أسعار التوصيل حسب الولاية:</p>
                    {WILAYAS.map((w) => (
                      <p key={w.id} className={form.wilaya === w.id ? "text-[#76B900]" : ""}>
                        {w.wilaya}: {formatPrice(w.cost)}
                      </p>
                    ))}
                  </div>
                )}
                <div className="h-px bg-white/5" />
                <div className="flex justify-between text-lg font-bold">
                  <span>الإجمالي</span>
                  <span className="bg-gradient-to-r from-[#ED1C24] via-[#76B900] to-[#0071C5] bg-clip-text text-transparent">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full py-4 bg-white text-black font-bold rounded-xl text-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    جارٍ التقديم...
                  </>
                ) : (
                  "تأكيد الطلب"
                )}
              </motion.button>

              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Shield className="w-4 h-4 text-[#76B900]" />
                <span>معلوماتك آمنة ومشفرة</span>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}

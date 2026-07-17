"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Cpu, Eye, EyeOff, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { registerSchema } from "@/lib/validations";

const WILAYAS = [
  "الجزائر", "وهران", "قسنطينة", "عنابة", "البليدة", "سطيف", "تيزي وزو", "بجاية",
  "الشلف", "تيارت", "المسيلة", "بسكرة", "الوادي", "ورقلة", "تبسة", "باتنة",
  "أخرى",
];

const COMMUNES: Record<string, string[]> = {
  "الجزائر": ["الجزائر الوسطى", "باب الوادي", "القبة", "بوزريعة", "الحراش"],
  "وهران": ["وهران", "قديل", "السانية", "الكرمة"],
  "قسنطينة": ["قسنطينة", "الخروب", "حامة بوزيان"],
  "أخرى": ["أخرى"],
};

interface FormData {
  fullName: string;
  phone: string;
  email: string;
  password: string;
  wilaya: string;
  commune: string;
  address: string;
}

interface FormErrors {
  [key: string]: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<FormData>({
    fullName: "",
    phone: "",
    email: "",
    password: "",
    wilaya: "",
    commune: "",
    address: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const communes = form.wilaya ? COMMUNES[form.wilaya] || COMMUNES["أخرى"] : [];

  const handleChange = (name: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...form };
    if (!payload.email) delete payload.email;
    const result = registerSchema.safeParse(payload);
    if (!result.success) {
      const fieldErrors: FormErrors = {};
      for (const issue of result.error.issues) {
        fieldErrors[issue.path[0] as string] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    router.push("/auth/login");
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        <div className="glass rounded-3xl p-8 md:p-10">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold mb-6">
              <Cpu className="w-6 h-6 text-[#ED1C24]" />
              <span className="bg-gradient-to-r from-[#ED1C24] via-[#76B900] to-[#0071C5] bg-clip-text text-transparent">
                PC Store
              </span>
            </Link>
            <h1 className="text-2xl font-black">إنشاء حساب جديد</h1>
            <p className="text-gray-400 text-sm mt-2">انضم إلينا وابدأ ببناء جهاز أحلامك</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <label className="block text-sm text-gray-400 mb-2">البريد الإلكتروني</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="email@example.com"
                  className={cn(
                    "w-full px-4 py-3 rounded-xl bg-white/5 border text-white placeholder-gray-600 focus:outline-none transition-colors",
                    errors.email ? "border-red-500" : "border-white/10 focus:border-white/30"
                  )}
                />
                {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">كلمة المرور</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  placeholder="••••••••"
                  className={cn(
                    "w-full px-4 py-3 rounded-xl bg-white/5 border text-white placeholder-gray-600 focus:outline-none transition-colors",
                    errors.password ? "border-red-500" : "border-white/10 focus:border-white/30"
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <option key={w} value={w} className="bg-[#0a0a0f]">{w}</option>
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
            </div>

            <div>
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

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-white text-black font-bold rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  إنشاء الحساب
                </>
              )}
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              لديك حساب بالفعل؟{" "}
              <Link href="/auth/login" className="text-[#76B900] hover:underline font-bold">
                تسجيل الدخول
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

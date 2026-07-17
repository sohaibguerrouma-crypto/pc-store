"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Cpu, Eye, EyeOff, LogIn } from "lucide-react";
import { cn } from "@/lib/utils";
import { loginSchema } from "@/lib/validations";

interface FormErrors {
  phone?: string;
  password?: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");
    const result = loginSchema.safeParse({ phone, password });
    if (!result.success) {
      const fieldErrors: FormErrors = {};
      for (const issue of result.error.issues) {
        fieldErrors[issue.path[0] as keyof FormErrors] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setServerError("وظيفة تسجيل الدخول قيد التطوير");
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="glass rounded-3xl p-8 md:p-10">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold mb-6">
              <Cpu className="w-6 h-6 text-[#ED1C24]" />
              <span className="bg-gradient-to-r from-[#ED1C24] via-[#76B900] to-[#0071C5] bg-clip-text text-transparent">
                PC Store
              </span>
            </Link>
            <h1 className="text-2xl font-black">تسجيل الدخول</h1>
            <p className="text-gray-400 text-sm mt-2">أهلاً بعودتك! أدخل بيانات حسابك</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm text-gray-400 mb-2">رقم الهاتف</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => { setPhone(e.target.value); setErrors((p) => ({ ...p, phone: undefined })); }}
                placeholder="05XX XX XX XX"
                className={cn(
                  "w-full px-4 py-3 rounded-xl bg-white/5 border text-white placeholder-gray-600 focus:outline-none transition-colors",
                  errors.phone ? "border-red-500" : "border-white/10 focus:border-white/30"
                )}
              />
              {errors.phone && <p className="text-red-400 text-sm mt-1">{errors.phone}</p>}
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">كلمة المرور</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: undefined })); }}
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

            {serverError && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-400 text-sm text-center bg-red-500/10 rounded-xl p-3">
                {serverError}
              </motion.p>
            )}

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
                  <LogIn className="w-5 h-5" />
                  دخول
                </>
              )}
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              ليس لديك حساب؟{" "}
              <Link href="/auth/register" className="text-[#76B900] hover:underline font-bold">
                إنشاء حساب جديد
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { ShoppingCart, Cpu, Monitor, Trophy, Truck, Shield, Headphones, ChevronDown, ArrowLeft, Star } from "lucide-react";

const brands = [
  {
    id: "amd",
    name: "AMD",
    tagline: "الأدباء الحمر - أداء لا يتوقف",
    desc: "معالجات Ryzen وكروت Radeon بقوة هائلة للألعاب والإبداع",
    gradient: "from-[#ED1C24] via-[#FF4444] to-[#FF6B6B]",
    textColor: "text-[#ED1C24]",
    glow: "brand-glow-amd",
    products: [
      { name: "Ryzen 9 7950X", price: "285,000 دج", specs: "16 نواة / 32 خيط" },
      { name: "Ryzen 7 7800X3D", price: "195,000 دج", specs: "8 نواة / 16 خيط" },
      { name: "Radeon RX 7900 XTX", price: "380,000 دج", specs: "24GB GDDR6" },
    ],
  },
  {
    id: "nvidia",
    name: "NVIDIA",
    tagline: "القوة الخضراء - ريادة الذكاء الاصطناعي",
    desc: "أقوى كروت الشاشة GeForce RTX بأداء خارق وتقنيات DLSS وRay Tracing",
    gradient: "from-[#76B900] via-[#8BC34A] to-[#A8E64A]",
    textColor: "text-[#76B900]",
    glow: "brand-glow-nvidia",
    products: [
      { name: "GeForce RTX 4090", price: "650,000 دج", specs: "24GB GDDR6X" },
      { name: "GeForce RTX 4070 Ti", price: "320,000 دج", specs: "12GB GDDR6X" },
      { name: "GeForce RTX 4060", price: "185,000 دج", specs: "8GB GDDR6" },
    ],
  },
  {
    id: "intel",
    name: "Intel",
    tagline: "الأزرق الثابت - معايير الجودة العالمية",
    desc: "معالجات Core من الجيل الـ14 بأعلى ترددات وأداء في العالم",
    gradient: "from-[#0071C5] via-[#0099FF] to-[#00A3FF]",
    textColor: "text-[#0071C5]",
    glow: "brand-glow-intel",
    products: [
      { name: "Core i9-14900K", price: "265,000 دج", specs: "24 نواة / 32 خيط" },
      { name: "Core i7-14700K", price: "175,000 دج", specs: "20 نواة / 28 خيط" },
      { name: "Core i5-14600K", price: "125,000 دج", specs: "14 نواة / 20 خيط" },
    ],
  },
];

const features = [
  { icon: Trophy, title: "منتجات أصلية 100%", desc: "ضمان رسمي من الموزع المعتمد" },
  { icon: Truck, title: "توصيل لكل الولايات", desc: "شحن سريع لجميع ولايات الجزائر", link: "/delivery" },
  { icon: Shield, title: "ضمان لمدة سنتين", desc: "ضمان شامل على جميع القطع" },
  { icon: Headphones, title: "دعم فني 24/7", desc: "فريق دعم متخصص لمساعدتك" },
];

function ParticleField({ count = 50 }: { count?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const particles: { x: number; y: number; vx: number; vy: number; size: number; color: string }[] = [];

    const colors = ["#ED1C24", "#76B900", "#0071C5", "#FF6B6B", "#A8E64A", "#00A3FF"];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 3 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    function animate() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = 0.6;
        ctx.fill();
      }
      requestAnimationFrame(animate);
    }
    animate();

    const onResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [count]);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />;
}

function ScrollReveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function Home() {
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.95]);
  const [activeBrand, setActiveBrand] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white overflow-hidden">
      {/* ─── NAV ─── */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 glass"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2 text-xl font-bold">
              <Cpu className="w-6 h-6 text-[#ED1C24]" />
              <span className="bg-gradient-to-r from-[#ED1C24] via-[#76B900] to-[#0071C5] bg-clip-text text-transparent">
                PC Store
              </span>
            </Link>
            <nav className="hidden md:flex items-center gap-8 text-sm text-gray-300">
              <Link href="/shop" className="hover:text-white transition-colors">المتجر</Link>
              <Link href="/shop?brand=amd" className="hover:text-[#ED1C24] transition-colors">AMD</Link>
              <Link href="/shop?brand=nvidia" className="hover:text-[#76B900] transition-colors">NVIDIA</Link>
              <Link href="/shop?brand=intel" className="hover:text-[#0071C5] transition-colors">Intel</Link>
              <Link href="/order-tracking" className="hover:text-white transition-colors">تتبع الطلب</Link>
            </nav>
            <div className="flex items-center gap-4">
              <Link href="/cart" className="relative p-2 hover:bg-white/5 rounded-lg transition-colors">
                <ShoppingCart className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 bg-[#ED1C24] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">0</span>
              </Link>
              <Link href="/auth/login" className="glass px-4 py-2 rounded-lg text-sm hover:bg-white/10 transition-all">
                دخول
              </Link>
            </div>
          </div>
        </div>
      </motion.header>

      {/* ─── HERO ─── */}
      <motion.section style={{ opacity: heroOpacity, scale: heroScale }} className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        <ParticleField count={60} />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0a0f]/50 to-[#0a0a0f] pointer-events-none z-[1]" />
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.2 }}>
            <div className="flex items-center justify-center gap-4 mb-6">
              <span className="text-[#ED1C24] text-4xl font-black">AMD</span>
              <span className="text-gray-600 text-2xl font-light">|</span>
              <span className="text-[#76B900] text-4xl font-black">NVIDIA</span>
              <span className="text-gray-600 text-2xl font-light">|</span>
              <span className="text-[#0071C5] text-4xl font-black">Intel</span>
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-tight mb-6">
              ابني جهاز
              <br />
              <span className="bg-gradient-to-r from-[#ED1C24] via-[#76B900] to-[#0071C5] bg-clip-text text-transparent">
                أحلامك
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              أفضل قطع الكمبيوتر من AMD, NVIDIA, Intel بأرخص الأسعار في الجزائر. معالجات، كروت شاشة، رامات، وحدات تخزين، وأكثر.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/shop" className="group relative px-8 py-4 bg-white text-black font-bold rounded-xl text-lg overflow-hidden transition-all hover:scale-105">
                <span className="relative z-10">تسوق الآن</span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#ED1C24] via-[#76B900] to-[#0071C5] opacity-0 group-hover:opacity-20 transition-opacity" />
              </Link>
              <Link href="/shop/prebuilt" className="group px-8 py-4 glass rounded-xl text-lg font-bold hover:bg-white/10 transition-all">
                تصفح التجميعات الجاهزة
                <ArrowLeft className="inline mr-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <ChevronDown className="w-8 h-8 text-gray-500" />
          </motion.div>
        </div>
      </motion.section>

      {/* ─── FEATURES ─── */}
      <section className="relative py-20 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {features.map((f, i) => (
            <ScrollReveal key={i} delay={i * 0.1}>
              <div className="glass p-6 rounded-2xl text-center hover:scale-105 transition-transform duration-300">
                <f.icon className="w-10 h-10 mx-auto mb-4 text-white/80" />
                <h3 className="font-bold mb-2">{f.title}</h3>
                <p className="text-sm text-gray-400">{f.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ─── BRAND SECTIONS ─── */}
      {brands.map((brand, idx) => (
        <section key={brand.id} className={`relative py-24 px-4 overflow-hidden ${idx % 2 === 1 ? "bg-white/[0.02]" : ""}`}>
          <div className={`absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r ${brand.gradient} opacity-[0.03] pointer-events-none`} />
          <div className={`absolute bottom-0 right-0 w-1/2 h-1/2 bg-gradient-to-tl ${brand.gradient} opacity-[0.02] pointer-events-none`} />

          <div className="max-w-7xl mx-auto relative z-10">
            <ScrollReveal>
              <div className={`flex items-center gap-4 mb-4 ${idx % 2 === 0 ? "" : "flex-row-reverse"}`}>
                <div className={`w-16 h-16 rounded-2xl ${brand.glow} flex items-center justify-center text-2xl font-black ${brand.textColor} glass`}>
                  {brand.name[0]}
                </div>
                <div>
                  <h2 className="text-4xl md:text-5xl font-black">
                    <span className={`text-gradient-${brand.id}`}>{brand.name}</span>
                  </h2>
                  <p className="text-gray-400 text-lg">{brand.tagline}</p>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <p className="text-gray-300 text-lg mb-10 max-w-3xl">{brand.desc}</p>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {brand.products.map((p, i) => (
                <ScrollReveal key={i} delay={0.1 * i}>
                  <motion.div
                    whileHover={{ scale: 1.03, y: -5 }}
                    className={`glass rounded-2xl p-6 border-t-2 ${
                      brand.id === "amd" ? "border-t-[#ED1C24]" : brand.id === "nvidia" ? "border-t-[#76B900]" : "border-t-[#0071C5]"
                    } ${brand.glow} hover:bg-white/[0.08] transition-all cursor-pointer`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className={`text-xs font-bold uppercase ${brand.textColor}`}>{brand.name}</span>
                      <Star className="w-4 h-4 text-yellow-500" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{p.name}</h3>
                    <p className="text-sm text-gray-400 mb-4">{p.specs}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-black">{p.price}</span>
                      <button className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                        brand.id === "amd" ? "bg-[#ED1C24] hover:bg-[#B8141A]" : brand.id === "nvidia" ? "bg-[#76B900] hover:bg-[#5A8C00]" : "bg-[#0071C5] hover:bg-[#005499]"
                      }`}>
                        أضف للسلة
                      </button>
                    </div>
                  </motion.div>
                </ScrollReveal>
              ))}
            </div>

            <ScrollReveal delay={0.3}>
              <Link href={`/shop?brand=${brand.id}`} className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${
                brand.id === "amd" ? "text-[#ED1C24] hover:bg-[#ED1C24]/10" : brand.id === "nvidia" ? "text-[#76B900] hover:bg-[#76B900]/10" : "text-[#0071C5] hover:bg-[#0071C5]/10"
              }`}>
                عرض كل منتجات {brand.name}
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </ScrollReveal>
          </div>
        </section>
      ))}

      {/* ─── CTA ─── */}
      <section className="relative py-32 px-4">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <ScrollReveal>
            <h2 className="text-4xl md:text-6xl font-black mb-6">
              جهز نفسك
              <br />
              <span className="bg-gradient-to-r from-[#ED1C24] via-[#76B900] to-[#0071C5] bg-clip-text text-transparent">
                لأقوى تجربة
              </span>
            </h2>
            <p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto">
              اختر قطعك المفضلة من أشهر الماركات العالمية واحصل على أفضل الأسعار مع التوصيل لكل الولايات
            </p>
            <Link href="/shop" className="inline-block px-10 py-4 bg-white text-black font-bold rounded-xl text-lg hover:scale-105 transition-transform">
              ابدأ البناء الآن
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-white/5 py-12 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 text-xl font-bold mb-4">
              <Cpu className="w-5 h-5 text-[#ED1C24]" />
              <span>PC Store</span>
            </div>
            <p className="text-sm text-gray-500">أفضل متجر لقطع الكمبيوتر في الجزائر</p>
          </div>
          <div>
            <h4 className="font-bold mb-4">الأقسام</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/shop?category=processors" className="hover:text-white transition-colors">معالجات</Link></li>
              <li><Link href="/shop?category=gpus" className="hover:text-white transition-colors">كروت شاشة</Link></li>
              <li><Link href="/shop?category=memory" className="hover:text-white transition-colors">رامات</Link></li>
              <li><Link href="/shop?category=storage" className="hover:text-white transition-colors">تخزين</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">الماركات</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/shop?brand=amd" className="hover:text-[#ED1C24] transition-colors">AMD</Link></li>
              <li><Link href="/shop?brand=nvidia" className="hover:text-[#76B900] transition-colors">NVIDIA</Link></li>
              <li><Link href="/shop?brand=intel" className="hover:text-[#0071C5] transition-colors">Intel</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">خدمة العملاء</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link href="/order-tracking" className="hover:text-white transition-colors">تتبع الطلب</Link></li>
              <li><Link href="/delivery" className="hover:text-white transition-colors">معلومات التوصيل</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">اتصل بنا</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-white/5 text-center text-sm text-gray-600">
          © 2026 PC Store. جميع الحقوق محفوظة.
        </div>
      </footer>
    </div>
  );
}

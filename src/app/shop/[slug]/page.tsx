"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  Cpu,
  Monitor,
  HardDrive,
  MemoryStick,
  Star,
  ShoppingCart,
  Minus,
  Plus,
  Shield,
  Truck,
  RefreshCw,
  ChevronLeft,
  ZoomIn,
} from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

// ─── Types ───────────────────────────────────────────────
interface Product {
  id: string;
  name: string;
  nameAr: string;
  slug: string;
  price: number;
  compareAtPrice: number | null;
  brand: "AMD" | "NVIDIA" | "Intel";
  category: "processors" | "gpus" | "ram" | "storage";
  image: string;
  images: string[];
  rating: number;
  reviewCount: number;
  stock: number;
  sku: string;
  specs: Record<string, string>;
  description: string;
  descriptionAr: string;
  createdAt: string;
}

// ─── Mock Data ───────────────────────────────────────────
const MOCK_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "AMD Ryzen 7 7800X3D",
    nameAr: "AMD رايزن 7 7800X3D",
    slug: "amd-ryzen-7-7800x3d",
    price: 189000,
    compareAtPrice: 210000,
    brand: "AMD",
    category: "processors",
    image: "/images/products/ryzen-7800x3d.jpg",
    images: ["/images/products/ryzen-7800x3d.jpg", "/images/products/ryzen-7800x3d-2.jpg"],
    rating: 4.8,
    reviewCount: 124,
    stock: 15,
    sku: "AMD-R7-7800X3D",
    specs: {
      "النواة": "8",
      "الخيوط": "16",
      "التردد الأساسي": "4.2 جيجاهرتز",
      "التردد المعزز": "5.0 جيجاهرتز",
      "ذاكرة التخزين المؤقت L3": "104 ميجابايت",
      "دعم الذاكرة": "DDR5-5200",
      "استهلاك الطاقة (TDP)": "120 واط",
      "المقبس": "AM5",
    },
    description: "The AMD Ryzen 7 7800X3D features 3D V-Cache technology for ultimate gaming performance.",
    descriptionAr: "يتميز معالج AMD رايزن 7 7800X3D بتقنية 3D V-Cache لتقديم أداء ألعاب فائق.",
    createdAt: "2025-01-15",
  },
  {
    id: "2",
    name: "AMD Ryzen 9 7950X",
    nameAr: "AMD رايزن 9 7950X",
    slug: "amd-ryzen-9-7950x",
    price: 265000,
    compareAtPrice: 295000,
    brand: "AMD",
    category: "processors",
    image: "/images/products/ryzen-7950x.jpg",
    images: ["/images/products/ryzen-7950x.jpg", "/images/products/ryzen-7950x-2.jpg"],
    rating: 4.7,
    reviewCount: 89,
    stock: 8,
    sku: "AMD-R9-7950X",
    specs: {
      "النواة": "16",
      "الخيوط": "32",
      "التردد الأساسي": "4.5 جيجاهرتز",
      "التردد المعزز": "5.7 جيجاهرتز",
      "ذاكرة التخزين المؤقت L3": "80 ميجابايت",
      "دعم الذاكرة": "DDR5-5200",
      "استهلاك الطاقة (TDP)": "170 واط",
      "المقبس": "AM5",
    },
    description: "AMD's flagship 16-core processor for creators and professionals.",
    descriptionAr: "المعالج الرائد من AMD بـ 16 نواة للمبدعين والمحترفين.",
    createdAt: "2024-11-20",
  },
  {
    id: "5",
    name: "NVIDIA GeForce RTX 4090",
    nameAr: "إنفيديا جي فورس RTX 4090",
    slug: "nvidia-geforce-rtx-4090",
    price: 485000,
    compareAtPrice: 520000,
    brand: "NVIDIA",
    category: "gpus",
    image: "/images/products/rtx-4090.jpg",
    images: ["/images/products/rtx-4090.jpg", "/images/products/rtx-4090-2.jpg"],
    rating: 4.9,
    reviewCount: 312,
    stock: 5,
    sku: "NVIDIA-RTX4090",
    specs: {
      "ذاكرة": "24 جيجابايت GDDR6X",
      "نوى CUDA": "16384",
      "التردد المعزز": "2.52 جيجاهرتز",
      "عرض النطاق الترددي": "1008 جيجابايت/ث",
      "الاستهلاك": "450 واط",
      "الواجهة": "PCIe 4.0 x16",
      "المخرجات": "HDMI 2.1 + 3× DisplayPort 1.4a",
    },
    description: "The world's fastest graphics card for gaming and creative work.",
    descriptionAr: "أسرع بطاقة رسوميات في العالم للألعاب والعمل الإبداعي.",
    createdAt: "2024-10-15",
  },
  {
    id: "10",
    name: "Samsung 990 Pro 2TB NVMe",
    nameAr: "سامسونج 990 Pro 2 تيرابايت NVMe",
    slug: "samsung-990-pro-2tb-nvme",
    price: 65000,
    compareAtPrice: 75000,
    brand: "Intel",
    category: "storage",
    image: "/images/products/990-pro.jpg",
    images: ["/images/products/990-pro.jpg", "/images/products/990-pro-2.jpg"],
    rating: 4.9,
    reviewCount: 378,
    stock: 25,
    sku: "SSD-990PRO-2TB",
    specs: {
      "السعة": "2 تيرابايت",
      "الواجهة": "M.2 NVMe PCIe 4.0",
      "القراءة المتسلسلة": "7450 ميجابايت/ث",
      "الكتابة المتسلسلة": "6900 ميجابايت/ث",
      "القراءة العشوائية": "1,200,000 IOPS",
      "الكتابة العشوائية": "1,150,000 IOPS",
      "الضمان": "5 سنوات",
    },
    description: "Samsung's premium NVMe SSD with industry-leading speeds.",
    descriptionAr: "أفضل قرص NVMe من سامسونج بسرعات رائدة.",
    createdAt: "2024-09-10",
  },
  {
    id: "8",
    name: "G.Skill Trident Z5 32GB DDR5",
    nameAr: "جي سكيل ترايدنت Z5 32 جيجابايت DDR5",
    slug: "gskill-trident-z5-32gb-ddr5",
    price: 42000,
    compareAtPrice: 48000,
    brand: "Intel",
    category: "ram",
    image: "/images/products/trident-z5.jpg",
    images: ["/images/products/trident-z5.jpg", "/images/products/trident-z5-2.jpg"],
    rating: 4.8,
    reviewCount: 245,
    stock: 30,
    sku: "GSKILL-TZ5-32GB",
    specs: {
      "السعة": "32 جيجابايت (2×16)",
      "النوع": "DDR5-6000",
      "الزمن (CAS Latency)": "CL30",
      "الجهد": "1.35 فولت",
      "تبريد": "مشعاع ألومنيوم",
      "إضاءة": "RGB قابلة للتخصيص",
    },
    description: "High-performance DDR5 memory kit with RGB lighting.",
    descriptionAr: "طقم ذاكرة DDR5 عالي الأداء مع إضاءة RGB.",
    createdAt: "2025-02-20",
  },
  {
    id: "6",
    name: "NVIDIA GeForce RTX 4070 Ti",
    nameAr: "إنفيديا جي فورس RTX 4070 Ti",
    slug: "nvidia-geforce-rtx-4070-ti",
    price: 275000,
    compareAtPrice: null,
    brand: "NVIDIA",
    category: "gpus",
    image: "/images/products/rtx-4070ti.jpg",
    images: ["/images/products/rtx-4070ti.jpg", "/images/products/rtx-4070ti-2.jpg"],
    rating: 4.7,
    reviewCount: 198,
    stock: 18,
    sku: "NVIDIA-RTX4070TI",
    specs: {
      "ذاكرة": "12 جيجابايت GDDR6X",
      "نوى CUDA": "7680",
      "التردد المعزز": "2.61 جيجاهرتز",
      "الاستهلاك": "285 واط",
      "الواجهة": "PCIe 4.0 x16",
      "المخرجات": "HDMI 2.1 + 3× DisplayPort 1.4a",
    },
    description: "Excellent 1440p gaming performance with DLSS 3.",
    descriptionAr: "أداء ممتاز لألعاب 1440p مع تقنية DLSS 3.",
    createdAt: "2025-03-05",
  },
];

// ─── Related Products Data ───────────────────────────────
const RELATED_PRODUCTS = [
  {
    id: "r1",
    nameAr: "AMD رايزن 5 7600",
    slug: "amd-ryzen-5-7600",
    price: 92000,
    brand: "AMD",
    category: "processors",
    rating: 4.6,
    reviewCount: 312,
    stock: 28,
  },
  {
    id: "r2",
    nameAr: "إنتل كور i7-14700K",
    slug: "intel-core-i7-14700k",
    price: 165000,
    brand: "Intel",
    category: "processors",
    rating: 4.5,
    reviewCount: 203,
    stock: 22,
  },
  {
    id: "r3",
    nameAr: "إنفيديا جي فورس RTX 4060",
    slug: "nvidia-geforce-rtx-4060",
    price: 145000,
    brand: "NVIDIA",
    category: "gpus",
    rating: 4.4,
    reviewCount: 189,
    stock: 3,
  },
];

function ZoomableImage({ src, alt }: { src: string; alt: string }) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  return (
    <div
      ref={containerRef}
      className="relative aspect-square bg-gradient-to-br from-white/5 to-white/[0.02] rounded-2xl overflow-hidden cursor-crosshair group"
      onMouseEnter={() => setIsZoomed(true)}
      onMouseLeave={() => setIsZoomed(false)}
      onMouseMove={handleMouseMove}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <Monitor className="h-20 w-20 mx-auto opacity-10 text-white" />
          <span className="text-xs text-white/20 mt-2 block">{alt}</span>
        </div>
      </div>

      <img
        src={src}
        alt={alt}
        className="w-full h-full object-contain p-8 opacity-80"
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = "none";
        }}
      />

      {isZoomed && (
        <div
          className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
        >
          <ZoomIn className="h-8 w-8 text-white/60" />
        </div>
      )}

      {/* Lens */}
      {isZoomed && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(circle 120px at ${mousePos.x}% ${mousePos.y}%, transparent 0%, rgba(0,0,0,0.6) 100%)`,
          }}
        />
      )}
    </div>
  );
}

function SpecsTable({ specs }: { specs: Record<string, string> }) {
  const entries = Object.entries(specs);
  return (
    <div className="divide-y divide-white/5 rounded-2xl overflow-hidden border border-white/5">
      {entries.map(([key, value], i) => (
        <motion.div
          key={key}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: i * 0.05 }}
          className="flex justify-between items-center py-3 px-4 hover:bg-white/[0.02] transition-colors"
        >
          <span className="text-sm text-white/50">{key}</span>
          <span className="text-sm text-white/90 font-medium">{value}</span>
        </motion.div>
      ))}
    </div>
  );
}

function StockBadge({ stock }: { stock: number }) {
  if (stock > 10) {
    return (
      <Badge variant="success" dot pulse>
        متوفر
      </Badge>
    );
  }
  if (stock > 0) {
    return (
      <Badge variant="warning" dot pulse>
        مخزون محدود ({stock} قطع)
      </Badge>
    );
  }
  return (
    <Badge variant="outOfStock" dot>
      غير متوفر
    </Badge>
  );
}

function RelatedProductCard({
  product,
}: {
  product: (typeof RELATED_PRODUCTS)[number];
}) {
  const brandColor =
    product.brand === "AMD"
      ? "text-amd border-amd/30"
      : product.brand === "NVIDIA"
        ? "text-nvidia border-nvidia/30"
        : "text-intel border-intel/30";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      <Link href={`/shop/${product.slug}`} className="block group">
        <Card
          brand={
            product.brand === "AMD"
              ? "amd"
              : product.brand === "NVIDIA"
                ? "nvidia"
                : "intel"
          }
          className="h-full"
        >
          <div className="aspect-square bg-gradient-to-br from-white/5 to-white/[0.02] flex items-center justify-center">
            <Cpu className={cn("h-16 w-16 opacity-20", brandColor)} />
          </div>
          <CardContent>
            <span className={cn("text-[11px] font-semibold uppercase tracking-widest", brandColor)}>
              {product.brand}
            </span>
            <h4 className="mt-1.5 text-sm font-medium text-white/90 leading-snug line-clamp-2 group-hover:text-white transition-colors">
              {product.nameAr}
            </h4>
            <div className="mt-2 flex items-center gap-1.5">
              <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
              <span className="text-xs text-white/60">{product.rating}</span>
              <span className="text-[10px] text-white/30">({product.reviewCount})</span>
            </div>
            <div className="mt-3 text-lg font-bold text-white">
              {formatPrice(product.price)}
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}

// ─── Main Page ───────────────────────────────────────────
export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const product = useMemo(
    () => MOCK_PRODUCTS.find((p) => p.slug === slug) || null,
    [slug]
  );

  useEffect(() => {
    setQuantity(1);
    setSelectedImage(0);
  }, [slug]);

  if (!product) {
    return (
      <main className="min-h-screen flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <div className="mb-6 flex h-20 w-20 mx-auto items-center justify-center rounded-full bg-white/5">
            <Cpu className="h-10 w-10 text-white/30" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">المنتج غير موجود</h2>
          <p className="text-white/40 mb-8">عذراً، لم نتمكن من العثور على المنتج المطلوب.</p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 rounded-full bg-white/10 px-6 py-3 text-sm font-medium text-white/80 hover:bg-white/15 transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
            العودة إلى المتجر
          </Link>
        </div>
      </main>
    );
  }

  const brandColor =
    product.brand === "AMD"
      ? "text-amd"
      : product.brand === "NVIDIA"
        ? "text-nvidia"
        : "text-intel";

  const brandBg =
    product.brand === "AMD"
      ? "bg-amd/10"
      : product.brand === "NVIDIA"
        ? "bg-nvidia/10"
        : "bg-intel/10";

  const brandBorder =
    product.brand === "AMD"
      ? "border-amd/30"
      : product.brand === "NVIDIA"
        ? "border-nvidia/30"
        : "border-intel/30";

  const brandGradient =
    product.brand === "AMD"
      ? "from-amd/20 via-transparent to-transparent"
      : product.brand === "NVIDIA"
        ? "from-nvidia/20 via-transparent to-transparent"
        : "from-intel/20 via-transparent to-transparent";

  const categoryIcon = {
    processors: Cpu,
    gpus: Monitor,
    ram: MemoryStick,
    storage: HardDrive,
  }[product.category];

  const CategoryIcon = categoryIcon;

  const discount = product.compareAtPrice
    ? Math.round((1 - product.price / product.compareAtPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    console.log("Added to cart:", { product: product.id, quantity, price: product.price });
  };

  return (
    <main className="min-h-screen pb-24" dir="rtl">
      {/* Brand Header */}
      <div className={cn("h-1 w-full", brandBg)} />

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
        <motion.nav
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-xs text-white/40"
        >
          <Link href="/" className="hover:text-white/70 transition-colors">
            الرئيسية
          </Link>
          <ChevronLeft className="h-3 w-3" />
          <Link href="/shop" className="hover:text-white/70 transition-colors">
            المتجر
          </Link>
          <ChevronLeft className="h-3 w-3" />
          <span className="text-white/60">{product.nameAr}</span>
        </motion.nav>
      </div>

      {/* Product Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <ZoomableImage
              src={product.images[selectedImage] || product.image}
              alt={product.nameAr}
            />
            {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={cn(
                      "relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all duration-200",
                      selectedImage === idx
                        ? `${brandBorder} opacity-100`
                        : "border-transparent opacity-50 hover:opacity-80"
                    )}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/[0.02] flex items-center justify-center">
                      <CategoryIcon className={cn("h-6 w-6 opacity-30", brandColor)} />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-6"
          >
            {/* Brand & Category */}
            <div className="flex items-center gap-3 flex-wrap">
              <span className={cn("text-sm font-semibold uppercase tracking-widest", brandColor)}>
                {product.brand}
              </span>
              <span className="text-white/20">•</span>
              <span className="flex items-center gap-1.5 text-xs text-white/50">
                <CategoryIcon className="h-3.5 w-3.5" />
                {product.category === "processors"
                  ? "معالجات"
                  : product.category === "gpus"
                    ? "بطاقات رسوميات"
                    : product.category === "ram"
                      ? "رامات"
                      : "تخزين"}
              </span>
            </div>

            {/* Name */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight">
              {product.nameAr}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-4 w-4",
                      i < Math.floor(product.rating)
                        ? "text-amber-400 fill-amber-400"
                        : "text-white/20"
                    )}
                  />
                ))}
              </div>
              <span className="text-sm text-white/60">
                {product.rating} ({product.reviewCount} تقييم)
              </span>
            </div>

            {/* Stock */}
            <StockBadge stock={product.stock} />

            {/* Price */}
            <div className="flex items-end gap-3">
              <span className="text-3xl sm:text-4xl font-bold text-white">
                {formatPrice(product.price)}
              </span>
              {product.compareAtPrice && (
                <>
                  <span className="text-lg text-white/30 line-through mb-1">
                    {formatPrice(product.compareAtPrice)}
                  </span>
                  <Badge variant="danger" size="sm" className="mb-1">
                    وفر {discount}%
                  </Badge>
                </>
              )}
            </div>

            {/* Description */}
            <p className="text-sm text-white/60 leading-relaxed">
              {product.descriptionAr}
            </p>

            {/* Divider */}
            <div className="border-t border-white/5" />

            {/* Quantity Selector & Add to Cart */}
            <div className="flex items-center gap-4">
              <div className="flex items-center glass rounded-xl">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className="flex h-11 w-11 items-center justify-center text-white/60 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors rounded-r-xl"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="flex h-11 w-14 items-center justify-center text-sm font-medium text-white border-x border-white/10">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock}
                  className="flex h-11 w-11 items-center justify-center text-white/60 hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors rounded-l-xl"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className={cn(
                  "flex-1 inline-flex items-center justify-center gap-2 rounded-xl py-3 px-6 text-sm font-semibold transition-all duration-300",
                  product.stock === 0
                    ? "bg-white/10 text-white/30 cursor-not-allowed"
                    : product.brand === "AMD"
                      ? "bg-amd text-white hover:bg-amd-dark shadow-[0_0_20px_rgba(237,28,36,0.3)] hover:shadow-[0_0_30px_rgba(237,28,36,0.5)]"
                      : product.brand === "NVIDIA"
                        ? "bg-nvidia text-white hover:bg-nvidia-dark shadow-[0_0_20px_rgba(118,185,0,0.3)] hover:shadow-[0_0_30px_rgba(118,185,0,0.5)]"
                        : "bg-intel text-white hover:bg-intel-dark shadow-[0_0_20px_rgba(0,113,197,0.3)] hover:shadow-[0_0_30px_rgba(0,113,197,0.5)]"
                )}
              >
                <ShoppingCart className="h-4 w-4" />
                {product.stock === 0 ? "غير متوفر" : "أضف إلى السلة"}
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-3">
              <div className="glass rounded-xl p-3 text-center">
                <Truck className={cn("h-5 w-5 mx-auto mb-1", brandColor)} />
                <span className="text-[10px] text-white/50">توصيل سريع</span>
              </div>
              <div className="glass rounded-xl p-3 text-center">
                <Shield className={cn("h-5 w-5 mx-auto mb-1", brandColor)} />
                <span className="text-[10px] text-white/50">ضمان أصلي</span>
              </div>
              <div className="glass rounded-xl p-3 text-center">
                <RefreshCw className={cn("h-5 w-5 mx-auto mb-1", brandColor)} />
                <span className="text-[10px] text-white/50">إرجاع مجاني</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Full Specs Table */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardContent className="p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", brandBg)}>
                  <CategoryIcon className={cn("h-5 w-5", brandColor)} />
                </div>
                <h2 className="text-xl font-bold text-white">المواصفات الكاملة</h2>
              </div>
              <SpecsTable specs={product.specs} />
            </CardContent>
          </Card>
        </motion.div>
      </section>

      {/* Related Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-xl font-bold text-white mb-8">منتجات ذات صلة</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {RELATED_PRODUCTS.map((rp) => (
              <RelatedProductCard key={rp.id} product={rp} />
            ))}
          </div>
        </motion.div>
      </section>
    </main>
  );
}

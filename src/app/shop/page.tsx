"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  SlidersHorizontal,
  X,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Cpu,
  Monitor,
  HardDrive,
  MemoryStick,
  Package,
  Star,
  Clock,
  ArrowUpDown,
  Loader2,
  Laptop,
} from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";
import { Card, CardContent, CardFooter } from "@/components/ui/Card";
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
  createdAt: string;
}

type SortOption = "price-asc" | "price-desc" | "name" | "newest";

interface Filters {
  brands: string[];
  categories: string[];
  minPrice: number;
  maxPrice: number;
  search: string;
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
    images: ["/images/products/ryzen-7800x3d.jpg"],
    rating: 4.8,
    reviewCount: 124,
    stock: 15,
    sku: "AMD-R7-7800X3D",
    specs: { "النواة": "8", "الخيوط": "16", "التردد": "5.0 جيجاهرتز", "ذاكرة التخزين المؤقت": "104 ميجابايت" },
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
    images: ["/images/products/ryzen-7950x.jpg"],
    rating: 4.7,
    reviewCount: 89,
    stock: 8,
    sku: "AMD-R9-7950X",
    specs: { "النواة": "16", "الخيوط": "32", "التردد": "5.7 جيجاهرتز", "ذاكرة التخزين المؤقت": "80 ميجابايت" },
    createdAt: "2024-11-20",
  },
  {
    id: "3",
    name: "Intel Core i9-14900K",
    nameAr: "إنتل كور i9-14900K",
    slug: "intel-core-i9-14900k",
    price: 235000,
    compareAtPrice: null,
    brand: "Intel",
    category: "processors",
    image: "/images/products/i9-14900k.jpg",
    images: ["/images/products/i9-14900k.jpg"],
    rating: 4.6,
    reviewCount: 156,
    stock: 12,
    sku: "INTEL-I9-14900K",
    specs: { "النواة": "24", "الخيوط": "32", "التردد": "6.0 جيجاهرتز", "ذاكرة التخزين المؤقت": "36 ميجابايت" },
    createdAt: "2025-02-01",
  },
  {
    id: "4",
    name: "Intel Core i7-14700K",
    nameAr: "إنتل كور i7-14700K",
    slug: "intel-core-i7-14700k",
    price: 165000,
    compareAtPrice: 185000,
    brand: "Intel",
    category: "processors",
    image: "/images/products/i7-14700k.jpg",
    images: ["/images/products/i7-14700k.jpg"],
    rating: 4.5,
    reviewCount: 203,
    stock: 22,
    sku: "INTEL-I7-14700K",
    specs: { "النواة": "20", "الخيوط": "28", "التردد": "5.6 جيجاهرتز", "ذاكرة التخزين المؤقت": "33 ميجابايت" },
    createdAt: "2025-01-10",
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
    images: ["/images/products/rtx-4090.jpg"],
    rating: 4.9,
    reviewCount: 312,
    stock: 5,
    sku: "NVIDIA-RTX4090",
    specs: { "ذاكرة": "24 جيجابايت GDDR6X", "النواة": "16384 CUDA", "التردد": "2.52 جيجاهرتز", "الاستهلاك": "450 واط" },
    createdAt: "2024-10-15",
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
    images: ["/images/products/rtx-4070ti.jpg"],
    rating: 4.7,
    reviewCount: 198,
    stock: 18,
    sku: "NVIDIA-RTX4070TI",
    specs: { "ذاكرة": "12 جيجابايت GDDR6X", "النواة": "7680 CUDA", "التردد": "2.61 جيجاهرتز", "الاستهلاك": "285 واط" },
    createdAt: "2025-03-05",
  },
  {
    id: "7",
    name: "AMD Radeon RX 7900 XTX",
    nameAr: "AMD راديون RX 7900 XTX",
    slug: "amd-radeon-rx-7900-xtx",
    price: 315000,
    compareAtPrice: 350000,
    brand: "AMD",
    category: "gpus",
    image: "/images/products/rx-7900xtx.jpg",
    images: ["/images/products/rx-7900xtx.jpg"],
    rating: 4.6,
    reviewCount: 87,
    stock: 7,
    sku: "AMD-RX7900XTX",
    specs: { "ذاكرة": "24 جيجابايت GDDR6", "النواة": "6144 RDNA 3", "التردد": "2.5 جيجاهرتز", "الاستهلاك": "355 واط" },
    createdAt: "2024-12-01",
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
    images: ["/images/products/trident-z5.jpg"],
    rating: 4.8,
    reviewCount: 245,
    stock: 30,
    sku: "GSKILL-TZ5-32GB",
    specs: { "السعة": "32 جيجابايت (2×16)", "النوع": "DDR5-6000", "الزمن": "CL30", "الجهد": "1.35 فولت" },
    createdAt: "2025-02-20",
  },
  {
    id: "9",
    name: "Corsair Vengeance 64GB DDR5",
    nameAr: "كورسير فينجينس 64 جيجابايت DDR5",
    slug: "corsair-vengeance-64gb-ddr5",
    price: 78000,
    compareAtPrice: null,
    brand: "AMD",
    category: "ram",
    image: "/images/products/vengeance-64gb.jpg",
    images: ["/images/products/vengeance-64gb.jpg"],
    rating: 4.7,
    reviewCount: 132,
    stock: 14,
    sku: "CORS-VEN-64GB",
    specs: { "السعة": "64 جيجابايت (2×32)", "النوع": "DDR5-5600", "الزمن": "CL36", "الجهد": "1.25 فولت" },
    createdAt: "2025-01-25",
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
    images: ["/images/products/990-pro.jpg"],
    rating: 4.9,
    reviewCount: 378,
    stock: 25,
    sku: "SSD-990PRO-2TB",
    specs: { "السعة": "2 تيرابايت", "الواجهة": "M.2 NVMe PCIe 4.0", "القراءة": "7450 ميجابايت/ث", "الكتابة": "6900 ميجابايت/ث" },
    createdAt: "2024-09-10",
  },
  {
    id: "11",
    name: "WD Black SN850X 1TB",
    nameAr: "ويسترن ديجتال بلاك SN850X 1 تيرابايت",
    slug: "wd-black-sn850x-1tb",
    price: 35000,
    compareAtPrice: 42000,
    brand: "AMD",
    category: "storage",
    image: "/images/products/sn850x.jpg",
    images: ["/images/products/sn850x.jpg"],
    rating: 4.6,
    reviewCount: 167,
    stock: 40,
    sku: "WDBLACK-SN850X-1TB",
    specs: { "السعة": "1 تيرابايت", "الواجهة": "M.2 NVMe PCIe 4.0", "القراءة": "7300 ميجابايت/ث", "الكتابة": "6300 ميجابايت/ث" },
    createdAt: "2025-03-15",
  },
  {
    id: "12",
    name: "Intel Core i5-14600K",
    nameAr: "إنتل كور i5-14600K",
    slug: "intel-core-i5-14600k",
    price: 110000,
    compareAtPrice: null,
    brand: "Intel",
    category: "processors",
    image: "/images/products/i5-14600k.jpg",
    images: ["/images/products/i5-14600k.jpg"],
    rating: 4.5,
    reviewCount: 267,
    stock: 35,
    sku: "INTEL-I5-14600K",
    specs: { "النواة": "14", "الخيوط": "20", "التردد": "5.3 جيجاهرتز", "ذاكرة التخزين المؤقت": "24 ميجابايت" },
    createdAt: "2025-02-10",
  },
  {
    id: "13",
    name: "NVIDIA GeForce RTX 4060",
    nameAr: "إنفيديا جي فورس RTX 4060",
    slug: "nvidia-geforce-rtx-4060",
    price: 145000,
    compareAtPrice: 160000,
    brand: "NVIDIA",
    category: "gpus",
    image: "/images/products/rtx-4060.jpg",
    images: ["/images/products/rtx-4060.jpg"],
    rating: 4.4,
    reviewCount: 189,
    stock: 3,
    sku: "NVIDIA-RTX4060",
    specs: { "ذاكرة": "8 جيجابايت GDDR6", "النواة": "3072 CUDA", "التردد": "2.46 جيجاهرتز", "الاستهلاك": "115 واط" },
    createdAt: "2025-04-01",
  },
  {
    id: "14",
    name: "Corsair MP600 Pro XT 2TB",
    nameAr: "كورسير MP600 Pro XT 2 تيرابايت",
    slug: "corsair-mp600-pro-xt-2tb",
    price: 58000,
    compareAtPrice: 65000,
    brand: "NVIDIA",
    category: "storage",
    image: "/images/products/mp600.jpg",
    images: ["/images/products/mp600.jpg"],
    rating: 4.5,
    reviewCount: 94,
    stock: 0,
    sku: "CORS-MP600-2TB",
    specs: { "السعة": "2 تيرابايت", "الواجهة": "M.2 NVMe PCIe 4.0", "القراءة": "7100 ميجابايت/ث", "الكتابة": "6800 ميجابايت/ث" },
    createdAt: "2024-11-05",
  },
  {
    id: "15",
    name: "AMD Ryzen 5 7600",
    nameAr: "AMD رايزن 5 7600",
    slug: "amd-ryzen-5-7600",
    price: 92000,
    compareAtPrice: null,
    brand: "AMD",
    category: "processors",
    image: "/images/products/ryzen-7600.jpg",
    images: ["/images/products/ryzen-7600.jpg"],
    rating: 4.6,
    reviewCount: 312,
    stock: 28,
    sku: "AMD-R5-7600",
    specs: { "النواة": "6", "الخيوط": "12", "التردد": "5.1 جيجاهرتز", "ذاكرة التخزين المؤقت": "38 ميجابايت" },
    createdAt: "2025-01-05",
  },
];

const ITEMS_PER_PAGE = 12;

const BRANDS = [
  { value: "AMD", label: "AMD", color: "text-amd" },
  { value: "NVIDIA", label: "NVIDIA", color: "text-nvidia" },
  { value: "Intel", label: "Intel", color: "text-intel" },
];

const CATEGORIES = [
  { value: "processors", label: "معالجات", icon: Cpu },
  { value: "gpus", label: "بطاقات رسوميات", icon: Monitor },
  { value: "ram", label: "رامات", icon: MemoryStick },
  { value: "storage", label: "تخزين", icon: HardDrive },
];

// ─── Sub-components ──────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="glass rounded-2xl overflow-hidden animate-pulse">
      <div className="aspect-square bg-white/5" />
      <div className="p-5 space-y-3">
        <div className="h-3 w-16 bg-white/10 rounded-full" />
        <div className="h-5 w-3/4 bg-white/10 rounded-lg" />
        <div className="h-4 w-1/2 bg-white/10 rounded-lg" />
        <div className="flex justify-between items-center pt-2">
          <div className="h-6 w-24 bg-white/10 rounded-lg" />
          <div className="h-9 w-24 bg-white/10 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="col-span-full flex flex-col items-center justify-center py-24 text-center"
    >
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-white/5">
        <Package className="h-10 w-10 text-white/30" />
      </div>
      <h3 className="text-xl font-semibold text-white/80 mb-2">لا توجد منتجات</h3>
      <p className="text-sm text-white/40 max-w-md mb-6">
        لم نعثر على منتجات تطابق معايير البحث المحددة. حاول تعديل الفلاتر أو البحث بكلمة مختلفة.
      </p>
      <button
        onClick={onReset}
        className="inline-flex items-center gap-2 rounded-full bg-white/10 px-6 py-2.5 text-sm font-medium text-white/80 hover:bg-white/15 transition-colors"
      >
        <X className="h-4 w-4" />
        إعادة تعيين الفلاتر
      </button>
    </motion.div>
  );
}

function FilterSidebar({
  filters,
  onFilterChange,
  isOpen,
  onClose,
}: {
  filters: Filters;
  onFilterChange: (filters: Filters) => void;
  isOpen: boolean;
  onClose: () => void;
}) {
  const [localMin, setLocalMin] = useState(String(filters.minPrice || ""));
  const [localMax, setLocalMax] = useState(String(filters.maxPrice || ""));

  const sidebarContent = (
    <div className="space-y-6">
      {/* Search */}
      <div>
        <h4 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3">بحث</h4>
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
          <input
            type="text"
            placeholder="ابحث عن منتج..."
            value={filters.search}
            onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pr-10 pl-4 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/20 transition-colors"
          />
        </div>
      </div>

      {/* Brand Filter */}
      <div>
        <h4 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3">العلامة التجارية</h4>
        <div className="space-y-2">
          {BRANDS.map((brand) => (
            <label
              key={brand.value}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div
                className={cn(
                  "relative flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-white/20 transition-colors",
                  filters.brands.includes(brand.value)
                    ? "bg-white text-black border-white"
                    : "group-hover:border-white/40"
                )}
              >
                {filters.brands.includes(brand.value) && (
                  <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z" />
                  </svg>
                )}
              </div>
              <span className={cn("text-sm", brand.color)}>{brand.label}</span>
              <input
                type="checkbox"
                className="sr-only"
                checked={filters.brands.includes(brand.value)}
                onChange={() => {
                  const newBrands = filters.brands.includes(brand.value)
                    ? filters.brands.filter((b) => b !== brand.value)
                    : [...filters.brands, brand.value];
                  onFilterChange({ ...filters, brands: newBrands });
                }}
              />
            </label>
          ))}
        </div>
      </div>

      {/* Category Filter */}
      <div>
        <h4 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3">الفئة</h4>
        <div className="space-y-2">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <label
                key={cat.value}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <div
                  className={cn(
                    "relative flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-white/20 transition-colors",
                    filters.categories.includes(cat.value)
                      ? "bg-white text-black border-white"
                      : "group-hover:border-white/40"
                  )}
                >
                  {filters.categories.includes(cat.value) && (
                    <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z" />
                    </svg>
                  )}
                </div>
                <Icon className="h-4 w-4 text-white/40" />
                <span className="text-sm text-white/80">{cat.label}</span>
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={filters.categories.includes(cat.value)}
                  onChange={() => {
                    const newCats = filters.categories.includes(cat.value)
                      ? filters.categories.filter((c) => c !== cat.value)
                      : [...filters.categories, cat.value];
                    onFilterChange({ ...filters, categories: newCats });
                  }}
                />
              </label>
            );
          })}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3">نطاق السعر</h4>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="من"
            value={localMin}
            onChange={(e) => setLocalMin(e.target.value)}
            onBlur={() => onFilterChange({ ...filters, minPrice: Number(localMin) || 0 })}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          <span className="text-white/30 text-xs">–</span>
          <input
            type="number"
            placeholder="إلى"
            value={localMax}
            onChange={(e) => setLocalMax(e.target.value)}
            onBlur={() => onFilterChange({ ...filters, maxPrice: Number(localMax) || 0 })}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-white/20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
        </div>
      </div>

      {/* Active Filters Summary */}
      {(filters.brands.length > 0 || filters.categories.length > 0 || filters.minPrice > 0 || filters.maxPrice > 0 || filters.search) && (
        <div className="pt-2 border-t border-white/10">
          <button
            onClick={() => {
              onFilterChange({ brands: [], categories: [], minPrice: 0, maxPrice: 0, search: "" });
              setLocalMin("");
              setLocalMax("");
            }}
            className="text-xs text-white/40 hover:text-white/70 transition-colors"
          >
            إعادة تعيين الكل
          </button>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0">
        <div className="glass rounded-2xl p-5 sticky top-24">{sidebarContent}</div>
      </aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={onClose}
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 z-50 w-80 max-w-[85vw] bg-[#0a0a0f] border-l border-white/10 p-6 overflow-y-auto lg:hidden"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">الفلاتر</h3>
                <button
                  onClick={onClose}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <X className="h-4 w-4 text-white" />
                </button>
              </div>
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function ProductCard({ product, index }: { product: Product; index: number }) {
  const brandColor =
    product.brand === "AMD"
      ? "text-amd"
      : product.brand === "NVIDIA"
        ? "text-nvidia"
        : "text-intel";

  const brandGlow =
    product.brand === "AMD"
      ? "brand-glow-amd"
      : product.brand === "NVIDIA"
        ? "brand-glow-nvidia"
        : "brand-glow-intel";

  const categoryIcon = {
    processors: Cpu,
    gpus: Monitor,
    ram: MemoryStick,
    storage: HardDrive,
  }[product.category];

  const CategoryIcon = categoryIcon;
  const stockLabel =
    product.stock > 10
      ? { label: "متوفر", variant: "success" as const }
      : product.stock > 0
        ? { label: "مخزون محدود", variant: "warning" as const }
        : { label: "غير متوفر", variant: "outOfStock" as const };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.5, delay: index * 0.05, ease: "easeOut" }}
    >
      <Link href={`/shop/${product.slug}`} className="block group">
        <Card
          brand={product.brand === "AMD" ? "amd" : product.brand === "NVIDIA" ? "nvidia" : "intel"}
          className={cn("h-full", brandGlow)}
        >
          {/* Image */}
          <div className="relative aspect-square bg-gradient-to-br from-white/5 to-white/[0.02] overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <CategoryIcon className={cn("h-16 w-16 mx-auto mb-2 opacity-20", brandColor)} />
                <span className={cn("text-xs font-medium opacity-20", brandColor)}>
                  {CATEGORIES.find((c) => c.value === product.category)?.label}
                </span>
              </div>
            </div>
            <div className="absolute top-3 right-3 flex flex-col gap-2">
              <Badge variant={stockLabel.variant} size="sm" dot pulse={product.stock <= 10 && product.stock > 0}>
                {stockLabel.label}
              </Badge>
              {product.compareAtPrice && (
                <Badge variant="danger" size="sm">
                  -{Math.round((1 - product.price / product.compareAtPrice) * 100)}%
                </Badge>
              )}
            </div>
          </div>

          <CardContent>
            {/* Brand */}
            <span className={cn("text-[11px] font-semibold uppercase tracking-widest", brandColor)}>
              {product.brand}
            </span>

            {/* Name */}
            <h3 className="mt-1.5 text-sm font-medium text-white/90 leading-snug line-clamp-2 group-hover:text-white transition-colors">
              {product.nameAr}
            </h3>

            {/* Rating */}
            <div className="mt-2 flex items-center gap-1.5">
              <div className="flex items-center">
                <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
                <span className="text-xs text-white/60 mr-1">{product.rating}</span>
              </div>
              <span className="text-[10px] text-white/30">({product.reviewCount})</span>
            </div>
          </CardContent>

          <CardFooter className="flex items-center justify-between">
            <div>
              <span className="text-lg font-bold text-white">{formatPrice(product.price)}</span>
              {product.compareAtPrice && (
                <span className="mr-2 text-xs text-white/30 line-through">
                  {formatPrice(product.compareAtPrice)}
                </span>
              )}
            </div>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              className={cn(
                "rounded-xl px-4 py-2 text-xs font-medium transition-all duration-300",
                product.brand === "AMD"
                  ? "bg-amd/20 text-amd hover:bg-amd/30"
                  : product.brand === "NVIDIA"
                    ? "bg-nvidia/20 text-nvidia hover:bg-nvidia/30"
                    : "bg-intel/20 text-intel hover:bg-intel/30"
              )}
            >
              أضف للسلة
            </button>
          </CardFooter>
        </Card>
      </Link>
    </motion.div>
  );
}

// ─── Main Page ───────────────────────────────────────────

export default function ShopPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  const [filters, setFilters] = useState<Filters>({
    brands: [],
    categories: [],
    minPrice: 0,
    maxPrice: 0,
    search: "",
  });

  const [sort, setSort] = useState<SortOption>("newest");
  const [currentPage, setCurrentPage] = useState(1);

  // Sync filters from URL
  useEffect(() => {
    const brands = searchParams.get("brands")?.split(",").filter(Boolean) || [];
    const categories = searchParams.get("categories")?.split(",").filter(Boolean) || [];
    const minPrice = Number(searchParams.get("minPrice")) || 0;
    const maxPrice = Number(searchParams.get("maxPrice")) || 0;
    const search = searchParams.get("search") || "";
    const sortParam = (searchParams.get("sort") as SortOption) || "newest";
    const page = Number(searchParams.get("page")) || 1;

    setFilters({ brands, categories, minPrice, maxPrice, search });
    setSort(sortParam);
    setCurrentPage(page);

    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, [searchParams]);

  // Close sort dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setIsSortOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const updateURL = useCallback(
    (newFilters: Filters, newSort: SortOption, page: number) => {
      const params = new URLSearchParams();
      if (newFilters.brands.length) params.set("brands", newFilters.brands.join(","));
      if (newFilters.categories.length) params.set("categories", newFilters.categories.join(","));
      if (newFilters.minPrice) params.set("minPrice", String(newFilters.minPrice));
      if (newFilters.maxPrice) params.set("maxPrice", String(newFilters.maxPrice));
      if (newFilters.search) params.set("search", newFilters.search);
      if (newSort !== "newest") params.set("sort", newSort);
      if (page > 1) params.set("page", String(page));
      const qs = params.toString();
      router.replace(qs ? `/shop?${qs}` : "/shop", { scroll: false });
    },
    [router]
  );

  const handleFilterChange = useCallback(
    (newFilters: Filters) => {
      setFilters(newFilters);
      setCurrentPage(1);
      updateURL(newFilters, sort, 1);
    },
    [sort, updateURL]
  );

  const handleSortChange = useCallback(
    (newSort: SortOption) => {
      setSort(newSort);
      setCurrentPage(1);
      updateURL(filters, newSort, 1);
      setIsSortOpen(false);
    },
    [filters, updateURL]
  );

  const handleResetFilters = useCallback(() => {
    const reset: Filters = { brands: [], categories: [], minPrice: 0, maxPrice: 0, search: "" };
    setFilters(reset);
    setCurrentPage(1);
    updateURL(reset, sort, 1);
  }, [sort, updateURL]);

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    let result = [...MOCK_PRODUCTS];

    if (filters.brands.length > 0) {
      result = result.filter((p) => filters.brands.includes(p.brand));
    }
    if (filters.categories.length > 0) {
      result = result.filter((p) => filters.categories.includes(p.category));
    }
    if (filters.minPrice > 0) {
      result = result.filter((p) => p.price >= filters.minPrice);
    }
    if (filters.maxPrice > 0) {
      result = result.filter((p) => p.price <= filters.maxPrice);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (p) =>
          p.nameAr.includes(q) ||
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    switch (sort) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "name":
        result.sort((a, b) => a.nameAr.localeCompare(b.nameAr));
        break;
      case "newest":
        result.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
    }

    return result;
  }, [filters, sort]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Determine brand from active filters
  const activeBrand =
    filters.brands.length === 1
      ? (filters.brands[0].toLowerCase() as "amd" | "nvidia" | "intel")
      : null;

  const activeFilterCount =
    filters.brands.length + filters.categories.length + (filters.search ? 1 : 0);

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: "newest", label: "الأحدث" },
    { value: "price-asc", label: "السعر: من الأقل للأعلى" },
    { value: "price-desc", label: "السعر: من الأعلى للأقل" },
    { value: "name", label: "الاسم" },
  ];

  // ─── Render ──────────────────────────────────────────
  return (
    <main className="min-h-screen pb-24" dir="rtl">
      {/* Header */}
      <section className="relative overflow-hidden pt-8 pb-12">
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-white">المتجر</h1>
                <p className="mt-2 text-sm text-white/40">
                  {filteredProducts.length} منتج{filteredProducts.length !== 1 ? "" : ""}
                  {filters.brands.length > 0 && ` • ${filters.brands.join("، ")}`}
                  {filters.categories.length > 0 &&
                    ` • ${filters.categories
                      .map((c) => CATEGORIES.find((cat) => cat.value === c)?.label || c)
                      .join("، ")}`}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {/* Mobile Filter Button */}
                <button
                  onClick={() => setIsFilterOpen(true)}
                  className="lg:hidden inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-sm font-medium text-white/80 hover:bg-white/15 transition-colors"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  الفلاتر
                  {activeFilterCount > 0 && (
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white text-[10px] font-bold text-black">
                      {activeFilterCount}
                    </span>
                  )}
                </button>

                {/* Sort Dropdown */}
                <div className="relative" ref={sortRef}>
                  <button
                    onClick={() => setIsSortOpen(!isSortOpen)}
                    className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-sm font-medium text-white/80 hover:bg-white/15 transition-colors"
                  >
                    <ArrowUpDown className="h-4 w-4" />
                    <span className="hidden sm:inline">{sortOptions.find((o) => o.value === sort)?.label}</span>
                    <ChevronDown className={cn("h-3 w-3 transition-transform", isSortOpen && "rotate-180")} />
                  </button>
                  <AnimatePresence>
                    {isSortOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute left-0 top-full mt-2 w-56 glass rounded-xl p-1.5 z-30 origin-top-left"
                      >
                        {sortOptions.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => handleSortChange(option.value)}
                            className={cn(
                              "w-full text-right px-3 py-2 rounded-lg text-sm transition-colors",
                              sort === option.value
                                ? "bg-white/10 text-white font-medium"
                                : "text-white/60 hover:text-white/80 hover:bg-white/5"
                            )}
                          >
                            {option.label}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Active Filters Bar */}
            {activeFilterCount > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-4 flex flex-wrap items-center gap-2"
              >
                {filters.brands.map((brand) => (
                  <button
                    key={brand}
                    onClick={() =>
                      handleFilterChange({
                        ...filters,
                        brands: filters.brands.filter((b) => b !== brand),
                      })
                    }
                    className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs text-white/70 hover:bg-white/15 transition-colors"
                  >
                    {brand}
                    <X className="h-3 w-3" />
                  </button>
                ))}
                {filters.categories.map((cat) => {
                  const catLabel = CATEGORIES.find((c) => c.value === cat)?.label;
                  return (
                    <button
                      key={cat}
                      onClick={() =>
                        handleFilterChange({
                          ...filters,
                          categories: filters.categories.filter((c) => c !== cat),
                        })
                      }
                      className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs text-white/70 hover:bg-white/15 transition-colors"
                    >
                      {catLabel}
                      <X className="h-3 w-3" />
                    </button>
                  );
                })}
                {filters.search && (
                  <button
                    onClick={() => handleFilterChange({ ...filters, search: "" })}
                    className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs text-white/70 hover:bg-white/15 transition-colors"
                  >
                    &ldquo;{filters.search}&rdquo;
                    <X className="h-3 w-3" />
                  </button>
                )}
                <button
                  onClick={handleResetFilters}
                  className="text-xs text-white/40 hover:text-white/70 transition-colors mr-1"
                >
                  مسح الكل
                </button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-8">
          {/* Filter Sidebar */}
          <FilterSidebar
            filters={filters}
            onFilterChange={handleFilterChange}
            isOpen={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
          />

          {/* Product Grid */}
          <div className="flex-1 min-w-0">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {Array.from({ length: 6 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : paginatedProducts.length === 0 ? (
              <EmptyState onReset={handleResetFilters} />
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {paginatedProducts.map((product, index) => (
                    <ProductCard key={product.id} product={product} index={index} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-12 flex items-center justify-center gap-2"
                  >
                    <button
                      onClick={() => {
                        const p = 1;
                        setCurrentPage(p);
                        updateURL(filters, sort, p);
                      }}
                      disabled={currentPage === 1}
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-xs text-white/50 hover:text-white/80 hover:border-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronsLeft className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => {
                        const p = currentPage - 1;
                        setCurrentPage(p);
                        updateURL(filters, sort, p);
                      }}
                      disabled={currentPage === 1}
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-xs text-white/50 hover:text-white/80 hover:border-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                        <button
                          key={p}
                          onClick={() => {
                            setCurrentPage(p);
                            updateURL(filters, sort, p);
                          }}
                          className={cn(
                            "flex h-9 min-w-[2.25rem] items-center justify-center rounded-lg text-xs font-medium transition-all duration-200",
                            currentPage === p
                              ? "bg-white text-black"
                              : "text-white/50 hover:text-white/80 hover:bg-white/5 border border-white/10"
                          )}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() => {
                        const p = currentPage + 1;
                        setCurrentPage(p);
                        updateURL(filters, sort, p);
                      }}
                      disabled={currentPage === totalPages}
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-xs text-white/50 hover:text-white/80 hover:border-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => {
                        const p = totalPages;
                        setCurrentPage(p);
                        updateURL(filters, sort, p);
                      }}
                      disabled={currentPage === totalPages}
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-xs text-white/50 hover:text-white/80 hover:border-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronsRight className="h-4 w-4" />
                    </button>
                  </motion.div>
                )}
              </>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

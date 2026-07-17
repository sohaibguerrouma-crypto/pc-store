import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "المتجر | PC Store - قطع الكمبيوتر والتجميعات",
  description:
    "تصفح مجموعتنا الكاملة من معالجات AMD و Intel، بطاقات رسوميات NVIDIA، رامات، تخزين، ولوحات أم بأفضل الأسعار في الجزائر",
  openGraph: {
    title: "المتجر | PC Store",
    description: "قطع الكمبيوتر والتجميعات الأصلية من AMD, NVIDIA, Intel",
  },
};

export const dynamic = "force-dynamic";

export default function ShopLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

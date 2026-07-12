export type Locale = "ar" | "fr";

export type Role = "CUSTOMER" | "ADMIN" | "STAFF";

export type OrderStatus =
  | "PENDING"
  | "AI_CONFIRMING"
  | "CONFIRMED"
  | "CANCELLED"
  | "SHIPPED"
  | "DELIVERED"
  | "REFUSED";

export type PaymentMethod = "COD" | "CCP" | "BARIDIMOB" | "USDT";

export interface CartItem {
  id: string;
  name: string;
  nameAr: string;
  price: number;
  quantity: number;
  image: string;
  sku: string;
  stock: number;
}

export interface WilayaOption {
  id: string;
  wilaya: string;
  cost: number;
  order: number;
}

export interface AIConfirmResult {
  outcome: "confirmed" | "no_answer" | "refused" | "suspicious";
  confidence: number;
  notes: string;
}

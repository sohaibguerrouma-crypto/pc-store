import { z } from "zod";

export const loginSchema = z.object({
  phone: z.string().regex(/^(05|06|07|\+213|00213)[0-9]{8,9}$/, "رقم الهاتف غير صالح"),
  password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
});

export const registerSchema = z.object({
  fullName: z.string().min(3, "الاسم يجب أن يكون 3 أحرف على الأقل"),
  phone: z.string().regex(/^(05|06|07|\+213|00213)[0-9]{8,9}$/, "رقم الهاتف غير صالح"),
  email: z.string().email("البريد الإلكتروني غير صالح").optional().or(z.literal("")),
  password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
  wilaya: z.string().min(1, "الولاية مطلوبة"),
  commune: z.string().min(1, "البلدية مطلوبة"),
  address: z.string().min(5, "العنوان يجب أن يكون 5 أحرف على الأقل"),
});

export const checkoutSchema = z.object({
  fullName: z.string().min(3),
  phone: z.string().regex(/^(05|06|07|\+213|00213)[0-9]{8,9}$/),
  wilaya: z.string().min(1),
  commune: z.string().min(1),
  address: z.string().min(5),
  paymentMethod: z.enum(["COD", "CCP", "BARIDIMOB", "USDT"]),
  notes: z.string().optional(),
});

export const productSchema = z.object({
  name: z.string().min(2),
  nameAr: z.string().min(2),
  description: z.string().min(10),
  descriptionAr: z.string().min(10),
  price: z.number().positive(),
  comparePrice: z.number().positive().optional(),
  stock: z.number().int().nonnegative(),
  sku: z.string().min(2),
  brand: z.string().min(1),
  categoryId: z.string().min(1),
  images: z.array(z.string()).min(1),
  specs: z.record(z.any()),
});

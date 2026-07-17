import { jules } from "@google/jules-sdk";

const tasks = [
  {
    name: "Shop & Product Pages",
    prompt: `Create the following files in src/app/shop/ and src/components/shop/:

1. src/app/shop/page.tsx - Shop listing page with:
   - Category filter sidebar (brand, price range, specs)
   - Product grid with pagination
   - Sort options (price, name, newest)
   - Search functionality
   - Mobile-responsive filter drawer

2. src/app/shop/[slug]/page.tsx - Product detail page with:
   - Image gallery with zoom
   - Full specs table
   - Stock status badge
   - Add to cart button with quantity selector
   - Related products section
   - Breadcrumb navigation

3. src/components/shop/ProductCard.tsx - Reusable product card
4. src/components/shop/ProductGrid.tsx - Grid layout component
5. src/components/shop/Filters.tsx - Filter component

Use TailwindCSS dark theme, glassmorphism effects, Arabic-friendly layout (RTL ready).
Import types from @/types and utilities from @/lib/utils.`,
  },
  {
    name: "Cart & Checkout Flow",
    prompt: `Create:
1. src/app/cart/page.tsx - Cart page with items, quantity, totals
2. src/app/checkout/page.tsx - Checkout with form, wilaya fees, payment methods
3. src/components/cart/CartItem.tsx
4. src/components/ui/Button.tsx, Input.tsx, GlassCard.tsx
5. src/providers/CartProvider.tsx - Cart context with localStorage

All TailwindCSS dark theme, RTL, glassmorphism.`,
  },
  {
    name: "Order Tracking & Account",
    prompt: `Create:
1. src/app/order-tracking/page.tsx - Track by order number + phone with status timeline
2. src/app/account/page.tsx - Profile info, addresses, order stats
3. src/app/account/orders/page.tsx - Order history with pagination

TailwindCSS dark theme, glassmorphism, RTL.`,
  },
  {
    name: "API Routes",
    prompt: `Create:
1. src/app/api/products/route.ts - GET with filters, search, pagination
2. src/app/api/products/[id]/route.ts - GET single product
3. src/app/api/orders/route.ts - POST create order with Zod validation, wilaya cost, order number
4. src/app/api/orders/[id]/route.ts - GET by orderNumber

Use prisma from @/lib/prisma, Zod from @/lib/validations.`,
  },
  {
    name: "Admin Dashboard",
    prompt: `Create:
1. src/app/admin/page.tsx - Stats cards, recent orders, low stock, sales chart
2. src/app/admin/products/page.tsx - Product table + add/edit modal
3. src/app/admin/orders/page.tsx - Orders table + status update + AI override
4. src/app/admin/ai-logs/page.tsx - AI attempts log with transcript viewer
5. src/components/admin/Sidebar.tsx

TailwindCSS dark theme, glassmorphism, RTL.`,
  },
  {
    name: "AI Confirmation System",
    prompt: `Create:
1. src/lib/ai-confirm.ts - Initiate confirmation, process reply via Claude API, retry logic, trust score
2. src/app/api/orders/confirm/route.ts - POST trigger AI confirmation
3. src/app/api/admin/ai-override/route.ts - POST manual override (admin only)

Use prisma from @/lib/prisma, proper error handling.`,
  },
];

async function main() {
  console.log("Launching 6 Jules parallel tasks...\n");

  const results = await jules.all(
    tasks,
    async (task) => {
      const session = await jules.run({
        title: `PC-Store: ${task.name}`,
        prompt: task.prompt,
        source: {
          github: "sohaibguerrouma-crypto/pc-store",
          baseBranch: "main",
        },
        autoPr: true,
      });
      return { name: task.name, sessionId: session.id };
    },
    { concurrency: 2 }
  );

  for (const r of results) {
    console.log(`  - ${r.name}: ${r.sessionId}`);
  }
}

main().catch(console.error);

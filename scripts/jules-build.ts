import { jules } from "@google/jules-sdk";
import * as fs from "fs";
import * as path from "path";

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

3. src/components/shop/ProductCard.tsx - Reusable product card with:
   - Image with hover zoom effect
   - Price (with compare at price)
   - Add to cart button
   - Stock indicator
   - Glassmorphism dark theme styling

4. src/components/shop/ProductGrid.tsx - Grid layout component
5. src/components/shop/Filters.tsx - Filter component

Use TailwindCSS dark theme, glassmorphism effects, Arabic-friendly layout (RTL ready).
Import types from @/types and utilities from @/lib/utils.`,
  },
  {
    name: "Cart & Checkout Flow",
    prompt: `Create the following files:

1. src/app/cart/page.tsx - Cart page with:
   - List of cart items with quantity controls
   - Price calculation per item and total
   - Remove item button
   - Proceed to checkout button
   - Empty cart state

2. src/app/checkout/page.tsx - Checkout page with:
   - Order summary
   - Shipping information form (name, phone, wilaya, commune, address)
   - Wilaya delivery fee selection
   - Payment method selection (COD, CCP, BARIDIMOB, USDT)
   - Place order button
   - Guest checkout support

3. src/components/cart/CartItem.tsx - Cart item component

4. src/components/ui/Button.tsx - Reusable button with variants (primary, secondary, outline, ghost)
5. src/components/ui/Input.tsx - Form input component with error state
6. src/components/ui/GlassCard.tsx - Glassmorphism card component

7. src/providers/CartProvider.tsx - Cart context provider with:
   - Add/remove/update quantity
   - Persist to localStorage
   - Calculate totals
   - Clear cart

All with TailwindCSS dark theme, RTL support, glassmorphism styling.`,
  },
  {
    name: "Order Tracking & Account Pages",
    prompt: `Create the following files:

1. src/app/order-tracking/page.tsx - Order tracking page with:
   - Input for order number + phone
   - Display order status with timeline/stepper
   - Order items summary
   - Shipping address info
   - Status badges (PENDING, AI_CONFIRMING, CONFIRMED, etc.)

2. src/app/account/page.tsx - User account page with:
   - Profile info display/edit
   - Saved addresses
   - Quick order stats

3. src/app/account/orders/page.tsx - Order history with:
   - List of past orders
   - Order status badges
   - Click to view details
   - Pagination

All with TailwindCSS dark theme, glassmorphism cards, RTL support.`,
  },
  {
    name: "API Routes - Products & Orders",
    prompt: `Create the following API routes using Next.js App Router:

1. src/app/api/products/route.ts - GET /api/products with:
   - Filter by category, brand, price range
   - Search by name
   - Pagination (page, limit)
   - Sort options
   - Return Product[] with category included

2. src/app/api/products/[id]/route.ts - GET /api/products/[id] with full details

3. src/app/api/orders/route.ts - POST /api/orders to create order with:
   - Validate using Zod schema from @/lib/validations
   - Calculate total with wilaya shipping cost
   - Generate order number
   - Create order with items
   - Clear cart after order
   - Return order with orderNumber

4. src/app/api/orders/[id]/route.ts - GET /api/orders/[id] by orderNumber

Use prisma from @/lib/prisma, Zod validation, proper error handling.`,
  },
  {
    name: "Admin Dashboard",
    prompt: `Create the following files:

1. src/app/admin/page.tsx - Admin dashboard with:
   - Stats cards (total orders, revenue, products, users)
   - Recent orders table
   - Low stock alerts
   - Sales chart placeholder
   - AI confirmation summary

2. src/app/admin/products/page.tsx - Product management with:
   - Product table (image, name, price, stock, status)
   - Add/Edit product modal/form
   - Toggle active status
   - Quick stock update

3. src/app/admin/orders/page.tsx - Order management with:
   - Orders table with filters (status, date, payment method)
   - View order details
   - Update order status
   - Manual override button for AI confirmation

4. src/app/admin/ai-logs/page.tsx - AI confirmation logs with:
   - Logs table (order, method, confidence, outcome, attempts)
   - Transcript viewer
   - Filter by outcome

5. src/components/admin/Sidebar.tsx - Admin sidebar navigation

All with TailwindCSS dark theme, glassmorphism, RTL support.`,
  },
  {
    name: "AI Confirmation System",
    prompt: `Create the following files:

1. src/lib/ai-confirm.ts - AI confirmation logic with:
   - Function to initiate confirmation (WhatsApp/call/SMS)
   - Function to process customer reply through Claude API
   - Retry logic (3 attempts over 24h)
   - Trust score management
   - Return AiConfirmationResult type

2. src/app/api/orders/confirm/route.ts - POST /api/orders/confirm with:
   - Receive order ID
   - Trigger AI confirmation flow
   - Return confirmation result
   - Update order status

3. src/app/api/admin/ai-override/route.ts - POST /api/admin/ai-override with:
   - Manual override for order status
   - Admin authentication check

Use prisma from @/lib/prisma, proper error handling, rate limiting.`,
  },
];

async function main() {
  console.log("🚀 Starting Jules parallel builds for PC Store...\n");

  const results = await jules.all(
    tasks,
    async (task) => {
      const session = await jules.run({
        title: `PC-Store: ${task.name}`,
        prompt: task.prompt,
        automationMode: "AUTO_COMMIT",
      });
      return { name: task.name, sessionId: session.id };
    },
    { concurrency: 2 }
  );

  console.log("✅ All Jules tasks launched:");
  for (const r of results) {
    console.log(`  - ${r.name}: session ${r.sessionId}`);
  }
  console.log("\nCheck sessions at https://jules.google");
}

main().catch(console.error);

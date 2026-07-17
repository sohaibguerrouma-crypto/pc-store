import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { updateOrderStatus, getOrder } from "@/lib/ai-confirm";

// ───────────────────────────────────────────────────
// Rate Limit: 30 req/min per IP (enforce via middleware/Vercel KV)
// ───────────────────────────────────────────────────

const ALLOWED_STATUSES = [
  "PENDING",
  "AI_CONFIRMING",
  "CONFIRMED",
  "CANCELLED",
  "FLAGGED",
] as const;

const bodySchema = z.object({
  orderId: z.string().min(1, "orderId is required"),
  newStatus: z.enum(ALLOWED_STATUSES, {
    errorMap: () => ({
      message: `newStatus must be one of: ${ALLOWED_STATUSES.join(", ")}`,
    }),
  }),
});

function isAdmin(request: NextRequest): boolean {
  const authHeader = request.headers.get("authorization") ?? "";
  const adminKey = process.env.ADMIN_API_KEY;
  if (!adminKey) return false;

  // Expecting: "Bearer <ADMIN_API_KEY>"
  const [scheme, token] = authHeader.split(" ");
  return scheme === "Bearer" && token === adminKey;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const origin = request.headers.get("origin") ?? "*";

    // ── Authorization ──────────────────────────────
    if (!isAdmin(request)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized – admin role required" },
        {
          status: 403,
          headers: {
            "Access-Control-Allow-Origin": origin,
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
          },
        }
      );
    }

    // ── Parse body ─────────────────────────────────
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid JSON body" },
        {
          status: 400,
          headers: {
            "Access-Control-Allow-Origin": origin,
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
          },
        }
      );
    }

    const parsed = bodySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: parsed.error.flatten().fieldErrors,
        },
        {
          status: 422,
          headers: {
            "Access-Control-Allow-Origin": origin,
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
          },
        }
      );
    }

    const { orderId, newStatus } = parsed.data;

    const order = getOrder(orderId);
    if (!order) {
      return NextResponse.json(
        { success: false, error: `Order ${orderId} not found` },
        {
          status: 404,
          headers: {
            "Access-Control-Allow-Origin": origin,
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
          },
        }
      );
    }

    // ── Override ───────────────────────────────────
    const previousStatus = order.status;
    updateOrderStatus(orderId, newStatus);

    const logEntry = {
      action: "AI_OVERRIDE",
      orderId,
      previousStatus,
      newStatus,
      timestamp: new Date().toISOString(),
      adminTokenPrefix: request.headers
        .get("authorization")
        ?.slice(0, 20),
    };

    // In production, persist this log to a database or logging service
    console.log("[ADMIN OVERRIDE]", JSON.stringify(logEntry));

    return NextResponse.json(
      {
        success: true,
        orderId,
        newStatus,
      },
      {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": origin,
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json(
      { success: false, error: message },
      {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      }
    );
  }
}

export async function OPTIONS(): Promise<NextResponse> {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  initiateConfirmation,
  getOrder,
} from "@/lib/ai-confirm";

// ───────────────────────────────────────────────────
// Rate Limit: 10 req/min per IP (enforce via middleware/Vercel KV)
// ───────────────────────────────────────────────────

const bodySchema = z.object({
  orderId: z.string().min(1, "orderId is required"),
});

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const origin = request.headers.get("origin") ?? "*";

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

    const { orderId } = parsed.data;

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

    const attempt = await initiateConfirmation(orderId);

    return NextResponse.json(
      {
        success: true,
        confirmationId: attempt.attemptId,
        status: "AI_CONFIRMING",
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

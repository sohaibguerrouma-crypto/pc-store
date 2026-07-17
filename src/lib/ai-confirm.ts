import Anthropic from "@anthropic-ai/sdk";

// ───────────────────────────────────────────────────
// Types
// ───────────────────────────────────────────────────

export type AIConfirmOutcome =
  | "confirmed"
  | "no_answer"
  | "refused"
  | "suspicious";

export interface AIConfirmResult {
  outcome: AIConfirmOutcome;
  confidence: number;
  notes: string;
}

export type OrderStatus =
  | "PENDING"
  | "AI_CONFIRMING"
  | "CONFIRMED"
  | "CANCELLED"
  | "FLAGGED";

export interface CustomerOrder {
  id: string;
  status: OrderStatus;
  trustScore: number;
  summary: Record<string, unknown>;
  confirmationAttempts: ConfirmationAttempt[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ConfirmationAttempt {
  attemptId: string;
  orderId: string;
  status: "pending" | "sent" | "completed" | "failed";
  retryCount: number;
  result: AIConfirmResult | null;
  customerReply: string | null;
  createdAt: Date;
  lastRetryAt: Date | null;
}

// ───────────────────────────────────────────────────
// In-memory store (swap with DB in production)
// ───────────────────────────────────────────────────

const orders = new Map<string, CustomerOrder>();
const confirmationRecords = new Map<string, ConfirmationAttempt>();

// ───────────────────────────────────────────────────
// Helpers
// ───────────────────────────────────────────────────

function generateId(): string {
  return `ai-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

const MAX_RETRIES = 3;
const RETRY_DELAYS_MS = [60_000, 300_000, 600_000]; // 1m → 5m → 10m

// ───────────────────────────────────────────────────
// Anthropic client
// ───────────────────────────────────────────────────

let anthropic: Anthropic | null = null;

function getAnthropicClient(): Anthropic {
  if (!anthropic) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error("ANTHROPIC_API_KEY environment variable is not set");
    }
    anthropic = new Anthropic({ apiKey });
  }
  return anthropic;
}

// ───────────────────────────────────────────────────
// Core functions
// ───────────────────────────────────────────────────

export async function initiateConfirmation(
  orderId: string
): Promise<ConfirmationAttempt> {
  const order = orders.get(orderId);
  if (!order) {
    throw new Error(`Order ${orderId} not found`);
  }

  order.status = "AI_CONFIRMING";
  order.updatedAt = new Date();

  const attempt: ConfirmationAttempt = {
    attemptId: generateId(),
    orderId,
    status: "pending",
    retryCount: 0,
    result: null,
    customerReply: null,
    createdAt: new Date(),
    lastRetryAt: null,
  };

  confirmationRecords.set(attempt.attemptId, attempt);
  order.confirmationAttempts.push(attempt);

  return attempt;
}

export async function processCustomerReply(
  customerReply: string,
  orderSummary: object
): Promise<AIConfirmResult> {
  const client = getAnthropicClient();

  const systemPrompt = `You are an AI order confirmation analyzer for a PC e-commerce store.
Analyze the customer's reply and determine the order confirmation outcome.

Available outcomes:
- "confirmed": Customer explicitly confirms the order
- "no_answer": Reply is unrelated / unclear / no clear intent
- "refused": Customer explicitly cancels or refuses
- "suspicious": Reply indicates fraud, identity theft, or suspicious activity

Respond with a JSON object: { "outcome": string, "confidence": number (0-1), "notes": string }
Only respond with the JSON object.`;

  const userMessage = `Order summary: ${JSON.stringify(orderSummary)}

Customer reply (Arabic/French): ${customerReply}`;

  let response;
  try {
    response = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 256,
      temperature: 0,
      system: systemPrompt,
      messages: [{ role: "user", content: userMessage }],
    });
  } catch (err) {
    throw new Error(
      `Anthropic API error: ${err instanceof Error ? err.message : String(err)}`
    );
  }

  const contentBlock = response.content[0];
  if (!contentBlock || contentBlock.type !== "text") {
    throw new Error("Unexpected Anthropic response format");
  }

  let parsed: AIConfirmResult;
  try {
    parsed = JSON.parse(contentBlock.text) as AIConfirmResult;
  } catch {
    throw new Error(
      `Failed to parse AI response as JSON: ${contentBlock.text}`
    );
  }

  if (!["confirmed", "no_answer", "refused", "suspicious"].includes(parsed.outcome)) {
    throw new Error(`Invalid outcome from AI: ${parsed.outcome}`);
  }

  return parsed;
}

export async function retryLogic(orderId: string): Promise<ConfirmationAttempt> {
  const order = orders.get(orderId);
  if (!order) {
    throw new Error(`Order ${orderId} not found`);
  }

  const lastAttempt =
    order.confirmationAttempts[order.confirmationAttempts.length - 1];
  if (!lastAttempt) {
    throw new Error(`No confirmation attempt found for order ${orderId}`);
  }

  if (lastAttempt.retryCount >= MAX_RETRIES) {
    order.status = "FLAGGED";
    order.updatedAt = new Date();
    return lastAttempt;
  }

  const delay = RETRY_DELAYS_MS[lastAttempt.retryCount] ?? RETRY_DELAYS_MS[MAX_RETRIES - 1];

  await new Promise((resolve) => setTimeout(resolve, delay));

  lastAttempt.retryCount += 1;
  lastAttempt.lastRetryAt = new Date();
  lastAttempt.status = "sent";

  if (lastAttempt.retryCount >= MAX_RETRIES) {
    order.status = "FLAGGED";
    order.updatedAt = new Date();
  }

  return lastAttempt;
}

export function getConfirmationResult(
  orderId: string
): ConfirmationAttempt | null {
  const order = orders.get(orderId);
  if (!order) return null;

  const attempts = order.confirmationAttempts;
  if (attempts.length === 0) return null;

  return attempts[attempts.length - 1];
}

// ───────────────────────────────────────────────────
// Store helpers (for API routes)
// ───────────────────────────────────────────────────

export function getOrder(orderId: string): CustomerOrder | undefined {
  return orders.get(orderId);
}

export function upsertOrder(order: CustomerOrder): void {
  orders.set(order.id, order);
}

export function updateOrderStatus(
  orderId: string,
  status: OrderStatus
): CustomerOrder | undefined {
  const order = orders.get(orderId);
  if (!order) return undefined;
  order.status = status;
  order.updatedAt = new Date();
  return order;
}

export function updateAttemptResult(
  attemptId: string,
  result: AIConfirmResult,
  customerReply: string
): ConfirmationAttempt | undefined {
  const attempt = confirmationRecords.get(attemptId);
  if (!attempt) return undefined;
  attempt.result = result;
  attempt.customerReply = customerReply;
  attempt.status = "completed";
  return attempt;
}

export function decrementTrustScore(orderId: string, amount = 1): void {
  const order = orders.get(orderId);
  if (order) {
    order.trustScore = Math.max(0, order.trustScore - amount);
  }
}

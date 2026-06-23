/**
 * GCash Payment Service
 * Simulated payment flow for Philippine GCash payments.
 * Structurally ready for real GCash/PayMongo API integration.
 */

export interface GCashPaymentRequest {
  amount: number;
  description: string;
  orderId: string;
  customerName: string;
  customerPhone: string;
}

export interface GCashPaymentResponse {
  success: boolean;
  transactionId: string;
  status: "PENDING" | "COMPLETED" | "FAILED";
  checkoutUrl: string;
  amount: number;
  message: string;
}

function generateTransactionId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 10);
  return `GCASH-${timestamp}-${random}`.toUpperCase();
}

export async function createGCashPayment(
  request: GCashPaymentRequest
): Promise<GCashPaymentResponse> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  const transactionId = generateTransactionId();

  // In production, this would call PayMongo or GCash API:
  // const response = await fetch('https://api.paymongo.com/v1/sources', {
  //   method: 'POST',
  //   headers: {
  //     'Authorization': `Basic ${Buffer.from(PAYMONGO_SECRET_KEY).toString('base64')}`,
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({
  //     data: {
  //       attributes: {
  //         amount: request.amount * 100,
  //         redirect: { success: `${APP_URL}/payment/success`, failed: `${APP_URL}/payment/failed` },
  //         type: 'gcash',
  //         currency: 'PHP',
  //       }
  //     }
  //   })
  // });

  return {
    success: true,
    transactionId,
    status: "PENDING",
    checkoutUrl: `/checkout/gcash/verify?txn=${transactionId}&orderId=${request.orderId}`,
    amount: request.amount,
    message: "GCash payment initiated. Please complete verification.",
  };
}

export async function verifyGCashPayment(
  transactionId: string
): Promise<{ verified: boolean; status: string }> {
  // Simulate verification delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // In production, check PayMongo webhook or poll API
  // const source = await fetch(`https://api.paymongo.com/v1/sources/${sourceId}`, { ... });

  return {
    verified: true,
    status: "COMPLETED",
  };
}

export function formatPhpCurrency(amount: number): string {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(amount);
}

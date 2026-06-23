import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2026-04-22.dahlia",
  typescript: true,
});

export async function createPaymentIntent(amount: number, metadata: Record<string, string> = {}) {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // Convert to centavos
    currency: "php",
    metadata,
    automatic_payment_methods: {
      enabled: true,
    },
  });

  return {
    clientSecret: paymentIntent.client_secret,
    paymentIntentId: paymentIntent.id,
  };
}

export async function retrievePaymentIntent(paymentIntentId: string) {
  return await stripe.paymentIntents.retrieve(paymentIntentId);
}

export async function confirmPaymentStatus(paymentIntentId: string) {
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
  return {
    status: paymentIntent.status,
    amount: paymentIntent.amount / 100,
    id: paymentIntent.id,
  };
}

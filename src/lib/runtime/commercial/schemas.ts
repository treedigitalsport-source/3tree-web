/**
 * 3Tree Digital Sport IA — Commercial Pipeline & Notifications
 * Canonical Zod Validation Schemas for EVT-009, EVT-010 & EVT-011
 * Specification: 3T-AUDIT-015
 */

import { z } from 'zod';

export const CommercialTierSchema = z.enum([
  'DIAMAX_PRO',
  'KINEBASE_3D',
  'ENTERPRISE_CUSTOM',
  'ACADEMY_ANNUAL',
]);

export const CommercialCurrencySchema = z.enum(['usd', 'eur', 'mxn', 'ves']);

export const SubscriptionStatusSchema = z.enum([
  'active',
  'past_due',
  'canceled',
  'trialing',
  'unpaid',
  'incomplete',
]);

export const PaymentStatusSchema = z.enum(['paid', 'unpaid', 'no_payment_required']);

export const BillingReasonSchema = z.enum([
  'subscription_create',
  'subscription_cycle',
  'manual',
  'upcoming',
]);

// EVT-009: Commercial Checkout Completed
export const CheckoutCompletedPayloadSchema = z.object({
  checkoutSessionId: z.string().min(3),
  customerId: z.string().min(3),
  customerEmail: z.string().email(),
  customerName: z.string().min(1),
  tier: CommercialTierSchema,
  amountTotalCents: z.number().int().nonnegative(),
  currency: CommercialCurrencySchema,
  paymentStatus: PaymentStatusSchema,
  invoiceId: z.string().min(3).optional(),
  metadata: z.record(z.string(), z.string()).optional(),
  completedAt: z.string().datetime(),
});

// EVT-010: Commercial Subscription Updated
export const SubscriptionUpdatedPayloadSchema = z.object({
  subscriptionId: z.string().min(3),
  customerId: z.string().min(3),
  customerEmail: z.string().email(),
  tier: CommercialTierSchema,
  status: SubscriptionStatusSchema,
  currentPeriodStart: z.string().datetime(),
  currentPeriodEnd: z.string().datetime(),
  cancelAtPeriodEnd: z.boolean(),
  canceledAt: z.string().datetime().optional(),
  updatedAt: z.string().datetime(),
});

// EVT-011: Commercial Invoice Paid
export const InvoicePaidPayloadSchema = z.object({
  invoiceId: z.string().min(3),
  subscriptionId: z.string().min(3).optional(),
  customerId: z.string().min(3),
  customerEmail: z.string().email(),
  amountPaidCents: z.number().int().nonnegative(),
  currency: CommercialCurrencySchema,
  hostedInvoiceUrl: z.string().url(),
  pdfInvoiceUrl: z.string().url().optional(),
  billingReason: BillingReasonSchema,
  paidAt: z.string().datetime(),
});

// Raw Stripe Inbound Webhook Schema
export const StripeRawWebhookSchema = z.object({
  id: z.string().min(3),
  object: z.literal('event'),
  type: z.string().min(3),
  created: z.number().int().positive(),
  data: z.object({
    object: z.record(z.string(), z.unknown()),
  }),
  livemode: z.boolean().optional(),
});

// Email Notification Request Schema
export const EmailNotificationRequestSchema = z.object({
  template: z.enum([
    'WELCOME_ONBOARDING',
    'PAYMENT_RECEIPT',
    'PAYMENT_FAILED_ALERT',
    'ENTERPRISE_QUOTE',
  ]),
  recipientEmail: z.string().email(),
  recipientName: z.string().min(1).optional(),
  tier: CommercialTierSchema.optional(),
  amountFormatted: z.string().min(1).optional(),
  receiptUrl: z.string().url().optional(),
  metadata: z.record(z.string(), z.string()).optional(),
});

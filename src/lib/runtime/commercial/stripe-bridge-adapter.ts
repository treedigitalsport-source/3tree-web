/**
 * 3Tree Digital Sport IA — Commercial Pipeline & Stripe Bridge
 * Anti-Corruption Layer: StripeBridgeAdapter
 * Cryptographic Signature Verification & Webhook Event Canonicalization
 * Specification: 3T-AUDIT-015
 */

import { createHmac, timingSafeEqual } from 'crypto';
import { CanonicalEventEnvelope, EventMetadata, EventPriority } from '../event-bus/types';
import {
  CheckoutCompletedPayloadSchema,
  SubscriptionUpdatedPayloadSchema,
  InvoicePaidPayloadSchema,
  StripeRawWebhookSchema,
} from './schemas';
import {
  CheckoutCompletedPayload,
  SubscriptionUpdatedPayload,
  InvoicePaidPayload,
  CommercialTier,
  CommercialCurrency,
  SubscriptionStatus,
  PaymentStatus,
  BillingReason,
} from './types';

export class StripeBridgeAdapter {
  /**
   * Verifies the cryptographic HMAC SHA-256 signature from Stripe webhooks (v1)
   */
  public static verifyWebhookSignature(
    payload: string,
    signatureHeader: string,
    webhookSecret: string,
    toleranceSeconds: number = 300
  ): boolean {
    if (!payload || !signatureHeader || !webhookSecret) {
      return false;
    }

    try {
      const parts = signatureHeader.split(',').reduce<Record<string, string>>((acc, item) => {
        const [k, v] = item.trim().split('=');
        if (k && v) acc[k] = v;
        return acc;
      }, {});

      const timestamp = parts['t'];
      const signature = parts['v1'];

      if (!timestamp || !signature) {
        return false;
      }

      const timestampNum = parseInt(timestamp, 10);
      const nowSeconds = Math.floor(Date.now() / 1000);

      // Verify timestamp tolerance against replay attacks
      if (Math.abs(nowSeconds - timestampNum) > toleranceSeconds) {
        return false;
      }

      const signedPayload = `${timestamp}.${payload}`;
      const expectedSignature = createHmac('sha256', webhookSecret)
        .update(signedPayload)
        .digest('hex');

      const sigBuffer = Buffer.from(signature, 'hex');
      const expBuffer = Buffer.from(expectedSignature, 'hex');

      if (sigBuffer.length !== expBuffer.length) {
        return false;
      }

      return timingSafeEqual(sigBuffer, expBuffer);
    } catch {
      return false;
    }
  }

  /**
   * Transforms raw Stripe checkout.session.completed into EVT-009 CanonicalEventEnvelope
   */
  public static toCheckoutCompletedEnvelope(
    rawWebhook: unknown,
    options: {
      correlationId?: string;
      causationId?: string;
      environment?: 'production' | 'staging' | 'development';
      priority?: EventPriority;
    } = {}
  ): CanonicalEventEnvelope<CheckoutCompletedPayload> {
    const parseResult = StripeRawWebhookSchema.safeParse(rawWebhook);
    if (!parseResult.success) {
      throw new Error(`[STRIPE_BRIDGE_ERROR]: Invalid Stripe raw webhook shape: ${parseResult.error.message}`);
    }

    const raw = parseResult.data;
    const sessionObj = raw.data.object;
    const nowUtc = new Date().toISOString();

    const rawTier = (sessionObj.metadata as Record<string, string> | undefined)?.tier ?? 'DIAMAX_PRO';
    const validTiers: CommercialTier[] = ['DIAMAX_PRO', 'KINEBASE_3D', 'ENTERPRISE_CUSTOM', 'ACADEMY_ANNUAL'];
    const tier: CommercialTier = validTiers.includes(rawTier as CommercialTier) ? (rawTier as CommercialTier) : 'DIAMAX_PRO';

    const rawCurrency = ((sessionObj.currency as string) ?? 'usd').toLowerCase();
    const validCurrencies: CommercialCurrency[] = ['usd', 'eur', 'mxn', 'ves'];
    const currency: CommercialCurrency = validCurrencies.includes(rawCurrency as CommercialCurrency)
      ? (rawCurrency as CommercialCurrency)
      : 'usd';

    const paymentStatus: PaymentStatus =
      sessionObj.payment_status === 'paid'
        ? 'paid'
        : sessionObj.payment_status === 'no_payment_required'
        ? 'no_payment_required'
        : 'unpaid';

    const customerDetails = (sessionObj.customer_details as Record<string, string> | undefined) ?? {};
    const customerEmail =
      (sessionObj.customer_email as string) ??
      customerDetails.email ??
      `customer_${sessionObj.customer ?? 'anon'}@3treedigital.com`;
    const customerName = customerDetails.name ?? (sessionObj.client_reference_id as string) ?? 'VIP Customer';

    const payloadData: CheckoutCompletedPayload = {
      checkoutSessionId: String(sessionObj.id ?? `cs_${Date.now()}`),
      customerId: String(sessionObj.customer ?? `cus_${Date.now()}`),
      customerEmail,
      customerName,
      tier,
      amountTotalCents: Number(sessionObj.amount_total ?? 0),
      currency,
      paymentStatus,
      invoiceId: sessionObj.invoice ? String(sessionObj.invoice) : undefined,
      metadata: (sessionObj.metadata as Record<string, string>) ?? {},
      completedAt: nowUtc,
    };

    const validatedPayload = CheckoutCompletedPayloadSchema.parse(payloadData);

    const eventId = `evt_comm_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const idempotencyKey = `idem_stripe_${raw.id}`;

    const metadata: EventMetadata = {
      correlationId: options.correlationId ?? `corr_checkout_${payloadData.checkoutSessionId}`,
      causationId: options.causationId ?? `stripe_event_${raw.id}`,
      retryCount: 0,
      environment: options.environment ?? 'development',
    };

    return {
      eventId,
      idempotencyKey,
      eventType: 'commercial.checkout.completed',
      version: '1.0.0',
      timestampUtc: nowUtc,
      issuerAgentId: 'AG-025', // Hermes (Sales & Commerce Lead)
      targetAgentId: 'AG-020', // Leo (CFO & Revenue Lead)
      priority: options.priority ?? 'P1_HIGH',
      payload: validatedPayload,
      metadata,
    };
  }

  /**
   * Transforms raw Stripe customer.subscription.updated/deleted into EVT-010 CanonicalEventEnvelope
   */
  public static toSubscriptionUpdatedEnvelope(
    rawWebhook: unknown,
    options: {
      correlationId?: string;
      causationId?: string;
      environment?: 'production' | 'staging' | 'development';
      priority?: EventPriority;
    } = {}
  ): CanonicalEventEnvelope<SubscriptionUpdatedPayload> {
    const parseResult = StripeRawWebhookSchema.safeParse(rawWebhook);
    if (!parseResult.success) {
      throw new Error(`[STRIPE_BRIDGE_ERROR]: Invalid Stripe raw webhook shape: ${parseResult.error.message}`);
    }

    const raw = parseResult.data;
    const subObj = raw.data.object;
    const nowUtc = new Date().toISOString();

    const rawTier = (subObj.metadata as Record<string, string> | undefined)?.tier ?? 'DIAMAX_PRO';
    const validTiers: CommercialTier[] = ['DIAMAX_PRO', 'KINEBASE_3D', 'ENTERPRISE_CUSTOM', 'ACADEMY_ANNUAL'];
    const tier: CommercialTier = validTiers.includes(rawTier as CommercialTier) ? (rawTier as CommercialTier) : 'DIAMAX_PRO';

    const rawStatus = String(subObj.status ?? 'active');
    const validStatuses: SubscriptionStatus[] = ['active', 'past_due', 'canceled', 'trialing', 'unpaid', 'incomplete'];
    const status: SubscriptionStatus = validStatuses.includes(rawStatus as SubscriptionStatus)
      ? (rawStatus as SubscriptionStatus)
      : 'active';

    const periodStart = subObj.current_period_start
      ? new Date(Number(subObj.current_period_start) * 1000).toISOString()
      : nowUtc;
    const periodEnd = subObj.current_period_end
      ? new Date(Number(subObj.current_period_end) * 1000).toISOString()
      : new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString();

    const payloadData: SubscriptionUpdatedPayload = {
      subscriptionId: String(subObj.id ?? `sub_${Date.now()}`),
      customerId: String(subObj.customer ?? `cus_${Date.now()}`),
      customerEmail: (subObj.customer_email as string) ?? `customer_${subObj.customer}@3treedigital.com`,
      tier,
      status,
      currentPeriodStart: periodStart,
      currentPeriodEnd: periodEnd,
      cancelAtPeriodEnd: Boolean(subObj.cancel_at_period_end),
      canceledAt: subObj.canceled_at ? new Date(Number(subObj.canceled_at) * 1000).toISOString() : undefined,
      updatedAt: nowUtc,
    };

    const validatedPayload = SubscriptionUpdatedPayloadSchema.parse(payloadData);

    const eventId = `evt_sub_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const idempotencyKey = `idem_stripe_${raw.id}`;

    const metadata: EventMetadata = {
      correlationId: options.correlationId ?? `corr_sub_${payloadData.subscriptionId}`,
      causationId: options.causationId ?? `stripe_event_${raw.id}`,
      retryCount: 0,
      environment: options.environment ?? 'development',
    };

    return {
      eventId,
      idempotencyKey,
      eventType: 'commercial.subscription.updated',
      version: '1.0.0',
      timestampUtc: nowUtc,
      issuerAgentId: 'AG-028', // Titan (Key Accounts Lead)
      targetAgentId: 'AG-020', // Leo (CFO)
      priority: options.priority ?? 'P1_HIGH',
      payload: validatedPayload,
      metadata,
    };
  }

  /**
   * Transforms raw Stripe invoice.payment_succeeded into EVT-011 CanonicalEventEnvelope
   */
  public static toInvoicePaidEnvelope(
    rawWebhook: unknown,
    options: {
      correlationId?: string;
      causationId?: string;
      environment?: 'production' | 'staging' | 'development';
      priority?: EventPriority;
    } = {}
  ): CanonicalEventEnvelope<InvoicePaidPayload> {
    const parseResult = StripeRawWebhookSchema.safeParse(rawWebhook);
    if (!parseResult.success) {
      throw new Error(`[STRIPE_BRIDGE_ERROR]: Invalid Stripe raw webhook shape: ${parseResult.error.message}`);
    }

    const raw = parseResult.data;
    const invObj = raw.data.object;
    const nowUtc = new Date().toISOString();

    const rawCurrency = ((invObj.currency as string) ?? 'usd').toLowerCase();
    const validCurrencies: CommercialCurrency[] = ['usd', 'eur', 'mxn', 'ves'];
    const currency: CommercialCurrency = validCurrencies.includes(rawCurrency as CommercialCurrency)
      ? (rawCurrency as CommercialCurrency)
      : 'usd';

    const rawReason = String(invObj.billing_reason ?? 'subscription_cycle');
    const validReasons: BillingReason[] = ['subscription_create', 'subscription_cycle', 'manual', 'upcoming'];
    const billingReason: BillingReason = validReasons.includes(rawReason as BillingReason)
      ? (rawReason as BillingReason)
      : 'subscription_cycle';

    const payloadData: InvoicePaidPayload = {
      invoiceId: String(invObj.id ?? `in_${Date.now()}`),
      subscriptionId: invObj.subscription ? String(invObj.subscription) : undefined,
      customerId: String(invObj.customer ?? `cus_${Date.now()}`),
      customerEmail: (invObj.customer_email as string) ?? `customer_${invObj.customer}@3treedigital.com`,
      amountPaidCents: Number(invObj.amount_paid ?? 0),
      currency,
      hostedInvoiceUrl: (invObj.hosted_invoice_url as string) ?? 'https://invoice.stripe.com/receipt',
      pdfInvoiceUrl: invObj.invoice_pdf ? String(invObj.invoice_pdf) : undefined,
      billingReason,
      paidAt: nowUtc,
    };

    const validatedPayload = InvoicePaidPayloadSchema.parse(payloadData);

    const eventId = `evt_inv_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const idempotencyKey = `idem_stripe_${raw.id}`;

    const metadata: EventMetadata = {
      correlationId: options.correlationId ?? `corr_inv_${payloadData.invoiceId}`,
      causationId: options.causationId ?? `stripe_event_${raw.id}`,
      retryCount: 0,
      environment: options.environment ?? 'development',
    };

    return {
      eventId,
      idempotencyKey,
      eventType: 'commercial.invoice.paid',
      version: '1.0.0',
      timestampUtc: nowUtc,
      issuerAgentId: 'AG-020', // Leo (CFO)
      targetAgentId: 'AG-020',
      priority: options.priority ?? 'P1_HIGH',
      payload: validatedPayload,
      metadata,
    };
  }
}

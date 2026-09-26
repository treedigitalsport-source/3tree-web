/**
 * 3Tree Digital Sport IA — Commercial Pipeline & Notifications Runtime
 * Core Type Definitions for Subsystem 015
 * Specification: 3T-AUDIT-015
 */

import { CanonicalEventEnvelope, CanonicalAgentId, CanonicalDepartmentId } from '../event-bus/types';

export type CommercialTier =
  | 'DIAMAX_PRO'
  | 'KINEBASE_3D'
  | 'ENTERPRISE_CUSTOM'
  | 'ACADEMY_ANNUAL';

export type CommercialCurrency = 'usd' | 'eur' | 'mxn' | 'ves';

export type SubscriptionStatus =
  | 'active'
  | 'past_due'
  | 'canceled'
  | 'trialing'
  | 'unpaid'
  | 'incomplete';

export type PaymentStatus = 'paid' | 'unpaid' | 'no_payment_required';

export type BillingReason =
  | 'subscription_create'
  | 'subscription_cycle'
  | 'manual'
  | 'upcoming';

// EVT-009 Payload
export interface CheckoutCompletedPayload {
  checkoutSessionId: string;
  customerId: string;
  customerEmail: string;
  customerName: string;
  tier: CommercialTier;
  amountTotalCents: number;
  currency: CommercialCurrency;
  paymentStatus: PaymentStatus;
  invoiceId?: string;
  metadata?: Record<string, string>;
  completedAt: string;
}

// EVT-010 Payload
export interface SubscriptionUpdatedPayload {
  subscriptionId: string;
  customerId: string;
  customerEmail: string;
  tier: CommercialTier;
  status: SubscriptionStatus;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  canceledAt?: string;
  updatedAt: string;
}

// EVT-011 Payload
export interface InvoicePaidPayload {
  invoiceId: string;
  subscriptionId?: string;
  customerId: string;
  customerEmail: string;
  amountPaidCents: number;
  currency: CommercialCurrency;
  hostedInvoiceUrl: string;
  pdfInvoiceUrl?: string;
  billingReason: BillingReason;
  paidAt: string;
}

// Raw Inbound Stripe Webhook Event representation
export interface StripeRawWebhookEvent {
  id: string;
  object: 'event';
  type: string;
  created: number;
  data: {
    object: Record<string, unknown>;
  };
  livemode?: boolean;
}

// Email Notification Types
export type NotificationTemplate =
  | 'WELCOME_ONBOARDING'
  | 'PAYMENT_RECEIPT'
  | 'PAYMENT_FAILED_ALERT'
  | 'ENTERPRISE_QUOTE';

export interface EmailNotificationRequest {
  template: NotificationTemplate;
  recipientEmail: string;
  recipientName?: string;
  tier?: CommercialTier;
  amountFormatted?: string;
  receiptUrl?: string;
  metadata?: Record<string, string>;
}

export interface EmailNotificationResult {
  success: boolean;
  messageId?: string;
  template: NotificationTemplate;
  recipientEmail: string;
  timestampUtc: string;
  error?: string;
}

// Commercial Multi-Agent Telemetry Types
export interface CommercialAgentNotification {
  agentId: CanonicalAgentId;
  departmentId: CanonicalDepartmentId;
  role: string;
  status: 'PROVISIONED' | 'RECORDED' | 'ALERT_DUNNING' | 'LEAD_ASSIGNED';
  outputSummary: string;
  timestampUtc: string;
}

export interface CommercialTelemetryResult {
  eventType: string;
  eventId: string;
  correlationId: string;
  notifiedAgents: CommercialAgentNotification[];
  ledgerImpactEstimatedCents: number;
  processedAt: string;
}

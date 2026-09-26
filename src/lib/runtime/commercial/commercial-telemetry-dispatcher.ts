/**
 * 3Tree Digital Sport IA — Commercial Pipeline Telemetry Dispatcher
 * Multi-Agent Routing toward DP-06 (Finanzas) and DP-10 (Ventas & Cuentas)
 * Specification: 3T-AUDIT-015
 */

import { CanonicalEventEnvelope } from '../event-bus/types';
import {
  CheckoutCompletedPayload,
  SubscriptionUpdatedPayload,
  InvoicePaidPayload,
  CommercialTelemetryResult,
  CommercialAgentNotification,
} from './types';

export class CommercialTelemetryDispatcher {
  /**
   * Dispatches commercial events to the appropriate corporate agents
   */
  public dispatchCommercialEvent(
    envelope:
      | CanonicalEventEnvelope<CheckoutCompletedPayload>
      | CanonicalEventEnvelope<SubscriptionUpdatedPayload>
      | CanonicalEventEnvelope<InvoicePaidPayload>
  ): CommercialTelemetryResult {
    const nowUtc = new Date().toISOString();
    const notifiedAgents: CommercialAgentNotification[] = [];
    let ledgerImpactCents = 0;

    switch (envelope.eventType) {
      case 'commercial.checkout.completed': {
        const payload = envelope.payload as CheckoutCompletedPayload;
        ledgerImpactCents = payload.amountTotalCents;

        // 1. Leo (AG-020) — CFO: Ledger & Revenue Credit
        notifiedAgents.push({
          agentId: 'AG-020',
          departmentId: 'DP-06',
          role: 'CFO & Revenue Accounting',
          status: 'RECORDED',
          outputSummary: `Revenue of ${(payload.amountTotalCents / 100).toFixed(2)} ${payload.currency.toUpperCase()} booked for customer ${payload.customerEmail} (${payload.tier}).`,
          timestampUtc: nowUtc,
        });

        // 2. Hermes (AG-025) — Sales Lead: Account Provisioning
        notifiedAgents.push({
          agentId: 'AG-025',
          departmentId: 'DP-10',
          role: 'Sales & VIP Onboarding Lead',
          status: 'PROVISIONED',
          outputSummary: `VIP Account provisioning triggered for ${payload.customerName} (${payload.customerEmail}) on tier ${payload.tier}.`,
          timestampUtc: nowUtc,
        });

        // 3. Titan (AG-028) — Key Accounts
        notifiedAgents.push({
          agentId: 'AG-028',
          departmentId: 'DP-10',
          role: 'Key Account Management',
          status: 'RECORDED',
          outputSummary: `Customer account registered with initial status: ACTIVE.`,
          timestampUtc: nowUtc,
        });
        break;
      }

      case 'commercial.subscription.updated': {
        const payload = envelope.payload as SubscriptionUpdatedPayload;

        const isDunning = payload.status === 'past_due' || payload.status === 'unpaid';

        // 1. Leo (AG-020) — CFO
        notifiedAgents.push({
          agentId: 'AG-020',
          departmentId: 'DP-06',
          role: 'CFO & Billing',
          status: isDunning ? 'ALERT_DUNNING' : 'RECORDED',
          outputSummary: isDunning
            ? `CRITICAL DUNNING ALERT: Subscription ${payload.subscriptionId} is in status ${payload.status}. Invoice collection required.`
            : `Subscription ${payload.subscriptionId} status updated to ${payload.status}.`,
          timestampUtc: nowUtc,
        });

        // 2. Titan (AG-028) — Account Care
        notifiedAgents.push({
          agentId: 'AG-028',
          departmentId: 'DP-10',
          role: 'Account Retention Specialist',
          status: isDunning ? 'ALERT_DUNNING' : 'RECORDED',
          outputSummary: payload.cancelAtPeriodEnd
            ? `CHURN RISK: Customer ${payload.customerEmail} set cancelAtPeriodEnd=true. Intervention suggested.`
            : `Account health nominal. Status: ${payload.status}.`,
          timestampUtc: nowUtc,
        });
        break;
      }

      case 'commercial.invoice.paid': {
        const payload = envelope.payload as InvoicePaidPayload;
        ledgerImpactCents = payload.amountPaidCents;

        // 1. Leo (AG-020) — CFO
        notifiedAgents.push({
          agentId: 'AG-020',
          departmentId: 'DP-06',
          role: 'CFO & Revenue Accounting',
          status: 'RECORDED',
          outputSummary: `Invoice ${payload.invoiceId} marked PAID. Amount: ${(payload.amountPaidCents / 100).toFixed(2)} ${payload.currency.toUpperCase()} via ${payload.billingReason}.`,
          timestampUtc: nowUtc,
        });
        break;
      }
    }

    return {
      eventType: envelope.eventType,
      eventId: envelope.eventId,
      correlationId: envelope.metadata.correlationId,
      notifiedAgents,
      ledgerImpactEstimatedCents: ledgerImpactCents,
      processedAt: nowUtc,
    };
  }
}

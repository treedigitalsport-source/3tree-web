/**
 * 3Tree Digital Sport IA — Commercial Pipeline & Resend Notifications
 * Anti-Corruption Layer: NotificationDispatcher
 * Transactional Email Generation & Delivery via Resend SDK
 * Specification: 3T-AUDIT-015
 */

import { Resend } from 'resend';
import { EmailNotificationRequestSchema } from './schemas';
import {
  EmailNotificationRequest,
  EmailNotificationResult,
  NotificationTemplate,
} from './types';

export class NotificationDispatcher {
  private resendClient: Resend | null = null;
  private defaultSender: string;

  constructor(apiKey?: string, defaultSender: string = '3Tree Digital Sport IA <onboarding@resend.dev>') {
    const key = apiKey ?? process.env.RESEND_API_KEY;
    if (key && key.trim().length > 0) {
      this.resendClient = new Resend(key);
    }
    this.defaultSender = defaultSender;
  }

  /**
   * Generates deterministic HTML content for canonical notification templates
   */
  public static renderTemplate(template: NotificationTemplate, data: EmailNotificationRequest): {
    subject: string;
    html: string;
  } {
    const name = data.recipientName ?? 'Estimado Cliente';
    const tier = data.tier ?? 'DIAMAX_PRO';
    const amount = data.amountFormatted ?? '$0.00 USD';

    switch (template) {
      case 'WELCOME_ONBOARDING':
        return {
          subject: `⚡ Bienvenido a 3Tree Digital Sport IA — Activación de ${tier}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #111;">
              <h1 style="color: #059669;">¡Bienvenido a 3Tree Digital Sport IA!</h1>
              <p>Hola <strong>${name}</strong>,</p>
              <p>Tu suscripción al plan <strong>${tier}</strong> ha sido aprovisionada con éxito en nuestra red agéntica.</p>
              <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 0;"><strong>Plan:</strong> ${tier}</p>
                <p style="margin: 4px 0 0 0;"><strong>Estado:</strong> Activo & Verificado</p>
              </div>
              <p>Puedes acceder a la consola táctica y a tus reportes sabermétricos de inmediato.</p>
              <p style="color: #6b7280; font-size: 12px; margin-top: 30px;">3Tree Digital Sport IA LLC — Advanced Sports Intelligence</p>
            </div>
          `,
        };

      case 'PAYMENT_RECEIPT':
        return {
          subject: `🧾 Recibo de Pago Confirmado: ${amount} — 3Tree Digital Sport IA`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #111;">
              <h2 style="color: #10b981;">Pago Procesado Exitosamente</h2>
              <p>Hola <strong>${name}</strong>,</p>
              <p>Hemos recibido correctamente tu pago de <strong>${amount}</strong> para el servicio <strong>${tier}</strong>.</p>
              ${
                data.receiptUrl
                  ? `<p><a href="${data.receiptUrl}" style="background: #059669; color: #fff; padding: 10px 18px; text-decoration: none; border-radius: 6px; display: inline-block;">Ver Factura en Línea</a></p>`
                  : ''
              }
              <p style="color: #6b7280; font-size: 12px; margin-top: 30px;">Departamento de Finanzas (DP-06) — 3Tree Digital Sport IA LLC</p>
            </div>
          `,
        };

      case 'PAYMENT_FAILED_ALERT':
        return {
          subject: `⚠️ Acción Requerida: Pago no procesado — 3Tree Digital Sport IA`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #111;">
              <h2 style="color: #dc2626;">Intento de Pago Fallido</h2>
              <p>Hola <strong>${name}</strong>,</p>
              <p>No pudimos procesar el cobro de <strong>${amount}</strong> para tu suscripción <strong>${tier}</strong>.</p>
              <p>Por favor actualiza tu método de pago en el portal de clientes para evitar la suspensión del servicio.</p>
              <p style="color: #6b7280; font-size: 12px; margin-top: 30px;">Equipo de Client Care & Facturación (DP-10 / DP-06)</p>
            </div>
          `,
        };

      case 'ENTERPRISE_QUOTE':
        return {
          subject: `💼 Propuesta Comercial Corporativa: ${tier} — 3Tree Digital Sport IA`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #111;">
              <h2 style="color: #2563eb;">Propuesta Corporativa 3Tree</h2>
              <p>Estimado/a <strong>${name}</strong>,</p>
              <p>Adjuntamos los detalles técnicos y comerciales para la implementación de <strong>${tier}</strong> en su organización.</p>
              <p>Nuestro equipo de B2B Sales (Hermes / DP-10) está disponible para coordinar la sesión de despliegue.</p>
              <p style="color: #6b7280; font-size: 12px; margin-top: 30px;">3Tree Digital Sport IA LLC — Enterprise Solutions</p>
            </div>
          `,
        };
    }
  }

  /**
   * Dispatches transactional email with fallback simulation if Resend API key is mock or offline
   */
  public async dispatchEmail(request: unknown): Promise<EmailNotificationResult> {
    const parseResult = EmailNotificationRequestSchema.safeParse(request);
    if (!parseResult.success) {
      throw new Error(`[NOTIFICATION_VALIDATION_ERROR]: Invalid email request: ${parseResult.error.message}`);
    }

    const data: EmailNotificationRequest = parseResult.data;
    const nowUtc = new Date().toISOString();
    const rendered = NotificationDispatcher.renderTemplate(data.template, data);

    if (!this.resendClient) {
      // Deterministic Mock/Dry-Run Delivery for testing or environments without live API keys
      return {
        success: true,
        messageId: `msg_mock_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        template: data.template,
        recipientEmail: data.recipientEmail,
        timestampUtc: nowUtc,
      };
    }

    try {
      const response = await this.resendClient.emails.send({
        from: this.defaultSender,
        to: data.recipientEmail,
        subject: rendered.subject,
        html: rendered.html,
      });

      if (response.error) {
        return {
          success: false,
          template: data.template,
          recipientEmail: data.recipientEmail,
          timestampUtc: nowUtc,
          error: response.error.message,
        };
      }

      return {
        success: true,
        messageId: response.data?.id ?? `msg_resend_${Date.now()}`,
        template: data.template,
        recipientEmail: data.recipientEmail,
        timestampUtc: nowUtc,
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      return {
        success: false,
        template: data.template,
        recipientEmail: data.recipientEmail,
        timestampUtc: nowUtc,
        error: message,
      };
    }
  }
}

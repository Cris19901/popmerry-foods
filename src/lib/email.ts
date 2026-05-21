import { Resend } from 'resend';
import { formatPrice } from './products-data';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = 'PopMerry Foods <orders@popmerryfoods.com>';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? 'hello@popmerryfoods.com';

interface OrderEmailData {
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  items: { product: { name: string; price: number }; quantity: number }[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  paystackReference?: string;
}

function itemRows(items: OrderEmailData['items']) {
  return items.map(i =>
    `<tr>
      <td style="padding:8px 0;border-bottom:1px solid #fef3c7;font-size:14px;color:#44403c;">${i.quantity}× ${i.product.name}</td>
      <td style="padding:8px 0;border-bottom:1px solid #fef3c7;font-size:14px;color:#44403c;text-align:right;">${formatPrice(i.product.price * i.quantity)}</td>
    </tr>`
  ).join('');
}

export async function sendCustomerReceipt(data: OrderEmailData) {
  if (!process.env.RESEND_API_KEY) return;

  await resend.emails.send({
    from: FROM,
    to: data.customerEmail,
    subject: `Order confirmed — PopMerry Foods (#${data.orderId.slice(0, 8).toUpperCase()})`,
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;background:#fffaf0;padding:32px;border-radius:16px;">
        <h1 style="font-size:24px;color:#1a0800;margin:0 0 4px;">Order Confirmed!</h1>
        <p style="color:#78716c;margin:0 0 24px;">Hi ${data.customerName}, your payment was successful. Here's your summary:</p>

        <div style="background:#fff;border-radius:12px;border:1px solid #fde68a;overflow:hidden;margin-bottom:24px;">
          <table style="width:100%;border-collapse:collapse;padding:16px 20px;display:block;">
            ${itemRows(data.items)}
            <tr>
              <td style="padding:8px 0;font-size:13px;color:#a8a29e;">Subtotal</td>
              <td style="padding:8px 0;font-size:13px;color:#a8a29e;text-align:right;">${formatPrice(data.subtotal)}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;font-size:13px;color:#a8a29e;">Delivery</td>
              <td style="padding:8px 0;font-size:13px;color:#a8a29e;text-align:right;">${data.deliveryFee === 0 ? 'Free' : formatPrice(data.deliveryFee)}</td>
            </tr>
            <tr>
              <td style="padding:12px 0 4px;font-size:16px;font-weight:700;color:#1a0800;border-top:2px solid #fde68a;">Total Paid</td>
              <td style="padding:12px 0 4px;font-size:16px;font-weight:700;color:#b45309;text-align:right;border-top:2px solid #fde68a;">${formatPrice(data.total)}</td>
            </tr>
          </table>
        </div>

        <p style="font-size:13px;color:#78716c;margin:0 0 4px;"><strong style="color:#44403c;">Delivering to:</strong> ${data.customerAddress}</p>
        ${data.paystackReference ? `<p style="font-size:12px;color:#a8a29e;margin:0;">Ref: ${data.paystackReference}</p>` : ''}

        <div style="margin-top:24px;background:#f0fdf4;border-radius:10px;padding:16px;font-size:13px;color:#166534;">
          We'll confirm your order via WhatsApp within 30 minutes. Questions? Reply to this email.
        </div>
      </div>
    `,
  });
}

export async function sendAdminNewOrderAlert(data: OrderEmailData) {
  if (!process.env.RESEND_API_KEY) return;

  await resend.emails.send({
    from: FROM,
    to: ADMIN_EMAIL,
    subject: `New order — ${data.customerName} — ${formatPrice(data.total)}`,
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:24px;">
        <h2 style="color:#1a0800;margin:0 0 16px;">New Order Received</h2>
        <p><strong>Customer:</strong> ${data.customerName}</p>
        <p><strong>Phone:</strong> ${data.customerPhone}</p>
        <p><strong>Email:</strong> ${data.customerEmail}</p>
        <p><strong>Address:</strong> ${data.customerAddress}</p>
        <hr style="border:none;border-top:1px solid #e7e5e4;margin:16px 0;" />
        <table style="width:100%;border-collapse:collapse;">
          ${itemRows(data.items)}
        </table>
        <hr style="border:none;border-top:1px solid #e7e5e4;margin:16px 0;" />
        <p style="font-size:18px;font-weight:700;color:#b45309;">Total: ${formatPrice(data.total)}</p>
        ${data.paystackReference ? `<p style="font-size:12px;color:#a8a29e;">Ref: ${data.paystackReference}</p>` : ''}
      </div>
    `,
  });
}

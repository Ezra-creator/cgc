import { Order } from '@/types'
import { formatPrice, formatDate } from './utils'

export const orderConfirmationEmail = (order: Order & { id: string }): string => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Order Confirmed — CGC</title>
</head>
<body style="margin:0;padding:0;background:#FAF9F6;font-family:Inter,Arial,sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:32px 20px;">

    <!-- Header -->
    <div style="text-align:center;padding-bottom:24px;border-bottom:1px solid #E6E3DD;margin-bottom:32px;">
      <h1 style="margin:0;font-size:24px;font-weight:800;color:#141414;letter-spacing:0.02em;">CGC</h1>
      <p style="margin:4px 0 0;font-size:11px;color:#6B6B6B;letter-spacing:0.08em;text-transform:uppercase;">Cary Grant Clothing</p>
    </div>

    <!-- Confirmation -->
    <div style="text-align:center;margin-bottom:32px;">
      <div style="width:56px;height:56px;border-radius:50%;border:2px solid #E0102A;display:inline-flex;align-items:center;justify-content:center;margin-bottom:16px;">
        <span style="color:#E0102A;font-size:22px;">✓</span>
      </div>
      <h2 style="margin:0;font-size:20px;font-weight:700;color:#141414;">Order confirmed!</h2>
      <p style="margin:6px 0 0;font-size:14px;color:#6B6B6B;">Thank you, ${order.customer_name.split(' ')[0]}. We'll be in touch shortly to confirm your delivery.</p>
      <p style="margin:8px 0 0;font-size:12px;color:#9a9a9a;font-family:monospace;letter-spacing:0.06em;">Order #${order.id.slice(0, 12).toUpperCase()}</p>
    </div>

    <!-- Items -->
    <div style="background:#fff;border:1px solid #E6E3DD;border-radius:12px;padding:20px;margin-bottom:20px;">
      <h3 style="margin:0 0 16px;font-size:12px;font-weight:600;color:#141414;text-transform:uppercase;letter-spacing:0.06em;">Items ordered</h3>
      ${order.items.map(item => `
        <div style="display:flex;justify-content:space-between;padding:10px 0;border-bottom:1px solid #E6E3DD;">
          <div>
            <p style="margin:0;font-size:13px;font-weight:600;color:#141414;">${item.product.name}</p>
            <p style="margin:3px 0 0;font-size:11px;color:#6B6B6B;">Size: ${item.size} · Color: ${item.color} · Qty: ${item.quantity}</p>
          </div>
          <p style="margin:0;font-size:13px;font-weight:600;color:#E0102A;">${formatPrice(item.product.price * item.quantity)}</p>
        </div>
      `).join('')}
      <div style="padding-top:16px;">
        <div style="display:flex;justify-content:space-between;margin-bottom:6px;">
          <span style="font-size:13px;color:#6B6B6B;">Subtotal</span>
          <span style="font-size:13px;color:#141414;">${formatPrice(order.subtotal)}</span>
        </div>
        <div style="display:flex;justify-content:space-between;margin-bottom:12px;">
          <span style="font-size:13px;color:#6B6B6B;">HST (13%)</span>
          <span style="font-size:13px;color:#141414;">${formatPrice(order.tax)}</span>
        </div>
        <div style="display:flex;justify-content:space-between;padding-top:12px;border-top:1px solid #E6E3DD;">
          <span style="font-size:15px;font-weight:700;color:#141414;">Total</span>
          <span style="font-size:15px;font-weight:700;color:#E0102A;">${formatPrice(order.total)}</span>
        </div>
      </div>
    </div>

    <!-- Delivery -->
    <div style="background:#fff;border:1px solid #E6E3DD;border-radius:12px;padding:20px;margin-bottom:28px;">
      <h3 style="margin:0 0 12px;font-size:12px;font-weight:600;color:#141414;text-transform:uppercase;letter-spacing:0.06em;">Delivery address</h3>
      <p style="margin:0;font-size:13px;color:#141414;font-weight:600;">${order.customer_name}</p>
      <p style="margin:4px 0 0;font-size:13px;color:#6B6B6B;line-height:1.6;">${order.address}<br>${order.city}, ${order.province} ${order.postal_code}<br>${order.country}</p>
    </div>

    <!-- Footer -->
    <div style="text-align:center;border-top:1px solid #E6E3DD;padding-top:24px;">
      <p style="margin:0;font-size:13px;color:#6B6B6B;">Questions? Contact us at</p>
      <a href="mailto:cary@carygrantclothing.com" style="color:#E0102A;font-size:13px;text-decoration:none;">cary@carygrantclothing.com</a>
      <p style="margin:4px 0 0;font-size:12px;color:#9a9a9a;">+1 705-717-1073 · 54 Dunlop St W, Barrie, ON</p>
      <p style="margin:16px 0 0;font-size:11px;color:#9a9a9a;letter-spacing:0.06em;">© 2026 CARY GRANT CLOTHING · EST. 2002 🇨🇦</p>
    </div>

  </div>
</body>
</html>
`

export const ownerNotificationEmail = (order: Order & { id: string }): string => `
<!DOCTYPE html>
<html>
<body style="font-family:Inter,Arial,sans-serif;background:#FAF9F6;padding:32px 20px;max-width:560px;margin:0 auto;">
  <h2 style="color:#E0102A;margin:0 0 4px;">🛍️ New Order</h2>
  <p style="color:#6B6B6B;font-size:13px;margin:0 0 24px;">Order #${order.id.slice(0,12).toUpperCase()}</p>
  <table style="width:100%;border-collapse:collapse;font-size:13px;">
    <tr style="border-bottom:1px solid #E6E3DD;">
      <td style="padding:10px 0;color:#6B6B6B;width:140px;">Customer</td>
      <td style="padding:10px 0;color:#141414;font-weight:600;">${order.customer_name}</td>
    </tr>
    <tr style="border-bottom:1px solid #E6E3DD;">
      <td style="padding:10px 0;color:#6B6B6B;">Email</td>
      <td style="padding:10px 0;color:#141414;">${order.email}</td>
    </tr>
    <tr style="border-bottom:1px solid #E6E3DD;">
      <td style="padding:10px 0;color:#6B6B6B;">Phone</td>
      <td style="padding:10px 0;color:#141414;">${order.phone}</td>
    </tr>
    <tr style="border-bottom:1px solid #E6E3DD;">
      <td style="padding:10px 0;color:#6B6B6B;">Deliver to</td>
      <td style="padding:10px 0;color:#141414;">${order.address}, ${order.city}, ${order.province}</td>
    </tr>
    <tr style="border-bottom:1px solid #E6E3DD;">
      <td style="padding:10px 0;color:#6B6B6B;">Items</td>
      <td style="padding:10px 0;color:#141414;">${order.items.map(i => `${i.product.name} (${i.size}, ${i.color}) x${i.quantity}`).join('<br>')}</td>
    </tr>
    <tr>
      <td style="padding:10px 0;color:#6B6B6B;">Total</td>
      <td style="padding:10px 0;color:#E0102A;font-size:18px;font-weight:700;">${formatPrice(order.total)}</td>
    </tr>
  </table>
  <p style="margin:24px 0 0;font-size:12px;color:#9a9a9a;">Log in to your admin dashboard to manage this order.</p>
</body>
</html>
`

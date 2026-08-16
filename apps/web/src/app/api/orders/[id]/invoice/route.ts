import { NextResponse } from 'next/server'
import { getApiSession } from '@/lib/session'
import { prisma } from '@aumveda/db'
import { mapOrder } from '@/lib/order-mapper'

export const dynamic = 'force-dynamic'

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export async function GET(
  _req: Request,
  { params }: { params: { id: string } },
) {
  const session = await getApiSession()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const orderId = parseInt(params.id, 10)
  if (isNaN(orderId)) {
    return NextResponse.json({ success: false, error: 'Invalid order id' }, { status: 400 })
  }

  const order = await prisma.order.findFirst({
    where: { id: orderId, userId: session.user.id },
    include: {
      items: { include: { product: { select: { images: true, productType: true } } } },
    },
  })

  if (!order) {
    return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 })
  }

  const view = mapOrder(order)
  const date = new Date(order.createdAt).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const rowsHtml = view.items
    .map(
      (i) => `
      <tr>
        <td style="padding:8px 4px;border-bottom:1px solid #e2e8f0">${escapeHtml(i.name)}</td>
        <td style="padding:8px 4px;border-bottom:1px solid #e2e8f0;text-align:center">${i.quantity}</td>
        <td style="padding:8px 4px;border-bottom:1px solid #e2e8f0;text-align:right">₹${i.price.toFixed(2)}</td>
        <td style="padding:8px 4px;border-bottom:1px solid #e2e8f0;text-align:right">₹${(i.quantity * i.price).toFixed(2)}</td>
      </tr>`,
    )
    .join('')

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>Aumveda Invoice #${view.id}</title>
<style>
  body { font-family: -apple-system, 'Segoe UI', Roboto, sans-serif; color: #0f172a; max-width: 680px; margin: 40px auto; padding: 0 24px; }
  h1 { color: #0F5B56; }
  .muted { color: #64748b; font-size: 13px; }
  table { width: 100%; border-collapse: collapse; margin-top: 16px; }
  th { text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: #64748b; border-bottom: 2px solid #0F5B56; padding: 8px 4px; }
  .total { font-size: 18px; font-weight: 700; text-align: right; margin-top: 16px; }
</style>
</head>
<body>
  <h1>Aumveda</h1>
  <p class="muted">Invoice ${date}</p>
  <p class="muted">Order #${escapeHtml(view.id)} &bull; ${escapeHtml(view.status)}</p>
  <table>
    <thead>
      <tr><th>Item</th><th style="text-align:center">Qty</th><th style="text-align:right">Price</th><th style="text-align:right">Amount</th></tr>
    </thead>
    <tbody>${rowsHtml}</tbody>
  </table>
  <p class="total">Total: ₹${view.total.toFixed(2)}</p>
  <p class="muted">Payment: ${escapeHtml(view.paymentMethod)}</p>
</body>
</html>`

  const url = `data:text/html;charset=utf-8,${encodeURIComponent(html)}`
  return NextResponse.json({ success: true, url })
}

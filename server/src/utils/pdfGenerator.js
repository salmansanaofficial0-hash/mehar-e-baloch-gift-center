import PDFDocument from 'pdfkit';

export const generateInvoicePDF = (order, res) => {
  const doc = new PDFDocument({ margin: 50 });

  // Pipe the document directly to the response stream
  doc.pipe(res);

  // Header
  doc
    .fillColor('#1e293b')
    .fontSize(20)
    .text('MEHR-E-BALOCH COSMETICS & GIFTS', 50, 50)
    .fontSize(10)
    .text('New Star Plus Market, Shop# G-31', 50, 75)
    .text('Near PTCL Office, Turbat', 50, 90)
    .text('Phone: 0336-5415272 / 0315-2846050', 50, 105);

  // Invoice label
  doc
    .fontSize(24)
    .fillColor('#e11d48')
    .text('INVOICE', 400, 50, { align: 'right' });

  doc
    .fontSize(10)
    .fillColor('#475569')
    .text(`Invoice Number: INV-${order._id.toString().slice(-6).toUpperCase()}`, 400, 80, { align: 'right' })
    .text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 400, 95, { align: 'right' })
    .text(`Status: ${order.status.toUpperCase()}`, 400, 110, { align: 'right' });

  // Divider
  doc.moveTo(50, 135).lineTo(550, 135).strokeColor('#cbd5e1').stroke();

  // Billing details
  doc
    .fontSize(12)
    .fillColor('#1e293b')
    .text('BILL TO:', 50, 150)
    .fontSize(10)
    .fillColor('#475569')
    .text(order.shippingAddress.fullName, 50, 170)
    .text(order.shippingAddress.address, 50, 185)
    .text(`${order.shippingAddress.city}, ${order.shippingAddress.country} - ${order.shippingAddress.postalCode}`, 50, 200)
    .text(`Phone: ${order.shippingAddress.phone}`, 50, 215);

  // Table header
  let y = 250;
  doc
    .fontSize(10)
    .fillColor('#1e293b')
    .text('Item Description', 50, y, { bold: true })
    .text('Qty', 300, y, { width: 50, align: 'right', bold: true })
    .text('Unit Price', 370, y, { width: 80, align: 'right', bold: true })
    .text('Total', 470, y, { width: 80, align: 'right', bold: true });

  // Table divider
  doc.moveTo(50, y + 15).lineTo(550, y + 15).strokeColor('#94a3b8').stroke();
  y += 25;

  // Items
  order.orderItems.forEach((item) => {
    doc
      .fillColor('#475569')
      .text(item.name, 50, y, { width: 240 })
      .text(item.quantity.toString(), 300, y, { width: 50, align: 'right' })
      .text(`${item.price} PKR`, 370, y, { width: 80, align: 'right' })
      .text(`${item.price * item.quantity} PKR`, 470, y, { width: 80, align: 'right' });

    y += 20;
  });

  // Table divider
  doc.moveTo(50, y).lineTo(550, y).strokeColor('#cbd5e1').stroke();
  y += 10;

  // Subtotal, Shipping, Tax, Total
  const labelX = 350;
  const valueX = 470;

  doc
    .fillColor('#475569')
    .text('Items Price:', labelX, y, { width: 100, align: 'right' })
    .text(`${order.itemsPrice} PKR`, valueX, y, { width: 80, align: 'right' });
  y += 15;

  if (order.shippingPrice > 0) {
    doc
      .text('Shipping:', labelX, y, { width: 100, align: 'right' })
      .text(`${order.shippingPrice} PKR`, valueX, y, { width: 80, align: 'right' });
    y += 15;
  }

  if (order.taxPrice > 0) {
    doc
      .text('Tax:', labelX, y, { width: 100, align: 'right' })
      .text(`${order.taxPrice} PKR`, valueX, y, { width: 80, align: 'right' });
    y += 15;
  }

  doc.moveTo(labelX + 20, y).lineTo(550, y).strokeColor('#94a3b8').stroke();
  y += 5;

  doc
    .fontSize(12)
    .fillColor('#e11d48')
    .text('Total Price:', labelX, y, { width: 100, align: 'right', bold: true })
    .text(`${order.totalPrice} PKR`, valueX, y, { width: 80, align: 'right', bold: true });

  // Footer note
  doc
    .fontSize(8)
    .fillColor('#94a3b8')
    .text('Thank you for shopping with us! For any query, email us at support@meharbaloch.com', 50, 700, { align: 'center' });

  // Finalize PDF
  doc.end();
};

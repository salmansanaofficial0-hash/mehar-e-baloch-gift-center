import stripe from '../config/stripe.js';
import Order from '../models/Order.js';

// @desc    Create Stripe checkout session
// @route   POST /api/payments/create-checkout-session
// @access  Private
export const createCheckoutSession = async (req, res, next) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findById(orderId).populate('orderItems.product');
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const lineItems = order.orderItems.map((item) => ({
      price_data: {
        currency: 'pkr',
        product_data: {
          name: item.name,
          images: item.image ? [item.image] : [],
        },
        unit_amount: Math.round(item.price * 100), // Stripe expects amounts in cents/paise
      },
      quantity: item.quantity,
    }));

    // Add shipping cost if exists
    if (order.shippingPrice > 0) {
      lineItems.push({
        price_data: {
          currency: 'pkr',
          product_data: {
            name: 'Shipping Fee',
          },
          unit_amount: Math.round(order.shippingPrice * 100),
        },
        quantity: 1,
      });
    }

    // Add tax if exists
    if (order.taxPrice > 0) {
      lineItems.push({
        price_data: {
          currency: 'pkr',
          product_data: {
            name: 'Tax',
          },
          unit_amount: Math.round(order.taxPrice * 100),
        },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: lineItems,
      success_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/order/success?session_id={CHECKOUT_SESSION_ID}&order_id=${order._id}`,
      cancel_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/order/cancel?order_id=${order._id}`,
      metadata: {
        orderId: order._id.toString(),
      },
    });

    res.json({
      success: true,
      data: {
        id: session.id,
        url: session.url,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Stripe Webhook handler
// @route   POST /api/payments/webhook
// @access  Public
export const handleStripeWebhook = async (req, res, next) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      // Direct update for simple mock testing
      const { type, data } = req.body;
      if (type === 'checkout.session.completed') {
        const session = data.object;
        const orderId = session.metadata.orderId;
        const order = await Order.findById(orderId);
        if (order) {
          order.isPaid = true;
          order.paidAt = new Date();
          order.paymentResult = {
            id: session.payment_intent || session.id,
            status: 'completed',
            update_time: new Date().toISOString(),
            email_address: session.customer_details?.email || '',
          };
          order.status = 'confirmed';
          await order.save();
          console.log(`[Stripe Mock Webhook] Order ${orderId} successfully marked as PAID.`);
        }
      }
      return res.status(200).json({ received: true });
    }

    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const orderId = session.metadata.orderId;

      const order = await Order.findById(orderId);
      if (order) {
        order.isPaid = true;
        order.paidAt = new Date();
        order.paymentResult = {
          id: session.payment_intent,
          status: 'completed',
          update_time: new Date().toISOString(),
          email_address: session.customer_details?.email || '',
        };
        order.status = 'confirmed';
        await order.save();
        console.log(`[Stripe Webhook] Order ${orderId} successfully marked as PAID.`);
      }
    }

    res.json({ received: true });
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
};

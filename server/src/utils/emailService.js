import transporter from '../config/nodemailer.js';

export const sendVerificationEmail = async (email, name, code) => {
  const mailOptions = {
    from: `"Mehr-e-Baloch Cosmetics" <${process.env.SMTP_USER || 'no-reply@meharbaloch.com'}>`,
    to: email,
    subject: 'Verify your email address - Mehr-e-Baloch',
    html: `
      <h2>Hello ${name},</h2>
      <p>Thank you for registering at Mehr-e-Baloch Cosmetics. Please verify your email using the verification code below:</p>
      <div style="background: #f4f4f4; padding: 15px; font-size: 24px; font-weight: bold; letter-spacing: 2px; text-align: center; border-radius: 5px;">
        ${code}
      </div>
      <p>This code will expire in 24 hours.</p>
      <p>Best regards,<br/>The Mehr-e-Baloch Team</p>
    `,
  };

  try {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.log(`[Email Mock Service] Verification code for ${email} (${name}): ${code}`);
      return true;
    }
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending verification email:', error.message);
    // Console fallback even if real SMTP fails in dev
    console.log(`[Email Fallback Log] Verification code for ${email} (${name}): ${code}`);
    return false;
  }
};

export const sendPasswordResetEmail = async (email, name, token) => {
  const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password?token=${token}`;
  const mailOptions = {
    from: `"Mehr-e-Baloch Cosmetics" <${process.env.SMTP_USER || 'no-reply@meharbaloch.com'}>`,
    to: email,
    subject: 'Reset your password - Mehr-e-Baloch',
    html: `
      <h2>Hello ${name},</h2>
      <p>We received a request to reset your password. You can do so by clicking the link below:</p>
      <p><a href="${resetUrl}" style="background: #e11d48; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a></p>
      <p>If the button doesn't work, copy and paste this URL into your browser:</p>
      <p>${resetUrl}</p>
      <p>This link is valid for 1 hour. If you didn't request a password reset, you can safely ignore this email.</p>
      <p>Best regards,<br/>The Mehr-e-Baloch Team</p>
    `,
  };

  try {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.log(`[Email Mock Service] Password reset link for ${email} (${name}): ${resetUrl}`);
      return true;
    }
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending password reset email:', error.message);
    console.log(`[Email Fallback Log] Password reset link for ${email} (${name}): ${resetUrl}`);
    return false;
  }
};

export const sendOrderConfirmationEmail = async (email, name, order) => {
  const mailOptions = {
    from: `"Mehr-e-Baloch Cosmetics" <${process.env.SMTP_USER || 'no-reply@meharbaloch.com'}>`,
    to: email,
    subject: `Order Confirmed #${order._id} - Mehr-e-Baloch`,
    html: `
      <h2>Hello ${name},</h2>
      <p>Thank you for your order! We have received it and are processing it.</p>
      <h3>Order Details</h3>
      <p><strong>Order ID:</strong> ${order._id}</p>
      <p><strong>Total Price:</strong> ${order.totalPrice} PKR</p>
      <p><strong>Payment Method:</strong> ${order.paymentMethod.replace(/_/g, ' ').toUpperCase()}</p>
      <p>We will email you once your order has shipped.</p>
      <p>Best regards,<br/>The Mehr-e-Baloch Team</p>
    `,
  };

  try {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.log(`[Email Mock Service] Order confirmation for ${email} (${name}): Order #${order._id}, Total: ${order.totalPrice} PKR`);
      return true;
    }
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending order confirmation email:', error.message);
    console.log(`[Email Fallback Log] Order confirmation for ${email} (${name}): Order #${order._id}, Total: ${order.totalPrice} PKR`);
    return false;
  }
};

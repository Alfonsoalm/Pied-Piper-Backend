// services/email.js
import nodemailer from "nodemailer";

// Configurar el servicio de email
const transporter = nodemailer.createTransport({
  service: "Gmail", // O cualquier servicio SMTP que uses
  auth: {
    user: "albertpruebas926@gmail.com", // Correo del remitente
    pass: "xqrz tfdx eccd rlgd"//"albertoReact99", // Contraseña generada desde tu proveedor de email
  },
});

export const sendVerificationEmail = async (toEmail, token) => {
  console.log("Enviando email de confirmacion");
  const verificationUrl = `http://localhost:5173/verify/${token}`;

  const mailOptions = {
    from: "albertpruebas926@gmail.com",
    to: toEmail,
    subject: "Verificación de correo electrónico",
    html: `
      <h1>Verifica tu correo electrónico</h1>
      <p>Haz clic en el enlace para verificar tu cuenta:</p>
      <a href="${verificationUrl}">${verificationUrl}</a>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Correo de verificación enviado.");
  } catch (error) {
    console.error("Error al enviar el correo:", error);
  }
};

export const sendPasswordResetEmail = async (toEmail, token) => {
  console.log("Enviando email de recuperación de contraseña");
  
  // URL de recuperación (puedes ajustarla según tu frontend/backend)
  const resetUrl = `http://localhost:5173/reset-password/${token}`;

  const mailOptions = {
    from: "albertpruebas926@gmail.com",
    to: toEmail,
    subject: "Recuperación de contraseña",
    html: `
      <h1>Recuperación de Contraseña</h1>
      <p>Haz clic en el enlace para restablecer tu contraseña:</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>Este enlace expirará en 1 hora.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Correo de recuperación enviado.");
  } catch (error) {
    console.error("Error al enviar el correo:", error);
    throw new Error("No se pudo enviar el correo de recuperación.");
  }
};
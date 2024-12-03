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
  const verificationUrl = `http://localhost:3900/api/company/verify/${token}`;

  const mailOptions = {
    from: "albertpruebas926@gmail.com", // alfonsoalm34@gmail.com
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
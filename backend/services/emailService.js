const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT || 587),
  secure: Number(process.env.EMAIL_PORT) === 465,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const buildConfirmationEmail = ({ firstName, date, time, area, cancelLink }) => {
  return {
    from: `Cutaneo <${process.env.EMAIL_USER}>`,
    subject: 'Confirmación de turno - Cutaneo',
    html: `
      <div style="font-family: Inter, sans-serif; color: #111; background: #fff; padding: 24px;">
        <div style="max-width: 600px; margin: auto; border: 1px solid #f0f0f0; border-radius: 24px; overflow: hidden;">
          <div style="background: #111; color: #fff; padding: 28px 24px; text-align: center;">
            <h1 style="margin: 0; font-size: 28px; letter-spacing: 2px;">Cutaneo</h1>
          </div>
          <div style="padding: 28px 24px;">
            <p style="margin: 0 0 16px; font-size: 16px; color: #333;">Hola ${firstName},</p>
            <p style="margin: 0 0 24px; font-size: 16px; color: #333;">Tu turno ha sido reservado con éxito. Aquí están los datos:</p>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
              <tbody>
                <tr><td style="padding: 8px 0; font-weight: 600;">Fecha:</td><td style="padding: 8px 0;">${date}</td></tr>
                <tr><td style="padding: 8px 0; font-weight: 600;">Hora:</td><td style="padding: 8px 0;">${time}</td></tr>
                <tr><td style="padding: 8px 0; font-weight: 600;">Zona:</td><td style="padding: 8px 0;">${area}</td></tr>
              </tbody>
            </table>
            <a href="${cancelLink}" style="display: inline-block; padding: 14px 24px; background: #111; color: #fff; text-decoration: none; border-radius: 999px; font-weight: 600;">Cancelar turno</a>
            <p style="margin: 24px 0 0; font-size: 14px; color: #777;">Si no solicitaste este turno, por favor contacta al centro Cutaneo.</p>
          </div>
        </div>
      </div>
    `
  };
};

const sendConfirmationEmail = async ({ firstName, email, date, time, area, cancelLink }) => {
  const mailOptions = buildConfirmationEmail({ firstName, date, time, area, cancelLink });
  mailOptions.to = email;
  return transporter.sendMail(mailOptions);
};

module.exports = { sendConfirmationEmail };

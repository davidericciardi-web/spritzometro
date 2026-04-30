import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { bar_name, owner_name, email, phone, message } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS
    }
  });

  await transporter.sendMail({
    from: `SpritzoMetro <${process.env.GMAIL_USER}>`,
    to: 'davide.ricciardi17@gmail.com',
    subject: `Nuova richiesta ownership: ${bar_name}`,
    html: `
      <h2>Nuova richiesta ownership bar — SpritzoMetro</h2>
      <p><b>Bar:</b> ${bar_name}</p>
      <p><b>Proprietario:</b> ${owner_name}</p>
      <p><b>Email:</b> ${email}</p>
      <p><b>Telefono:</b> ${phone || 'N/A'}</p>
      <p><b>Messaggio:</b> ${message || 'N/A'}</p>
      <hr/>
      <p style="color:#888;font-size:12px;">SpritzoMetro — spritzometro.it</p>
    `
  });

  return res.status(200).json({ sent: true });
}

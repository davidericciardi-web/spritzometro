export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { bar_name, owner_name, email, phone, message } = req.body;

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: 'SpritzoMetro <onboarding@resend.dev>',
      to: 'davide.ricciardi17@gmail.com',
      subject: `Nuova richiesta ownership: ${bar_name}`,
      html: `
        <h2>Nuova richiesta ownership bar</h2>
        <p><b>Bar:</b> ${bar_name}</p>
        <p><b>Proprietario:</b> ${owner_name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Telefono:</b> ${phone || 'N/A'}</p>
        <p><b>Messaggio:</b> ${message || 'N/A'}</p>
      `
    })
  });

  return res.status(200).json({ sent: true });
}

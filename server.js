
/**
 * Simple Express mailer for contact form
 * Usage: set SMTP creds and run: node server.js
 */
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// TODO: put real SMTP creds in environment variables
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body || {};
  if(!email || !message) return res.status(400).json({ ok:false, error: 'Missing fields' });
  try{
    await transporter.sendMail({
      from: `"ProtègeMoi Site" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to: process.env.CONTACT_TO || process.env.SMTP_USER,
      replyTo: email,
      subject: `Contact form - ${name || 'Anonymous'}`,
      text: message
    });
    res.json({ ok:true });
  }catch(e){
    console.error(e);
    res.status(500).json({ ok:false, error: 'Mailer failed' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log('Contact API running on port', port));

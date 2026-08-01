import express from 'express';
import { createTransport } from 'nodemailer';
import multer from 'multer';
import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { readFileSync, writeFileSync, readdirSync, statSync, mkdirSync, existsSync } from 'node:fs';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
const PORT = parseInt(process.env.API_PORT || '3001', 10);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
app.use('/uploads', express.static(join(__dirname, 'uploads')));

// --- Nodemailer transporter (IONOS SMTP) ---
const transporter = createTransport({
  host: process.env.SMTP_HOST || 'smtp.ionos.de',
  port: parseInt(process.env.SMTP_PORT || '587', 10),
  secure: false,
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// Verify SMTP connection on startup
transporter.verify((error) => {
  if (error) {
    console.error('[SMTP] Connection failed:', error.message);
  } else {
    console.log('[SMTP] Connected to IONOS SMTP successfully');
  }
});

// --- In-memory email inbox (persisted to disk) ---
const EMAILS_FILE = join(__dirname, 'data', 'emails.json');

function loadEmails() {
  if (!existsSync(EMAILS_FILE)) return [];
  try {
    return JSON.parse(readFileSync(EMAILS_FILE, 'utf-8'));
  } catch {
    return [];
  }
}

function saveEmails(emails) {
  const dir = dirname(EMAILS_FILE);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  writeFileSync(EMAILS_FILE, JSON.stringify(emails, null, 2), 'utf-8');
}

// --- Multer storage for media uploads ---
const storage = multer.diskStorage({
  destination: join(__dirname, 'uploads', 'media'),
  filename: (req, file, cb) => {
    const ext = file.originalname.split('.').pop();
    const timestamp = Date.now();
    cb(null, `${timestamp}-${file.originalname}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max
  fileFilter: (req, file, cb) => {
    const allowed = /\.(jpg|jpeg|png|gif|webp|svg|mp3|mp4|wav|flac|ogg|pdf|zip)$/i;
    if (allowed.test(file.originalname)) {
      cb(null, true);
    } else {
      cb(new Error('File type not allowed'));
    }
  },
});

// --- CORS headers ---
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

// === API ROUTES ===

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), uptime: process.uptime() });
});

// --- Contact form ---
app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email and message are required.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email address.' });
  }

  try {
    const info = await transporter.sendMail({
      from: `"${name}" <${email}>`,
      to: process.env.CONTACT_EMAIL || 'info@djexcept4.de',
      replyTo: email,
      subject: `Neue Nachricht von ${name} — djexcept4.de`,
      text: message,
      html: `
        <h2>Neue Kontaktnachricht</h2>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>E-Mail:</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>
        <p><strong>Nachricht:</strong></p>
        <p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>
        <hr>
        <p><small>Gesendet über djexcept4.de Kontaktformular</small></p>
      `,
    });

    // Save to inbox
    const emails = loadEmails();
    emails.unshift({
      id: Date.now(),
      type: 'contact',
      from: name,
      email,
      subject: `Neue Nachricht von ${name}`,
      message,
      received: new Date().toISOString(),
      status: 'unread',
      nodemailerMessageId: info.messageId,
    });
    saveEmails(emails);

    console.log(`[CONTACT] Message from ${name} <${email}>`);
    res.json({ success: true, message: 'Nachricht erfolgreich gesendet.' });
  } catch (error) {
    console.error('[CONTACT] Error:', error.message);
    res.status(500).json({ error: 'Fehler beim Senden der Nachricht. Bitte versuchen Sie es später erneut.' });
  }
});

// --- Admin: List emails ---
app.get('/api/admin/emails', (req, res) => {
  const emails = loadEmails();
  const { page = '1', limit = '20', status, type } = req.query;
  let filtered = emails;
  if (status) filtered = filtered.filter((e) => e.status === status);
  if (type) filtered = filtered.filter((e) => e.type === type);
  const start = (parseInt(page, 10) - 1) * parseInt(limit, 10);
  const paginated = filtered.slice(start, start + parseInt(limit, 10));
  res.json({
    emails: paginated,
    total: filtered.length,
    page: parseInt(page, 10),
    totalPages: Math.ceil(filtered.length / parseInt(limit, 10)),
  });
});

// --- Admin: Get single email ---
app.get('/api/admin/emails/:id', (req, res) => {
  const emails = loadEmails();
  const email = emails.find((e) => e.id === parseInt(req.params.id, 10));
  if (!email) return res.status(404).json({ error: 'E-Mail nicht gefunden.' });
  res.json(email);
});

// --- Admin: Update email status ---
app.put('/api/admin/emails/:id', (req, res) => {
  const emails = loadEmails();
  const idx = emails.findIndex((e) => e.id === parseInt(req.params.id, 10));
  if (idx === -1) return res.status(404).json({ error: 'E-Mail nicht gefunden.' });
  emails[idx] = { ...emails[idx], ...req.body, updatedAt: new Date().toISOString() };
  saveEmails(emails);
  res.json(emails[idx]);
});

// --- Admin: Delete email ---
app.delete('/api/admin/emails/:id', (req, res) => {
  let emails = loadEmails();
  const idx = emails.findIndex((e) => e.id === parseInt(req.params.id, 10));
  if (idx === -1) return res.status(404).json({ error: 'E-Mail nicht gefunden.' });
  emails.splice(idx, 1);
  saveEmails(emails);
  res.json({ success: true, message: 'E-Mail gelöscht.' });
});

// --- Admin: Reply to email (send via SMTP) ---
app.post('/api/admin/emails/:id/reply', async (req, res) => {
  const { replyTo, subject, message } = req.body;
  const emails = loadEmails();
  const idx = emails.findIndex((e) => e.id === parseInt(req.params.id, 10));
  if (idx === -1) return res.status(404).json({ error: 'E-Mail nicht gefunden.' });

  try {
    const info = await transporter.sendMail({
      from: '"DJ Except4" <info@djexcept4.de>',
      to: replyTo || emails[idx].email,
      subject: subject || `Re: ${emails[idx].subject}`,
      text: message,
      html: `<p>${escapeHtml(message).replace(/\n/g, '<br>')}</p>`,
    });

    emails[idx].lastReply = {
      to: replyTo || emails[idx].email,
      subject: subject || `Re: ${emails[idx].subject}`,
      sentAt: new Date().toISOString(),
      messageId: info.messageId,
    };
    saveEmails(emails);
    res.json({ success: true, message: 'Antwort gesendet.' });
  } catch (error) {
    console.error('[REPLY] Error:', error.message);
    res.status(500).json({ error: 'Fehler beim Senden der Antwort.' });
  }
});

// --- Admin: Upload media ---
app.post('/api/admin/media/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Keine Datei hochgeladen.' });
  }
  const fileInfo = {
    id: Date.now(),
    originalName: req.file.originalname,
    filename: req.file.filename,
    path: `/uploads/media/${req.file.filename}`,
    size: req.file.size,
    mimetype: req.file.mimetype,
    uploadedAt: new Date().toISOString(),
  };
  res.json({ success: true, file: fileInfo });
});

// --- Admin: List uploaded media ---
app.get('/api/admin/media', (req, res) => {
  const mediaDir = join(__dirname, 'uploads', 'media');
  if (!existsSync(mediaDir)) return res.json({ files: [] });
  const files = readdirSync(mediaDir).map((f) => {
    const stat = statSync(join(mediaDir, f));
    return {
      filename: f,
      size: stat.size,
      modified: stat.mtime.toISOString(),
      url: `/uploads/media/${f}`,
    };
  });
  files.sort((a, b) => new Date(b.modified) - new Date(a.modified));
  res.json({ files });
});

// --- Admin: Get site settings ---
app.get('/api/admin/settings', (req, res) => {
  const settingsFile = join(__dirname, 'data', 'settings.json');
  if (existsSync(settingsFile)) {
    res.json(JSON.parse(readFileSync(settingsFile, 'utf-8')));
  } else {
    res.json({ ads: [], streaming: {}, seo: {} });
  }
});

// --- Admin: Update site settings ---
app.put('/api/admin/settings', (req, res) => {
  const settingsFile = join(__dirname, 'data', 'settings.json');
  const dir = dirname(settingsFile);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  writeFileSync(settingsFile, JSON.stringify(req.body, null, 2), 'utf-8');
  res.json({ success: true, message: 'Einstellungen gespeichert.' });
});

// --- Admin: Update streaming config ---
app.put('/api/admin/streaming', (req, res) => {
  const settingsFile = join(__dirname, 'data', 'settings.json');
  let settings = {};
  if (existsSync(settingsFile)) {
    settings = JSON.parse(readFileSync(settingsFile, 'utf-8'));
  }
  settings.streaming = { ...settings.streaming, ...req.body };
  const dir = dirname(settingsFile);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  writeFileSync(settingsFile, JSON.stringify(settings, null, 2), 'utf-8');
  res.json({ success: true, message: 'Streaming-Konfiguration gespeichert.' });
});

// --- Admin: Update SEO settings ---
app.put('/api/admin/seo', (req, res) => {
  const settingsFile = join(__dirname, 'data', 'settings.json');
  let settings = {};
  if (existsSync(settingsFile)) {
    settings = JSON.parse(readFileSync(settingsFile, 'utf-8'));
  }
  settings.seo = { ...settings.seo, ...req.body };
  const dir = dirname(settingsFile);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  writeFileSync(settingsFile, JSON.stringify(settings, null, 2), 'utf-8');
  res.json({ success: true, message: 'SEO-Einstellungen gespeichert.' });
});

// --- Admin: Update ads ---
app.put('/api/admin/ads', (req, res) => {
  const settingsFile = join(__dirname, 'data', 'settings.json');
  let settings = {};
  if (existsSync(settingsFile)) {
    settings = JSON.parse(readFileSync(settingsFile, 'utf-8'));
  }
  settings.ads = req.body.ads || [];
  const dir = dirname(settingsFile);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  writeFileSync(settingsFile, JSON.stringify(settings, null, 2), 'utf-8');
  res.json({ success: true, message: 'Werbungseinstellungen gespeichert.' });
});

// --- Simple HTML escape ---
function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// --- Start server ---
app.listen(PORT, '0.0.0.0', () => {
  console.log(`[API] DJ Except4 API server running on port ${PORT}`);
  console.log(`[API] Contact: POST /api/contact`);
  console.log(`[API] Admin emails: GET /api/admin/emails`);
  console.log(`[API] Admin media upload: POST /api/admin/media/upload`);
  console.log(`[API] Admin settings: GET/PUT /api/admin/settings`);
});
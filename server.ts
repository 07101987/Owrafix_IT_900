import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
// AI Studio environment: Nginx runs on port 8080 and proxies requests to localhost:3000
const PORT = process.env.PORT === '8080' ? 3000 : Number(process.env.PORT) || 3000;

app.use(express.json());

// Healthcheck route
app.get('/api/health', (_req, res) => {
  res.json({ status: 'healthy', uptime: process.uptime() });
});

// Check if dist exists
const distPath = path.resolve(__dirname, 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));

  app.get('*', (_req, res) => {
    res.sendFile(path.resolve(distPath, 'index.html'));
  });
} else {
  // If dist hasn't been built yet
  app.get('*', (_req, res) => {
    res.status(200).send('Building application, please wait...');
  });
}

app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`Owrafix Server running on http://0.0.0.0:${PORT}`);
});

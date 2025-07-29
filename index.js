// src/index.js o src/server.js
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import cors from 'cors';

import connectDatabase from './config/mongoConnect.js';
import apiRouter from './router/apiRouter.js';
import sitemapRouter from './router/sitemapRouter.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3020;

// 🔧 Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🧠 Conexión base de datos
connectDatabase();

// 🗺️ Rutas de sitemap y robots.txt — se colocan antes de archivos estáticos
app.use('/', sitemapRouter);

// 📦 Servir frontend Angular (build)
app.use(express.static(path.join(__dirname, '../frontend/dist/crunchy-munch')));

// 📡 Rutas API backend
app.use('/api', apiRouter);

// 🪄 Catch-all para Angular (SPA)
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api') && !req.path.includes('.xml') && !req.path.includes('.txt')) {
    res.sendFile(path.join(__dirname, '../frontend/dist/crunchy-munch/index.html'));
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en ${PORT}`);
  console.log(`🌐 Sitemap en ${PORT}/sitemap.xml`);
});

export default app;


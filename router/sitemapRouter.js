import { Router } from 'express';
import SitemapService from '../services/sitemapServices.js';

const router = Router();
const sitemapService = new SitemapService();

router.get('/sitemap.xml', async (req, res) => {
  try {
    console.log('🔍 Solicitud de sitemap recibida');
    const sitemap = await sitemapService.generateSitemap();
    res.header('Content-Type', 'application/xml');
    res.header('Content-Encoding', 'gzip');
    res.send(sitemap);
    console.log('✅ Sitemap servido exitosamente');
  } catch (error) {
    console.error('❌ Error sirviendo sitemap:', error);
    res.status(500).send('Error interno del servidor');
  }
});

router.get('/robots.txt', (req, res) => {
  res.type('text/plain');
  res.send(`User-agent: *
Allow: /

# Sitemap
Sitemap: https://crunchy-munch.com/sitemap.xml

# Disallow admin areas
Disallow: /admin/
Disallow: /api/
Disallow: /private/`);
});

router.post('/sitemap/regenerate', async (req, res) => {
  try {
    console.log('🔄 Forzando regeneración de sitemap...');
    await sitemapService.generateSitemap(true);
    res.json({ success: true, message: 'Sitemap regenerado' });
  } catch (error) {
    console.error('❌ Error regenerando sitemap:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;

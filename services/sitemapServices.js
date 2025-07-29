
import { SitemapStream, streamToPromise } from 'sitemap';
import { Readable } from 'stream';
import Category from '../models/Category.js';

class SitemapService {
  constructor() {
    this.baseUrl = 'https://crunchy-munch.com';
    this.lastGenerated = null;
    this.cachedSitemap = null;
    this.cacheExpiry = 24 * 60 * 60 * 1000;
  }

  async generateSitemap(forceRegenerate = false) {
    if (!forceRegenerate && this.cachedSitemap && this.lastGenerated) {
      const now = new Date();
      if (now - this.lastGenerated < this.cacheExpiry) {
        return this.cachedSitemap;
      }
    }

    try {
      console.log('🔄 Generando sitemap para crunchy-munch.com...');
      const staticRoutes = await this.getStaticRoutes();
      const dynamicRoutes = await this.getDynamicRoutes();
      const allRoutes = [...staticRoutes, ...dynamicRoutes];

      console.log(`📊 Total de URLs en sitemap: ${allRoutes.length}`);

      const sitemap = await this.createSitemapXML(allRoutes);
      this.cachedSitemap = sitemap;
      this.lastGenerated = new Date();
      return sitemap;
    } catch (error) {
      console.error('❌ Error generando sitemap:', error);
      throw error;
    }
  }

  async getStaticRoutes() {
    const now = new Date();
    return [
      { url: '/', lastmod: now, changefreq: 'daily', priority: 1.0 },
      { url: '/Quien Somos', lastmod: now, changefreq: 'weekly', priority: 0.8 },
      { url: '/Cookie', lastmod: now, changefreq: 'weekly', priority: 0.8 },
      { url: '/Bebidas', lastmod: now, changefreq: 'weekly', priority: 0.8 },
      { url: '/Crookie', lastmod: now, changefreq: 'weekly', priority: 0.8 },
      { url: '/Tus Pedidos', lastmod: now, changefreq: 'weekly', priority: 0.7 },
      { url: '/Pqrs', lastmod: now, changefreq: 'monthly', priority: 0.6 },
      { url: '/TyC', lastmod: now, changefreq: 'monthly', priority: 0.5 },
      { url: '/Nuestros Productos', lastmod: now, changefreq: 'weekly', priority: 0.8 },
      { url: '/Login', lastmod: now, changefreq: 'monthly', priority: 0.4 },
      { url: '/Registro', lastmod: now, changefreq: 'monthly', priority: 0.4 },
      { url: '/Milkshake', lastmod: now, changefreq: 'weekly', priority: 0.7 },
      { url: '/dadada', lastmod: now, changefreq: 'monthly', priority: 0.3 },
      { url: '/Admin Login', lastmod: now, changefreq: 'monthly', priority: 0.2 },
      { url: '/Resumen de compra', lastmod: now, changefreq: 'daily', priority: 0.6 },
    ];
  }

  async getDynamicRoutes() {
    const dynamicRoutes = [];
    const now = new Date();

    try {
      const productCategories = await this.getProductCategories();
      productCategories.forEach(category => {
        const routePath = `/${category.name}`;
        if (!this.isRouteInStatic(routePath)) {
          dynamicRoutes.push({
            url: routePath,
            lastmod: category.updatedAt || now,
            changefreq: 'weekly',
            priority: 0.8
          });
        } else {
          console.log(`ℹ️ Categoría '${category.name}' ya existe en rutas estáticas`);
        }
      });

      const subCategories = await this.getSubCategories();
      subCategories.forEach(sub => {
        dynamicRoutes.push({
          url: `/${sub.parentSlug}/${sub.slug}`,
          lastmod: sub.updatedAt || now,
          changefreq: 'weekly',
          priority: 0.7
        });
      });

      const blogPosts = await this.getBlogPosts();
      blogPosts.forEach(post => {
        dynamicRoutes.push({
          url: `/blog/${post.slug}`,
          lastmod: post.updatedAt || now,
          changefreq: 'monthly',
          priority: 0.6
        });
      });

      return dynamicRoutes;
    } catch (error) {
      console.error('❌ Error obteniendo rutas dinámicas:', error);
      return [];
    }
  }

  isRouteInStatic(url) {
    const staticRoutes = [
      '/', '/Quien Somos', '/Cookie', '/Bebidas', '/Crookie',
      '/Tus Pedidos', '/Pqrs', '/TyC', '/Nuestros Productos',
      '/Login', '/Registro', '/Milkshake', '/dadada',
      '/Admin Login', '/Resumen de compra'
    ];
    return staticRoutes.includes(url);
  }

  async createSitemapXML(routes) {
    const stream = new SitemapStream({ hostname: this.baseUrl, cacheTime: 600000 });
    const routeStream = Readable.from(routes);
    routeStream.pipe(stream);
    const sitemap = await streamToPromise(stream);
    return sitemap.toString();
  }

  async getProductCategories() {
    try {
      console.log('📊 Obteniendo categorías desde MongoDB...');
      if (!Category.db || Category.db.readyState !== 1) {
        console.warn('⚠️ Base de datos no conectada, usando categorías de respaldo');
        return this.getFallbackCategories();
      }

      const categories = await Category.find({ deletedAt: null })
        .select('name updatedAt')
        .sort({ name: 1 })
        .lean()
        .exec();

      console.log(`✅ Encontradas ${categories.length} categorías activas`);
      return categories.map(cat => ({
        slug: cat.name,
        updatedAt: cat.updatedAt,
        name: cat.name
      }));
    } catch (error) {
      console.error('❌ Error obteniendo categorías:', error);
      return this.getFallbackCategories();
    }
  }

  getFallbackCategories() {
    const now = new Date();
    return [
      { name: 'Bebidas', slug: 'bebidas', updatedAt: now },
      { name: 'Crookie', slug: 'crookie', updatedAt: now },
      { name: 'Milkshake', slug: 'milkshake', updatedAt: now }
    ];
  }

  async getSubCategories() {
    const now = new Date();
    return [
      { parentSlug: 'Bebidas', slug: 'sodas', updatedAt: now },
      { parentSlug: 'Crookie', slug: 'nutella', updatedAt: now }
    ];
  }

  async getBlogPosts() {
    const now = new Date();
    return [
      { slug: 'nuevo-sabor-crookie', updatedAt: now },
      { slug: 'beneficios-del-milkshake', updatedAt: now }
    ];
  }

  getSitemapStats() {
    if (!this.lastGenerated) return null;
    return {
      lastGenerated: this.lastGenerated,
      cacheExpiry: new Date(this.lastGenerated.getTime() + this.cacheExpiry),
      isCacheValid: new Date() - this.lastGenerated < this.cacheExpiry
    };
  }

  invalidateCache() {
    this.cachedSitemap = null;
    this.lastGenerated = null;
    console.log('🗑️ Cache del sitemap invalidado');
  }
}

export default SitemapService;
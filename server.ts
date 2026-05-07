import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import Parser from 'rss-parser';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rssParser = new Parser();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Proxy for news with fallback mechanism
  app.get('/api/news', async (req, res) => {
    console.log('GET /api/news requested');
    const { category = 'general', lang = 'en', country = 'us', max = '10' } = req.query;
    const apiKey = process.env.GNEWS_API_KEY;

    try {
      if (apiKey && apiKey !== 'MY_GNEWS_API_KEY') {
        const url = `https://gnews.io/api/v4/top-headlines?category=${category}&lang=${lang}&country=${country}&max=${max}&apikey=${apiKey}`;
        console.log('Fetching from GNews:', url.replace(apiKey, '[REDACTED]'));
        const response = await fetch(url);
        
        if (response.ok) {
          console.log('GNews response success');
          const data = await response.json();
          return res.json(data);
        }
        console.warn('GNews failed with status:', response.status);
      }

      // Fallback: Spaceflight News API (Public, No Key)
      console.log('Falling back to Spaceflight News API...');
      const fallbackUrl = 'https://api.spaceflightnewsapi.net/v4/articles/?limit=10';
      const fallbackResponse = await fetch(fallbackUrl);
      const fallbackData = await fallbackResponse.json() as any;
      
      const mappedArticles = fallbackData.results.map((item: any) => ({
        title: item.title,
        description: item.summary,
        content: item.summary,
        url: item.url,
        image: item.image_url,
        publishedAt: item.published_at,
        source: {
          name: item.news_site,
          url: item.url
        }
      }));

      res.json({ articles: mappedArticles });
    } catch (error) {
      console.error('Proxy error in /api/news:', error);
      // Final hardcoded fallback
      res.json({
        articles: [
          {
            title: "Midnight Signal: Intelligence Network Online",
            description: "The secure uplink has been established. All systems operational.",
            image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000",
            publishedAt: new Date().toISOString(),
            source: { name: "System", url: "#" }
          }
        ]
      });
    }
  });

  app.get('/api/news/search', async (req, res) => {
    console.log('GET /api/news/search requested');
    const { q, lang = 'en', country = 'us', max = '10' } = req.query;
    const apiKey = process.env.GNEWS_API_KEY;

    if (!q) return res.status(400).json({ error: 'Query parameter q is required' });

    try {
      if (apiKey && apiKey !== 'MY_GNEWS_API_KEY') {
        const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(String(q))}&lang=${lang}&country=${country}&max=${max}&apikey=${apiKey}`;
        console.log('Searching GNews:', url.replace(apiKey, '[REDACTED]'));
        const response = await fetch(url);
        
        if (response.ok) {
          console.log('GNews search success');
          const data = await response.json();
          return res.json(data);
        }
        console.warn('GNews search failed with status:', response.status);
      }

      // Fallback: Spaceflight News API Search
      console.log('Falling back to Spaceflight News API for search...');
      const fallbackUrl = `https://api.spaceflightnewsapi.net/v4/articles/?search=${encodeURIComponent(String(q))}&limit=10`;
      const fallbackResponse = await fetch(fallbackUrl);
      const fallbackData = await fallbackResponse.json() as any;
      
      const mappedArticles = fallbackData.results.map((item: any) => ({
        title: item.title,
        description: item.summary,
        content: item.summary,
        url: item.url,
        image: item.image_url,
        publishedAt: item.published_at,
        source: {
          name: item.news_site,
          url: item.url
        }
      }));

      res.json({ articles: mappedArticles });
    } catch (error) {
      console.error('Proxy error in /api/news/search:', error);
      res.json({ articles: [] });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer();

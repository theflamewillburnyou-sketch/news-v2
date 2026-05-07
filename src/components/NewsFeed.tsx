import React, { useState, useEffect } from 'react';
import { getTopHeadlines } from '../lib/news';
import { NewsArticle } from '../types';
import { motion } from 'motion/react';
import { ExternalLink, RefreshCcw } from 'lucide-react';
import { formatDate } from '../lib/utils';

export function NewsFeed() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  const loadNews = async () => {
    setLoading(true);
    const data = await getTopHeadlines();
    setArticles(data);
    setLoading(false);
  };

  useEffect(() => {
    loadNews();
  }, []);

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-end mb-12">
        <div>
          <h1 className="text-sm font-bold tracking-[0.2em] uppercase text-white/40 mb-1">
            Midnight Update
          </h1>
          <h2 className="text-3xl font-black tracking-tighter">
            HEADLINES
          </h2>
        </div>
        <button 
          onClick={loadNews}
          className="p-2 rounded-full hover:bg-white/5 transition-colors"
        >
          <RefreshCcw className={loading ? "animate-spin w-5 h-5 text-stealth-accent" : "w-5 h-5 text-white/40"} />
        </button>
      </header>

      <div className="space-y-6">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="animate-pulse space-y-4">
              <div className="h-48 bg-luxury-surface rounded-sm border border-luxury-border" />
              <div className="h-4 w-3/4 bg-luxury-surface rounded-sm" />
              <div className="h-4 w-1/2 bg-luxury-surface rounded-sm" />
            </div>
          ))
        ) : (
          articles.map((article, index) => (
            <motion.article
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group relative border-b border-luxury-border pb-8 last:border-0"
            >
              <div className="flex flex-col gap-4">
                {article.image && (
                  <div className="aspect-video overflow-hidden rounded-sm border border-luxury-border">
                    <img 
                      src={article.image} 
                      alt="" 
                      className="w-full h-full object-cover grayscale transition-all group-hover:grayscale-0 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-white/40">
                    <span className="text-stealth-accent">{article.source.name}</span>
                    <span>•</span>
                    <span>{formatDate(article.publishedAt)}</span>
                  </div>
                  <h3 className="text-xl font-medium leading-tight group-hover:text-stealth-accent transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-white/60 text-sm line-clamp-2">
                    {article.description}
                  </p>
                  <a 
                    href={article.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-widest text-white/40 hover:text-white transition-colors pt-2"
                  >
                    READ ARTICLE <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </motion.article>
          ))
        )}
      </div>
    </div>
  );
}

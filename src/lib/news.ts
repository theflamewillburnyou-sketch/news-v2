import { NewsArticle } from '../types';

export async function getTopHeadlines(): Promise<NewsArticle[]> {
  try {
    const response = await window.fetch('/api/news');
    const data = await response.json() as any;
    return data.articles || [];
  } catch (error) {
    console.error('Failed to get news:', error);
    return [];
  }
}

export async function searchNewsHeadlines(query: string): Promise<NewsArticle[]> {
  try {
    const response = await window.fetch(`/api/news/search?q=${encodeURIComponent(query)}`);
    const data = await response.json() as any;
    return data.articles || [];
  } catch (error) {
    console.error('Failed to search news:', error);
    return [];
  }
}

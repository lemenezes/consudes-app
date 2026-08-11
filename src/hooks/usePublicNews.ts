import { useEffect, useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { listPublishedNews } from "../services/newsPublicService";
import type { NewsListItem } from "../services/newsPublicService";

interface UsePublicNewsOptions {
  limit?: number;
}

interface UsePublicNewsResult {
  news: NewsListItem[];
  loading: boolean;
  error: string | null;
}

export function usePublicNews({
  limit
}: UsePublicNewsOptions = {}): UsePublicNewsResult {
  const { lang } = useLanguage();
  const [news, setNews] = useState<NewsListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    listPublishedNews(limit, lang).then(({ data, error: err }) => {
      if (cancelled) return;
      setNews(data);
      setError(err);
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [limit, lang]);

  return { news, loading, error };
}


'use client';

import { useEffect, useState } from 'react';
import { Users } from 'lucide-react';
import { getVisitorCount } from '@/actions/get-visitor-count';
import { useLanguage } from '@/context/language-context';
import { Skeleton } from '@/components/ui/skeleton';

export default function VisitorCounter() {
  const [count, setCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();

  useEffect(() => {
    async function fetchCount() {
      try {
        setLoading(true);
        const result = await getVisitorCount();
        setCount(result.count);
      } catch (error) {
        console.error("Failed to fetch visitor count:", error);
        setCount(null); // Or a fallback/error state
      } finally {
        setLoading(false);
      }
    }
    fetchCount();
  }, []);

  const translations = {
    visitors: language === 'en' ? 'Visitors' : 'Besucher',
    loading: language === 'en' ? 'Loading visitors...' : 'Besucherzahl lädt...',
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center text-xs sm:text-sm text-muted-foreground">
        <Skeleton className="h-4 w-24" />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center text-xs sm:text-sm text-muted-foreground">
      <Users className="mr-2 h-4 w-4 flex-shrink-0" />
      <span>
        {count !== null
          ? `${count.toLocaleString()} ${translations.visitors}`
          : `- ${translations.visitors}`}
      </span>
    </div>
  );
}

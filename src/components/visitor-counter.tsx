
'use client';

import { useEffect, useState } from 'react';
import { Users } from 'lucide-react';
import { getVisitorCount } from '@/actions/get-visitor-count';
import { useLanguage } from '@/context/language-context';
import { Skeleton } from '@/components/ui/skeleton';

const POLLING_INTERVAL = 30000; // 30 seconds

export default function VisitorCounter() {
  const [count, setCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true); // For initial loading skeleton
  const { language } = useLanguage();

  useEffect(() => {
    let isMounted = true;

    const fetchCount = async () => {
      try {
        const result = await getVisitorCount();
        if (isMounted) {
          setCount(result.count);
        }
      } catch (error) {
        if (isMounted) {
          console.error("Failed to fetch visitor count:", error);
          // Optionally, handle error state for count display, e.g., setCount(-1) or keep previous
        }
      } finally {
        // Ensure loading is set to false only once after the initial fetch
        if (isMounted && loading) {
          setLoading(false);
        }
      }
    };

    fetchCount(); // Initial fetch

    const intervalId = setInterval(fetchCount, POLLING_INTERVAL);

    return () => {
      isMounted = false;
      clearInterval(intervalId); // Cleanup interval on component unmount
    };
  }, [loading]); // Effect runs when `loading` state changes, primarily for the initial fetch logic.
                // The interval setup itself should ideally run once.
                // Re-running on `loading` change is okay here because `loading` only changes from true to false once.

  const translations = {
    visitors: language === 'en' ? 'Visitors Today' : 'Besucher Heute',
    loading: language === 'en' ? 'Loading visitors...' : 'Besucherzahl lädt...',
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center text-xs sm:text-sm text-muted-foreground">
        <Skeleton className="h-4 w-32" /> {/* Adjusted width for "Visitors Today" */}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center text-xs sm:text-sm text-muted-foreground">
      <Users className="mr-2 h-4 w-4 flex-shrink-0" />
      <span>
        {count !== null
          ? `${count.toLocaleString()} ${translations.visitors}`
          : `0 ${translations.visitors}`} {/* Show 0 if count is null after loading */}
      </span>
    </div>
  );
}


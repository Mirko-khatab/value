import { useState, useEffect, useCallback, useRef } from 'react';

interface UseInfiniteScrollOptions {
  threshold?: number; // Distance from bottom to trigger load (in pixels)
  rootMargin?: string; // Intersection observer root margin
}

interface UseInfiniteScrollReturn<T> {
  items: T[];
  loading: boolean;
  hasMore: boolean;
  loadMore: () => void;
  reset: () => void;
  setItems: (items: T[]) => void;
  lastElementRef: (node: HTMLElement | null) => void;
}

export function useInfiniteScroll<T>(
  fetchFunction: (page: number, limit: number) => Promise<{ data: T[]; hasMore: boolean }>,
  limit: number = 12,
  options: UseInfiniteScrollOptions = {}
): UseInfiniteScrollReturn<T> {
  const { threshold = 100, rootMargin = '0px' } = options;
  
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  
  const observer = useRef<IntersectionObserver>();
  const lastElementRef = useCallback((node: HTMLElement | null) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMore();
      }
    }, { rootMargin });
    
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    try {
      const result = await fetchFunction(page, limit);
      
      setItems(prev => {
        // Avoid duplicates by checking if items already exist
        const existingIds = new Set(prev.map((item: any) => item.id));
        const newItems = result.data.filter((item: any) => !existingIds.has(item.id));
        return [...prev, ...newItems];
      });
      
      setHasMore(result.hasMore);
      setPage(prev => prev + 1);
    } catch (error) {
      console.error('Error loading more items:', error);
    } finally {
      setLoading(false);
    }
  }, [fetchFunction, page, limit, loading, hasMore]);

  const reset = useCallback(() => {
    setItems([]);
    setPage(1);
    setHasMore(true);
    setLoading(false);
  }, []);

  // Initial load
  useEffect(() => {
    if (items.length === 0 && !loading) {
      loadMore();
    }
  }, []);

  return {
    items,
    loading,
    hasMore,
    loadMore,
    reset,
    setItems,
    lastElementRef,
  };
}

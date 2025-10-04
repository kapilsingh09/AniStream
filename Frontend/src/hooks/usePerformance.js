import { useState, useEffect, useCallback, useMemo } from 'react';

// Image optimization hook
export const useImageOptimization = (src, options = {}) => {
  const [imageState, setImageState] = useState({
    src: null,
    loading: true,
    error: false
  });

  const {
    quality = 80,
    format = 'webp',
    fallbackFormat = 'jpeg',
    lazy = true,
    placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PC9zdmc+'
  } = options;

  const optimizedSrc = useMemo(() => {
    if (!src) return placeholder;
    
    // If it's already a data URL or external URL, return as is
    if (src.startsWith('data:') || src.startsWith('http')) {
      return src;
    }

    // For local images, you could implement image optimization here
    // This is a placeholder for actual optimization logic
    return src;
  }, [src, placeholder]);

  useEffect(() => {
    if (!optimizedSrc) return;

    setImageState(prev => ({ ...prev, loading: true, error: false }));

    const img = new Image();
    
    img.onload = () => {
      setImageState({
        src: optimizedSrc,
        loading: false,
        error: false
      });
    };

    img.onerror = () => {
      setImageState({
        src: placeholder,
        loading: false,
        error: true
      });
    };

    img.src = optimizedSrc;
  }, [optimizedSrc, placeholder]);

  return imageState;
};

// Intersection Observer hook for lazy loading
export const useIntersectionObserver = (options = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const ref = useCallback((node) => {
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        if (entry.isIntersecting && !hasIntersected) {
          setHasIntersected(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options
      }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [hasIntersected, options]);

  return { ref, isIntersecting, hasIntersected };
};

// Debounced search hook
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Virtual scrolling hook
export const useVirtualScrolling = (items, itemHeight, containerHeight) => {
  const [scrollTop, setScrollTop] = useState(0);

  const visibleItems = useMemo(() => {
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(
      startIndex + Math.ceil(containerHeight / itemHeight) + 1,
      items.length
    );

    return items.slice(startIndex, endIndex).map((item, index) => ({
      ...item,
      index: startIndex + index
    }));
  }, [items, itemHeight, containerHeight, scrollTop]);

  const totalHeight = items.length * itemHeight;
  const offsetY = scrollTop;

  return {
    visibleItems,
    totalHeight,
    offsetY,
    setScrollTop
  };
};

// Performance monitoring hook
export const usePerformanceMonitor = (componentName) => {
  const [metrics, setMetrics] = useState({
    renderCount: 0,
    lastRenderTime: 0,
    averageRenderTime: 0
  });

  useEffect(() => {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      setMetrics(prev => ({
        renderCount: prev.renderCount + 1,
        lastRenderTime: renderTime,
        averageRenderTime: (prev.averageRenderTime + renderTime) / 2
      }));

      // Log performance metrics in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`${componentName} Performance:`, {
          renderTime: `${renderTime.toFixed(2)}ms`,
          renderCount: metrics.renderCount + 1
        });
      }
    };
  });

  return metrics;
};

// Memory usage hook
export const useMemoryUsage = () => {
  const [memoryInfo, setMemoryInfo] = useState(null);

  useEffect(() => {
    const updateMemoryInfo = () => {
      if ('memory' in performance) {
        setMemoryInfo({
          used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
          total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024),
          limit: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024)
        });
      }
    };

    updateMemoryInfo();
    const interval = setInterval(updateMemoryInfo, 5000);

    return () => clearInterval(interval);
  }, []);

  return memoryInfo;
};

// Cache management hook
export const useCacheManager = () => {
  const [cacheStats, setCacheStats] = useState({
    size: 0,
    hits: 0,
    misses: 0
  });

  const clearCache = useCallback(async () => {
    try {
      // Clear service worker cache
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map(cacheName => caches.delete(cacheName))
        );
      }

      // Clear localStorage
      localStorage.clear();

      // Clear sessionStorage
      sessionStorage.clear();

      setCacheStats({ size: 0, hits: 0, misses: 0 });
      
      return true;
    } catch (error) {
      console.error('Error clearing cache:', error);
      return false;
    }
  }, []);

  const getCacheSize = useCallback(() => {
    let size = 0;
    
    // Calculate localStorage size
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        size += localStorage[key].length;
      }
    }
    
    // Calculate sessionStorage size
    for (let key in sessionStorage) {
      if (sessionStorage.hasOwnProperty(key)) {
        size += sessionStorage[key].length;
      }
    }
    
    return Math.round(size / 1024); // Size in KB
  }, []);

  useEffect(() => {
    const updateStats = () => {
      setCacheStats(prev => ({
        ...prev,
        size: getCacheSize()
      }));
    };

    updateStats();
    const interval = setInterval(updateStats, 10000);

    return () => clearInterval(interval);
  }, [getCacheSize]);

  return {
    cacheStats,
    clearCache,
    getCacheSize
  };
};

// Bundle analyzer hook (development only)
export const useBundleAnalyzer = () => {
  const [bundleInfo, setBundleInfo] = useState(null);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      // This would integrate with webpack-bundle-analyzer or similar
      // For now, just log basic info
      setBundleInfo({
        chunks: performance.getEntriesByType('navigation')[0]?.transferSize || 0,
        loadTime: performance.getEntriesByType('navigation')[0]?.loadEventEnd || 0
      });
    }
  }, []);

  return bundleInfo;
};

// Export all hooks
export default {
  useImageOptimization,
  useIntersectionObserver,
  useDebounce,
  useVirtualScrolling,
  usePerformanceMonitor,
  useMemoryUsage,
  useCacheManager,
  useBundleAnalyzer
};

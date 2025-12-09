export class PerformanceMetrics {
  constructor() {
    this.startTime = null;
    this.itemsLoaded = 0;
    this.cacheHits = 0;
    this.networkRequests = 0;
    this.imageLoads = 0;
    this.renderTime = 0;
  }
  
  start() {
    this.startTime = Date.now();
    this.itemsLoaded = 0;
    this.cacheHits = 0;
    this.networkRequests = 0;
    this.imageLoads = 0;
    this.renderTime = 0;
  }
  
  logCacheHit() {
    this.cacheHits++;
  }
  
  logNetworkRequest() {
    this.networkRequests++;
  }
  
  logItemsLoaded(count) {
    this.itemsLoaded = count;
  }
  
  logImageLoad() {
    this.imageLoads++;
  }
  
  logRenderComplete() {
    this.renderTime = Date.now() - this.startTime;
  }
  
  getMetrics() {
    const loadTime = Date.now() - this.startTime;
    return {
      loadTime,
      itemsLoaded: this.itemsLoaded,
      cacheHits: this.cacheHits,
      networkRequests: this.networkRequests,
      imageLoads: this.imageLoads,
      renderTime: this.renderTime,
      cacheHitRate: this.itemsLoaded > 0 ? (this.cacheHits / this.itemsLoaded) * 100 : 0,
      requestsPerItem: this.itemsLoaded > 0 ? this.networkRequests / this.itemsLoaded : 0
    };
  }
  
  sendToAnalytics(eventName = 'inventory_performance') {
    const metrics = this.getMetrics();
    
    // Send to your analytics service
    if (typeof window.gtag !== 'undefined') {
      window.gtag('event', eventName, {
        load_time: metrics.loadTime,
        items_loaded: metrics.itemsLoaded,
        cache_hits: metrics.cacheHits,
        network_requests: metrics.networkRequests,
        cache_hit_rate: metrics.cacheHitRate,
        render_time: metrics.renderTime
      });
    }
    
    console.log('Performance Metrics:', metrics);
    return metrics;
  }
}
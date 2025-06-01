// Performance monitoring utility for tracking API request times
class PerformanceMonitor {
  constructor() {
    this.metrics = new Map();
  }

  startTimer(key) {
    this.metrics.set(key, {
      startTime: performance.now(),
      endTime: null,
      duration: null
    });
  }

  endTimer(key) {
    const metric = this.metrics.get(key);
    if (metric) {
      metric.endTime = performance.now();
      metric.duration = metric.endTime - metric.startTime;
      
      // Log slow requests (>2 seconds)
      if (metric.duration > 2000) {
        console.warn(`Slow request detected: ${key} took ${metric.duration.toFixed(2)}ms`);
      }
      
      return metric.duration;
    }
    return null;
  }

  getMetrics() {
    return Object.fromEntries(this.metrics);
  }

  clearMetrics() {
    this.metrics.clear();
  }
}

const performanceMonitor = new PerformanceMonitor();

export default performanceMonitor;

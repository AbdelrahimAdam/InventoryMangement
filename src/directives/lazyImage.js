/**
 * Lazy Image Directive
 * Optimizes image loading by only loading images when they enter the viewport
 */
export const lazyImageDirective = {
  mounted(el, binding) {
    const defaultImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTQgMTZMNC42ODYgMTUuMzE0QzQuODgyIDExLjUwNyA4LjA5MyA5IDEyIDlDMTUuOTA3IDkgMTkuMTE4IDExLjUwNyAxOS4zMTQgMTUuMzE0TDIwIDE2TTggMjFIMTZNNSAxNEgxOU0xMiAxN0MxMiAxNy41NTIyOCAxMS41NTIzIDE4IDExIDE4QzEwLjQ0NzcgMTggMTAgMTcuNTUyMyAxMCAxN0MxMCAxNi40NDc3IDEwLjQ0NzcgMTYgMTEgMTZDMTEuNTUyMyAxNiAxMiAxNi40NDc3IDEyIDE3WiIgc3Ryb2tlPSI2QjcyOEQiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo=';
    
    // Set placeholder image initially
    el.src = defaultImage;
    el.style.opacity = '0.5';
    el.style.transition = 'opacity 0.3s ease';
    
    // Store the actual image URL
    const actualSrc = el.getAttribute('data-src') || el.getAttribute('src');
    
    // Create intersection observer
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = el;
          
          // If image is already loaded, skip
          if (img.dataset.loaded === 'true') {
            observer.unobserve(el);
            return;
          }
          
          // Load the actual image
          const imageToLoad = new Image();
          imageToLoad.src = actualSrc;
          
          imageToLoad.onload = () => {
            // Fade in the actual image
            img.src = actualSrc;
            img.style.opacity = '1';
            img.dataset.loaded = 'true';
            
            // Optional callback
            if (binding.value && typeof binding.value === 'function') {
              binding.value();
            }
            
            observer.unobserve(el);
          };
          
          imageToLoad.onerror = () => {
            console.warn('Failed to load image:', actualSrc);
            img.src = defaultImage;
            img.style.opacity = '1';
            img.dataset.loaded = 'true';
            observer.unobserve(el);
          };
        }
      });
    }, {
      rootMargin: '100px', // Start loading 100px before entering viewport
      threshold: 0.01 // Minimum visibility percentage
    });
    
    // Store observer reference for cleanup
    el._lazyImageObserver = observer;
    observer.observe(el);
    
    // Also load if image is already in viewport
    const rect = el.getBoundingClientRect();
    const isInViewport = (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
    
    if (isInViewport && !el.dataset.loaded) {
      const img = new Image();
      img.src = actualSrc;
      img.onload = () => {
        el.src = actualSrc;
        el.style.opacity = '1';
        el.dataset.loaded = 'true';
      };
    }
  },
  
  beforeUnmount(el) {
    // Clean up observer
    if (el._lazyImageObserver) {
      el._lazyImageObserver.unobserve(el);
      delete el._lazyImageObserver;
    }
  }
};

/**
 * Alternative: Simple lazy load for small projects
 */
export const simpleLazyImage = {
  mounted(el, binding) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = el;
          const src = img.getAttribute('data-src');
          
          if (src) {
            img.src = src;
            img.removeAttribute('data-src');
          }
          
          observer.unobserve(el);
        }
      });
    });
    
    observer.observe(el);
  }
};
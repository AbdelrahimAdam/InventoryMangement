import { lazyImageDirective } from './lazyImage';

export {
  lazyImageDirective
};

// Optional: Register all directives globally
export const registerDirectives = (app) => {
  app.directive('lazy-image', lazyImageDirective);
  // Add more directives here as needed
};
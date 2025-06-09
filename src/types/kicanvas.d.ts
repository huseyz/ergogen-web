import 'react';

declare module 'react/jsx-runtime' {
  namespace JSX {
    interface IntrinsicElements {
      'kicanvas-embed': unknown;
    }
  }
}

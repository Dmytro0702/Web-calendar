import type * as React from 'react';

// чтобы можно было импортировать .jsx как обычный React-компонент
declare module '*.jsx' {
  const Component: React.ComponentType<any>;
  export default Component;
}

// чтобы можно было импортировать .js (uikit/index.js и т.п.)
declare module '*.js' {
  const value: any;
  export = value;
}

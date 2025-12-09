// client/src/setupTests.ts
import { afterEach, expect } from 'vitest';
import * as matchers from '@testing-library/jest-dom/matchers';
import { cleanup } from '@testing-library/react';

// Подключаем jest-dom matchers к Vitest
expect.extend(matchers);

// Чистим DOM после каждого теста
afterEach(() => {
  cleanup();
});

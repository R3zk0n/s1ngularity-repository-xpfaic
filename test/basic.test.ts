import { describe, it, expect } from 'vitest';
import { createLogger } from '../src';

describe('forge-logger', () => {
  it('creates a logger', () => {
    const log = createLogger({ service: 'test' });
    expect(log).toBeTruthy();
  });
});

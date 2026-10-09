declare function describe(name: string, fn: () => void): void;
declare function test(name: string, fn: () => void | Promise<void>): void;
declare function expect(actual: any): {
  toBe(expected: any): void;
  toBeDefined(): void;
  toContain(item: any): void;
  toBeGreaterThan(expected: number): void;
  every(predicate: (item: any) => boolean): void;
  has(item: any): void;
};

import { expect, test } from "vitest";
import { isPromise, delay, truncateLog, cosineSimilarity, pipe } from "./utils";

// export const delay = (ms: number): Promise<void> => {
//     return new Promise((resolve) => setTimeout(resolve, ms));
//   };

test("delay should resolve after the specified time", async () => {
  const start = Date.now();
  await delay(100);
  const end = Date.now();
  expect(end - start).toBeGreaterThanOrEqual(100);
});

test("delay should resolve with no value", async () => {
  const result = await delay(100);
  expect(result).toBeUndefined();
});

test("delay should be a Promise", () => {
  const result = delay(100);
  expect(isPromise(result)).toBe(true);
});

// export const isPromise = (val: any): val is Promise<any> =>
//     val && typeof val.then === "function";

test("isPromise should return true for a Promise", () => {
  const promise = new Promise<void>((resolve) => resolve());
  expect(isPromise(promise)).toBe(true);
});

test("isPromise should return false for a non-Promise", () => {
  const nonPromise = {};
  expect(isPromise(nonPromise)).toBe(false);
});

test("isPromise should return null for null", () => {
  expect(isPromise(null)).toBe(null);
});

test("isPromise should return undefined for undefined", () => {
  expect(isPromise(undefined)).toBe(undefined);
});

// export const truncateLog = (
//     message: string,
//     maxLength: number = 500
//   ): string => {
//     return message.length > maxLength
//       ? message.substring(0, maxLength) + "..."
//       : message;
//   };

test("truncateLog should truncate a message longer than maxLength", () => {
  const message = "a".repeat(600);
  const truncated = truncateLog(message, 500);
  expect(truncated).toBe("a".repeat(500) + "...");
});

test("truncateLog should not truncate a message shorter than maxLength", () => {
  const message = "a".repeat(400);
  const truncated = truncateLog(message, 500);
  expect(truncated).toBe(message);
});

test("truncateLog should handle an empty message", () => {
  const message = "";
  const truncated = truncateLog(message, 500);
  expect(truncated).toBe(message);
});

test("truncateLog should use default maxLength if not provided", () => {
  const message = "a".repeat(600);
  const truncated = truncateLog(message);
  expect(truncated).toBe("a".repeat(500) + "...");
});

test("truncateLog should handle maxLength of 0", () => {
  const message = "a".repeat(600);
  const truncated = truncateLog(message, 0);
  expect(truncated).toBe("...");
});

// export const cosineSimilarity = (vecA: number[], vecB: number[]): number => {
//     const dotProduct = vecA.reduce((sum, a, idx) => sum + a * vecB[idx], 0);
//     const magnitudeA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
//     const magnitudeB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
//     return dotProduct / (magnitudeA * magnitudeB);
//   };

test("cosineSimilarity should return 1 for identical vectors", () => {
  const vecA = [1, 2, 3];
  const vecB = [1, 2, 3];
  const similarity = cosineSimilarity(vecA, vecB);
  expect(similarity).toBeCloseTo(1);
});

test("cosineSimilarity should return 0 for orthogonal vectors", () => {
  const vecA = [1, 0, 0];
  const vecB = [0, 1, 0];
  const similarity = cosineSimilarity(vecA, vecB);
  expect(similarity).toBeCloseTo(0);
});

test("cosineSimilarity should return -1 for opposite vectors", () => {
  const vecA = [1, 2, 3];
  const vecB = [-1, -2, -3];
  const similarity = cosineSimilarity(vecA, vecB);
  expect(similarity).toBeCloseTo(-1);
});

test("cosineSimilarity should handle zero vectors", () => {
  const vecA = [0, 0, 0];
  const vecB = [1, 2, 3];
  const similarity = cosineSimilarity(vecA, vecB);
  expect(similarity).toBeNaN();
});

test("cosineSimilarity should handle vectors with different magnitudes", () => {
  const vecA = [1, 2, 3];
  const vecB = [2, 4, 6];
  const similarity = cosineSimilarity(vecA, vecB);
  expect(similarity).toBeCloseTo(1);
});

test("cosineSimilarity should handle negative values in vectors", () => {
  const vecA = [1, -2, 3];
  const vecB = [-1, 2, -3];
  const similarity = cosineSimilarity(vecA, vecB);
  expect(similarity).toBeCloseTo(-1);
});

// export const pipe = (initialValue: any, fns: any[]) => {
//     return fns.reduce((acc, fn) => {
//       return isPromise(acc) ? acc.then(fn) : fn(acc);
//     }, initialValue);
//   };

test("pipe should apply functions in sequence", () => {
  const add = (x: number) => x + 1;
  const multiply = (x: number) => x * 2;
  const result = pipe(1, [add, multiply]);
  expect(result).toBe(4); // (1 + 1) * 2 = 4
});

test("pipe should handle an empty array of functions", () => {
  const result = pipe(1, []);
  expect(result).toBe(1);
});

test("pipe should handle a single function", () => {
  const add = (x: number) => x + 1;
  const result = pipe(1, [add]);
  expect(result).toBe(2);
});

test("pipe should handle functions returning promises", async () => {
  const add = (x: number) => Promise.resolve(x + 1);
  const multiply = (x: number) => x * 2;
  const result = await pipe(1, [add, multiply]);
  expect(result).toBe(4); // (1 + 1) * 2 = 4
});

test("pipe should handle initial value as a promise", async () => {
  const add = (x: number) => x + 1;
  const multiply = (x: number) => x * 2;
  const result = await pipe(Promise.resolve(1), [add, multiply]);
  expect(result).toBe(4); // (1 + 1) * 2 = 4
});

test("pipe should handle mixed synchronous and asynchronous functions", async () => {
  const add = (x: number) => x + 1;
  const asyncMultiply = (x: number) => Promise.resolve(x * 2);
  const result = await pipe(1, [add, asyncMultiply]);
  expect(result).toBe(4); // (1 + 1) * 2 = 4
});

test("pipe should handle functions that return promises in sequence", async () => {
  const add = (x: number) => Promise.resolve(x + 1);
  const multiply = (x: number) => Promise.resolve(x * 2);
  const result = await pipe(1, [add, multiply]);
  expect(result).toBe(4); // (1 + 1) * 2 = 4
});

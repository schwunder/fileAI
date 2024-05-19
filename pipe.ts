// import { Effect, pipe } from "effect";
// const increment = (x: number) => x + 1;

// const task1 = Effect.promise(() => Promise.resolve(10));
// const fetch = (a: number) =>
//   new Promise((resolve) => setTimeout(() => resolve(a + 20), 1000));
// const program = pipe(task1, fetch, increment);
// Effect.runPromise(program).then(console.log); // Output: "Result is: 6"

const fetcher = (b: number) =>
  new Promise<number>((resolve) => setTimeout(() => resolve(b + 1), 1000));

fetcher(0).then((b) => {
  const a = b + 1;
  console.log(a, "after");
});
console.log("before");
// Example usage:
const add = (x) => x + 1;
const asyncAdd = (x) =>
  new Promise((resolve) => setTimeout(() => resolve(x + 2), 1000));
const asyncDivide = (x: number) =>
  new Promise((resolve) => setTimeout(() => resolve(x / 3), 1000));
const multiply = (x: number) => x * 3;

pipe(1, [add, asyncAdd, multiply, asyncDivide])
  .then((result) => console.log(result, Date.now())) // Output will be 12 after 1 second
  .catch((error) => console.error(error));

pipe(3, [add, asyncAdd, multiply, asyncDivide])
  .then((result) => console.log(result, Date.now())) // Output will be 12 after 1 second
  .catch((error) => console.error(error));

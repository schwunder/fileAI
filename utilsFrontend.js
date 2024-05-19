export const isPromise = (val) => val && typeof val.then === "function";
export const pipe = (initialValue, fns) => {
  if (!Array.isArray(fns)) {
    throw new TypeError("fns must be an array of functions");
  }
  return fns.reduce((acc, fn) => {
    return isPromise(acc) ? acc.then(fn) : fn(acc);
  }, initialValue);
};

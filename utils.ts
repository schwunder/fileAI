export const isPromise = (val: any): val is Promise<any> =>
  val && typeof val.then === "function";
export const pipe = (initialValue: any, fns: any[]) => {
  return fns.reduce((acc, fn) => {
    return isPromise(acc) ? acc.then(fn) : fn(acc);
  }, initialValue);
};

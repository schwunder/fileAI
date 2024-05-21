export const isPromise = (val) => val && typeof val.then === "function";
export const pipe = (initialValue, fns) => {
  if (!Array.isArray(fns)) {
    throw new TypeError("fns must be an array of functions");
  }
  return fns.reduce((acc, fn) => {
    return isPromise(acc) ? acc.then(fn) : fn(acc);
  }, initialValue);
};

export function playSirenSound() {
  const audio = new Audio("/siren.mp3");
  audio
    .play()
    .then(() => {
      console.log("Audio playback started");
    })
    .catch((error) => {
      console.error("Error playing audio:", error);
    });
}

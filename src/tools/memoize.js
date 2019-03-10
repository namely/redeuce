export default function memoize(fn) {
  memoize.cache = {};
  return (...args) => {
    const key = JSON.stringify(args[0]);
    if (memoize.cache[key]) {
      if (JSON.stringify(args) !== JSON.stringify(memoize.cache[key].args)) {
        throw new Error(`[Redeuce][Error] Store ${key} already exists`);
      }
      return memoize.cache[key].val;
    } else {
      const val = fn(...args);
      memoize.cache[key] = { val, args };
      return val;
    }
  };
}

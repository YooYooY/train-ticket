export const throttle = (fn, duration = 300) => {
  let oldTime = Date.now();
  return function (...args) {
    const nowTime = Date.now();
    if (nowTime - oldTime >= duration) {
      fn.apply(this, args);
      oldTime = nowTime;
    }
  };
};

export const debounce = (fn, delay = 200) => {
  let timer = null;
  return function (...args) {
    clearTimeout(timer);
    const ctx = this;
    timer = setTimeout(() => {
      fn.apply(ctx, args);
    }, delay);
  };
};

export const h0 = (timestamp = Date.now()) => {
  const target = new Date(timestamp);
  target.setHours(0);
  target.setMinutes(0);
  target.setSeconds(0);
  target.setMilliseconds(0);

  return target.getTime();
};

import { useCallback, useEffect, useState } from "react";
import { debounce, h0 } from "../utils";

export const useDebounce = (fn, delay) => {
  return useCallback(debounce(fn, delay), []);
};

export const useNav = (departDate, dispatch, prevDate, nextDate) => {
  const isPrevDisabled = h0(departDate) <= h0();
  const isNextDisabled = h0(departDate) - h0() > 20 * 86400 * 1000;

  const prev = useCallback(() => {
    if (isPrevDisabled) return;
    dispatch(prevDate());
  }, [isPrevDisabled]);

  const next = useCallback(() => {
    if (isNextDisabled) return;
    dispatch(nextDate());
  }, [isNextDisabled]);

  return {
    isPrevDisabled,
    isNextDisabled,
    prev,
    next,
  };
};

export const useWinSize = () => {
  const [width, setWidth] = useState(document.documentElement.clientWidth);
  const [height, setHeight] = useState(document.documentElement.clientHeight);

  const onResize = () => {
    setWidth(document.documentElement.clientWidth);
    setHeight(document.documentElement.clientHeight);
  };

  useEffect(() => {
    window.addEventListener("resize", onResize, false);
    return () => {
      window.addEventListener("resize", onResize, false);
    };
  }, []);

  return { width, height };
};

import { useEffect, useState, useRef, useMemo, useCallback } from "react";

const timeToNum = (time, total) =>
  total <= 0 ? 0 : Math.round((time / 24) * total);
const numToTime = (num, total) =>
  total <= 0 ? 0 : Math.round((num / total) * 24);

export const useSlider = ({ minNum, maxNum, startNum, sliderEl }, onChange) => {
  const timeToSliderNum = useMemo(() => timeToNum(startNum, maxNum), [
    maxNum,
    startNum,
  ]);

  const slideNumToTime = useCallback(
    (distance) => numToTime(distance, maxNum),
    [maxNum]
  );

  let start = 0;
  let distance = useRef(() => timeToSliderNum);
  let tmpDistance = timeToSliderNum;
  const [sliderNum, setSliderNum] = useState(() => distance.current);

  const touchStart = (e) => {
    e.preventDefault();
    const { clientX } = e.targetTouches[0];
    start = clientX;
    e.target.addEventListener("touchmove", touchMove, false);
    e.target.addEventListener("touchend", touchEnd, false);
  };
  const touchMove = (e) => {
    e.preventDefault();
    const { clientX } = e.targetTouches[0];
    tmpDistance = parseInt(clientX - start + distance.current);
    if (tmpDistance <= minNum) tmpDistance = minNum;
    if (tmpDistance >= maxNum) tmpDistance = maxNum;

    setSliderNum(tmpDistance);

    sliderEl.style.transform = `translateX(${tmpDistance}px)`;
  };

  const touchEnd = (e) => {
    e.preventDefault();
    distance.current = tmpDistance;

    const t = slideNumToTime(tmpDistance);
    onChange(t);

    e.target.removeEventListener("touchmove", touchMove, false);
    e.target.removeEventListener("touchend", touchEnd, false);
  };

  useEffect(() => {
    if (sliderEl) {
      sliderEl.addEventListener("touchstart", touchStart);
    }
    return () => {
      if (sliderEl) {
        sliderEl.removeEventListener("touchstart", touchStart);
      }
    };
  }, [sliderEl]);

  useEffect(() => {
    if (sliderEl) {
      distance.current = timeToSliderNum;
      setSliderNum(timeToSliderNum);
      sliderEl.style.transform = `translateX(${distance.current}px)`;
    }
  }, [sliderEl, startNum]);

  const formatTime = useMemo(() => {
    if (maxNum <= 0) return `${startNum}:00`.padStart(5, "0");
    return (numToTime(sliderNum, maxNum) + ":00").padStart(5, "0");
  }, [startNum, sliderNum]);

  return formatTime;
};

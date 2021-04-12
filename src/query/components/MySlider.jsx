import React, { useRef, useEffect, useState, memo } from 'react'
import './MySlider.css'
import { useSlider } from '../../hooks/useSlider'

export default memo(function MySlider(props) {
  const {
    title,
    currentStartHours,
    currentEndHours,
    onStartChanged,
    onEndChanged,
  } = props;
  
  const starRef = useRef()
  const endRef = useRef()
  const slideRef = useRef()

  const [maxNum, setMaxNum] = useState(0)

  const startSlider = useSlider(
    {
      minNum: 0,
      maxNum,
      startNum: currentStartHours,
      sliderEl: starRef.current,
    },
    onStartChanged
  )

  const endSlider = useSlider(
    {
      minNum: 0,
      maxNum,
      startNum: currentEndHours,
      sliderEl: endRef.current,
    },
    onEndChanged
  )

  useEffect(() => {
    const sliderWidth = slideRef.current.clientWidth - 30
    setMaxNum(sliderWidth)
  }, [])

  return (
    <div className="option">
      <h3>{title}</h3>
      <div className="slideBox" ref={slideRef}>
        <div className="line"></div>
        <span className="btn" ref={starRef}>
          <i>{startSlider}</i>
        </span>
        <span className="btn" ref={endRef}>
          <i>{endSlider}</i>
        </span>
      </div>
    </div>
  )
})
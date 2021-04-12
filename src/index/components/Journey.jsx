import React from 'react'
import switchImg from '../imgs/switch.svg'
import './Journey.css'

function Journey(props) {
  const { from, to, exchangeFromTo, showCitySelector } = props

  return (
    <div className="journey">
      <div className="journey-station" onClick={() => showCitySelector(true)}>
        <input
          type="text"
          readOnly="readOnly"
          name="from"
          value={from}
          className="journey-input journey-from"
        />
      </div>
      <div className="journey-switch">
        <img
          src={switchImg}
          width="70"
          height="40"
          alt="switch"
          onClick={exchangeFromTo}
        />
      </div>
      <div className="journey-station" onClick={() => showCitySelector(false)}>
        <input
          type="text"
          readOnly="readOnly"
          name="to"
          value={to}
          className="journey-input journey-to"
        />
      </div>
    </div>
  )
}

export default Journey

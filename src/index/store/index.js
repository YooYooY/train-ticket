import {createStore, combineReducers, applyMiddleware} from 'redux';

import reducers from './reducers'
import thunk from "redux-thunk";

const state = {
    from: "北京",
    to: "上海",
    isCitySelectorVisible: false,
    currentSelectingLeftCity: false,
    cityData: null,
    isLoadingCityData: false,
    isDateSelectorVisible: false,
    departDate: Date.now(),
    highSpeed: false
}

export default createStore(
  combineReducers(reducers),
  state,
  applyMiddleware(thunk)
)
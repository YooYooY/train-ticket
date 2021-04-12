import { createStore, combineReducers, applyMiddleware } from 'redux'
import { h0 } from '../../utils'
import { ORDER_DEPART } from './constant'

import reducers from './reducers'
import thunk from 'redux-thunk'

const initState = {
  from: null,
  to: null,
  departDate: h0(Date.now()),
  highSpeed: false,
  trainList: [],
  orderType: ORDER_DEPART,
  onlyTickets: false,
  ticketTypes: [],
  checkedTicketTypes: {},
  trainTypes: [],
  checkedTrainTypes: {},
  departStations: [],
  checkedDepartStations: {},
  arriveStations: [],
  checkedArriveStations: {},
  departTimeStart: 0,
  departTimeEnd: 24,
  arriveTimeStart: 0,
  arriveTimeEnd: 24,
  isFiltersVisible: false,
  searchParsed: false,
}

export default createStore(
  combineReducers(reducers),
  initState,
  applyMiddleware(thunk)
)

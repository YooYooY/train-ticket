import React, { useCallback, useMemo } from "react";
import { connect } from "react-redux";
import "./App.css";

import Header from "../common/Header";
import CitySelector from "../common/CitySelector";
import DateSelector from "../common/DateSelector";

import HighSpeed from "./components/HighSpeed";
import Journey from "./components/Journey";
import Submit from "./components/Submit";
import DepartDate from "./components/DepartDate";

import {
  exchangeFromTo,
  showCitySelector,
  setSelectedCity,
  hideCitySelector,
  fetchCityData,
  showDateSelector,
  toggleHighSpeed,
  hideDateSelector,
  setDepartDate,
} from "./store/actions";
import { bindActionCreators } from "redux";
import { h0 } from "../utils";

export function App(props) {
  const {
    from,
    to,
    dispatch,
    isCitySelectorVisible,
    cityData,
    isLoadingCityData,
    departDate,
    isDateSelectorVisible,
    highSpeed,
  } = props;

  const onBack = useCallback(() => window.history.back(), []);

  const journeyCbs = useMemo(() => {
    return bindActionCreators(
      {
        exchangeFromTo,
        showCitySelector,
      },
      dispatch
    );
  }, []);

  const citySelectorCbs = useMemo(() => {
    return bindActionCreators(
      {
        onBack: hideCitySelector,
        onSelect: setSelectedCity,
        fetchCityData,
      },
      dispatch
    );
  }, []);

  const departDateCbs = useMemo(() => {
    return bindActionCreators(
      {
        onClick: showDateSelector,
      },
      dispatch
    );
  }, []);

  const dateSelectorCbs = useMemo(() => {
    return bindActionCreators(
      {
        onBack: hideDateSelector,
      },
      dispatch
    );
  }, []);

  const onSelectDate = useCallback((day) => {
    if (!day) return;
    if (day < h0()) return;

    dispatch(setDepartDate(day));
    dispatch(hideDateSelector());
  }, []);

  const highSeppedCbs = useMemo(() => {
    return bindActionCreators(
      {
        toggle: toggleHighSpeed,
      },
      dispatch
    );
  }, []);

  return (
    <>
      <header>
        <Header title="火车票" onBack={onBack}></Header>
      </header>
      <main>
        <form action="./query.html" className="form">
          <Journey from={from} to={to} {...journeyCbs} />
          <DepartDate time={departDate} {...departDateCbs} />
          <HighSpeed highSpeed={highSpeed} {...highSeppedCbs} />
          <Submit />
        </form>
        <CitySelector
          show={isCitySelectorVisible}
          cityData={cityData}
          isLoading={isLoadingCityData}
          {...citySelectorCbs}
        />
        <DateSelector
          show={isDateSelectorVisible}
          {...dateSelectorCbs}
          onSelect={onSelectDate}
        />
      </main>
    </>
  );
}

export default connect(
  (state) => state,
  (dispatch) => ({ dispatch })
)(App);

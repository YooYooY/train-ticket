import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useDebounce } from "../hooks";
import PropTypes from "prop-types";
import classnames from "classnames";
import "./CitySelector.css";
import { debounce } from "../utils";

const CityItem = memo((props) => {
  const { name, onSelect } = props;
  return (
    <li className="city-li" onClick={() => onSelect(name)}>
      {name}
    </li>
  );
});

CityItem.propTypes = {
  name: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
};

const CitySection = memo((props) => {
  const { title, cities = [], onSelect } = props;
  return (
    <ul className="city-ul">
      <li className="city-li" key="title" data-cate={title}>
        {title}
      </li>
      {cities.map((city) => (
        <CityItem key={city.name} name={city.name} onSelect={onSelect} />
      ))}
    </ul>
  );
});

CitySection.propTypes = {
  title: PropTypes.string.isRequired,
  cities: PropTypes.array,
  onSelect: PropTypes.func.isRequired,
};

const AlphaIndex = memo((props) => {
  const { alpha, onClick } = props;
  return <i onClick={() => onClick(alpha)}>{alpha}</i>;
});
AlphaIndex.propTypes = {
  alpha: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

const alphabet = Array.from(new Array(26), (el, index) =>
  String.fromCharCode(65 + index)
);

const CityList = memo((props) => {
  const { sections, onSelect, toAlpha } = props;
  return (
    <div className="city-list">
      <div className="city-cate">
        {sections.map((section) => (
          <CitySection
            key={section.title}
            title={section.title}
            cities={section.citys}
            onSelect={onSelect}
          />
        ))}
      </div>
      <div className="city-index">
        {alphabet.map((alpha) => (
          <AlphaIndex key={alpha} alpha={alpha} onClick={toAlpha} />
        ))}
      </div>
    </div>
  );
});

CityList.propTypes = {
  sections: PropTypes.array.isRequired,
  onSelect: PropTypes.func.isRequired,
  toAlpha: PropTypes.func.isRequired,
};

const SuggestItem = memo((props) => {
  const { name, onClick } = props;
  return (
    <li className="city-suggest-li" onClick={() => onClick(name)}>
      {name}
    </li>
  );
});
SuggestItem.propTypes = {
  name: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

const Suggest = memo((props) => {
  const { searchKey, onSelect } = props;
  const [result, setResult] = useState([]);

  // const getSearchData = useDebounce(()=>{
  //   fetch('/rest/search?key=' + encodeURIComponent(searchKey))
  //     .then((res) => res.json())
  //     .then((data) => {
  //       const { result, searchKey: sKey } = data
  //       if (sKey === searchKey) {
  //         setResult(result)
  //       }
  //     })
  // },500)
  // useEffect(getSearchData, [searchKey])

  const getData = useRef();

  getData.current = debounce(() => {
    fetch("/rest/search?key=" + encodeURIComponent(searchKey))
      .then((res) => res.json())
      .then((data) => {
        const { result, searchKey: sKey } = data;
        if (sKey === searchKey) {
          setResult(result);
        }
      });
  }, 500);

  useEffect(getData.current, [searchKey]);

  const fallBackResult = useMemo(() => {
    return result.length ? result : [{ display: searchKey }];
  }, [result, searchKey]);

  return (
    <div className="city-suggest">
      <ul className="city-suggest-ul">
        {fallBackResult.map((item, key) => {
          return (
            <SuggestItem key={key} name={item.display} onClick={onSelect} />
          );
        })}
      </ul>
    </div>
  );
});

Suggest.propTypes = {
  searchKey: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
};

const CitySelector = memo(function CitySelector(props) {
  const { show, cityData, isLoading, onBack, fetchCityData, onSelect } = props;

  const [searchKey, setSearchKey] = useState("");
  const key = useMemo(() => searchKey.trim(), [searchKey]);

  useEffect(() => {
    if (!show || cityData || isLoading) return;
    fetchCityData();
  }, [isLoading, cityData, show]);

  const toAlpha = useCallback((alpha) => {
    document.querySelector(`[data-cate='${alpha}']`).scrollIntoView();
  }, []);

  const outputCitySections = useCallback(() => {
    if (isLoading) return <div>loading...</div>;

    if (cityData)
      return (
        <CityList
          sections={cityData.cityList}
          onSelect={onSelect}
          toAlpha={toAlpha}
        />
      );

    return <div>error</div>;
  }, [isLoading, cityData]);

  return (
    <div className={classnames("city-selector", { hidden: !show })}>
      <div className="city-search">
        <div className="search-back" onClick={onBack}>
          &lt;
        </div>
        <div className="search-input-wrapper">
          <input
            type="text"
            value={searchKey}
            className="search-input"
            placeholder="城市、车站的中文或拼音"
            onChange={(e) => setSearchKey(e.target.value)}
          />
        </div>
        <i
          onClick={() => setSearchKey("")}
          className={classnames("search-clean", { hidden: !key.length })}
        >
          &times;
        </i>
      </div>
      {Boolean(key) && (
        <Suggest searchKey={key} onSelect={(key) => onSelect(key)} />
      )}
      {outputCitySections()}
    </div>
  );
});

CitySelector.propTypes = {
  show: PropTypes.bool.isRequired,
  cityData: PropTypes.object,
  isLoading: PropTypes.bool.isRequired,
  onBack: PropTypes.func.isRequired,
  fetchCityData: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default CitySelector;

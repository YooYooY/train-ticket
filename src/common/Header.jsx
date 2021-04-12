import React, { memo } from "react";
import PropTypes from "prop-types";
import "./Header.css";

const Header = memo(function Header(props) {
  const { onBack, title } = props;

  return (
    <div className="header">
      <div className="header-back" onClick={onBack}>
        &lt;
      </div>
      <h1 className="header-title">{title}</h1>
    </div>
  );
});

Header.propTypes = {
  onBack: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};

export default Header;

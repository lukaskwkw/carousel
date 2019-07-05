import React from "react";
import PropTypes from "prop-types";

import "./style.scss";

const Header = ({ children }) => <h1 className="header">{children}</h1>;

Header.propTypes = {
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.string])
};

export default Header;

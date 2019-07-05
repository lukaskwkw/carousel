import React from "react";
import { PropTypes } from "prop-types";
import History from "../utils/history";

const Link = ({ href, children }) => {
  const onClick = e => {
    const aNewTab = e.metaKey || e.ctrlKey;
    const anExternalLink = href.startsWith("http");

    if (!aNewTab && !anExternalLink) {
      e.preventDefault();
      History.push(href);
    }
  };

  return (
    <a href={href} onClick={onClick}>
      {children}
    </a>
  );
};

Link.propTypes = {
  href: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.string])
};

export default Link;

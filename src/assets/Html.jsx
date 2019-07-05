import React from "react";
import { PropTypes } from "prop-types";

const Html = ({ innerContent }) => (
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
      <link href="/main.css" rel="stylesheet" />
      <title>Webpack, react, eslint, prettier and pre-hooks boilerplate</title>
    </head>
    <body>
      <div id="app" dangerouslySetInnerHTML={{ __html: innerContent }} />
      <script src="/bundle.js" />
    </body>
  </html>
);

Html.propTypes = {
  innerContent: PropTypes.string
};

export default Html;

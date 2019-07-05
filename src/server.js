import React from "react";
import express from "express";
import { renderToString, renderToStaticMarkup } from "react-dom/server";
import Html from "./assets/Html.jsx";
import App from "./index.jsx";

import PAGES from "./routes";

const server = express();
const port = process.env.PORT || 3000;

server.use(express.static("public"));

server.get("*", (req, res) => {
  const innerContent = renderToString(<App pathname={req.path} />);

  const html = renderToStaticMarkup(<Html innerContent={innerContent} />);

  if (!Object.keys(PAGES).includes(req.path)) {
    res.status(404);
  }

  res.end(`<!DOCTYPE html>${html}`);
});

server.listen(port, () => {
  // eslint-disable-next-line no-console
  console.info(`Listening on port: ${port}`);
});

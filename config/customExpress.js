const express = require("express");
const consign = require("consign");
const bodyParser = require("body-parser");
const cors = require("cors");

module.exports = () => {
  const app = express();
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(cors());
  consign().include("controllers").into(app);

  app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Header",
      "Origin",
      "X-Requrested-With",
      "Accept",
      "Content-Type",
      "Authorization"
    );

    if (req.method === "OPTIONS") {
      res.header(
        "Access-Control-Allow-Methods",
        "PUT, POST, PATCH, DELETE, GET"
      );
      return res.status(200).send({});
    }

    next();
  });

  return app;
};

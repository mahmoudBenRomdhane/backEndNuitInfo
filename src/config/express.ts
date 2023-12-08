import express from "express";
const morgan = require("morgan");
const bodyParser = require("body-parser");
const compress = require("compression");
const methodOverride = require("method-override");
const cors = require("cors");
const helmet = require("helmet");
const routes = require("../routes");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");

const app = express();
app.use(mongoSanitize());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan("dev"));
app.use(bodyParser.json({ limit: "5mb" }));
app.use(cookieParser());
app.use(compress());
app.use(methodOverride());
app.use(helmet());
app.use(cors());

app.use("/api/v1", routes);

module.exports = app;

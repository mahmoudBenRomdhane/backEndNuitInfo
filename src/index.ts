const http = require("http");
const { port } = require("./config/vars");
const app = require("./config/express");

const mongoose = require("./config/mongoose");

mongoose.connect();

const options = {};
const server = http.createServer(options, app);

server.listen(port, () => {
  console.info(` --- http://localhost:${port}`);
});

module.exports = app;

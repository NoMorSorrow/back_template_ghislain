const express = require("express");
const cors = require("cors");

const mainRouter = require("./routes");

const app = express();
app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_ORIGIN,
  })
);

app.use("/images", express.static("./images"));

app.get("/", (_req, res) => {
  res.status(200).json({ foo: "hello" });
});

app.use("/api", mainRouter);

module.exports = app;

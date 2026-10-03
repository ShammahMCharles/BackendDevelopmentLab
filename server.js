//DNS CONNECTION FIX
const dns = require('dns');
dns.setServers(["8.8.8.8", "8.8.4.4"]);

require("dotenv").config();
require("./config/db-connection");
const express = require("express");
const path = require("path");
const morgan = require("morgan");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded());
app.use(express.json());
app.use(morgan("dev"));

const authRouter = require("./routes/user-routes");
app.use("/api/auth", authRouter);

app.listen(PORT, () => {
  console.log(`Server is listening @ http://localhost:${PORT}`);
});
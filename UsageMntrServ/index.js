const express = require("express");
const bodyParser = require("body-parser");
const { randomBytes } = require("crypto");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());
app.use(cors());



app.listen(4002, () => {
  console.log("UsageMntrServ: Listening on 4002");
});

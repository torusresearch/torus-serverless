const express = require("express");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const compression = require("compression");
const cors = require("cors");

//setup app
const app = express();

// Setup environment
require("dotenv").config();

//setup middleware
const corsOptions = {
  //   origin: ["https://localhost:3000", /\.tor\.us$/],
  origin: "*",
  credentials: false
};
app.use(cors(corsOptions)); //middleware to enables cors
app.use(helmet()); // middleware which adds http headers
app.use(compression()); // middleware which uses gzip compression on responses
app.use(bodyParser.urlencoded({ extended: false })); // middleware which parses body
app.use(bodyParser.json()); // converts body to json

// bring all routes here
const routes = require("./routes");
app.use("/", routes);

const port = process.env.PORT || 2030;
app.listen(port, () => console.log(`Server running on port: ${port}`));

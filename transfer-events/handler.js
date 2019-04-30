/*
    We use etherscan keys to get token transfer tx's for each user
    Etherscan API is rate limited to 5 txps
    so, if we use n keys, our limit would be 5n txps
    Even after that, if we encounter a rate limit response, 
    we use Math.random() to select a different key and return the response.
    For more rate limits, the front-end is supposed to handle it

    How to scale:
    - Increase the no.of keys
    - Run a full ETH node and stop using etherscan API

    How it works:
    - the keys are stored in a .env file and loaded using dotenv package
    - keys are stored in array `keys`
    - we use a globalCounter to keep track of key index used
    - when it use up the last key, it resets to the first
    - the key tick process is synchronous and it makes sure that all keys are used uniformly
*/
// require("dotenv").config();
const express = require("express");
const awsServerlessExpress = require("aws-serverless-express");
const axios = require("axios").default;
const compression = require("compression");
const cors = require("cors");
const helmet = require("helmet");

const API_KEYS = process.env.API_KEYS.split(",");
//set up app
const app = express();
let globalCounter = -1; // read top

//set up middleware
const corsOptions = {
  //   origin: ["https://localhost:3000", /\.tor\.us$/],
  origin: "*",
  credentials: false
};
app.use(cors(corsOptions)); //middleware to enables cors
app.use(helmet()); // middleware which adds http headers
app.use(compression()); // middleware which uses gzip compression on responses

const validateInput = require("./validations/input");

app.get("/", async (req, res) => {
  res.json({ message: "Welcome to Torus backend" });
});

// Main route of app
app.get("/tokenbalances", async (req, res) => {
  const { errors, isValid } = validateInput(req.query);
  if (!isValid) {
    return res.status(400).json(errors);
  }
  globalCounter++;
  const selectedApiKey = API_KEYS[globalCounter];
  if (globalCounter === API_KEYS.length - 1) globalCounter = -1;
  const { address } = req.query;
  axios
    .get(
      `https://api.etherscan.io/api?module=account&action=tokentx&address=${address}&startblock=0&endblock=999999999&sort=asc&apikey=${selectedApiKey}`,
      {
        headers: {
          "Content-Type": "application/json; charset=utf-8"
        }
      }
    )
    .then(response => {
      const { status, data } = response;
      const balances = {};
      if (status === 200) {
        for (let index = 0; index < data.result.length; index++) {
          const { tokenSymbol, contractAddress, tokenName, from, tokenDecimal, value } = data.result[index];
          balances[tokenSymbol] = balances[tokenSymbol]
            ? balances[tokenSymbol]
            : { balance: 0, name: "", ticker: "", contractAddress: "", tokenDecimal: 0 };
          const finalValue = parseFloat(value) / 10 ** parseInt(tokenDecimal, 10);
          balances[tokenSymbol].balance += from === address ? -finalValue : +finalValue;
          balances[tokenSymbol].name = tokenName;
          balances[tokenSymbol].ticker = tokenSymbol;
          balances[tokenSymbol].contractAddress = contractAddress;
          balances[tokenSymbol].tokenDecimal = tokenDecimal;
        }
        const finalBalances = [];
        Object.keys(balances).map(item => {
          if (balances[item].balance > 0) finalBalances.push({ ...balances[item], balance: balances[item].balance });
        });
        res.status(200).json(finalBalances);
      }
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err });
    });
});

const server = awsServerlessExpress.createServer(app);

module.exports.server = (event, context) => awsServerlessExpress.proxy(server, event, context);

// app.listen(2020, () => console.log(`Server running on port: 2020`));

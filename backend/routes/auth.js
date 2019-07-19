const express = require("express");
const router = express.Router();
const knex = require("../database");
const createLogger = require("logging").default;

const logger = createLogger("auth.js");

const { toChecksumAddress } = require("web3-utils");

const pify = require("pify");
let jwt = require("jsonwebtoken");
jwt = pify(jwt);

const fs = require("fs");
const path = require("path");
const jwtPrivateKey = fs.readFileSync(path.resolve(__dirname, "../keys/jwtRS256.key"));

const generateRandomNumber = require("../helpers/random");
const { getSignInMessage, getAddressFromSignedMessage } = require("../helpers/message");

const validateAuthInput = require("../validations/authInput");
const validateAuthVerifyInput = require("../validations/authVerifyInput");

router.post("/message", async (req, res) => {
  const { errors, isValid } = validateAuthInput(req.body);
  if (!isValid) {
    logger.warn("Invalid inputs", errors);
    return res.status(400).json({ error: errors, success: false });
  }
  try {
    const randomNumber = generateRandomNumber();
    const signInMessage = getSignInMessage(randomNumber);
    // store this request in db
    const user = await knex("signin").where({ public_address: req.body.public_address });
    if (user.length > 0) {
      // Already exists, so update
      await knex("signin")
        .where({ public_address: req.body.public_address })
        .update({
          updated_at: new Date(Date.now()),
          message: signInMessage
        });
    } else {
      // doesn't, so add
      await knex("signin").insert({
        created_at: new Date(Date.now()),
        updated_at: new Date(Date.now()),
        message: signInMessage,
        public_address: req.body.public_address
      });
    }
    res.status(201).json({ success: true, message: signInMessage });
  } catch (error) {
    logger.error("unable to insert/update message", error);
    res.status(500).json({ error: error, success: false });
  }
});

router.post("/verify", async (req, res) => {
  const { errors, isValid } = validateAuthVerifyInput(req.body);
  if (!isValid) {
    logger.warn("Invalid inputs", errors);
    return res.status(400).json({ error: errors, success: false });
  }
  try {
    const { signed_message, public_address } = req.body;
    const user = await knex("signin").where({ public_address: public_address });
    if (user.length > 0) {
      const recoveredAddress = getAddressFromSignedMessage(user[0].message, signed_message);
      if (recoveredAddress === public_address.toLowerCase()) {
        // If the signature matches the owner supplied, create a
        // JSON web token for the owner that expires in 24 hours.
        const finalAddress = toChecksumAddress(public_address);
        var token = await jwt.sign({ public_address: finalAddress }, jwtPrivateKey, { expiresIn: "6h", algorithm: "RS256" });
        res.status(200).json({ success: true, token: token });
      } else {
        res.status(401).json({ error: "Signature did not match", success: false });
      }
    } else {
      logger.warn("Invalid id");
      return res.status(403).json({ error: "get message first", success: false });
    }
  } catch (error) {
    logger.error("unable to insert/update message", error);
    res.status(500).json({ error: error, success: false });
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const knex = require("../database");
const createLogger = require("logging").default;

const logger = createLogger("user.js");

const validateGetUserInput = require("../validations/getUserInput");
const validatePostUserInput = require("../validations/postUserInput");
const validatePatchUserInput = require("../validations/patchUserInput");

router.get("/", async (req, res) => {
  const { errors, isValid } = validateGetUserInput(req.query);
  if (!isValid) {
    logger.warn("Invalid inputs", errors);
    return res.status(400).json(errors);
  }
  try {
    const p1 = knex("user").where({ public_address: req.query.public_address });
    const p2 = knex("transactions")
      .where({ from: req.query.public_address })
      .orWhere({ to: req.query.public_address });
    const results = await Promise.all([p1, p2]);
    if (results[0].length > 0) {
      const user = results[0][0];
      user.transactions = results[1];
      res.json({ data: user });
    } else {
      logger.warn("User doesn't exist");
      res.status(403).json({ error: "User doesn't exist" });
    }
  } catch (error) {
    logger.error("unable to give out user details", error);
    res.status(500).json({ error: error });
  }
});

router.post("/", async (req, res) => {
  const { errors, isValid } = validatePostUserInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }
  try {
    const result = await knex("user").where({ public_address: req.body.public_address });
    if (result.length === 0) {
      await knex("user").insert({
        public_address: req.body.public_address,
        default_currency: req.body.default_currency,
        is_new: false
      });
      res.status(201).json({ status: "Success" });
    } else {
      logger.warn("Already exists");
      return res.status(409).json({ error: "user already exists" });
    }
  } catch (error) {
    logger.error("unable to insert user", error);
    res.status(500).json({ error: error });
  }
});

router.patch("/", async (req, res) => {
  const { errors, isValid } = validatePatchUserInput(req.body);
  if (!isValid) {
    logger.warn("Invalid inputs", errors);
    return res.status(400).json(errors);
  }
  try {
    const objectId = await knex("user").where({ public_address: req.body.public_address });
    if (objectId.length > 0) {
      await knex("user")
        .where({ public_address: req.body.public_address })
        .update({
          default_currency: req.body.default_currency
        });
      res.status(201).json({ status: "Success" });
    } else {
      logger.warn("Invalid user");
      return res.status(403).json({ error: "user doesn't exist" });
    }
  } catch (error) {
    logger.error("unable to patch user", error);
    res.status(500).json({ error: error });
  }
});

module.exports = router;

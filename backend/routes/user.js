const express = require("express");
const router = express.Router();
const knex = require("../database");
const createLogger = require("logging").default;

const logger = createLogger("user.js");

const validatePostUserInput = require("../validations/postUserInput");
const validatePatchUserInput = require("../validations/patchUserInput");

router.get("/", async (req, res) => {
  try {
    const { public_address } = req;
    const p1 = knex("user").where({ public_address: public_address });
    const p2 = knex("transactions")
      .where({ from: public_address })
      .orWhere({ to: public_address });
    const results = await Promise.all([p1, p2]);
    if (results[0].length > 0) {
      const user = results[0][0];
      user.transactions = results[1];
      res.json({ data: user, success: true });
    } else {
      logger.warn("User doesn't exist");
      res.status(403).json({ error: "User doesn't exist", success: false });
    }
  } catch (error) {
    logger.error("unable to give out user details", error);
    res.status(500).json({ error: error, success: false });
  }
});

router.post("/", async (req, res) => {
  const { errors, isValid } = validatePostUserInput(req.body);
  if (!isValid) {
    return res.status(400).json({ error: errors, success: false });
  }
  try {
    const { public_address } = req;
    const { default_currency } = req.body || {};
    const result = await knex("user").where({ public_address: public_address });
    if (result.length === 0) {
      await knex("user").insert({
        public_address: public_address,
        default_currency: default_currency,
        is_new: false
      });
      res.status(201).json({ success: true });
    } else {
      logger.warn("Already exists");
      return res.status(409).json({ error: "user already exists", success: false });
    }
  } catch (error) {
    logger.error("unable to insert user", error);
    res.status(500).json({ error: error, success: false });
  }
});

router.patch("/", async (req, res) => {
  const { errors, isValid } = validatePatchUserInput(req.body);
  if (!isValid) {
    logger.warn("Invalid inputs", errors);
    return res.status(400).json({ error: errors, success: false });
  }
  try {
    const { public_address } = req;
    const { default_currency } = req.body || {};
    const objectId = await knex("user").where({ public_address: public_address });
    if (objectId.length > 0) {
      await knex("user")
        .where({ public_address: public_address })
        .update({
          default_currency: default_currency
        });
      res.status(201).json({ success: true });
    } else {
      logger.warn("Invalid user");
      return res.status(403).json({ error: "user doesn't exist", success: false });
    }
  } catch (error) {
    logger.error("unable to patch user", error);
    res.status(500).json({ error: error, success: false });
  }
});

module.exports = router;

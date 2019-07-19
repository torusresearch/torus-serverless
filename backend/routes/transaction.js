const express = require("express");
const router = express.Router();
const knex = require("../database");
const createLogger = require("logging").default;

const logger = createLogger("transaction.js");

const validateGetTransactionInput = require("../validations/getTransactionInput");
const validatePostTransactionInput = require("../validations/postTransactionInput");
const validatePatchTransactionInput = require("../validations/patchTransactionInput");
const validatePutTransactionInput = require("../validations/putTransactionInput");

router.get("/", async (req, res) => {
  const { errors, isValid } = validateGetTransactionInput(req.query);
  if (!isValid) {
    logger.warn("Invalid inputs", errors);
    return res.status(400).json({ error: errors, success: false });
  }
  try {
    const user = await knex("transactions")
      .where({ from: req.query.public_address })
      .orWhere({ to: req.query.public_address });
    res.json({ data: user, success: true });
  } catch (error) {
    logger.error("unable to give out transaction details", error);
    res.status(500).json({ error: error, success: false });
  }
});

router.post("/", async (req, res) => {
  const { errors, isValid } = validatePostTransactionInput(req.body);
  if (!isValid) {
    logger.warn("Invalid inputs", errors);
    return res.status(400).json({ error: errors, success: false });
  }
  try {
    const result = await knex("transactions").where({ network: req.body.network, transaction_hash: req.body.transaction_hash });
    if (result.length === 0) {
      await knex("transactions").insert({
        created_at: req.body.created_at,
        from: req.body.from,
        to: req.body.to,
        total_amount: req.body.total_amount,
        currency_amount: req.body.currency_amount,
        selected_currency: req.body.selected_currency,
        status: req.body.status,
        network: req.body.network,
        transaction_hash: req.body.transaction_hash
      });
      res.status(201).json({ success: true });
    } else {
      logger.warn("Already exists");
      return res.status(409).json({ error: "transaction already exists", success: false });
    }
  } catch (error) {
    logger.error("unable to insert transaction", error);
    res.status(500).json({ error: error, success: false });
  }
});

router.put("/", async (req, res) => {
  const { errors, isValid } = validatePutTransactionInput(req.body);
  if (!isValid) {
    logger.warn("Invalid inputs", errors);
    return res.status(400).json({ error: errors, success: false });
  }
  try {
    const result = await knex("transactions").where({ id: req.body.id });
    if (result.length > 0) {
      await knex("transactions")
        .where({ id: req.body.id })
        .update({
          created_at: req.body.created_at,
          from: req.body.from,
          to: req.body.to,
          total_amount: req.body.total_amount,
          currency_amount: req.body.currency_amount,
          selected_currency: req.body.selected_currency,
          status: req.body.status,
          network: req.body.network,
          transaction_hash: req.body.transaction_hash
        });
      res.status(201).json({ success: true });
    } else {
      logger.warn("Invalid id");
      return res.status(403).json({ error: "id doesn't exist", success: false });
    }
  } catch (error) {
    logger.error("unable to insert transaction", error);
    res.status(500).json({ error: error, success: false });
  }
});

router.patch("/", async (req, res) => {
  const { errors, isValid } = validatePatchTransactionInput(req.body);
  if (!isValid) {
    logger.warn("Invalid inputs", errors);
    return res.status(400).json({ error: errors, success: false });
  }
  try {
    const objectId = await knex("transactions").where({ id: req.body.id });
    if (objectId.length > 0) {
      await knex("transactions")
        .where({ id: req.body.id })
        .update({
          status: req.body.status
        });
      res.status(201).json({ success: true });
    } else {
      logger.warn("Invalid id");
      return res.status(403).json({ error: "id doesn't exist", success: false });
    }
  } catch (error) {
    logger.error("unable to patch transaction", error);
    res.status(500).json({ error: error, success: false });
  }
});

module.exports = router;

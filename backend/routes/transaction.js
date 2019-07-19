const express = require("express");
const router = express.Router();
const knex = require("../database");
const createLogger = require("logging").default;

const logger = createLogger("transaction.js");

const validatePostTransactionInput = require("../validations/postTransactionInput");
const validatePatchTransactionInput = require("../validations/patchTransactionInput");
const validatePutTransactionInput = require("../validations/putTransactionInput");

router.get("/", async (req, res) => {
  try {
    const { public_address } = req;
    const user = await knex("transactions")
      .where({ from: public_address })
      .orWhere({ to: public_address });
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
    const {
      network,
      created_at,
      from: fromAddress,
      to,
      total_amount,
      currency_amount,
      selected_currency,
      status,
      transaction_hash
    } = req.body || {};
    const result = await knex("transactions").where({ network: network, transaction_hash: transaction_hash });
    if (result.length === 0) {
      await knex("transactions").insert({
        created_at: created_at,
        from: fromAddress,
        to: to,
        total_amount: total_amount,
        currency_amount: currency_amount,
        selected_currency: selected_currency,
        status: status,
        network: network,
        transaction_hash: transaction_hash
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
    const {
      id,
      created_at,
      from: fromAddress,
      to,
      total_amount,
      currency_amount,
      selected_currency,
      status,
      network,
      transaction_hash
    } = req.body || {};
    const result = await knex("transactions").where({ id: id });
    if (result.length > 0) {
      await knex("transactions")
        .where({ id: id })
        .update({
          created_at: created_at,
          from: fromAddress,
          to: to,
          total_amount: total_amount,
          currency_amount: currency_amount,
          selected_currency: selected_currency,
          status: status,
          network: network,
          transaction_hash: transaction_hash
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
    const { id, status } = req.body || {};
    const objectId = await knex("transactions").where({ id: id });
    if (objectId.length > 0) {
      await knex("transactions")
        .where({ id: id })
        .update({
          status: status
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

const express = require("express");
const router = express.Router();
const defaultRoute = require("./default");
const tokenBalancesRoute = require("./tokenbalances");
const userRoute = require('./user');
const transactionRoute = require('./transaction');

router.use("/", defaultRoute);
router.use("/tokenbalances", tokenBalancesRoute);
router.use("/user", userRoute);
router.use("/transaction", transactionRoute);

module.exports = router;

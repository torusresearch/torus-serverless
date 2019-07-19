const express = require("express");
const router = express.Router();
const defaultRoute = require("./default");
const tokenBalancesRoute = require("./tokenbalances");
const userRoute = require('./user');
const transactionRoute = require('./transaction');
const authRoute = require('./auth');

router.use("/", defaultRoute);
router.use("/tokenbalances", tokenBalancesRoute);
router.use("/user", userRoute);
router.use("/transaction", transactionRoute);
router.use("/auth", authRoute);

module.exports = router;

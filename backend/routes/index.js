const express = require("express");
const router = express.Router();
const defaultRoute = require("./default");
const tokenBalancesRoute = require("./tokenbalances");
const userRoute = require("./user");
const transactionRoute = require("./transaction");
const authRoute = require("./auth");
const { authMiddleware } = require("../middleware");

router.use("/", defaultRoute);
router.use("/tokenbalances", authMiddleware, tokenBalancesRoute);
router.use("/user", authMiddleware, userRoute);
router.use("/transaction", authMiddleware, transactionRoute);
router.use("/auth", authRoute);

module.exports = router;

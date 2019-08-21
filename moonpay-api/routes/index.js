/**
 * Parent file for express router
 * @author Shubham Rathi
 * @module ParentRouter
 */

/**
 * express module
 * @const
 * @ignore
 */
const express = require('express')
const router = express.Router()
const defaultRoute = require('./default')
const transactionRoute = require('./transaction')
router.use('/', defaultRoute)
router.use('/transaction', transactionRoute);
module.exports = router

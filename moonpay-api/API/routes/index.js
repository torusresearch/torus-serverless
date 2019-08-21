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
router.use('/', defaultRoute)
module.exports = router

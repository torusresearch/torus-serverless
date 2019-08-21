/**
 * Express Router for moonpay transactions
 * @author Shubham
 * @module Transactions
 */

/**
 * express module
 * @const
 * @ignore
 */

const express = require('express')

/**
 * Express router to mount user related functions on.
 * @type {object}
 * @const
 */
const router = express.Router()
const log = require("loglevel")

/** 
* Creates a new transaction: Router validates the passed tx body and pushes it to the database table.
* @name /transaction POST
* @function
* @param {string} path relative express path
* @param {callback} middleware express middleware
* @returns {Boolean} Reponse from adding a transaction
*
* @example
* const body = { *** Tx details *** }
* fetch('/transaction', {method: POST}).send(body)
* //{success: true}
*/
router.post("/", async (req, res) => {
  log.info(req);
});


/**
 * Returns a welcome string
 * @name / GET
 * @function
 * @param {string} path relative express path
 * @param {callback} middleware express middleware
 * @returns {String} welcome strign
 * @example
 * // Set auth headers
 * fetch("/")
 * -> "Welcome to Torus moonpay-apis /transaction"
 */
router.get('/', (req, res) => {
  res.send('Welcome to Torus moonpay-apis /transaction')
})

module.exports = router;

/**
 * @fileOverview Run an express server on 2040
 * @author Shubham rathi
 * @requires NPM:express,helmet,compression,cors,morgan
 */
const express = require('express')
const bodyParser = require('body-parser')
const helmet = require('helmet')
const compression = require('compression')
const cors = require('cors')
const morgan = require('morgan')
const log = require('loglevel')
const dbConfig = require('./database')
const mongoose = require('mongoose')
//const connectDB = require('./helpers/mongoUtil')

// Setup environment
require('dotenv').config()

// setup loglevel 
// Loglevel init
const buildEnv = process.env.NODE_ENV
let logLevel
switch (buildEnv) {
  case 'staging':
    logLevel = 'info'
    log.setDefaultLevel(logLevel)
    break
  case 'testing':
    logLevel = 'debug'
    log.setDefaultLevel(logLevel)
    break
  case 'development':
    logLevel = 'debug'
    log.setDefaultLevel(logLevel)
    break
  default:
    logLevel = 'error'
    log.setDefaultLevel(logLevel)
    log.disableAll()
    break
}
log.info('NODE_ENV', process.env.NODE_ENV)

// setup app
const app = express()

// setup middleware
const corsOptions = {
  //   origin: ["https://localhost:3000", /\.tor\.us$/],
  origin: '*',
  credentials: false
}

if (process.env.NODE_ENV === 'development') app.use(morgan('tiny')) // HTTP logging
app.use(cors(corsOptions)) // middleware to enables cors
app.use(helmet()) // middleware which adds http headers
app.use(compression()) // middleware which uses gzip compression on responses
app.use(bodyParser.urlencoded({ extended: false })) // middleware which parses body
app.use(bodyParser.json()) // converts body to json

// bring all routes here
const routes = require('./routes')
app.use('/', routes)

//Initialise mongoose connection
//url = process.env.DATA_MONGODB_HOST
url = "mongodb://" + dbConfig.connection.host + ":" + dbConfig.connection.port + "/" + dbConfig.connection.database
mongoose
  .connect(url, { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false, reconnectTries: Number.MAX_VALUE, reconnectInterval: 500 })
  .then(() => log.info("mongo db connection - success"))
  .catch(err => log.error(err, "mongoose connection failed"));

const port = process.env.PORT || 2040
app.listen(port, () => console.log(`Server running on port: ${port}`))

module.exports = app // For testing

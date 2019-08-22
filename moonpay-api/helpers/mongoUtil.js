// const MongoClient = require('mongodb').MongoClient
// const mongoose = require("mongoose")
const dbConfig = require('../database')
const mongoose = require("mongoose")
const dbPath = "mongodb://" + dbConfig.connection.host + ":" + dbConfig.connection.port + "/" + dbConfig.connection.database
mongoose.connect(dbPath, {
  useNewUrlParser: true,
})
const db = mongoose.connection
db.on("error", () => {
  console.log("> error occurred from the database")
})
db.once("open", () => {
  console.log("> successfully opened the database")
})
module.exports = mongoose



// const url = "mongodb://" + dbConfig.connection.host + ":" + dbConfig.connection.port + "/" + dbConfig.connection.database

// let _db

// async function connectDB() {
//     try {
//       _db = await mongoose
//          .connect(url, { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false, reconnectTries: Number.MAX_VALUE, reconnectInterval: 500 })
      
//     } catch (e) {
//         throw e
//     }
// }

// function getDB () { return _db }

// function disconnectDB () { _db.close() }

// module.exports.connectDB = connectDB;
// module.exports.getDB = getDB;
// module.exports.disconnectDB = disconnectDB;


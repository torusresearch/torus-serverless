const createLogger = require("logging").default;

const logger = createLogger("authentication - middleware.js");

const pify = require("pify");
let jwt = require("jsonwebtoken");
jwt = pify(jwt);

const fs = require("fs");
const path = require("path");
const jwtPublicKey = fs.readFileSync(path.resolve(__dirname, "../keys/jwtRS256.key.pub"));

async function auth(req, res, next) {
  try {
    const header = req.headers["authorization"];
    if (header) {
      const bearer = header.split(" ");
      const token = bearer[1];
      const decoded = await jwt.verify(token, jwtPublicKey, { ignoreExpiration: false, algorithm: "RS256" });
      req.public_address = decoded.public_address;
      next();
    } else {
      logger.warn("Failed to authenticate", error);
      res.status(401).json({ error: "Missing authorization header", success: false });
    }
  } catch (error) {
    logger.warn("Failed to authenticate", error);
    res.status(401).json({ error: "Failed to authenticate token", success: false });
  }
}

module.exports = auth;

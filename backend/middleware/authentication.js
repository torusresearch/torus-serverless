const express = require("express");
const router = express.Router();

function auth(req, res, next) {
    jwt.verify(req.body.token, "i am another string", function(err, decoded) {
      if (err) { res.send(500, { error: "Failed to authenticate token."}); }
      else {
        req.user = decoded.user;
        next();
      };
    });
}

module.exports = router;
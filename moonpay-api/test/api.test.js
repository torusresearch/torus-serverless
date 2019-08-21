/**
 * @fileOverview Unit test file for API-calls
 * @module
 * @author Shubham Rathi
 * @requires NPM:chai
 * @requires NPM:chai-http
 */

// During the test the env variable is set to test
// Require the dev-dependencies
const chai = require("chai");
const chaiHttp = require("chai-http");
const server = "http://localhost:2040";
const axios = require("axios");
// eslint-disable-next-line no-unused-vars
const should = chai.should();

// log.debug('set DEBUG=none');

// Comment in/out the following line to include/disclude comments in terminal
if (process.env.LOG_DEBUG === "no") {
  console.log = function() {};
}

var passtoken = "";

chai.use(chaiHttp);

/**
 * Testing API calls.
 */
describe("API-calls", () => {
  /*
   * Test the /GET route
   */
  describe("/Homepage", () => {
    it("it should return a welcome message", done => {
      chai
        .request(server)
        .get("/")
        .end((err, res) => {
          if (err) done(err);
          console.log("res.text is", res.text);
          res.should.have.status(200);
          res.text.should.be.eql("Welcome to Torus moonpay-apis");
          done();
        });
    });
  });

  after(() => {
    console.log("After block called after conducting all the unit tests");
    // done();
  });

  /*
   * Test the /POST route
   */
});

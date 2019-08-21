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

  describe("/transactions", () => {
    const body = {
      "id": "354b1f46-480c-4307-9896-f4c81c1e1e17",
      "createdAt": "2018-08-27T19:40:43.748Z",
      "updatedAt": "2018-08-27T19:40:43.804Z",
      "baseCurrencyAmount": 50,
      "quoteCurrencyAmount": 0.12255,
      "feeAmount": 4.99,
      "extraFeeAmount": 2.5,
      "areFeesIncluded": false,
      "status": "completed",
      "failureReason": null,
      "walletAddress": "0x9c76ae45c36a4da3801a5ba387bbfa3c073ecae2",
      "walletAddressTag": null,
      "cryptoTransactionId": "0x548b15d1673d4a8c9ab93a48bc8b42e223c5f7776cea6044b91d0f3fe79b0bd6",
      "returnUrl": "https://buy.moonpay.io",
      "redirectUrl": null,
      "baseCurrencyId": "71435a8d-211c-4664-a59e-2a5361a6c5a7",
      "currencyId": "e1c58187-7486-4291-a95e-0a8a1e8ef51d",
      "customerId": "7138fb07-7c66-4f9a-a83a-a106e66bfde6",
      "cardId": "68e46314-93e5-4420-ac10-485aef4e19d0",
      "eurRate": 1,
      "usdRate": 1.11336,
      "gbpRate": 0.86044
    }

    it('it should post a transaction', done => {
      chai
      .request(server)
      .post("/transaction")
      .send(body)
      .end((err, res) => {
        if(err) console.log(err)
        res.should.have.status(201);
        done();
      })
    })


  })
  after(() => {
    console.log("After block called after conducting all the unit tests");
    // done();
  });

  /*
   * Test the /POST route
   */
});

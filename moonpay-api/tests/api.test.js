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

// Helper Funtions
const hashFunction = require("../helpers/hashMessage").hashMessage;
const signMessage = require("../helpers/hashMessage").signMessage;

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
  /**
   * DO NOT USE THIS PAIR ELSE WHERE. THIS IS STRICTLY FOR TESTING PURPOSES.
   */
  const publicAddress = "0xd682b1Db49c010BF03BafC4Cf7CC366D9b8A4a03";
  const privateAddress = "9bc166bda58a5e189bf24f4faa1296c5fcf9b818ed23492d5a7239ce102e9301";

  /**
   * before() block is called before all the other tests are conducted
   * we are using this to generate a authentication token
   */
  before("One time execution for all tests", done => {
    const body = {
      public_address: publicAddress
    };
    axios
      .post(server + "/auth/message", body)
      .then(function(res) {
        // console.log(res.data);
        return res.data.message;
      })
      .then(message => {
        // console.log(message);
        const hashedMessage = hashFunction(message);
        // console.log("hashedMessage is", hashedMessage);
        const signed = signMessage(privateAddress, hashedMessage);
        // console.log("signedMessage is", signed);

        const tokenBody = {
          public_address: publicAddress,
          signed_message: signed
        };
        return tokenBody;
      })
      .then(tokenBody => {
        // console.log(tokenBody);
        return axios.post(server + "/auth/verify", tokenBody);
      })
      .then(res => {
        console.log(res.data.token);
        passtoken = res.data.token;
        done();
      })
      .catch(err => {
        done(err);
      });
  });

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
          res.text.should.be.eql("Welcome to Torus backend");
          done();
        });
    });
  });

  /**
   * Test token balances API
   *
   */
  describe("/tokenbalances", () => {
    // console.log("token is ", passtoken);
    it("it should return the token balance", done => {
      chai
        .request(server)
        .get("/tokenbalances")
        .set("authorization", "Bearer " + passtoken)
        .end((err, res) => {
          if (err) done(err);
          res.should.have.status(200);
          res.body.success.should.be.eql(true);
          res.body.should.have.property("data");
          res.body.data.should.be.a("array");
          console.log(res.body);
          done();
        });
    }).timeout(5000);
  });

  /**
   * Test user APIs
   */
  describe("/user ", () => {
    // console.log("token is ", passtoken);
    it("it should create a user", done => {
      const postBody = {
        default_currency: "EUR"
      };
      chai
        .request(server)
        .post("/user")
        .set("authorization", "Bearer " + passtoken)
        .send(postBody)
        .end((err, res) => {
          if (err) done(err);
          res.should.have.status(201);
          res.body.success.should.be.eql(true);
          console.log(res.body);
          done();
        });
    });

    it("it should record user login", done => {
      const postBody = {
        hostname: "etheremon",
        created_at: new Date()
      };
      chai
        .request(server)
        .post("/user/recordLogin")
        .set("authorization", "Bearer " + passtoken)
        .send(postBody)
        .end((err, res) => {
          if (err) done(err);
          res.should.have.status(201);
          res.body.success.should.be.eql(true);
          console.log(res.body);
          done();
        });
    });

    it("it should return the user details", done => {
      chai
        .request(server)
        .get("/user")
        .set("authorization", "Bearer " + passtoken)
        .end((err, res) => {
          if (err) done(err);
          console.log(res.body);
          res.body.success.should.be.eql(true);
          res.should.have.status(200);
          done();
        });
    });

    it("it should patch the users default currency to EUR", done => {
      const postBody = {
        default_currency: "USD"
      };
      chai
        .request(server)
        .patch("/user")
        .set("authorization", "Bearer " + passtoken)
        .send(postBody)
        .end((err, res) => {
          if (err) done(err);
          console.log(res.body);
          res.body.success.should.be.eql(true);
          res.should.have.status(201);
          done();
        });
    });
  });

  /**
   * Test transactions API
   */
  describe("/transaction", () => {
    const txBlock = {
      created_at: new Date(),
      currency_amount: "2.1866682600000003",
      from: publicAddress,
      network: "rinkeby",
      selected_currency: "USD",
      status: "SENT_TO_SIMPLEX",
      to: "0x816891b1D4c688E2a1D2EE02dE1623098eA67A1E",
      total_amount: "0.01042",
      transaction_hash: "0xd8fa99c536e7e9da618c39c54fd31b7f155fb45b2d4f27c8e3322ed3954bc3dd"
    };

    let txId;

    it("it should create a transaction", done => {
      chai
        .request(server)
        .post("/transaction")
        .send(txBlock)
        .set("authorization", "Bearer " + passtoken)
        .end((err, res) => {
          if (err) done(err);
          console.log(res.body);

          res.should.have.status(201);
          res.body.success.should.be.eql(true);
          done();
        });
    });

    it("it should return all transactions", done => {
      chai
        .request(server)
        .get("/transaction")
        .set("authorization", "Bearer " + passtoken)
        .end((err, res) => {
          if (err) done(err);
          res.should.have.status(200);
          res.body.success.should.be.eql(true);
          res.body.should.have.property("data");
          res.body.data.should.be.a("array");

          res.body.data[0].should.have.property("created_at");
          res.body.data[0].should.have.property("currency_amount");
          res.body.data[0].should.have.property("from");
          res.body.data[0].should.have.property("network");
          res.body.data[0].should.have.property("selected_currency");
          res.body.data[0].should.have.property("status");
          res.body.data[0].should.have.property("to");
          res.body.data[0].should.have.property("total_amount");
          res.body.data[0].should.have.property("transaction_hash");

          res.body.data[0].from.should.be.eql(publicAddress);
          txId = res.body.data[0].id;
          console.log(res.body);
          done();
        });
    });

    it("it should not post the same tx again", done => {
      chai
        .request(server)
        .post("/transaction")
        .send(txBlock)
        .set("authorization", "Bearer " + passtoken)
        .end((err, res) => {
          if (err) done(err);
          console.log(res.body);
          res.should.have.status(409);
          res.body.success.should.be.eql(false);
          done();
        });
    });

    it("it should replace the tx with body passed (date updated)", done => {
      const body = txBlock;
      body.id = txId;
      body.created_at = new Date();

      chai
        .request(server)
        .put("/transaction")
        .send(body)
        .set("authorization", "Bearer " + passtoken)
        .end((err, res) => {
          if (err) done(err);
          console.log(res.body);
          res.should.have.status(201);
          res.body.success.should.be.eql(true);
          done();
        });
    });

    it('it should update the status of the tx to "submitted"', done => {
      const body = txBlock;
      body.status = "confirmed";

      chai
        .request(server)
        .patch("/transaction")
        .send(body)
        .set("authorization", "Bearer " + passtoken)
        .end((err, res) => {
          if (err) done(err);
          console.log(res.body);
          res.should.have.status(201);
          res.body.success.should.be.eql(true);
          done();
        });
    });

    it("it should not allow to post txs from another address", done => {
      const body = txBlock;
      body.from = "0x816891b1D4c688E2a1D2EE02dE1623098eA67A1E";

      chai
        .request(server)
        .post("/transaction")
        .send(txBlock)
        .set("authorization", "Bearer " + passtoken)
        .end((err, res) => {
          if (err) done(err);
          console.log(res.body);
          res.should.have.status(403);
          res.body.success.should.be.eql(false);
          done();
        });
    });
  });

  describe("*** Rollback DB ***", () => {
    it("it should delete the previously added user", done => {
      // Using knex to delete because no delete API for user
      chai
        .request(server)
        .delete("/user")
        .set("authorization", "Bearer " + passtoken)
        .end((err, res) => {
          if (err) done(err);
          console.log(res.body);
          res.should.have.status(201);
          res.body.success.should.be.eql(true);
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

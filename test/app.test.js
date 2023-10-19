var flow = require("chai");
var chaiHttp = require("chai-http");
let app = require("../server");
flow.use(chaiHttp);
var expect = flow.expect;

describe("Account", () => {
  it("test1", (done) => { // added done callback here
    flow
      .request(app)
      .get("/healthz")
      .end(function (err, res) {
        try { // Using try-catch to handle assertion errors
          expect(err).to.be.null;
          expect(res).to.have.status(200);
          done(); // Indicate the end of the test
        } catch (error) {
          done(error); // Pass the assertion error to done
        }
      });
  });
});

//health.test.js

const request = require('supertest');
const app = require('../server'); // Assuming your Express app is in app.js

describe('Health Endpoint', () => {
  it('should respond with status ok', async () => {
    const response = await request(app).get('/v1/assignments');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
  });
});




// var flow = require("chai");
// chaiHttp = require("chai-http");
// let app = require("../server")

// flow.use(chaiHttp);

// var expect = flow.expect;

// describe("Account", () => {
//   it("test1", () => {
//     flow
//       .request(app)
//       .get("/healthz")
//       .end(function (err, res) {
//         expect(err).to.be.null;
//         expect(res).to.have.status(200);
//       });
//   });
// });



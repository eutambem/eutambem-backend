const supertest = require('supertest');
const app = require('../../app');
const request = supertest(app);
const expect = require('chai').expect;

describe("Routes: Index", () => {
    describe("GET /", () => {
      it("returns the API status", done => {
        request.get("/health-check")
          .expect(200)
          .end((err, res) => {
            const expected = {status: 'It\'s alive'};
            expect(res.body).to.eql(expected);
            done(err);
          });
      });
    });
  });
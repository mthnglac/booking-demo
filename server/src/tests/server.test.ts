import { app } from "../app";
import { connect, close, clear } from "./db";
import supertest from "supertest";
import { photographerService } from "../services/photographer";

const agent = supertest.agent(app);

beforeAll(async () => await connect());
beforeEach(async () => await clear());
afterAll(async () => await close());

describe("testing", () => {
  test("GET /photographers", (done) => {
    agent
      .post("/photographers")
      .send({
        name: "Otto Crawford",
        availabilities: [
          {
            starts: "2020-11-25T08:00:00.000Z",
            ends: "2020-11-25T16:00:00.000Z",
          },
        ],
        bookings: [
          {
            starts: "2020-11-25T08:30:00.000Z",
            ends: "2020-11-25T09:30:00.000Z",
          },
        ],
      })
      .expect(201)
      .then((res) => {
        expect(res.body._id).toBeTruthy();
        done();
      });
  });
});

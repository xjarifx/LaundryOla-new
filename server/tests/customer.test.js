const request = require("supertest");
const app = require("../src/config/app");

describe("Customer API", () => {
  it("should register a new customer", async () => {
    const res = await request(app)
      .post("/api/customers/register")
      .send({
        name: "Test User",
        phone: "1234567890",
        address: "Test Address",
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });
});

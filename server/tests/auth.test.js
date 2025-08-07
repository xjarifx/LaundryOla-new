const request = require("supertest");
const app = require("../src/config/app");

describe("Authentication API", () => {
  it("should register a new customer", async () => {
    const res = await request(app).post("/api/auth/customers/register").send({
      name: "Test User",
      phone: "1234567890",
      email: "testuser@example.com",
      password: "TestPass123!",
      address: "Test Address",
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("should login a customer", async () => {
    const res = await request(app).post("/api/auth/customers/login").send({
      email: "testuser@example.com",
      password: "TestPass123!",
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeDefined();
  });
});

const request = require("supertest");
const { query } = require("../db-connection");
const app = require("../src/app");

const newUser = {
  firstname: "firstname",
  lastname: "lastname",
  email: "emailfake@hotmail.fr",
  password: "password",
  role: "user",
};

const updatedUser = {
  firstname: "newfirstname",
  lastname: "newlastname",
  password: "newpassword",
  role: "admin",
};

describe("app", () => {
  beforeAll(async () => {
    let sql = "SET FOREIGN_KEY_CHECKS=0";
    await query(sql);
    sql = "TRUNCATE TABLE users";
    await query(sql);
    sql = "SET FOREIGN_KEY_CHECKS=1";
    await query(sql);
  });

  it("GETs /api/users/ and should obtain []", async () => {
    expect.assertions(1);
    const res = await request(app).get("/api/users/").expect(200);
    expect(res.body.length).toEqual(0);
  });

  it("POSTs /api/users/ and should obtain 201", async () => {
    expect.assertions(1);
    const res = await request(app)
      .post("/api/users/")
      .send(newUser)
      .expect(201);
    expect(res.body.firstname).toEqual(newUser.firstname);
  });
  it("GETs /api/users/1 and should obtain 200", async () => {
    expect.assertions(1);
    const res = await request(app).get("/api/users/1").expect(200);
    expect(res.body.lastname).toEqual("lastname");
  });
  it("PUTs /api/users/1 and should obtain 200", async () => {
    expect.assertions(1);
    const res = await request(app)
      .put("/api/users/1")
      .send(updatedUser)
      .expect(200);
    expect(res.body.lastname).toEqual("newlastname");
  });
  it("DELETEs /api/users/1 and should obtain 200", async () => {
    expect.assertions(1);
    const res = await request(app).delete("/api/users/1").expect(200);
    expect(res.status).toEqual(200);
  });
});

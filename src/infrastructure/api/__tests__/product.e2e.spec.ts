import { app, sequelize } from "../express";
import request from "supertest";

describe("E2E test for product", () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("should create a product", async () => {
    const response = await request(app)
      .post("/product")
      .send({
        name: "Product",
        price: 10.1
      });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe("Product");
    expect(response.body.price).toBe(10.1);
  });

  it("should not create a product", async () => {
    const response = await request(app).post("/product").send({
      name: "Product",
    });
    expect(response.status).toBe(500);
  });

  it("should list all product", async () => {
    const response1 = await request(app)
      .post("/product")
      .send({
        name: "Product 1",
        price: 10.1
      });
    expect(response1.status).toBe(200);
    const response2 = await request(app)
      .post("/product")
      .send({
        name: "Product 2",
        price: 20.2
      });
    expect(response2.status).toBe(200);

    const response = await request(app).get("/product");
    expect(response.status).toBe(200);
    expect(response.body.products.length).toBe(2);
    const product1 = response.body.products[0];
    expect(product1.name).toBe("Product 1");
    expect(product1.price).toBe(10.1);
    const product2 = response.body.products[1];
    expect(product2.name).toBe("Product 2");
    expect(product2.price).toBe(20.2);
  });
});

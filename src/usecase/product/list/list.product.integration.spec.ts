import { Sequelize } from "sequelize-typescript";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import Product from "../../../domain/product/entity/product";
import ListProductUseCase from "./list.customer.usecase";
import ProductFactory from "../../../domain/product/factory/product.factory";

describe("Integration Test find product use case", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true }
    });

    sequelize.addModels([ProductModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should find a product", async () => {
    const productRepository = new ProductRepository();
    const usecase = new ListProductUseCase(productRepository);

    const productA = ProductFactory.create("a", "Product A", 100);
    const productB = ProductFactory.create("b", "Product B", 200);

    await productRepository.create(productA);
    await productRepository.create(productB);

    const result = await usecase.execute({});

    expect(result.products.length).toBe(2);
    expect(result.products[0].id).toEqual(expect.any(String));
    expect(result.products[0].name).toBe(productA.name);
    expect(result.products[0].price).toBe(productA.price);
    expect(result.products[1].id).toEqual(expect.any(String));
    expect(result.products[1].name).toBe(productB.name);
    expect(result.products[1].price).toBe(productB.price);
  });
});

import { Sequelize } from "sequelize-typescript";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import ProductFactory from "../../../domain/product/factory/product.factory";
import UpdateProductUseCase from "./update.product.usecase";

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
    const usecase = new UpdateProductUseCase(productRepository);

    const product = ProductFactory.create("a", "Product", 100);

    await productRepository.create(product);

    const input = {
      id: product.id,
      name: "Product Update",
      price: 110.5
    }

    const result = await usecase.execute(input);

    const output = {
      id: product.id,
      name: "Product Update",
      price: 110.5
    }

    expect(result.id).toEqual(output.id);
    expect(result.name).toBe(output.name);
    expect(result.price).toBe(output.price);
  });
});

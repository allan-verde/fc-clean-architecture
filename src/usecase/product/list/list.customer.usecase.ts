import ProductInterface from "../../../domain/product/entity/product.interface";
import ProductRepositoryInterface from "../../../domain/product/repository/product-repository.interface";
import { InputListProductDto, OutputListProductDto } from "./list.product.dtc";

export default class ListProductUseCase {
  private customerRepository: ProductRepositoryInterface;

  constructor(CustomerRepository: ProductRepositoryInterface) {
    this.customerRepository = CustomerRepository;
  }

  async execute(_: InputListProductDto): Promise<OutputListProductDto> {
    const customers = await this.customerRepository.findAll();
    return OutputMapper.toOutput(customers);
  }
}

class OutputMapper {
  static toOutput(products: ProductInterface[]): OutputListProductDto {
    return {
      products: products.map((product) => ({
        id: product.id,
        name: product.name,
        price: product.price
      }))
    }
  }
}

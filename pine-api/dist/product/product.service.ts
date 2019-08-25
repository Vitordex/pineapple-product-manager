import { Product } from "./product.model";

export interface IProduct {
    id: number,
    name: string,
    description: string,
    rate: number,
    imagePath: string
}

export class ProductService {
    constructor(private Model: typeof Product) {}

    public async listProducts(): Promise<Array<IProduct>> {
        const products = await this.Model.findAll();

        return products.map((product) => product.toObject() as IProduct);
    }

    public async getProductById(id: number): Promise<IProduct | null> {
        let product = await this.Model.findByPk(id);

        return !product ? null : product.toObject() as IProduct;
    }

    public async remove(productId: number): Promise<void> {
        const product = await this.Model.findByPk(productId);

        if(!product) return Promise.resolve();

        return product.destroy();
    }

    public createProduct(productValues: IProduct): Product {
        const product = this.Model.build(productValues);

        return product;
    }

    public async updateProduct(original: IProduct, values: IProduct): Promise<Product | null> {
        const product = await this.Model.findByPk(original.id);

        if(!product) return Promise.resolve(null);

        const keys: Array<string> = Object.keys(original);
        keys.forEach((key) => {
            const newValue = (values as any)[key];
            if(!!newValue && (product as any)[key] != newValue)
                (product as any)[key] = (values as any)[key];
        });

        return product.save();
    }
}

import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { TokenService } from '../services/token.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ProductsPageComponent } from '../products-page/products-page.component';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  constructor(
    private productService: ProductService,
    private tokenService: TokenService,
    private toastr: ToastrService,
    private router: Router
  ) {
    ProductListComponent.instance = this;
  }

  public static instance: ProductListComponent;
  private products: Array<IProduct> = [];

  async ngOnInit() {
    await this.refreshProducts();
  }

  public async delete(id: number) {
    const token = this.tokenService.getToken();
    try {
      await this.productService.delete(id, token);
      await this.refreshProducts();
    } catch (error) {
      const status: number = error.status;

      switch (status) {
        case 401:
          this.resetAuth();
          return;
          break;
        default:
          this.toastr.error('Houve um erro ao deletar o produto', 'Erro');
          break;
      }
    }
  }

  public async refreshProducts() {
    const token = this.tokenService.getToken();
    try {
      const response = await this.productService.list(token);
      this.products = (response as Array<IProduct>).sort((a, b) => a.id >= b.id ? 1 : -1);
    } catch (error) {
      const status: number = error.status;

      switch (status) {
        case 401:
          this.resetAuth();
          return;
        default:
          this.toastr.error('Houve um erro ao carregar os produtos', 'Erro');
          break;
      }
    }
  }

  public getProduct(selector: number | string): IProduct {
    if (typeof(selector) === 'number') {
      return this.products.find((product) => product.id === selector);
    } else {
      return this.products.find((product) => product.name === selector);
    }
  }

  public resetAuth() {
    this.tokenService.removeToken();
    this.router.navigate(['auth']);
  }

  public showProduct(product: IProduct) {
    ProductsPageComponent.instance.openProductPanel(product);
  }
}

export interface IProduct {
  id: number;
  name: string;
  description: string;
  rate: number;
  imagePath: string;
  createdAt: Date;
  updatedAt: Date;
}

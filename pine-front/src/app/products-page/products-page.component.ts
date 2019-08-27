import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { IProduct } from '../product-list/product-list.component';
import { ProductComponent } from '../product/product.component';

@Component({
  selector: 'app-products-page',
  templateUrl: './products-page.component.html',
  styleUrls: ['./products-page.component.css']
})
export class ProductsPageComponent implements OnInit {
  public static instance: ProductsPageComponent;

  constructor() {
    ProductsPageComponent.instance = this;
  }

  public async openProductPanel(product: IProduct) {
    while (!ProductComponent.instance) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    ProductComponent.instance.viewProduct({...product});
  }

  public logout() {
    ProductComponent.instance.resetAuth();
  }

  ngOnInit() {
  }
}

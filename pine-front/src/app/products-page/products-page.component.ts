import { Component, OnInit } from '@angular/core';
import { IProduct } from '../product-list/product-list.component';

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

  private showProduct: boolean = true;

  public openProductPanel(product: IProduct) {
    this.showProduct = true;
  }

  ngOnInit() {
  }
}

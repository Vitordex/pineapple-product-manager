import { Component, OnInit } from '@angular/core';
import { IProduct, ProductListComponent } from '../product-list/product-list.component';
import { ProductService } from '../services/product.service';
import { TokenService } from '../services/token.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {

  constructor(
    private productService: ProductService,
    private tokenService: TokenService,
    private toastr: ToastrService,
    private router: Router,
    private formBuilder: FormBuilder) {
      ProductComponent.instance = this;
    }

  public static instance: ProductComponent;
  private Arr = Array;
  private product: IProduct = {
    imagePath: '/default.jpg',
    id: 0,
    name: '',
    description: '',
    createdAt: new Date(),
    updatedAt: new Date(),
    rate: 0
  };

  private uploadForm: FormGroup;

  ngOnInit() {
    this.uploadForm = this.formBuilder.group({
      image: [''],
      name: '',
      description: ''
    });
  }

  onFileSelect(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.uploadForm.get('image').setValue(file);
    }
  }

  public viewProduct(viewProduct: IProduct) {
    setTimeout(() => {
      this.product = viewProduct;
    }, 200);
  }

  async addOrUpdateProduct() {
    const formData = new FormData();
    formData.append('thumb', this.uploadForm.get('image').value);
    formData.append('name', this.uploadForm.get('name').value);
    formData.append('description', this.uploadForm.get('description').value);

    if (this.product.id <= 0) {
      await this.addProduct(formData);
    } else {
      await this.updateProduct(formData);
    }

    await ProductListComponent.instance.refreshProducts();
    this.product = ProductListComponent.instance.getProduct(this.product.id || this.product.name);
  }

  async addProduct(formData: FormData) {
    const token = this.tokenService.getToken();
    try {
      await this.productService.create(formData, token);
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

  async updateProduct(formData: FormData) {
    const token = this.tokenService.getToken();
    try {
      await this.productService.update(this.product.id, formData, token);
    } catch (error) {
      const status: number = error.status;

      switch (status) {
        case 401:
          this.resetAuth();
          return;
        case 404:
          this.toastr.error('Produto não encontrado', 'Erro');
          return;
        default:
          this.toastr.error('Houve um erro ao carregar os produtos', 'Erro');
          break;
      }
    }
  }

  public resetAuth() {
    this.tokenService.removeToken();
    this.router.navigate(['auth']);
  }
}

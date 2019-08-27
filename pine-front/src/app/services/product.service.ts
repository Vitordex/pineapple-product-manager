import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from './config.service';
import { IProduct } from '../product-list/product-list.component';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(private client: HttpClient) { }

  public list(token: string) {
    const headers = {authorization: `Bearer ${token}`};
    return this.client.get(`${ConfigService.apiEndPoint}/products/`, {headers}).toPromise();
  }

  public delete(id: number, token: string) {
    const headers = {authorization: `Bearer ${token}`};
    return this.client.delete(`${ConfigService.apiEndPoint}/products/${id}`, {headers}).toPromise();
  }

  public create(data: FormData, token: string) {
    const headers = {authorization: `Bearer ${token}`};
    return this.client.post(
      `${ConfigService.apiEndPoint}/products/`,
      data,
      {headers}
    ).toPromise();
  }

  public update(id: number, data: FormData, token: string) {
    const headers = {authorization: `Bearer ${token}`};
    return this.client.put(
      `${ConfigService.apiEndPoint}/products/${id}`,
      data,
      {headers}
    ).toPromise();
  }
}

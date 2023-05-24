import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../models/product.interface';
import { evironment } from 'src/environments/environment.development';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private backendURL = evironment.backendURL;

  constructor(private readonly httpClient: HttpClient) {}

  onModifyServer(modifiedProduct: Product) {
    console.log(modifiedProduct);
    modifiedProduct.isNovelty !== undefined ? (modifiedProduct.isNovelty = false) : null;
    return this.httpClient.put<any>(`${this.backendURL}/items/${modifiedProduct.id}`, modifiedProduct);
  }

  onAddProduct(modifiedProduct: Omit<Product, 'id'>) {
    let convertedProduct: Product = {
      ...modifiedProduct,
      id: uuidv4(),
    };
    return this.httpClient.post<any>(`${this.backendURL}/items`, convertedProduct);
  }

  onDeleteProduct(id: string) {
    return this.httpClient.delete(`${this.backendURL}/items/${id}`);
  }
}

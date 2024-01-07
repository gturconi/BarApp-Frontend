import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EntityListResponse } from '@common/models/entity.list.response';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { Products } from 'src/app/projects/menu/products/models/products';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  apiUrl: string = environment.apiUrl;
  constructor(private http: HttpClient) {}

  getProducts() {
    return this.http.get<EntityListResponse<Products>>(
      `${this.apiUrl}/products`
    );
  }

  getProductsByType(typeId: string) {
    return this.http.get<EntityListResponse<Products>>(
      `${this.apiUrl}/products/type/` + typeId
    );
  }

  getProduct(id: string) {
    return this.http.get<Products>(`${this.apiUrl}/products/` + id);
  }

  postProducts(formData: FormData) {
    return this.http.post<Products>(`${this.apiUrl}/products`, formData);
  }

  putProducts(id: string, formData: FormData) {
    return this.http.put<Products>(`${this.apiUrl}/products/` + id, formData);
  }

  deleteProducts(id: string) {
    return this.http.delete<Products>(`${this.apiUrl}/products/` + id);
  }

  updateImage(id: string, formData: FormData): Observable<Products> {
    const url = `${this.apiUrl}/products/${id}`;
    return this.http.put<Products>(url, formData);
  }
}

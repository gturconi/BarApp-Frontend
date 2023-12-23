import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { environment } from "src/environments/environment";
import { ProductsType } from "src/app/projects/menu/products-type/models/productsType";
import { EntityListResponse } from "@common/models/entity.list.response";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ProductsTypeService {
  apiUrl: string = environment.apiUrl;
  constructor(private http: HttpClient) {}

  getProductsTypes() {
    return this.http.get<EntityListResponse<ProductsType>>(
      `${this.apiUrl}/productsType`
    );
  }

  getProductsType(id: string) {
    return this.http.get<ProductsType>(`${this.apiUrl}/productsType/` + id);
  }

  postProductsTypes(productsType: ProductsType) {
    return this.http.post<ProductsType>(
      `${this.apiUrl}/productsType`,
      productsType
    );
  }

  putProductsTypes(productsType: ProductsType) {
    return this.http.put<ProductsType>(
      `${this.apiUrl}/productsType/` + productsType.idProductType,
      productsType
    );
  }

  deleteProductsTypes(productsType: ProductsType) {
    return this.http.delete<ProductsType>(
      `${this.apiUrl}/productsType/` + productsType.idProductType
    );
  }

  updateImage(id: string, formData: FormData): Observable<ProductsType> {
    const url = `${this.apiUrl}/productsType/${id}`;
    return this.http.put<ProductsType>(url, formData);
  }
}

import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { EntityListResponse } from "@common/models/entity.list.response";

import { ProductType } from "@common/models/productType";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ProductsTypeService {
  
  apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getProductsType(page: number = 1, limit: number = 10, search:string = '') {
    return this.http.get<EntityListResponse<ProductType>>(this.apiUrl + '/productsType/', 
    { params: { search, page, limit } });
  }
}

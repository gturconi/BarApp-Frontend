import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from 'src/environments/environment';

import { ProductSelled } from '../models';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) {}

  mostSelledPorducts() {
    return this.http.get<ProductSelled[]>(
      this.apiUrl + '/metric/most-selled-products'
    );
  }
}

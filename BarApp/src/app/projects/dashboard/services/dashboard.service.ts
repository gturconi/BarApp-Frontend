import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from 'src/environments/environment';

import { ProductSelled, TopCustomers, WeeklySalesHistory } from '../models';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) {}

  mostSelledProducts() {
    return this.http.get<ProductSelled[]>(
      this.apiUrl + '/metric/most-selled-products'
    );
  }

  lessSelledProducts() {
    return this.http.get<ProductSelled[]>(
      this.apiUrl + '/metric/less-selled-products'
    );
  }

  topFiveCustomers() {
    return this.http.get<TopCustomers[]>(
      this.apiUrl + '/metric/top-five-customers'
    );
  }

  weeklySalesHistory() {
    return this.http.get<WeeklySalesHistory[]>(
      this.apiUrl + '/metric/weekly-sales-history'
    );
  }
}

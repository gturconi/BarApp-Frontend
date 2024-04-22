import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EntityListResponse } from '@common/models/entity.list.response';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { OrderRequest, OrderResponse } from '../models/order';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getOrders(page?: number, limit?: number, search: string = '') {
    return this.http.get<EntityListResponse<OrderResponse>>(
      `${this.apiUrl}/orders?search=${search}&page=${page}&limit=${limit}`
    );
  }

  getUserOrders(
    id: string,
    page?: number,
    limit?: number,
    search: string = ''
  ) {
    return this.http.get<EntityListResponse<OrderResponse>>(
      `${this.apiUrl}/orders/user/${id}?search=${search}&page=${page}&limit=${limit}`
    );
  }

  getOrder(id: string) {
    return this.http.get<OrderResponse>(`${this.apiUrl}/orders/` + id);
  }

  getLastOrderFromTable(id: string) {
    return this.http.get<any>(`${this.apiUrl}/orders/tableOrder/` + id);
  }

  postOrder(order: OrderRequest) {
    return this.http.post<OrderResponse>(`${this.apiUrl}/orders`, order);
  }

  putOrder(id: string, order: OrderRequest) {
    return this.http.put<OrderResponse>(`${this.apiUrl}/orders/` + id, order);
  }

  deleteOrder(id: string) {
    return this.http.delete<string>(`${this.apiUrl}/orders/` + id);
  }

  checkQR(code: string) {
    return this.http.post<any>(`${this.apiUrl}/orders/checkQR`, { code });
  }

  payOrder(id: string) {
    return this.http.post<any>(`${this.apiUrl}/payment/` + id, {});
  }
}

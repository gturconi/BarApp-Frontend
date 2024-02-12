import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from 'src/environments/environment';
import { Promotion } from '../models/promotion';
import { EntityListResponse } from '@common/models/entity.list.response';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PromotionsService {
  apiUrl: string = environment.apiUrl;
  constructor(private http: HttpClient) {}

  getPromotions(page: number = 1, limit: number = 10) {
    return this.http.get<EntityListResponse<Promotion>>(
      `${this.apiUrl}/promotions?page=${page}&limit=${limit}`
    );
  }

  getPromotion(id: string) {
    return this.http.get<Promotion>(`${this.apiUrl}/promotions/` + id);
  }

  postPromotions(formData: FormData) {
    return this.http.post<Promotion>(`${this.apiUrl}/promotions`, formData);
  }

  putPromotions(id: string, formData: FormData) {
    return this.http.put<Promotion>(
      `${this.apiUrl}/promotions/` + id,
      formData
    );
  }

  deletePromotions(id: string) {
    return this.http.delete<Promotion>(`${this.apiUrl}/promotions/` + id);
  }

  updateImage(id: string, formData: FormData): Observable<Promotion> {
    const url = `${this.apiUrl}/promotions/${id}`;
    return this.http.put<Promotion>(url, formData);
  }
}

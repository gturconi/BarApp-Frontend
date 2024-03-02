import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EntityListResponse } from '@common/models/entity.list.response';

import { environment } from 'src/environments/environment';

import { Table } from '../models/table';

@Injectable({
  providedIn: 'root',
})
export class TablesService {
  apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getTables(page: number = 1, limit: number = 10, search: string = '') {
    return this.http.get<EntityListResponse<Table>>(
      `${this.apiUrl}/tables?page=${page}&limit=${limit}`
    );
  }

  getTable(id: string) {
    return this.http.get<Table>(`${this.apiUrl}/tables/` + id);
  }

  postTable(table: Table) {
    return this.http.post<Table>(`${this.apiUrl}/tables`, table);
  }

  putTable(id: string, table: Table) {
    return this.http.put<Table>(`${this.apiUrl}/tables/` + id, table);
  }

  deleteTable(id: string) {
    return this.http.delete<Table>(`${this.apiUrl}/tables/` + id);
  }
}

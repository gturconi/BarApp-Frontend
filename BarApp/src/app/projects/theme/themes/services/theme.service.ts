import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from 'src/environments/environment';

import { Theme } from '../../models/theme';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  apiUrl: string = environment.apiUrl;
  constructor(private http: HttpClient) {}

  getTheme(id: number) {
    return this.http.get<Theme>(`${this.apiUrl}/theme/` + id);
  }

  putTheme(id: number, cssProperties: string) {
    return this.http.put<Theme>(`${this.apiUrl}/theme/` + id, {
      cssProperties,
    });
  }
}

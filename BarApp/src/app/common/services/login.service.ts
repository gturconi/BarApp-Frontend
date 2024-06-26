import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User } from '@common/models/user';
import { environment } from 'src/environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';
import { FcmService } from './fcm.service';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  apiUrl: string = environment.apiUrl;
  constructor(
    private http: HttpClient,
    private jwtHelper: JwtHelperService,
    private fcmService: FcmService
  ) {}

  authenticateUser(email: string, password: string) {
    let fcm_token =
      this.fcmService.getFcmToken() != ''
        ? this.fcmService.getFcmToken()
        : null;
    const credentials = { email, password, fcm_token };
    return this.http.post<User>(`${this.apiUrl}/auth/signin`, credentials);
  }

  getUser(id: string) {
    return this.http.get<User>(`${this.apiUrl}/users/` + id);
  }

  isLoggedIn() {
    const tokenStr = localStorage.getItem('token');
    if (tokenStr !== null) {
      const jwtRegex = /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.[A-Za-z0-9-_.+/=]*$/;
      try {
        jwtRegex.test(tokenStr);
        return !this.jwtHelper.isTokenExpired(tokenStr);
      } catch (err) {
        return false;
      }
    }
    return false;
  }

  setUser(user: User) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  setToken(token: string) {
    localStorage.setItem('token', token);
  }

  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    return true;
  }

  getUserRole() {
    let userStr = localStorage.getItem('user') ?? '';
    if (userStr) {
      return JSON.parse(userStr).role;
    }
  }

  getUserInfo() {
    let userStr = localStorage.getItem('user') ?? '';
    if (userStr) {
      return JSON.parse(userStr);
    }
  }

  isAdmin(): boolean {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const userRole = JSON.parse(userStr).role;
      return userRole === 'admin';
    }
    return false;
  }

  isEmployee(): boolean {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const userRole = JSON.parse(userStr).role;
      return userRole === 'employee';
    }
    return false;
  }

  isClient(): boolean {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const userRole = JSON.parse(userStr).role;
      return userRole === 'customer';
    }
    return false;
  }

  recoveryPassword(email: string) {
    const credentials = { email };
    return this.http.post(`${this.apiUrl}/auth/forgot`, credentials);
  }

  resetPassword(password: string) {
    const credentials = { password };
    return this.http.put(`${this.apiUrl}/auth/reset`, credentials);
  }
}

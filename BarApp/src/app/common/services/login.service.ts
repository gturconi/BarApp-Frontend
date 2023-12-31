import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { User } from "@common/models/user";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class LoginService {
  apiUrl: string = environment.apiUrl;
  constructor(private http: HttpClient) {}

  authenticateUser(email: string, password: string) {
    const credentials = { email, password };
    return this.http.post<User>(`${this.apiUrl}/auth/signin`, credentials);
  }

  getUser(id: string) {
    return this.http.get<User>(`${this.apiUrl}/users/` + id);
  }

  isLoggedIn() {
    const tokenStr = localStorage.getItem("token");
    if (tokenStr !== null) {
      const jwtRegex = /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.[A-Za-z0-9-_.+/=]*$/;
      try {
        jwtRegex.test(tokenStr);
        return true;
      } catch (err) {
        return false;
      }
    }
    return false;
  }

  setUser(user: User) {
    localStorage.setItem("user", JSON.stringify(user));
  }

  setToken(token: string) {
    localStorage.setItem("token", token);
  }

  logout() {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    return true;
  }

  getUserRole() {
    let userStr = localStorage.getItem("user") ?? "";
    if (userStr) {
      return JSON.parse(userStr).roleName;
    }
  }

  isAdmin(): boolean {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const userRole = JSON.parse(userStr).roleName;
      return userRole === "admin";
    }
    return false;
  }

  isEmployee(): boolean {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const userRole = JSON.parse(userStr).roleName;
      return userRole === "employee";
    }
    return false;
  }

  isClient(): boolean {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const userRole = JSON.parse(userStr).roleName;
      return userRole === "customer";
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

import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { CookieService } from "ngx-cookie-service";

import { User } from "@common/models/user";
import { environment } from "src/environments/environment";
import { catchError, throwError } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class LoginService {
  apiUrl: string = environment.apiUrl;
  constructor(private http: HttpClient, private cookieService: CookieService) {}

  authenticateUser(email: string, password: string) {
    const credentials = { email, password };
    return this.http.post(`${this.apiUrl}/auth/signin`, credentials);
  }

  getUser(id: string) {
    return this.http.get(`${this.apiUrl}/users/` + id);
  }

  isLoggedIn() {
    const tokenStr = this.cookieService.get("token");
    if (tokenStr !== "") {
      const { token } = JSON.parse(tokenStr);
      const jwtRegex = /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.[A-Za-z0-9-_.+/=]*$/;
      try {
        jwtRegex.test(token);
        return true;
      } catch (err) {
        return false;
      }
    }
    return false;
  }

  setUser(user: User) {
    this.cookieService.set("user", JSON.stringify(user));
  }

  setToken(token: string) {
    this.cookieService.set("token", token);
  }

  logout() {
    this.cookieService.delete("user");
    this.cookieService.delete("token");
    return true;
  }

  getUserRole() {
    let userStr = this.cookieService.get("user") || "";
    return JSON.parse(userStr).roleName.name;
  }
}

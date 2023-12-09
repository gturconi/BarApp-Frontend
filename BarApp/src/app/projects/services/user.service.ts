import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { EntityListResponse } from "@common/models/entity.list.response";

import { User } from "@common/models/user";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class UserService {
  apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getUsers(page: number = 1, limit: number = 10, search: string = "") {
    return this.http.get<EntityListResponse<User>>(this.apiUrl + "/users/", {
      params: { search, page, limit },
    });
  }

  getUser(id: string) {
    return this.http.get<User>(this.apiUrl + "/users/" + id);
  }

  postUsers(user: User) {
    return this.http.post<User>(this.apiUrl + "/auth/signup/", user);
  }

  putUsers(selectedUser: User) {
    return this.http.put<User>(
      this.apiUrl + "/users/" + selectedUser._id,
      selectedUser
    );
  }

  deleteUsers(user: User) {
    return this.http.delete(this.apiUrl + "/users/" + user._id);
  }
}

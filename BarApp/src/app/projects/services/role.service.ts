import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { EntityListResponse } from "@common/models/entity.list.response";

import { environment } from "src/environments/environment";
import { UserRole } from "@common/models/userRole";

@Injectable({
  providedIn: "root",
})
export class RoleService {
  apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getRoles() {
    return this.http.get<EntityListResponse<UserRole>>(this.apiUrl + "/roles/");
  }

}

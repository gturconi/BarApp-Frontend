import { UserRole } from "./userRole";

export class User {
  constructor(
    _id = "",
    name = "",
    email = "",
    tel = "",
    password = "",
    role = ""
  ) {
    this._id = _id;
    this.name = name;
    this.email = email;
    this.tel = tel;
    this.password = password;
    this.role = role;
  }
  _id: string;
  name: string;
  email: string;
  tel: string;
  password: string;
  role: string;
}

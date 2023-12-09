import { UserRole } from "./userRole";

export class User {
  constructor(
    _id = "",
    name = "",
    email = "",
    password = "",
    roleName = new UserRole("", "")
  ) {
    this._id = _id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.roleName = roleName;
  }
  _id: string;
  name: string;
  email: string;
  password: string;
  roleName: UserRole;
}

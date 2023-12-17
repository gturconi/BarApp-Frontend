import { Avatar } from "./avatar";
import { PhotoResult } from "./avatar";

export class User {
  constructor(
    id = "",
    name = "",
    email = "",
    tel = "",
    password = "",
    newPassword = "",
    role = "",
    baja = 0,
    avatar: Avatar | PhotoResult
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.tel = tel;
    this.password = password;
    this.newPassword = newPassword;
    this.role = role;
    this.baja = baja;
    this.avatar = avatar;
  }
  id: string;
  name?: string;
  email?: string;
  tel?: string;
  password?: string;
  newPassword?: string;
  role?: string;
  baja?: number;
  avatar?: Avatar | PhotoResult;
}

type Avatar = {
  data: number[];
  type: string;
};

export class User {
  constructor(
    id = "",
    name = "",
    email = "",
    tel = "",
    password = "",
    role = "",
    baja = 0,
    avatar: Avatar
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.tel = tel;
    this.password = password;
    this.role = role;
    this.baja = baja;
    this.avatar = avatar;
  }
  id: string;
  name: string;
  email: string;
  tel: string;
  password?: string;
  role?: string;
  baja?: number;
  avatar?: Avatar;
}

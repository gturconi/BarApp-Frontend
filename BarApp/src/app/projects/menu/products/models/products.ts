import { Avatar, PhotoResult } from "@common/models/avatar";

export class Products {
  constructor(
    id = "",
    name = "",
    description = "",
    image: Avatar | PhotoResult,
    price: number,
    idCat: string,
    stock: number,
    promotions: number[],
    baja = 0,
    quantity = 1
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.image = image;
    this.price = price;
    this.idCat = idCat;
    this.stock = stock;
    this.promotions = promotions;
    this.baja = baja;
    this.quantity = quantity;
  }

  id: string;
  name?: string;
  description?: string;
  image?: Avatar | PhotoResult;
  price?: number;
  idCat?: string;
  stock?: number;
  promotions: number[];
  baja?: number;
  quantity?: number;
}

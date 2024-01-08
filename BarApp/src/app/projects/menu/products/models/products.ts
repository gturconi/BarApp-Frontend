import { Avatar, PhotoResult } from '@common/models/avatar';

export class Products {
  constructor(
    id = '',
    name = '',
    description = '',
    image: Avatar | PhotoResult,
    price: number,
    idCat: number,
    stock: number,
    promotions: number[],
    baja = 0
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
  }

  id: string;
  name?: string;
  description?: string;
  image?: Avatar | PhotoResult;
  price?: number;
  idCat?: number;
  stock?: number;
  promotions: number[];
  baja?: number;
}

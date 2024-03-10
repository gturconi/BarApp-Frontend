import { Avatar, PhotoResult } from '@common/models/avatar';

export class Products {
  constructor(
    id = '',
    name = '',
    description = '',
    image: Avatar | PhotoResult,
    price: number,
    stock: number,
    promotions: number[],
    baja = 0,
    quantity = 1,
    category: string
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.image = image;
    this.price = price;
    this.stock = stock;
    this.promotions = promotions;
    this.baja = baja;
    this.quantity = quantity;
    this.category = category;
  }

  id: string;
  name?: string;
  description?: string;
  image?: Avatar | PhotoResult;
  price?: number;
  stock?: number;
  promotions: number[];
  baja?: number;
  quantity?: number;
  category?: string;
}

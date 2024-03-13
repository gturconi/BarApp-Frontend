import { Avatar, PhotoResult } from '@common/models/avatar';
import { Products } from '../../products/models/products';

export class Promotion {
  constructor(
    id = '',
    description = '',
    image: Avatar | PhotoResult,
    products: Products[],
    price: number,
    valid_from: Date,
    valid_to: Date,
    discount: number,
    days_of_week: number[],
    baja = 0,
    quantity = 1
  ) {
    this.id = id;
    this.description = description;
    this.valid_from = valid_from;
    this.valid_to = valid_to;
    this.discount = discount;
    this.image = image;
    this.baja = baja;
    this.products = products;
    this.days_of_week = days_of_week;
    this.price = price;
    this.quantity = quantity;
  }

  id?: string;
  description?: string;
  valid_from?: Date;
  valid_to?: Date;
  discount?: number;
  image?: Avatar | PhotoResult;
  price?: number;
  baja?: number;
  products?: Products[];
  days_of_week?: number[];
  quantity?: number;
}

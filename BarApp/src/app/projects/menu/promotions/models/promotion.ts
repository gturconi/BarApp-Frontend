import { Avatar, PhotoResult } from '@common/models/avatar';

export class Promotion {
  constructor(
    id = '',
    description = '',
    image: Avatar | PhotoResult,
    products: number[],
    price: number,
    valid_from: Date,
    valid_to: Date,
    discount: number,
    days_of_week: number[],
    baja = 0
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
  }

  id?: string;
  description?: string;
  valid_from?: Date;
  valid_to?: Date;
  discount?: number;
  image?: Avatar | PhotoResult;
  price?: number;
  baja?: number;
  products: number[];
  days_of_week?: number[];
}

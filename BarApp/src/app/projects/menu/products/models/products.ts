import { Avatar, PhotoResult } from '@common/models/avatar';
import { Promotion } from '../../promotions/models/promotion';

export class Products {
  constructor(
    id = '',
    name = '',
    description = '',
    image: Avatar | PhotoResult,
    price: number,
    stock: number,
    promotions: Promotion[],
    baja = 0,
    quantity = 1,
    category: string,
    idCat: string
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
    this.idCat = idCat;
  }

  id: string;
  name?: string;
  description?: string;
  image?: Avatar | PhotoResult;
  price?: number;
  stock?: number;
  promotions: Promotion[];
  baja?: number;
  quantity?: number;
  category?: string;
  idCat?: string;
}

import { Avatar, PhotoResult } from '@common/models/avatar';

export class ProductsType {
  constructor(id = '', description = '', image: Avatar | PhotoResult) {
    this.id = id;
    this.description = description;
    this.image = image;
  }

  id: string;
  description?: string;
  image?: Avatar | PhotoResult;
  baja?: boolean;
}

import { Avatar, PhotoResult } from "@common/models/avatar";

export class ProductsType {
  constructor(id = "", description = "", image: Avatar | PhotoResult) {
    this.idProductType = id;
    this.description = description;
    this.image = image;
  }

  idProductType: string;
  description?: string;
  image?: Avatar | PhotoResult;
}

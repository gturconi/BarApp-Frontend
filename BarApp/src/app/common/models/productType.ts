export class ProductType {
    constructor(
      _id = "",
      description = "",
      image: Blob
    ) {
      this._id = _id;
      this.description = description;
      this.image = image;
    }
    _id: string;
    description: string;
    image: Blob; //TODO ver is el tipo de dato de la img esta ok
  }
  
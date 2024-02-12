import { Products } from 'src/app/projects/menu/products/models/products';

export interface CartProduct {
  product: Products;
  visited: boolean;
}

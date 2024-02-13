import { Products } from 'src/app/projects/menu/products/models/products';
import { Promotion } from 'src/app/projects/menu/promotions/models/promotion';

export interface CartProduct {
  product: Products | Promotion;
  visited: boolean;
}

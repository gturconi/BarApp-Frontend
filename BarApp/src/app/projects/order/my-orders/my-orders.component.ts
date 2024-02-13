import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { BadgeService } from '@common/services/badge.service';
import { CartService } from '@common/services/cart.service';
import { ImageService } from '@common/services/image.service';
import { LoadingService } from '@common/services/loading.service';

import { CartProduct } from '@common/models/cartProduct';
import { Products } from '../../menu/products/models/products';
import { Promotion } from '../../menu/promotions/models/promotion';
import { Avatar } from '@common/models/avatar';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.scss'],
})
export class MyOrdersComponent implements OnInit {
  ordersList: CartProduct[] = [];
  imagesUrl$!: Observable<string>[];
  showData: boolean = false;

  constructor(
    private badgeService: BadgeService,
    private cartService: CartService,
    private imageService: ImageService,
    private loadingService: LoadingService
  ) {}

  async ngOnInit() {
    const loading = await this.loadingService.loading();
    await loading.present();
    this.badgeService.resetBadgeCount();
    this.cartService.setVisited();
    this.ordersList = this.cartService.getProductsFromCart();
    this.setImages(this.ordersList);
    this.showData = this.ordersList.length > 0 ?? true;
    loading.dismiss();
  }

  setImages(list: CartProduct[]) {
    this.imagesUrl$ = list.map(order => {
      return this.getImage(order.product);
    });
  }

  getImage(object: Products | Promotion) {
    const image = (object as { image: Avatar }).image;
    return this.imageService.getImage(image.data, image.type);
  }

  isProduct(order: CartProduct): boolean {
    return 'name' in order.product;
  }

  castProduct(order: Products | Promotion): Products {
    return order as Products;
  }

  decrement(order: Products | Promotion) {
    if (order.quantity! > 1) {
      order.quantity = order.quantity! - 1;
    }
  }

  increment(order: Products | Promotion) {
    order.quantity = order.quantity! + 1;
  }
}

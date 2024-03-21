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
import Swal from 'sweetalert2';
import { DELETE_OPTS_CART } from '@common/constants/messages.constant';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.scss'],
})
export class MyOrdersComponent implements OnInit {
  ordersList: CartProduct[] = [];
  imagesUrl$!: Observable<string>[];
  showData: boolean = false;
  total = 0;
  maxCharacters = 50;

  constructor(
    private badgeService: BadgeService,
    private cartService: CartService,
    private imageService: ImageService,
    private loadingService: LoadingService,
    private router: Router
  ) {}

  async ngOnInit() {
    const loading = await this.loadingService.loading();
    await loading.present();
    this.badgeService.resetBadgeCount();
    this.cartService.setVisited();
    this.prepareItems();
    loading.dismiss();
  }

  prepareItems() {
    this.ordersList = this.cartService.getProductsFromCart();
    if (this.ordersList.length === 0) {
      Swal.fire({
        icon: 'info',
        title: 'No hay productos cargados',
        text: 'Aun no hay productos cargados para tu pedido',
      }).then(() => {
        this.router.navigate(['/menu/categories']);
      });
    }
    this.setImages(this.ordersList);
    this.showData = this.ordersList.length > 0 ?? true;
    this.totalCost();
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

  isLongName(order: CartProduct): boolean {
    if (!this.isProduct(order))
      return order.product.description!.length > this.maxCharacters;
    else return (order.product as Products).name!.length > this.maxCharacters;
  }

  decrement(order: Products | Promotion) {
    if (order.quantity! > 1) {
      order.quantity = order.quantity! - 1;
      this.totalCost();
    }
  }

  increment(order: Products | Promotion) {
    order.quantity = order.quantity! + 1;
    this.totalCost();
  }

  totalCost() {
    this.total = 0;
    this.ordersList.forEach(order => {
      this.total += order.product.quantity! * order.product.price!;
    });
  }

  deleteItem(order: CartProduct) {
    Swal.fire(DELETE_OPTS_CART).then(async result => {
      if (result.isConfirmed) {
        const loading = await this.loadingService.loading();
        await loading.present();
        this.cartService.removeFromCart(order.product.id!);
        this.prepareItems();
        loading.dismiss();
      }
    });
  }
}

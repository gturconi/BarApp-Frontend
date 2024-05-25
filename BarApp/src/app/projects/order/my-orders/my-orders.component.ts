import { Component, OnInit } from '@angular/core';
import { Observable, finalize } from 'rxjs';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import { BadgeService } from '@common/services/badge.service';
import { CartService } from '@common/services/cart.service';
import { ImageService } from '@common/services/image.service';
import { LoadingService } from '@common/services/loading.service';
import { SocketService } from '@common/services/socket.service';
import { NotificationService } from '@common/services/notification.service';
import { OrderService } from '../services/order.service';
import { LoginService } from '@common/services/login.service';
import { FcmService } from '@common/services/fcm.service';

import { CartProduct } from '@common/models/cartProduct';
import { Products } from '../../menu/products/models/products';
import { Promotion } from '../../menu/promotions/models/promotion';
import { Avatar } from '@common/models/avatar';
import { ORDER_STATES, OrderDetail } from '../models/order';

import {
  DELETE_OPTS_CART,
  NO_WEB_QR_COMPATIBILITY,
  ORDER_CONFIRMATION_OPTS,
  ORDER_CONFIRMED_OPTS,
} from '@common/constants/messages.constant';
import { OrderRequest } from '../models/order';
import { ModalController, Platform } from '@ionic/angular';
import { BarcodeScanningModalComponent } from './barcode-scanning-modal.component';
import { LensFacing, BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';

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
  scannedData = '';

  constructor(
    private badgeService: BadgeService,
    private cartService: CartService,
    private imageService: ImageService,
    private loadingService: LoadingService,
    private socketService: SocketService,
    private router: Router,
    private notificationService: NotificationService,
    private orderService: OrderService,
    private loginService: LoginService,
    private modalController: ModalController,
    private plaform: Platform,
    private fmcService: FcmService
  ) {}

  async ngOnInit() {
    const loading = await this.loadingService.loading();
    await loading.present();
    this.badgeService.resetBadgeCount();
    this.cartService.setVisited();
    this.prepareItems();
    loading.dismiss();

    if (this.plaform.is('capacitor')) {
      BarcodeScanner.isSupported().then();
      BarcodeScanner.checkPermissions().then();
      BarcodeScanner.removeAllListeners();
    }
  }

  detectEnvironment() {
    if (!this.plaform.is('capacitor') || !this.plaform.is('cordova')) {
      return false;
    }
    return true;
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

  roundDiscount(price: number): number {
    return Math.round(price);
  }

  castOrderToProduct(order: Products | Promotion): Products {
    return order as Products;
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
      this.total += this.isProduct(order)
        ? this.calculateProductCost(order.product as Products)
        : order.product.quantity! * order.product.price!;
    });
  }

  calculateProductCost(prod: Products) {
    if (prod.promotions) {
      return this.roundDiscount(
        prod.price! * prod.quantity! * (1 - prod.promotions[0].discount!)
      );
    } else {
      return prod.price! * prod.quantity!;
    }
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

  confirmOrder() {
    if (!this.detectEnvironment()) {
      Swal.fire(NO_WEB_QR_COMPATIBILITY);
      return;
      //TODO: ACA FALTARIA QUE SI EL USER CLICKEA ABRIR APP, SE ABRA LA MISMA
    }

    Swal.fire(ORDER_CONFIRMATION_OPTS).then(async result => {
      if (result.isConfirmed) {
        if (await this.scanCode()) {
          const res = this.createOrder();
        }
      } else {
        this.notificationService.presentToast({
          message:
            'Ocurrió un error al escanear el código, por favor intentelo de nuevo',
        });
      }
    });
  }

  async scanCode() {
    const modal = await this.modalController.create({
      component: BarcodeScanningModalComponent,
      cssClass: 'barcode-scanning-modal', //transparent background
      showBackdrop: false,
      componentProps: {
        formats: [],
        lensFacing: LensFacing.Back, //back camera
      },
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();

    if (data) {
      this.scannedData = data?.barcode?.displayValue;
      return true;
    }
    return false;
  }

  async createOrder() {
    const loading = await this.loadingService.loading();
    await loading.present();
    const user = this.loginService.getUserInfo();
    const index = Object.keys(ORDER_STATES).find(
      key => ORDER_STATES[parseInt(key)] === 'A confirmar'
    ) as string | undefined;

    const orderDetails: OrderDetail[] = this.ordersList.map(order => {
      let promId = null;
      let prodId = null;

      if (this.isProduct(order)) {
        promId = null;
        prodId = order.product.id;
      } else {
        promId = order.product.id;
        prodId = null;
        null;
      }
      const orderDetail = new OrderDetail(
        null,
        prodId,
        promId,
        order.product.quantity,
        order.product.price,
        order.comments != undefined ? order.comments : null
      );
      return orderDetail;
    });

    const order = new OrderRequest(
      this.scannedData,
      user.id,
      null,
      index,
      this.total,
      orderDetails,
      undefined,
      null
    );

    try {
      this.orderService
        .postOrder(order)
        .pipe(finalize(() => loading.dismiss()))
        .subscribe(() => {
          this.cartService.clearCart();
          loading.dismiss();
          this.fmcService
            .sendPushNotification(
              'Nuevo pedido',
              'Se ha realizado un nuevo pedido en la mesa X',
              this.scannedData
            )
            .subscribe();
          Swal.fire(ORDER_CONFIRMED_OPTS).then(() => {
            this.socketService.sendMessage('order', '');
            this.router.navigate(['/orders/my-orders/confirmed']);
          });
        });
    } catch (error) {
      console.log(error);
    }
  }
}

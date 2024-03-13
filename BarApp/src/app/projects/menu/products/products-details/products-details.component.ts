import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AlertController } from '@ionic/angular';

import { ProductsService } from '../services/products.service';
import { LoadingService } from '@common/services/loading.service';
import { ImageService } from '@common/services/image.service';
import { LoginService } from '@common/services/login.service';
import { CartService } from '@common/services/cart.service';

import { Products } from '../models/products';
import { Avatar } from '@common/models/avatar';
import { ToastrService } from 'ngx-toastr';
import { BadgeService } from '@common/services/badge.service';

@Component({
  selector: 'app-products-details',
  templateUrl: './products-details.component.html',
  styleUrls: ['./products-details.component.scss'],
})
export class ProductsDetailsComponent implements OnInit {
  product!: Products;
  isLoading = true;
  imagesUrl$!: Observable<string>;
  quantity: number = 1;
  admin: boolean = false;
  isInCart: boolean = false;
  comments: string = '';
  mobileScreen = false;

  constructor(
    private loginService: LoginService,
    private productsService: ProductsService,
    private loadingService: LoadingService,
    private toastrService: ToastrService,
    private imageService: ImageService,
    private route: ActivatedRoute,
    private cartService: CartService,
    private alertController: AlertController,
    private router: Router,
    private badgeService: BadgeService
  ) {}

  ngOnInit() {
    this.admin = this.loginService.isAdmin();
    this.route.params.subscribe(params => {
      const typeId = params['idProd'];
      if (typeId) {
        this.doSearch(typeId);
      }
    });

    this.mobileScreen = window.innerWidth < 768;
  }

  async doSearch(id: string) {
    const loading = await this.loadingService.loading();
    await loading.present();
    try {
      this.productsService.getProduct(id).subscribe(data => {
        this.product = data;
        this.imagesUrl$ = this.getImage(this.product);
        this.isLoading = false;
      });
    } finally {
      loading.dismiss();
      this.isInCart = this.cartService.isProductInCart(id);
    }
  }

  getImage(products: Products) {
    const image = products.image as Avatar;
    return this.imageService.getImage(image.data, image.type);
  }

  decrement() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  increment() {
    this.quantity++;
  }

  async addToCart() {
    if (!this.loginService.isLoggedIn()) {
      await this.displayLoginAlert();
    } else {
      this.product.quantity = this.quantity;
      this.cartService.addToCart(this.product, this.comments);
      this.badgeService.incrementBadgeCount();
      const alert = await this.alertController.create({
        header: 'Producto agregado',
        backdropDismiss: false,
        buttons: [
          {
            text: 'Ir al carrito',
            handler: () => {
              this.router.navigate(['orders/my-orders']);
            },
          },
          {
            text: 'Seguir comprando',
            handler: () => {
              this.router.navigate(['menu/categories']);
            },
          },
        ],
        cssClass: 'custom-alert',
      });
      await alert.present();
    }
  }

  async removeFromCart() {
    if (!this.loginService.isLoggedIn()) {
      await this.displayLoginAlert();
    } else {
      this.cartService.removeFromCart(this.product.id);
      this.isInCart = false;
      this.badgeService.decrementBadgeCount();
      this.toastrService.success('Producto eliminado');
    }
  }

  async displayLoginAlert() {
    const alert = await this.alertController.create({
      header: 'Debes iniciar sesión',
      buttons: [
        {
          text: 'Iniciar sesión',
          handler: () => {
            this.router.navigate(['auth']);
          },
        },
      ],
      cssClass: 'custom-alert',
    });
    await alert.present();
  }
}

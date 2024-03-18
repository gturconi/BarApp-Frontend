import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';

import { LoadingService } from '@common/services/loading.service';
import { ImageService } from '@common/services/image.service';
import { LoginService } from '@common/services/login.service';
import { BadgeService } from '@common/services/badge.service';
import { CartService } from '@common/services/cart.service';

import { isPromotionValid } from '../../../../common/validations/validation-functions';

import { Avatar } from '@common/models/avatar';
import { Promotion } from '../models/promotion';
import { Products } from '../../products/models/products';

import { PromotionsService } from '../services/promotions.service';
import { ProductsService } from '../../products/services/products.service';

@Component({
  selector: 'app-promotions-details',
  templateUrl: './promotions-details.component.html',
  styleUrls: ['./promotions-details.component.scss'],
})
export class PromotionsDetailsComponent implements OnInit {
  promotion!: Promotion;
  product!: Products;
  isLoading = true;
  imagesUrl$!: Observable<string>;
  quantity: number = 1;
  admin: boolean = false;
  employee: boolean = false;
  isInCart: boolean = false;
  logged = false;
  diasDeLaSemana = [
    'Domingo',
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado',
  ];

  constructor(
    private loginService: LoginService,
    private promotionsService: PromotionsService,
    private productService: ProductsService,
    private loadingService: LoadingService,
    private toastrService: ToastrService,
    private imageService: ImageService,
    private route: ActivatedRoute,
    private alertController: AlertController,
    private router: Router,
    private badgeService: BadgeService,
    private cartService: CartService
  ) {}

  ngOnInit() {
    this.admin = this.loginService.isAdmin();
    this.employee = this.loginService.isEmployee();
    this.route.params.subscribe(params => {
      const idProm = params['idProm'];
      if (idProm) {
        this.doSearch(idProm);
      }
    });
    this.logged = this.loginService.isLoggedIn();
  }

  async doSearch(id: string) {
    const loading = await this.loadingService.loading();
    await loading.present();
    try {
      this.promotionsService.getPromotion(id).subscribe(data => {
        this.promotion = data;
        this.imagesUrl$ = this.getImage(this.promotion);
        this.isLoading = false;
      });
    } finally {
      loading.dismiss();
      this.isInCart = this.cartService.isProductInCart(id);
    }
  }

  getImage(promotion: Promotion) {
    const image = promotion.image as Avatar;
    return this.imageService.getImage(image.data, image.type);
  }

  getNombreDia(numeroDia: number): string {
    if (numeroDia >= 0 && numeroDia < this.diasDeLaSemana.length) {
      return this.diasDeLaSemana[numeroDia];
    } else {
      return 'Día no válido';
    }
  }

  arraysEqual(arr1: number[], arr2: number[]): boolean {
    return JSON.stringify(arr1) === JSON.stringify(arr2);
  }

  getCurrentDate(): Date {
    return new Date();
  }

  isPromotionValid(promotion: Promotion): boolean {
    return isPromotionValid(promotion);
  }

  isCurrentDateInRange(startDate: Date, endDate: Date): boolean {
    const currentDate = this.getCurrentDate();
    const validFrom = new Date(startDate);
    const validTo = new Date(endDate);
    return currentDate >= validFrom && currentDate <= validTo;
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

  async addToCart() {
    if (!this.loginService.isLoggedIn()) {
      await this.displayLoginAlert();
    } else {
      this.promotion.quantity = this.quantity;
      this.cartService.addToCart(this.promotion, undefined);
      this.badgeService.incrementBadgeCount();
      const alert = await this.alertController.create({
        header: 'Promoción agregada al carrito',
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
      if (this.promotion && this.promotion.id) {
        this.cartService.removeFromCart(this.promotion.id);
        this.isInCart = false;
        this.badgeService.decrementBadgeCount();
        this.toastrService.success('Promoción eliminada del carrito');
      }
    }
  }
}

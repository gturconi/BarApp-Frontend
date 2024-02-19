import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AlertController } from '@ionic/angular';

import { PromotionsService } from '../services/promotions.service';
import { LoadingService } from '@common/services/loading.service';
import { ImageService } from '@common/services/image.service';
import { LoginService } from '@common/services/login.service';

import { Promotion } from '../models/promotion';
import { Products } from '../../products/models/products';
import { Avatar } from '@common/models/avatar';
import { ToastrService } from 'ngx-toastr';
import { BadgeService } from '@common/services/badge.service';
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
  diasDeLaSemana = [
    'Domingo',
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado'
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
    private badgeService: BadgeService
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
    }
  }

  getImage(promotion: Promotion) {
    const image = promotion.image as Avatar;
    return this.imageService.getImage(image.data, image.type);
  }

  getNombreDia(numeroDia: number): string {
    if (numeroDia >= 0 && numeroDia < this.diasDeLaSemana.length) {
      console.log(numeroDia);
      console.log(this.diasDeLaSemana[numeroDia]);
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
    if (promotion.valid_from === undefined || promotion.valid_to === undefined) {
      return false;
    }
    const currentDate = this.getCurrentDate();
    const validFrom = new Date(promotion.valid_from);
    const validTo = new Date(promotion.valid_to);
    return currentDate >= validFrom && currentDate <= validTo;
  }
}

import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { ProductsTypeService } from '../services/products-type.service';
import { ImageService } from '@common/services/image.service';

import { ProductsType } from '../models/productsType';
import { Avatar } from '@common/models/avatar';
import { LoadingService } from '@common/services/loading.service';
import { NotificationService } from '@common/services/notification.service';
import { LoginService } from '@common/services/login.service';
import { register } from 'swiper/element/bundle';

register();

@Component({
  selector: 'app-products-type.list',
  templateUrl: './products-type.list.component.html',
  styleUrls: ['./products-type.list.component.scss'],
})
export class ProductsTypeListComponent implements OnInit {
  productsTypeList!: ProductsType[];
  imagesUrl$!: Observable<string>[];

  slides = [
    {
      imgSrc: 'assets/img/prueba.png',
      title: 'Postres',
      description: '25% los lunes',
    },
    {
      imgSrc: 'assets/img/prueba.png',
      title: 'Slice 2',
      description: 'Lorem ipsum, dolor sit amet d',
    },
    {
      imgSrc: 'assets/img/prueba.png',
      title: 'Postres de frutilla',
      description: '25% descuento los lunes',
    },
  ];

  constructor(
    private loginService: LoginService,
    private productsTypeService: ProductsTypeService,
    private imageService: ImageService,
    private loadingService: LoadingService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.doSearch();
  }

  async doSearch() {
    const loading = await this.loadingService.loading();
    await loading.present();
    this.productsTypeService.getProductsTypes().subscribe(data => {
      this.productsTypeList = data.results;
      this.setImages(this.productsTypeList);
      loading.dismiss();
    });
  }

  setImages(productsTypeList: ProductsType[]) {
    this.imagesUrl$ = productsTypeList.map(productsType => {
      return this.getImage(productsType);
    });
  }

  getImage(productsType: ProductsType) {
    const image = productsType.image as Avatar;
    return this.imageService.getImage(image.data, image.type);
  }
}

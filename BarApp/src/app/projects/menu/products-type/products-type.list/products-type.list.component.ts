import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { DELETE_CONFIRMATION_MESSAGE } from 'src/app/common/constants/messages.constant';
import { Avatar } from '@common/models/avatar';
import { ImageService } from '@common/services/image.service';
import { LoadingService } from '@common/services/loading.service';
import { NotificationService } from '@common/services/notification.service';
import { LoginService } from '@common/services/login.service';

import { ProductsTypeService } from '../services/products-type.service';
import { ProductsType } from '../models/productsType';

@Component({
  selector: 'app-products-type.list',
  templateUrl: './products-type.list.component.html',
  styleUrls: ['./products-type.list.component.scss'],
})
export class ProductsTypeListComponent implements OnInit {
  productsTypeList!: ProductsType[];
  imagesUrl$!: Observable<string>[];
  admin: boolean = false;
  showData: boolean = false;

  boxes = [
    {
      title: 'Hamburguesas',
      description: 'Todos los jueves a la tarde',
      image: 'assets/img/hamburguesa.jpg',
      onSale: true,
    },
    {
      title: 'Vinos',
      description: 'válida del 15/7 al 25/7',
      image: 'assets/img/vino.jpg',
      onSale: true,
    },
    {
      title: 'Tortas',
      description: 'Viernes 10% off',
      image: 'assets/img/torta.jpg',
      onSale: false,
    },
    {
      title: 'Title 4',
      description: 'Description 4',
      image: 'ruta_imagen_4',
      onSale: true,
    },
    {
      title: 'Title 5',
      description: 'Description 5',
      image: 'ruta_imagen_5',
      onSale: false,
    },
    {
      title: 'Title 6',
      description: 'Description 6',
      image: 'ruta_imagen_6',
      onSale: false,
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
    this.admin = this.loginService.isAdmin();
    this.doSearch();
  }

  async doSearch() {
    const loading = await this.loadingService.loading();
    await loading.present();
    this.productsTypeService.getProductsTypes().subscribe(data => {
      this.productsTypeList = data.results;
      this.setImages(this.productsTypeList);
      this.showData = true;
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

  async delete(id: string) {
    const confirmDelete = confirm(DELETE_CONFIRMATION_MESSAGE);

    if (confirmDelete) {
      const loading = await this.loadingService.loading();
      await loading.present();
      this.productsTypeService
        .deleteProductsTypes(id)
        .pipe(finalize(() => loading.dismiss()))
        .subscribe(() => {
          this.notificationService.presentToast({
            message: 'Categoría eliminada',
            duration: 2500,
            color: 'ion-color-success',
            position: 'middle',
            icon: 'alert-circle-outline',
          });
          loading.dismiss();
          this.doSearch();
        });
    }
  }
}

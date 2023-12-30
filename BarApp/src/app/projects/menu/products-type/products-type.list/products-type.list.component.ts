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

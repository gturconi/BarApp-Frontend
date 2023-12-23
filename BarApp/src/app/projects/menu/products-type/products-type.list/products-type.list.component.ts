import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";

import { ProductsTypeService } from "../services/products-type.service";
import { ImageService } from "@common/services/image.service";

import { ProductsType } from "../models/productsType";
import { Avatar } from "@common/models/avatar";
import { LoadingService } from "@common/services/loading.service";

@Component({
  selector: "app-products-type.list",
  templateUrl: "./products-type.list.component.html",
  styleUrls: ["./products-type.list.component.scss"],
})
export class ProductsTypeListComponent implements OnInit {
  productsTypeList!: ProductsType[];
  imagesUrl$!: Observable<string>[];

  constructor(
    private productsTypeService: ProductsTypeService,
    private imageService: ImageService,
    private loadingService: LoadingService
  ) {}

  async ngOnInit() {
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

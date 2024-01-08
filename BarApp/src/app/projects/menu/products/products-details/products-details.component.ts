import { Component, OnInit } from "@angular/core";
import { ProductsService } from "../services/products.service";
import { Products } from "../models/products";
import { ActivatedRoute } from "@angular/router";
import { LoadingService } from "@common/services/loading.service";
import { ImageService } from "@common/services/image.service";
import { Avatar } from "@common/models/avatar";
import { Observable } from "rxjs";

@Component({
  selector: "app-products-details",
  templateUrl: "./products-details.component.html",
  styleUrls: ["./products-details.component.scss"],
})
export class ProductsDetailsComponent implements OnInit {
  product!: Products;
  isLoading = true;
  imagesUrl$!: Observable<string>;
  quantity: number = 1;

  constructor(
    private productsService: ProductsService,
    private loadingService: LoadingService,
    private imageService: ImageService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const typeId = params["idProd"];
      if (typeId) {
        this.doSearch(typeId);
      }
    });
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
}

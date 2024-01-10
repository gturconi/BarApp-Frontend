import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable } from "rxjs";
import { finalize } from "rxjs/operators";
import { DELETE_OPTS } from "src/app/common/constants/messages.constant";
import { Avatar } from "@common/models/avatar";

import { ImageService } from "@common/services/image.service";
import { LoadingService } from "@common/services/loading.service";
import { LoginService } from "@common/services/login.service";
import { ToastrService } from "ngx-toastr";
import { ProductsService } from "../services/products.service";
import { ProductsTypeService } from "../../products-type/services/products-type.service";

import { Products } from "../models/products";

import Swal from "sweetalert2";

@Component({
  selector: "app-products.list",
  templateUrl: "./products.list.component.html",
  styleUrls: ["./products.list.component.scss"],
})
export class ProductsListComponent implements OnInit {
  productsList!: Products[];
  imagesUrl$!: Observable<string>[];
  admin: boolean = false;
  showData: boolean = false;
  hide: boolean = true;
  category: string | undefined = "";

  constructor(
    private loginService: LoginService,
    private productsService: ProductsService,
    private productsTypeService: ProductsTypeService,
    private imageService: ImageService,
    private loadingService: LoadingService,
    private toastrService: ToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.admin = this.loginService.isAdmin();
    this.getAndSearchByType();
  }

  getAndSearchByType(): void {
    this.route.params.subscribe(params => {
      const typeId = params["idCat"];
      if (typeId) {
        this.productsTypeService.getProductsType(typeId).subscribe(data => {
          this.category = data.description;
          this.doSearch();
        });
      }
    });
  }

  redirectToProductsEdit(productId: string) {
    this.router.navigate(["edit/", productId], {
      relativeTo: this.route.parent,
    });
  }
  redirectToDetails(productId: string) {
    this.router.navigate(["details/", productId], {
      relativeTo: this.route.parent,
    });
  }

  async doSearch() {
    const loading = await this.loadingService.loading();
    await loading.present();
    try {
      this.productsService.getProducts(this.category).subscribe(data => {
        this.productsList = data.results;
        this.setImages(this.productsList);
        this.showData = true;
        if (this.productsList.length === 0) {
          Swal.fire({
            icon: "info",
            title: "No hay productos",
            text: "Aun no hay productos cargados para esta categoría.",
          }).then(() => {
            this.router.navigate(["/menu/categories"]); // Redirecciona al menú de categorías
          });
          this.showData = false;
        }
      });
    } finally {
      loading.dismiss();
    }
  }

  setImages(productsList: Products[]) {
    this.imagesUrl$ = productsList.map(products => {
      return this.getImage(products);
    });
  }

  getImage(products: Products) {
    const image = products.image as Avatar;
    return this.imageService.getImage(image.data, image.type);
  }

  async delete(id: string) {
    Swal.fire(DELETE_OPTS).then(async result => {
      if (result.isConfirmed) {
        const loading = await this.loadingService.loading();
        await loading.present();
        this.productsService
          .deleteProducts(id)
          .pipe(finalize(() => loading.dismiss()))
          .subscribe(() => {
            this.toastrService.success("Producto eliminado");
            loading.dismiss();
            this.getAndSearchByType();
          });
      }
    });
  }

  showOrHideProduct(prod: Products) {
    this.hide = !this.hide;
    prod.baja = this.hide ? 0 : 1;
    this.productsService.changeProductView(prod).subscribe();
  }
}

import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable } from "rxjs";
import { finalize } from "rxjs/operators";

import { DELETE_OPTS } from "src/app/common/constants/messages.constant";
import { Avatar } from "@common/models/avatar";
import { ImageService } from "@common/services/image.service";
import { LoadingService } from "@common/services/loading.service";
import { LoginService } from "@common/services/login.service";
import { ToastrService } from "ngx-toastr";

import { ProductsTypeService } from "../services/products-type.service";
import { ProductsType } from "../models/productsType";

import Swal from "sweetalert2";

@Component({
  selector: "app-products-type.list",
  templateUrl: "./products-type.list.component.html",
  styleUrls: ["./products-type.list.component.scss"],
})
export class ProductsTypeListComponent implements OnInit {
  productsTypeList!: ProductsType[];
  imagesUrl$!: Observable<string>[];
  admin: boolean = false;
  showData: boolean = false;

  @ViewChild("wrapper") wrapperRef!: ElementRef<HTMLDivElement>;
  scrollingTimer: any;

  onScroll(event: Event) {
    const element = event.target as HTMLElement;
    const wrapper = this.wrapperRef.nativeElement;

    if (element.scrollHeight > element.clientHeight) {
      wrapper.classList.add("show-scrollbar");
      clearTimeout(this.scrollingTimer);

      this.scrollingTimer = setTimeout(() => {
        wrapper.classList.remove("show-scrollbar");
      }, 1500);
    }
  }

  boxes = [
    {
      title: "Hamburguesas",
      description: "Todos los jueves a la tarde",
      image: "assets/img/hamburguesa.jpg",
      onSale: true,
    },
    {
      title: "Vinos",
      description: "válida del 15/7 al 25/7",
      image: "assets/img/vino.jpg",
      onSale: true,
    },
    {
      title: "Tortas",
      description: "Viernes 10% off",
      image: "assets/img/torta.jpg",
      onSale: false,
    },
    {
      title: "Title 4",
      description: "Description 4",
      image: "ruta_imagen_4",
      onSale: true,
    },
    {
      title: "Title 5",
      description: "Description 5",
      image: "ruta_imagen_5",
      onSale: false,
    },
    {
      title: "Title 6",
      description: "Description 6",
      image: "ruta_imagen_6",
      onSale: false,
    },
  ];

  constructor(
    private loginService: LoginService,
    private productsTypeService: ProductsTypeService,
    private imageService: ImageService,
    private loadingService: LoadingService,
    private toastrService: ToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.admin = this.loginService.isAdmin();
    this.doSearch();
  }

  async doSearch() {
    const loading = await this.loadingService.loading();
    await loading.present();
    try {
      this.productsTypeService.getProductsTypes().subscribe(data => {
        this.productsTypeList = data.results;
        this.setImages(this.productsTypeList);
        this.showData = true;
      });
    } finally {
      loading.dismiss();
    }
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
    Swal.fire(DELETE_OPTS).then(async result => {
      if (result.isConfirmed) {
        const loading = await this.loadingService.loading();
        await loading.present();
        this.productsTypeService
          .deleteProductsTypes(id)
          .pipe(finalize(() => loading.dismiss()))
          .subscribe(() => {
            this.toastrService.success("Categoria eliminada");
            loading.dismiss();
            this.doSearch();
          });
      }
    });
  }
}

import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { DELETE_OPTS } from 'src/app/common/constants/messages.constant';
import { Avatar } from '@common/models/avatar';

import { ImageService } from '@common/services/image.service';
import { LoadingService } from '@common/services/loading.service';
import { LoginService } from '@common/services/login.service';
import { ToastrService } from 'ngx-toastr';
import { ProductsService } from '../services/products.service';
import { ProductsTypeService } from '../../products-type/services/products-type.service';

import { Products } from '../models/products';

import Swal from 'sweetalert2';
import { IonInfiniteScroll } from '@ionic/angular';

@Component({
  selector: 'app-products.list',
  templateUrl: './products.list.component.html',
  styleUrls: ['./products.list.component.scss'],
})
export class ProductsListComponent implements OnInit {
  productsList: Products[] = [];
  oldProductsList: Products[] = [];
  imagesUrl$!: Observable<string>[];
  admin: boolean = false;
  showData: boolean = false;
  hide: boolean = true;
  category: string | undefined = '';

  currentPage = 1;
  infiniteScrollLoading = false;
  noMoreData: boolean = false;

  filterCheck: boolean = false;

  @ViewChild(IonInfiniteScroll) infiniteScroll!: IonInfiniteScroll;
  @ViewChild('wrapper') wrapperRef!: ElementRef<HTMLDivElement>;
  scrollingTimer: any;

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

  onScroll(event: Event) {
    const element = event.target as HTMLElement;
    const wrapper = this.wrapperRef.nativeElement;

    if (wrapper.scrollHeight - wrapper.scrollTop <= element.clientHeight + 20) {
      if (!this.noMoreData && !this.infiniteScrollLoading) {
        this.loadMoreData();
      }
    }

    if (element.scrollHeight > element.clientHeight) {
      wrapper.classList.add('show-scrollbar');
      clearTimeout(this.scrollingTimer);

      this.scrollingTimer = setTimeout(() => {
        wrapper.classList.remove('show-scrollbar');
      }, 1500);
    }
  }

  getAndSearchByType(): void {
    this.route.params.subscribe(params => {
      const typeId = params['idCat'];
      if (typeId) {
        this.productsTypeService.getProductsType(typeId).subscribe(data => {
          this.category = data.description;
          this.doSearch();
        });
      }
    });
  }

  redirectToProductsEdit(productId: string) {
    this.router.navigate(['edit/', productId], {
      relativeTo: this.route.parent,
    });
  }
  redirectToProductsAdd() {
    this.router.navigate(['add/'], {
      relativeTo: this.route.parent,
    });
  }
  redirectToDetails(productId: string) {
    this.router.navigate(['details/', productId], {
      relativeTo: this.route.parent,
    });
  }

  async doSearch() {
    const loading = await this.loadingService.loading();
    await loading.present();
    try {
      this.productsService
        .getProducts(this.currentPage, 10, this.category)
        .subscribe(data => {
          this.productsList = data.results;
          this.setImages(this.productsList);
          const hasVisibleProducts = this.productsList.some(
            product => product.baja === 0
          );
          if (
            !this.admin &&
            (data.results.length === 0 || !hasVisibleProducts)
          ) {
            Swal.fire({
              icon: 'info',
              title: 'No hay productos',
              text: 'Aun no hay productos cargados para esta categoría.',
            }).then(() => {
              this.router.navigate(['/menu/categories']);
            });
          }
          this.showData = true;
        });
    } finally {
      loading.dismiss();
      this.currentPage++;
      this.infiniteScroll && this.infiniteScroll.complete();
    }
  }

  loadMoreData() {
    this.infiniteScrollLoading = true;
    this.productsService
      .getProducts(this.currentPage, 10, this.category)
      .subscribe(response => {
        if (response.results.length == 0) this.noMoreData = true;
        if (this.filterCheck) {
          this.productsList.push(
            ...response.results.filter(prod => prod.baja == 0)
          );
        } else {
          this.productsList.push(...response.results);
        }
        this.setImages(this.productsList);
        this.currentPage++;
        this.infiniteScroll && this.infiniteScroll.complete();
        this.infiniteScrollLoading = false;
      });
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
            this.toastrService.success('Producto eliminado');
            loading.dismiss();
            this.currentPage = 1;
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

  toggleInfiniteScroll() {
    this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
  }

  togglePromotionsVisibility(event: any) {
    this.filterCheck = event.detail.checked;
    if (this.filterCheck) {
      this.filterData();
    } else {
      this.currentPage = 2;
      this.productsList = this.oldProductsList;
      this.currentPage = 2;
      this.setImages(this.productsList);
      this.noMoreData = false;
    }
  }

  async filterData() {
    const loading = await this.loadingService.loading();
    await loading.present();

    this.oldProductsList = this.productsList;

    this.productsList = this.productsList.filter(products => {
      return !products.baja;
    });
    this.setImages(this.productsList);

    loading.dismiss();
  }
}

import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonInfiniteScroll } from '@ionic/angular';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

import { Avatar } from '@common/models/avatar';
import { ImageService } from '@common/services/image.service';
import { LoadingService } from '@common/services/loading.service';
import { LoginService } from '@common/services/login.service';

import { ProductsType } from '../models/productsType';
import { Promotion } from '../../promotions/models/promotion';

import { ProductsTypeService } from '../services/products-type.service';
import { PromotionsService } from '../../promotions/services/promotions.service';

import { DELETE_OPTS } from 'src/app/common/constants/messages.constant';
import { isPromotionValid } from '../../../../common/validations/validation-functions';

@Component({
  selector: 'app-products-type.list',
  templateUrl: './products-type.list.component.html',
  styleUrls: ['./products-type.list.component.scss'],
})
export class ProductsTypeListComponent implements OnInit {
  productsTypeList!: ProductsType[];
  promotionsList!: Promotion[];
  validPromotionsList!: Promotion[];
  imagesUrl$!: Observable<string>[];
  imagesUrlPromotions$!: Observable<string>[];
  admin: boolean = false;
  showData: boolean = false;
  loading = true;

  currentPage = 1;
  currentPromPage = 1;
  count = 0;
  promCount = 0;
  infiniteScrollLoading = false;

  @ViewChild(IonInfiniteScroll) infiniteScroll!: IonInfiniteScroll;

  @ViewChild('wrapper') wrapperRef!: ElementRef<HTMLDivElement>;
  @ViewChild('PromWrapper') promWrapperRef!: ElementRef<HTMLDivElement>;

  scrollingTimer: any;

  constructor(
    private loginService: LoginService,
    private productsTypeService: ProductsTypeService,
    private promotionsService: PromotionsService,
    private imageService: ImageService,
    private loadingService: LoadingService,
    private toastrService: ToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  onScroll(event: Event) {
    const element = event.target as HTMLElement;
    const wrapper = this.wrapperRef.nativeElement;

    if (wrapper.scrollHeight - wrapper.scrollTop <= element.clientHeight) {
      if (
        this.productsTypeList.length < this.count &&
        !this.infiniteScrollLoading
      ) {
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

  onPromScroll(event: Event) {
    const element = event.target as HTMLElement;
    const wrapper2 = this.promWrapperRef.nativeElement;
    if (wrapper2.scrollHeight - wrapper2.scrollTop <= element.clientHeight) {
      if (
        this.promotionsList.length < this.promCount &&
        !this.infiniteScrollLoading
      ) {
        this.loadMorePromData();
      }
    }
  }

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
        this.count = data.count;
        this.setImages(this.productsTypeList);
        this.showData = true;
        this.loading = false;
      });
      this.promotionsService
        .getPromotions(this.currentPromPage, 2)
        .subscribe(data => {
          this.promotionsList = data.results;
          this.validPromotionsList = this.getValidPromotions(
            this.promotionsList
          );
          this.promCount = data.count;
          this.setImagesPromotions(this.promotionsList);
          this.showData = true;
        });
    } finally {
      loading.dismiss();
      this.currentPage++;
      this.currentPromPage++;
      this.infiniteScroll && this.infiniteScroll.complete();
    }
  }

  getValidPromotions(promotions: Promotion[]): Promotion[] {
    return promotions.filter(
      promotion => !promotion.baja && this.isPromotionValid(promotion)
    );
  }

  loadMoreData() {
    this.infiniteScrollLoading = true;
    this.productsTypeService
      .getProductsTypes(this.currentPage, 10)
      .subscribe(response => {
        this.productsTypeList.push(...response.results);
        this.setImages(this.productsTypeList);
        this.currentPage++;
        this.infiniteScroll && this.infiniteScroll.complete();
        this.infiniteScrollLoading = false;
      });
  }

  loadMorePromData() {
    this.infiniteScrollLoading = true;
    this.promotionsService
      .getPromotions(this.currentPromPage, 10)
      .subscribe(data => {
        this.promotionsList.push(...data.results);
        this.validPromotionsList = this.getValidPromotions(this.promotionsList);
        this.setImagesPromotions(this.promotionsList);
        this.currentPromPage++;
        this.infiniteScroll && this.infiniteScroll.complete();
        this.infiniteScrollLoading = false;
      });
  }

  setImagesPromotions(promotionsList: Promotion[]) {
    this.imagesUrlPromotions$ = promotionsList.map(promotions => {
      return this.getImage(promotions);
    });
  }

  setImages(productsTypeList: ProductsType[]) {
    this.imagesUrl$ = productsTypeList.map(productsType => {
      return this.getImage(productsType);
    });
  }

  getImage(object: ProductsType | Promotion) {
    const image = (object as { image: Avatar }).image;
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
            this.toastrService.success('Categoria eliminada');
            loading.dismiss();
            this.doSearch();
          });
      }
    });
  }

  async deleteProm(id: string) {
    Swal.fire(DELETE_OPTS).then(async result => {
      if (result.isConfirmed) {
        const loading = await this.loadingService.loading();
        await loading.present();
        this.promotionsService
          .deletePromotions(id)
          .pipe(finalize(() => loading.dismiss()))
          .subscribe(() => {
            this.toastrService.success('Promocion eliminada');
            loading.dismiss();
            this.doSearch();
          });
      }
    });
  }

  toggleInfiniteScroll() {
    this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
  }

  redirectToDetails(idProm: string) {
    this.router.navigate(['details/', idProm], {
      relativeTo: this.route.parent,
    });
  }

  getCurrentDate(): Date {
    return new Date();
  }

  isPromotionValid(promotion: Promotion): boolean {
    return isPromotionValid(promotion);
  }
}

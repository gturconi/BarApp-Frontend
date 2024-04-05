import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IonInfiniteScroll } from '@ionic/angular';
import { Router } from '@angular/router';

import { LoadingService } from '@common/services/loading.service';
import { LoginService } from '@common/services/login.service';
import { OrderService } from '../services/order.service';

import { OrderResponse } from '../models/order';

import Swal from 'sweetalert2';
import { User } from '@common/models/user';

@Component({
  selector: 'app-confirmed-orders',
  templateUrl: './confirmed-orders.component.html',
  styleUrls: ['./confirmed-orders.component.scss'],
})
export class ConfirmedOrdersComponent implements OnInit {
  user!: User;
  orderList: OrderResponse[] = [];

  currentPage = 1;
  count = 0;
  showData: boolean = false;
  infiniteScrollLoading = false;

  @ViewChild(IonInfiniteScroll) infiniteScroll!: IonInfiniteScroll;
  @ViewChild('wrapper') wrapperRef!: ElementRef<HTMLDivElement>;
  scrollingTimer: any;

  constructor(
    private loginService: LoginService,
    private loadingService: LoadingService,
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit() {
    this.doSearch();
  }

  async doSearch() {
    const loading = await this.loadingService.loading();
    await loading.present();
    try {
      this.user = this.loginService.getUserInfo();
      this.orderService
        .getUserOrders(this.user.id, this.currentPage, 10, this.user.name)
        .subscribe(data => {
          this.count = data.count;
          this.orderList = data.results;

          if (this.orderList.length == 0) {
            Swal.fire({
              icon: 'info',
              title: 'No hay pedidos pendientes',
              text: 'No tienes ningún pedido pendiente, puedes realizar uno en el menu de categorías',
            }).then(() => {
              this.router.navigate(['/menu/categories']);
            });
          }
          this.showData = true;
          console.log(this.orderList);
        });
    } finally {
      loading.dismiss();
      this.currentPage++;
      this.infiniteScroll && this.infiniteScroll.complete();
    }
  }

  loadMoreData() {
    this.infiniteScrollLoading = true;
    this.orderService
      .getUserOrders(this.user.id, this.currentPage, 10, this.user.name)
      .subscribe(response => {
        this.orderList.push(...response.results);
        this.currentPage++;
        this.infiniteScroll && this.infiniteScroll.complete();
        this.infiniteScrollLoading = false;
      });
  }

  onScroll(event: Event) {
    const element = event.target as HTMLElement;
    const wrapper = this.wrapperRef.nativeElement;

    if (wrapper.scrollHeight - wrapper.scrollTop <= element.clientHeight) {
      if (this.orderList.length < this.count && !this.infiniteScrollLoading) {
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
}

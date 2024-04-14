import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { IonInfiniteScroll, ModalController } from '@ionic/angular';
import { finalize } from 'rxjs';

import { TablesService } from '../services/tables.service';
import { LoadingService } from '@common/services/loading.service';
import { ToastrService } from 'ngx-toastr';
import { LoginService } from '@common/services/login.service';

import { Table } from '../models/table';
import {
  DELETE_OPTS,
  VACATE_TABLE,
} from 'src/app/common/constants/messages.constant';
import { SocketService } from '@common/services/socket.service';
import { OrderService } from '../../order/services/order.service';
import { SafeUrl } from '@angular/platform-browser';
import { ModalComponent } from '@common-ui/modal/modalComponent';
import { ORDER_STATES } from '../../order/models/order';
import { QR } from '../models/qr';

@Component({
  selector: 'app-tables.list',
  templateUrl: './tables.list.component.html',
  styleUrls: ['./tables.list.component.scss'],
})
export class TablesListComponent implements OnInit {
  tableList: Table[] = [];
  qrsList: QR[] = [];
  currentPage = 1;
  count = 0;
  showData: boolean = false;
  infiniteScrollLoading = false;
  admin = false;
  public qrCodeDownloadLink: SafeUrl = '';

  @ViewChild(IonInfiniteScroll) infiniteScroll!: IonInfiniteScroll;
  @ViewChild('wrapper') wrapperRef!: ElementRef<HTMLDivElement>;
  scrollingTimer: any;

  constructor(
    private tableService: TablesService,
    private loadingService: LoadingService,
    private toastrService: ToastrService,
    private loginService: LoginService,
    private socketService: SocketService,
    private orderService: OrderService,
    public modalController: ModalController
  ) {
    this.socketService.getMessage().subscribe(data => {
      this.currentPage = 1;
      this.doSearch();
    });
  }

  ngOnInit() {
    this.admin = this.loginService.isAdmin();
    this.tableService.getQrs().subscribe(qr => this.qrsList.push(...qr));
  }

  ngOnDestroy() {
    this.socketService.disconnect();
  }

  onScroll(event: Event) {
    const element = event.target as HTMLElement;
    const wrapper = this.wrapperRef.nativeElement;

    if (wrapper.scrollHeight - wrapper.scrollTop <= element.clientHeight + 20) {
      if (this.tableList.length < this.count && !this.infiniteScrollLoading) {
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

  async doSearch() {
    const loading = await this.loadingService.loading();
    await loading.present();
    try {
      this.tableService.getTables(this.currentPage, 10).subscribe(data => {
        this.tableList = data.results;
        this.count = data.count;
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
    this.tableService.getTables(this.currentPage, 10).subscribe(response => {
      this.tableList.push(...response.results);
      this.currentPage++;
      this.infiniteScroll && this.infiniteScroll.complete();
      this.infiniteScrollLoading = false;
    });
  }

  async delete(id: string) {
    Swal.fire(DELETE_OPTS).then(async result => {
      if (result.isConfirmed) {
        const loading = await this.loadingService.loading();
        await loading.present();
        this.tableService
          .deleteTable(id)
          .pipe(finalize(() => loading.dismiss()))
          .subscribe(() => {
            this.toastrService.success('Mesa eliminada');
            loading.dismiss();
            this.currentPage = 1;
            this.doSearch();
          });
      }
    });
  }

  toggleInfiniteScroll() {
    this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
  }

  onChangeURL(url: SafeUrl) {
    this.qrCodeDownloadLink = url;
  }

  vacateTable(tableNumber: number) {
    let table = this.tableList.find(table => table.number == tableNumber);
    if (table != undefined) {
      table.idState = 1;
      Swal.fire(VACATE_TABLE).then(async result => {
        if (result.isConfirmed) {
          const loading = await this.loadingService.loading();
          await loading.present();
          this.tableService
            .putTable(table?.id!, table as Table)
            .pipe(finalize(() => loading.dismiss()))
            .subscribe(() => {
              this.toastrService.success('Mesa desocupada');
              loading.dismiss();
              this.currentPage = 1;
              this.doSearch();
            });
        }
      });
    }
  }

  async openDetails(table: Table) {
    let noPaid = false;
    let items: { key: string; value: string; link: string }[] = [];
    if (table.state == 'Free') return;
    this.orderService.getLastOrderFromTable(table.id).subscribe(orders => {
      if (orders.length > 0) {
        orders.forEach((order: any) => {
          if (order.status != ORDER_STATES[4]) noPaid = true;
          items.push({
            key: 'Pedido: ' + order.id,
            value: 'Estado: ' + order.status,
            link: 'orders/my-orders/confirmed/details/' + order.id,
          });
        });
      } else {
        items.push({
          key: 'No hay pedidos para esta mesa.',
          value: 'Por favor actualice el estado de la misma a "Libre"',
          link: '',
        });
      }
    });

    await this.openModal({
      title: 'Pedidos de la mesa ' + table.number,
      items: items,
      button: noPaid
        ? { title: '' }
        : { title: 'Desocupar mesa', fn: () => this.vacateTable(table.number) },
    });
  }
  async openModal(data: any) {
    const modal = await this.modalController.create({
      component: ModalComponent,
      componentProps: {
        title: data.title,
        items: data.items,
        button: data.button,
      },
    });
    await modal.present();
  }

  getQRCode(tableNumber: string) {
    let idx = this.qrsList.findIndex(qr => qr.tableNumber == tableNumber);
    if (idx != -1) {
      return this.qrsList[idx].token;
    }
    return '';
  }
}

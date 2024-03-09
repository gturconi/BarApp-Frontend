import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { IonInfiniteScroll } from '@ionic/angular';
import { finalize } from 'rxjs';

import { TablesService } from '../services/tables.service';
import { LoadingService } from '@common/services/loading.service';
import { ToastrService } from 'ngx-toastr';
import { LoginService } from '@common/services/login.service';

import { Table } from '../models/table';
import { DELETE_OPTS } from 'src/app/common/constants/messages.constant';
import { SocketService } from '@common/services/socket.service';
import { SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-tables.list',
  templateUrl: './tables.list.component.html',
  styleUrls: ['./tables.list.component.scss'],
})
export class TablesListComponent implements OnInit {
  tableList: Table[] = [];
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
    private socketService: SocketService
  ) {
    this.socketService.getMessage().subscribe(data => {
      this.currentPage = 1;
      this.doSearch();
    });
  }

  ngOnInit() {
    this.admin = this.loginService.isAdmin();
  }

  ngOnDestroy() {
    this.socketService.disconnect();
  }

  onScroll(event: Event) {
    const element = event.target as HTMLElement;
    const wrapper = this.wrapperRef.nativeElement;

    if (wrapper.scrollHeight - wrapper.scrollTop <= element.clientHeight) {
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
}

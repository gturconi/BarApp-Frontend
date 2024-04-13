import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TableColumn, TableData } from '@common-ui/table/table.component';
import { OrderService } from '../services/order.service';
import { LoadingService } from '@common/services/loading.service';

@Component({
  selector: 'app-order.admin.list',
  templateUrl: './order.admin.list.component.html',
  styleUrls: ['./order.admin.list.component.scss'],
})
export class OrderAdminListComponent implements OnInit {
  columns: TableColumn[] = [];
  data: TableData[] = [];
  isLoading!: any;
  loading = false;
  totalPages: number = 1;
  pageSize: number = 10;
  pageIndex: number = 1;
  filtro: string = '';

  constructor(
    private ordersService: OrderService,
    private router: Router,
    private loadingService: LoadingService
  ) {}

  async ngOnInit() {
    this.columns = [
      { key: 'id', label: 'Número' },
      { key: 'table_order.number', label: 'Mesa' },
      { key: 'employee.name', label: 'Mesero' },
      { key: 'date_created', label: 'Fecha' },
      { key: 'user.name', label: 'Cliente' },
      { key: 'state.description', label: 'Estado' },
      { key: 'total', label: 'Total' },
    ] as TableColumn[];

    this.loading = true;
    this.isLoading = await this.loadingService.loading();
    await this.isLoading.present();
    this.doSearch();
  }

  doSearch(): void {
    this.ordersService
      .getOrders(this.pageIndex, this.pageSize)
      .subscribe(response => {
        this.data = response.results as unknown as TableData[];
        console.log(this.data);
        this.isLoading.dismiss();
        this.loading = false;
        this.totalPages = response.totalPages;
      });
  }

  onPageChanged(e: number): void {
    this.pageIndex = e;
    if (this.filtro != '') {
      this.busquedaFiltrada();
    } else {
      this.doSearch();
    }
  }

  ocultarAccion(user: TableData) {
    return !!user['baja'];
  }

  filterOrders(value: string) {
    if (value === '') {
      this.filtro = '';
      this.pageIndex = 1;
      this.doSearch();
    } else {
      this.filtro = value;
      this.busquedaFiltrada();
    }
  }

  async busquedaFiltrada() {
    this.isLoading = await this.loadingService.loading();
    this.isLoading.present();
    this.ordersService
      .getOrders(this.pageIndex, this.pageSize, this.filtro)
      .subscribe(response => {
        this.data = response.results as unknown as TableData[];
        this.totalPages = response.totalPages;
        this.isLoading.dismiss();
      });
  }
}

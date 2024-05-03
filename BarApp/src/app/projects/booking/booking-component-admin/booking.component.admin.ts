import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TableColumn, TableData } from '@common-ui/table/table.component';
import { BookingService } from '../services/booking.service';
import { LoadingService } from '@common/services/loading.service';
import { DELETE_OPTS } from '@common/constants/messages.constant';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-admin-booking',
  templateUrl: './booking.component.admin.html',
})
export class BookingComponentAdmin {
  columns: TableColumn[] = [];
  data: TableData[] = [];

  isLoading!: any;
  loading = false;

  totalPages: number = 1;

  pageSize: number = 10;

  pageIndex: number = 1;

  filtro: string = '';

  constructor(
    private bookingService: BookingService,
    private loadingService: LoadingService
  ) {}

   ngOnInit() {
    this.columns = [
      
      {
        key: 'email',
        label: 'Email',
      },
      {
        key: 'date',
        label: 'Fecha',
      },
      {
        key: 'hour',
        label: 'Hora'
      },
      {
        key: 'description',
        label: 'Estado',
      },
      {
        key: 'quota',
        label: 'Comensales',
      },
      {
        key: '',
        label: 'Cancelar',
        action: params => this.cancelarReserva(params),
        hideAction: this.ocultarAccion,
        actionClass: 'table-red-button',
      },
      {
        key: '',
        label: 'Confirmar',
        action: params => this.confirmarReserva(params),
        actionClass: 'table-blue-button bookingAdminConfirmButton',
      },
    ] as TableColumn[];

    //this.isLoading = await this.loadingService.loading();
    //await this.isLoading.present();
    this.doSearch();
  }

  formatDateHour(dateAsString: string): Record<'date' | 'hour', string> {
    if (!dateAsString) return {
      date: '',
      hour: '',
    };
    const date = new Date(dateAsString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return {
      date: `${year}-${month}-${day}`,
      hour: `${hours}:${minutes}`,
    };
  }

  async doSearch() {
    let loading = await this.loadingService.loading();
    await loading.present();
    this.bookingService
      .getBookings(this.pageIndex, this.pageSize)
      .subscribe(response => {
        this.data = response.results.map(({quota, date_hour, email, description}: any) => {
          const {date, hour} = this.formatDateHour(date_hour);
          return {quota, date, hour, email, description}
        }) as unknown as TableData[];
        loading.dismiss();
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

  async cancelarReserva(booking: TableData) {
    //deberia en vez de ese DELETEOPTS mostrar otro mensaje de cancelacion reserva
    Swal.fire(DELETE_OPTS).then(async result => {
      if (result.isConfirmed) {
        const loading = await this.loadingService.loading();
        await loading.present();
        this.bookingService.cancelBooking(booking['id'] as string).subscribe(() => {
          const idx = this.data.findIndex(u => u['id'] === booking['id']);
          if (idx !== -1) {
            this.data.splice(idx, 1, { ...booking, stateId: 3 });
          }
          loading.dismiss();
          this.doSearch();
        });
      }
    });
  }

  async confirmarReserva(booking: TableData) {
    //deberia en vez de ese DELETEOPTS mostrar otro mensaje de confirmacion reserva
    Swal.fire(DELETE_OPTS).then(async result => {
      if (result.isConfirmed) {
        const loading = await this.loadingService.loading();
        await loading.present();
        this.bookingService.confirmBooking(booking['id'] as string).subscribe(() => {
          const idx = this.data.findIndex(u => u['id'] === booking['id']);
          if (idx !== -1) {
            this.data.splice(idx, 1, { ...booking, stateId: 2 });
          }
          loading.dismiss();
          this.doSearch();
        });
      }
    });
  }


  async busquedaFiltrada() {
    this.isLoading = await this.loadingService.loading();
    this.isLoading.present();
    this.bookingService
      .getBookings(this.pageIndex, this.pageSize, this.filtro)
      .subscribe(response => {
        this.data = response.results as unknown as TableData[];
        this.totalPages = response.totalPages;
        this.isLoading.dismiss();
      });
  }
}
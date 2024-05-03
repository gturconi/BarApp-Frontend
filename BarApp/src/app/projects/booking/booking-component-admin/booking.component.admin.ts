import { Component } from '@angular/core';
import { TableColumn, TableData } from '@common-ui/table/table.component';
import { BookingService } from '../services/booking.service';
import { LoadingService } from '@common/services/loading.service';
import {
  BOOKING_CANCEL_CONFIRMATION_MESSAGE,
  BOOKING_CONFIRM_CONFIRMATION_MESSAGE,
} from '@common/constants/messages.constant';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

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
    private loadingService: LoadingService,
    private toastrService: ToastrService
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
        label: 'Hora',
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
        hideAction: this.ocultarAccion,
        actionClass: 'table-blue-button bookingAdminConfirmButton',
      },
    ] as TableColumn[];

    this.doSearch();
  }

  formatDateHour(dateAsString: string): Record<'date' | 'hour', string> {
    if (!dateAsString)
      return {
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
        this.data = response.results.map(
          ({ quota, date_hour, email, description, id }: any) => {
            const { date, hour } = this.formatDateHour(date_hour);
            return { quota, date, hour, email, description, id };
          }
        ) as unknown as TableData[];
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

  ocultarAccion(data: TableData): boolean {
    return (data['description'] as string)?.toLowerCase() !== 'pendiente';
  }

  async cancelarReserva(booking: TableData) {
    Swal.fire(BOOKING_CANCEL_CONFIRMATION_MESSAGE).then(async result => {
      if (result.isConfirmed) {
        const loading = await this.loadingService.loading();
        await loading.present();
        this.bookingService
          .cancelBooking(booking['id'] as string)
          .subscribe(() => {
            const idx = this.data.findIndex(u => u['id'] === booking['id']);
            if (idx !== -1) {
              this.data.splice(idx, 1, { ...booking, stateId: 3 });
            }
            loading.dismiss();
            this.toastrService.success('Reserva cancelada exitosamente.');
            this.doSearch();
          });
      }
    });
  }

  async confirmarReserva(booking: TableData) {
    Swal.fire(BOOKING_CONFIRM_CONFIRMATION_MESSAGE).then(async result => {
      if (result.isConfirmed) {
        const loading = await this.loadingService.loading();
        await loading.present();
        this.bookingService
          .confirmBooking(booking['id'] as string)
          .subscribe(() => {
            const idx = this.data.findIndex(u => u['id'] === booking['id']);
            if (idx !== -1) {
              this.data.splice(idx, 1, { ...booking, stateId: 2 });
            }
            loading.dismiss();
            this.toastrService.success('Reserva confirmada exitosamente.');
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

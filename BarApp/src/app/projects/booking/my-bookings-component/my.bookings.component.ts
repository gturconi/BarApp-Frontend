import { Component } from '@angular/core';
import { TableColumn, TableData } from '@common-ui/table/table.component';
import { BookingService } from '../services/booking.service';
import { LoadingService } from '@common/services/loading.service';
import { ToastrService } from 'ngx-toastr';
import { LoginService } from '@common/services/login.service';
import { BOOKING_CANCEL_CONFIRMATION_MESSAGE } from '@common/constants/messages.constant';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-my-bookings',
  templateUrl: './my.bookings.component.html',
})
export class MyBookingsComponent {
  columns: TableColumn[] = [];
  data: TableData[] = [];
  isLoading!: any;
  loading = false;

  constructor(
    private bookingService: BookingService,
    private loadingService: LoadingService,
    private loginService: LoginService,
    private toastrService: ToastrService
  ) {}

  ngOnInit() {
    this.columns = [
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
        key: '',
        label: 'Cancelar',
        action: params => this.cancelarReserva(params),
        hideAction: this.ocultarAccion,
        actionClass: 'table-red-button',
      },
      {
        key: 'quota',
        label: 'Comensales',
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
    try {
      if (this.loginService.getUserInfo()?.id) {
        let loading = await this.loadingService.loading();
        await loading.present();
        this.bookingService
          .getFutureBookings(this.loginService.getUserInfo()?.id)
          .subscribe(response => {
            this.data = response.map(
              ({ quota, date_hour, description }: any) => {
                const { date, hour } = this.formatDateHour(date_hour);
                return { quota, date, hour, description };
              }
            ) as unknown as TableData[];
            loading.dismiss();
          });
      }
    } catch (error) {
      console.log(error);
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
}

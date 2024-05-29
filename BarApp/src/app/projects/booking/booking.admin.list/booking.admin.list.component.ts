import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';

import { BookingService } from '../services/booking.service';
import { LoadingService } from '@common/services/loading.service';
import { FcmService } from '@common/services/fcm.service';
import { ToastrService } from 'ngx-toastr';

import { TableColumn, TableData } from '@common-ui/table/table.component';
import { BOOKING_STATES, State } from '../models/booking';
import {
  BOOKING_CANCEL,
  BOOKING_CONFIRM,
} from '@common/constants/messages.constant';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-booking.admin.list',
  templateUrl: './booking.admin.list.component.html',
  styleUrls: ['./booking.admin.list.component.scss'],
})
export class BookingAdminListComponent implements OnInit {
  columns: TableColumn[] = [];
  data: TableData[] = [];
  isLoading!: any;
  loading = false;
  totalPages: number = 1;
  pageSize: number = 10;
  pageIndex: number = 1;
  filtro: string = '';
  form!: FormGroup;
  @ViewChild('myForm', { static: false })
  myForm!: ElementRef;

  constructor(
    private bookingService: BookingService,
    private loadingService: LoadingService,
    private toastrService: ToastrService,
    private fmcService: FcmService
  ) {
    this.form = new FormGroup({
      cancelReason: new FormControl(''),
    });
  }

  async ngOnInit() {
    this.columns = [
      { key: 'user.name', label: 'Usuario' },
      { key: 'date_hour', label: 'Fecha Hora' },
      { key: 'state.description', label: 'Estado' },
      { key: 'quota', label: 'Comensales' },
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

    this.loading = true;
    this.isLoading = await this.loadingService.loading();
    await this.isLoading.present();
    this.doSearch();
  }

  doSearch(): void {
    this.bookingService
      .getBookings(this.pageIndex, this.pageSize)
      .subscribe(response => {
        this.data = response.results as unknown as TableData[];
        this.isLoading.dismiss();
        this.loading = false;
        this.totalPages = response.totalPages;
      });
  }

  getCancelReasonControl = () => {
    return this.form.get('cancelReason') as FormControl;
  };

  async cancelarReserva(booking: TableData) {
    Swal.fire({ ...BOOKING_CANCEL, html: this.myForm.nativeElement }).then(
      async result => {
        if (result.isConfirmed) {
          const loading = await this.loadingService.loading();
          await loading.present();
          const cancelReason = this.form.get('cancelReason')?.value;
          this.bookingService
            .cancelBooking(booking['id'] as string, cancelReason)
            .subscribe(() => {
              const idx = this.data.findIndex(u => u['id'] === booking['id']);
              if (idx !== -1) {
                this.data.splice(idx, 1, { ...booking, stateId: 3 });
              }
              this.fmcService
                .sendPushNotification(
                  'Reserva Cancelada',
                  `Lamentamos informarle que no hay mesas disponibles en este momento`,
                  '',
                  JSON.parse(JSON.stringify(booking['user'])).id
                )
                .subscribe();
              loading.dismiss();
              this.toastrService.success('Reserva cancelada exitosamente.');
              this.doSearch();
            });
        }
      }
    );
  }

  async confirmarReserva(booking: TableData) {
    Swal.fire(BOOKING_CONFIRM).then(async result => {
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
            this.fmcService
              .sendPushNotification(
                '¡Reserva Confirmada!',
                `Le informamos que su reserva ya ha sido confirmada.`,
                '',
                JSON.parse(JSON.stringify(booking['user'])).id
              )
              .subscribe();
            loading.dismiss();
            this.toastrService.success('Reserva confirmada exitosamente.');
            this.doSearch();
          });
      }
    });
  }

  ocultarAccion(data: TableData): boolean {
    const dataJson = JSON.parse(
      JSON.stringify(data['state'] as string)
    ) as State;
    return dataJson.description !== BOOKING_STATES[1];
  }

  onPageChanged(e: number): void {
    this.pageIndex = e;
    if (this.filtro != '') {
      this.busquedaFiltrada();
    } else {
      this.doSearch();
    }
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
    this.bookingService
      .getBookings(this.pageIndex, this.pageSize, this.filtro)
      .subscribe(response => {
        this.data = response.results as unknown as TableData[];
        this.totalPages = response.totalPages;
        this.isLoading.dismiss();
      });
  }
}

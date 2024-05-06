import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { finalize, switchMap } from 'rxjs/operators';
import { Subject, forkJoin } from 'rxjs';
import { Location } from '@angular/common';

import { ToastrService } from 'ngx-toastr';
import { LoadingService } from '@common/services/loading.service';

import { EntityListResponse } from '@common/models/entity.list.response';
import { DropdownParam } from '@common/models/dropdown';
import { ValidationConfig } from '@common/models/validationConfig';
import { Button, FormField } from '@common/models/formTypes';

import Swal from 'sweetalert2';
import { DELETE_OPTS, INFO_PROM } from '@common/constants/messages.constant';
import { DaysOfWeek, MapDayOfWeek } from '@common/constants/days.of.week.enum';
import { BookingService } from '../services/booking.service';
import { BookingDay } from '../models/booking';
import { TableColumn, TableData } from '@common-ui/table/table.component';

@Component({
  selector: 'app-booking.form',
  templateUrl: './booking.form.component.html',
  styleUrls: ['./booking.form.component.scss'],
})
export class BookingFormComponent implements OnInit {
  id = '';
  formTitle = 'Dias y horarios de Reserva';
  editMode = false;

  loading!: HTMLIonLoadingElement;

  form!: FormGroup;
  validationConfig: ValidationConfig[] = [];
  formFields: FormField[] = [];
  myButtons: Button[] = [];

  mobileScreen = false;

  comboParam: DropdownParam[] = [
    {
      title: 'Dias',
      fields: new Subject<any>(),
      defaultValue: new Subject<string>(),
      isMultiple: false,
    },
  ];

  columns: TableColumn[] = [];
  data: TableData[] = [];
  isLoading!: any;
  loadingTable = true;

  constructor(
    private route: ActivatedRoute,
    private toastrService: ToastrService,
    private loadingService: LoadingService,
    private location: Location,
    private bookingService: BookingService
  ) {}

  async ngOnInit() {
    this.loadDays();
    this.setFormInputs();
    this.setupValidationConfig();
    this.mobileScreen = window.innerWidth < 768;

    this.columns = [
      {
        key: 'day_of_week',
        label: 'Día',
        formatter: row => MapDayOfWeek[row.day_of_week],
      },
      { key: 'init_hour', label: 'Hora inicio' },
      { key: 'end_hour', label: 'Hora fin' },
      {
        key: '',
        label: 'Eliminar',
        action: params => this.deleteBookingDay(params),
        actionClass: 'table-red-button',
      },
    ] as TableColumn[];

    this.isLoading = await this.loadingService.loading();
    await this.isLoading.present();
    this.doSearch();
  }

  doSearch(): void {
    this.bookingService.getBookingDays().subscribe(response => {
      console.log(response);
      this.data = response as unknown as TableData[];
      this.isLoading.dismiss();
      this.loadingTable = false;
    });
  }

  async loadDays() {
    this.loading = await this.loadingService.loading();
    await this.loading.present();
    const daysOfWeek = Object.keys(DaysOfWeek).map(key => ({
      id: key,
      description: key,
    }));

    const res = new EntityListResponse(daysOfWeek.length, daysOfWeek, 1, 1);

    this.comboParam[0].fields!.next(res);

    const days = res.results;
    this.comboParam[0].defaultValue!.next(days[0]?.description!);
    this.loading.dismiss();
  }

  setFormInputs() {
    this.formFields = [
      {
        type: 'input',
        name: 'valid_from',
        label: 'Hora Desde',
        inputType: 'time',
      },
      {
        type: 'input',
        name: 'valid_to',
        label: 'Hora Hasta',
        inputType: 'time',
      },
    ];
    this.myButtons = [
      {
        label: this.editMode ? 'Editar' : 'Añadir',
        type: 'submit',
        routerLink: '',
        icon: 'add-circle-outline',
      },
    ];
  }

  setForm(form: FormGroup): void {
    this.form = form;
  }

  async edit(form: FormGroup) {}

  async add(form: FormGroup) {
    const daysArray = Object.values(DaysOfWeek);

    const day = form.controls['Dias'].value as String;
    const dayNumber = daysArray.findIndex(dayOfWeek => dayOfWeek === day);

    if (
      !(
        form.controls['valid_from'].value &&
        form.controls['valid_to'].value &&
        day != ''
      )
    ) {
      this.toastrService.error(
        'Debe seleccionar al menos una rango de fecha o días de la semana.'
      );
      return;
    }
    const bookinDay = new BookingDay(
      dayNumber.toString(),
      form.controls['valid_from'].value,
      form.controls['valid_to'].value
    );

    const loading = await this.loadingService.loading();
    await loading.present();
    this.bookingService
      .postBookingDays(bookinDay)
      .pipe(finalize(() => loading.dismiss()))
      .subscribe(() => {
        this.toastrService.success('Día y hora de reserva añadida');
        loading.dismiss();
        this.doSearch();
      });
  }

  setupValidationConfig() {
    this.validationConfig = [
      {
        controlName: 'valid_from',
        required: true,
        customValidation: (form: FormGroup) => {
          const validFrom = form.get('valid_from');
          const validTo = form.get('valid_to');

          if (validFrom && validTo) {
            const fromDate = validFrom.value;
            const toDate = validTo.value;

            if ((fromDate && !toDate) || (!fromDate && toDate)) {
              validFrom.setErrors({ Timevalid: true });
              validTo.setErrors({ Timevalid: true });
            } else if (fromDate > toDate) {
              validFrom.setErrors({ TimeInvalidRange: true });
              validTo.setErrors(null);
            } else {
              validFrom.setErrors(null);
              validTo.setErrors(null);
            }
          }

          return null;
        },
      },
      { controlName: 'valid_to', required: true },
      { controlName: 'Dias' },
    ];
  }

  deleteBookingDay(booking: TableData) {
    Swal.fire(DELETE_OPTS).then(async result => {
      if (result.isConfirmed) {
        const loading = await this.loadingService.loading();
        await loading.present();
        this.bookingService
          .deleteBookingDay(booking['id'] as string)
          .subscribe(() => {
            loading.dismiss();
            this.doSearch();
            this.toastrService.success('Día y hora de reserva eliminada');
          });
      }
    });
  }
}

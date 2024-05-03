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
import { INFO_PROM } from '@common/constants/messages.constant';
import { DaysOfWeek } from '@common/constants/days.of.week.enum';

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
      isMultiple: true,
    },
  ];

  constructor(
    private route: ActivatedRoute,
    private toastrService: ToastrService,
    private loadingService: LoadingService,
    private location: Location
  ) {}

  ngOnInit() {
    this.loadDays();
    this.setFormInputs();
    //this.setupValidationConfig();
    this.mobileScreen = window.innerWidth < 768;
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
    console.log(this.comboParam);
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
  }

  setForm(form: FormGroup): void {
    this.form = form;
  }

  async edit(form: FormGroup) {}

  async add(form: FormGroup) {}

  setupValidationConfig() {
    this.validationConfig = [
      { controlName: 'valid_from', required: true },
      { controlName: 'valid_to', required: true },
      { controlName: 'Dias' },
    ];
  }
}

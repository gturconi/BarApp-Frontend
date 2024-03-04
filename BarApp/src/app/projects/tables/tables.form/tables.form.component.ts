import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Button, FormField } from '@common/models/formTypes';

import { TablesService } from '../services/tables.service';
import { LoadingService } from '@common/services/loading.service';
import { ToastrService } from 'ngx-toastr';
import { Table } from '../models/table';
import { finalize } from 'rxjs';
import { ValidationConfig } from '@common/models/validationConfig';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-tables.form',
  templateUrl: './tables.form.component.html',
  styleUrls: ['./tables.form.component.scss'],
})
export class TablesFormComponent implements OnInit {
  id = '';
  formTitle = 'Añadir Mesa';
  editMode = false;
  form!: FormGroup;
  validationConfig: ValidationConfig[] = [];
  formFields: FormField[] = [];
  myButtons: Button[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tableService: TablesService,
    private toastrService: ToastrService,
    private loadingService: LoadingService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params['id'];
      if (this.id) {
        this.editMode = true;
        this.formTitle = 'Editar Mesa';
        this.autocompleteForm();
      }
      this.setFormInputs();
      this.setupValidationConfig();
    });
  }

  async autocompleteForm() {
    const loading = await this.loadingService.loading();
    await loading.present();
    this.tableService.getTable(this.id).subscribe(data => {
      this.form.get('number')?.setValue(data.number);
      loading.dismiss();
    });
  }

  setForm(form: FormGroup): void {
    this.form = form;
  }

  async add(form: FormGroup) {
    const table: Table = {
      id: '',
      number: form.value.number!,
      idState: 1,
    };

    const loading = await this.loadingService.loading();
    await loading.present();
    this.tableService
      .postTable(table)
      .pipe(finalize(() => loading.dismiss()))
      .subscribe(() => {
        this.toastrService.success('Mesa añadida');
        loading.dismiss();
        this.router.navigate(['/tables']);
      });
  }

  async edit(form: FormGroup) {
    const table: Table = {
      id: this.id,
      number: form.value.number!,
    };

    const loading = await this.loadingService.loading();
    await loading.present();
    this.tableService
      .putTable(this.id, table)
      .pipe(finalize(() => loading.dismiss()))
      .subscribe(() => {
        this.toastrService.success('Mesa editada');
        loading.dismiss();
        this.router.navigate(['/tables']);
      });
  }

  setFormInputs() {
    this.formFields = [
      {
        type: 'input',
        name: 'number',
        label: 'Numero',
        inputType: 'number',
        icon: 'material-symbols-outlined',
        iconName: 'table_restaurant',
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

  setupValidationConfig() {
    this.validationConfig = [
      {
        controlName: 'number',
        required: true,
        min: 0,
        IntegerPattern: '^[0-9]*$',
      },
    ];
  }
}

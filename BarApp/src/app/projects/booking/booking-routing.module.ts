import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookingComponent } from './booking/booking.component';

import { adminGuard, authGuard } from '@common/guards';
import { BookingAdminListComponent } from './booking.admin.list/booking.admin.list.component';
import { MyBookingsComponent } from './my-bookings/my-bookings.component';
import { BookingAddComponent } from './booking.add/booking.add.component';
import { BookingFormComponent } from './booking.form/booking.form.component';

const routes: Routes = [
  {
    path: '',
    component: BookingComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        component: BookingAdminListComponent,
        canActivate: [authGuard, adminGuard],
      },
      {
        path: 'my-bookings',
        component: MyBookingsComponent,
        canActivate: [authGuard],
      },
      {
        path: 'day',
        component: BookingFormComponent,
        canActivate: [authGuard, adminGuard],
      },
      {
        path: 'add',
        component: BookingAddComponent,
        canActivate: [authGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BookingRoutingModule {}

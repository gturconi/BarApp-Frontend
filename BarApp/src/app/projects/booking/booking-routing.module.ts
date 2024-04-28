import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookingComponent } from './booking-component/booking.component';
import {BookingRouteComponent } from './booking-route/booking.route.component';
import { BookingService } from './services/booking.service';

const routes: Routes = [
  {
    path: '',
    component: BookingRouteComponent,
    children: [
      {
        path: '',
        component: BookingComponent,
      },
    ]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [BookingService]
})
export class BookingRoutingModule {}

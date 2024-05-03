import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookingComponent } from './booking-component/booking.component';
import { BookingRouteComponent } from './booking-route/booking.route.component';
import { BookingService } from './services/booking.service';
import { BookingComponentAdmin } from './booking-component-admin/booking.component.admin';
import { MyBookingsComponent } from './my-bookings-component/my.bookings.component';

const routes: Routes = [
  {
    path: '',
    component: BookingRouteComponent,
    children: [
      {
        path: '',
        component: BookingComponent,
      },
      {
        path: 'admin',
        component: BookingComponentAdmin,
      },
      {
        path: 'my-bookings',
        component: MyBookingsComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [BookingService],
})
export class BookingRoutingModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { CommonUiModule } from '@common-ui/common-ui.module';

import { BookingComponent } from './booking-component/booking.component';
import { BookingRoutingModule } from './booking-routing.module';
import { BookingRouteComponent } from './booking-route/booking.route.component';
import { BookingComponentAdmin } from './booking-component-admin/booking.component.admin';
import { MyBookingsComponent } from './my-bookings-component/my.bookings.component';

@NgModule({
  declarations: [
    BookingRouteComponent,
    BookingComponent,
    BookingComponentAdmin,
    MyBookingsComponent,
  ],
  imports: [CommonModule, BookingRoutingModule, CommonUiModule, IonicModule],
  exports: [BookingRouteComponent],
})
export class BookingModule {}

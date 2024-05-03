import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonUiModule } from '@common-ui/common-ui.module';

import { BookingRoutingModule } from './booking-routing.module';
import { IonicModule } from '@ionic/angular';

import { BookingAddComponent } from './booking.add/booking.add.component';
import { BookingAdminListComponent } from './booking.admin.list/booking.admin.list.component';
import { BookingComponent } from './booking/booking.component';
import { MyBookingsComponent } from './my-bookings/my-bookings.component';

@NgModule({
  declarations: [
    BookingAddComponent,
    BookingAdminListComponent,
    BookingComponent,
    MyBookingsComponent,
  ],
  imports: [CommonModule, BookingRoutingModule, CommonUiModule, IonicModule],
})
export class BookingModule {}

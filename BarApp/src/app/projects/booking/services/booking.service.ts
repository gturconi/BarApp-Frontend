import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EntityListResponse } from '@common/models/entity.list.response';
import { environment } from 'src/environments/environment';
import { Booking, BookingDay } from '@common/models/booking';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getBookingDays() {
    return this.http.get<BookingDay[]>(this.apiUrl + '/bookingDays/');
  }

  getBookings(page: number = 1, limit: number = 2, search: string = '') {
    return this.http.get<EntityListResponse<Booking>>(
      this.apiUrl + '/bookings/',
      {
        params: { search, page, limit },
      }
    );
  }

  getFutureBookings(userId: number) {
    return this.http.get<Booking[]>(this.apiUrl + '/bookings/user/' + userId);
  }

  postSelectedBooking(selectedBooking: Booking) {
    console.log(selectedBooking);
    return this.http.post<Booking>(this.apiUrl + '/bookings', selectedBooking);
  }

  cancelBooking(id: string) {
    return this.http.put(this.apiUrl + '/bookings/cancel/' + id, {});
  }

  confirmBooking(id: string) {
    return this.http.put(this.apiUrl + '/bookings/confirm/' + id, {});
  }
}

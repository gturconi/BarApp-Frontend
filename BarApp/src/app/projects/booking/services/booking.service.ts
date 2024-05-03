import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EntityListResponse } from '@common/models/entity.list.response';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import {
  BookingRequest,
  BoookingResponse,
  UserFutureBookings,
  BookingDay,
} from '../models/booking';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getBookings(page?: number, limit?: number, search: string = '') {
    return this.http.get<EntityListResponse<BoookingResponse>>(
      `${this.apiUrl}/bookings?search=${search}&page=${page}&limit=${limit}`
    );
  }

  getBookingDays() {
    return this.http.get<BookingDay[]>(this.apiUrl + '/bookingDays/');
  }

  deleteBookingDay(id: string) {
    return this.http.delete(this.apiUrl + '/bookingDays/' + id);
  }

  postBookingDays(bookingDay: BookingDay) {
    return this.http.post<BookingDay>(
      this.apiUrl + '/bookingDays/',
      bookingDay
    );
  }

  getUserFutureBookings(userId: number) {
    return this.http.get<UserFutureBookings[]>(
      this.apiUrl + '/bookings/user/' + userId
    );
  }

  postSelectedBooking(selectedBooking: BookingRequest) {
    console.log(selectedBooking);
    return this.http.post<BookingRequest>(
      this.apiUrl + '/bookings',
      selectedBooking
    );
  }

  cancelBooking(id: string) {
    return this.http.put(this.apiUrl + '/bookings/cancel/' + id, {});
  }

  confirmBooking(id: string) {
    return this.http.put(this.apiUrl + '/bookings/confirm/' + id, {});
  }
}

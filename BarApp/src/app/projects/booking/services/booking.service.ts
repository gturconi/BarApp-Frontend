import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { EntityListResponse } from "@common/models/entity.list.response";
import { environment } from "src/environments/environment";
import { BookingDay } from "@common/models/booking";

@Injectable({
  providedIn: "root",
})
export class BookingService {
  apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) {}
  
  getBookingDays() {    
    return this.http.get<BookingDay[]>(this.apiUrl + "/bookingDays/");
  }
  

}

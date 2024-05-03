import { Component, OnInit } from "@angular/core";
import { Contact } from "@common/models/about";
import { BookingService } from "../services/booking.service";
import { Router } from "@angular/router";
import { LoadingService } from '@common/services/loading.service';
import { RoleService } from "../../users/services/role.service";
import { LoginService } from "@common/services/login.service";
import { ActivatedRoute } from '@angular/router';
import { FormGroup } from "@angular/forms";
import { ContactMessage } from "@common/models/contactMessage";
import { ToastrService } from "ngx-toastr";
import { Booking, BookingDay } from "@common/models/booking";
import { DaysOfWeek } from "@common/constants/days.of.week.enum";
import { MonthsOfYear } from "@common/constants/month.of.years.enum";
import * as moment from "moment-timezone";

interface AvailableHours {
  id: number;
  hour: string;
}

interface SelectedHour {
  hour: string;
  id: number;
}

@Component({
  selector: "app-booking",
  templateUrl: "./booking.component.html",
  providers: [BookingService],
})

export class BookingComponent implements OnInit {
  id = '';
  bookingsDays: Partial<Record<string,BookingDay[]>> = {};
  isLoading!: any;
  form: FormGroup = new FormGroup({});
  editMode = false;
  formTitle = 'Realiza tu reserva';
  formFields!: any[];
  myButtons = [
    {
      label: 'Reservar',
      type: 'submit',
    },
  ];
  validationConfig!: any[];
  selectedDate:{
    formattedDate: string;
    dayName: string;
  } = {
    formattedDate: "",
    dayName: ""
  }
  selectedHour: SelectedHour | undefined = undefined
  
  constructor(private bookingService: BookingService,
    private loginService: LoginService,
    public router: Router, 
    private toastrService: ToastrService,
    private loadingService: LoadingService) {
      this.formFields = [
        {
          type: 'input',
          name: 'quota',
          autocomplete: '',
          label: 'Comensales',
          inputType: 'text',
          icon: 'material-symbols-outlined',
          iconName: 'groups',
        },
        {
            type: 'input',
            name: 'description',
            autocomplete: '',
            label: 'Aclaracion',
            inputType: 'text',
            icon: 'material-symbols-outlined',
            iconName: 'description',
          },
      ];
  
      this.validationConfig = [
        { controlName: 'quota', 
        required: true , 
        minLength: 1,
        maxLength: 3,
        pattern: '^[0-9]*$',},
      ];
    }

    async ngOnInit() {
      this.isLoading = await this.loadingService.loading();
      await this.isLoading.present();
      this.bookingService.getBookingDays().subscribe((response) => {
        this.bookingsDays = response.reduce<Partial<Record<string,BookingDay[]>>>((acc, day)=> {
          const dayOfTheWeekName = Object.values(DaysOfWeek)[day.day_of_week].toString();
          if(!acc[dayOfTheWeekName]){
            acc[dayOfTheWeekName] = [day];
          } else {
            acc[dayOfTheWeekName]!.push(day);
          }
          return acc;
        },{});
        console.log(this.bookingsDays);
        this.isLoading.dismiss();
      })
    }

  getFormattedDate(date: Date) {
    const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Adding 1 because January is month 0
      const day = date.getDate().toString().padStart(2, '0');
      return `${year}-${month}-${day}`;
  }

  getDates() {
    const today = new Date();
    const daysToShow = [today];
    for (let i = 1; i < 8; i++) {
      const nextDay = new Date();
      nextDay.setDate(today.getDate() + i);
      daysToShow.push(nextDay);
    }
    return daysToShow.map((date) => {
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Adding 1 because January is month 0
      const formattedDate = this.getFormattedDate(date);
      const monthName = Object.values(MonthsOfYear)[date.getMonth()];
      return {
        title: `${monthName}-${year}`,
        dayName: Object.values(DaysOfWeek)[date.getDay()],
        dayNumber: date.getDate(),
        month,
        year,
        formattedDate,
      }
    });
  }

  getSelectedDateClass(date: string) {
    if (date === this.selectedDate.formattedDate) {
      return "booking-card selected";
    }
    return "booking-card";
  }

  getSelectedHourClass(hour: SelectedHour) {
    if (hour.hour === this.selectedHour?.hour && hour.id === this.selectedHour?.id) {
      return "booking-hour-card selected";
    }
    return "booking-hour-card";
  }

  onDayClick(params:{
    formattedDate: string;
    dayName: string;
  }){
    this.selectedDate = params;
    this.selectedHour = undefined;
  }

  generateHourArray(initHour: string, endHour: string, id: number): AvailableHours[] {
    const hoursArray:AvailableHours[] = [];
    let currentHour = initHour;
  
    while (currentHour <= endHour) {
      hoursArray.push({hour: currentHour, id});
      const [hoursStr, minutesStr, secondsStr] = currentHour.split(':');
      let hours = parseInt(hoursStr, 10);
      let minutes = parseInt(minutesStr, 10);
  
      // Add 1 hour
      hours += 1;
  
      // Ensure hours stay within 24-hour format
      hours %= 24;
  
      // Format the next hour
      currentHour = `${hours.toString().padStart(2, '0')}:${minutesStr}:${secondsStr}`;
    }
  
    return hoursArray;
  }
  
  getHours() {
    if (this.selectedDate.formattedDate && this.bookingsDays) {
      const result = this.bookingsDays[this.selectedDate.dayName]?.reduce<Record<string, AvailableHours[]>>((acc, hourRange) => {
        if (hourRange.id) {
        const hoursArray = this.generateHourArray(hourRange.init_hour, hourRange.end_hour, hourRange.id);
          if (!acc?.[this.selectedDate.dayName]) {
            acc[this.selectedDate.dayName] = [];
          }
          acc[this.selectedDate.dayName].push(...hoursArray)
        }
        return acc;
      }, {});
      return Object.values(result?.[this.selectedDate.dayName] || {});
    }
    return [];
  }

  onHourClick(params: SelectedHour) {
    this.selectedHour = params;
    console.log({params});
  }
  
  setBookingForm(form: FormGroup): void {
    this.form = form;
  }

  async onSubmit(form: FormGroup): Promise<void> {
    this.form = form;
    this.isLoading = await this.loadingService.loading();
    await this.isLoading.present();
    if (form.valid && this.selectedDate && this.selectedHour) {
      const {description, quota} = this.form.value;
      const date = new Date(`${this.selectedDate.formattedDate} ${this.selectedHour.hour}`);
      console.log(date, this.selectedDate.formattedDate, this.selectedHour.hour);
      const utcDateTime = moment.utc(date.toISOString());
      const localDateTime = utcDateTime.tz('America/Buenos_Aires');
      console.log(localDateTime.format());
      const booking = new Booking(localDateTime.format(), this.loginService.getUserInfo().id, parseInt(quota, 10), 1, this.selectedHour.id);
      console.log({booking})
      this.bookingService.postSelectedBooking(booking).subscribe(() => {
        this.isLoading.dismiss();
        this.form.reset();
        this.toastrService.success('Tu reserva esta en proceso.');
      })
    }
  }

}
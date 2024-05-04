import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BookingService } from '../services/booking.service';
import { LoadingService } from '@common/services/loading.service';
import { LoginService } from '@common/services/login.service';
import { User } from '@common/models/user';
import {
  BookingDay,
  BookingRequest,
  BookingState,
  UserFutureBookings,
} from '../models/booking';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { BOOKING_CANCEL } from '@common/constants/messages.constant';
import { BOOKING_STATES } from '../models/booking';
import { MonthsOfYear } from '@common/constants/month.of.year.enum';
import { DaysOfWeek } from '@common/constants/days.of.week.enum';
import { FormGroup } from '@angular/forms';

interface SelectedHour {
  hour: string;
  id: string;
}

interface AvailableHours {
  id: string;
  hour: string;
}

@Component({
  selector: 'app-my-bookings',
  templateUrl: './my-bookings.component.html',
  styleUrls: ['./my-bookings.component.scss'],
})
export class MyBookingsComponent implements OnInit {
  user!: User;
  bookingList: UserFutureBookings[] = [];
  showData: boolean = false;
  states: BookingState = [];
  bookingsDays: Record<string, BookingDay[]> = {};
  isLoading!: any;
  mobileScreen = false;

  form: FormGroup = new FormGroup({});
  editMode = false;
  formFields!: any[];
  formTitle = 'Realiza tu reserva';
  validationConfig!: any[];
  myButtons = [
    {
      label: 'Reservar',
      type: 'submit',
    },
  ];

  selectedDate: {
    formattedDate: string;
    dayName: string;
  } = {
    formattedDate: '',
    dayName: '',
  };
  selectedHour: SelectedHour | undefined = undefined;

  @ViewChild('wrapper') wrapperRef!: ElementRef<HTMLDivElement>;
  scrollingTimer: any;

  constructor(
    private bookingService: BookingService,
    private loadingService: LoadingService,
    private loginService: LoginService,
    private router: Router,
    private toastrService: ToastrService
  ) {
    this.formFields = [
      {
        type: 'input',
        name: 'quota',
        autocomplete: '',
        label: 'Comensales',
        inputType: 'number',
        icon: 'material-symbols-outlined',
        iconName: 'groups',
      },
    ];

    this.validationConfig = [
      {
        controlName: 'quota',
        required: true,
        minLength: 1,
        maxLength: 3,
        pattern: '^[0-9]*$',
      },
    ];
  }

  async ngOnInit() {
    this.doSearch();
    this.states = BOOKING_STATES;
    this.isLoading = await this.loadingService.loading();
    await this.isLoading.present();
    this.bookingService.getBookingDays().subscribe(response => {
      this.bookingsDays = response.reduce<Record<string, BookingDay[]>>(
        (acc, day) => {
          const dayOfTheWeekName =
            Object.values(DaysOfWeek)[parseInt(day.day_of_week)].toString();
          if (!acc[dayOfTheWeekName]) {
            acc[dayOfTheWeekName] = [day];
          } else {
            acc[dayOfTheWeekName]!.push(day);
          }
          return acc;
        },
        {}
      );
      this.isLoading.dismiss();
    });
    this.mobileScreen = window.innerWidth < 768;
  }

  async doSearch() {
    const loading = await this.loadingService.loading();
    await loading.present();
    try {
      this.user = this.loginService.getUserInfo();
      this.bookingService
        .getUserFutureBookings(this.user.id)
        .subscribe(data => {
          this.bookingList = data;
          if (this.bookingList.length == 0) {
            Swal.fire({
              icon: 'info',
              title: 'No hay Reservas realizadas',
              text: 'No tienes ninguna reserva pendiente, puedes realizar uno en el menu de reservas',
            }).then(() => {
              this.router.navigate(['/bookings/add']);
            });
          }
          this.showData = true;
        });
    } finally {
      loading.dismiss();
    }
  }

  onScroll(event: Event) {
    const element = event.target as HTMLElement;
    const wrapper = this.wrapperRef.nativeElement;

    if (element.scrollHeight > element.clientHeight) {
      wrapper.classList.add('show-scrollbar');
      clearTimeout(this.scrollingTimer);

      this.scrollingTimer = setTimeout(() => {
        wrapper.classList.remove('show-scrollbar');
      }, 1500);
    }
  }

  async cancelBooking(id: string) {
    Swal.fire(BOOKING_CANCEL).then(async result => {
      if (result.isConfirmed) {
        const loading = await this.loadingService.loading();
        await loading.present();
        this.bookingService
          .cancelBooking(id)
          .pipe(finalize(() => loading.dismiss()))
          .subscribe(() => {
            this.toastrService.success('Reserva cancelada');
            loading.dismiss();
            this.doSearch();
          });
      }
    });
  }

  getFormattedDate(date: Date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
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
    return daysToShow.map(date => {
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const formattedDate = this.getFormattedDate(date);
      const monthName = Object.values(MonthsOfYear)[date.getMonth()];
      return {
        title: `${monthName}`,
        dayName: Object.values(DaysOfWeek)[date.getDay()],
        dayNumber: date.getDate(),
        month,
        year,
        formattedDate,
      };
    });
  }

  getSelectedDateClass(date: string) {
    if (date === this.selectedDate.formattedDate) {
      return 'booking-card selected';
    }
    return 'booking-card';
  }

  onDayClick(params: { formattedDate: string; dayName: string }) {
    this.selectedDate = params;
    this.selectedHour = undefined;
  }

  getHours() {
    if (this.selectedDate.formattedDate && this.bookingsDays) {
      const result = this.bookingsDays[this.selectedDate.dayName]?.reduce<
        Record<string, AvailableHours[]>
      >((acc, hourRange) => {
        if (hourRange.id) {
          const hoursArray = this.generateHourArray(
            hourRange.init_hour,
            hourRange.end_hour,
            hourRange.id.toString()
          );
          if (!acc?.[this.selectedDate.dayName]) {
            acc[this.selectedDate.dayName] = [];
          }
          acc[this.selectedDate.dayName].push(...hoursArray);
        }
        return acc;
      }, {});
      return Object.values(result?.[this.selectedDate.dayName] || {});
    }
    return [];
  }

  generateHourArray(
    initHour: string,
    endHour: string,
    id: string
  ): AvailableHours[] {
    const hoursArray: AvailableHours[] = [];
    let currentHour = initHour;

    while (currentHour <= endHour) {
      hoursArray.push({ hour: currentHour, id });
      const [hoursStr, minutesStr, secondsStr] = currentHour.split(':');
      let hours = parseInt(hoursStr, 10);
      hours += 1;
      hours %= 24;
      currentHour = `${hours
        .toString()
        .padStart(2, '0')}:${minutesStr}:${secondsStr}`;
    }

    return hoursArray;
  }

  getSelectedHourClass(hour: SelectedHour) {
    if (
      hour.hour === this.selectedHour?.hour &&
      hour.id === this.selectedHour?.id
    ) {
      return 'booking-hour-card selected';
    }
    return 'booking-hour-card';
  }

  onHourClick(params: SelectedHour) {
    this.selectedHour = params;
  }

  setBookingForm(form: FormGroup): void {
    this.form = form;
  }

  async onSubmit(form: FormGroup): Promise<void> {
    this.form = form;
    if (
      form.valid &&
      this.selectedDate.dayName != '' &&
      this.selectedHour?.hour != null
    ) {
      const loading = await this.loadingService.loading();
      await loading.present();
      const { quota } = this.form.value;
      const date = `${this.selectedDate.formattedDate} ${this.selectedHour.hour}`;
      const booking = new BookingRequest(
        date,
        this.loginService.getUserInfo().id,
        quota
      );
      this.bookingService
        .postSelectedBooking(booking)
        .pipe(finalize(() => loading.dismiss()))
        .subscribe(() => {
          this.isLoading.dismiss();
          this.form.reset();
          this.toastrService.success(
            'Reserva registrada. Le informaremos cuando este confirmada'
          );
          this.doSearch();
        });
    } else {
      this.toastrService.error('Debes seleccionar una fecha y una hora');
    }
  }
}

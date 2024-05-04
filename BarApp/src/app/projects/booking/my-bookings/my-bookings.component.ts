import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BookingService } from '../services/booking.service';
import { LoadingService } from '@common/services/loading.service';
import { LoginService } from '@common/services/login.service';
import { User } from '@common/models/user';
import { UserFutureBookings } from '../models/booking';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { BOOKING_CANCEL } from '@common/constants/messages.constant';

@Component({
  selector: 'app-my-bookings',
  templateUrl: './my-bookings.component.html',
  styleUrls: ['./my-bookings.component.scss'],
})
export class MyBookingsComponent implements OnInit {
  user!: User;
  bookingList: UserFutureBookings[] = [];
  showData: boolean = false;

  @ViewChild('wrapper') wrapperRef!: ElementRef<HTMLDivElement>;
  scrollingTimer: any;

  constructor(
    private bookingService: BookingService,
    private loadingService: LoadingService,
    private loginService: LoginService,
    private router: Router,
    private toastrService: ToastrService
  ) {}

  ngOnInit() {
    this.doSearch();
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
          console.log(this.bookingList);
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

  getStatus(stateId: string): string {
    const id = Number(stateId);
    switch (id) {
      case 1:
        return 'Pendiente';
      case 2:
        return 'Confirmada';
      case 3:
        return 'Cancelada';
      default:
        return '';
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
}

type BookingState = Record<number, string>;

export type State = {
  id: string;
  description: string | number;
};

export const BOOKING_STATES: BookingState = {
  1: 'Pendiente',
  2: 'Confirmada',
  3: 'Cancelada',
};

export class BoookingResponse {
  constructor(
    id = 0,
    date_hour = new Date(),
    user = { id: '', name: '' },
    state = { id: '', description: 'A confirmar' } as State,
    quota = 0,
    bookingDayId = 0
  ) {
    this.id = id;
    (this.date_hour = date_hour), (this.user = user);
    this.state = state;
    this.quota = quota;
    this.bookingDayId = bookingDayId;
  }

  id: number;
  date_hour: Date;
  user: { id: string; name: string };
  state: State;
  quota: number;
  bookingDayId: number;
}

export class BookingRequest {
  constructor(date_hour = '', userId = '', quota = '') {
    this.date_hour = date_hour;
    this.userId = userId;
    this.quota = quota;
  }
  date_hour: string;
  userId: string;
  quota: string;
}

export class UserFutureBookings {
  constructor(
    id = 0,
    date_hour = new Date(),
    userId = '',
    stateId = '',
    quota = 0,
    bookingDayId = 0
  ) {
    this.id = id;
    (this.date_hour = date_hour), (this.userId = userId);
    this.stateId = stateId;
    this.quota = quota;
    this.bookingDayId = bookingDayId;
  }

  id: number;
  date_hour: Date;
  userId: string;
  stateId: string;
  quota: number;
  bookingDayId: number;
}

export class BookingDay {
  constructor(day_of_week = '', init_hour = '', end_hour = '') {
    this.day_of_week = day_of_week;
    this.init_hour = init_hour;
    this.end_hour = end_hour;
  }
  id?: string;
  day_of_week: string;
  end_hour: string;
  init_hour: string;
}

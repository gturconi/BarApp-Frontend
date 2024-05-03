export class BookingDay {
    public id?: number;
    public day_of_week: number;
    public init_hour: string;
    public end_hour: string;
  
    constructor(day_of_week: number, init_hour: string, end_hour: string) {
      this.day_of_week = day_of_week;
      this.init_hour = init_hour;
      this.end_hour = end_hour;
    }
  }

  export class Booking {
    public id?: number;
    public date_hour: Date | string;
    public userId: number;
    public quota: number;
    public stateId: number;
    public bookingDayId: number;
  
    constructor(
      date_hour: Date | string,
      userId: number,
      quota: number,
      stateId: number,
      bookingDayId: number
    ) {
      this.date_hour = date_hour;
      this.userId = userId;
      this.quota = quota;
      this.stateId = stateId;
      this.bookingDayId = bookingDayId;
    }
  }

  export class BookingState {
    public id?: number;
    public day_of_week: number;
    public init_hour: string;
    public end_hour: string;
  
    constructor(day_of_week: number, init_hour: string, end_hour: string) {
      this.day_of_week = day_of_week;
      this.init_hour = init_hour;
      this.end_hour = end_hour;
    }
  }
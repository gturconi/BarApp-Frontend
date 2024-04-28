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
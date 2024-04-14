export class QR {
  constructor(tableNumber = '', token = '') {
    this.tableNumber = tableNumber;
    this.token = token;
  }
  tableNumber: string;
  token: string;
}

export class Table {
  constructor(id = '', number = 0, idState = 0, state = '') {
    this.id = id;
    this.number = number;
    this.idState = idState;
    this.state = state;
  }
  id: string;
  number: number;
  idState?: number;
  state?: string;
}

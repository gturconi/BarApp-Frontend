export class Theme {
  constructor(id = 0, cssProperties = '') {
    this.id = id;
    this.cssProperties = cssProperties;
  }
  id: number;
  cssProperties: string;
}

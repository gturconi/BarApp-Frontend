import { Table } from '../../tables/models/table';
import { State } from 'ionicons/dist/types/stencil-public-runtime';

export type OrderState =
  | 'A confirmar'
  | 'En preparacion'
  | 'Entregado'
  | 'Pagado';

export type State = {
  id: string;
  description: OrderState;
};

export class OrderDetail {
  constructor(
    orderId = '',
    productId = '',
    promotionId = '',
    quantity = 0,
    unitPrice = 0,
    comments = ''
  ) {
    this.orderId = orderId;
    this.productId = productId;
    this.promotionId = promotionId;
    this.quantity = quantity;
    this.unitPrice = unitPrice;
    this.comments = comments;
  }

  orderId?: string;
  productId?: string;
  promotionId?: string;
  quantity: number;
  unitPrice: number;
  comments?: string;
}

export class OrderResponse {
  constructor(
    id = 0,
    table_order = new Table(),
    user = { id: '', name: '' },
    state = { id: '', description: 'A confirmar' } as State,
    date_created = '',
    total = 0,
    feedback = '',
    score = 0,
    employee = { id: '', name: '' },
    orderDetails = []
  ) {
    this.id = id;
    this.table_order = table_order;
    this.user = user;
    this.state = state;
    this.date_created = date_created;
    this.total = total;
    this.feedback = feedback;
    this.score = score;
    this.employee = employee;
    this.orderDetails = orderDetails;
  }

  id: number;
  table_order: Table;
  user: { id: string; name: string };
  state: State;
  date_created: string;
  total: number;
  feedback?: string;
  score?: number;
  employee?: { id: string; name: string };
  orderDetails: OrderDetail[];
}

export class OrderRequest {
  constructor(
    tableId = '',
    userId = '',
    employeeId = '',
    idState = '',
    total = 0,
    orderDetails = [],
    feedback = '',
    score = 0
  ) {
    this.tableId = tableId;
    this.userId = userId;
    this.employeeId = employeeId;
    this.idState = idState;
    this.total = total;
    this.orderDetails = orderDetails;
    this.feedback = feedback;
    this.score = score;
  }
  tableId: string;
  userId: string;
  employeeId?: string;
  idState?: string;
  total: number;
  orderDetails: OrderDetail[];
  feedback?: string;
  score: number;
}

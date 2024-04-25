import { Table } from '../../tables/models/table';
import { State } from 'ionicons/dist/types/stencil-public-runtime';

type OrderState = Record<number, string>;

export const ORDER_STATES: OrderState = {
  1: 'A confirmar',
  2: 'En preparacion',
  3: 'Entregado',
  4: 'Pagado',
};

export type State = {
  id: string;
  description: string;
};

export class OrderDetail {
  constructor(
    orderId: string | null = null,
    productId: string | null = null,
    promotionId: string | null = null,
    quantity: number | null = null,
    unitPrice = 0,
    comments: string | null = null
  ) {
    this.orderId = orderId;
    this.productId = productId;
    this.promotionId = promotionId;
    this.quantity = quantity;
    this.unitPrice = unitPrice;
    this.comments = comments;
  }

  orderId?: string | null;
  productId: string | null;
  promotionId: string | null;
  quantity: number | null;
  unitPrice: number;
  comments?: string | null;
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
    employeeId = null,
    idState = '',
    total = 0,
    orderDetails: OrderDetail[] = [],
    feedback = undefined,
    score = null
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
  employeeId?: string | null;
  idState?: string;
  total: number;
  orderDetails: OrderDetail[];
  feedback?: string | undefined;
  score?: number | null;
}

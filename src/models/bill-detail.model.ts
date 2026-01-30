import { Bill } from './bill.model';
import { IOrderDetail } from './orders.model';

/* */
export interface BillDetail {
  id: number;
  quantity: number;
  price: number;
  total: number;
  bill: Bill;
  orderDetail: IOrderDetail;
  createdAt: Date;
  updatedAt: Date;
}

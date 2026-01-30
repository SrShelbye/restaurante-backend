import { TypeOrder } from '@/models';

/* */
export interface CreateOrderDetailDto {
  quantity: number;
  description?: string;
  price: number;
  productId: string;
  orderId: string;
  qtyDelivered: number;
  productOptionId?: number;
  typeOrderDetail: TypeOrder;
}

import { OrderAddress } from './OrderAddress.interface';

export interface OrderCustomer {
  id?: number;
  orderId?: number;
  userId?: number;
  firstName: string;
  lastName: string;
  email?: string;
  externalId?: string;
  shippingAddress?: OrderAddress;
  billingAddress?: OrderAddress;
  sameAddress?: boolean;
}

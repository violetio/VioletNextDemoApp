import { OrderShippingMethod } from './OrderShippingMethod.interface';

export interface OrderShippingMethodWrapper {
  bagId: number;
  shippingMethods: OrderShippingMethod[];
}

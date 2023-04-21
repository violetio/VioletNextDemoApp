export interface OrderShippingMethod {
  id: number;
  shippingMethodId: string;
  bagId: number;
  merchantId: number;
  type: 'variable' | 'flat_rate';
  carrier?: 'ups' | 'usps' | 'fedex' | 'dhl' | 'ontrac';
  label: string;
  price: number;
  trackingNumber?: string;
  minSubtotal?: number;
  maxSubtotal?: number;
  minWeight?: number;
  maxWeight?: number;
  dateCreated?: string;
  dateLastModified?: string;
  externalId?: string;
}

export interface OrderSku {
  id: number;
  orderId?: number;
  bagId?: number;
  merchantId?: number;
  appId?: number;
  productId?: string;
  skuId: number;
  externalId?: string;
  name: string;
  brand?: string;
  thumbnail: string;
  quantity?: number;
  price: number;
  dateCreated?: string;
  dateLastModified?: string;
  weight?: number;
  height?: number;
  width?: number;
  length?: number;
  available?: boolean;
  status?:
    | 'IN_PROGRESS'
    | 'PROCESSING'
    | 'SHIPPED'
    | 'PARTIALLY_SHIPPED'
    | 'DELIVERED'
    | 'COULD_NOT_DELIVER'
    | 'RETURNED'
    | 'CANCELED'
    | 'REFUNDED'
    | 'REJECTED';
  productType?: 'PHYSICAL' | 'DIGITAL' | 'VIRTUAL';
  linePrice?: number;
  quantityFulfilled?: number;
  orderSkuRates?: OrderSkuRate[];
  transientExternalProductId?: string | null;
}

export interface OrderSkuRate {
  id: number;
  orderSkuId: number;
  amount: number;
  rate?: number;
  type: 'TAX' | 'SHIPPING' | 'FEE' | 'DUTY';
  name: string;
}

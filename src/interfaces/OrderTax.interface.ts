export interface OrderTax {
  id: number;
  orderId: number;
  bagId: number;
  merchantId: number;
  skus?: string[];
  state: string;
  postalCode?: string;
  rate: number;
  amount: number;
  description?: string;
  dateCreated?: string;
  dateLastModified?: string;
}

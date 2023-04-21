export interface Transaction {
  id: number;
  merchantId: number;
  appId: number;
  orderId?: number;
  bagId: number;
  paymentMethodId: number;
  gatewayTransactionId?: string;
  gateway?: string;
  amount?: number;
  currency?: string;
  type?: 'AUTHORIZATION' | 'CAPTURE' | 'VOID' | 'REFUND';
  errorCode?: string;
  status?: 'PROCESSING' | 'COMPLETED' | 'REFUNDED' | 'REQUIRES_ACTION';
  test?: boolean;
  dateCreated?: string;
  dateLastModified?: string;
  orderPaymentMethod?: any;
}

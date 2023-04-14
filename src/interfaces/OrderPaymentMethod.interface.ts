export interface OrderPaymentMethod {
  id: number;
  paymentMethodId: number;
  brand: string;
  lastFour: string;
  expMonth: number;
  expYear: number;
  cardholderName: string;
  primary: boolean;
}

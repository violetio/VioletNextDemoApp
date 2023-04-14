import { BagStatus } from "@/enums/BagStatus";
import { OrderSku } from "./OrderSku.interface";
import { FulfillmentStatus } from "@/enums/FulfillmentStatus";
import { FinancialStatus } from "@/enums/FinancialStatus";
import { ShippingMethodType } from "@/enums/ShippingMethodType";
import { ShippingMethodCarrier } from "@/enums/ShippingMethodCarrier";
import { OrderTax } from "./OrderTax.interface";
import { Transaction } from "./Transaction.interface";
import { OrderChannel } from "@/enums/OrderChannel";

export interface Bag {
  id: number;
  orderId: number;
  merchantId: number;
  appId: number;
  externalId?: string;
  status: BagStatus;
  fulfillmentStatus: FulfillmentStatus;
  financialStatus: FinancialStatus;
  merchantName?: string;
  skus?: OrderSku[];
  shippingMethod: OrderShippingMethod;
  taxes?: OrderTax[];
  subTotal?: number;
  shippingTotal?: number;
  taxTotal?: number;
  total?: number;
  taxesIncluded?: boolean;
  transactions?: Transaction[];
  externalCheckout?: boolean;
  commissionRate?: number;
  dateCreated?: string;
  dateLastModified?: string;
  remorsePeriodEnds?: string;
  currency?: string;
  externalCurrency?: string;
  currencyExchangeRate?: number;
  channel?: OrderChannel;
}

export interface OrderShippingMethod {
  id: number;
  shippingMethodId: string;
  bagId: number;
  merchantId: number;
  type: ShippingMethodType;
  carrier?: ShippingMethodCarrier;
  label: string;
  price: number;
  trackingNumber?: string;
  minSubtotal?: number;
  maxSubtotal?: number;
  minWeight?: number;
  maxWeight?: number;
  dateCreated?: Date;
  dateLastModified?: Date;
  externalId?: string;
}

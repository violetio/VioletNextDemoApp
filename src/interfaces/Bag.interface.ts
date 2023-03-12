import { Sku } from "./Sku.interface";

export interface Bag {
  app_id: number;
  bag_id: number;
  bag_status: string;
  channel: string;
  commission_rate: number;
  currency: string;
  date_created: string;
  external_checkout: boolean;
  external_currency: string;
  financial_status: string;
  fulfillment_status: string;
  fulfillments: any[];
  id: number;
  merchant_id: number;
  merchant_name: string;
  order_id: number;
  platform: string;
  remorse_period_ends: string;
  skus: Sku[];
  status: string;
  sub_total: number;
  taxes: any[];
  taxes_included: boolean;
  transactions: any[];
}

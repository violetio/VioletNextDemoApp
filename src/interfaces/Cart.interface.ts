import { Bag } from "./Bag.interface";
import { ShippingAddress } from "./ShippingAddress.interface";

export interface Cart {
  app_id: number;
  bags: Bag[];
  channel: string;
  currency: string;
  currency_symbol: string;
  date_created: string;
  date_last_modified: string;
  developer_id: number;
  errors: [any];
  guest: boolean;
  id: number;
  intent_based_checkout: false;
  is_guest: boolean;
  order_id: number;
  order_status: string;
  priced: boolean;
  status: string;
  stripe_key: string;
  sub_total: number;
  total: number;
  token: string;
  user_id: number;
  shipping_address: ShippingAddress;
  payment_intent_client_secret: string;
  customer: any;
}

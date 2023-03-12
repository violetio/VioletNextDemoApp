import { Variant } from "./Variant.interface";

export interface Sku {
  id: number;
  merchant_id: number;
  currency: string;
  in_stock: boolean;
  offer_id: number;
  qty_available: number;
  retail_price: number;
  sale_price: number;
  status: string;
  quantity: number;
  variant_values: Variant[];
}

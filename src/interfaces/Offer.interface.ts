import { Sku } from "./Sku.interface";
import { Variant } from "./Variant.interface";

export interface Offer {
  id: number;
  product_id: string;
  external_id: string;
  external_url: string;
  name: string;
  description: string;
  source: string;
  seller: string;
  vendor: string;
  merchant_id: number;
  available: boolean;
  visible: boolean;
  total_sales: number;
  min_price: number;
  max_price: number;
  currency: string;
  source_category_name: string;
  variants: Variant[];
  skus: Sku[];
}

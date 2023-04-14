import { Sku } from "./Sku.interface";
import { ProductVariant } from "./ProductVariant.interface";

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
  variants: ProductVariant[];
  skus: Sku[];
}

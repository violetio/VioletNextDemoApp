import { Category } from "./Category.interface";
import { Offer } from "./Offer.interface";
import { Variant } from "./Variant.interface";

export interface Product {
  available: true;
  brand: string;
  categories: Category[];
  cross_sale_product_ids: number[];
  currency: string;
  default_image_url: string;
  description: string;
  gtins: number[];
  id: string;
  max_price: number;
  merchant_ids: number[];
  meta: string[];
  min_price: number;
  name: string;
  offers: Offer[];
  qty_available: number;
  related_product_ids: number[];
  tags: string[];
  total_sales: number;
  type: string;
  variants: Variant[];
  visible: boolean;
  date_created: string;
  date_last_modified: string;
}

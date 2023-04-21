import { SkuVariantValue } from './SkuVariantValue.interface';
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
  variant_values: SkuVariantValue[];
  thumbnail: string;
  price: number;
  name: string;
}

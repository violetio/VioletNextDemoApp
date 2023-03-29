import { ProductVariantValue } from "./ProductVariantValue.interface";

export interface Variant {
  id: string;
  product_id: string;
  name: string;
  visual: boolean;
  values: ProductVariantValue[];
  displayOrder: number;
}

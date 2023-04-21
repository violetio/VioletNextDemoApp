import { ProductVariantValue } from './ProductVariantValue.interface';

export interface ProductVariant {
  id: string;
  productId: string;
  name: string;
  visual?: boolean;
  values: ProductVariantValue[];
  displayOrder?: number;
}

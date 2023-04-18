export interface Variant {
  id: number;
  offerId: number;
  productVariantId?: string;
  externalId: string;
  name: string;
  visual: boolean;
  values: VariantValue[];
}

export interface VariantValue {
  id: number;
  variantId: number;
  productVariantValueId?: string;
  externalId?: string;
  name: string;
  skuIds?: number[];
}

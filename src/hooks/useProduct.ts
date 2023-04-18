import { Product } from "@/interfaces/Product.interface";
import { ProductVariant } from "@/interfaces/ProductVariant.interface";
import { ProductVariantValue } from "@/interfaces/ProductVariantValue.interface";
import { useMemo } from "react";
import useOffer from "./useOffer";

/**
 * A custom hook that provides product-related data including variants, variant values, and available SKU information.
 */
const useProduct = (product?: Product) => {
  const { getSkusKey, skusExistForGivenSelections, skusPerVariantCombination } =
    useOffer(product?.offers?.[0]!);
  /**
   * Sort variant names by displayId
   * @returns an array of ProductVariants sorted by the display order key.
   */
  const sortedVariantsMemo = useMemo(() => {
    if (product?.variants) {
      const variants = [...product.variants];
      return variants
        .filter((variant: ProductVariant) => variant.values.length > 0)
        .sort((a, b) => {
          const aValue = a.displayOrder!;
          const bValue = b.displayOrder!;
          if (aValue < bValue) {
            return -1;
          }
          if (aValue > bValue) {
            return 1;
          }
          return 0;
        });
    }
    return [];
  }, [product?.id]);

  /**
   * @returns an array of ProductVariantValues sorted by the display order key.
   */
  const sortedVariantValuesMemo = useMemo(() => {
    const result: { [key: string]: ProductVariantValue[] } = {};
    sortedVariantsMemo?.forEach((variant) => {
      const variantName = variant.name;
      result[variantName] = [...variant.values].sort((a, b) => {
        let aValue = a.displayOrder!;
        let bValue = b.displayOrder!;

        if (aValue < bValue) {
          return -1;
        }
        if (aValue > bValue) {
          return 1;
        }
        return 0;
      });
    });
    return result;
  }, [product?.id, sortedVariantsMemo]);

  return {
    variants: sortedVariantsMemo,
    variantValues: sortedVariantValuesMemo,
    skusPerVariantCombination,
    getSkusKey,
    skusExistForGivenSelections,
  };
};

export default useProduct;

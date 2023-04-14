import { Product } from "@/interfaces/Product.interface";
import { ProductVariant } from "@/interfaces/ProductVariant.interface";
import { ProductVariantValue } from "@/interfaces/ProductVariantValue.interface";
import { useCallback, useMemo } from "react";

/**
 * A custom hook that provides product-related data including variants, variant values, and available SKU information.
 */
const useProduct = (product?: Product) => {
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

  /**
   * This object contains information about available SKUs for different combinations of variant values.
   * The keys in the object are strings that indicate a specific combination of variant values,
   * and the values are arrays of all the available SKU IDs that match that combination.
   * Essentially, this object provides a way to look up which SKUs are available for a given combination of variant values.
   * Example:
   *      {
   *        7.5: [30432, 30434, 30322, 30484, 30313, 30314] // 6 SKUs for size 7.5
   *        8: [30449, 30309, 30343, 30487, 30394, 30442, 30317] // 7 SKUs for size 8
   *        7.5|Blue: [] // No available SKUs for the combination of 7.5 and Blue
   *        8|Blue: [30394] // One SKU matching the combination of 8 and Blue
   *        ...
   *      }
   */
  const skusPerVariantCombination: { [key: string]: number[] } = useMemo(() => {
    const variantArrays: ProductVariantValue[][] = [];
    Object.keys(sortedVariantValuesMemo).forEach((variantKey) => {
      // Find the variantKey from offers by name
      const offerVariants = product?.offers?.[0].variants;
      offerVariants?.forEach((variant) => {
        if (variant.name === variantKey) {
          variantArrays.push(variant.values);
        }
      });
    });

    const memo = {};
    const doRecurse = (
      m: { [key: string]: number[] | undefined },
      k: string,
      startIndex: number,
      variantArrays: ProductVariantValue[][],
      filteredSkus: number[] | undefined
    ) => {
      if (m[k]) {
        return;
      }
      m[k] = filteredSkus;
      if (startIndex >= variantArrays.length) {
        return;
      }
      for (let j = startIndex; j < variantArrays.length; j++) {
        // Loop through each possible variant color/size/etc...
        for (let z = 0; z < variantArrays[j].length; z++) {
          // Loop through each variant value. color: black, blue, white, green
          let key = k
            ? `${k}|${variantArrays[j][z].name}`
            : variantArrays[j][z].name;
          let skuIds = variantArrays[j][z].skuIds || [];
          let filtered = skuIds;
          if (filteredSkus) {
            filtered = filtered.filter(function (n) {
              return filteredSkus.indexOf(n) !== -1;
            });
          }
          doRecurse(m, key, j + 1, variantArrays, filtered);
        }
      }
    };

    doRecurse(memo, "", 0, variantArrays, undefined);
    return memo;
  }, [sortedVariantValuesMemo]);

  /**
   * This function takes the sorted names of the product variants and the currently selected values as input and generates a string key
   * that can be used to look up the available SKUs for that specific combination of variant values in the skusPerVariantCombination object.
   * @returns skusPerVariantCombination key
   */
  const getSkusKey = useCallback(
    (
      selectedValues: { [key: string]: string },
      variantName?: string,
      rowValue?: string
    ) => {
      const result = sortedVariantsMemo.reduce(
        (prev: string, variant: ProductVariant) => {
          // Form our key
          let selectedVariantValue = selectedValues[variant.name];
          if (variantName === variant.name && rowValue) {
            selectedVariantValue = rowValue;
          }
          if (selectedVariantValue) {
            return prev
              ? `${prev}|${selectedVariantValue}`
              : selectedVariantValue;
          }
          return prev;
        },
        ""
      );
      return result;
    },
    [sortedVariantsMemo]
  );

  /**
   * @returns boolean indicating whether there are available SKUs for the given combination of selected variant values
   */
  const skusExistForGivenSelections = useCallback(
    (
      selectedValues: { [key: string]: string },
      variantName: string,
      rowValue: string
    ) => {
      return skusPerVariantCombination[
        `${getSkusKey(selectedValues, variantName, rowValue)}`
      ].length;
    },
    [skusPerVariantCombination, getSkusKey]
  );

  return {
    variants: sortedVariantsMemo,
    variantValues: sortedVariantValuesMemo,
    skusPerVariantCombination,
    getSkusKey,
    skusExistForGivenSelections,
  };
};

export default useProduct;

import React, { useCallback, useEffect, useMemo, useState } from "react";
import styles from "./ProductPanel.module.scss";
import { Product } from "@/interfaces/Product.interface";
import Image from "next/image";
import { Variant } from "@/interfaces/Variant.interface";
import { ProductVariantValue } from "@/interfaces/ProductVariantValue.interface";
import axios from "axios";
import useSWR from "swr";
import Select from "../Select/Select";
import cx from "classnames";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { setCart } from "@/redux/actions/cart";
import { RootState } from "@/redux/reducers";

interface Props {
  product: Product;
}

/**
 * Panel component for displaying product information
 */
const ProductPanel = ({ product }: Props) => {
  const dispatch = useAppDispatch();
  const cartState = useAppSelector((state: RootState) => state.cart);
  const queryUrl = `/api/catalog/products/${product.id}`;
  const { data } = useSWR<Product>(
    queryUrl,
    async (url) =>
      (
        await axios.get(url, {
          params: {
            include_offers: true,
          },
        })
      ).data
  );
  const [selectedValues, setSelectedValues] = useState<{
    [key: string]: string;
  }>({});

  useEffect(() => {
    setSelectedValues({});
  }, [data?.id]);

  // Sort variant names to ensure a consistent UI for variant select dropdowns
  const sortedVariantsMemo = useMemo(() => {
    if (data) {
      const variants = [...data?.offers[0].variants];
      return variants
        .filter((variant: Variant) => variant.values.length > 0)
        .sort((a, b) => {
          const aValue = a.name;
          const bValue = b.name;
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
  }, [data?.id]);

  // Sort variant values so the sizes will be in incrementing numbers or alphabetically ordered
  const sortedVariantValuesMemo = useMemo(() => {
    const result: { [key: string]: ProductVariantValue[] } = {};
    sortedVariantsMemo?.forEach((variant) => {
      const variantName = variant.name;
      result[variantName] = [...variant.values]
        .filter(
          (variantValue: ProductVariantValue) => variantValue.sku_ids.length > 0
        )
        .sort((a, b) => {
          const aNum = Number(a.name);
          const bNum = Number(b.name);

          let aValue: Number | string = a.name;
          let bValue: Number | string = b.name;
          if (!isNaN(aNum) && !isNaN(bNum)) {
            aValue = aNum;
            bValue = bNum;
          }
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
  }, [data?.id, sortedVariantsMemo]);

  // Create a look up table of all available skus based on variant selections
  const availableSkus: { [key: string]: number[] } = useMemo(() => {
    const variantArrays: ProductVariantValue[][] = [];
    Object.keys(sortedVariantValuesMemo).forEach((variantKey) => {
      variantArrays.push(sortedVariantValuesMemo[variantKey]);
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
            ? `${k}:${variantArrays[j][z].name}`
            : variantArrays[j][z].name;
          let sku_ids = variantArrays[j][z].sku_ids;
          let filtered = [...sku_ids];
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

  const addToCart = useCallback(
    async (skuId: number) => {
      if (cartState.cart) {
        const cart = await axios.post(
          `/api/checkout/cart/${cartState.cart.id}/skus`,
          {
            sku_id: skuId,
            quantity: 1,
          },
          {
            params: {
              price_cart: false,
            },
          }
        );
        dispatch(setCart(cart.data));
      } else {
        const cart = await axios.post("/api/checkout/cart", {
          base_currency: "USD",
          skus: [
            {
              sku_id: skuId,
              quantity: 1,
            },
          ],
        });
        dispatch(setCart(cart.data));
      }
    },
    [cartState.cart]
  );

  const getSkusKey = (variantName?: string, rowValue?: string) => {
    const result = sortedVariantsMemo.reduce(
      (prev: string, variant: Variant) => {
        // Form our key
        let selectedVariantValue = selectedValues[variant.name];
        if (variantName === variant.name && rowValue) {
          selectedVariantValue = rowValue;
        }
        if (selectedVariantValue) {
          return prev
            ? `${prev}:${selectedVariantValue}`
            : selectedVariantValue;
        }
        return prev;
      },
      ""
    );
    return result;
  };

  const skuExistsInCurrentFilter = (variantName: string, rowValue: string) => {
    return availableSkus[`${getSkusKey(variantName, rowValue)}`].length;
  };

  return (
    <div className={styles.productPanel}>
      <Image
        className={styles.productImage}
        src={product.default_image_url}
        alt={product.name}
        width={300}
        height={300}
      />
      <div className={styles.variants}>
        {data?.offers[0].variants &&
          sortedVariantsMemo.map((variant: Variant) => (
            <div
              key={`${variant.id}${variant.name}`}
              className={styles.variantOption}
            >
              <Select
                placeholder={variant.name}
                options={sortedVariantValuesMemo[variant.name].map(
                  (variantValue: ProductVariantValue) => variantValue.name
                )}
                value={selectedValues[variant.name]}
                renderOption={(rowValue: string) => {
                  return (
                    <div
                      className={cx({
                        [styles.disabledRow]: !skuExistsInCurrentFilter(
                          variant.name,
                          rowValue
                        ),
                      })}
                    >
                      {rowValue}
                    </div>
                  );
                }}
                renderSelectedOption={() =>
                  selectedValues[variant.name] ? (
                    <div>{selectedValues[variant.name]}</div>
                  ) : (
                    <></>
                  )
                }
                indexSelected={(index: number) => {
                  const productVariant =
                    sortedVariantValuesMemo[variant.name][index];
                  let selectable = skuExistsInCurrentFilter(
                    variant.name,
                    productVariant.name
                  );

                  if (selectable) {
                    setSelectedValues((prevSelectedValues) => ({
                      ...prevSelectedValues,
                      [variant.name]: productVariant.name,
                    }));
                  } else {
                    // Clear other selections
                    setSelectedValues({
                      [variant.name]: productVariant.name,
                    });
                  }

                  return !!selectable;
                }}
              />
            </div>
          ))}
      </div>
      <button
        disabled={
          sortedVariantsMemo.length !== Object.keys(selectedValues).length
        }
        onClick={() => {
          // Add the sku to cart
          addToCart(availableSkus[getSkusKey()][0]);
        }}
      >
        Add to Cart
      </button>
    </div>
  );
};

export default ProductPanel;

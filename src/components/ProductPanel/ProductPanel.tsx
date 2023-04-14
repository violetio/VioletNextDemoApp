import React, { useCallback, useEffect, useMemo, useState } from "react";
import styles from "./ProductPanel.module.scss";
import { Product } from "@/interfaces/Product.interface";
import Image from "next/image";
import { ProductVariant } from "@/interfaces/ProductVariant.interface";
import { ProductVariantValue } from "@/interfaces/ProductVariantValue.interface";
import useSWR from "swr";
import Select from "../Select/Select";
import cx from "classnames";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { setCart } from "@/redux/actions/cart";
import { RootState } from "@/redux/reducers";
import {
  addSkusToCart,
  createCart,
  getProduct,
  getProductEndpoint,
} from "@/api/catalog/products";
import useProduct from "@/hooks/useProduct";

interface Props {
  product: Product;
}

/**
 * Panel component for displaying product information and
 * controls for a user to add a specific product SKU to a cart.
 */
const ProductPanel = ({ product }: Props) => {
  const dispatch = useAppDispatch();
  const cartState = useAppSelector((state: RootState) => state.cart);
  const { data: productData } = useSWR<Product>(
    getProductEndpoint(product.id),
    async () => (await getProduct(product.id)).data
  );
  const [selectedValues, setSelectedValues] = useState<{
    [key: string]: string;
  }>({});
  const {
    variants,
    variantValues,
    skusPerVariantCombination,
    getSkusKey,
    skusExistForGivenSelections,
  } = useProduct(productData);

  useEffect(() => {
    // Reset selected variant values when a different product is selected
    setSelectedValues({});
  }, [productData?.id]);

  const addToCart = useCallback(
    async (skuId: number) => {
      if (cartState.cart) {
        // Add SKU to cart if we already have a cart created
        const cart = await addSkusToCart(cartState.cart.id.toString(), {
          skuId,
          quantity: 1,
        });
        dispatch(setCart(cart.data));
      } else {
        // Create a new cart with the selected SKU
        const cart = await createCart("USD", [
          {
            skuId,
            quantity: 1,
          },
        ]);

        dispatch(setCart(cart.data));
      }
    },
    [cartState.cart]
  );

  return (
    <div className={styles.productPanel}>
      {product.defaultImageUrl && (
        <Image
          className={styles.productImage}
          src={product.defaultImageUrl}
          alt={product.name}
          width={300}
          height={300}
        />
      )}
      {/* Create select dropdowns for every variant available for the selected product */}
      <div className={styles.variants}>
        {productData?.variants &&
          variants.map((variant: ProductVariant) => (
            <div
              key={`${variant.id}${variant.name}`}
              className={styles.variantOption}
            >
              <Select
                placeholder={variant.name}
                options={variantValues[variant.name].map(
                  (variantValue: ProductVariantValue) => variantValue.name
                )}
                value={selectedValues[variant.name]}
                renderOption={(rowValue: string) => {
                  return (
                    <div
                      className={cx({
                        [styles.disabledRow]: !skusExistForGivenSelections(
                          selectedValues,
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
                  const productVariant = variantValues[variant.name][index];
                  let selectable = skusExistForGivenSelections(
                    selectedValues,
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
        disabled={variants.length !== Object.keys(selectedValues).length}
        onClick={() => {
          addToCart(skusPerVariantCombination[getSkusKey(selectedValues)][0]);
        }}
      >
        Add to Cart
      </button>
    </div>
  );
};

export default ProductPanel;

import React, { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import cx from 'classnames';
import useSWR from 'swr';
import Select from '../Select/Select';
import styles from './OfferPanel.module.scss';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { setCart } from '@/redux/actions/cart';
import { RootState } from '@/redux/reducers';
import {
  addSkusToCart,
  createCart,
  getProduct,
  getProductEndpoint,
} from '@/api/catalog/products';
import useOffer from '@/hooks/useOffer';
import { Offer } from '@/interfaces/Offer.interface';
import { Variant, VariantValue } from '@/interfaces/Variant.interface';
import { Product } from '@/interfaces/Product.interface';
import useProduct from '@/hooks/useProduct';
import { ProductVariant } from '@/interfaces/ProductVariant.interface';
import { ProductVariantValue } from '@/interfaces/ProductVariantValue.interface';

interface Props {
  offer: Offer;
}

/**
 * Panel component for displaying product information and
 * controls for a user to add a specific product SKU to a cart.
 */
const OfferPanel = ({ offer }: Props) => {
  const dispatch = useAppDispatch();
  const cartState = useAppSelector((state: RootState) => state.cart);
  const [selectedValues, setSelectedValues] = useState<{
    [key: string]: string;
  }>({});

  const {
    variants,
    variantValues,
    skusPerVariantCombination,
    getSkusKey,
    skusExistForGivenSelections,
  } = useOffer(offer);

  useEffect(() => {
    // Reset selected variant values when a different product is selected
    setSelectedValues({});
  }, [offer.id]);

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
        const cart = await createCart('USD', [
          {
            skuId,
            quantity: 1,
          },
        ]);

        dispatch(setCart(cart.data));
      }
    },
    [cartState.cart, dispatch]
  );

  return (
    <div className={styles.offerPanel}>
      {offer.albums?.[0] && (
        <Image
          className={styles.productImage}
          src={offer.albums[0].primaryMedia.url}
          alt={offer.name}
          width={300}
          height={300}
        />
      )}
      {/* Create select dropdowns for every variant available for the selected product */}
      <div className={styles.variants}>
        {offer.variants &&
          variants.map((variant: Variant) => (
            <div
              key={`${variant.id}${variant.name}`}
              className={styles.variantOption}
            >
              <Select
                placeholder={variant.name}
                options={variantValues[variant.name].map(
                  (variantValue: VariantValue) => variantValue.name
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
                  const selectable = skusExistForGivenSelections(
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

export default OfferPanel;

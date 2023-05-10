import useSWR from 'swr';
import cx from 'classnames';
import { ReactElement, useCallback, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { getOfferById } from '@violet/violet-js/api/catalog/products';
import useOffer from '@violet/violet-js/hooks/useOffer';
import { Variant } from '@violet/violet-js/interfaces/Variant.interface';
import { useDispatch } from 'react-redux';
import { addSkusToCart, createCart } from '@violet/violet-js/api/checkout/cart';
import { Sku } from '@violet/violet-js/interfaces/Sku.interface';
import styles from './Offer.module.scss';
import SidePanelLayout from '@/components/SidePanelLayout/SidePanelLayout';
import { NextPageWithLayout } from '@/pages/_app';
import StoreIcon from '@/public/svg/store.svg';
import CircleArrow from '@/public/svg/circle-arrow.svg';
import { setCart, showCart } from '@/redux/actions/cart';
import { RootState } from '@/redux/reducers';
import { useAppSelector } from '@/redux/store';
import { useDesktopMediaQuery } from '@/utilities/responsive';
import Dropdown from '@/components/Dropdown/Dropdown';
import Button from '@/components/Button/Button';

const CLEAR_SELECTION = 'Clear Selection';

const OfferPage: NextPageWithLayout = () => {
  const router = useRouter();
  const isDesktop = useDesktopMediaQuery();
  const dispatch = useDispatch();
  const cartState = useAppSelector((state: RootState) => state.cart);
  const { offerId } = router.query;
  const { data: offer } = useSWR(
    offerId ? `/api/catalog/offers/${offerId}` : null,
    async () => (await getOfferById(offerId as string)).data
  );
  const {
    variants,
    variantValues,
    skusPerVariantCombination,
    getSkusKey,
    skusExistForGivenSelections,
  } = useOffer(offer);
  const [selectedValues, setSelectedValues] = useState<{
    [key: string]: string;
  }>({});
  const [selectedMedia, setSelectedMedia] = useState(0);
  const [addToCartLoading, setAddToCartLoading] = useState(false);

  const addToCart = useCallback(
    async (skuId: number) => {
      setAddToCartLoading(true);
      if (cartState.order) {
        // Add SKU to cart if we already have a cart created
        const cart = await addSkusToCart(cartState.order.id.toString(), {
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
        if (isDesktop) dispatch(showCart());
      }
      setAddToCartLoading(false);
    },
    [cartState.order, dispatch, isDesktop]
  );

  const selectedSkuId = useMemo(() => {
    if (
      variants.length !== Object.keys(selectedValues).length ||
      !variants.length
    ) {
      return null;
    }
    return skusPerVariantCombination[getSkusKey(selectedValues)][0];
  }, [selectedValues, variants, skusPerVariantCombination, getSkusKey]);

  const skuForSkuId = useCallback(
    (skuId: number): Sku | null => {
      if (offer?.skus) {
        const skus = offer.skus.filter((sku) => sku.id === skuId);
        return skus[0];
      }
      return null;
    },
    [offer?.skus]
  );

  if (!offer) {
    // TODO: Show a loading spinner instead of null
    return null;
  }

  return (
    <div
      className={cx(styles.offerPage, {
        [styles.vertical]: !isDesktop,
      })}
    >
      {offer.albums?.[0] && (
        <div className={styles.imageViewer}>
          <img
            className={cx(styles.offerImage, {
              [styles.vertical]: !isDesktop,
            })}
            src={offer.albums[0].media[selectedMedia].url}
            alt={offer.name}
          />
          {offer.albums?.[0].media.length > 1 && (
            <div className={styles.imageSelection}>
              <div className={styles.arrowContainer}>
                <CircleArrow
                  className={styles.arrow}
                  onClick={() =>
                    setSelectedMedia((prev) => {
                      if (prev > 0) {
                        return prev - 1;
                      }
                      return prev;
                    })
                  }
                />
              </div>
              <div className={styles.selectedImage}>
                {selectedMedia + 1}/{offer.albums?.[0].media.length}
              </div>
              <div className={styles.arrowContainer}>
                <CircleArrow
                  className={cx(styles.arrow, styles.right)}
                  onClick={() =>
                    setSelectedMedia((prev) => {
                      if (prev < offer.albums?.[0].media.length! - 1) {
                        return prev + 1;
                      }
                      return prev;
                    })
                  }
                />
              </div>
            </div>
          )}
        </div>
      )}
      <div className={styles.offerOptions}>
        <div className={styles.name}>{offer?.name}</div>
        <div className={styles.vendor}>{offer?.vendor}</div>
        <div className={styles.seller}>
          <StoreIcon className={styles.storeIcon} /> {offer?.seller}
        </div>
        <div className={styles.price}>
          {variants.length !== Object.keys(selectedValues).length ? (
            <>
              {(offer.minPrice! / 100).toLocaleString('en-US', {
                style: 'currency',
                currency: offer.currency,
              })}
            </>
          ) : (
            <>
              {selectedSkuId &&
                (skuForSkuId(selectedSkuId)?.salePrice! / 100).toLocaleString(
                  'en-US',
                  {
                    style: 'currency',
                    currency: offer.currency,
                  }
                )}
            </>
          )}
        </div>
        {/* Create select dropdowns for every variant available for the selected product */}
        <div className={styles.variants}>
          {offer.variants &&
            variants.map((variant: Variant) => (
              <Dropdown
                classes={{ list: styles.list }}
                key={`${variant.id}${variant.name}`}
                value={selectedValues[variant.name] || ''}
                options={variantValues[variant.name].map(
                  (variantValue) => variantValue.name
                )}
                placeholder={variant.name}
                onChange={(value: string) => {
                  const productVariant = variantValues[variant.name].find(
                    (variantValue) => variantValue.name === value
                  );
                  if (value === CLEAR_SELECTION) {
                    setSelectedValues((prevSelectedValues) => {
                      const newSelectedValues = { ...prevSelectedValues };
                      delete newSelectedValues[variant.name];
                      return newSelectedValues;
                    });
                    return;
                  }
                  if (!productVariant) return;
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
                }}
                disabledRow={(value: string) =>
                  !skusExistForGivenSelections(
                    selectedValues,
                    variant.name,
                    value
                  )
                }
              />
            ))}
        </div>
        <Button
          className={cx(styles.addToCart, {
            [styles.loading]: addToCartLoading,
          })}
          label="Add to Cart"
          disabled={variants.length !== Object.keys(selectedValues).length}
          loading={addToCartLoading}
          onClick={() => {
            if (offer.variants?.length! > 0) {
              addToCart(selectedSkuId!);
            } else {
              if (offer.skus?.[0]) {
                addToCart(offer.skus[0].id);
              }
            }
          }}
        />
        <div className={styles.descriptionHeader}>Description</div>
        <div className={styles.description}>{offer.description}</div>
      </div>
    </div>
  );
};

OfferPage.getLayout = function getLayout(page: ReactElement) {
  return <SidePanelLayout>{page}</SidePanelLayout>;
};

export default OfferPage;

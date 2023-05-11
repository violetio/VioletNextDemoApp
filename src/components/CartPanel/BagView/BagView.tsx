import cx from 'classnames';
import { BuildingStorefrontIcon } from '@heroicons/react/24/solid';
import { useCallback, useMemo, useState } from 'react';
import { Listbox } from '@headlessui/react';
import { Bag, removeSkusFromCart, updateSkuInCart } from '@violetio/violet-js';
import styles from './BagView.module.scss';
import ChevronDownIcon from '@/public/svg/chevron-down.svg';
import { setCart } from '@/redux/actions/cart';
import { RootState } from '@/redux/reducers';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import Dropdown from '@/components/Dropdown/Dropdown';

interface Props {
  bag: Bag;
  showShipping?: boolean;
  showTaxes?: boolean;
  editable?: boolean;
}

/**
 * A collapsible view of items in a bag
 */
const BagView = ({
  bag,
  showShipping = false,
  showTaxes = false,
  editable = false,
}: Props) => {
  const dispatch = useAppDispatch();
  const cartState = useAppSelector((state: RootState) => state.cart);
  const [expanded, setExpanded] = useState(true);

  const itemCount = useMemo(() => {
    return bag.skus?.reduce(
      (prevValue, sku) => prevValue + (sku.quantity || 0),
      0
    );
  }, [bag]);

  /**
   * Removes a SKU ID from the cart
   */
  const removeFromCart = useCallback(
    async (skuId: number) => {
      if (cartState.order?.id) {
        try {
          const cart = await removeSkusFromCart(
            cartState.order.id.toString(),
            skuId.toString()
          );
          dispatch(setCart(cart.data));
        } catch (err) {
          // Error removing SKU from cart
        }
      }
    },
    [cartState.order?.id, dispatch]
  );

  /**
   * Updates quantity of SKU
   */
  const updateSku = useCallback(
    async (skuId: number, quantity: number) => {
      if (cartState.order?.id) {
        const cart = await updateSkuInCart(
          cartState.order.id.toString(),
          skuId.toString(),
          {
            skuId,
            quantity,
          }
        );
        dispatch(setCart(cart.data));
      }
    },
    [cartState.order?.id, dispatch]
  );

  return (
    <div className={styles.bagView}>
      <div className={styles.header}>
        <BuildingStorefrontIcon className={styles.storeIcon} />
        <div className={styles.merchantName}>{bag.merchantName}</div>
        {itemCount && (
          <div className={styles.itemCount}>
            {itemCount} {itemCount > 1 ? 'Items' : 'Item'}
          </div>
        )}
        <ChevronDownIcon
          className={cx(styles.chevronIcon, { [styles.flipped]: expanded })}
          onClick={() => setExpanded((prev) => !prev)}
        />
      </div>
      {expanded &&
        bag.skus?.map((sku, index) => (
          <div
            key={sku.id}
            className={cx(styles.sku, {
              [styles.lastIndex]: index === bag.skus?.length! - 1,
            })}
          >
            <img
              className={styles.skuImage}
              alt={sku.name}
              src={sku.thumbnail}
            />
            <div className={styles.skuInfo}>
              <div className={styles.name}> {sku.name}</div>
              <div className={styles.brand}>{sku.brand}</div>
              <div className={styles.quantityAndPrice}>
                {editable && (
                  <div
                    className={styles.remove}
                    onClick={() => removeFromCart(sku.id)}
                  >
                    Remove
                  </div>
                )}
                <Dropdown
                  classes={{
                    list: styles.list,
                    options: styles.options,
                  }}
                  value={sku.quantity?.toString() || '1'}
                  options={['1', '2', '3', '4', '5', '6']}
                  disabled={!editable}
                  customButton={
                    <Listbox.Button className={styles.listButton}>
                      <div
                        className={cx(styles.quantity, {
                          [styles.disabled]: !editable,
                        })}
                      >
                        Quantity: {sku.quantity}{' '}
                        {editable && (
                          <ChevronDownIcon className={cx(styles.chevronIcon)} />
                        )}
                      </div>
                    </Listbox.Button>
                  }
                  clearOption={false}
                  onChange={(newValue) => updateSku(sku.id, Number(newValue))}
                />
                <div className={styles.price}>
                  {((sku.price / 100) * (sku.quantity || 1)).toLocaleString(
                    'en-US',
                    {
                      style: 'currency',
                      currency: bag.currency,
                    }
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      <div className={styles.priceOverview}>
        {showShipping && (
          <div className={styles.shippingPrice}>
            Shipping Method
            <div className={styles.price}>
              {bag.shippingMethod?.price !== undefined
                ? (bag.shippingMethod.price / 100).toLocaleString('en-US', {
                    style: 'currency',
                    currency: bag.currency,
                  })
                : '----'}
            </div>
          </div>
        )}
        {showTaxes && (
          <div className={styles.shippingPrice}>
            Taxes
            <div className={styles.price}>
              {bag.taxTotal !== undefined
                ? (bag.taxTotal / 100).toLocaleString('en-US', {
                    style: 'currency',
                    currency: bag.currency,
                  })
                : '----'}
            </div>
          </div>
        )}
        <div className={styles.bagTotal}>
          Bag Total
          <div className={styles.subtotal}>
            {showShipping && showTaxes ? (
              <>
                {(bag?.total! / 100).toLocaleString('en-US', {
                  style: 'currency',
                  currency: bag.currency,
                })}
              </>
            ) : (
              <>
                {(bag?.subTotal! / 100).toLocaleString('en-US', {
                  style: 'currency',
                  currency: bag.currency,
                })}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BagView;

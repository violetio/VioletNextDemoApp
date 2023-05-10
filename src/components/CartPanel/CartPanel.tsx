import { useCallback, useEffect } from 'react';
import { requestIntentBasedCapturePayment } from '@violet/violet-js/api/checkout/cart';
import { XMarkIcon } from '@heroicons/react/20/solid';
import { Bag } from '@violet/violet-js/interfaces/Bag.interface';
import Link from 'next/link';
import styles from './CartPanel.module.scss';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { RootState } from '@/redux/reducers';
import { hideCart, setCart } from '@/redux/actions/cart';
import BagView from '@/components/CartPanel/BagView/BagView';
import Button from '@/components/Button/Button';

interface Props {
  closeable?: boolean;
  showShippingPerBag?: boolean;
  showTaxesPerBag?: boolean;
  showTotal?: boolean;
}
/**
 * Panel component for displaying current cart data and Stripe payment elements
 * for completing checkout.
 */
const CartPanel = ({
  closeable = true,
  showShippingPerBag = false,
  showTaxesPerBag = false,
  showTotal = false,
}: Props) => {
  const dispatch = useAppDispatch();
  const cartState = useAppSelector((state: RootState) => state.cart);

  /**
   * Begins the checkout process on the cart by requesting a paymentIntentClientSecret.
   * The paymentIntentClientSecret is required for Stripe V3 payments.
   */
  const beginCheckout = useCallback(async () => {
    const cartId = cartState.order?.id;
    if (cartId && !cartState.order?.paymentIntentClientSecret) {
      const paymentResponse = await requestIntentBasedCapturePayment(
        cartId.toString(),
        true
      );

      dispatch(setCart(paymentResponse.data));
    }
  }, [
    cartState.order?.id,
    cartState.order?.paymentIntentClientSecret,
    dispatch,
  ]);

  useEffect(() => {
    // Request a paymentIntentClientSecret to go through checkout
    if (cartState.order?.id && !cartState.order?.paymentIntentClientSecret) {
      beginCheckout();
    }
  }, [
    cartState.order?.id,
    beginCheckout,
    cartState.order?.paymentIntentClientSecret,
  ]);

  return (
    <div className={styles.cartPanel}>
      <div className={styles.scrollableArea}>
        <div className={styles.header}>
          <div className={styles.label}>Shopping Cart</div>
          {closeable && (
            <XMarkIcon
              className={styles.xIcon}
              onClick={() => dispatch(hideCart())}
            />
          )}
        </div>
        {cartState.order?.bags && (
          <div className={styles.bags}>
            {cartState.order.bags.map((bag: Bag) => (
              <BagView
                key={bag.id}
                bag={bag}
                showShipping={showShippingPerBag}
                showTaxes={showTaxesPerBag}
                editable={!showTotal}
              />
            ))}
          </div>
        )}
      </div>
      <div className={styles.footer}>
        {showTotal ? (
          <>
            <div className={styles.subtotalAndFees}>
              <div className={styles.subtotalAndFee}>
                Subtotal
                <div className={styles.amount}>
                  {(cartState.order?.subTotal! / 100).toLocaleString('en-US', {
                    style: 'currency',
                    currency: cartState.order?.currency,
                  })}
                </div>
              </div>
              <div className={styles.subtotalAndFee}>
                Shipping Methods
                <div className={styles.amount}>
                  {(cartState.order?.shippingTotal! / 100).toLocaleString(
                    'en-US',
                    {
                      style: 'currency',
                      currency: cartState.order?.currency,
                    }
                  )}
                </div>
              </div>
              <div className={styles.subtotalAndFee}>
                Tax
                <div className={styles.amount}>
                  {(cartState.order?.taxTotal! / 100).toLocaleString('en-US', {
                    style: 'currency',
                    currency: cartState.order?.currency,
                  })}
                </div>
              </div>
              <div className={styles.total}>
                Total
                <div className={styles.amount}>
                  {(cartState.order?.total! / 100).toLocaleString('en-US', {
                    style: 'currency',
                    currency: cartState.order?.currency,
                  })}
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {cartState.order && (
              <div className={styles.subtotal}>
                Subtotal{' '}
                <div className={styles.price}>
                  {(cartState.order?.subTotal! / 100).toLocaleString('en-US', {
                    style: 'currency',
                    currency: cartState.order?.currency,
                  })}
                </div>
              </div>
            )}

            <div className={styles.subtext}>
              Shipping and taxes calculated at checkout.
            </div>
            {closeable && (
              <Link href="/checkout">
                <Button className={styles.checkout} label="Checkout" />
              </Link>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CartPanel;

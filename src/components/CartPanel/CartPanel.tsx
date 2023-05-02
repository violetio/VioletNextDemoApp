import { useCallback, useEffect, useMemo } from 'react';
import {
  removeSkusFromCart,
  requestIntentBasedCapturePayment,
} from '@violet/violet-js/api/checkout/cart';
import { XMarkIcon } from '@heroicons/react/20/solid';
import { Bag } from '@violet/violet-js/interfaces/Bag.interface';
import styles from './CartPanel.module.scss';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { RootState } from '@/redux/reducers';
import { setCart } from '@/redux/actions/cart';
import { closeSidePanel } from '@/redux/thunks/common';
import BagView from '@/components/CartPanel/BagView/BagView';

/**
 * Panel component for displaying current cart data and Stripe payment elements
 * for completing checkout.
 */
const CartPanel = () => {
  const dispatch = useAppDispatch();
  const cartState = useAppSelector((state: RootState) => state.cart);
  const stripeKey = cartState.order?.stripeKey;

  /**
   * Flattens the arrays of SKUs in each bag
   */
  const skusInCart = useMemo(() => {
    if (cartState.order) {
      return cartState.order.bags.flatMap((bag) =>
        bag.skus ? bag.skus?.map((sku) => sku) : []
      );
    }
    return [];
  }, [cartState]);

  /**
   * Removes a SKU ID from the cart
   */
  const removeFromCart = useCallback(
    async (skuId: number) => {
      if (cartState.order?.id) {
        const cart = await removeSkusFromCart(
          cartState.order.id.toString(),
          skuId.toString()
        );
        dispatch(setCart(cart.data));
      }
    },
    [cartState.order?.id, dispatch]
  );

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
          <XMarkIcon
            className={styles.xIcon}
            onClick={() => dispatch(closeSidePanel())}
          />
        </div>
        {cartState.order?.bags && (
          <div className={styles.bags}>
            {cartState.order.bags.map((bag: Bag) => (
              <BagView key={bag.id} bag={bag} />
            ))}
          </div>
        )}
      </div>

      {/* <div className={styles.product}>
        {skusInCart.map((sku) => (
          <div key={sku.id} className={styles.product}>
            <div className={styles.productInfo}>
              <img
                className={styles.productImage}
                src={sku.thumbnail}
                alt={sku.name}
                width={100}
                height={100}
              />
              <div className={styles.productDetails}>{sku.name}</div>
              <div>
                {(sku.price / 100).toLocaleString('en-US', {
                  style: 'currency',
                  currency: 'USD',
                })}
              </div>
            </div>
            <div className={styles.productQuantity}>
              quantity: {sku.quantity}
              <button onClick={() => removeFromCart(sku.id)}>
                Remove from Cart
              </button>
            </div>
          </div>
        ))}
      </div> */}
      {/*{cartState.order?.paymentIntentClientSecret && stripeKey && (
        <div className={styles.stripeElement}>
          <Elements
            stripe={stripe}
            options={{
              clientSecret: cartState.order?.paymentIntentClientSecret,
            }}
          >
            <CheckoutForm fullApplePayCheckout={true} />
          </Elements>
        </div>
      )}
       <div className={styles.guestCheckoutDivider}>
        <div className={styles.divider} />
        <div className={styles.label}>Guest Checkout</div>
        <div className={styles.divider} />
      </div>
      <GuestCheckout /> */}
      <div className={styles.footer}>
        <div className={styles.subtotal}>
          Subtotal{' '}
          <div className={styles.price}>
            {(cartState.order?.subTotal! / 100).toLocaleString('en-US', {
              style: 'currency',
              currency: cartState.order?.currency,
            })}
          </div>
        </div>
        <div className={styles.subtext}>
          Shipping and taxes calculated at checkout.
        </div>
        <button className={styles.checkout}>Checkout</button>
      </div>
    </div>
  );
};

export default CartPanel;

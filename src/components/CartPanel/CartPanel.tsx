import styles from "./CartPanel.module.scss";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { RootState } from "@/redux/reducers";
import { useCallback, useEffect, useMemo } from "react";

import Image from "next/image";
import { setCart } from "@/redux/actions/cart";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "../CheckoutForm/CheckoutForm";
import {
  removeSkusFromCart,
  requestIntentBasedCapturePayment,
} from "@/api/checkout/cart";

// TODO: Dynamically load this when the publishable key is received from the Order object
const stripePromise = loadStripe("pk_test_UHg8oLvg4rrDCbvtqfwTE8qd");

/**
 * Panel component for displaying current cart data and Stripe payment elements
 * for completing checkout.
 */
const CartPanel = () => {
  const dispatch = useAppDispatch();
  const cartState = useAppSelector((state: RootState) => state.cart);

  /**
   * Flattens the arrays of SKUs in each bag
   */
  const skusInCart = useMemo(() => {
    if (cartState.cart) {
      return cartState.cart.bags.flatMap((bag) =>
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
      if (cartState.cart?.id) {
        const cart = await removeSkusFromCart(
          cartState.cart.id.toString(),
          skuId.toString()
        );
        dispatch(setCart(cart.data));
      }
    },
    [cartState.cart?.id]
  );

  useEffect(() => {
    if (cartState.cart?.id) {
      beginCheckout();
    }
  }, [cartState.cart?.id]);

  /**
   * Begins the checkout process on the cart by requesting a paymentIntentClientSecret.
   * The paymentIntentClientSecret is required for Stripe V3 payments.
   */
  const beginCheckout = useCallback(async () => {
    const cartId = cartState.cart?.id;
    if (cartId && !cartState.cart?.paymentIntentClientSecret) {
      const paymentResponse = await requestIntentBasedCapturePayment(
        cartId.toString(),
        true
      );

      dispatch(setCart(paymentResponse.data));
    }
  }, [cartState.cart?.id]);

  return (
    <div className={styles.cartPanel}>
      <div className={styles.header}>Cart</div>
      <div className={styles.product}>
        {skusInCart.map((sku) => (
          <div key={sku.id} className={styles.product}>
            <div className={styles.productInfo}>
              <Image
                className={styles.productImage}
                src={sku.thumbnail}
                alt={sku.name}
                width={100}
                height={100}
              />
              <div className={styles.productDetails}>{sku.name}</div>
              <div>
                {(sku.price / 100).toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
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
      </div>
      {cartState.cart?.paymentIntentClientSecret && (
        <div className={styles.stripeElement}>
          <Elements
            stripe={stripePromise}
            options={{
              clientSecret: cartState.cart?.paymentIntentClientSecret,
            }}
          >
            <CheckoutForm fullApplePayCheckout={true} />
          </Elements>
        </div>
      )}
    </div>
  );
};

export default CartPanel;

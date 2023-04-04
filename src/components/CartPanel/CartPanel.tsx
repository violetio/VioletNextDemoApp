import styles from "./CartPanel.module.scss";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { RootState } from "@/redux/reducers";
import { useCallback, useEffect, useMemo } from "react";

import Image from "next/image";
import axios from "axios";
import { setCart } from "@/redux/actions/cart";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "../CheckoutForm/CheckoutForm";

/**
 * Panel component for displaying current cart data
 */
const stripePromise = loadStripe("pk_test_UHg8oLvg4rrDCbvtqfwTE8qd");

const CartPanel = () => {
  const dispatch = useAppDispatch();
  const cartState = useAppSelector((state: RootState) => state.cart);

  const skusInCart = useMemo(() => {
    return cartState.cart?.bags.flatMap((bag) => bag.skus.map((sku) => sku));
  }, [cartState]);

  const removeFromCart = useCallback(
    async (skuId: number) => {
      if (cartState.cart?.id) {
        const cart = await axios.delete(
          `/api/checkout/cart/${cartState.cart.id}/skus/${skuId}`
        );
        dispatch(setCart(cart.data));
      }
    },
    [cartState.cart?.id]
  );

  useEffect(() => {
    if (cartState.cart?.id) {
      console.log("calling checkout on cartId: ", cartState.cart?.id);
      checkout();
    }
  }, [cartState.cart?.id]);

  // Submit an uncaptured payment to retrieve the payment_intent_client_secret
  const checkout = useCallback(async () => {
    const cartId = cartState.cart?.id;
    if (cartId && !cartState.cart?.payment_intent_client_secret) {
      const paymentResponse = await axios.post(
        `/api/checkout/cart/${cartId}/payment`,
        {
          intent_based_capture: true,
        }
        // {
        //   params: {
        //     price_cart: true,
        //   },
        // }
      );

      dispatch(setCart(paymentResponse.data));
    }
  }, [cartState.cart?.id]);

  return (
    <div className={styles.cartPanel}>
      <div className={styles.header}>Cart</div>
      <div className={styles.product}>
        {skusInCart?.map((sku) => (
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
      {cartState.cart?.payment_intent_client_secret && (
        <div className={styles.stripeElement}>
          <Elements
            stripe={stripePromise}
            options={{
              clientSecret: cartState.cart?.payment_intent_client_secret,
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

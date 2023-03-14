import CheckoutForm from "@/components/CheckoutForm/CheckoutForm";
import { Bag } from "@/interfaces/Bag.interface";
import { Sku } from "@/interfaces/Sku.interface";
import { setCart } from "@/redux/actions/cart";
import { RootState } from "@/redux/reducers";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import { useRouter } from "next/router";
import { useCallback, useEffect } from "react";
import useSWR from "swr";
import styles from "./Checkout.module.scss";

// Load stripe with our client key. TODO: Replace this hardcoded value with the field from the cart object
const stripePromise = loadStripe("pk_test_UHg8oLvg4rrDCbvtqfwTE8qd");

export default function CheckoutPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const cart = useAppSelector((state: RootState) => state.cart);
  // Fetch cart data if a cartId is present in the query param
  const { data: getCartData } = useSWR(
    router.query.cartId ? `/api/checkout/cart/${router.query.cartId}` : null,
    async (url: string) => (await axios.get(url)).data
  );
  // Fetch available shipping data when the cart has a shipping address applied
  const { data: availableShippingData } = useSWR(
    cart.shipping_address
      ? `/api/checkout/cart/${cart.id}/shipping/available`
      : null,
    async (url: string) => (await axios.get(url)).data
  );

  // Apply guest customer info with some hardcoded values
  const applyCustomerInfo = useCallback(async () => {
    if (cart.id) {
      const updatedCartResponse = await axios.post(
        `/api/checkout/cart/${cart.id}/customer`,
        {
          first_name: "First",
          last_name: "Last",
          email: "first_last@violet.io",
          shipping_address: {
            address_1: "123 Main St NEWS",
            city: "Seattle",
            country: "US",
            postal_code: "98101",
            state: "WA",
            type: "SHIPPING",
          },
          same_address: true,
        }
      );

      dispatch(setCart(updatedCartResponse.data));
    }
  }, [cart.id]);

  // Apply first shipping method from available shipping methods to the cart
  const applyShipping = useCallback(async () => {
    if (availableShippingData) {
      // Apply the first available shipping method
      const updatedCartResponse = await axios.post(
        `/api/checkout/cart/${cart.id}/shipping`,
        [
          {
            bag_id: availableShippingData[0].bag_id,
            shipping_method_id:
              availableShippingData[0].shipping_methods[0].shipping_method_id,
          },
        ],
        {
          params: {
            price_cart: true,
          },
        }
      );

      dispatch(setCart(updatedCartResponse.data));
    }
  }, [availableShippingData]);

  // Submit an uncaptured payment to retrieve the payment_intent_client_secret
  const checkout = useCallback(async () => {
    if (cart.id) {
      const paymentResponse = await axios.post(
        `/api/checkout/cart/${cart.id}/payment`,
        {
          intent_based_capture: true,
        },
        {
          params: {
            price_cart: true,
          },
        }
      );

      dispatch(setCart(paymentResponse.data));
    }
  }, [cart.id]);

  // Captures payment on a cartID that is in the uncaptured state
  const capturePayment = useCallback(async () => {
    if (cart.id) {
      await axios.post(`/api/checkout/cart/${cart.id}/submit`);
    }
  }, [cart.id]);

  useEffect(() => {
    if (getCartData) {
      dispatch(setCart(getCartData));
    }
  }, [getCartData]);

  return (
    <div className={styles.checkoutPage}>
      <h1>Checkout</h1>
      <div>
        {cart?.bags
          ?.reduce((skus: Sku[], bag: Bag) => skus.concat(bag.skus), [])
          .map((sku: Sku) => (
            <div key={sku.id}>
              {sku.id}: {sku.quantity}
            </div>
          ))}
      </div>
      <div className={styles.step}>
        <button className={styles.checkout} onClick={applyCustomerInfo}>
          Apply customer info
        </button>
        {cart?.customer && <div className={styles.greenDot} />}
      </div>
      <div className={styles.step}>
        <button className={styles.checkout} onClick={applyShipping}>
          Apply shipping
        </button>
        {cart?.bags?.[0]?.shipping_method && (
          <div className={styles.greenDot} />
        )}
      </div>
      <div className={styles.step}>
        <button className={styles.checkout} onClick={checkout}>
          Checkout
        </button>
      </div>
      {cart?.payment_intent_client_secret && (
        <div className={styles.stripeElement}>
          <Elements
            stripe={stripePromise}
            options={{ clientSecret: cart.payment_intent_client_secret }}
          >
            <CheckoutForm />
          </Elements>
        </div>
      )}
      {router.query.redirect_status === "succeeded" && (
        <button className={styles.capturePayment} onClick={capturePayment}>
          Capture payment
        </button>
      )}
    </div>
  );
}

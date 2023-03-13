import { Bag } from "@/interfaces/Bag.interface";
import { Sku } from "@/interfaces/Sku.interface";
import { setCart } from "@/redux/actions/cart";
import { RootState } from "@/redux/reducers";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import axios from "axios";
import { useRouter } from "next/router";
import { useCallback, useEffect } from "react";
import useSWR from "swr";
import styles from "./Checkout.module.scss";

export default function CheckoutPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const cart = useAppSelector((state: RootState) => state.cart);
  const { data: getCartData } = useSWR(
    router.query.cartId ? `/api/checkout/cart/${router.query.cartId}` : null,
    async (url: string) => (await axios.get(url)).data
  );
  const { data: availableShippingData } = useSWR(
    cart.shipping_address
      ? `/api/checkout/cart/${cart.id}/shipping/available`
      : null,
    async (url: string) => (await axios.get(url)).data
  );

  const applyCustomerInfo = useCallback(async () => {
    if (cart.id) {
      await axios.post(`/api/checkout/cart/${cart.id}/customer`, {
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
      });
    }
  }, [cart.id]);

  const applyShipping = useCallback(async () => {
    if (availableShippingData) {
      // Apply the first available shipping method
      await axios.post(
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
    }
  }, [availableShippingData]);

  const checkout = useCallback(async () => {
    if (cart.id) {
      await axios.post(
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
      <button className={styles.checkout} onClick={applyCustomerInfo}>
        Apply customer info
      </button>
      <button className={styles.checkout} onClick={applyShipping}>
        Apply shipping
      </button>
      <button className={styles.checkout} onClick={checkout}>
        Checkout
      </button>
    </div>
  );
}

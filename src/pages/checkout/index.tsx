import { Bag } from "@/interfaces/Bag.interface";
import { Sku } from "@/interfaces/Sku.interface";
import { RootState } from "@/redux/reducers";
import { useAppSelector } from "@/redux/store";
import axios from "axios";
import { useRouter } from "next/router";
import { useCallback } from "react";
import styles from "./Checkout.module.scss";

export default function CheckoutPage() {
  const router = useRouter();
  const cart = useAppSelector((state: RootState) => state.cart);

  const checkout = useCallback(async () => {
    if (cart) {
      const response = await axios.post(
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
  }, [cart]);

  return (
    <div className={styles.checkoutPage}>
      <h1>Checkout</h1>
      <div>
        {cart?.bags
          ?.reduce((skus: Sku[], bag: Bag) => skus.concat(bag.skus), [])
          .map((sku: Sku) => (
            <div>
              {sku.id}: {sku.quantity}
            </div>
          ))}
      </div>
      <button className={styles.checkout} onClick={checkout}>
        Checkout
      </button>
    </div>
  );
}

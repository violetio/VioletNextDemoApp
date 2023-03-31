import styles from "./CartPanel.module.scss";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { RootState } from "@/redux/reducers";
import { useCallback, useMemo } from "react";

import Image from "next/image";
import axios from "axios";
import { setCart } from "@/redux/actions/cart";

/**
 * Panel component for displaying current cart data
 */
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
  return (
    <div className={styles.cartPanel}>
      <div className={styles.header}>Cart</div>
      <div className={styles.product}>
        {skusInCart?.map((sku) => (
          <div className={styles.product}>
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
    </div>
  );
};

export default CartPanel;

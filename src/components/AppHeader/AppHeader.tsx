import { Bag } from "@/interfaces/Bag.interface";
import HomeIcon from "@/public/svg/home.svg";
import CartIcon from "@/public/svg/shopping-cart.svg";
import { showCart } from "@/redux/actions/cart";
import { RootState } from "@/redux/reducers";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import Link from "next/link";
import { useRouter } from "next/router";
import useSWR from "swr";
import { setCart } from "@/redux/actions/cart";
import axios from "axios";
import styles from "./AppHeader.module.scss";
import { useEffect } from "react";

export default function AppHeader() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const cart = useAppSelector((state: RootState) => state.cart);
  // Fetch cart data if a cartId is present in the query param
  const { data: getCartData } = useSWR(
    router.query.cartId ? `/api/checkout/cart/${router.query.cartId}` : null,
    async (url: string) => (await axios.get(url)).data
  );
  useEffect(() => {
    if (getCartData) {
      dispatch(setCart(getCartData));
    }
  }, [getCartData]);
  return (
    <div className={styles.header}>
      <Link href={"/"}>
        <HomeIcon className={styles.home} />
      </Link>
      <div className={styles.cartContainer}>
        <CartIcon
          className={styles.cart}
          onClick={() => dispatch(showCart())}
        />
        {cart.cart?.bags && (
          <div className={styles.counter}>
            {cart.cart?.bags.reduce(
              (skuCount: number, bag: Bag) => skuCount + bag.skus.length,
              0
            )}
          </div>
        )}{" "}
      </div>
    </div>
  );
}

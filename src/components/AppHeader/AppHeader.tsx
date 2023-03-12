import { Bag } from "@/interfaces/Bag.interface";
import CartIcon from "@/public/svg/shopping-cart.svg";
import { RootState } from "@/redux/reducers";
import { useAppSelector } from "@/redux/store";
import Link from "next/link";
import styles from "./AppHeader.module.scss";

export default function AppHeader() {
  const cart = useAppSelector((state: RootState) => state.cart);
  return (
    <div className={styles.header}>
      <div className={styles.cartContainer}>
        <Link href={`/checkout?cartId=${cart.id}`}>
          <CartIcon className={styles.cart} />
          {cart?.bags && (
            <div className={styles.counter}>
              {cart.bags.reduce(
                (skuCount: number, bag: Bag) => skuCount + bag.skus.length,
                0
              )}
            </div>
          )}{" "}
        </Link>
      </div>
    </div>
  );
}

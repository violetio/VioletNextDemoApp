import cx from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { useEffect } from 'react';
import { ShoppingCartIcon } from '@heroicons/react/20/solid';
import { Bag, cartEndpoint, getCart, OrderSku } from '@violetio/violet-js';
import styles from './AppHeader.module.scss';
import { setCart, showCart } from '@/redux/actions/cart';
import { RootState } from '@/redux/reducers';
import { useAppDispatch, useAppSelector } from '@/redux/store';

export default function AppHeader() {
  const router = useRouter();
  const cartId = router.query.cartId as string;
  const dispatch = useAppDispatch();
  const cart = useAppSelector((state: RootState) => state.cart);
  // Fetch cart data if a cartId is present in the query param
  const { data: getCartData } = useSWR(
    cartId ? cartEndpoint(cartId) : null,
    async () => (await getCart(cartId)).data
  );

  useEffect(() => {
    if (getCartData && router.pathname !== '/paymentAccepted') {
      dispatch(setCart(getCartData));
    }
  }, [getCartData, dispatch, router.pathname]);

  return (
    <header className={styles.header}>
      <div className={styles.appHeader}>
        <Link className={styles.ultra} href={'/'}>
          Ultra
        </Link>
        <div
          className={styles.cartContainer}
          onClick={() => dispatch(showCart())}
        >
          <ShoppingCartIcon className={styles.cart} />
          <div className={styles.counter}>
            {/* Go through each bag and add the quantity for each sku to display amount of items in the cart */}
            {cart.order?.bags.reduce(
              (totalQuantity: number, bag: Bag) =>
                totalQuantity +
                (bag.skus?.reduce(
                  (skuQuantity: number, sku: OrderSku) =>
                    skuQuantity + (sku.quantity || 0),
                  0
                ) || 0),
              0
            ) || 0}
          </div>
        </div>
      </div>
    </header>
  );
}

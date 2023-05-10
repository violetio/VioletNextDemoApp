import cx from 'classnames';
import Link from 'next/link';
import { useState } from 'react';
import styles from './Checkout.module.scss';
import CartPanel from '@/components/CartPanel/CartPanel';
import GuestCheckout from '@/components/GuestCheckout/GuestCheckout';
import { useDesktopMediaQuery } from '@/utilities/responsive';

const CheckoutPage = () => {
  const [curStep, setCurStep] = useState(0);
  const isDesktop = useDesktopMediaQuery();

  return (
    <div className={cx(styles.checkoutPage, { [styles.vertical]: !isDesktop })}>
      <div className={styles.leftSide}>
        <div className={styles.checkout}>
          <Link className={styles.ultra} href={'/'}>
            Ultra
          </Link>
          <div className={styles.container}>
            <GuestCheckout curStep={curStep} setCurStep={setCurStep} />
          </div>
        </div>
      </div>
      <div className={styles.cartPanel}>
        <CartPanel
          closeable={false}
          showShippingPerBag={curStep >= 2}
          showTaxesPerBag={curStep >= 2}
          showTotal={curStep >= 2}
        />
      </div>
    </div>
  );
};

export default CheckoutPage;

import { useRouter } from 'next/router';
import { ReactElement, useEffect } from 'react';
import useSWR from 'swr';
import Link from 'next/link';
import {
  Bag,
  cartEndpoint,
  getCart,
  OrderStatus,
  submitPayment,
} from '@violetio/violet-js';
import styles from './PaymentAccepted.module.scss';
import SidePanelLayout from '@/components/SidePanelLayout/SidePanelLayout';
import BagView from '@/components/CartPanel/BagView/BagView';
import CheckoutReview from '@/components/CheckoutReview/CheckoutReview';

const PaymentAccepted = () => {
  const router = useRouter();
  const cartId = router.query.cartId as string;
  const { data: cartData } = useSWR(
    cartId ? cartEndpoint(cartId) : null,
    async () => (await getCart(cartId)).data
  );
  const submitPaymentFlow = async (cartId: string) => {
    try {
      await submitPayment(cartId);
    } catch (e) {
      // Error submitting payment
    }
  };

  useEffect(() => {
    if (router.query.redirect_status === 'succeeded' && cartData) {
      if (cartData.status === OrderStatus.IN_PROGRESS) {
        submitPaymentFlow(cartData.id.toString());
      }
    }
  }, [router.query.redirect_status, cartData]);

  if (!cartData) return null;

  return (
    <div className={styles.paymentAccepted}>
      <div className={styles.receiptContainer}>
        <div className={styles.header}>Payment successful!</div>
        <div className={styles.subheader}>
          Thank you for your order. Review detail below or{' '}
          <Link href="/">
            <span className={styles.continueShopping}>continue shopping.</span>
          </Link>
        </div>
        {cartData?.bags.map((bag: Bag) => (
          <BagView
            key={bag.id}
            bag={bag}
            showShipping={true}
            showTaxes={true}
            editable={false}
          />
        ))}
        <CheckoutReview receiptView order={cartData} />
      </div>
    </div>
  );
};

PaymentAccepted.getLayout = function getLayout(page: ReactElement) {
  return <SidePanelLayout>{page}</SidePanelLayout>;
};

export default PaymentAccepted;

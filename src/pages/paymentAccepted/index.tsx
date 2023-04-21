import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { submitPayment, updatePricing } from '@/api/checkout/cart';

const PaymentAccepted = () => {
  const router = useRouter();

  const submitPaymentFlow = async (cartId: string) => {
    await submitPayment(cartId as string);
  };
  useEffect(() => {
    if (router.query.redirect_status === 'succeeded' && router.query.cartId) {
      submitPaymentFlow(router.query.cartId as string);
    }
  }, [router.query.redirect_status, router.query.cartId]);
  return <div>Payment Accepted</div>;
};

export default PaymentAccepted;

import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from '../CheckoutForm/CheckoutForm';
import AddressForm from '../AddressForm/AddressForm';
import styles from './GuestCheckout.module.scss';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { RootState } from '@/redux/reducers';
import { stripe } from '@/stripe/stripe';
import ShippingMethodOptions from '@/components/ShippingMethodOptions/ShippingMethodOptions';
import CheckoutReview from '@/components/CheckoutReview/CheckoutReview';

interface GuestCheckoutProps {
  curStep: number;
  setCurStep: (step: number) => void;
}
/**
 * Panel component for displaying current cart data and Stripe payment elements
 * for completing checkout.
 */

const GuestCheckout = ({ curStep, setCurStep }: GuestCheckoutProps) => {
  const cartState = useAppSelector((state: RootState) => state.cart);
  const stripeKey = cartState.order?.stripeKey;

  if (!cartState.order) {
    return null;
  }

  return (
    <>
      {curStep === 0 && (
        <>
          <div className={styles.header}>Checkout</div>
          {cartState.order?.paymentIntentClientSecret &&
            stripeKey &&
            cartState.order?.bags.length === 1 && (
            <div className={styles.stripeElement}>
              <Elements
                stripe={stripe}
                options={{
                  clientSecret: cartState.order?.paymentIntentClientSecret,
                }}
              >
                <CheckoutForm fullApplePayCheckout={true} />
              </Elements>
            </div>
          )}
          <div className={styles.guestCheckoutDivider}>
            <div className={styles.divider} />
            <div className={styles.label}>Guest Checkout</div>
            <div className={styles.divider} />
          </div>
          <AddressForm onSubmit={(nextStep: number) => setCurStep(nextStep)} />
        </>
      )}
      {curStep === 1 && <ShippingMethodOptions setCurStep={setCurStep} />}
      {curStep === 2 && <CheckoutReview order={cartState.order} />}
    </>
  );
};

export default GuestCheckout;

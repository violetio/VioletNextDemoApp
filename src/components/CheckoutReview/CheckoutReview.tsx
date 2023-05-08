import { BuildingStorefrontIcon } from '@heroicons/react/24/solid';
import { Elements } from '@stripe/react-stripe-js';
import { Order } from '@violet/violet-js/interfaces/Order.interface';
import styles from './CheckoutReview.module.scss';
import { stripe } from '@/stripe/stripe';
import CheckoutForm from '@/components/CheckoutForm/CheckoutForm';

interface CheckoutReviewProps {
  order: Order;
  receiptView?: boolean;
}

const CheckoutReview = ({
  order,
  receiptView = false,
}: CheckoutReviewProps) => {
  return (
    <div className={styles.review}>
      {!receiptView && <div className={styles.header}>Checkout</div>}
      <div className={styles.container}>
        <div className={styles.header}>Shipping Address</div>
        {order.shippingAddress.name}
        <br />
        {order.shippingAddress.address_1}
        <br />
        {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
        {order.shippingAddress.postalCode}
      </div>
      <div className={styles.container}>
        <div className={styles.header}>Billing Address</div>
        {order.billingAddress.name}
        <br />
        {order.billingAddress.address_1}
        <br />
        {order.billingAddress.city}, {order.billingAddress.state}{' '}
        {order.billingAddress.postalCode}
      </div>
      <div className={styles.container}>
        <div className={styles.header}>Shipping Methods</div>
        {order.bags?.map((bag) => (
          <div key={bag.id} className={styles.shippingMethod}>
            <div className={styles.merchantName}>
              <BuildingStorefrontIcon className={styles.storeIcon} />
              {bag.merchantName}
            </div>
            {bag.shippingMethod?.label}
          </div>
        ))}
      </div>
      {!receiptView && (
        <Elements
          stripe={stripe}
          options={{
            clientSecret: order.paymentIntentClientSecret,
          }}
        >
          <CheckoutForm fullApplePayCheckout={false} />
        </Elements>
      )}
    </div>
  );
};

export default CheckoutReview;

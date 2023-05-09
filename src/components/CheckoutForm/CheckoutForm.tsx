import React, { useEffect, useState } from 'react';
import {
  PaymentElement,
  PaymentRequestButtonElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import { PaymentRequest } from '@stripe/stripe-js';
import { useRouter } from 'next/router';
import { Order } from '@violet/violet-js/interfaces/Order.interface';
import { updatePricing } from '@violet/violet-js/api/checkout/cart';
import styles from './CheckoutForm.module.scss';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { RootState } from '@/redux/reducers';
import {
  onPaymentMethodCreated,
  onShippingAddressChange,
  onShippingOptionChange,
} from '@/stripe/stripe';
import { setCart } from '@/redux/actions/cart';
import Button from '@/components/Button/Button';

interface Props {
  fullApplePayCheckout: boolean;
}

const CheckoutForm = ({ fullApplePayCheckout }: Props) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const stripe = useStripe();
  const elements = useElements();
  const [paymentRequest, setPaymentRequest] = useState<PaymentRequest | null>(
    null
  );
  const cartState = useAppSelector((state: RootState) => state.cart);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (stripe && fullApplePayCheckout && cartState.order) {
      const pr = stripe.paymentRequest({
        // Using 'US' and 'USD' here for the purposes of the demo.
        // Change this to reflect the appropriate country and currency needed for each use case.
        country: 'US', //From the Order object
        currency: 'usd', //From the Order object
        total: {
          label: 'Sub Total', //From the Order object
          amount: cartState.order?.subTotal || 0,
        },
        requestPayerName: true,
        requestPayerEmail: true,
        requestShipping: true,
      });
      // Check the availability of the Payment Request API.
      pr.canMakePayment().then((result) => {
        if (result) {
          setPaymentRequest(pr);
        }
      });
      pr.on('shippingaddresschange', (ev) => {
        if (cartState.order) {
          onShippingAddressChange(ev, cartState.order, (updatedOrder: Order) =>
            dispatch(setCart(updatedOrder))
          );
        }
      });
      pr.on('shippingoptionchange', (ev) => {
        if (cartState.order) {
          onShippingOptionChange(ev, cartState.order);
        }
      });
      pr.on('paymentmethod', async (ev) => {
        if (cartState.order) {
          onPaymentMethodCreated(ev, stripe, cartState.order);
        }
      });
    }
  }, [
    stripe,
    cartState.order?.id,
    cartState.order,
    dispatch,
    fullApplePayCheckout,
  ]);

  const [errorMessage, setErrorMessage] = useState<string>();

  const handleSubmit = async (event: any) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();
    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }
    setLoading(true);
    await updatePricing(cartState.order?.id.toString()!);

    const { error } = await stripe.confirmPayment({
      //`Elements` instance that was used to create the Payment Element
      elements,
      confirmParams: {
        return_url: `${window.location.protocol}//${window.location.host}/paymentAccepted?cartId=${
          cartState.order?.id
        }&${new URLSearchParams(
          router.query as Record<string, string>
        ).toString()}`,
      },
    });

    if (error) {
      // This point will only be reached if there is an immediate error when
      // confirming the payment. Show error to your customer (for example, payment
      // details incomplete)
      setErrorMessage(error.message);
    } else {
      // Your customer will be redirected to your `return_url`. For some payment
      // methods like iDEAL, your customer will be redirected to an intermediate
      // site first to authorize the payment, then redirected to the `return_url`.
    }
    setLoading(false);
  };

  return (
    <>
      {fullApplePayCheckout ? (
        <>
          {paymentRequest ? (
            <PaymentRequestButtonElement
              className={styles.stripeElement}
              options={{ paymentRequest }}
            />
          ) : null}
        </>
      ) : (
        <form onSubmit={handleSubmit}>
          <PaymentElement />
          <Button
            className={styles.submitButton}
            label="Submit"
            disabled={!stripe}
            loading={loading}
          />
          {/* Show error message to your customers */}
          {errorMessage && <div>{errorMessage}</div>}
        </form>
      )}
    </>
  );
};

export default CheckoutForm;

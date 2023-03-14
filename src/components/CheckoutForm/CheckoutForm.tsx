import React, { useState, useEffect } from "react";
import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import styles from "./CheckoutForm.module.scss";
import { useRouter } from "next/router";

const CheckoutForm = () => {
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();

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

    console.log(window.location.host + router.pathname);
    const { error } = await stripe.confirmPayment({
      //`Elements` instance that was used to create the Payment Element
      elements,
      confirmParams: {
        return_url:
          "https://" +
          window.location.host +
          router.pathname +
          "?" +
          new URLSearchParams(
            router.query as Record<string, string>
          ).toString(),
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
  };

  // if (paymentRequest) {
  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <button className={styles.submitButton} disabled={!stripe}>
        Submit
      </button>
      {/* Show error message to your customers */}
      {errorMessage && <div>{errorMessage}</div>}
    </form>
    // <PaymentRequestButtonElement
    //   className={styles.stripeElement}
    //   options={{ paymentRequest }}
    // />
  );
  // }
  // Use a traditional checkout form.
  // return <div>Insert your form or button component here.</div>;
};

export default CheckoutForm;

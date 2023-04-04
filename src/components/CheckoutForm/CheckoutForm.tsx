import React, { useState, useEffect, useCallback } from "react";
import {
  PaymentElement,
  PaymentRequestButtonElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import {
  PaymentRequest,
  PaymentRequestShippingOption,
  PaymentRequestUpdateDetails,
} from "@stripe/stripe-js";
import styles from "./CheckoutForm.module.scss";
import { useRouter } from "next/router";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { RootState } from "@/redux/reducers";
import axios from "axios";
import { Bag } from "@/interfaces/Bag.interface";
import { setCart } from "@/redux/actions/cart";

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

  const applyShipping = async (
    shippingOption: PaymentRequestShippingOption,
    updateWith: (details: PaymentRequestUpdateDetails) => void
  ) => {
    const applyShippingResponse = await axios.post(
      `/api/checkout/cart/${cartState.cart?.id}/shipping`,
      cartState.cart?.bags.map((bag) => ({
        bag_id: bag.bag_id,
        shipping_method_id: shippingOption.id,
      })),
      {
        params: {
          price_cart: true,
        },
      }
    );

    console.log("applied shipping: ", applyShippingResponse.data);
    updateWith({
      status: "success",
      total: {
        amount: applyShippingResponse.data.total,
        label: "Total",
      },
    });
  };

  useEffect(() => {
    if (stripe && fullApplePayCheckout && cartState.cart) {
      const pr = stripe.paymentRequest({
        country: "US", //From the Order object
        currency: "usd", //From the the Order object
        total: {
          label: "Sub Total", //From the Order object
          amount: cartState.cart?.sub_total,
        },
        requestPayerName: true,
        requestPayerEmail: true,
        requestShipping: true,
      });
      console.log("make payment request: ", pr);
      // Check the availability of the Payment Request API.
      pr.canMakePayment().then((result) => {
        if (result) {
          console.log("result: ", result);
          setPaymentRequest(pr);
        }
      });
      pr.on("shippingaddresschange", async (ev) => {
        if (ev.shippingAddress.country !== "US") {
          ev.updateWith({ status: "invalid_shipping_address" });
        } else {
          // Apply customer info with info from Apple Pay
          console.log("recipient: ", ev.shippingAddress.recipient);
          console.log("shipping address: ", {
            address_1: ev.shippingAddress.addressLine,
            city: ev.shippingAddress.city,
            country: ev.shippingAddress.country,
            postal_code: ev.shippingAddress.postalCode,
            state: ev.shippingAddress.region,
            type: "SHIPPING",
          });
          const updatedCartResponse = await axios.post(
            `/api/checkout/cart/${cartState.cart?.id}/customer`,
            {
              first_name: "John",
              last_name: "Doe",
              email: "hello@violet.io",
              shipping_address: {
                address_1: "",
                city: ev.shippingAddress.city,
                country: ev.shippingAddress.country,
                postal_code: ev.shippingAddress.postalCode,
                state: ev.shippingAddress.region,
                type: "SHIPPING",
              },
              same_address: true,
            }
          );

          dispatch(setCart(updatedCartResponse.data));

          // Perform server-side request to fetch shipping options
          const availableShippingOptions = await axios.get(
            `/api/checkout/cart/${cartState.cart?.id}/shipping/available`
          );
          console.log(
            "update with shipping: ",
            availableShippingOptions.data.flatMap((bagShippingMethods: any) => {
              const shippingMethods = bagShippingMethods.shipping_methods;
              return shippingMethods.map((shippingMethod: any) => {
                return {
                  id: shippingMethod.shipping_method_id,
                  label: shippingMethod.label,
                  detail: shippingMethod.label,
                  amount: shippingMethod.price,
                };
              });
            })
          );
          ev.updateWith({
            status: "success",
            shippingOptions: availableShippingOptions.data.flatMap(
              (bagShippingMethods: any) => {
                const shippingMethods = bagShippingMethods.shipping_methods;
                return shippingMethods.map((shippingMethod: any) => {
                  return {
                    id: shippingMethod.shipping_method_id,
                    label: shippingMethod.label,
                    detail: shippingMethod.label,
                    amount: shippingMethod.price,
                  };
                });
              }
            ),
          });
        }
      });
      pr.on("shippingoptionchange", function (event) {
        console.log("shipping option change");
        var updateWith = event.updateWith;
        var shippingOption = event.shippingOption;
        // Send shipping method selected to Violet API
        applyShipping(shippingOption, updateWith);
      });
      pr.on("paymentmethod", async (event) => {
        // Confirm the PaymentIntent without handling potential next actions (yet).
        console.log("payment method event: ", event);
        const payerName = event.payerName?.split(" ");
        const updatedCartResponse = await axios.post(
          `/api/checkout/cart/${cartState.cart?.id}/customer`,
          {
            first_name: payerName?.[0],
            last_name: payerName?.[1],
            email: event.payerEmail,
            shipping_address: {
              address_1: event.shippingAddress?.addressLine?.[0],
              city: event.shippingAddress?.city,
              country: event.shippingAddress?.country,
              postal_code: event.shippingAddress?.postalCode,
              state: event.shippingAddress?.region,
              type: "SHIPPING",
            },
            same_address: true,
          }
        );
        console.log("Updated Customer info: ", updatedCartResponse);
        // Update pricing
        const updatedPricingResponse = await axios.post(
          `/api/checkout/cart/${cartState.cart?.id}/payment/update`
        );

        console.log("Updated pricing response: ", updatedPricingResponse);

        const { paymentIntent, error: confirmError } =
          await stripe.confirmCardPayment(
            cartState.cart?.payment_intent_client_secret!,
            { payment_method: event.paymentMethod.id },
            { handleActions: false }
          );
        const complete = event.complete;
        // Update customer info with latest customer information
        if (!confirmError) {
          // Submit payment
          await axios.post(`/api/checkout/cart/${cartState.cart?.id}/submit`);
          complete("success");
        } else {
          // Report to the browser that the payment failed, prompting it to
          // re-show the payment interface, or show an error message and close
          // the payment interface.
          complete("fail");
        }
      });
    }
  }, [stripe, cartState.cart?.id]);

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
    <>
      {fullApplePayCheckout && paymentRequest ? (
        <PaymentRequestButtonElement
          className={styles.stripeElement}
          options={{ paymentRequest }}
        />
      ) : (
        <form onSubmit={handleSubmit}>
          <PaymentElement />
          <button className={styles.submitButton} disabled={!stripe}>
            Submit
          </button>
          {/* Show error message to your customers */}
          {errorMessage && <div>{errorMessage}</div>}
        </form>
      )}
    </>
  );
  // }
  // Use a traditional checkout form.
  // return <div>Insert your form or button component here.</div>;
};

export default CheckoutForm;

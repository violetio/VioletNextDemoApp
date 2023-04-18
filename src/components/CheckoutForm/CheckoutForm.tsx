import React, { useState, useEffect } from "react";
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
import { setCart } from "@/redux/actions/cart";
import {
  applyCustomerInfoToCart,
  applyShippingMethodsToBags,
  fetchShippingOptions,
  submitPayment,
  updatePricing,
} from "@/api/checkout/cart";
import { AddressType } from "@/enums/AddressType";

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
    if (cartState.cart?.id) {
      const applyShippingResponse = await applyShippingMethodsToBags(
        cartState.cart?.id.toString(),
        cartState.cart?.bags.map((bag) => ({
          bagId: bag.id,
          shippingMethodId: shippingOption.id,
        }))
      );

      console.log("applied shipping: ", applyShippingResponse.data);
      updateWith({
        status: "success",
        total: {
          amount: applyShippingResponse.data.total || 0,
          label: "Total",
        },
      });
    } else {
      updateWith({
        status: "fail",
      });
    }
  };

  useEffect(() => {
    if (stripe && fullApplePayCheckout && cartState.cart) {
      const pr = stripe.paymentRequest({
        // Using 'US' and 'USD' here for the purposes of the demo. Change this to reflect the appropriate country and currency needed for each use case.
        country: "US", //From the Order object
        currency: "usd", //From the Order object
        total: {
          label: "Sub Total", //From the Order object
          amount: cartState.cart?.subTotal || 0,
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
          const updatedCartResponse = await applyCustomerInfoToCart(
            cartState.cart?.id.toString() as string,
            {
              firstName: "John",
              lastName: "Doe",
              email: "hello@violet.io",
              shippingAddress: {
                address_1: "",
                city: ev.shippingAddress.city!,
                country: ev.shippingAddress.country,
                postalCode: ev.shippingAddress.postalCode!,
                state: ev.shippingAddress.region!,
                type: AddressType.SHIPPING,
              },
              sameAddress: true,
            }
          );

          dispatch(setCart(updatedCartResponse.data));

          // Perform server-side request to fetch shipping options
          const availableShippingOptions = await fetchShippingOptions(
            cartState.cart?.id.toString() as string
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
        const updatedCartResponse = await applyCustomerInfoToCart(
          cartState.cart?.id.toString() as string,
          {
            firstName: payerName?.[0]!,
            lastName: payerName?.[1]!,
            email: event.payerEmail,
            shippingAddress: {
              address_1: event.shippingAddress?.addressLine?.[0]!,
              address_2: event.shippingAddress?.addressLine?.[1]!,
              city: event.shippingAddress?.city!,
              country: event.shippingAddress?.country!,
              postalCode: event.shippingAddress?.postalCode!,
              state: event.shippingAddress?.region!,
              type: AddressType.SHIPPING,
            },
            sameAddress: true,
          }
        );

        console.log("Updated Customer info: ", updatedCartResponse);
        // Update pricing
        const updatedPricingResponse = await updatePricing(
          cartState.cart?.id.toString() as string
        );

        console.log("Updated pricing response: ", updatedPricingResponse);

        const { paymentIntent, error: confirmError } =
          await stripe.confirmCardPayment(
            cartState.cart?.paymentIntentClientSecret!,
            { payment_method: event.paymentMethod.id },
            { handleActions: false }
          );
        const complete = event.complete;
        // Update customer info with latest customer information
        if (!confirmError) {
          // Submit payment
          await submitPayment(cartState.cart?.id.toString() as string);
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
        return_url: `https://${
          window.location.host
        }/paymentAccepted?${new URLSearchParams(
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
      await submitPayment(cartState.cart?.id.toString() as string);
      // Your customer will be redirected to your `return_url`. For some payment
      // methods like iDEAL, your customer will be redirected to an intermediate
      // site first to authorize the payment, then redirected to the `return_url`.
    }
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

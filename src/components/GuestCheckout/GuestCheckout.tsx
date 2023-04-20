import styles from "./GuestCheckout.module.scss";
import { useAppSelector } from "@/redux/store";
import { RootState } from "@/redux/reducers";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";

import { Elements } from "@stripe/react-stripe-js";
import {
  applyShippingMethodsToBags,
  fetchShippingOptions,
} from "@/api/checkout/cart";
import { stripe } from "@/stripe/stripe";
import CheckoutForm from "../CheckoutForm/CheckoutForm";
import AddressForm from "../AddressForm/AddressForm";
import { OrderShippingMethodWrapper } from "@/interfaces/OrderShippingMethodWrapper.interface";

/**
 * Panel component for displaying current cart data and Stripe payment elements
 * for completing checkout.
 */
const GuestCheckout = () => {
  const cartState = useAppSelector((state: RootState) => state.cart);
  const [curStep, setCurStep] = useState(0);
  const [email, setEmail] = useState("");
  const [availableShippingMethods, setAvailableShippingMethods] =
    useState<OrderShippingMethodWrapper[]>();
  /**
   * selectedShippingMethods mapping bagId to the shippingMethodId
   * ex: 
   * {
      [bagId]: [shippingMethodId]
      }
    */
  const [selectedShippingMethods, setSelectedShippingMethods] = useState<{
    [key: string]: string;
  }>({});
  const emailInputRef = useRef<HTMLInputElement>(null);

  const emailSubmit = useCallback((e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (emailInputRef.current?.value) {
      setEmail(emailInputRef.current.value);
      setCurStep(1);
    }
  }, []);

  const fetchShippingOptionsCallback = useCallback(async () => {
    if (cartState.cart?.id) {
      const availableShippingData = await fetchShippingOptions(
        cartState.cart.id.toString()
      );
      setAvailableShippingMethods(availableShippingData.data);
    }
  }, [[]]);

  const applyShipping = useCallback(async () => {
    if (cartState.cart?.id) {
      const response = await applyShippingMethodsToBags(
        cartState.cart.id.toString(),
        Object.keys(selectedShippingMethods).map((bagId: string) => ({
          bagId: Number(bagId),
          shippingMethodId: selectedShippingMethods[bagId],
        }))
      );
      if (response.status === 200) {
        setCurStep(4);
      }
    }
  }, [cartState.cart?.id, selectedShippingMethods]);

  useEffect(() => {
    if (curStep === 3) {
      // Fetch available shipping methods
      fetchShippingOptionsCallback();
    }
  }, [curStep]);

  return (
    <>
      {curStep === 0 && (
        <form className={styles.email} onSubmit={emailSubmit}>
          <div className={styles.emailLabel}>Email</div>
          <input
            ref={emailInputRef}
            className={styles.emailInput}
            placeholder="Email"
          />
          <button className={styles.submit}>Submit</button>
        </form>
      )}
      {curStep === 1 && (
        <Elements
          stripe={stripe}
          options={{
            clientSecret: cartState.cart?.paymentIntentClientSecret,
          }}
        >
          <AddressForm
            email={email}
            addressType="shipping"
            onSubmit={(nextStep: number) => setCurStep(nextStep)}
          />
        </Elements>
      )}
      {curStep === 2 && (
        <Elements
          stripe={stripe}
          options={{
            clientSecret: cartState.cart?.paymentIntentClientSecret,
          }}
        >
          <AddressForm
            email={email}
            addressType="billing"
            onSubmit={(nextStep: number) => setCurStep(nextStep)}
          />
        </Elements>
      )}
      {curStep === 3 && availableShippingMethods && (
        <div className={styles.shippingMethods}>
          Shipping Methods
          {availableShippingMethods.map((shippingMethodWrapper) => (
            <div className={styles.bag}>
              Bag 1:
              {shippingMethodWrapper.shippingMethods.map((shippingMethod) => (
                <div className={styles.shippingMethod}>
                  <input
                    type="checkbox"
                    checked={
                      selectedShippingMethods[shippingMethod.bagId] ===
                      shippingMethod.shippingMethodId
                    }
                    onChange={() => {
                      setSelectedShippingMethods((prev) => ({
                        ...prev,
                        // Replace the previous shipping method selected for this bag
                        [shippingMethod.bagId]: shippingMethod.shippingMethodId,
                      }));
                    }}
                  />
                  {shippingMethod.label}
                </div>
              ))}
            </div>
          ))}
          <button className={styles.submit} onClick={applyShipping}>
            Submit
          </button>
        </div>
      )}
      {curStep === 4 && (
        <Elements
          stripe={stripe}
          options={{
            clientSecret: cartState.cart?.paymentIntentClientSecret,
          }}
        >
          <CheckoutForm fullApplePayCheckout={false} />
        </Elements>
      )}
    </>
  );
};

export default GuestCheckout;

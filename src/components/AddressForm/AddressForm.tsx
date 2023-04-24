import React, { FormEvent, useCallback, useRef } from 'react';
import { AddressElement } from '@stripe/react-stripe-js';
import {
  applyBillingAddress,
  applyCustomerInfoToCart,
} from '@violet/violet-js/api/checkout/cart';
import { AddressType } from '@violet/violet-js/enums/AddressType';
import { StripeAddress } from '@violet/violet-js/interfaces/StripeAddress.interface';
import styles from './AddressForm.module.scss';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { RootState } from '@/redux/reducers';
import { setCart } from '@/redux/actions/cart';

interface Props {
  email: string;
  addressType: 'shipping' | 'billing';
  onSubmit?: (nextStep: number) => void;
}

const AddressForm = ({ email, addressType, onSubmit }: Props) => {
  const dispatch = useAppDispatch();
  const cartState = useAppSelector((state: RootState) => state.cart);
  const completedAddress = useRef<StripeAddress>();
  const sameAsBillingRef = useRef<HTMLInputElement>(null);

  const guestInfoSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const address = completedAddress.current;
      const sameBillingAddress = sameAsBillingRef.current?.checked;
      if (address) {
        if (addressType === 'shipping') {
          const name = address.name.split(' ');
          const firstName = name[0];
          const lastName = name.length > 1 ? name[name.length - 1] : '';
          try {
            const updatedOrderInfo = await applyCustomerInfoToCart(
              cartState.order?.id.toString()!,
              {
                firstName,
                lastName,
                email,
                shippingAddress: {
                  address_1: address.address.line1,
                  address_2: address.address.line2 || undefined,
                  city: address.address.city,
                  country: address.address.country,
                  postalCode: address.address.postal_code,
                  state: address.address.state,
                  type: AddressType.SHIPPING,
                },
                sameAddress: sameBillingAddress,
              }
            );
            dispatch(setCart(updatedOrderInfo.data));
            if (sameBillingAddress) {
              onSubmit?.(3);
            } else {
              onSubmit?.(2);
            }
          } catch (e) {
            // Handle error from attempt to apply customer info with shipping address
            // Show error to customer
          }
        } else {
          try {
            const updatedOrderInfo = await applyBillingAddress(
              cartState.order?.id.toString()!,
              {
                address_1: address.address.line1,
                address_2: address.address.line2 || undefined,
                city: address.address.city,
                country: address.address.country,
                postalCode: address.address.postal_code,
                state: address.address.state,
                type: AddressType.BILLING,
              }
            );
            dispatch(setCart(updatedOrderInfo.data));
            onSubmit?.(3);
          } catch (e) {
            // Handle error from attempt to apply billing address to the order
            // Show error to customer
          }
        }
      }
    },
    [addressType, cartState.order?.id, dispatch, email, onSubmit]
  );

  return (
    <form onSubmit={guestInfoSubmit}>
      <AddressElement
        options={{ mode: 'shipping' }}
        onChange={(event) => {
          if (event.complete) {
            const address = event.value;
            completedAddress.current = address;
          }
        }}
      />
      {addressType === 'shipping' && (
        <div className={styles.sameAsBilling}>
          <input ref={sameAsBillingRef} type="checkbox" />
          Same as Billing Address
        </div>
      )}
      <button className={styles.submit}>submit</button>
    </form>
  );
  // }
  // Use a traditional checkout form.
  // return <div>Insert your form or button component here.</div>;
};

export default AddressForm;

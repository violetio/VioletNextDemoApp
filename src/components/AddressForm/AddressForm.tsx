import React, { useCallback, useState } from 'react';
import {
  applyBillingAddress,
  applyCustomerInfoToCart,
} from '@violet/violet-js/api/checkout/cart';
import { AddressType } from '@violet/violet-js/enums/AddressType';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import styles from './AddressForm.module.scss';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { RootState } from '@/redux/reducers';
import { setCart } from '@/redux/actions/cart';
import Input from '@/components/Input/Input';
import Checkbox from '@/components/Checkbox/Checkbox';
import Dropdown from '@/components/Dropdown/Dropdown';
import useSupportedCountries from '@/hooks/useSupportedCountries';
import Button from '@/components/Button/Button';

interface AddressFormData {
  email: string;
  shippingName: string;
  shippingAddress1: string;
  shippingAddress2: string;
  shippingCity: string;
  shippingCountry: string;
  shippingState: string;
  shippingPostalCode: string;
  sameAsBilling: boolean;
  billingAddress1: string;
  billingAddress2: string;
  billingCity: string;
  billingCountry: string;
  billingState: string;
  billingPostalCode: string;
}
interface Props {
  onSubmit?: (nextStep: number) => void;
}

const AddressForm = ({ onSubmit }: Props) => {
  const supportedCountries = useSupportedCountries();
  const dispatch = useAppDispatch();
  const cartState = useAppSelector((state: RootState) => state.cart);
  const [showBillingAddress, setShowBillingAddress] = useState(false);
  const [loading, setLoading] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AddressFormData>({
    defaultValues: {
      email: '',
      shippingName: '',
      shippingAddress1: '',
      shippingAddress2: '',
      shippingCity: '',
      shippingCountry: 'United States',
      shippingState: '',
      shippingPostalCode: '',
      sameAsBilling: true,
      billingAddress1: '',
      billingAddress2: '',
      billingCity: '',
      billingCountry: 'United States',
      billingState: '',
      billingPostalCode: '',
    },
  });

  const guestInfoSubmit: SubmitHandler<AddressFormData> = useCallback(
    async (data: AddressFormData) => {
      const shippingCountryCode = supportedCountries.find(
        (country) => country.countryName === data.shippingCountry
      );
      const shippingName = data.shippingName.split(' ');
      const shippingFirstName = shippingName[0];
      const shippingLastName =
        shippingName.length > 1 ? shippingName[shippingName.length - 1] : '';
      try {
        setLoading(true);
        const updatedOrderInfo = await applyCustomerInfoToCart(
          cartState.order?.id.toString()!,
          {
            firstName: shippingFirstName,
            lastName: shippingLastName,
            email: data.email,
            shippingAddress: {
              address_1: data.shippingAddress1,
              address_2: data.shippingAddress2,
              city: data.shippingCity,
              country: shippingCountryCode?.countryTwoLettersAbbreviation!,
              postalCode: data.shippingPostalCode,
              state: data.shippingState,
              type: AddressType.SHIPPING,
            },
            sameAddress: data.sameAsBilling,
          }
        );
        if (!data.sameAsBilling) {
          const billingCountryCode = supportedCountries.find(
            (country) => country.countryName === data.billingCountry
          );
          const billingAddressAppliedResponse = await applyBillingAddress(
            cartState.order?.id.toString()!,
            {
              address_1: data.billingAddress1,
              address_2: data.billingAddress2,
              city: data.billingCity,
              country: billingCountryCode?.countryTwoLettersAbbreviation!,
              postalCode: data.billingPostalCode,
              state: data.billingState,
              type: AddressType.BILLING,
            }
          );
          dispatch(setCart(billingAddressAppliedResponse.data));
        } else {
          dispatch(setCart(updatedOrderInfo.data));
        }
        onSubmit?.(1);
      } catch (e) {
        // Handle error from attempt to apply customer info with shipping address
        // Show error to customer
      }
      setLoading(false);
    },
    [cartState.order?.id, dispatch, onSubmit, supportedCountries]
  );

  return (
    <form onSubmit={handleSubmit(guestInfoSubmit)}>
      <Controller
        name="email"
        control={control}
        rules={{
          required: 'Email required',
        }}
        render={({ field: { onChange, value } }) => (
          <Input
            label="Email Address"
            value={value}
            onChange={onChange}
            error={errors.email?.message}
          />
        )}
      />
      <Controller
        name="shippingName"
        control={control}
        rules={{
          required: 'Full name required',
        }}
        render={({ field: { onChange, value } }) => (
          <Input
            label="Full Name"
            value={value}
            onChange={onChange}
            error={errors.shippingName?.message}
          />
        )}
      />
      <Controller
        name="shippingAddress1"
        control={control}
        rules={{
          required: 'Address Line 1 required',
        }}
        render={({ field: { onChange, value } }) => (
          <Input
            label="Address Line 1"
            value={value}
            onChange={onChange}
            error={errors.shippingAddress1?.message}
          />
        )}
      />
      <Controller
        name="shippingAddress2"
        control={control}
        render={({ field: { onChange, value } }) => (
          <Input label="Address Line 2" value={value} onChange={onChange} />
        )}
      />
      <div className={styles.doubleInput}>
        <Controller
          name="shippingCity"
          control={control}
          rules={{
            required: 'City required',
          }}
          render={({ field: { onChange, value } }) => (
            <Input
              className={styles.leftInput}
              label="City"
              value={value}
              onChange={onChange}
              error={errors.shippingCity?.message}
            />
          )}
        />
        <Controller
          name="shippingCountry"
          control={control}
          rules={{
            required: 'Country required',
          }}
          render={({ field: { onChange, value } }) => (
            <div className={styles.countryDropdown}>
              <div className={styles.label}>Country</div>
              <Dropdown
                classes={{
                  list: styles.list,
                  listButton: styles.listButton,
                  options: styles.options,
                }}
                value={value}
                options={supportedCountries.map(
                  (country) => country.countryName
                )}
                onChange={onChange}
              />
            </div>
          )}
        />
      </div>
      <div className={styles.doubleInput}>
        <Controller
          name="shippingState"
          control={control}
          rules={{
            required: 'State / Province required',
          }}
          render={({ field: { onChange, value } }) => (
            <Input
              className={styles.leftInput}
              label="State / Province"
              value={value}
              onChange={onChange}
              error={errors.shippingState?.message}
            />
          )}
        />
        <Controller
          name="shippingPostalCode"
          control={control}
          rules={{
            required: 'Postal code required',
          }}
          render={({ field: { onChange, value } }) => (
            <Input
              label="Postal code"
              value={value}
              onChange={onChange}
              error={errors.shippingPostalCode?.message}
            />
          )}
        />
      </div>
      <div className={styles.sameAsBilling}>
        <Controller
          name="sameAsBilling"
          control={control}
          render={({ field: { onChange, value } }) => (
            <>
              <Checkbox
                className={styles.checkbox}
                value={value}
                onChange={(newValue) => {
                  onChange(newValue);
                  setShowBillingAddress(!newValue);
                }}
              />
              Same as Billing Address
            </>
          )}
        />
      </div>
      {showBillingAddress && (
        <>
          <Controller
            name="billingAddress1"
            control={control}
            rules={{
              required: 'Address Line 1 required',
            }}
            render={({ field: { onChange, value } }) => (
              <Input
                label="Address Line 1"
                value={value}
                onChange={onChange}
                error={errors.billingAddress1?.message}
              />
            )}
          />
          <Controller
            name="billingAddress2"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Input label="Address Line 2" value={value} onChange={onChange} />
            )}
          />
          <div className={styles.doubleInput}>
            <Controller
              name="billingCity"
              control={control}
              rules={{
                required: 'City required',
              }}
              render={({ field: { onChange, value } }) => (
                <Input
                  className={styles.leftInput}
                  label="City"
                  value={value}
                  onChange={onChange}
                  error={errors.billingCity?.message}
                />
              )}
            />
            <Controller
              name="billingCountry"
              control={control}
              rules={{
                required: 'Country required',
              }}
              render={({ field: { onChange, value } }) => (
                <div className={styles.countryDropdown}>
                  <div className={styles.label}>Country</div>
                  <Dropdown
                    classes={{
                      list: styles.list,
                      listButton: styles.listButton,
                      options: styles.options,
                    }}
                    value={value}
                    options={supportedCountries.map(
                      (country) => country.countryName
                    )}
                    onChange={onChange}
                  />
                </div>
              )}
            />
          </div>
          <div className={styles.doubleInput}>
            <Controller
              name="billingState"
              control={control}
              rules={{
                required: 'State / Province required',
              }}
              render={({ field: { onChange, value } }) => (
                <Input
                  className={styles.leftInput}
                  label="State / Province"
                  value={value}
                  onChange={onChange}
                  error={errors.billingState?.message}
                />
              )}
            />
            <Controller
              name="billingPostalCode"
              control={control}
              rules={{
                required: 'Postal code required',
              }}
              render={({ field: { onChange, value } }) => (
                <Input
                  label="Postal code"
                  value={value}
                  onChange={onChange}
                  error={errors.billingPostalCode?.message}
                />
              )}
            />
          </div>
        </>
      )}
      <Button className={styles.submit} label="Next" loading={loading} />
    </form>
  );
};

export default AddressForm;

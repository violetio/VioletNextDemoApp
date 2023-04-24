import {
  applyShippingMethodsToBags,
  applyCustomerInfoToCart,
  fetchShippingOptions,
  updatePricing,
  submitPayment,
} from '@/api/checkout/cart';
import { AddressType } from '@/enums/AddressType';
import { Order } from '@/interfaces/Order.interface';
import {
  PaymentRequestPaymentMethodEvent,
  PaymentRequestShippingAddressEvent,
  PaymentRequestShippingOption,
  PaymentRequestShippingOptionEvent,
  PaymentRequestUpdateDetails,
  Stripe,
  loadStripe,
} from '@stripe/stripe-js';

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
export const stripe = loadStripe('pk_test_UHg8oLvg4rrDCbvtqfwTE8qd');

const applyShipping = async (
  shippingOption: PaymentRequestShippingOption,
  updateWith: (details: PaymentRequestUpdateDetails) => void,
  order: Order
) => {
  try {
    const applyShippingResponse = await applyShippingMethodsToBags(
      order.id.toString(),
      order.bags.map((bag) => ({
        bagId: bag.id,
        shippingMethodId: shippingOption.id,
      }))
    );
    updateWith({
      status: 'success',
      total: {
        amount: applyShippingResponse.data.total || 0,
        label: 'Total',
      },
    });
  } catch (err) {
    updateWith({
      status: 'fail',
    });
  }
};

export const onShippingAddressChange = async (
  ev: PaymentRequestShippingAddressEvent,
  order: Order,
  onSuccess?: (order: Order) => void,
  onFailure?: (err: any) => void
) => {
  if (ev.shippingAddress.country !== 'US') {
    ev.updateWith({ status: 'invalid_shipping_address' });
  } else {
    // Apply customer info with info from Apple Pay
    const updatedCartResponse = await applyCustomerInfoToCart(
      order.id.toString(),
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'hello@violet.io',
        shippingAddress: {
          address_1: '',
          city: ev.shippingAddress.city!,
          country: ev.shippingAddress.country,
          postalCode: ev.shippingAddress.postalCode!,
          state: ev.shippingAddress.region!,
          type: AddressType.SHIPPING,
        },
        sameAddress: true,
      }
    );

    // Perform server-side request to fetch shipping options
    const availableShippingOptions = await fetchShippingOptions(
      order.id.toString()
    );
    onSuccess?.(updatedCartResponse.data);
    ev.updateWith({
      status: 'success',
      shippingOptions: availableShippingOptions.data.flatMap(
        (bagShippingMethods: any) => {
          const shippingMethods = bagShippingMethods.shippingMethods;
          return shippingMethods.map((shippingMethod: any) => {
            return {
              id: shippingMethod.shippingMethodId,
              label: shippingMethod.label,
              detail: shippingMethod.label,
              amount: shippingMethod.price,
            };
          });
        }
      ),
    });
  }
};

export const onShippingOptionChange = (
  ev: PaymentRequestShippingOptionEvent,
  order: Order,
  onSuccess?: (order: Order) => void,
  onFailure?: (err: any) => void
) => {
  var updateWith = ev.updateWith;
  var shippingOption = ev.shippingOption;
  // Send shipping method selected to Violet API
  applyShipping(shippingOption, updateWith, order);
};

export const onPaymentMethodCreated = async (
  ev: PaymentRequestPaymentMethodEvent,
  stripe: Stripe,
  order: Order,
  onSuccess?: (order: Order) => void,
  onFailure?: (err: any) => void
) => {
  // Confirm the PaymentIntent without handling potential next actions (yet).
  const payerName = ev.payerName?.split(' ');
  await applyCustomerInfoToCart(order.id.toString(), {
    firstName: payerName?.[0]!,
    lastName: payerName?.length! > 1 ? payerName?.[payerName.length - 1]! : '',
    email: ev.payerEmail,
    shippingAddress: {
      address_1: ev.shippingAddress?.addressLine?.[0]!,
      address_2: ev.shippingAddress?.addressLine?.[1]!,
      city: ev.shippingAddress?.city!,
      country: ev.shippingAddress?.country!,
      postalCode: ev.shippingAddress?.postalCode!,
      state: ev.shippingAddress?.region!,
      type: AddressType.SHIPPING,
    },
    sameAddress: true,
  });

  // Update pricing
  await updatePricing(order.id.toString());

  const { error: confirmError } = await stripe.confirmCardPayment(
    order.paymentIntentClientSecret,
    { payment_method: ev.paymentMethod.id },
    { handleActions: false }
  );
  const complete = ev.complete;
  // Update customer info with latest customer information
  if (!confirmError) {
    // Submit payment
    try {
      await submitPayment(order.id.toString());
      complete('success');
    } catch (err) {
      complete('fail');
    }
  } else {
    // Report to the browser that the payment failed, prompting it to
    // re-show the payment interface, or show an error message and close
    // the payment interface.
    complete('fail');
  }
};
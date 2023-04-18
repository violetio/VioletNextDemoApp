import { Order } from "@/interfaces/Order.interface";
import { OrderAddress } from "@/interfaces/OrderAddress.interface";
import { OrderCustomer } from "@/interfaces/OrderCustomer.interface";
import { OrderShippingMethodWrapper } from "@/interfaces/OrderShippingMethodWrapper.interface";
import axios, { AxiosResponse } from "axios";

export const cartEndpoint = (cartId: string) => `/api/checkout/cart/${cartId}`;

/**
 * Retrieves a single cart by its ID
 * @see https://docs.violet.io/get-cart-by-id
 * @param {string} cartId
 */
export const getCart = (cartId: string): Promise<AxiosResponse<Order, any>> => {
  return axios.get<Order>(cartEndpoint(cartId));
};

/**
 * Removes a cart SKU by its ID.
 * @see https://docs.violet.io/remove-sku-from-cart
 * @param {string} cartId
 * @param {string} skuId
 */
export const removeSkusFromCart = (
  cartId: string,
  skuId: string
): Promise<AxiosResponse<Order, any>> => {
  return axios.delete<Order>(`/api/checkout/cart/${cartId}/skus/${skuId}`);
};

/**
 * Apply a payment method to the given cartId
 * @see https://docs.violet.io/apply-payment-method
 * @param {string} cartId
 * @param {boolean} intentBasedCapture Intent Based Capture enables a new payment paradigm that supports 27+ payment methods through Stripe
 */
export const requestIntentBasedCapturePayment = (
  cartId: string,
  intentBasedCapture: boolean
): Promise<AxiosResponse<Order, any>> => {
  return axios.post<Order>(`/api/checkout/cart/${cartId}/payment`, {
    intent_based_capture: intentBasedCapture,
  });
};

/**
 * Applies a shipping method to a bag.
 * Shipping methods available to each bag can be retreived from 'Get Available Shipping Methods' endpoint (https://docs.violet.io/get-available-shipping-methods).
 * Each bag requires a shipping method.
 * @see https://docs.violet.io/set-shipping-methods
 * @param {string} cartId
 * @param {Array<{ bagId: number; shippingMethodId: string }>} bags
 */
export const applyShippingMethodsToBags = (
  cartId: string,
  bags: Array<{ bagId: number; shippingMethodId: string }>
): Promise<AxiosResponse<Order, any>> => {
  return axios.post<Order>(`/api/checkout/cart/${cartId}/shipping`, bags, {
    params: {
      price_cart: true,
    },
  });
};

/**
 * Applies a guest customer to the cart.
 * Guest customers consist of a first name, last name, and email address.
 * Guest customers are not persisted within Violet for use on future orders.
 * @see https://docs.violet.io/apply-guest-customer-to-cart
 * @param {string} cartId
 * @param {OrderCustomer} customer
 */
export const applyCustomerInfoToCart = (
  cartId: string,
  customer: OrderCustomer
): Promise<AxiosResponse<Order, any>> => {
  return axios.post<Order>(`/api/checkout/cart/${cartId}/customer`, customer);
};

/**
 * Applies the provided billing address to the cart.
 * @see https://docs.violet.io/set-billing-address
 * @param cartId
 * @param billingAddress
 * @returns
 */
export const applyBillingAddress = (
  cartId: string,
  billingAddress: OrderAddress
): Promise<AxiosResponse<Order, any>> => {
  return axios.post<Order>(
    `/api/checkout/cart/${cartId}/billing_address`,
    billingAddress
  );
};

/**
 * Returns a list of available shipping methods for each bag.
 * The shipping address and customer must be applied to the cart before requesting shipping methods.
 * @see https://docs.violet.io/get-available-shipping-methods
 * @param {string} cartId
 */
export const fetchShippingOptions = (
  cartId: string
): Promise<AxiosResponse<OrderShippingMethodWrapper[], any>> => {
  return axios.get<OrderShippingMethodWrapper[]>(
    `/api/checkout/cart/${cartId}/shipping/available`
  );
};

/**
 * Confirm updated pricing on the order.
 * @see //TODO: Update docs to include this endpoint
 * @param {string} cartId
 */
export const updatePricing = (
  cartId: string
): Promise<AxiosResponse<Order, any>> => {
  return axios.post<Order>(`/api/checkout/cart/${cartId}/payment/update`);
};

/**
 * Submits a cart.
 * For each unique bag in your cart an order will be submitted to the source merchant's platform.
 * Depending on the number of bags in your cart this request can take a few moments as each external order is submitted.
 * @see https://docs.violet.io/RMur-submit-cart
 * @param {string} cartId
 */
export const submitPayment = (
  cartId: string
): Promise<AxiosResponse<Order, any>> => {
  return axios.post<Order>(`/api/checkout/cart/${cartId}/submit`);
};

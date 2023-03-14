const endpointPrefix = `${process.env.API_ENDPOINT}/v1`;

export const loginEndpoint = `${endpointPrefix}/login`;
export const productsEndpoint = `${endpointPrefix}/catalog/products`;
export const productByIdEndpoint = (productId: string) =>
  `${endpointPrefix}/catalog/products/${productId}`;
export const createCartEndpoint = `${endpointPrefix}/checkout/cart`;
export const getCartEndpoint = (cartId: string) =>
  `${endpointPrefix}/checkout/cart/${cartId}`;
export const applyCustomerInfoEndpoint = (cartId: string) =>
  `${endpointPrefix}/checkout/cart/${cartId}/customer`;
export const getAvailableShippingEndpoint = (cartId: string) =>
  `${endpointPrefix}/checkout/cart/${cartId}/shipping/available`;
export const shippingEndpoint = (cartId: string) =>
  `${endpointPrefix}/checkout/cart/${cartId}/shipping`;
export const updatePaymentEndpoint = (cartId: string) =>
  `${endpointPrefix}/checkout/cart/${cartId}/payment/update`;
export const checkoutPaymentEndpoint = (cartId: string) =>
  `${endpointPrefix}/checkout/cart/${cartId}/payment`;
export const submitPaymentEndpoint = (cartId: string) =>
  `${endpointPrefix}/checkout/cart/${cartId}/submit`;

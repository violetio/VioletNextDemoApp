const endpointPrefix = `${process.env.API_ENDPOINT}/v1`;

export const loginEndpoint = `${endpointPrefix}/login`;
export const productsEndpoint = `${endpointPrefix}/catalog/products`;
export const productByIdEndpoint = (productId: string) =>
  `${endpointPrefix}/catalog/products/${productId}`;
export const createCartEndpoint = `${endpointPrefix}/checkout/cart`;
export const checkoutPaymentEndpoint = (cartId: string) =>
  `${endpointPrefix}/checkout/cart/${cartId}/payment`;

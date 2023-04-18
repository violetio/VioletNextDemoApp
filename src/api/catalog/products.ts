import { Merchant } from "@/interfaces/Merchant.interface";
import { Offer } from "@/interfaces/Offer.interface";
import { Order } from "@/interfaces/Order.interface";
import { OrderSku } from "@/interfaces/OrderSku.interface";
import { Page } from "@/interfaces/Page.interface";
import { Product } from "@/interfaces/Product.interface";
import axios, { AxiosResponse } from "axios";

export const getProductsEndpoint = "/api/catalog/products";

/**
 * Retrieves a paginated list of all products in ascending order since date of creation.
 * @see https://docs.violet.io/get-products
 */
export const getProducts = (): Promise<AxiosResponse<Page<Product>, any>> => {
  return axios.get<Page<Product>>(getProductsEndpoint, {
    params: {
      page: 1,
      size: 50,
      excludePublic: true,
    },
  });
};

export const getProductEndpoint = (productId: string) =>
  `/api/catalog/products/${productId}`;
/**
 * Retrieves a single product by ID. This request will include all offers of that product.
 * @see https://docs.violet.io/get-product-by-id
 * @param {string} productId
 */
export const getProduct = (
  productId: string
): Promise<AxiosResponse<Product, any>> => {
  return axios.get<Product>(getProductEndpoint(productId));
};

/**
 * Creates a new empty cart.
 * @see https://docs.violet.io/create-cart
 * @param {string} baseCurrency
 * @param {OrderSku[]} skus Optional array of skus to add to the cart after initialization.
 * @param {boolean} [walletBasedCheckout=true]
 * @param {string} referralId Associate the order with a user or affiliate in your systems.
 * @param {string} appOrderId Associate the newly created cart to an ID in your systems.
 */
export const createCart = (
  baseCurrency: string,
  skus: Partial<OrderSku> &
    Required<Pick<OrderSku, "skuId" | "quantity">>[] = [],
  walletBasedCheckout: boolean = true,
  referralId?: string,
  appOrderId?: string
): Promise<AxiosResponse<Order, any>> => {
  return axios.post<Order>("/api/checkout/cart", {
    baseCurrency,
    skus,
    walletBasedCheckout,
    referralId,
    appOrderId,
  });
};

/**
 * Adds a SKU to the cart by its ID. Quantity will default to 1 if no quantity is passed. Quantities greater than 10 will default to 10.
 * @see https://docs.violet.io/add-sku-to-cart
 * @param {string} cartId
 * @param {OrderSku} skusPayload
 * @param {boolean} [price_cart=false]
 */
export const addSkusToCart = (
  cartId: string,
  orderSku: Partial<OrderSku> & Required<Pick<OrderSku, "skuId" | "quantity">>,
  priceCart: boolean = false
): Promise<AxiosResponse<Order, any>> => {
  return axios.post<Order>(`/api/checkout/cart/${cartId}/skus`, orderSku, {
    params: {
      priceCart,
    },
  });
};

/**
 * Get Offers for a Merchant by Merchant Id
 * @see https://docs.violet.io/interact-with-catalogs#lLsN26wkLmAfdiMbxJjZr
 * @param {string} merchantId
 */
export const getMerchantOffers = (
  merchantId: number
): Promise<AxiosResponse<Page<Offer>, any>> => {
  return axios.get<Page<Offer>>(`/api/catalog/offers/merchants/${merchantId}`);
};

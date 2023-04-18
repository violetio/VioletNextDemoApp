import { Merchant } from "@/interfaces/Merchant.interface";
import { Page } from "@/interfaces/Page.interface";
import axios, { AxiosResponse } from "axios";

/**
 * Retrieve a list of all the merchants that your app has access to.
 * @see https://docs.violet.io/view-merchants
 * @param {string} cartId
 */
export const getMerchants = (): Promise<AxiosResponse<Page<Merchant>, any>> => {
  return axios.get<Page<Merchant>>("/api/merchants");
};

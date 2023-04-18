import { AddressType } from "@/enums/AddressType";

export interface OrderAddress {
  id?: number;
  orderId?: number;
  name?: string;
  address_1: string;
  address_2?: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  phone?: string;
  type: AddressType;
  email?: string;
}

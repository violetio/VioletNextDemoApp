import { AddressType } from "@/enums/AddressType";

export interface OrderAddress {
  id?: number;
  orderId?: number;
  name?: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  phone?: string;
  type: AddressType;
  email?: string;
}

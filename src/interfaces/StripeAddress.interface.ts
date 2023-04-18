export interface StripeAddress {
  name: string;
  firstName?: string;
  lastName?: string;
  address: {
    line1: string;
    line2: string | null;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
  phone?: string;
}

import { loadStripe } from '@stripe/stripe-js';

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
export const stripe = loadStripe('pk_test_UHg8oLvg4rrDCbvtqfwTE8qd');

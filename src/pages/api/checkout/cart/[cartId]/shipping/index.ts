// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Shipping } from "@/interfaces/Shipping.interface";
import { nextConnectConfiguration } from "@/middlewares/globalApiMiddleware";
import {
  VIOLET_APP_ID_HEADER,
  VIOLET_APP_SECRET_HEADER,
  VIOLET_TOKEN_HEADER,
} from "@/strings/headers";
import {
  shippingEndpoint,
  updatePaymentEndpoint,
} from "@/strings/VioletApiPaths";
import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

const apiRoute = nextConnectConfiguration();

interface CheckoutPaymentRequest extends NextApiRequest {
  query: {
    cartId: string;
    price_cart: string;
  };
  body: Shipping[];
}

apiRoute.post(async (req: CheckoutPaymentRequest, res: NextApiResponse) => {
  const postShippingResponse = await axios.post(
    shippingEndpoint(req.query.cartId),
    req.body,
    {
      params: {
        price_cart: req.query.price_cart,
      },
      headers: {
        [VIOLET_APP_SECRET_HEADER]: process.env.APP_SECRET as string,
        [VIOLET_APP_ID_HEADER]: process.env.APP_ID as string,
        [VIOLET_TOKEN_HEADER]: req.headers[VIOLET_TOKEN_HEADER] as string,
      },
    }
  );
  // Update payment
  await axios.post(updatePaymentEndpoint(req.query.cartId));
  res.status(200).json(postShippingResponse.data);
});

export default apiRoute;

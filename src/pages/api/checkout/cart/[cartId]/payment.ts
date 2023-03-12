// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { nextConnectConfiguration } from "@/middlewares/globalApiMiddleware";
import {
  VIOLET_APP_ID_HEADER,
  VIOLET_APP_SECRET_HEADER,
  VIOLET_TOKEN_HEADER,
} from "@/strings/headers";
import { checkoutPaymentEndpoint } from "@/strings/VioletApiPaths";
import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

const apiRoute = nextConnectConfiguration();

interface CheckoutPaymentRequest extends NextApiRequest {
  query: {
    cartId: string;
    price_cart: string;
  };
  body: {
    intent_based_capture: boolean;
  };
}

apiRoute.post(async (req: CheckoutPaymentRequest, res: NextApiResponse) => {
  const paymentsResponse = await axios.post(
    checkoutPaymentEndpoint(req.query.cartId),
    {
      ...req.body,
    },
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
  res.status(200).json(paymentsResponse.data);
});

export default apiRoute;

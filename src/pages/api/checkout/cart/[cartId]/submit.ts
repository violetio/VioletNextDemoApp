// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { nextConnectConfiguration } from "@/middlewares/globalApiMiddleware";
import {
  VIOLET_APP_ID_HEADER,
  VIOLET_APP_SECRET_HEADER,
  VIOLET_TOKEN_HEADER,
} from "@/strings/headers";
import { submitPaymentEndpoint } from "@/strings/VioletApiPaths";
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
  const submitPaymentResponse = await axios.post(
    submitPaymentEndpoint(req.query.cartId),
    {
      ...req.body,
    },
    {
      headers: {
        [VIOLET_APP_SECRET_HEADER]: process.env.APP_SECRET as string,
        [VIOLET_APP_ID_HEADER]: process.env.APP_ID as string,
        [VIOLET_TOKEN_HEADER]: req.headers[VIOLET_TOKEN_HEADER] as string,
      },
    }
  );
  res.status(200).json(submitPaymentResponse.data);
});

export default apiRoute;

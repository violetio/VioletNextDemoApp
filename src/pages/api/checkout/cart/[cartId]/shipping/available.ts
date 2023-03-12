// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { nextConnectConfiguration } from "@/middlewares/globalApiMiddleware";
import {
  VIOLET_APP_ID_HEADER,
  VIOLET_APP_SECRET_HEADER,
  VIOLET_TOKEN_HEADER,
} from "@/strings/headers";
import {
  checkoutPaymentEndpoint,
  getAvailableShippingEndpoint,
} from "@/strings/VioletApiPaths";
import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

const apiRoute = nextConnectConfiguration();

interface AvailableShippingRequest extends NextApiRequest {
  query: {
    cartId: string;
  };
}

apiRoute.get(async (req: AvailableShippingRequest, res: NextApiResponse) => {
  const getAvailableShippingResponse = await axios.get(
    getAvailableShippingEndpoint(req.query.cartId),
    {
      headers: {
        [VIOLET_APP_SECRET_HEADER]: process.env.APP_SECRET as string,
        [VIOLET_APP_ID_HEADER]: process.env.APP_ID as string,
        [VIOLET_TOKEN_HEADER]: req.headers[VIOLET_TOKEN_HEADER] as string,
      },
    }
  );
  res.status(200).json(getAvailableShippingResponse.data);
});

export default apiRoute;

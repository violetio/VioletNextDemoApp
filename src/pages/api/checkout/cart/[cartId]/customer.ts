// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { ShippingAddress } from "@/interfaces/ShippingAddress.interface";
import { nextConnectConfiguration } from "@/middlewares/globalApiMiddleware";
import {
  VIOLET_APP_ID_HEADER,
  VIOLET_APP_SECRET_HEADER,
  VIOLET_TOKEN_HEADER,
} from "@/strings/headers";
import {
  applyCustomerInfoEndpoint,
  getCartEndpoint,
} from "@/strings/VioletApiPaths";
import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

const apiRoute = nextConnectConfiguration();

interface ApplyGuestCustomerRequest extends NextApiRequest {
  query: {
    cartId: string;
  };
  body: {
    email: string;
    first_name: string;
    last_name: string;
    shipping_address: ShippingAddress;
    same_address: boolean;
  };
}

apiRoute.post(async (req: ApplyGuestCustomerRequest, res: NextApiResponse) => {
  const paymentsResponse = await axios.post(
    applyCustomerInfoEndpoint(req.query.cartId),
    req.body,
    {
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

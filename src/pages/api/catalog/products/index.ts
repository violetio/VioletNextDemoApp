// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { nextConnectConfiguration } from "@/middlewares/globalApiMiddleware";
import {
  VIOLET_APP_ID_HEADER,
  VIOLET_APP_SECRET_HEADER,
  VIOLET_TOKEN_HEADER,
} from "@/strings/headers";
import { productsEndpoint } from "@/strings/VioletApiPaths";
import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

const apiRoute = nextConnectConfiguration();

interface GetProductsRequest extends NextApiRequest {
  query: {
    page: string;
    size: string;
    exclude_public: string;
  };
}

apiRoute.get(async (req: GetProductsRequest, res: NextApiResponse) => {
  const productsResponse = await axios.get(productsEndpoint, {
    params: {
      ...req.query,
    },
    headers: {
      [VIOLET_APP_SECRET_HEADER]: process.env.APP_SECRET as string,
      [VIOLET_APP_ID_HEADER]: process.env.APP_ID as string,
      [VIOLET_TOKEN_HEADER]: req.headers[VIOLET_TOKEN_HEADER] as string,
    },
  });
  res.status(200).json(productsResponse.data);
});

export default apiRoute;

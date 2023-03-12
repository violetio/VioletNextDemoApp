// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Sku } from "@/interfaces/Sku.interface";
import { nextConnectConfiguration } from "@/middlewares/globalApiMiddleware";
import {
  VIOLET_APP_ID_HEADER,
  VIOLET_APP_SECRET_HEADER,
  VIOLET_TOKEN_HEADER,
} from "@/strings/headers";
import { createCartEndpoint } from "@/strings/VioletApiPaths";
import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

const apiRoute = nextConnectConfiguration();

interface CreateCartRequest extends NextApiRequest {
  body: {
    base_currency: string;
    skus: Sku[];
  };
}

apiRoute.post(async (req: CreateCartRequest, res: NextApiResponse) => {
  const createCartResponse = await axios.post(
    createCartEndpoint,
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
  res.status(200).json(createCartResponse.data);
});

export default apiRoute;

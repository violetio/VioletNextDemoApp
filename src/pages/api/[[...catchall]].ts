// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { nextConnectConfiguration } from "@/middlewares/globalApiMiddleware";
import {
  VIOLET_APP_ID_HEADER,
  VIOLET_APP_SECRET_HEADER,
  VIOLET_TOKEN_HEADER,
} from "@/strings/headers";
import { endpointPrefix } from "@/strings/VioletApiPaths";
import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

const apiRoute = nextConnectConfiguration();

const parsedUrl = (req: NextApiRequest) => {
  const reqUrlFromFE = new URL(req.url as string, `http://${req.headers.host}`);

  // Trim /api from the pathname
  let pathname = reqUrlFromFE.pathname.substring(4);

  // Append the pathname to the Violet API prefix
  return `${endpointPrefix}${pathname}`;
};

apiRoute.all(async (req: NextApiRequest, res: NextApiResponse) => {
  /**
   * Next splits the catchall path by / into req.query.catchall. We can delete this
   * Since we are forwarding the pathname
   */
  delete req.query.catchall;
  try {
    const response = await axios(parsedUrl(req), {
      method: req.method,
      data: req.body,
      params: req.query,
      headers: {
        [VIOLET_APP_SECRET_HEADER]: process.env.APP_SECRET as string,
        [VIOLET_APP_ID_HEADER]: process.env.APP_ID as string,
        [VIOLET_TOKEN_HEADER]: req.headers[VIOLET_TOKEN_HEADER] as string,
      },
    });
    res.status(response.status).json(response.data);
  } catch (e) {
    console.log(`e ${e}`);
  }
});

export default apiRoute;

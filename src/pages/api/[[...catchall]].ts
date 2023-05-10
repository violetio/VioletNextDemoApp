// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from 'axios';
import camelcaseKeys from 'camelcase-keys';
import type { NextApiRequest, NextApiResponse } from 'next';
import snakecaseKeys from 'snakecase-keys';
import { endpointPrefix } from '@/strings/VioletApiPaths';
import {
  VIOLET_APP_ID_HEADER,
  VIOLET_APP_SECRET_HEADER,
  VIOLET_TOKEN_HEADER,
} from '@/strings/headers';
import { nextConnectConfiguration } from '@/middlewares/globalApiMiddleware';

const apiRoute = nextConnectConfiguration();

const parsedUrl = (req: NextApiRequest) => {
  const reqUrlFromFE = new URL(req.url as string, `http://${req.headers.host}`);

  // Trim /api from the pathname
  const pathname = reqUrlFromFE.pathname.substring(4);

  // Append the pathname to the Violet API prefix
  return `${endpointPrefix}${pathname}`;
};

/**
 * This NextJS api routes forwards all the requests from the client to Violet.
 * This allows us to use the APP_SECRET, APP_ID, USERNAME, and PASSWORD environment variables on the server side
 * without exposing it to the browser.
 * @see https://nextjs.org/docs/basic-features/environment-variables
 */
apiRoute.all(async (req: NextApiRequest, res: NextApiResponse) => {
  /**
   * Next splits the catchall path by / into req.query.catchall.
   * We can delete this since we are forwarding the pathname.
   */
  delete req.query.catchall;
  try {
    const response = await axios(parsedUrl(req), {
      method: req.method,
      // The Violet API expects snakecase keys in the query and body parameters
      data: req.body ? snakecaseKeys(req.body, { deep: true }) : undefined,
      params: snakecaseKeys(req.query, { deep: true }),
      headers: {
        [VIOLET_APP_SECRET_HEADER]: process.env.APP_SECRET as string,
        [VIOLET_APP_ID_HEADER]: process.env.APP_ID as string,
        [VIOLET_TOKEN_HEADER]: req.headers[VIOLET_TOKEN_HEADER] as string,
        'Content-Type': 'application/json',
      },
    });
    res
      .status(response.status)
      // Convert snakecase keys into camelcase for use within the project
      .json(
        camelcaseKeys(response.data, {
          deep: true,
          // The snakecaseKeys library does not recognize numbers as camelcase for conversion
          // so we are excluding these keys to avoid mix ups when we convert between camelcaseKeys/snakecaseKeys
          exclude: ['address_1', 'address_2'],
        })
      );
  } catch (e: any) {
    res.status(e.response?.status).json(e.response.data);
  }
});

export default apiRoute;

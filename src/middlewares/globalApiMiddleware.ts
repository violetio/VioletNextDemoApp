import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import { injectUserToken } from './injectUserToken';

export const nextConnectConfiguration = () => {
  const apiRoute = nextConnect({
    onError(error, req: NextApiRequest, res: NextApiResponse<any>) {
      if (error.data) {
        res.status(error.statusCode);
        for (const key in error.headers) {
          res.setHeader(key, error.headers[key]);
        }
        res.json({
          data: error.data,
        });
      } else {
        res.status(501).json({ error: `${error.message}` });
      }
    },
    onNoMatch(req, res) {
      res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
    },
  });

  apiRoute.use(injectUserToken);
  return apiRoute;
};

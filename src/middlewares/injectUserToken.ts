import { NextApiRequest, NextApiResponse } from 'next';
import { NextHandler } from 'next-connect';
import jwtDecode from 'jwt-decode';
// import axios from 'axios';
import axios from 'axios';
import {
  VIOLET_APP_ID_HEADER,
  VIOLET_APP_SECRET_HEADER,
  VIOLET_TOKEN_HEADER,
} from '@/strings/headers';
import { refreshTokenEndpoint } from '@/strings/VioletApiPaths';

/**
 * Middleware to check cookie authentication
 *
 * @param req
 * @param res
 * @param next
 */
const tokenIsExpired = (token: string) => {
  const { exp }: any = jwtDecode(token);
  // Refresh the token 30 minutes before the token expires
  return (exp - 1800) * 1000 < Date.now();
};

export default tokenIsExpired;

// Fetch a new token with the Violet refresh token
const refreshToken = async (next: NextHandler) => {
  try {
    const getTokenResponse = await axios.get(refreshTokenEndpoint, {
      headers: {
        [VIOLET_APP_SECRET_HEADER]: process.env.APP_SECRET as string,
        [VIOLET_APP_ID_HEADER]: process.env.APP_ID as string,
        [VIOLET_TOKEN_HEADER]: process.env.REFRESH_TOKEN as string,
      },
    });
    return getTokenResponse.data.token;
  } catch (e: any) {
    next(e);
  }
};

let token = '';

export const injectUserToken = async (
  req: NextApiRequest,
  res: NextApiResponse,
  next: NextHandler
) => {
  // Check if the server has a valid token for requests
  if (!token || tokenIsExpired(token)) {
    // Login with username and password from environment variables
    token = await refreshToken(next);
  }

  req.headers[VIOLET_TOKEN_HEADER] = token;
  next();
};

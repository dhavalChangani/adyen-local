import axios, {AxiosError, AxiosRequestConfig, AxiosResponse} from 'axios';
import {Platform} from 'react-native';
import {getBuildNumber, getVersion} from 'react-native-device-info';

export interface PayloadParams {
  body?: object;
  params?: object;
}
export interface ErrorResponseHandler {
  status: number;
  data: null;
  success: boolean;
  message: string;
  errors: any;
  totalRecord: number;
  messageCode: string;
}

/**
 *
 * @param {any} body
 * @param {any} params
 * @returns {PayloadParams}
 */
export const toPayloadParams = (
  body: object,
  params?: object,
): PayloadParams => {
  return {
    body,
    params,
  };
};

/**
 * @description This function is used for handling the API response.
 * @param {AxiosResponse} res
 * @returns
 */
export const responseHandler = (res: AxiosResponse) => {
  if (!res) {
    throw new Error('Network Error');
  }
  const response = {
    status: res.status,
    data: null,
    success: false,
    message: res.data?.message || 'Something went wrong!',
    errors: null,
    totalRecord: 0,
    messageCode: res.data.messageCode,
  };

  switch (res.status) {
    case 401:
      return {
        ...response,
        errors: res.data?.errors,
      };
    default:
      return {
        ...response,
        data: res.data.data,
        totalRecord: res.data.totalRecord,
        success: res.status === 200,
      };
  }
};

/**
 * @description This function is used for handling the API errors.
 * @param {AxiosError} err
 * @returns
 */
export const errorHandler = (err: any): ErrorResponseHandler => {
  return err;
};

export const network = async (
  method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE' = 'GET',
  url: string,
  payload?: PayloadParams,
  customHeaders?: {},
) => {
  // from env
  const apiURL = '' + url;
  let configs: AxiosRequestConfig = {
    headers: {
      authorization:
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVlNTNiNjY1NWFkMzQ2ZDFmMTVlNDU5MSIsImVtYWlsIjoiYWRtaW4uc3RhZ2luZ0Bub3EuZXZlbnRzIiwicm9sZSI6IkFETUlOIiwiaWF0IjoxNjcwOTM2NzQ2LCJleHAiOjE2NzEwMjMxNDZ9.xaBbMSMTIZz-4Tb1yt4pZO-IggdRN38WKuqBgmaSthw',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      deviceType: Platform.OS,
      appType: 'vendor',
      appVersion: getBuildNumber(),
      currentVersion: getVersion(),
    },
    params: {},
  };

  if (payload?.params) {
    configs.params = payload.params;
  }

  if (customHeaders) {
    configs.headers = {
      ...configs.headers,
      ...customHeaders,
    };
  }

  if (method === 'GET') {
    configs.params = payload?.params;
  }

  if (method === 'DELETE' && payload) {
    configs.data = payload.params;
  }
  switch (method) {
    case 'GET':
      try {
        const res: AxiosResponse = await axios.get(apiURL, configs);
        return responseHandler(res);
      } catch (err) {
        throw errorHandler(err as AxiosError);
      }
    case 'POST':
      try {
        console.log({apiURL, payload, configs})
        const res: AxiosResponse = await axios.post(
          apiURL,
          payload?.body,
          configs,
        );
        return responseHandler(res);
      } catch (err) {
        throw errorHandler(err as AxiosError);
      }
    case 'PUT':
      try {
        const res: AxiosResponse = await axios.put(
          apiURL,
          payload?.body,
          configs,
        );
        return responseHandler(res);
      } catch (err) {
        throw errorHandler(err as AxiosError);
      }
    case 'PATCH':
      try {
        const res: AxiosResponse = await axios.put(
          apiURL,
          payload?.body,
          configs,
        );
        return responseHandler(res);
      } catch (err) {
        throw errorHandler(err as AxiosError);
      }
    case 'DELETE':
      try {
        const res: AxiosResponse = await axios.delete(apiURL, configs);
        return responseHandler(res);
      } catch (err) {
        throw errorHandler(err as AxiosError);
      }
  }
};

export function axiosApi(
  method: string,
  url: string,
  params = {},
  header = {},
) {
  switch (method) {
    case 'GET':
      return axios
        .get(url, {headers: header, params: params})
        .then(response => {
          if (response.status === 200) {
            return response;
          }
        })
        .catch(error => {
          throw new Error(JSON.stringify(error.response));
        });

    case 'POST':
      return axios
        .post(url, params, {headers: header})
        .then(response => {
          // if (response.status == 200) {
          return response;
          // }
        })
        .catch(error => {
          throw new Error(JSON.stringify(error.response));
        });

    case 'PUT':
      return axios
        .put(url, params, {headers: header})
        .then(response => {
          if (response.status === 200) {
            return response;
          }
        })
        .catch(error => {
          throw new Error(JSON.stringify(error.response));
        });

    case 'DELETE':
      return axios
        .delete(url, {headers: header, data: params})
        .then(response => {
          if (response.status === 200) {
            return response;
          }
        })
        .catch(error => {
          throw new Error(JSON.stringify(error.response));
        });
  }
}

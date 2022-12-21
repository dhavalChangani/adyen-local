import axios, { AxiosError, AxiosResponse } from "axios";
import { getBuildNumber, getVersion } from "react-native-device-info";
import { Platform } from "react-native";
/**
 *
 * @param {any} body
 * @param {any} params
 * @returns {PayloadParams}
 */
export const toPayloadParams = (body, params) => {
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
export const responseHandler = (res) => {
  if (!res) {
    throw new Error("Network Error");
  }
  const response = {
    status: res.status,
    data: null,
    success: false,
    message: res.data?.message || "Something went wrong!",
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
export const errorHandler = (err) => {
  if (err.response) {
    return {
      status: err.response.status,
      data: null,
      message: err?.response?.data?.message || "Something went wrong!",
      errors: err.response.data.errors,
      success: false,
      messageCode: err.response.data.messageCode,
      totalRecord: 0,
    };
  }
  return {
    status: 500,
    data: null,
    message: err.message,
    errors: err.errors,
    success: false,
    messageCode: "",
    totalRecord: 0,
  };
};

export const network = async (method, url, payload, customHeaders = {}) => {
  // from env
  const apiURL = "" + url;
  let configs = {
    headers: {
      authorization: "Bearer " + USER.ACCESS_TOKEN,
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      deviceType: Platform.OS,
      appType: "vendor",
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

  if (method === "GET") {
    configs.params = payload?.params;
  }

  if (method === "DELETE" && payload) {
    configs.data = payload.params;
  }
  switch (method) {
    case "GET":
      try {
        const res = await axios.get(apiURL, configs);
        return responseHandler(res);
      } catch (err) {
        throw errorHandler(err);
      }
    case "POST":
      try {
        const res = await axios.post(apiURL, payload?.body, configs);
        return responseHandler(res);
      } catch (err) {
        throw errorHandler(err);
      }
    case "PUT":
      try {
        const res = await axios.put(apiURL, payload?.body, configs);
        return responseHandler(res);
      } catch (err) {
        throw errorHandler(err);
      }
    case "PATCH":
      try {
        const res = await axios.put(apiURL, payload?.body, configs);
        return responseHandler(res);
      } catch (err) {
        throw errorHandler(err);
      }
    case "DELETE":
      try {
        const res = await axios.delete(apiURL, configs);
        return responseHandler(res);
      } catch (err) {
        throw errorHandler(err);
      }
  }
};

export function axiosApi(method, url, params = {}, header = {}) {
  switch (method) {
    case "GET":
      return axios
        .get(url, { headers: header, params: params })
        .then((response) => {
          if (response.status === 200) {
            return response;
          }
        })
        .catch((error) => {
          throw new Error(JSON.stringify(error.response));
        });

    case "POST":
      return axios
        .post(url, params, { headers: header })
        .then((response) => {
          // if (response.status == 200) {
          return response;
          // }
        })
        .catch((error) => {
          throw new Error(JSON.stringify(error.response));
        });

    case "PUT":
      return axios
        .put(url, params, { headers: header })
        .then((response) => {
          if (response.status === 200) {
            return response;
          }
        })
        .catch((error) => {
          throw new Error(JSON.stringify(error.response));
        });

    case "DELETE":
      return axios
        .delete(url, { headers: header, data: params })
        .then((response) => {
          if (response.status === 200) {
            return response;
          }
        })
        .catch((error) => {
          throw new Error(JSON.stringify(error.response));
        });
  }
}

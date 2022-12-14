import Config from './config';
import HttpURLConnectionClient from './httpClient/httpURLConnectionClient';
import { version } from '../../../package.json';
import ClientInterface from './httpClient/clientInterface';

type ClientParametersOverload =
  | { config: Config }
  | { config: Config; httpClient: ClientInterface }
  | {
    username: string;
    password: string;
    endPoint?: string;
    environment: Environment;
    applicationName: string;
  }
  | {
    username: string;
    password: string;
    endPoint?: string;
    environment: Environment;
    applicationName: string;
    httpClient: ClientInterface;
  }
  | {
    username: string;
    password: string;
    endPoint?: string;
    environment: Environment;
    applicationName: string;
    liveEndpointUrlPrefix: string;
  }
  | {
    username: string;
    password: string;
    endPoint?: string;
    environment: Environment;
    applicationName: string;
    liveEndpointUrlPrefix: string;
    httpClient: ClientInterface;
  }
  | { apiKey: string; endPoint?: string; environment: Environment }
  | {
    apiKey: string;
    endPoint?: string;
    environment: Environment;
    httpClient: ClientInterface;
  }
  | {
    apiKey: string;
    endPoint?: string;
    environment: Environment;
    liveEndpointUrlPrefix: string;
    httpClient: ClientInterface;
  };

interface ClientParameters {
  config?: Config;
  username?: string;
  password?: string;
  environment?: Environment;
  applicationName?: string;
  liveEndpointUrlPrefix?: string;
  apiKey?: string;
  httpClient?: ClientInterface;
  endPoint?: string;
}

class Client {
  public static ADYEN_MANAGEMENT_KEY = 'AQEshmfxK4zNaRxLw0m/n3Q5qf3VZqR8LJBJV3BY0nK5v/MLyQ5D0u+oZYd9lWcQwV1bDb7kfNy1WIxIIkxgBw==-C1Dg/M/0kbzjH/3pngF3Y2ymy9zsQJpjBZFevxBWEzM=-}6apg)>&=h.=IIgh';
  public static ADYEN_MERCHANT_ACC = "NOQAccountPOS";
  public static ADYEN_ENVIRONMENT: Environment = 'TEST';
  public static CERTIFICATE_PATH_TEST = 'adyen-terminalfleet-test.pem';
  public static CERTIFICATE_PATH_LIVE = 'adyen-terminalfleet-live.pem';
  public static ENDPOINT_TEST = 'https://pal-test.adyen.com';
  public static ENDPOINT_LIVE = 'https://pal-live.adyen.com';
  public static ENDPOINT_LIVE_SUFFIX = '-pal-live.adyenpayments.com';
  public static HPP_TEST = 'https://test.adyen.com/hpp';
  public static HPP_LIVE = 'https://live.adyen.com/hpp';
  public static MARKETPAY_ENDPOINT_TEST =
    'https://cal-test.adyen.com/cal/services';
  public static MARKETPAY_ENDPOINT_LIVE =
    'https://cal-live.adyen.com/cal/services';
  public static CHECKOUT_API_VERSION = 'v69';
  public static API_VERSION = 'v68';
  public static PAYMENT_API_VERSION = 'v68';
  public static TERMINAL_MANAGEMENT_API_VERSION = 'v1';
  public static LIB_NAME = 'adyen-node-api-library';
  public static LIB_VERSION: string = version;
  public static BIN_LOOKUP_PAL_SUFFIX = '/pal/servlet/BinLookup/';
  public static BIN_LOOKUP_API_VERSION = 'v50';
  public static LOCAL_TERMINAL_API_ENDPOINT_TEST = 'http://127.0.0.1';
  public static LOCAL_TERMINAL_API_ENDPOINT_LIVE = 'http://127.0.0.1';
  public static ENDPOINT_PROTOCOL = 'https://';

  public static SECURITY_KEY_TEST = {
    AdyenCryptoVersion: 0,
    KeyIdentifier: 'NOQ_EPOS',
    KeyVersion: 1,
    Passphrase: 'noq_epos_key_passphrase',
  };

  public static SECURITY_KEY_LIVE = {
    AdyenCryptoVersion: 0,
    KeyIdentifier: 'NOQ_EPOS',
    KeyVersion: 1,
    Passphrase: 'noq_epos_key_passphrase',
  };

  private _httpClient!: ClientInterface;
  public config: Config;

  public constructor(clientParameters: ClientParametersOverload);
  public constructor(options: ClientParameters) {
    if (options.config) {
      this.config = options.config;
    } else {
      this.config = new Config();
    }

    const environment = options.environment || this.config.environment;
    if (environment) {
      this.setEnvironment(environment, options.liveEndpointUrlPrefix);
      if (options.username && options.password && options.applicationName) {
        this.config.username = options.username;
        this.config.password = options.password;
        this.config.applicationName = options.applicationName;
      }

      if (options.apiKey) {
        this.config.apiKey = options.apiKey;
      }

      if (options.endPoint) {
        this.config.terminalApiLocalEndpoint = options.endPoint;
      }
    }

    if (options.httpClient) {
      this._httpClient = options.httpClient;
    }
  }

  public setEnvironment(
    environment: Environment,
    liveEndpointUrlPrefix?: string,
  ): void {
    if (environment === 'TEST') {
      this.config.endpoint = Client.ENDPOINT_TEST;
      this.config.terminalApiLocalEndpoint =
        Client.LOCAL_TERMINAL_API_ENDPOINT_TEST;
      this.config.securityKey = Client.SECURITY_KEY_TEST;
      this.config.merchantAccount = Client.ADYEN_MERCHANT_ACC;
      // this.config.certificatePath = Client.CERTIFICATE_PATH_TEST;
    } else if (environment === 'LIVE') {
      this.config.terminalApiLocalEndpoint =
        Client.LOCAL_TERMINAL_API_ENDPOINT_LIVE;
      this.config.securityKey = Client.SECURITY_KEY_LIVE;
      this.config.merchantAccount = Client.ADYEN_MERCHANT_ACC;
      // this.config.certificatePath = Client.CERTIFICATE_PATH_LIVE;

      if (liveEndpointUrlPrefix) {
        this.config.endpoint = `${Client.ENDPOINT_PROTOCOL}${liveEndpointUrlPrefix}${Client.ENDPOINT_LIVE_SUFFIX}`;
        this.config.checkoutEndpoint = `${Client.ENDPOINT_PROTOCOL}${liveEndpointUrlPrefix}${Client.CHECKOUT_ENDPOINT_LIVE_SUFFIX}`;
      } else {
        this.config.endpoint = Client.ENDPOINT_LIVE;
        this.config.checkoutEndpoint = undefined;
      }
    }
  }

  public get httpClient(): ClientInterface {
    if (!this._httpClient) {
      this._httpClient = new HttpURLConnectionClient();
    }

    return this._httpClient;
  }

  public set httpClient(httpClient: ClientInterface) {
    this._httpClient = httpClient;
  }

  public setApplicationName(applicationName: string): void {
    this.config.applicationName = applicationName;
  }

  public setTimeouts(
    connectionTimeoutMillis: number,
    readTimeoutMillis: number,
  ): void {
    this.config.connectionTimeoutMillis = connectionTimeoutMillis;
    this.config.readTimeoutMillis = readTimeoutMillis;
  }
}

export default Client;

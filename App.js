import React, { useState } from "react";
import { Button, View, Alert, TextInput } from "react-native";
import * as axios from "axios";
import { Client, TerminalLocalAPI } from "./src/adyen-node-api-library-develop/src";
import {
  MessageCategoryType,
  MessageClassType,
  MessageType,
} from "./src/adyen-node-api-library-develop/src/typings/terminal/models";

const App = () => {
  const [localUrl, setLocalUrl] = useState("http://10.0.2.2");
  const [poiId, setPoiId] = useState("S1F2-000158215131701");

  const adyenLocalCheckout = async (params, onSuccess, onFailure) => {
    const adyenHostUrl = localUrl;
    const client = new Client({
      apiKey: Client.ADYEN_MANAGEMENT_KEY,
      environment: Client.ADYEN_ENVIRONMENT,
      endPoint: adyenHostUrl || Client.LOCAL_TERMINAL_API_ENDPOINT_TEST,
    });

    const id = Math.floor(Math.random() * Math.floor(10000000)).toString();
    const getMessageHeader = ({ messageCategory = MessageCategoryType.Payment } = {}) => ({
      MessageCategory: messageCategory,
      MessageClass: MessageClassType.Service,
      MessageType: MessageType.Request,
      POIID: poiId,
      ProtocolVersion: "3.0",
      SaleID: id,
      ServiceID: id,
    });

    const timestamp = () => new Date().toISOString();
    const transactionIdentification = {
      TimeStamp: timestamp(),
      TransactionID: id,
    };

    const saleData = {
      SaleTransactionID: transactionIdentification,
      SaleToAcquirerData: {
        applicationInfo: {
          merchantApplication: {
            version: "1",
            name: "test",
          },
        },
        metadata: {
          someMetaDataKey1: "YOUR_VALUE",
          someMetaDataKey2: "YOUR_VALUE",
        },
      },
    };

    const amountsReq = {
      Currency: "EUR",
      RequestedAmount: 1,
    };

    const paymentTransaction = {
      AmountsReq: amountsReq,
    };

    const paymentRequest = {
      PaymentTransaction: paymentTransaction,
      SaleData: saleData,
    };

    const getSaleToPOIRequest = (messageHeader, request) => ({
      MessageHeader: messageHeader,
      ...request,
    });
    const createTerminalAPIPaymentRequest = () => {
      const messageHeader = getMessageHeader();
      const saleToPOIRequest = getSaleToPOIRequest(messageHeader, {
        PaymentRequest: paymentRequest,
      });
      return { SaleToPOIRequest: saleToPOIRequest };
    };

    const checkoutAPI = new TerminalLocalAPI(client);
    const securityKey = client.config.securityKey || Client.SECURITY_KEY_TEST;
    const terminalAPIPaymentRequest = createTerminalAPIPaymentRequest();
    console.log(JSON.stringify(terminalAPIPaymentRequest, null, 4));
    try {
      const paymentResponse = await checkoutAPI.request(terminalAPIPaymentRequest, securityKey);
      onSuccess(paymentResponse);
    } catch (err) {
      onFailure(err);
    }
  };

  const sendResponse = (response) => {
    console.log({ sendResponse: response });
    axios
      .request({
        method: "post",
        data: {response},
        url: "https://portal.noq.events/api/v2/in-person/123/send-receipt",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVlNTNiNjY1NWFkMzQ2ZDFmMTVlNDU5MSIsImVtYWlsIjoiYWRtaW4uc3RhZ2luZ0Bub3EuZXZlbnRzIiwicm9sZSI6IkFETUlOIiwiaWF0IjoxNjcxMDMzMDE2LCJleHAiOjE2NzExMTk0MTZ9.KaazK98kSbgAYUu3IMXk6yDB0Wm5Zhpm3rACCq9XUzs",
        },
      })
      .catch(() => {});
  };

  const plainAPIAxios = async () => {
    const id = Math.floor(Math.random() * Math.floor(10000000)).toString();
    const date = new Date().toISOString();
    const request = {
      SaleToPOIRequest: {
        MessageHeader: {
          MessageCategory: "Payment",
          MessageClass: "Service",
          MessageType: "Request",
          POIID: poiId,
          ProtocolVersion: "3.0",
          SaleID: id,
          ServiceID: id,
        },
        PaymentRequest: {
          PaymentTransaction: {
            AmountsReq: {
              Currency: "EUR",
              RequestedAmount: 1,
            },
          },
          SaleData: {
            SaleTransactionID: {
              TimeStamp: date,
              TransactionID: id,
            },
            SaleToAcquirerData: {
              applicationInfo: {
                merchantApplication: {
                  version: "1",
                  name: "test",
                },
              },
              metadata: {
                someMetaDataKey1: "YOUR_VALUE",
                someMetaDataKey2: "YOUR_VALUE",
              },
            },
          },
        },
      },
    };

    try {
      const url = localUrl + ":8443/nexo";
      console.log({ url });
      axios
        .request({
          method: "post",
          url: url,
          data: request,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          sendResponse(response);
        })
        .catch((error) => {
          sendResponse(error);
        });
    } catch (error) {
      sendResponse(error);
    }
  };

  const plainAPIAxiosSmall = async () => {
    const id = Math.floor(Math.random() * Math.floor(10000000)).toString();
    const date = new Date().toISOString();
    const request = {
      SaleToPOIRequest: {
        MessageHeader: {
          MessageCategory: "Payment",
          MessageClass: "Service",
          MessageType: "Request",
          POIID: poiId,
          ProtocolVersion: "3.0",
          SaleID: id,
          ServiceID: id,
        },
        PaymentRequest: {
          PaymentTransaction: {
            AmountsReq: {
              Currency: "EUR",
              RequestedAmount: 1,
            },
          },
          SaleData: {
            SaleTransactionID: {
              TimeStamp: date,
              TransactionID: id,
            },
            SaleToAcquirerData: {
              applicationInfo: {
                merchantApplication: {
                  version: "1",
                  name: "test",
                },
              },
              metadata: {
                someMetaDataKey1: "YOUR_VALUE",
                someMetaDataKey2: "YOUR_VALUE",
              },
            },
          },
        },
      },
    };

    try {
      const url = localUrl + ":8443/nexo";
      console.log({ url });
      axios
        .request({
          method: "post",
          url: url,
          data: request,
          headers: {
            Accept: "application/json",
            "content-type": "application/json",
          },
        })
        .then((response) => {
          sendResponse(response);
        })
        .catch((error) => {
          sendResponse(error);
        });
    } catch (error) {
      sendResponse(error);
    }
  };

  const plainAPIFetch = async () => {
    const id = Math.floor(Math.random() * Math.floor(10000000)).toString();
    const date = new Date().toISOString();
    const request = {
      SaleToPOIRequest: {
        MessageHeader: {
          MessageCategory: "Payment",
          MessageClass: "Service",
          MessageType: "Request",
          POIID: poiId,
          ProtocolVersion: "3.0",
          SaleID: id,
          ServiceID: id,
        },
        PaymentRequest: {
          PaymentTransaction: {
            AmountsReq: {
              Currency: "EUR",
              RequestedAmount: 1,
            },
          },
          SaleData: {
            SaleTransactionID: {
              TimeStamp: date,
              TransactionID: id,
            },
            SaleToAcquirerData: {
              applicationInfo: {
                merchantApplication: {
                  version: "1",
                  name: "test",
                },
              },
              metadata: {
                someMetaDataKey1: "YOUR_VALUE",
                someMetaDataKey2: "YOUR_VALUE",
              },
            },
          },
        },
      },
    };

    try {
      const url = localUrl + ":8443/nexo";
      console.log({ url });

      fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: request,
      })
        .then((response) => {
          sendResponse(response);
        })
        .catch((error) => {
          sendResponse(error);
        });
    } catch (error) {
      sendResponse(error);
    }
  };

  const plainAPIFetchSmall = async () => {
    const id = Math.floor(Math.random() * Math.floor(10000000)).toString();
    const date = new Date().toISOString();
    const request = {
      SaleToPOIRequest: {
        MessageHeader: {
          MessageCategory: "Payment",
          MessageClass: "Service",
          MessageType: "Request",
          POIID: poiId,
          ProtocolVersion: "3.0",
          SaleID: id,
          ServiceID: id,
        },
        PaymentRequest: {
          PaymentTransaction: {
            AmountsReq: {
              Currency: "EUR",
              RequestedAmount: 1,
            },
          },
          SaleData: {
            SaleTransactionID: {
              TimeStamp: date,
              TransactionID: id,
            },
            SaleToAcquirerData: {
              applicationInfo: {
                merchantApplication: {
                  version: "1",
                  name: "test",
                },
              },
              metadata: {
                someMetaDataKey1: "YOUR_VALUE",
                someMetaDataKey2: "YOUR_VALUE",
              },
            },
          },
        },
      },
    };

    try {
      const url = localUrl + ":8443/nexo";
      console.log({ url });

      fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "content-type": "application/json",
        },
        body: request,
      })
        .then((response) => {
          sendResponse(response);
        })
        .catch((error) => {
          sendResponse(error);
        });
    } catch (error) {
      sendResponse(error);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <TextInput placeholder="Input Url" onChangeText={setLocalUrl} />
      <TextInput placeholder="Terminal Id" onChangeText={setPoiId} />

      {/* <Button
        style={{backgroundColor: 'red', marginBottom: '10%'}}
        title={'Encrypted'}
        onPress={() => {
          console.log('Encrypted');
          adyenLocalCheckout();
        }}
      /> */}

      <Button
        style={{ backgroundColor: "red", marginTop: "10%" }}
        title={"Non Encrypted Axios"}
        onPress={() => {
          console.log("Non Encrypted");
          plainAPIAxios();
        }}
      />

      <Button
        style={{ backgroundColor: "red", marginTop: "10%" }}
        title={"Non Encrypted Fetch"}
        onPress={() => {
          console.log("Non Encrypted");
          plainAPIFetch();
        }}
      />

      <Button
        style={{ backgroundColor: "red", marginTop: "10%" }}
        title={" small content type Non Encrypted axios"}
        onPress={() => {
          console.log("Non Encrypted");
          plainAPIAxiosSmall();
        }}
      />

      <Button
        style={{ backgroundColor: "red", marginTop: "10%" }}
        title={"small content  Non Encrypted Fetch"}
        onPress={() => {
          console.log("Non Encrypted");
          plainAPIFetchSmall();
        }}
      />
    </View>
  );
};

export default App;

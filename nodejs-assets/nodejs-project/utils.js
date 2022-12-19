const localRequest = (localAPI, terminalPaymentRequest, securityKeyObj) => {
  return new Promise((resolve, reject) => {
    localAPI
      .request(terminalPaymentRequest, securityKeyObj)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

const parseErrorMessage = (response, condition) => {
  if (!response) {
    return "";
  }
  const error = parseBase64(response);
  let message = "Something went wrong!! Please try again";
  switch (condition) {
    case "Aborted":
    case "Busy":
    case "Cancel":
    case "InvalidCard":
    case "NotAllowed":
    case "Refusal":
    case "UnreachableHost":
    case "WrongPIN":
      message = error.refusalReason || error.message || "unknown";
      break;
    case "DeviceOut":
      message = error.message || error.refusalReason || "unknown";
      break;
    default:
      break;
    // const errMsg = error.errors || error.message || error.warnings || ADYEN_CONSTANTS.UNKNOWN; // only in DEV
  }
  return message;
};

const createAdyenPayment = async (transactionId, amount, currency, adyenDetails, localAPI) => {
  const body = {
    SaleToPOIRequest: {
      MessageHeader: {
        ProtocolVersion: "3.0",
        MessageClass: "Service",
        MessageCategory: "Payment",
        MessageType: "Request",
        SaleID: adyenDetails.saleId,
        ServiceID: adyenDetails.serviceId,
        POIID: adyenDetails.poiid,
      },
      PaymentRequest: {
        SaleData: {
          SaleTransactionID: {
            TransactionID: transactionId,
            TimeStamp: new Date().toISOString(),
          },
        },
        PaymentTransaction: {
          AmountsReq: {
            Currency: currency ? currency.toUpperCase() : "GBP",
            RequestedAmount: amount,
          },
        },
      },
    },
  };

  const securityKeyObj = {
    KeyIdentifier: msg.keyIdentifier,
    Passphrase: msg.passphrase,
    KeyVersion: 1,
    AdyenCryptoVersion: 1,
  };

  try {
    const res = await localRequest(localAPI, body, securityKeyObj);
    const response = res.SaleToPOIResponse?.PaymentResponse?.Response;
    if (!response) {
      return { status: false, error: { message: "Terminal is not connected with Internet." } };
    }

    const poiData = res.SaleToPOIResponse?.PaymentResponse?.POIData;
    if (response?.Result === "Success") {
      return { status: true, content: poiData };
    }

    const errMsg = parseErrorMessage(response?.AdditionalResponse, response?.ErrorCondition);
    return { status: false, error: { message: errMsg || "UN_HANDLE_RESPONSE" }, errData: response };
  } catch (error) {
    return { status: false, error };
  }
};

export const adyenPayment = async (transactionId, amount, currency, adyen, localAPI) => {
  const handleErrorObject = {};
  if (adyen.saleId) {
    handleErrorObject.flag = true;
    handleErrorObject.error = "Adyen Terminal Id not found";
  }

  if (adyen.poiid) {
    handleErrorObject.flag = true;
    handleErrorObject.error = "Device ID not found";
  }

  const res = await createAdyenPayment(transactionId, amount, currency, adyen, localAPI);
  if (!res.status) {
    handleErrorObject.flag = true;
    handleErrorObject.error = res.error;
  } else {
    const pspReference = res.content?.POITransactionID?.TransactionID?.split(".")[1];
    handleErrorObject.flag = false;
    handleErrorObject.transactionDetails = {
      tid: adyen.poiid,
      paymentPspReference: pspReference,
      verified: false,
      storeId: adyen.storeId || "",
      saleId: adyen.saleId || null,
      poiId: adyen.poiid || null,
      serviceId: adyen.serviceId || null,
    };
  }
};

export const verifyTransactionStatus = async (adyenDetails, serviceId) => {
  const body = {
    SaleToPOIRequest: {
      MessageHeader: {
        ProtocolVersion: "3.0",
        MessageClass: "Service",
        MessageCategory: "TransactionStatus",
        MessageType: "Request",
        SaleID: adyenDetails.saleId,
        ServiceID: Math.random().toString(36).substring(2, 12),
        POIID: adyenDetails.poiid,
      },
      TransactionStatusRequest: {
        ReceiptReprintFlag: true,
        DocumentQualifier: ["CashierReceipt", "CustomerReceipt"],
        MessageReference: {
          SaleID: adyenDetails.saleId,
          ServiceID: serviceId,
          MessageCategory: "Payment",
        },
      },
    },
  };

  const securityKeyObj = {
    KeyIdentifier: msg.keyIdentifier,
    Passphrase: msg.passphrase,
    KeyVersion: 1,
    AdyenCryptoVersion: 1,
  };

  try {
    const res = await localRequest(config, body, securityKeyObj);
    const response = res?.SaleToPOIResponse?.TransactionStatusResponse;
    if (!response) {
      return { status: false, error: { message: enLang.TERMINAL_IS_NOT_CONNECTED_WITH_INTERNET } };
    }

    const paymentResponse =
      response?.RepeatedMessageResponse?.RepeatedResponseMessageBody?.PaymentResponse;
    if (
      response?.Response?.Result === "Success" &&
      paymentResponse?.Response?.Result === "Success"
    ) {
      return { status: true, content: paymentResponse?.POIData };
    } else if (
      response?.Response?.Result === "Success" &&
      paymentResponse?.Response?.Result === "Failure"
    ) {
      const errMsg = parseErrorMessage(
        paymentResponse?.Response?.AdditionalResponse,
        paymentResponse?.Response?.ErrorCondition
      );
      return { status: false, error: { message: errMsg } };
    }

    if (response?.Response?.ErrorCondition === "InProgress") {
      return { status: false, error: { message: "UN_HANDLE_RESPONSE" } };
    }
    const errMsg = parseErrorMessage(
      response?.Response?.AdditionalResponse,
      response?.Response?.ErrorCondition
    );
    return { status: false, error: { message: errMsg } };
  } catch (error) {
    return { status: false, error };
  }
};

// const createPaymentRequest = (poiId) => {
//   const id = Math.floor(Math.random() * Math.floor(10000000)).toString();
//   const getMessageHeader = () => ({
//     MessageCategory: MessageCategoryType.Payment,
//     MessageClass: MessageClassType.Service,
//     MessageType: MessageType.Request,
//     POIID: poiId,
//     ProtocolVersion: "3.0",
//     SaleID: id,
//     ServiceID: id,
//   });
//   const saleData = {
//     SaleTransactionID: {
//       TimeStamp: new Date().toISOString(),
//       TransactionID: id,
//     },
//     SaleToAcquirerData: {
//       applicationInfo: {
//         merchantApplication: {
//           version: "1",
//           name: "test",
//         },
//       },
//     },
//   };
//   const amountsReq = {
//     Currency: "GBP",
//     RequestedAmount: 1,
//   };
//   const paymentTransaction = {
//     AmountsReq: amountsReq,
//   };
//   const paymentRequest = {
//     PaymentTransaction: paymentTransaction,
//     SaleData: saleData,
//   };
//   const getSaleToPOIRequest = (messageHeader, request) => ({
//     MessageHeader: messageHeader,
//     ...request,
//   });

//   const messageHeader = getMessageHeader();
//   const saleToPOIRequest = getSaleToPOIRequest(messageHeader, { PaymentRequest: paymentRequest });
//   return { SaleToPOIRequest: saleToPOIRequest };
// };

// const httpsAPI = async (url, data) => {
//   const dataString = JSON.stringify(data);

//   const aliveAgent = new https.Agent({
//     rejectUnauthorized: false,
//   });
//   const aliveAgents = new http.Agent({
//     rejectUnauthorized: false,
//   });

//   const options = {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       "Content-Length": dataString.length,
//     },
//     timeout: 1000, // in ms
//     httpsAgent: aliveAgent,
//     httpAgent: aliveAgents,
//   };
//   // rn_bridge.channel.send({ options: options });
//   return new Promise((resolve, reject) => {
//     const req = https.request(url, options, (res) => {
//       const body = [];
//       res.on("data", (chunk) => body.push(chunk));
//       res.on("end", () => {
//         const resString = Buffer.concat(body).toString();
//         if (res.statusCode < 200 || res.statusCode > 299) {
//           reject(resString);
//         } else {
//           resolve(resString);
//         }
//       });
//     });

//     req.on("error", (err) => {
//       rn_bridge.channel.send({ err });
//       reject(err);
//     });

//     req.on("timeout", () => {
//       req.destroy();
//       reject(new Error("Request time out"));
//     });

//     req.write(dataString);
//     req.end();
//   });
// };

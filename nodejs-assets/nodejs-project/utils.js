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

export const createAdyenPayment = async (
  transactionId,
  amount,
  currency,
  adyenDetails,
  localAPI
) => {
  setLoading(true);
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
      setLoading(true);

      return { status: false, error: { message: "Terminal is not connected with Internet." } };
    }

    const poiData = res.SaleToPOIResponse?.PaymentResponse?.POIData;
    if (response?.Result === "Success") {
      setLoading(true);

      return { status: true, content: poiData };
    }

    const errMsg = parseErrorMessage(response?.AdditionalResponse, response?.ErrorCondition);
    setLoading(true);

    return {
      status: false,
      error: { message: errMsg || "UN_HANDLE_RESPONSE" },
      errData: response,
    };
  } catch (error) {
    setLoading(true);

    return { status: false, error };
  }
};

export const verifyTransactionStatus = async (saleId, poiid, serviceId) => {
  const body = {
    SaleToPOIRequest: {
      MessageHeader: {
        ProtocolVersion: "3.0",
        MessageClass: "Service",
        MessageCategory: "TransactionStatus",
        MessageType: "Request",
        SaleID: saleId,
        ServiceID: Math.random().toString(36).substring(2, 12),
        POIID: poiid,
      },
      TransactionStatusRequest: {
        ReceiptReprintFlag: true,
        DocumentQualifier: ["CashierReceipt", "CustomerReceipt"],
        MessageReference: {
          SaleID: saleId,
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
      return {
        status: false,
        error: { message: enLang.TERMINAL_IS_NOT_CONNECTED_WITH_INTERNET },
      };
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

import deviceInfoModule from 'react-native-device-info';
import uuid from 'react-native-uuid';

export const quickAdyenPayment = (checkoutParams, setLoading) => {
  const paymentGateway = "ADYEN";
  const adyen = reduxStore.getState().deviceSettings.deviceSettingData?.adyen;
  const storeId = '';
  const paymentParams = {
    cartId: uuid.v4(),
    paymentType: 'CARD',
    paymentGateway,
    adyen: { ...adyen, saleId: deviceInfoModule.getUniqueId(), storeId: storeId },
  };
  let verificationAPICallCounter = 0;

  /** Function to verify adyen transaction status */
  const onFailureVerify = (err) => {
    if (err && err.message === "Network Error") {
      setTimeout(() => verifyStatus(), 500);
      return;
    } else if (err.message === "UN_HANDLE_RESPONSE" && verificationAPICallCounter < 3) {
      verificationAPICallCounter += 1;
      setTimeout(() => verifyStatus(), 500);
      return;
    }
    const errorMessage =
      err?.message === "UN_HANDLE_RESPONSE" ? "No response from terminal" : err.message;
    setAlertMessage(errorMessage || "Payment failed");
    setLoading(false);
  };

  const onSuccessVerify = (resp) => {
    setAlertMessage("");
    onSuccess(resp);
  };

  const verifyStatus = () => {
    verifyAdyenTransactionStatus(
      checkoutParams?.outlet?._id,
      paymentParams,
      onSuccessVerify,
      onFailureVerify
    );
  };
  /** End */

  const onSuccess = (resp) => {
    const order = resp.data;
    onQuickCardPaymentSuccess(undefined, resp?.data);
  };

  const onFailure = async (err) => {
    if (err && (err.message === "Network Error" || err.message === "UN_HANDLE_RESPONSE")) {
      setTimeout(() => {
        verifyStatus();
      }, 100);
      return;
    }
  };

  createQuickCheckout(
    checkoutParams.cart,
    checkoutParams.orderType,
    checkoutParams.outlet,
    checkoutParams.employee,
    paymentParams,
    onSuccess,
    onFailure
  );
};

export const createQuickCheckout = (
  cart,
  orderType,
  outlet,
  employee,
  paymentParams,
  onSuccess = () => {},
  onFailure = () => {}
) => {
  if (!orderType) {
    orderType = cart?.type;
  }

  if (!isNotEmpty(outlet)) {
    outlet = reduxStore.getState().restaurant.outlet;
  }
  if (!employee) {
    employee = reduxStore.getState().employee.employee;
  }

  const serviceType =
    orderType === Strings.COUNTER ? Strings.onsiteCounter : Strings.onsiteOffCounter;
  const serviceTypeDisplayName = outlet.settings[serviceType].displayName;

  const params = {
    serviceType,
    serviceTypeDisplayName,
    employeeRef: employee._id,
    ...paymentParams,
  };
  if (cart && isNotEmpty(cart)) {
    cart.closedBy = {
      _id: employee._id,
      firstName: employee.firstName,
      lastName: employee.lastName,
      employeeID: employee.employeeID,
    };
    params.cart = cart;
    const payload = toPayloadParams(params);
    network(POST, getTerminalQuickCheckoutWithCartUrl(outlet?._id), payload)
      .then((res) => {
        onSuccess(res);
      })
      .catch((error) => {
        onFailure(error);
      });
  }
};

export const getTerminalQuickCheckoutWithCartUrl = (vendorId) => {
  return `${IN_PERSON}/${vendorId}/quick-checkout`;
};

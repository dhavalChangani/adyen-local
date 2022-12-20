// External dependencies
import React, { useContext, useEffect, useState } from "react";
import nodejs from "nodejs-mobile-react-native";

// Local dependencies
const AdyenContext = React.createContext(null);

const AdyenProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [nodeJSClientStatus, setNodeJSClientStatus] = useState(false);
  const DEV = true;

  useEffect(() => {
    nodejs.start("main.js");
    nodejs.channel.addListener(
      "message",
      (msg) => {
        console.log({ msg });
        switch (msg.type) {
          case "ClientInitiated":
            setNodeJSClientStatus(true);
          case "paymentResult":
          case "transactionResult":
        }
      },
      this
    );
  }, []);

  useEffect(() => {
    if (nodeJSClientStatus) {
      nodejs.channel.send({ DEV, category: "Config" });
    }
  }, [nodeJSClientStatus, DEV]);

  const startAdyenPayment = (
    saleId,
    serviceId,
    poiid,
    transactionId,
    currency,
    amount,
    keyIdentifier,
    passphrase
  ) => {
    setLoading(true);
    nodejs.channel.send({
      category: "Payment",
      saleId,
      serviceId,
      poiid,
      transactionId,
      currency,
      amount,
      keyIdentifier,
      passphrase,
    });
  };

  const verifyAdyenTransaction = (saleId, poiid, serviceId, keyIdentifier, passphrase) => {
    nodejs.channel.send({
      category: "TransactionStatus",
      saleId,
      poiid,
      serviceId,
      keyIdentifier,
      passphrase,
    });
  };

  return (
    <AdyenContext.Provider value={{ loading, startAdyenPayment, verifyAdyenTransaction }}>
      {children}
    </AdyenContext.Provider>
  );
};

const useAdyenPayment = () => {
  const value = useContext(AdyenContext);
  if (value == null) {
    throw new Error("useAdyenPayment() called outside of a AdyenProvider?");
  }
  return value;
};

export { AdyenProvider, useAdyenPayment };

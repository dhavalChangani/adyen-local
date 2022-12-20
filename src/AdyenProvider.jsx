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
        if (msg.type === "ClientInitiated") {
          setNodeJSClientStatus(true);
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

  const startAdyenPayment = (keyIdentifier, passphrase, poiId) => {
    setLoading(true);
    nodejs.channel.send({
      category: "Payment",
      keyIdentifier,
      passphrase,
      POIID: poiId,
    });
  };

  const verifyAdyenTransaction = (saleId, poiid, serviceId) => {
    nodejs.channel.send({
      category: "TransactionStatus",
      saleId,
      poiid,
      serviceId,
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

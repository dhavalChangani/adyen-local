import React, { useEffect, useState } from "react";
import { Button, View, Alert, TextInput, Text } from "react-native";
import * as axios from "axios";
import { Client, TerminalLocalAPI } from "./src/adyen-node-api-library-develop/src";
import {
  MessageCategoryType,
  MessageClassType,
  MessageType,
} from "./src/adyen-node-api-library-develop/src/typings/terminal/models";
import nodejs from "nodejs-mobile-react-native";

const App = () => {
  const [localUrl, setLocalUrl] = useState("http://localhost");
  const [poiId, setPoiId] = useState("S1F2-000158215131701");
  const [keyIdentifier, setKeyIdentifier] = useState("NOQ_EPOS");
  const [passphrase, setPassphrase] = useState("noq_epos_key_passphrase");

  const date = new Date().toISOString();
  const id = Math.floor(Math.random() * Math.floor(10000000)).toString();
  const paymentRequest = {
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
            Currency: "GBP",
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
          },
        },
      },
    },
  };

  const securityKeyObj = {
    KeyIdentifier: keyIdentifier,
    Passphrase: passphrase,
    KeyVersion: 1,
    AdyenCryptoVersion: 0,
  };

  useEffect(() => {
    nodejs.start("main.js");
    nodejs.channel.addListener(
      "message",
      (msg) => {
        console.log({ msg });
      },
      this
    );
  }, []);

  const sendResponse = (response) => {
    console.log({ sendResponse: response });
    axios
      .request({
        method: "post",
        data: { response },
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

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* <TextInput
        placeholder="Input Url"
        onChangeText={setLocalUrl}
        style={{
          padding: 10,
          margin: 10,
          backgroundColor: "pink",
          height: 40,
          width: "100%",
          color: "black",
          textAlign: "center",
        }}
      /> */}

      <TextInput
        placeholder="Terminal Id"
        onChangeText={setPoiId}
        style={{
          padding: 10,
          margin: 10,
          backgroundColor: "pink",
          height: 40,
          width: "100%",
          color: "black",
          textAlign: "center",
        }}
      />

      <Button
        style={{ backgroundColor: "red", marginTop: "10%" }}
        title={"Encrypted"}
        onPress={() => {
          nodejs.channel.send({ paymentRequest, securityKeyObj });
        }}
      />
    </View>
  );
};

export default App;

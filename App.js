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
  const [localUrl, setLocalUrl] = useState("https://localhost");
  const [poiId, setPoiId] = useState("S1F2-000158215131701");
  const [keyIdentifier, setKeyIdentifier] = useState("NOQ_EPOS");
  const [passphrase, setPassphrase] = useState("noq_epos_key_passphrase");
  const [addCertificate, setAddCertificate] = useState();
  const [certificatePath, setCertificatePath] = useState("");

  // const date = new Date().toISOString();
  // const id = Math.floor(Math.random() * Math.floor(10000000)).toString();
  // const paymentRequest = {
  //   SaleToPOIRequest: {
  //     MessageHeader: {
  //       MessageCategory: "Payment",
  //       MessageClass: "Service",
  //       MessageType: "Request",
  //       POIID: poiId,
  //       ProtocolVersion: "3.0",
  //       SaleID: id,
  //       ServiceID: id,
  //     },
  //     PaymentRequest: {
  //       PaymentTransaction: {
  //         AmountsReq: {
  //           Currency: "GBP",
  //           RequestedAmount: 1,
  //         },
  //       },
  //       SaleData: {
  //         SaleTransactionID: {
  //           TimeStamp: date,
  //           TransactionID: id,
  //         },
  //         SaleToAcquirerData: {
  //           applicationInfo: {
  //             merchantApplication: {
  //               version: "1",
  //               name: "test",
  //             },
  //           },
  //         },
  //       },
  //     },
  //   },
  // };

  // const securityKeyObj = {
  //   KeyIdentifier: keyIdentifier,
  //   Passphrase: passphrase,
  //   KeyVersion: 1,
  //   AdyenCryptoVersion: 0,
  // };

  useEffect(() => {
    nodejs.start("main.js");
    nodejs.channel.addListener(
      "message",
      (msg) => {
        console.log({ msg });
        if (msg.certificatePath) {
          setCertificatePath(msg.certificatePath);
        }
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
      <TextInput
        placeholder="Key Identifier"
        onChangeText={setKeyIdentifier}
        value={keyIdentifier}
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
      <TextInput
        placeholder="Key Passphrase"
        onChangeText={setPassphrase}
        value={passphrase}
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
      <TextInput
        placeholder="Input Url"
        onChangeText={setLocalUrl}
        value={localUrl}
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
      <TextInput
        placeholder="Terminal Id"
        onChangeText={setPoiId}
        value={poiId}
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
      <TextInput
        placeholder="Want to Add Certificate?"
        onChangeText={setAddCertificate}
        value={addCertificate}
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
      <View style={{ padding: 10, margin: 10 }}>
        <Button
          style={{ backgroundColor: "red", padding: 10, margin: 10 }}
          title={"Encrypted"}
          onPress={() => {
            nodejs.channel.send({
              type: 1,
              keyIdentifier,
              passphrase,
              POIID: poiId,
              url: localUrl,
              addCertificate,
            });
          }}
        />
      </View>
      <View style={{ padding: 10, margin: 10 }}>
        <Button
          style={{ backgroundColor: "red", padding: 10, margin: 10 }}
          title={"NON Encrypted"}
          onPress={() => {
            nodejs.channel.send({ type: 0, POIID: poiId, url: localUrl });
          }}
        />
      </View>
      <View style={{ padding: 10, margin: 10 }}>
        <Text>{certificatePath}</Text>
      </View>
    </View>
  );
};

export default App;

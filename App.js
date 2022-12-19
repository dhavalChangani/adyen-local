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
  const [keyIdentifier, setKeyIdentifier] = useState("123456");
  const [passphrase, setPassphrase] = useState("123456");
  const DEV = true;

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
    </View>
  );
};

export default App;

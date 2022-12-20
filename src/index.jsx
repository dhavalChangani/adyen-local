import React, { useState } from "react";
import { Button, View, TextInput, StyleSheet } from "react-native";
import { useAdyenPayment } from "./AdyenProvider";

export const MainUI = () => {
  const { startAdyenPayment } = useAdyenPayment;
  const [localUrl, setLocalUrl] = useState("https://localhost");
  const [poiId, setPoiId] = useState("S1F2-000158215131701");
  const [keyIdentifier, setKeyIdentifier] = useState("123456");
  const [passphrase, setPassphrase] = useState("123456");

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
        style={style.textInput}
      />
      <TextInput
        placeholder="Key Passphrase"
        onChangeText={setPassphrase}
        value={passphrase}
        style={style.textInput}
      />
      <TextInput
        placeholder="Input Url"
        onChangeText={setLocalUrl}
        value={localUrl}
        style={style.textInput}
      />
      <TextInput
        placeholder="Terminal Id"
        onChangeText={setPoiId}
        value={poiId}
        style={style.textInput}
      />
      <View style={{ padding: 10, margin: 10 }}>
        <Button
          style={{ backgroundColor: "red", padding: 10, margin: 10 }}
          title={"Adyen Payment"}
          onPress={() => {
            startAdyenPayment(keyIdentifier, passphrase, poiId);
          }}
        />
      </View>
    </View>
  );
};

const style = StyleSheet.create({
  textInput: {
    padding: 10,
    margin: 10,
    backgroundColor: "pink",
    height: 40,
    width: "100%",
    color: "black",
    textAlign: "center",
  },
});

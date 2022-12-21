import React, { useState } from "react";
import { Button, View, TextInput, StyleSheet } from "react-native";
import { useAdyenPayment } from "./AdyenProvider";

export const MainUI = () => {
  const { startAdyenPayment } = useAdyenPayment;
  const [poiId, setPoiId] = useState("S1F2-000158215131701");
  const [amount, setAmount] = useState("0");
  const [currency, setCurrency] = useState("GBP");

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <TextInput
        placeholder="Amount"
        onChangeText={setAmount}
        value={amount}
        style={style.textInput}
      />
      <TextInput
        placeholder="Currency"
        onChangeText={setCurrency}
        value={currency}
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
            startAdyenPayment(amount, currency, poiId);
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

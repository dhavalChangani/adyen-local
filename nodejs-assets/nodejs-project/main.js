var rn_bridge = require("rn-bridge");
const path = require("path");

const { Client, TerminalLocalAPI, Config } = require("@adyen/api-library");
const { adyenPayment, verifyTransactionStatus } = require("./utils");

const config = new Config();
config.terminalApiLocalEndpoint = "https://localhost";
config.merchantAccount = "NOQAccountPOS";
config.certificatePath = path.join(__dirname, "adyen-terminalfleet-test.pem");

const client = new Client({ config });
client.setEnvironment("TEST", null);

const localAPI = new TerminalLocalAPI(client);
localAPI.apiKeyRequired = false;

rn_bridge.channel.on("message", async (msg) => {
  const { transactionId, amount, currency, adyen } = msg;

  switch (msg.category) {
    case "Payment":
      const paymentResult = await adyenPayment(transactionId, amount, currency, adyen, localAPI);
      rn_bridge.channel.send(paymentResult);
      break;

    case "TransactionStatus":
      const transactionResult = await verifyTransactionStatus(
        transactionId,
        amount,
        currency,
        adyen,
        localAPI
      );
      rn_bridge.channel.send(transactionResult);
      break;

    case "Print":
      break;
  }
});

// Inform react-native node is initialized.
rn_bridge.channel.send("Node was initialized.");

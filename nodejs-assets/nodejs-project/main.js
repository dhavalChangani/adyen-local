var rn_bridge = require("rn-bridge");
const path = require("path");

const { Client, TerminalLocalAPI, Config } = require("@adyen/api-library");
const { verifyTransactionStatus, createAdyenPayment } = require("./utils");

const config = new Config();
config.terminalApiLocalEndpoint = "https://localhost";
config.merchantAccount = "NOQAccountPOS";

const client = new Client({ config });
client.setEnvironment("TEST", null);
client.config.certificatePath = path.join(__dirname, "adyen-terminalfleet-test.pem");

const localAPI = new TerminalLocalAPI(client);
localAPI.apiKeyRequired = false;

rn_bridge.channel.on("message", async (msg) => {
  try {
    switch (msg.category) {
      case "Config":
        if (msg.DEV === false) {
          client.setEnvironment("LIVE", null);
          client.config.certificatePath = path.join(__dirname, "adyen-terminalfleet-live.pem");
        } else if (msg.DEV === true) {
          client.setEnvironment("TEST", null);
          client.config.certificatePath = path.join(__dirname, "adyen-terminalfleet-test.pem");
        }
        break;

      case "Payment":
        const paymentResult = await createAdyenPayment(...{ msg }, localAPI);
        rn_bridge.channel.send({ type: "paymentResult", paymentResult });
        break;

      case "TransactionStatus":
        const transactionResult = await verifyTransactionStatus(...{ msg }, localAPI);
        rn_bridge.channel.send({ type: "transactionResult", transactionResult });
        break;

      case "Print":
        break;
    }
  } catch (error) {
    rn_bridge.channel.send({ error });
  }
});

// Inform react-native node is initialized.
rn_bridge.channel.send({ type: "ClientInitiated" });

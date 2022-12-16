// Rename this sample file to main.js to use on your project.
// The main.js file will be overwritten in updates/reinstalls.

var rn_bridge = require("rn-bridge");
const ADYEN_MANAGEMENT_API_KEY =
  "AQEpgXvdQM2NG2Yd7nqxnH12icuqaYhOAoZETJuvSmgWWbNNbRDDdyQr1EsQwV1bDb7kfNy1WIxIIkxgBw==-W3A7lw6rwLzaze6MClpXJLJ++4tGcGnw80Vxcbk+cwQ=-__KxSXhz+J5Y9(S#";

const { Client, TerminalLocalAPI } = require("@adyen/api-library");
const client = new Client({ apiKey: ADYEN_MANAGEMENT_API_KEY, environment: "TEST" });

// Echo every message received from react-native.
rn_bridge.channel.on("message", async (msg) => {
  try {
    rn_bridge.channel.send(msg);
    rn_bridge.channel.send(client);

    const terminalLocalAPI = new TerminalLocalAPI(client);
    rn_bridge.channel.send({ terminalLocalAPI });

    const terminalApiResponse = await terminalLocalAPI.request(
      terminalAPIPaymentRequest,
      securityKey
    );
    rn_bridge.channel.send({ terminalApiResponse });
  } catch (error) {
    rn_bridge.channel.send({ error: error });
  }
});

// Inform react-native node is initialized.
rn_bridge.channel.send("Node was initialized.");

// Rename this sample file to main.js to use on your project.
// The main.js file will be overwritten in updates/reinstalls.
// process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

var rn_bridge = require("rn-bridge");
const { Client, TerminalLocalAPI, Config } = require("@adyen/api-library");
const {
  MessageCategoryType,
} = require("@adyen/api-library/lib/src/typings/terminal/messageCategoryType");
const https = require("https");
const http = require("http");
const {
  MessageClassType,
} = require("@adyen/api-library/lib/src/typings/terminal/messageClassType");
const { MessageType } = require("@adyen/api-library/lib/src/typings/terminal/messageType");
const path = require("path");

// rn_bridge.channel.send({
//   certificatePath: path.resolve(__dirname + "/adyen-terminalfleet-test.pem"),
// });

const createPaymentRequest = (poiId) => {
  const id = Math.floor(Math.random() * Math.floor(10000000)).toString();
  const getMessageHeader = () => ({
    MessageCategory: MessageCategoryType.Payment,
    MessageClass: MessageClassType.Service,
    MessageType: MessageType.Request,
    POIID: poiId,
    ProtocolVersion: "3.0",
    SaleID: id,
    ServiceID: id,
  });
  const saleData = {
    SaleTransactionID: {
      TimeStamp: new Date().toISOString(),
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
  };
  const amountsReq = {
    Currency: "GBP",
    RequestedAmount: 1,
  };
  const paymentTransaction = {
    AmountsReq: amountsReq,
  };
  const paymentRequest = {
    PaymentTransaction: paymentTransaction,
    SaleData: saleData,
  };
  const getSaleToPOIRequest = (messageHeader, request) => ({
    MessageHeader: messageHeader,
    ...request,
  });

  const messageHeader = getMessageHeader();
  const saleToPOIRequest = getSaleToPOIRequest(messageHeader, { PaymentRequest: paymentRequest });
  return { SaleToPOIRequest: saleToPOIRequest };
};

const httpsAPI = async (url, data) => {
  const dataString = JSON.stringify(data);

  const aliveAgent = new https.Agent({
    rejectUnauthorized: false,
  });
  const aliveAgents = new http.Agent({
    rejectUnauthorized: false,
  });

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": dataString.length,
    },
    timeout: 1000, // in ms
    httpsAgent: aliveAgent,
    httpAgent: aliveAgents,
  };
  // rn_bridge.channel.send({ options: options });
  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      const body = [];
      res.on("data", (chunk) => body.push(chunk));
      res.on("end", () => {
        const resString = Buffer.concat(body).toString();
        if (res.statusCode < 200 || res.statusCode > 299) {
          reject(resString);
        } else {
          resolve(resString);
        }
      });
    });

    req.on("error", (err) => {
      rn_bridge.channel.send({ err });
      reject(err);
    });

    req.on("timeout", () => {
      req.destroy();
      reject(new Error("Request time out"));
    });

    req.write(dataString);
    req.end();
  });
};
const backendUrl = "https://portal.noq.events/api/v2/in-person/123/send-receipt";
// Echo every message received from react-native.
rn_bridge.channel.on("message", async (msg) => {
  var terminalPaymentRequest = createPaymentRequest(msg.POIID);
  if (msg.type === 1) {
    try {
      const config = new Config();
      config.terminalApiLocalEndpoint = msg.url;
      if (msg.addCertificate && msg.addCertificate.length > 0) {
        config.certificatePath = path.resolve(__dirname + "/adyen-terminalfleet-test.pem");
      }
      const client = new Client({ config });
      client.setEnvironment("TEST", null);

      const localAPI = new TerminalLocalAPI(client);
      localAPI.apiKeyRequired = false;

      const securityKeyObj = {
        KeyIdentifier: msg.keyIdentifier,
        Passphrase: msg.passphrase,
        KeyVersion: 1,
        AdyenCryptoVersion: 0,
      };
      const result = await localAPI.request(terminalPaymentRequest, securityKeyObj);

      httpsAPI(backendUrl, {
        result,
        from: "TerminalLocalAPI Response",
      });
    } catch (error) {
      httpsAPI(backendUrl, {
        error,
        from: "TerminalLocalAPI Error",
      });
    }
  } else {
    try {
      const normalRequest = await httpsAPI(`${msg.url}:8443/nexo`, terminalPaymentRequest);
      await httpsAPI(backendUrl, {
        normalRequest,
        from: "TerminalLocalAPI NORMAL REQ",
      }).catch((error) => {
        rn_bridge.channel.send({ funcCatch: error });
      });
    } catch (err) {
      await httpsAPI(backendUrl, {
        err,
        from: "TerminalLocalAPI NORMAL REQ ERR",
      });
    }
  }
});

// Inform react-native node is initialized.
rn_bridge.channel.send("Node was initialized.");

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

// Explicit CORS configuration
const corsOptions = {
  origin: "http://localhost:3000", // Allow your frontend origin
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));

const events = [];

app.post("/api/eventbus/events", async (req, res) => {
  const event = req.body;
  events.push(event);

  console.log("EventBus: Received Event:", event.type);

  const services = [
    {
      name: "storageMgmt",
      url: "http://storage-mgmt-serv-srv:4001/api/storageMgmt/events",
    },
    {
      name: "usageMntr",
      url: "http://usage-mntr-serv-srv:4002/api/usageMntr/events",
    },
    {
      name: "userAcc",
      url: "http://user-acc-mgmt-serv-srv:4003/api/userAcc/events",
    },
  ];

  await Promise.all(
    services.map(async (service) => {
      try {
        const response = await axios.post(service.url, event, {
          headers: { "Content-Type": "application/json" },
        });
        console.log(`Response from ${service.name} service:`, response.data);
      } catch (error) {
        console.error(`Error in ${service.name} service:`, {
          message: error.message,
          response: error.response?.data,
        });
      }
    })
  );

  res.send({ status: "OK" });
});

app.get("/events", (req, res) => {
  res.send(events);
});

app.listen(4000, () => {
  console.log("EventBus: Listening on 4000");
});

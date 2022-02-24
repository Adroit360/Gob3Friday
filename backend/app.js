require("dotenv").config();
const express = require("express");
const request = require("request");
const cors = require("cors");
const https = require("https");
const Redde = require("redde-nodejs-sdk");
const http = require("http");
const { Server } = require("socket.io");
const { initializeApp } = require("firebase-admin/app");
const axios = require("axios");

var admin = require("firebase-admin");

var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://restaurant-2a643-default-rtdb.firebaseio.com",
});

// firebase database object
const db = admin.firestore();

let orderStatus = false;

const port = process.env.PORT || 6000;

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

require("./startup/prod")(app);

app.get("/", (req, res) => {
  io.emit("orderStatus", { orderStatus });
  res.json({ orderStatus });
});

//cors(corsOptions),
app.post("/paystack/payment", async (req, res, next) => {
  const data = {
    amount: req.body.amount,
    email: `customer${Date.now()}@email.com`,
    reference: req.body.clientId,
    channels: ["mobile_money", "card"],
  };

  const config = {
    headers: {
      Authorization: `Bearer ${process.env.API_KEY}`,
      "Content-Type": "application/json",
    },
  };

  try {
    // await db.collection("orders").add(req.body.orderDetails);
    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      data,
      config
    );
    res.json({ auth_url: response.data.data.authorization_url });
  } catch (error) {
    console.log(error);
    res.json({ error: "an uexpected error occured please try again" });
  }

  // try {
  //   // await db.collection("orders").add(req.body.orderDetails);
  //   const data = await post(receive.url, receive.json);
  //   io.emit("notification", { data });
  //   res.send(data);
  // } catch (error) {
  //   console.log(error);
  //   next();
  // }
});

//Callback Url Endpoint
app.post("/api/reditpayment", async function (req, res) {
  const data = req.body;

  try {
    if (data.status == "PAID") {
      let orderId = (
        await db
          .collection("orders")
          .where("orderId", "==", data.clienttransid)
          .get()
      ).docs[0].id;
      await db.collection("orders").doc(orderId).update({
        orderPaid: true,
      });
      res.send(200);
    }
  } catch (error) {
    console.log(error);
  }
});

app.post("/api/closeOrders", (req, res) => {
  orderStatus = true;
  io.emit("orderStatus", { orderStatus });
  res.json({ orderStatus });
});

app.post("/api/openOrders", (req, res) => {
  orderStatus = false;
  io.emit("orderStatus", { orderStatus });
  res.json({ orderStatus });
});

server.listen(port, () => {
  console.log(`server listening on  http://localhost:${port}/`);
});

io.on("connection", (socket) => {
  console.log("a user connected");
});

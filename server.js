const express = require("express");
const fetch = require("node-fetch"); //not gonna try the new fetch just yet :)
const app = express();
var expressWs = require("express-ws");
const server = require("http").createServer(app);
const WebSocket = require("ws");

// const wss = new WebSocket.Server({ server: server });
const wss = new WebSocket.Server({ server: server });

wss.on("connection", (socket) => {
  // setInterval(() => {
  //   console.log("hello world");
  // }, 60000);
  console.log("A new client connected!!");
  setInterval(async () => {
    const data = await fetch("http://localhost:5000/status/model-events").then(
      (res) => res.json()
    );
    socket.send(JSON.stringify(data));
  }, 60000); //send the stringified resposne every minute
});
/** Todo
 * Authentication : json?
 * timeout is not working
 */

PORT = process.env.PORT || 5000;

app.get("/status/model-events", async (req, res) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    console.log("Aborting...");
    controller.abort();
  }, 7000);
  let running = false;
  //10.255.255.1.
  //events.blankly.finance/
  await fetch("http://events.blankly.finance/", { signal: controller.signal })
    .then(() => {
      clearTimeout(timeoutId); //clear the timeout immediately
      running = true;
    })
    .catch((error) => console.log(error));

  return res.json({
    running: running,
  });
});

//get time
app.get("/server/time", (req, res) => {
  res.json({
    time: new Date().getTime(),
  });
});
// middleware
app.use("/secret", (req, res) => {
  console.log(req.headers.authorization);
  if (req.headers.authorization != '{"TOKEN": "BLANKLY_IS_COOL"}') {
    return res.json({ error: "unauthenticated" });
  }

  res.json({
    message: "welcome",
  });
});
server.listen(PORT, () => {
  console.log("Connected");
});

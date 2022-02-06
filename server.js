const express = require("express");
const fetch = require("node-fetch"); //not gonna try the new fetch just yet :)
const app = express();
const server = require("http").createServer(app);
const WebSocket = require("ws");

const wss = new WebSocket.Server({ server: server });

PORT = process.env.PORT || 5000;
let cached = false; //cached or not
let events_message = {
  //default message to be sent back
  running: false,
};

//websocket for sending the status every minute
wss.on("connection", (socket) => {
  console.log("A new client connected!");
  setInterval(async () => {
    const data = await fetch("http://localhost:5000/status/model-events").then(
      (res) => res.json()
    );
    socket.send(JSON.stringify(data));
  }, 60000); //send the stringified resposne every minute
});

app.get("/status/model-events", async (req, res) => {
  //10.255.255.1. use this to test timeout
  //events.blankly.finance/

  // cache miss
  if (!cached) {
    cached = true;
    setTimeout(() => {
      cached = false;
    }, 60000); //restart the cache after 1 minute

    const timeoutId = setTimeout(() => {
      console.log("Aborting...");
      events_message.running = false;
      return res.json(events_message);
    }, 7000);

    await fetch("http://events.blankly.finance/")
      .then(() => {
        clearTimeout(timeoutId); //clear the timeout immediately
        events_message.running = true;
      })
      .catch((error) => {
        console.log(error);

        //if we get an error... then the
        //server is most prob not working
        //but previous cache might make it true
        //so we set it back to false
        events_message.running = false;
      });
  }
  return res.json(events_message);
});

app.get("/server/time", (req, res) => {
  res.json({
    time: new Date().getTime(),
  });
});

// middleware
app.use("/secret", (req, res) => {
  if (req.headers.authorization != '{"TOKEN": "BLANKLY_IS_COOL"}') {
    //We can JSON.parse the authorization if we want to
    return res.json({ error: "unauthenticated" });
  }

  res.json({
    message: "welcome",
  });
});

server.listen(PORT, () => {
  console.log("Connected");
});

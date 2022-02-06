const express = require("express");
const fetch = require("node-fetch"); //not gonna try the new fetch just yet :)
const app = express();

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

  res.json({
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
app.listen(PORT, () => {
  console.log("Connected");
});

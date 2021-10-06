const express = require("express");
const bodyParser = require("body-parser");

const app = express().use(bodyParser.json());

app.post("/webhook", (req, res) => {
  console.log("POST: webhook");

  const body = req.body;
  if (body.object === "page") {
    body.entry.forEach((entry) => {
      //entran y procesan mensajes
      const webhookEvent = entry.messaging[0];
      console.log(webhook);
    });

    res.status(200).sendStatus('EVENTO RECIBIDO')
  } else {
    res.sendStatus(404);
  }
});

app.get("/webhook", (req, res) => {
  console.log("GET: webhook");
  
  const VERIFY_TOKEN = 'asd';

  const mode = req.query['hub.mode']
  const token = req.query['hub.verify_token']
  const challenge = req.query['hub.challenge']

  if(mode && token){
    if(mode === 'subscribe' && token === VERIFY_TOKEN){
      console.log('WEBHOOK VERIFICADO');
      res.status(200).send(challenge);
    }else{
      res.sendStatus(404);
    }
  }else{
    res.sendStatus(404);
  }
});


app.set('port',process.env.PORT || 8080)


app.listen(app.get('port'), () => {
  console.log(`Server on port ${app.get('port')}`);
});

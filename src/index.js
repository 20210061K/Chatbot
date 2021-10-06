const express = require("express");
const bodyParser = require("body-parser");
const request = require('request')

const app = express().use(bodyParser.json());

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

app.set('port',process.env.PORT || 8080)

app.post("/webhook", (req, res) => {
  console.log("POST: webhook");

  const body = req.body;
  if (body.object === "page") {
    body.entry.forEach(entry => {
      //se reciben y procesan mensajes
      const webhookEvent = entry.messaging[0];
      console.log(webhookEvent);

      const sender_psid = webhookEvent.sender.id;
      console.log(`Sender PSID: ${sender_psid}`);

      //validar que estamos recibiendo un mensaje
      if(webhookEvent.message){
        handleMessage(sender_psid, webhookEvent.message);
      }else if(webhookEvent.postback){
        handlePostback(sender_psid, webhookEvent.postback)
      }
    });

    res.status(200).send('EVENTO RECIBIDO')
  } else {
    res.sendStatus(404);
  }
});

app.get("/webhook", (req, res) => {
  console.log("GET: webhook");
  
  const VERIFY_TOKEN = 'sisasxdxd';

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

// Administrar eventos que lleguen
function handleMessage(sender_psid, received_message) {
  let response;

  if(received_message.text){
    response = {
      'text': `Tu mensaje fue: ${received_message.text}, ahora mandame una imagen...`
    }
  }else if(received_message.attachements){
    const url = received_message.attachements[0].payload.url;
    response = {
      "attachment":{
        "type":"template",
        "payload":{
          "template_type":"generic",
          "elements":[
             {
              "title":"Confirma tu imagen",
              "image_url": url,
              "subtitle":"Ejemplo de prueba",
              "buttons":[
                {
                  "type":"postback",
                  "url":"https://petersfancybrownhats.com",
                  "title":"Si",
                  "payload": "yes"
                },{
                  "type":"postback",
                  "title":"No",
                  "payload":"no"
                }              
              ]      
            }
          ]
        }
      }
    }
  }

  callSendAPI(sender_psid, response)
}

// Funcionalidad del postback
function handlePostback(sender_psid, received_postback) {

}

// Mensaje de regreso
function callSendAPI(sender_psid, response) {
  const requestBody = {
    'recipient' : {
      'id': sender_psid
    },
    'message': response
  };

  request({
    'uri': 'https://graph.facebook.com/v2.6/me/messages',
    'qs': {'access_token': PAGE_ACCESS_TOKEN},
    'method': 'POST',
    'json': requestBody
  }, (err, res, body) =>{
    if(!err){
      console.log('Mensaje enviado de vuelta')
    }else{
      console.error('Imposible enviar el mensaje')
    }
  })
}

app.listen(app.get('port'), () => {
  console.log(`Server on port ${app.get('port')}`);
});

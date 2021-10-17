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
      "attachment":{
        "type":"template",
        "payload":{
          "template_type":"button",
          "text": "¿Que deseas hacer?",
          "buttons":[
            {
              "type":"postback",
              "title":"Pertenecer al equipo",
              "payload" : 'A'
            },
          ]
        }
      }
    }
  }

  callSendAPI(sender_psid, response)
}

// Funcionalidad del postback
function handlePostback(sender_psid, received_postback) {
  let response = '';

  const payload = received_postback.payload;

  if(payload === 'A'){
    response = {
      "attachment":{
        "type":"template",
        "payload":{
          "template_type":"generic",
          "elements":[
             {
              "title":"Teclados",
              "image_url": 'https://http2.mlstatic.com/D_NQ_NP_773666-MPE41546723471_042020-O.jpg',
              "subtitle":"Teclados de respuesta rápida y de gran calidad.",
              "buttons":[
                {
                  "type":"postback",
                  "title":"Mecánico",
                  "payload": "mecanico"
                },
                {
                  "type":"postback",
                  "title":"De membrana",
                  "payload": "membrana"
                }               
              ]      
            }
          ]
        }
      }
    }
  }
  callSendAPI(sender_psid,response);
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

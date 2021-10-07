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
              "title":"Ver las ofertas",
              "payload" : 'A'
            },
            {
              "type":"web_url",
              "title":"Ir a la tienda online",
              "url" : 'https://www.linio.com.pe'
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
            },
            {
              "title":"Mouse",
              "image_url": 'https://falabella.scene7.com/is/image/FalabellaPE/17448782_1?wid=800&hei=800&qlt=70',
              "subtitle":"De rápida respuesta y alto dpi.",
              "buttons":[
                {
                  "type":"postback",
                  "title":"Gamer",
                  "payload": "gamer"
                }     
              ]      
            },
            {
              "title":"Monitores",
              "image_url": 'https://spartangeek.com/blog/content/images/2019/04/Asus-ROG-Swift-PG27UQ-monitores-para-pc.jpg',
              "subtitle":"Planas, curvas, y para toda necesidad.",
              "buttons":[
                {
                  "type":"postback",
                  "title":"Planas",
                  "payload": "plana"
                },
                {
                  "type":"postback",
                  "title":"Curvas",
                  "payload": "curva"
                }
              ]      
            }
          ]
        }
      }
    }
  }

  if (payload==="membrana"){
    response = {
      "attachment":{
        "type":"template",
        "payload":{
          "template_type":"generic",
          "elements":[
             {
              "title":" Meetion K9320",
              "image_url": 'https://i.linio.com/p/b37604e634b93815b1cfd818e982ab13-product.webp',
              "subtitle":"S/ 59.90",
              "buttons":[
                {
                  "type":"web_url",
                  "title":"Comprar",
                  "url" : 'https://www.linio.com.pe/p/teclado-gamer-de-membrana-meetion-k9320-retroiluminado-rac-store-n2ckis?qid=086793d737b3cb62475ed079160d94d3&oid=ME593EL18YQ3KLPE&position=12&sku=ME593EL18YQ3KLPE'
                },
              ]
            },
            {
              "title":"TKL Pulsar VSG",
              "image_url": 'https://i.linio.com/p/65f67ce40a36b1ba608413316b01fa17-product.webp',
              "subtitle":"S/ 129.90",
              "buttons":[
                {
                  "type":"web_url",
                  "title":"Comprar",
                  "url" : 'https://www.linio.com.pe/p/teclado-gamer-tkl-pulsar-vsg-vbvfoj?qid=086793d737b3cb62475ed079160d94d3&oid=VS653EL0EX55TLPE&position=5&sku=VS653EL0EX55TLPE'
                },
              ]
            }
          ]
        }
      }
    }
  }else if(payload === "mecanico"){
    response = {
      "attachment":{
        "type":"template",
        "payload":{
          "template_type":"generic",
          "elements":[
            {
              "title":"Redragon Kumara Rgb K552",
              "image_url": 'https://i.linio.com/p/d67c338b3c28f1d0494d027125b66d3c-product.webp',
              "subtitle":"S/ 219.00",
              "buttons":[
                {
                  "type":"web_url",
                  "title":"Comprar",
                  "url" : 'https://www.linio.com.pe/p/teclado-meca-nico-redragon-kumara-rgb-k552-espan-ol-negro-n1mg2d?qid=1c1832a78e82dba3fcf034f66ab981a8&oid=RE827EL19QF3QLPE&position=1&sku=RE827EL19QF3QLPE'
                },
              ]
            },
            {
              "title":" Ajazz AK33 Geek",
              "image_url": 'https://i.linio.com/p/2d719bafa95b3f17b2cb580c5c3879e3-product.webp',
              "subtitle":"S/ 149.00",
              "buttons":[
                {
                  "type":"web_url",
                  "title":"Comprar",
                  "url" : 'https://www.linio.com.pe/p/teclado-meca-nico-led-ajazz-ak33-geek-rgb-s3xmm4?qid=b50d25a226e7b1a7e82490b327125230&oid=GE582EL0O87K8LPE&position=26&sku=GE582EL0O87K8LPE'
                },
              ]
            }
          ]
        }
      }
    }
  }else if(payload === "gamer"){
    response = {
      "attachment":{
        "type":"template",
        "payload":{
          "template_type":"generic",
          "elements":[
             {
              "title":"Logitech G203 Lightsync",
              "image_url": 'https://i.linio.com/p/d7f8c1729f893470ff4cfcc21c558a80-product.webp',
              "subtitle":"S/ 157.90",
              "buttons":[
                {
                  "type":"web_url",
                  "title":"Comprar",
                  "url" : 'https://www.linio.com.pe/p/logitech-g203-lightsync-mouse-rgb-8000-dpi-negro-x-qg0e94?qid=1a6580463380a31c55cae50dabb3006d&oid=LO099EL0UCNEQLPE&position=1&sku=LO099EL0UCNEQLPE'
                }
              ]
            },
            {
              "title":"Redragon COBRA M711",
              "image_url": 'https://i.linio.com/p/601fcbe1697e0817d59f9943b37c9c54-product.webp',
              "subtitle":"S/ 149.00",
              "buttons":[
                {
                  "type":"web_url",
                  "title":"Comprar",
                  "url" : 'https://www.linio.com.pe/p/mouse-gamer-redragon-cobra-m711-fps-24000-dpi-rgb-9-botones-negro-wy946m?qid=0a16947cc98fb675b1ea1590927d698f&oid=RE827EL0ANS8QLPE&position=1&sku=RE827EL0ANS8QLPE'
                }
              ]
            },
          ]
        }
      }
    }
  }else if(payload === "plana"){
    response = {
      "attachment":{
        "type":"template",
        "payload":{
          "template_type":"generic",
          "elements":[
             {
              "title":"Samsung LF24T350FHLXPE",
              "image_url": 'https://i.linio.com/p/9eeb3d0fcdd160690b9eea65c6f2ffe1-product.webp',
              "subtitle":"S/ 629.00",
              "buttons":[
                {
                  "type":"web_url",
                  "title":"Comprar",
                  "url": 'https://www.linio.com.pe/p/monitor-samsung-lf24t350fhlxpe-led-de-24-75hz-fhd-rz0laa?qid=b4a13dbd914de9d4f09de08572158034&oid=SA026EL0SMXMBLPE&position=2&sku=SA026EL0SMXMBLPE'
                }
              ]
            },
            {
              "title":"LG 29WP60G-B",
              "image_url": 'https://i.linio.com/p/d0b4d37de8ca74f6b4de5620ffe2569d-product.webp',
              "subtitle":"S/ 1,182.00",
              "buttons":[
                {
                  "type":"web_url",
                  "title":"Comprar",
                  "url": 'https://www.linio.com.pe/p/monitor-samsung-lf24t350fhlxpe-led-de-24-75hz-fhd-rz0laa?qid=b4a13dbd914de9d4f09de08572158034&oid=SA026EL0SMXMBLPE&position=2&sku=SA026EL0SMXMBLPE'
                }
              ]
            },
            {
              "title":"ViewSonic XG2705",
              "image_url": 'https://i.linio.com/p/11cceadfc80cb9240fd083a3287fdd61-product.webp',
              "subtitle":"S/ 1,313.00",
              "buttons":[
                {
                  "type":"web_url",
                  "title":"Comprar",
                  "url": 'https://www.linio.com.pe/p/monitor-samsung-lf24t350fhlxpe-led-de-24-75hz-fhd-rz0laa?qid=b4a13dbd914de9d4f09de08572158034&oid=SA026EL0SMXMBLPE&position=2&sku=SA026EL0SMXMBLPE'
                }
              ]
            }
          ]
        }
      }
    }
  }else if(payload === "curva"){
    response = {
      "attachment":{
        "type":"template",
        "payload":{
          "template_type":"generic",
          "elements":[
             {
              "title":"Teros Gaming TE-3173N",
              "image_url": 'https://i.linio.com/p/5778918c23788b79e7479f484505bca3-product.webp',
              "subtitle":"S/ 809.00",
              "buttons":[
                {
                  "type":"web_url",
                  "title":"Comprar",
                  "url" : 'https://www.linio.com.pe/p/monitor-teros-gaming-te-3173n-27-ips-curvo-144-hz-hdmi-displayport-freesync-n2kv88?qid=b4a13dbd914de9d4f09de08572158034&oid=TE255EL187JFVLPE&position=1&sku=TE255EL187JFVLPE'
                }
              ]
            },
            {
              "title":"SAMSUNG LC27T550FDLXPE",
              "image_url": 'https://i.linio.com/p/e4539faee0ee260d3ce074987f1bb66c-product.webp',
              "subtitle":"S/ 1,057.00",
              "buttons":[
                {
                  "type":"web_url",
                  "title":"Comprar",
                  "url" : 'https://www.linio.com.pe/p/monitor-gamer-samsung-lc27t550fdlxpe-opz8mg?qid=b4a13dbd914de9d4f09de08572158034&oid=SA026EL12ZEDWLPE&position=8&sku=SA026EL12ZEDWLPE'
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

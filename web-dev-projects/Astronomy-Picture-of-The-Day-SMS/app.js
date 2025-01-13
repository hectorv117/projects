require('dotenv').config({path: __dirname+ '/twilio.env'});
const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const http = require("http");
const mongoose = require("mongoose");
var twilio = require('twilio');
const MessagingResponse = twilio.twiml.MessagingResponse;


const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const phoneNumber=process.env.PHONE_NUMBER;
console.log(phoneNumber);
const client = new twilio(accountSid, authToken);
var cronJob = require('cron').CronJob;
const app = express();


// set up mongoDB
mongoose.connect("mongodb://localhost:27017/subscriptionsDB", {useNewUrlParser: true});
//collection schema
const subscriptionSchema = new mongoose.Schema({
  phone: Number
});
//model
const Subscription = mongoose.model("Subscriber", subscriptionSchema);
app.use(bodyParser.urlencoded({extended: true}));




//GET APOD from NASA's API
const key = process.env.API_KEY;
let url = "https://api.nasa.gov/planetary/apod?api_key="+key;

let today = new Date().toLocaleDateString();
let img ="";
let description="";
let stars = "****************************";

https.get(url, function(res){
  console.log(res.statusCode);

  res.on("data", function(data){
    var info = JSON.parse(data);
     description = info.explanation;
     img = info.url;

  });
});





//this will update the date, image and description to the current day 3 minutes before sending them to subcribers

var textJob = new cronJob( '12 7 * * *', function(){

today = new Date().toLocaleDateString();
  https.get(url, function(res){
    console.log(res.statusCode);

    res.on("data", function(data){
      var info = JSON.parse(data);
       description = info.explanation;
       img = info.url;
      //console.log(description);
      console.log(img);
    })
  });
},  null, true);

//This will go through the collection at a set time (7:15) and send the Astronomy Picture of the Day message to each user registered in the DB

var textJob = new cronJob( '15 7 * * *', function(){

  Subscription.find(function(err, people){

//use the find function to access subcribers in the database
    if (err){
      console.log(err);
    }
    else if(people.length===0){
      console.log("empty db");
    }
    else{
      //send each subcriber a message containing either a youtbe url or image depending on that days media source
      people.forEach(function(person){
        let num = "+"+person.phone;

        if (img.indexOf('youtube')!== -1){
          client.messages.create( { to: num, from: phoneNumber, body:"\n\n " + img +  "\n\n"+ stars +"\n\n Astronomy Picture of the Day\n\t\t\t"+ today + "\n\n "+ stars+" \n\n Reply 'Explain' to recieve an explanation of the picture."}, function( err, data ) {
          console.log(data);
            if(err){
              console.log(err);
            }
          });
        }
          else{
                client.messages.create( { to: num, from: phoneNumber, body:"\n\n"+ stars +"\n\n Astronomy Picture of the Day\n\t\t\t"+ today + "\n\n "+ stars+" \n\n Reply 'Explain' to recieve an explanation of the picture.", mediaUrl: img}, function( err, data ) {
                console.log(data);
                    if(err){
                      console.log(err);
            }
          });
        }
       });
    }
  });
},  null, true);


//the express server waits for a post request (text message response) and replies differently depending on wether the user is subscribed or not
app.post('/sms', (req, res) => {

const twiml = new MessagingResponse();


let message = req.body.Body;
var fromNum = req.body.From;

var phoneNum = fromNum.replace(/\+/g, "");
// if the text message is "subscribe" check if they're already subscribed if not add them to the DB and reply with a confirmation message and with that days APOD message
  if (message.trim().toLowerCase() === 'subscribe' ) {

    Subscription.findOne({phone: phoneNum}, function(err, person){
      if(err){
        console.log(error);
      }
      else if(person===null){

        Subscription.create({phone: phoneNum}, function(err, doc){
           if (err){console.log("Error adding phone number to DB "+err);}
           else{
             console.log("Successfully added to DB");
           }
         });
         // check if the APOD is a youtube video or an actual image url
             if (img.indexOf('youtube')!== -1){
               client.messages.create( { to: fromNum, from: phoneNumber, body:"\nThank you, you are now subscribed. You will be recieving the APOD at 10AM every day. Reply 'Leave' to stop recieving updates. Reply 'Explain' to recieve an explanation of the picture. Here's today's picture: \n\n " + img}, function( err, data ) {});
               }
               else{
                 client.messages.create( { to: fromNum, from: phoneNumber', mediaUrl: img,  body:"\nThank you, you are now subscribed. You will be recieving the APOD at 10AM every day. Reply 'Leave' to stop recieving updates. Reply 'Explain' to recieve an explanation of the picture. Here's today's picture: "}, function( err, data ) {});
               }
         }
// if the user is already subscribed text them this
      else{
        client.messages.create( { to: fromNum, from: phoneNumber, body:"\nYou are already subscribed. Reply 'Leave' to unsubscribe"}, function( err, data ) {});
      }
    });

  }
// if the text message is "leave" check if they're already in the DB
  else if(message.trim().toLowerCase() === 'leave'){
      Subscription.deleteMany({phone: phoneNum}, function(err, count){
        let deleted = count.deletedCount;
        if (err){
          console.log(err);
        }
        //if the user wasn't subscribed:
        else if(deleted===0){
            client.messages.create( { to: fromNum, from:phoneNumber, body:'\nYou are not subscribed. Text "Subscribe" to rejoin the Daily Astronomy Picture of the Day'}, function( err, data ) {});
        }
        //if the user was subscribed:
        else{
          client.messages.create( { to: fromNum, from: phoneNumber, body:"\nYou are now unsubscribed and will stop recieving further updates."}, function( err, data ) {});
        }
      });
  }
  //if the message is "explain" text them the lengthy description of that days APOD
  else if(message.trim().toLowerCase() === 'explain'){
    client.messages.create( { to: fromNum, from: phoneNumber, body: description}, function( err, data ) {});

  }
  // if the user texts anything besides those keywords: 
   else {
    client.messages.create( { to: fromNum, from: phoneNumber, body:'\nWelcome to Astronomy Picture of the Day SMS. Text "Subscribe" receive updates. Text "Leave" to unsubscribe.'}, function( err, data ) {
      if(err){
        console.log(err);
      }
    });

  }
  res.writeHead(200, { 'Content-Type': 'text/xml' });
  res.end(twiml.toString());

});

http.createServer(app).listen(1337, () => {
  console.log('Express server listening on port 1337');
});

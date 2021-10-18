const express = require("express");
const cors = require("cors");
const { from } = require("responselike");

const app = express();
app.use(express.json())

// app.use(cors());
 const myLogger = (req, res, next) => {
  const visitTime = new Date();
  console.log({"visited": req.url, "visitTime": visitTime.toLocaleString()});
  next();
};
app.use(myLogger);

const welcomeMessage = {
  id: 0,
  from: "Bart",
  text: "Welcome to CYF chat system!",
  timeSent: new Date()
};

//This array is our "data store".
//We will start with one message in the array.
//Note: messages will be lost when Glitch restarts our server.
const messages = [welcomeMessage];

app.get("/", function (request, response) {
  response.sendFile(__dirname + "/index.html");
});
app.get("/messages", (req,res)=>{
  res.send(messages)
})
app.get("/messages/id/:id", (req, res) =>{
  const id = parseInt(req.params.id)
  const message = messages.find(mes => mes.id === id)
  res.send(message)
  // if si devuelve mensaje y sino error
})
app.get("/messages/latest", (req,res)=>{
const last10Message = messages.slice(-10)

res.status(200).send(last10Message)
})

app.post("/messages", (req,res)=>{
  const from = req.body.from;
  const text = req.body.text;
  
  if (text == "" && from == ""){
     res.status(400).send({error: "from and text are missing"})
  } else if (text == "" && from){
    res.status(400).send({error: "There is no text in your message"})
  } else if (text && from == ""){
    res.status(400).send({error: "You forgot to say who is sending the message"})
  }
  const message = {
    id: messages.length,
    from: req.body.from,
    text: req.body.text,
    timeSent: new Date()
   }
   messages.push(message)
  res.send("message added")
})

app.delete("/messages/:id", (req,res)=>{
  const id = parseInt(req.params.id)
  console.log("id: ", id);
const index = messages.findIndex(mes => mes.id === id)
messages.splice(index, 1)
res.send(`id ${id} was deleted`)
})
app.put("/messages/:id", (req, res)=>{
  const messageId = parseInt(req.params.id);
  let updatedMessage = req.body;
 
  let message = messages.find((message) => message.id === messageId);
  if (!message) {
    res.status(404).send("This message does not exist");
    return;
  } else if (updatedMessage.text == null || updatedMessage.from == null){
    res.status(400).send("Some fields are empty");
    return
 } 
 console.log(updatedMessage);

   message.from = updatedMessage.from;
   message.text = updatedMessage.text;
   timeSent = message.timeSent
   res.status(201).send(updatedMessage);
   
});



app.get("/messages/search/:text", (req,res) =>{
  const text = req.params.text.toLowerCase();
  const findMessage = messages.filter((mes) => mes.text.toLowerCase().includes(text) || mes.from.toLowerCase().includes(text))
  if (findMessage.length > 0) {
    return res.status(200).send(findMessage)
  } else { 
    return res.status(400).send("message not found")}
  }
)
///messages/search?text=express
app.listen(3000, () => {
   console.log("Listening on port 3000")
  });

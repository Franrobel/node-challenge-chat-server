const express = require("express");
const cors = require("cors");
const { from } = require("responselike");

const app = express();
app.use(express.json())

app.use(cors());

const welcomeMessage = {
  id: 0,
  from: "Bart",
  text: "Welcome to CYF chat system!",
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
app.get("/messages/:id", (req, res) =>{
  const id = parseInt(req.params.id)
 const message = messages.find(mes => mes.id === id)
  res.send(message)
})

app.post("/messages", (req,res)=>{
  const message = {
    id: messages.length,
    from: req.body.from,
    text: req.body.text
   }
   messages.push(message)
  res.send("message added")
})

app.delete("/messages/:id", (req,res)=>{
  const id = parseInt(req.params.id)
const index = messages.findIndex(mes => mes.id === id)
messages.splice(index, 1)
res.send({from: "deleted"})
})
app.listen(3000, () => {
   console.log("Listening on port 3000")
  });

const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(()=>{
    console.log("Connected to DB successfully")
}).catch(()=>{
    console.log("connection failed")
})

const credentials = mongoose.model("credentials",{},"passkey");


app.post("/sendemail", function (req, res) {
    var msg = req.body.msg;
    var emailList = req.body.emailList;
    var subject = req.body.subject;

    credentials.find().then((data)=>{
        console.log(data[0].toJSON())
    
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: data[0].toJSON().user,
                pass: data[0].toJSON().pass,
            },
        });
    
        new Promise(async function(resolve,reject)
        {
            try{
                for (var i = 0; i < emailList.length; i++) {
                   await transporter.sendMail(
                        {
                            from: "chandrusounthirarajan@gmail.com",
                            to: emailList[i],
                            subject: subject,
                            text: msg,
                        }
                    )
                    console.log("email sent to :" + emailList[i])
                }
                resolve("Success")
            }
            catch(error)
            {
                reject("Failed")
            }
            
        }).then(function(){
            res.send(true)
        }).catch(function(){
            res.send(false)
        })
        
    }).catch((error)=>{
        console.log(error)
    })
    
})

app.listen(5000, function () {
    console.log("server started ...")
});
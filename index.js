const express= require('express');
const app = express();
const bodyparser= require('body-parser');
const cors= require('cors');
const mongoClient=require("mongodb");
const url="mongodb+srv://Ashwin:Ashwin@16@cluster0-ghy7c.mongodb.net/test?retryWrites=true&w=majority";

app.use(cors())
app.use(bodyparser.json());

app.use(bodyparser.urlencoded({extended: true}));
app.set('port',process.env.Port)

app.post('/urlsaving',function(req,res){
   
    var minm = 1000; 
    var maxm = 9999; 
    shorturl1=Math.floor(Math.random() * (maxm - minm + 1)) + minm;
    //storing data in db
   
   mongoClient.connect(url,function(err,client){
     if(err) throw err;
     var db = client.db("urldb");
     db.collection("urls").findOne({shorturl:shorturl1},function(err,data){
         if(data==null){
            req.body.shorturl=shorturl1;
            db.collection("urls").insertOne(req.body,function(err,data){
                if(err) throw err;
                client.close();
                res.send(data);
              })
        }
     })
     
   })

    
   });

app.get("/urlsaving/:id",function(req,res){
    var name=parseInt(req.params.id);
    mongoClient.connect(url,function(err,client){
        if(err) throw err;
        var db = client.db("urldb");
       db.collection("urls").findOne({shorturl : name},function(err,data){
            if(err) throw err;
            client.close();
            res.send(data);
        })

   })
})

  

app.listen(app.get('port'));
var express = require('express');
var router = express.Router();

var mongo = require('mongodb');
var MongoClient = mongo.MongoClient;

var url = 'mongodb://localhost:27017';
var dbName = 'mydb';
const title="My Application For Mongo";


router.get('/',(req,res,next)=>{
  
    MongoClient.connect(url,function(err,client){
        const db = client.db(dbName);
        console.log("Connected successfully to server");

        db.collection("customers").find({}).toArray(function(err,result){
            console.log(result);
            res.render('customer/list',{title:title,customers:result});
        });

        client.close();
    });

});

router.get('/new',(req,res,next)=>{
    res.render('customer/new',{});
});

router.post('/store',(req,res,next)=>{

    //res.send(req.body);

    MongoClient.connect(url,function(err,client){

        const db = client.db(dbName);
    
        console.log("Connected successfully to server");
    
        let cust = req.body;
    
        db.collection("customers").save(cust,function(err,result){
          res.redirect('/customer');
        });
    
        client.close();
    });

});

router.get('/edit/:id',(req,res,next)=>{
    //res.send(req.params);

    MongoClient.connect(url,function(err,client){

        const db = client.db(dbName);
    
        console.log("Connected successfully to server");
    
        //Declare the objectId
        let id=mongo.ObjectId(req.params.id);
    
        db.collection("customers").findOne({_id:id},(err,result)=>{
          //res.send(result);
          res.render('customer/edit',{customer:result});
        });
    
      
      });

});

router.post('/update',(req,res,next)=>{

    MongoClient.connect(url,function(err,client){

        const db = client.db(dbName);
    
        let id = mongo.ObjectId(req.body._id);
    
        //console.log(id)
    
        //cant update _id
        delete req.body._id;

        let callback=(err,result)=>{
            res.redirect('/customer');
        }
    
        db.collection("customers").updateOne({"_id":id},{$set:req.body},{upsert:true},callback);
    
        client.close();
      });
});

router.get('/confirm_delete/:id',(req,res,next)=>{
    res.render('customer/delete_confirmation',{_id:req.params.id});
});

router.post('/delete',(req,res,next)=>{

    //res.send(req.body)

    MongoClient.connect(url,function(err,client){

        const db = client.db(dbName);
    
        let id = mongo.ObjectId(req.body._id);
    
        console.log(id)
    
        db.collection("customers").deleteOne({_id:id},(err,result)=>{
          res.redirect('/customer');
        });
    
        client.close();

      });

});

//expose all methods from this file
module.exports = router;
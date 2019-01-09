var express = require('express');
var router = express.Router();

var mongo = require('mongodb');
var MongoClient = mongo.MongoClient;

var url = 'mongodb://localhost:27017';
var dbName = 'mydb';
const title="My Application For Mongo";

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: title, name:'Jurin Liyun' });
});

router.get('/connectdb',function(req,res,next){

  var data={}
  
  MongoClient.connect(url,function(err,client){
    const db = client.db(dbName);
    console.log("Connected successfully to server");

    db.collection("customers").find({}).toArray(function(err,response){
        data = response;
        console.log(data);
       return res.render('customer/list',{title:title,customers:data});
    });

    client.close();
  })


  //res.json(data);
});


router.get('/create_customer',function(req,res,next){
  res.render('customer/new',{});
});

router.post('/save_customer',function(req,res,next){
  delete req.body.Save;

  //res.send(req.body);

  

  MongoClient.connect(url,function(err,client){

    const db = client.db(dbName);

    console.log("Connected successfully to server");

    let cust = req.body;

    db.collection("customers").save(cust,function(err,result){
      res.redirect('/connectdb');
    });

    client.close();
  })


});


router.get('/edit_customer/:id',(req,res,next)=>{

  //res.send(req.params.id);

  MongoClient.connect(url,function(err,client){

    const db = client.db(dbName);

    console.log("Connected successfully to server");

    //Declare the objectId
    let id=mongo.ObjectId(req.params.id);

    db.collection("customers").findOne({_id:id},function(err,result){
      //res.send(result);
      res.render('customer/edit',{customer:result});
    });

  
  });

});

router.post('/update_customer',(req,res,next)=>{

  //res.send(req.body);

  MongoClient.connect(url,function(err,client){

    const db = client.db(dbName);

    let id = mongo.ObjectId(req.body._id);

    console.log(id)

    //cant update _id
    delete req.body._id;

    db.collection("customers").updateOne({"_id":id},{$set:req.body},{upsert:true},function(err,result){
      res.redirect('/connectdb');
    });

    client.close();
  });

});

router.get('/confirm_delete/:id',function(req,res,next){
  res.render('customer/delete_confirmation',{customer:{_id:req.params.id}});
});

router.post('/delete_customer',(req,res,next)=>{
  MongoClient.connect(url,function(err,client){

    const db = client.db(dbName);

    let id = mongo.ObjectId(req.body._id);

    console.log(id)

    db.collection("customers").deleteOne({_id:id},function(err,result){
      res.redirect('/connectdb');
    });

    client.close();
  });
})

module.exports = router;

const express = require("express"); 
var router =express.Router();
const path = require('path');
const exphbs = require('express-handlebars');
const hbs = require('hbs');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const { text } = require("body-parser");
mongoose.connect('mongodb://localhost/blog', {useNewUrlParser: true, useUnifiedTopology: true});
const app = express();
const port = 80;

var blogschema = new mongoose.Schema({
    blogname: {type:String},
    blogcontent:{type:String},
  });

const U = mongoose.model('user', blogschema);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

//endpoints
app.get('/',(req,res)=>{
    res.render('addoredit',{viewTitle:"Insert blog"});
})
app.post('/',(req,res)=>{
    //    console.log(req.body);
      if(req.body._id=='')
      insertblog(req,res);
      else
      updateblog(req,res);
    })
    function insertblog(req,res){
        var u =new U();
        u.blogname=req.body.blogname;
        u.blogcontent=req.body.blogcontent;
        u.save((err,doc)=>{
            if(!err)
            res.redirect('/list');
            else
            {
                console.log("error during blog insertion :"+err);
            }
        });
   }
   function updateblog(req,res)
   {
       U.findOneAndUpdate({_id:req.body._id},req.body,{new:true},(err,doc)=>{
           if(!err)
           res.redirect('/list')
           else
           console.log('error during update: '+err);
       })
   }

  app.get('/list',(req,res)=>{
    U.find({}).lean()
  // execute query
  .exec(function(err, body) {
    //Some code
    if(!err){
             
                 res.render("list",{list:body})
                // res.json(docs);
             }
             else 
             {
                 console.log("Error in retrieving blog list: "+err);
             }
    
    
  });

    })


    app.get('/update/:id',(req,res)=>{
        U.findById({_id:req.params.id}).lean()
        // execute query
        .exec(function(err, docs) {
          //Some code
          if(!err)
            {   
                 console.log(docs)
                res.render('addoredit',{viewTitle:"Update blog", u:docs});
            }
          
        });

    })

    app.get('/delete/:id',(req,res)=>{
        U.findByIdAndRemove(req.params.id,(err,docs)=>{
            if(!err)
            {   
                res.redirect('/list')
            }
            else
            console.log('error in delete:'+err);
        })
    })


app.listen(port, () => {
    console.log(`application started successfully on port ${port}`);
})
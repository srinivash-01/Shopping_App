const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
let alert = require('alert');
const {LocalStorage} = require("node-localstorage");
var localStorage = new LocalStorage('./scratch');
// const popup = require('popups');

const app = express();

app.use(express.static("public"));

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));

mongoose.connect('mongodb://localhost:27017/ShopingApp');


var validateEmail = function(email) {
  var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email)
};

var EmailSchema = {
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    required: 'Email address is required',
    validate: [validateEmail, 'Please fill a valid email address'],
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  password: {
    type: String,
    required: true
  }
};


const User = mongoose.model("User", EmailSchema);

let Found_email = [];







let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
  console.log("Server started on port 3000");
});

app.get("/", function(req, res) {
  let email = Found_email[0];
  // localStorage.setItem('local_email', email);
localStorage.setItem('local_email', email);
  console.log(localStorage.getItem('local_email'));
  res.render("home",{
    email: email
  });
});
app.get("/signup", function(req, res) {
  res.render("signup");
});


app.post("/signup", function(req, res) {
      res.redirect("/signup");
      });

app.post("/signin", function(req, res){
  const email = req.body.email;
  const pass = req.body.pass;
  const re_entr_pass = req.body.re_entr_pass;
  if(email != null && pass != null && re_entr_pass!= null && re_entr_pass === pass){
    const user = new User({
      email: email,
      password: pass
    });

    User.findOne({email: email}, function(err, foundList){
      if(!foundList || foundList.email != email){
        user.save(function(err) {
          if(err){
            console.log(err);
            alert("Please Verify the details given below");
          }else{
            alert("Successfully saved Email and password");
            res.redirect("/");
            Found_email.push(email);
          };
          });
      }else{
        alert("User Already Exists");
      };
    });
  }else{

    alert("Please enter the valid input")
    // popup.alert({content: 'Please enter the valid input'});
  };

});

const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");

const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.get("/",function(req,res){
  res.sendFile( __dirname + "/signup.html");
});

app.post("/",function(req,res){
  const fName = req.body.firstName;
  const lName = req.body.lastName;
  const email = req.body.yourEmail;

  const data = {
    members : [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME:fName,
          LNAME:lName
        }
      }
    ]
  };
  const jsonData = JSON.stringify(data);
  const url = 'https://us20.api.mailchimp.com/3.0/lists/7ab1f6f2b9/?skip_merge_validation=false&skip_duplicate_check=false';
  const options = {
    method: 'POST',
    auth: 'user:e3ffa8bf0bc5a54a31a0dd09c512bbcc-us20'
  };
  const request = https.request(url, options, function(response){
    if (response.statusCode===200){
      res.sendFile(__dirname + "/success.html");
    }
    else{
      res.sendFile(__dirname + "/failure.html")
    }
    response.on('data', function(data){
    console.log(JSON.parse(data));
  });
});

// req.on('error', (e) => {
//   console.error(e);
// });
request.write(jsonData);
request.end();
});

  app.post("/failure",function(req,res){
    res.redirect("/");
  })

app.listen(process.env.PORT || 3000,function(){
  console.log("Server is running on port 3000.");
});
// Api Key:e3ffa8bf0bc5a54a31a0dd09c512bbcc-us20
// Audience id: 7ab1f6f2b9.
//
// curl -X POST \
//
//   --user "anystring:$e3ffa8bf0bc5a54a31a0dd09c512bbcc-us20"
//   -d '{"members":[],"update_existing":false}'




// curl -X POST \
//   'https://${dc}.api.mailchimp.com/3.0/lists/7ab1f6f2b9/members?skip_merge_validation=<SOME_BOOLEAN_VALUE>' \
//   --user "anystring:${apikey}"' \
//   -d '{"email_address":"","email_type":"","status":"subscribed","merge_fields":{},"interests":{},"language":"","vip":false,"location":{"latitude":0,"longitude":0},"marketing_permissions":[],"ip_signup":"","timestamp_signup":"","ip_opt":"","timestamp_opt":"","tags":[]}'

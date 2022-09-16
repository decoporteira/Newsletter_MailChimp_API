const mailchimp = require("@mailchimp/mailchimp_marketing");


const express = require("express");
const bodyParser = require("body-parser");
const app = express();



app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));

app.listen(process.env.PORT||3000,function () {
  console.log("Server is running at port 3000");
 });



mailchimp.setConfig({
  apiKey: "e57bbd097c1ece3a376a87f1595769c2-us13",
  server: "us13",
});
////// tudo abaixo diso ////
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

mailchimp.setConfig({
  apiKey: "e57bbd097c1ece3a376a87f1595769c2-us13",
  server: "us13",
});

app.post("/", function(req,res) {
  const firstName = req.body.firstName;
  const secondName = req.body.secondName;
  const email = req.body.email;

  const listId = "7a1bc4baf7";

  const subscribingUser = {
    firstName: firstName,
    lastName: secondName,
    email: email 
  };

  async function run() {
    const response = await mailchimp.lists.addListMember(listId, {
      email_address: subscribingUser.email,
      status: "subscribed",
      merge_fields: {
        FNAME: subscribingUser.firstName,
        LNAME: subscribingUser.lastName
      }
    });
   
    res.sendFile(__dirname + "/success.html")
    console.log(
    `Successfully added contact as an audience member. The contact's id is ${
    response.id
    }.`
  );
  }
  //Running the function and catching the errors (if any)
    // ************************THIS IS THE CODE THAT NEEDS TO BE ADDED FOR THE NEXT LECTURE*************************
    // So the catch statement is executed when there is an error so if anything goes wrong the code in the catch code is executed. In the catch block we're sending back the failure page. This means if anything goes wrong send the faliure page
    run().catch(e => res.sendFile(__dirname + "/failure.html"));
  });

  app.post("/failure", function(req,res) {
    res.redirect("/")
  })




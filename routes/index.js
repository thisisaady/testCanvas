var crypto = require("crypto");
var configuration = require("../configuration");

/*
 * GET home page.
 */

exports.index = function(req, res){
    res.send('hi');
    //var testData = require("../test-session-object.json");
    //res.render('index', { title: "Test User", signedRequestJson: JSON.stringify(testData) });
};

exports.authenticate = function(req, res){    
    var bodyArray = req.body.signed_request.split(".");
    var consumerSecret = bodyArray[0];
    var encoded_envelope = bodyArray[1];

    var check = crypto.createHmac("sha256", configuration.CONSUMER_SECRET).update(encoded_envelope).digest("base64");

    if (check === consumerSecret) {

        var envelope = JSON.parse(new Buffer(encoded_envelope, "base64").toString("ascii"));
        req.session.salesforce = envelope;
        console.log("got the session object:");
        console.log(envelope);
        res.render('index', { title: envelope.context.user.userName, name: envelope.context.user.firstName, signedRequestJson : JSON.stringify(envelope) });
    }
};
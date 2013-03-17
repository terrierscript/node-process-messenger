var ProcessMessenger = require("../index.js");

var pm = new ProcessMessenger()

//var pm = require("../index.js").child
pm.on("add", function(reciveMessage, done){
  //console.log(reciveMessage);
  setTimeout(function(){
    var result = reciveMessage.a +  reciveMessage.b
    done(result);
  }, reciveMessage.wait);
})

pm.on("ping", function(msg, done){
  done("pong");
})
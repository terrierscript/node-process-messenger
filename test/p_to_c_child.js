var ProcessMessenger = require("../index.js");
var pm = ProcessMessenger()

//var pm = require("../index.js").child
pm.on("add", function(reciveMessage, done){
  setTimeout(function(){
    var result = reciveMessage.a +  reciveMessage.b
    done(result);
  }, reciveMessage.wait);
})

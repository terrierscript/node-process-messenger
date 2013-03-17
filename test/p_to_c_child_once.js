var ProcessMessenger = require("../index.js");
var pm = new ProcessMessenger()

//var pm = require("../index.js").child
pm.once("add", function(reciveMessage, done){
  setTimeout(function(){
    var result = reciveMessage.a +  reciveMessage.b
    done(result);
  }, reciveMessage.wait);
})

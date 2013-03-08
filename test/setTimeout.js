var pm = require("../index.js")()
//var pm = require("../index.js").child
pm.on(function(msg, done){
  setTimeout(function(){
    done("result");
  }, msg);
})
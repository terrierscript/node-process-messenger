var ProcessMessanger = require("../../index.js")

var pm = new ProcessMessanger()
pm.on("ping", function(msg, done){
  console.log("[child] recive ping");
  done("pong");
})
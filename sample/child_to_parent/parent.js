var ProcessMessanger = require("../../index.js")
var fork = require("child_process").fork
var child = fork("./sample/child_to_parent/child.js")
var pm = new ProcessMessanger(child)
pm.on("ping", function(msg, done){
  console.log("[parent] recive ping");
  done("pong");
})

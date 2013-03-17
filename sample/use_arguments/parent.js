var ProcessMessanger = require("../../index.js")
var fork = require("child_process").fork
var child = fork("./sample/use_arguments/child.js")
var pm = new ProcessMessanger(child)
pm.send("add",{ a: 1, b: 2}, function(result){
  console.log("[parent] child result:"+result);
  process.exit(0)
})

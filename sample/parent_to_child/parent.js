var ProcessMessanger = require("../../index.js")
var fork = require("child_process").fork
var child = fork("./sample/parent_to_child/child.js")
var pm = new ProcessMessanger(child)
pm.send("ping", function(result){
  console.log("[parent] child result:"+result);
  process.exit(0)
})

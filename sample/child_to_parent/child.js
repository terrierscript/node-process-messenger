var ProcessMessanger = require("../../index.js")

var pm = new ProcessMessanger()
pm.send("ping", function(result){
  console.log("[child] recive:"+result);
  process.exit(0)
})
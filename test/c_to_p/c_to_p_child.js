var ProcessMessanger = require("../../index");
var pm = ProcessMessanger()
pm.on("start", function(msg){
  pm.send("add", {a : 1, b :2}, function(result){
    pm.send("result", {add_result : result})
  })
})

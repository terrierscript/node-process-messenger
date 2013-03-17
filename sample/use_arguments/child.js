var ProcessMessanger = require("../../index.js")

var pm = new ProcessMessanger()
pm.on("add", function(args, done){
  done(args.a + args.b)
})
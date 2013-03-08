var fork = require("child_process").fork
describe('what?', function () {
  it('should do what?', function (done) {
    var child = fork("./test/setTimeout.js")
    var pm = require("../index.js")(child);
    
    
    pm.send( 100, function(){
      console.log("A-100");
    })
    
    var pm2 = require("../index.js")(child);
    pm2.send(10, function(){
      console.log("B-10");
    })
    
    setTimeout(function(){
      done()
    },1999);
  });
});
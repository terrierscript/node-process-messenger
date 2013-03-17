var fork = require("child_process").fork
var assert = require("assert")
var ProcessMessenger = require("../");

var child = fork("./test/c_to_p/c_to_p_child.js")

var pm = ProcessMessenger(child);
describe('child to parent',function(){
  it('recive sample result',function(mochaDone){
    pm.on("add", function(msg, done){
      done(msg.a + msg.b);
    })
    pm.on("result", function(msg, done){
      assert.equal(msg.add_result, 3);
      mochaDone();
    })
    pm.send("start")
  })
})



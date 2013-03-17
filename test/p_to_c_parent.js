var fork = require("child_process").fork
var async = require("async")
var assert = require("assert")
describe('messaging', function () {
  
  it('should recive without args', function (done) {
    var child = fork("./test/p_to_c_child.js")
    var ProcessMessanger = require("../index.js")
    var pm =  ProcessMessanger(child)
    pm.send("ping", function(result){
      assert.equal(result, "pong");
      done();
    });
  })
  it('should recive once', function (done) {
    var child = fork("./test/p_to_c_child_once.js")
    var ProcessMessanger = require("../index.js")
    var pm =  ProcessMessanger(child)
    var msg = {
      a : 1,
      b : 2,
      wait : 100
    }
    pm.send("add", msg, function(result){
      assert.equal(result, 3);
      pm.send("add", function(){
        fail("Once event run twice")
      })
    });
    setTimeout(function(){ // success when not fire recive event
      done()
    },1000);
  })
  
  it('should recive some result', function (done) {
    var child = fork("./test/p_to_c_child.js")
    var ProcessMessanger = require("../index.js")
    var pm =  ProcessMessanger(child);
    //pm.debug = true;
    var pm2 = ProcessMessanger(child);
    
    async.parallel([
      function(next){
        var msg = {
          a : 1,
          b : 2,
          wait : 100
        }
        pm.send("add", msg, function(result){
          assert.equal(result, 3);
          next();
        })
      },
      function(next){
        var msg = {
          a : 10,
          b : 20,
          wait : 10
        }
        pm2.send("add", msg, function(result){
          assert.equal(result, 30);
          next();
        })
      }
    ], function(){
      done();
    })
  });
});
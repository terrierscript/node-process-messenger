var fork = require("child_process").fork
var async = require("async")
var assert = require("assert")
var ProcessMessanger = require("../index.js")
describe('messaging', function () {
  it('same message should reverse getting FOOO', function (done) {
    /*var child = fork("./test/p_to_c_child.js")
    var pm = new ProcessMessanger(child);
    
    pm.send("add", messageA, function(result){
      
      assert.equal(result, 30)
    })
    pm.send("add", messageB, function(result){
      assert.equal(result, 3)
    })*/
    done()
  })
  it('should recive without args', function (done) {
    var child = fork("./test/p_to_c_child.js")
    var pm = new ProcessMessanger(child)
    pm.send("ping", function(result){
      assert.equal(result, "pong");
      done();
    });
  })
  it('should recive once', function (done) {
    var child = fork("./test/p_to_c_child_once.js")
    var pm = new ProcessMessanger(child)
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
    var pm = new ProcessMessanger(child);
    //pm.debug = true;
    var pm2 = new ProcessMessanger(child);
    
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
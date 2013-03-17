var fork = require("child_process").fork
var async = require("async")
var assert = require("assert")
var ProcessMessanger = require("../index.js")
describe('messaging', function () {
  it('should create key is not duplicate FOOO', function (done) {
    var __ProcessMessanger1 = require("../index.js")
    var __ProcessMessanger2 = require("../index.js")
    __ProcessMessanger1.prototype._createKey = function(){
      return "key";
    }
    __ProcessMessanger2.prototype._createKey = function(){
      return "key";
    }
    var pm1 = new __ProcessMessanger1();
    var pm2 = new __ProcessMessanger2();
    
    assert.equal(pm1.createKey(), "key");
    assert.equal(pm1.createKey(), "key_2");
    assert.equal(pm1.createKey(), "key_3");
    assert.equal(pm2.createKey(), "key_4");
    assert.equal(pm2.createKey(), "key_5");
    
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
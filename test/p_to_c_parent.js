var fork = require("child_process").fork
var async = require("async")
var assert = require("assert")
describe('what?', function () {
  it('should do what?', function (done) {
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
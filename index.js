
var Message = function(command, msg){
  var id = (new Date().getTime()+Math.random() * 10000000000000000)
  var key = this.key = id.toString(16)
  this.message = msg;
  this.serialize = function(){
    return {
      command : command,
      process_messenger_key : key,
      message : msg
    }
  }
}

var ProcessMessenger = function(sendProcess){
  this.sendProcess = sendProcess || process
  this.debug = false;
}
ProcessMessenger.prototype.log = function(msg){
  if(this.debug){
    console.log(msg);
  }
}
ProcessMessenger.prototype.send = function(command, sendMessageArgs, callback){
  if(typeof command != "string"){
    throw "Command must be string";
  }
  if(typeof sendMessageArgs == "function"){
    callback = sendMessageArgs
  }
  if(callback == null){
    callback = function(){}
  }
  
  var self = this;
  var message = new Message(command, sendMessageArgs);
  var key = message.key;
  // Add Hook Event
  
  self.log("Start send:" + key)
  var messageReciveFunc = function(response){
    self.log("Recive send:"+ key)
    if(response.process_messenger_key == key){
      self.log("Recive Success:"+ key)
      process.removeListener("message", messageReciveFunc)
      callback(response.message)
    }
  }
  this.sendProcess.on("message", messageReciveFunc)
  
  // Send
  this.sendProcess.send(message.serialize())
}

ProcessMessenger.prototype.sendProcesslistener = function(){
  return this.sendProcess.listeners("message");
}

ProcessMessenger.prototype.listenerDump = function(){
  var self = this
  this.sendProcesslistener().forEach(function(func){
    self.log(func.toString());
  })
}

ProcessMessenger.prototype.response = function(reciveMessage, responseMessage){
  var self = this;
  var responseSendMessage = {
    command : reciveMessage.command,
    process_messenger_key : reciveMessage.process_messenger_key,
    message : responseMessage
  }
  self.log("Response message")
  self.sendProcess.send(responseSendMessage)
}

ProcessMessenger.prototype.once = function(command, reciveFunc){
  this._hook(command, true, reciveFunc)
}
ProcessMessenger.prototype.on = function(command, reciveFunc){
  this._hook(command, false, reciveFunc)
}
ProcessMessenger.prototype._hook = function(command, once, reciveFunc){
  var self = this;
  if(typeof command != "string"){
    throw "Command must be string";
  }
  if(!reciveFunc){
    alterFunc = function(message,done){
      done(message);
    }
  }
  self.log("Set Recive event")
  var hookFunc = once ? "once" : "on";
  self.sendProcess[hookFunc]("message", function(reciveMessage){
    if(reciveMessage.command != command){
      return;
    }
    self.log("Recive message")
    reciveFunc(reciveMessage.message,  function(responseMessage){
      self.response(reciveMessage, responseMessage)
    });
  })
}

module.exports = function(targetProcess){
  return new ProcessMessenger(targetProcess);
}
module.exports.ProcessMessenger = ProcessMessenger
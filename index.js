var _sendingMessageKeys = {}
var ProcessMessenger = function(sendProcess){
  this.sendProcess = sendProcess || process
  this.debug = false;
}

ProcessMessenger.prototype.createMessage = function(command, key, msg){
  return {
    command : command,
    key : key,
    message : msg
  }
}

ProcessMessenger.prototype.createResponseMessage = function(reciveMessage, msg){
  return {
    command : reciveMessage.command,
    key : reciveMessage.key,
    message : msg
  }
}

ProcessMessenger.prototype.log = function(msg){
  if(this.debug){
    console.log(msg);
  }
}
ProcessMessenger.prototype._createKey = function(){
  var rand = Math.round(Math.random() * 100000);
  var time = new Date().getTime();
  return time +"_"+ rand
}
ProcessMessenger.prototype.createKey = function(){
  var _key = this._createKey();
  var key = _key
  if(_sendingMessageKeys[key]){
    key = key + "_" + _sendingMessageKeys[_key];
  }else{
    _sendingMessageKeys[_key] = 1;
  }
  
  _sendingMessageKeys[_key]++;
  return key;
}
ProcessMessenger.prototype.send = function(command, sendMessageArgs, callback){
  if(typeof command != "string"){
    throw new Error("Command must be string");
  }
  if(typeof sendMessageArgs == "function"){
    callback = sendMessageArgs
  }
  
  if(callback == null){
    callback = function(){}
  }
  
  var self = this;
  
  //create key
  var key = this.createKey();
 
  
  var message = this.createMessage(command, key, sendMessageArgs)
  
  // Add Hook Event
  
  self.log("Start send:" + key)
  var messageReciveFunc = function(response){
    self.log("Recive send:"+ key)
    if(response.key != key){
      self.log("Incorrect key:"+ key + "," + response.key)
      return;
    }
    if(response.command != command){
      self.log("Incorrect command:"+ command + "," + response.command)
      return;
    }
    
    self.log("Recive Success:"+ key)
    process.removeListener("message", messageReciveFunc)
    callback(response.message)
  }
  this.sendProcess.on("message", messageReciveFunc)
  
  // Send
  this.sendProcess.send(message)
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
  var responseSendMessage = this.createResponseMessage(reciveMessage, responseMessage)
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
  var onMessage = function(reciveMessage){
    
    if(reciveMessage.command != command){
      return;
    }
    self.log("Recive message")
    reciveFunc(reciveMessage.message,  function(responseMessage){
      self.response(reciveMessage, responseMessage)
    });
    if(once){
      self.sendProcess.removeListener("message",onMessage);
    }
  }
  self.sendProcess.on("message", onMessage);
}

module.exports = ProcessMessenger

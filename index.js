var ProcessMessenger = function(targetProcess){
  this.process = targetProcess || process;
  this.key = new Date().getTime() +"_"+Math.random();
}
ProcessMessenger.prototype.send = function(sendMessage, callback){
  if(callback == null){
    callback = function(){}
  }
  var self = this;
  this.process.once("message", function(response){
    
    if(response.process_messenger_key == self.key){
      callback(response.message)
    }
  })
  var message = {
    process_messenger_key : this.key,
    message : sendMessage
  }
  console.log("SEND ");
  console.log(message);
  this.process.send(message)
}

ProcessMessenger.prototype.on = function(func){
  var reciveMessage;
  var self = this;
  var done = function(result){
    self.response(reciveMessage, result)
  }
  process.on("message", function(message){
    reciveMessage = message;
    func(message.message, done);
  })
}
/*

 */
ProcessMessenger.prototype.response = function(reciveMessage, rawMessage){
  var self = this;
  var responseMessage = {
    process_messenger_key : reciveMessage.process_messenger_key,
    message : rawMessage
  }
  
  process.send(responseMessage)
}

module.exports = function(process){
  return new ProcessMessenger(process);
}
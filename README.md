# Process Messenger

Simple wrapper that `child_process`'s messaging node.js

## Documentation

### ProcessaMessenger([process])
* process  `process` object. Generally this is result for`child_process.fork`.

Object for process messaging

Constructor get target process object.

In parent process:

```js
var ProcessMessanger = require("process-messenger")v
var fork = require("child_process").fork
var child = fork("./sample/child.js")
var pm = new ProcessMessanger(child)
```

And child process

```js
var ProcessMessanger = require("process-messenger")v
var pm = new ProcessMessanger()
```

### ProcessMessenger.send(command, [args], [callback])

Send message to target process.

* command - `string`.
* args - `Object`. must serializable.
* callback - `Function`


```js
pm.send("ping", function(result){
  console.log("result:"+result);
})
```

If you want parameters. set `args`
```js
pm.send("add",{a: 1, b: 2} function(result){
  console.log("result:"+result);
})
```

If you not use callback, can omit callback,

```js
pm.send("kill")
```

### ProcessMessenger.on(command, callback)

Hook event that recive same `command`'s message sending.

* command - `string`. Fire when that is same as other `ProcessMessenger.send`
* callback - `Fucntion(args, done)`. `args` is set `ProcessMessenger.send`'s `args`. default `undefined`. If you want return to sending process, call `done(result)`.

```js
pm.on("add", function(args, done){
  done(args.a + args.b)
})
```

### ProcessMessenger.once(command, callback)

Recive message at once. (Basically behabor is same as `ProcessMessenger.on`)

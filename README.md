# deferred
A mini deferred plugin, having just what you need.

This module is published with UMD support, globally accessible via $def variable. It is also available on npm named mini-deferred.

NPM Installation
```js
npm install mini-deferred --save
```
```js
var $def = require('mini-deferred');
```

Usage
**$def method**
```js
var promise = $def(function(resolve,reject,notify){
        $.ajax({
           url : "/api",
           success : function(data){
              //do something
              resolve(data);
           },
           error : reject,
           progress : notify
        })
});

promise.then(function(data){
   //do something with success data
   return data + "Some new data";
},function(err){
    //handle error
},function(value){
    //display progress
})
//chain promises
.then(function(data){
   //do something else with success data
   return data + "Some new data";
},function(err){
    //handle error
},function(value){
    //display progress
})
```

**Creating a deferred object $def.defer()**
```js
var defer = $def.defer();
$.ajax({
       url : "/api2",
       success : function(data){
          //do something
          defer.resolve(data);
       },
       error : defer.reject,
       progress : defer.notify
    })

var promise2 = defer.promise();
```

**Doing something after multiple promise $def.when()**
```js
  $def.when(promise,promise2).then(function(data){
    //data will be arry of resolve data
    //[promise 1 resolve data, promise 2 resolve data]
  },function(err){
    //handle error
  })
```

**promise.then()**
```js
promise.then(onSuccess,onError,onProgress);
```

**promise.done()**
```js
promise.done(onSuccess);
```

**promise.fail()**
```js
promise.fail(onError);
```

**promise.progress()**
```js
promise.progress(onProgress);
```

**promise.always()**
```js
promise.always(function(data){
  // comes here whether it's success or fail
});
```

**promise.state()** `// return state of promise`

/*
    deferred.js v 0.1.0
    Author: Sudhanshu Yadav
    Copyright (c) 2015 Sudhanshu Yadav - ignitersworld.com , released under the MIT license.
    https://github.com/s-yadav/deferred
*/

;(function() {
    function Deferred() {
        //arrays to maintain the promise callbacks
        var doneCallback = [];
        var failCallback = [];
        var progressCallback = [];

        //state of deferred
        var state = "pending";

        //promise object
        var promise = {
            state: function() {
                return state;
            },
            then: function(onResolve, onReject, onProgress) {
                if (onResolve) doneCallback.push(onResolve);
                if (onReject) failCallback.push(onReject);
                if (onProgress) progressCallback.push(onProgress);
                return this;
            },
            done: function(onResolve) {
                return this.then(onResolve);
            },
            fail: function(onReject) {
                return this.then(null, onReject);
            },
            progress: function(onProgress) {
                return this.then(null, null, onReject);
            },
            always: function(callback) {
                return this.then(callback, callback);
            }
        }

        //deferred object
        var defer = Object.create(promise);

        defer.resolve = function(value) {
            state = "resolved";
            for (var i = 0, ln = doneCallback.length; i < ln; i++) {
                var callback = doneCallback[i];
                value = callback(value);
            }
        }

        defer.reject = function(reason) {
            state = "rejected";
            for (var i = 0, ln = failCallback.length; i < ln; i++) {
                var callback = failCallback[i];
                reason = callback(reason);
            }
        }

        defer.notify = function(value) {
            for (var i = 0, ln = progressCallback.length; i < ln; i++) {
                var callback = progressCallback[i];
                value = callback(data);
            }
        }

        defer.promise = function() {
            return promise;
        }

        return defer;
    }


    var $def = function(callback) {
        var defer = Deferred();
        callback(defer.resolve, defer.reject, defer.notify);
        return defer.promise();
    }

    $def.defer = function() {
        return Deferred();
    }

    $def.when = function() {
        var promises = Array.prototype.slice.call(arguments);
        var defer = Deferred(),
            rejected,
            successCounter = 0;
        promisesData = [];
        for (var i = 0, ln = promises.length; i < ln; i++) {
            (function(i) {
                promises[i].then(function(data) {
                    if (rejected) return;
                    //maintain a count and when all are resolved resolve when promise
                    successCounter++;
                    promisesData[i] = data;
                    if (successCounter == promises.length) {
                        defer.resolve(promisesData);
                    }
                }, function(data) {
                    //reject if any of promise fails
                    defer.reject(data);
                    rejected = true;
                });
            }(i));
        }
        return defer.promise();
    };

    var global = Function('return this')() || (42, eval)('this');
    global.$def = $def;
}());
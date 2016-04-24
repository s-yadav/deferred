/*
    deferred.js v 0.2.0
    Author: Sudhanshu Yadav
    Copyright (c) 2015,2016 Sudhanshu Yadav - ignitersworld.com , released under the MIT license.
    https://github.com/s-yadav/deferred
*/
(function(factory) {
    const root = Function('return this')() || (42, eval)('this');

    if (typeof define === "function" && define.amd) {
        define([], function() {
            return (root.$def = factory());
        });
    } else if (typeof module === "object" && module.exports) {
        module.exports = (root.$def = factory());
    } else {
        root.$def = factory(root.postal);
    }
}(function() {
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
                //add a new Deferred
                var defer = Deferred();

                if (onResolve) doneCallback.push({
                    callback: onResolve,
                    defer: defer
                });
                if (onReject) failCallback.push({
                    callback: onReject,
                    defer: defer
                });
                if (onProgress) progressCallback.push({
                    callback: onProgress,
                    defer: defer
                });
                return defer.promise();
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

        function resetCallbacks() {
            doneCallback = [];
            failCallback = [];
            progressCallback = [];
        }

        defer.resolve = function(value) {
            state = "resolved";
            doneCallback.forEach(function(callbackObj) {
                var updatedValue = callbackObj.callback(value);
                callbackObj.defer.resolve(updatedValue);
            });
            resetCallbacks();
        }

        defer.reject = function(reason) {
            state = "rejected";
            failCallback.forEach(function(callbackObj) {
                var updatedReason = callbackObj.callback(reason);
                callbackObj.defer.reject(updatedReason);
            });
            resetCallbacks();
        }

        defer.notify = function(value) {
            progressCallback.forEach(function(callbackObj) {
                var updatedReason = callbackObj.callback(reason);
                callbackObj.defer.notify(updatedReason);
            });
        }

        defer.promise = function() {
            return promise;
        }

        return defer;
    }


    var $def = function(callback) {
        var defer = Deferred();
        setTimeout(() => {
            callback(defer.resolve, defer.reject, defer.notify);
        }, 0);
        return defer.promise();
    }

    $def.defer = function() {
        return Deferred();
    }

    $def.when = function() {
        var promises = Array.prototype.slice.call(arguments);
        var defer = Deferred(),
            rejected,
            successCounter = 0,
            promisesData = [];

        promises.forEach(function(promise, idx) {
            promise.then(function(data) {
                if (rejected) return;
                //maintain a count and when all are resolved resolve when promise
                successCounter++;
                promisesData[idx] = data;
                if (successCounter == promises.length) {
                    defer.resolve(promisesData);
                }
            }, function(data) {
                //reject if any of promise fails
                defer.reject(data);
                rejected = true;
            });
        });

        return defer.promise();
    };
    return $def;
}));

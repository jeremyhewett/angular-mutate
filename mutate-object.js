
(function(module, key) {
  'use strict';

  var isArray = function(value) {
    return Array.isArray(value);
  };

  var isEnumerable = function(value) {
    return value !== null && typeof value === 'object';
  };

  var cleanArray = function(oldArray, newArray) {
    if (newArray.length < oldArray.length) {
      oldArray.splice(newArray.length, oldArray.length - newArray.length);
    }
    return oldArray;
  };

  var cleanObj = function(oldObj, newObj) {
    for (var prop in oldObj) {
      if (oldObj.hasOwnProperty(prop) && !newObj.hasOwnProperty(prop)) {
        delete oldObj[prop];
      }
    }
  };

  var mutate = function(oldState, newState, preserveRootProps) {
    if (isEnumerable(newState)) {
      var isSrcArray = isArray(newState);
      oldState = (isEnumerable(oldState) && isArray(oldState) === isSrcArray && oldState) || (isSrcArray ? [] : {});
      if (!preserveRootProps) {
        isSrcArray ? cleanArray(oldState, newState) : cleanObj(oldState, newState);
      }
      if (isSrcArray) {
        newState.forEach(function(value, i) {
          if (oldState.length < i + 1) {
            oldState.push();
          }
          oldState[i] = mutate(oldState[i], value, false);
        });
      } else {
        for (var i in newState) {
          if (newState.hasOwnProperty(i)) {
            oldState[i] = mutate(oldState[i], newState[i], false);
          }
        }
      }
      return oldState;
    }
    return newState;
  };

  module[key] = mutate;

}(typeof exports === 'undefined'? window : module, typeof exports === 'undefined'? 'mutateObject' : 'exports'));

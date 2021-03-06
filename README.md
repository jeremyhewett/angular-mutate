[![Build Status](https://semaphoreci.com/api/v1/jeremy_hewett/mutate-object/branches/master/badge.svg)](https://semaphoreci.com/jeremy_hewett/mutate-object)

# mutate-object
Performs a deep mutation of an existing (destintation) object to equal a given (source) object. Similar to `angular.merge` but with one critical difference: the destination object will always end up equal to the source object. This means:
 1. Values that don't exist or are different in the destintation object will be added or modified.
 2. Values that are undefined in the source object **will be removed** from the destination object.
 3. A value that is an array in the source but an object in the destination (or vice versa) will not simply be mutated, because the types are different. A new instance of the correct type will be created instead.

**Note**: this is basically the exact opposite of how Redux reducers perform modifications to the state object. Instead of ensuring no mutation, `mutate-object` uses mutation wherever possible to avoid creating new objects/arrays.

## Install
**NPM**  
`npm install mutate-object`

**Bower**  
`bower install https://github.com/jeremyhewett/mutate-object.git`

### Example
```javascript
var oldState = {
  title: 'Old',
  todos: [{ id: 1, name: 'do it' }, { id: 2, name: 'do it again' }],
  users: { user1: { name: 'bob' } }
};

var newState = {
  title: 'New',
  todos: [{ id: 1, name: 'do it' }],
  users: { user1: { name: 'bob', alias: 'bobby' } }
};

var todos = oldState.todos;
var user1 = oldState.users.user1;

require('mutate-object')(oldState, newState);

//The following assertions will all be true...
expect(oldState).toEqual(newState); //Will always result in deeply equal objects.
expect(oldState).not.toBe(newState); //Will always result in a copy of the object
expect(oldState.todos).not.toBe(newState.todos); //with no shared references.
expect(oldState.todos).toBe(todos); //Will always mutate existing arrays/objects where possible
expect(oldState.user1).toBe(user1); //instead of creating new arrays/objects.
```

## Use Cases
AngularJS watches the view model and re-render the view when the associated model changes. The Redux pattern disallows any state mutation and forces any small change in the state to "bubble" up and cause all parent objects to be re-created. If a new Redux state is applied directly to an angular view model, the entire hiearchy will be re-rendered because AngularJS will see that all the parent objects have changed. `mutate-object` solves this problem by preserving any unmodified parts of the view model and therefore avoiding all unnecessary re-rendering.

It would also be useful in an architecture where multiple modules are holding on to references to a shared state object. Naively updating that state would cause the held references to become stale. Using `mutate-object` would not change the shared objects themseleves, only the data within them.

## Arguments
| Param             | Type   | Details                                                                                                                                                                                                                    |
|-------------------|--------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `oldObject`         | object | The destination object to be mutated                                                                                                                                                                                       |
| `newObject`         | object | The new object that the old object should be mutated to equal                                                                                                                                                              |
| `preserveRootProps` | bool (optional)   | `true` to prevent deleting undefined props at the root level. Eg. (in a simple AngularJS controller context) `mutateObject($scope, newState, true)` would avoid deleting controller functions and other values on the scope. |

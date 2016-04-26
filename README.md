# mutate-object
Performs a deep mutation of an existing object to equal a new object. Similar to `angular.merge` but with one critical difference: the destination object will always end up equal to the source object. This means:
 1. Values that are undefined in the source object **will be removed** from the destination object.
 2. A value that is an array in the source and an object in the destination (or vice versa) will not simply be mutated, because the types are different. A new instance of the correct type will be created instead.

**Note**: this is basically the exact opposite of Redux reducers. Instead of ensuring no mutation, `mutate-object` uses mutation wherever possible to avoid creating new objects.

## Example
```
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

## Use Case
AngularJS watches the view model and re-render the view when the associated model changes. The Redux pattern disallows any state mutation and forces any small change in the state to "bubble" up and cause all parent objects to be re-created. If a new Redux state is applied directly to an angular view model, the entire hiearchy will be re-rendered because AngularJS will see that all the parent objects have changed. `mutate-object` solves this problem by preserving any unmodified parts of the view model and therefore avoiding all unnecessary re-rendering.

It would also be useful in an architecture where multiple modules are holding on to references to a shared state object. Naively updating that state would cause the held references to become stale. Using `mutate-object` would not change the shared objects themseleves, only the data within them.

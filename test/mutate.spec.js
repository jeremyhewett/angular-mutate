var mutate = require('../mutate.js');

describe('mutate', function() {

  it('should update existing values', function() {
    var newState = { a: 'a', b: { e: 'f' }, c: [1, 2, 3], d: 9 };
    var oldState = { a: 'old', b: 'old', c: [2, 3, 4], d: { g: 'h' } };
    var c = oldState.c;
    mutate(oldState, newState);
    expect(oldState).toEqual(newState);
    expect(oldState).not.toBe(newState);
    expect(oldState.c).toBe(c);
  });

  it('should create new object values', function() {
    var newState = { a: 'b', c: 'd' };
    var oldState = {};
    mutate(oldState, newState);
    expect(oldState).toEqual(newState);
    expect(oldState).not.toBe(newState);
  });

  it('should remove old object values', function() {
    var newState = {};
    var oldState = { a: 'b', c: 'd' };
    mutate(oldState, newState);
    expect(oldState).toEqual(newState);
    expect(oldState).not.toBe(newState);
  });

  it('should create new array values', function() {
    var newState = [ 'a', 'b', 'c' ];
    var oldState = [];
    mutate(oldState, newState);
    expect(oldState).toEqual(newState);
    expect(oldState).not.toBe(newState);
  });

  it('should remove old array values', function() {
    var newState = [];
    var oldState = [ 'a', 'b', 'c' ];
    mutate(oldState, newState);
    expect(oldState).toEqual(newState);
    expect(oldState).not.toBe(newState);
  });

  it('should mutate old state when adding values', function() {
    var newState = { a: [1, 2, 3], b: { c: 'd' } };
    var oldState = { a: [], b: {} };
    var a = oldState.a;
    var b = oldState.b;
    mutate(oldState, newState);
    expect(oldState).toEqual(newState);
    expect(oldState.a).toBe(a);
    expect(oldState.b).toBe(b);
  });

  it('should mutate old state when removing values', function() {
    var newState = { a: [], b: {} };
    var oldState = { a: [1, 2, 3], b: { c: 'd' } };
    var a = oldState.a;
    var b = oldState.b;
    mutate(oldState, newState);
    expect(oldState).toEqual(newState);
    expect(oldState.a).toBe(a);
    expect(oldState.b).toBe(b);
  });

  it('should only mutate enumerables of the same type (array/object)', function() {
    var newState = { a: [1, 2, 3], b: { 0: 1, 1: 2 } };
    var oldState = { a: { 0: 1, 1: 2, 2: 3 }, b: [1, 2] };
    var a = oldState.a;
    var b = oldState.b;
    mutate(oldState, newState);
    expect(oldState).toEqual(newState);
    expect(oldState.a).not.toBe(a);
    expect(oldState.b).not.toBe(b);
    expect(Array.isArray(oldState.a)).toEqual(true);
    expect(Array.isArray(oldState.b)).toEqual(false);
  });

});
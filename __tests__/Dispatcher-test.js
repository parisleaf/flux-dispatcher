"use strict";

jest.autoMockOff();

describe('Dispatcher', function() {
  var Dispatcher = require('../Dispatcher.js');

  beforeEach(function() {
    AppDispatcher = new Dispatcher();
  });

  it('sends actions to subscribers', function() {
    var listener = jest.genMockFunction();
    AppDispatcher.register(listener);

    var payload = {foo: 'bar'};
    AppDispatcher.dispatch(payload);
    expect(listener.mock.calls.length).toBe(1);
    expect(listener.mock.calls[0][0]).toEqual(payload);
  });

  it('waits with chained dependencies properly', function() {
    var payload = {bar: 'baz'};

    var listener1Done = false;
    var listener1 = function(pl) {
      return AppDispatcher.waitFor([index2, index4], function() {
        // Second, third, and fourth listeners should have now been called
        expect(listener2Done).toBe(true);
        expect(listener3Done).toBe(true);
        expect(listener4Done).toBe(true);
        listener1Done = true;
      });
    };
    var index1 = AppDispatcher.register(listener1);

    var listener2Done = false;
    var listener2 = function(pl) {
      return AppDispatcher.waitFor([index3], function() {
        expect(listener3Done).toBe(true);
        listener2Done = true;
      });
    };
    var index2 = AppDispatcher.register(listener2);

    var listener3Done = false;
    var listener3 = function(pl) {
      listener3Done = true;
      return true;
    };
    var index3 = AppDispatcher.register(listener3);

    var listener4Done = false;
    var listener4 = function(pl) {
      return AppDispatcher.waitFor([index3], function() {
        expect(listener3Done).toBe(true);
        listener4Done = true;
      });
    };
    var index4 = AppDispatcher.register(listener4);

    runs(function() {
      AppDispatcher.dispatch(payload);
    });

    waitsFor(function() {
      return listener1Done;
    }, "Not all subscribers were properly called", 500);

    runs(function() {
      expect(listener1Done).toBe(true);
      expect(listener2Done).toBe(true);
      expect(listener3Done).toBe(true);
    });
  });
});
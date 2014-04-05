---
layout: post
title: "Unit Testing Express.js Routes"
date: 2014-01-20 22:00
tags: node.js express.js mocha testing
introduction: Unit testing synchronous objects in Node.js is really simple.  You have inputs, and you have outputs, and by exposing an object to all of it's possible inputs, you can assess that the outputs are sane.  But what about something like an asynchronous Express.JS route handler?  Read on to find out how you can track these sorts of modules.
---

Unit testing of model-type functionality in Node has been really straightforward
for me so far. By injecting mocks using wonderful libraries like [Proxyquire][proxyquire],
you can smoothly control flow and trigger conditional branches while testing to
ensure that you're fully covering a module. But what happens when you need to test
out [Express.js][express] route handlers? Imagine you have configured a route in
an Express.js application like so:

{% prism javascript %}
var express = require('express')
  , app = exports = module.exports = express()
  , ctrl = require('./controller');

app.get('/', ctrl.test);
{% endprism %}

And imagine you have a controller that implements the callback you configured your
application with for the "/" endpoint:

{% prism javascript %}
module.exports = {
  test : function(req, res) {
    setTimeout(function() {
      res.send({ testing : true }, 200);
    }, 5000);
  },
}
{% endprism %}
The timeout here isn't exactly practical, but it is representative: Most non-trivial
functionality in an Express.js project is going to need to communicate with some system,
like a database or caching system, or read from the file system. In other words: Something
asynchronous! Asynchronous code is much less straightforward to test because a unit
test needs to have some kind of idea when the code you're testing is done.  Unlike
testing a synchronous function, which returns to signify that it's completed, you
just can't do that with asynchronous logic. Further complicating this situation is
that Express route handlers signal that they are done by calling a method on the
Response object, like res.send. This is a little different from situations where
I've tested my own modules (usually in models) because the events that my models
emit are easily subscribed to in the tests. I can wait for the events to fire in
a unit test, inspect any data that is in the event, and then exit the unit test.
What's the right move here?

It's actually relatively straightforward:  I just need to inject a mock Response
object into the route handler. By injecting a mock, I can have some control over
what happens once the methods on the response are called. Because response methods
are often called in asynchronous workflows, I'll want a mock that emits an event
itself.  Lets see what that might look like:

{% prism javascript %}
var util = require('util')
  , events = require('events').EventEmitter;

var res = function () {
};

util.inherits(res, events);

res.prototype.send = function(payload, code) {
  this.emit('response', {
    code: code,
    response: payload
  });
}

module.exports = function() {
  return new res();
};
{% endprism %}

Hopefully this looks as expected. I'm utilizing the EventEmitter prototype that
Node.JS provides, and now when the response object's *send* method is invoked,
I fire a *response* event. That way, in the unit test, I can attach an event handler
to the mock's event, and then kick off the route handler method that I want to test.
Whenever the response methods are actually invoked, the handler in the unit test will
invoke, and there we can perform any assertions on the output of our controller's
action: the response code and response body.

{% prism javascript %}
var expect = require('chai').expect
  , res = require('./mocks/response')()
  , testing = require('./controller');

describe('Testing', function(){
  it('Should send an object with a testing key', function(done){
    res.on('response', function(resp) {
      expect(resp.response).to.have.property('testing');
      expect(resp.response.testing).to.equal(true);
      done();
    });

    testing.test({}, res);
  });
});

{% endprism %}

And just like that, my route handler has unit test coverage. As the controller
gets built out, we'll want to use tools like [Proxyquire][proxyquire], as mentioned
before, to inject mocks for our external resources to keep our tests running
smoothly and to not duplicate testing efforts. A unit test for a route handler
should exist primarily to test any branching logic or business logic that exists
inside the handler itself: Not the branching logic and business logic in the route
handlers *dependencies*. We try to keep our logic pretty light inside of route handler
itself at work, but there are some situations, like in error reporting, where we do
branch. These situations are definitely not trivial, and it's important that we have
appropriate testing coverage for it. And now, we have a straightforward and repeatable
method for doing that testing.

[proxyquire]: https://github.com/thlorenz/proxyquire
[express]: http://expressjs.com

---
layout: post
title: "Sharing Model Functionality Across Controllers in AngularJS"
date: 2014-05-06T20:48:23-04:00
tags: angular javascript
introduction: AngularJS has a ton of functionality for building reusable components with systems like Directives. But how do you build multiple page controllers with shared model-style functionality? Click through to check out how we can utilize the Provider and Factory systems to encapsulate a shared base model across pages.
---
In AngularJS, there are a *ton* of paradigms for building smart, reusable chunks of logic for one application (or more!). [Directives][directives] are used to build encapsulated view logic that can key off your scope's data attributes. They're not just "dumb" views of your data, either -- they come with the ability to plug in their _own_ controllers, so that you can structure or expand on your data structures in the directive's context only. But wait ... there's more!  Directives can _change_ and set data back to your controller's scope as well. Directives are truly versatile, and can accommodate many different application scenerios.

Back to the Angular basics: imagine you had an application where we wanted to show a list of fruits on a page.  Rather than come up with all kinds of different listing code, we could make a list directive, and pass it our list of fruits.  Now when we need another list display in our applications, we already have the markup to do that!

<p><iframe width="100%" height="300" src="http://jsfiddle.net/GeAAB/674/embedded/" allowfullscreen="allowfullscreen" frameborder="0"> </iframe></p>

That directive inclusion on the div with *data-list* as an attribute (check the html tab above) is how you include directive markup and bind your angular controller's data attributes to the directive. So awesome, we've created a simple angular directive and included it in our view logic. It doesn't do much, but in "the real world", this could do much more.  We could have the directive acting on a data set that comes back from the server, with a list of a user's favorite fruits. What if we put that directive on a bunch of pages but the method of data retrieval is always the same? How can we avoid having a bunch of Angular controllers with that data retrieval logic just repeated all over the place?

Angular also provides [Providers and Factories][providers] which are a great layer for this kind of abstraction.  We can move common "model" setup -- like retrieving a user's list of fruits -- into a Factory so that it is the same across the site. Note that this example might be better equipped for a [Service][service], which is very similar to what I plan to do with the Factory. It's actually preferable that you explicitly use Services because they're singletons and retain their values across page visits inside of an angular app. But in this case of traditional model setup, we don't want the values to be retained, or any modifications to travel across the application. We just want a way to simply set up a model with it's own shared defaults, and not repeat logic across the application.  Lets take a look at what that could look like in our application:

<p><iframe width="100%" height="300" src="http://jsfiddle.net/GeAAB/673/embedded/" allowfullscreen="allowfullscreen" frameborder="0"> </iframe></p>

So now we have two controllers in Angular that could be two separate pages. They both utilize the same data, but the mechanics for getting at that data has been extracted into a shared base model. Now for this example, it's probably overkill. But in the case where your pages might share a bunch of data, or it's decently complex to get that shared data, you're able to reduce repetition and bring even more reusability into your Angular application.
 
[directives]: https://docs.angularjs.org/guide/directive
[providers]: https://docs.angularjs.org/guide/providers
[service]: https://docs.angularjs.org/guide/services

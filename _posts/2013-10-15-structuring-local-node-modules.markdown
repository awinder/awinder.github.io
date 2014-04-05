---
layout: post
title: "Structuring Library Functionality in Node.js Projects"
date: 2013-10-15 22:05
tags: node.js express.js npm modules
introduction: "Requiring files in Node.js comes in two varieties: The code you write, that is required by a relative path, and the code from the community (or your own packages), that live as node modules, and are required by module name.  But what about library functionality, that gets used all over your application?  Is there a better way to include this repeated functionality in your code than a bunch of relative paths?"
---
Recently I needed to start thinking about adding reusable "library" components to an
[Express.js](http://www.expressjs.com) node.js project, and I hit a bit of a brick wall.
The library functionality was fairly specific to the application, and it just doesn't
make that much sense to break it out as seperately-packaged module right now.
Seems like a fairly common use-case, right? Well, apparently not.  You can load
any filepath through the `require()` system, like so:

{% prism javascript %}
var module = require('./lib/myModule');
...
{% endprism %}

But where this can quickly become a nuisance is when you are nested down a deep
folder hierarchy:

{% prism javascript %}
var module = require('../../../lib/myModule');
...
{% endprism %}

Having to track the folder hierarchy is a little bit of an inconvience, especially
when compared to the convience of the [NPM](https://npmjs.org) module system.
Searching around for some solutions, I found issues with the approaches commonly suggested:

* __Modify the paths where require.js scans for modules__ - In [previous versions](http://nodejs.org/docs/v0.4.1/api/all.html#loading_from_the_require.paths_Folders) of node, it looks like you could modify the paths require.js searched through, but this method has been deprecated and was not a "best practice" while available.
* __Load the path to your library directory into a global__ - I wanted to figure out a way around needing to declare some application-wide globals.  doing something like this might also create some unit testing concerns.  
* __Utilize [npm-link](https://npmjs.org/doc/link.html)__ - This seemed great at first blush, but the actual mechanics of how npm-link works are a little perculiar.  Npm-link first symlinks a specified module in your project directory to the global npm module location.  Then, it's symlinks that global location to a module in your local project's node_modules directory.  This means naming collisions could occur if you tried to use this method with two projects on the same machine.
* __Just put your library modules in the node\_modules directory!__ - Right now, this project's node_modules directory only includes community packages, and they're all installed through `package.json`.  This provides nice separation in the code -- `node_modules` is not our code, everything else is.  The node_modules directory is actually ignored in source control to disuade developers from mucking around with our open-source libraries.

Npm-link got me thinking though, and a [co-worker](http://mathematism.com) clued
in on that too. We could create a "library" module, which acted mostly as a namespace
for our project's unique library-type functionality. Each of those unique pieces
would be submodules of the "library" module. Then, we can create a symlink from
the node_modules directory to the library directory, and commit that symlink into
our source control.  Now our code can look like this:

{% prism javascript%}
var module = require('lib/myModule');
...
{% endprism %}

![Example folder structure](http://{{site.url}}/img/posts/2013-10-15-structuring-local-node-modules/folder-structure.png)

We get the benefits of keeping our code outside of the node_modules directory, but
with the benefits of it living within the `require()` lookup path. It's working out
great so far, and I'm happy we ended up finding a very straightforward solution to
our problem.

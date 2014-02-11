/*jslint node: true */
var fs = require('fs');

var json = fs.readFileSync('senticnet2.1.json');
var senticnet = JSON.parse(json);

function spaces(n) { return new Array(n + 1).join(' '); }

function tree(seed, max_depth) {
  var seen = {};

  var recurse = function(token, depth) {
    seen[token] = 1;

    var concept = senticnet[token];
    if (concept) {
      console.log(spaces(depth * 2) + token + ':');
      concept.semantics.forEach(function(token) {
        if (!(token in seen) && depth < max_depth) {
          recurse(token, depth + 1);
        }
      });
    }
    else {
      // leaf node
      console.log(spaces(depth * 2) + '"' + token + '"');
    }
  };

  recurse(seed, 0);
}

tree('linguistics', 5);

/** Instructions:

Start a node REPL in this folder, and paste this in: .load ./sandbox.js

You'll then have access to the senticnet variable and tree() helper.

*/

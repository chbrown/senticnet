/*jslint node: true */
// var fs = require('fs');
// var json = fs.readFileSync('senticnet2.1.json');
// var senticnet = JSON.parse(json);
// require() parses the JSON automatically
var senticnet = require('./senticnet2.1');
var tokens = Object.keys(senticnet);
// concepts is just senticnet (the lookup hash) flattened out into an array
var concepts = tokens.map(function(token) {
  // maybe copy the concept before modifying it?
  var concept = senticnet[token];
  concept.id = token;
  return concept;
});

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

function compareBy(prop) {
  /** returns a Array.sort-compatible compareFunction, i.e.,
  if (a is less than b by some ordering criterion) return -1;
  if (a is greater than b by the ordering criterion) return 1;
  if (a is be equal to b) return 0;
  */
  return function(a, b) {
    return a[prop] - b[prop];
  };
}

function ordered(prop) {
  /** `prop` should be one of:
    pleasantness
    attention
    sensitivity
    aptitude
    polarity
  */
  var compareFunction = compareBy(prop);

  concepts.sort(compareFunction).forEach(function(concept) {
    console.log(concept.text, concept[prop]);
  });
}

/** Instructions:

Start a node REPL in this folder, and paste this in: .load ./sandbox.js

You'll then have access to the senticnet variable and tree() helper.

*/

tree('linguistics', 5);
// ordered('pleasantness');

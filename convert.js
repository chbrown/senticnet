/*jslint node: true */
var fs = require('fs');
var xmlconv = require('xmlconv');

var sentic_keys = {
  pleasantness: 1,
  attention: 1,
  sensitivity: 1,
  aptitude: 1,
  polarity: 1,
};

function idFromUrl(url) {
  // http://sentic.net/api/en/concept/lose_soul -> lose_soul
  return url.match(/^http.+en.concept\/(.+)$/)[1];
}

function convert(rdf_xml_filepath, json_filepath) {
  var json = {};
  var rdf_xml = fs.readFileSync(rdf_xml_filepath);

  var root = xmlconv(rdf_xml, {convention: 'dom'});
  root.children.forEach(function(description) {
    var id = idFromUrl(description.attributes.about);
    var concept = json[id] = {semantics: []};
    description.children.forEach(function(child) {
      if (child.tag == 'text') {
        concept.text = child.text;
      }
      else if (child.tag == 'semantics') {
        // semantics is a list of tokens
        concept.semantics.push(idFromUrl(child.attributes.resource));
      }
      else if (child.tag in sentic_keys) {
        concept[child.tag] = parseFloat(child.text);
      }
      else if (child.tag == 'type') {
        // these are all the same
      }
      else {
        console.error('Ignoring node', child);
      }
    });
  });

  var output = JSON.stringify(json, null, ' ');
  fs.writeFileSync(json_filepath, output);
}

['senticnet2.rdf.xml', 'senticnet2.1.rdf.xml'].forEach(function(rdf_xml_filepath) {
  var json_filepath = rdf_xml_filepath.replace('rdf.xml', 'json');
  convert(rdf_xml_filepath, json_filepath);
  console.log('Created', json_filepath);
});

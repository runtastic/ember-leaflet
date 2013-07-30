require('ember-leaflet/~tests/test_helper');

var content, polyline, PolylineClass, view, 
  locationsEqual = window.locationsEqual,
  locations = window.locations;

module("EmberLeaflet.MarkerLayer", {
  setup: function() {
    content = Ember.A([locations.chicago, locations.sf, locations.nyc]);
    PolylineClass = EmberLeaflet.PolylineLayer.extend({});
    polyline = PolylineClass.create({
      content: content
    });
    view = EmberLeaflet.MapView.create({childLayers: [polyline]});
    Ember.run(function() {
      view.appendTo('#qunit-fixture');
    });
  },
  teardown: function() {
    Ember.run(function() {
      view.destroy();      
    });
  }
});

test("polyline is created", function() {
  ok(!!polyline._layer);
  equal(polyline._layer._map, view._layer);
});

test("locations match", function() {
  var _layerLatLngs = polyline._layer.getLatLngs();
  locationsEqual(_layerLatLngs[0], locations.chicago);
  locationsEqual(_layerLatLngs[1], locations.sf);
  locationsEqual(_layerLatLngs[2], locations.nyc);
  var locationLatLngs = polyline.get('locations');
  locationsEqual(locationLatLngs[0], locations.chicago);
  locationsEqual(locationLatLngs[1], locations.sf);
  locationsEqual(locationLatLngs[2], locations.nyc);
});

test("remove location from content updates polyline", function() {
  content.popObject();
  equal(polyline._layer.getLatLngs().length, content.length);
  equal(polyline.get('locations').length, content.length);
});

test("add location to content updates polyline", function() {
  content.pushObject(locations.paris);
  equal(polyline._layer.getLatLngs().length, content.length);
  equal(polyline.get('locations').length, content.length);
});

test("move location in content moves polyline", function() {
  content.set('2', locations.paris);
  locationsEqual(polyline.get('locations')[2], locations.paris);
  locationsEqual(polyline._layer.getLatLngs()[2], locations.paris);
});

test("nullify location in content updates polyline", function() {
  content.set('2', null);
  equal(polyline.get('locations.length'), 2);
  equal(polyline._layer.getLatLngs().length, 2);
});

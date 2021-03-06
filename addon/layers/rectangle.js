import Ember from 'ember';
import ArrayPathLayer from './array-path';
import BoundsMixin from '../mixins/bounds';

const { get } = Ember;

/**
 * `RectangleLayer` is a rectangle on the map that adjusts based
 * on a content object that should be an array of LatLng objects.
 *
 * @class RectangleLayer
 * @extends ArrayPathLayer
 * @uses BoundsMixin
 */
export default ArrayPathLayer.extend(BoundsMixin, {

  leafletEvents: ['click', 'dblclick', 'mousedown', 'mouseover', 'mouseout',
    'contextmenu', 'add', 'remove', 'popupopen', 'popupclose'],

  _newLayer() {
    return L.rectangle(get(this, 'bounds'), get(this, 'options'));
  },

  _createLayer() {
    if(!get(this, 'bounds')) { return; }
    this._super();
  },

  boundsDidChange: Ember.observer('locations', function() {
    const bounds = get(this, 'bounds');
    if(this._layer && !bounds) {
      this._destroyLayer();
    } else if(bounds && !this._layer) {
      this._createLayer();
    } else if(bounds && this._layer) {
      this._layer.setBounds(bounds);
    }
  })
});

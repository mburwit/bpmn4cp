const domify = require('min-dom').domify;
const domQuery = require('min-dom').query;
const escapeHTML = require('bpmn-js-properties-panel/lib/Utils').escapeHTML;
const entryFieldDescription = require('bpmn-js-properties-panel/lib/factory/EntryFieldDescription');
const getFillColor = require('bpmn-js/lib/draw/BpmnRenderUtil').getFillColor;
const getStrokeColor = require('bpmn-js/lib/draw/BpmnRenderUtil').getStrokeColor;

function ensureNotNull(prop) {
  if (!prop) {
    throw new Error(prop + ' must be set.');
  }

  return prop;
}

const colorPicker = function (modeling, translate, options) {

  let registered = false;

  const setDefaultParameters = function (options, modeling) {

    const registerEventListener = function (element) {
      const colorDOM = domQuery('input[id="color-' + options.id + '"]');

      const changeCallback = function (color) {
        const set = (options.set || defaultSet);
        const values = {}, prop = ensureNotNull(options.fillOrStroke);
        values[prop] = color;
        set(element, values);
      }

      if (!registered && colorDOM) {
        colorDOM.addEventListener("change", function() {
          changeCallback(colorDOM.value);
        }, false);
        registered = true;
      }
    }

    function getColor(element, fillOrStroke) {
      fillOrStroke = fillOrStroke || options.fillOrStroke;
      if (fillOrStroke === "fill") {
        return getFillColor(element, "#ffffff");
      }
      if (fillOrStroke === "stroke") {
        return getStrokeColor(element, "#000000");
      }
    }

    // default method to fetch the current color value
    const defaultGet = function (element) {
      const res = {}, prop = ensureNotNull(options.fillOrStroke);
      res[prop] = getColor(element, prop);
      return res;
    };

    // default method to set a new color value
    const defaultSet = function (element, values) {
      const res = {},
        prop = ensureNotNull(options.fillOrStroke);
      if (values[prop] !== '') {
        res[prop] = values[prop];
      } else {
        res[prop] = undefined;
      }
      modeling.setColor(element, res);
    };

    return {
      id: options.id,
      description: (options.description || ''),
      get: (options.get || defaultGet),
      set: (options.set || defaultSet),
      validate: registerEventListener,
      html: ''
    };
  };

  const resource = setDefaultParameters(options, modeling),
    label = options.label || resource.id,
    dataValueLabel = options.dataValueLabel,
    canBeDisabled = !!options.disabled && typeof options.disabled === 'function',
    canBeHidden = !!options.hidden && typeof options.hidden === 'function',
    description = options.description;

  resource.html =
    domify('<label for="camunda-' + escapeHTML(resource.id) + '" ' +
      (canBeDisabled ? 'data-disable="isDisabled" ' : '') +
      (canBeHidden ? 'data-show="isHidden" ' : '') +
      (dataValueLabel ? 'data-value="' + escapeHTML(dataValueLabel) + '"' : '') + '>' + escapeHTML(label) + '</label>' +
      '<div class="bpp-field-wrapper" ' +
      (canBeDisabled ? 'data-disable="isDisabled"' : '') +
      (canBeHidden ? 'data-show="isHidden"' : '') +
      '>' +
      '<input type="color" id="color-' + escapeHTML(resource.id) + '" ' +
      'value="' + options.value + '" ' +
      '"/>' +
      '</div>');
  // add description below text input entry field
  if (description) {
    resource.html.appendChild(entryFieldDescription(translate, description, {show: canBeHidden && 'isHidden'}));
  }

  if (canBeDisabled) {
    resource.isDisabled = function () {
      return options.disabled.apply(resource, arguments);
    };
  }

  if (canBeHidden) {
    resource.isHidden = function () {
      return !options.hidden.apply(resource, arguments);
    };
  }

  resource.cssClasses = ['bpp-colorpicker'];

  return resource;
};

module.exports = colorPicker;

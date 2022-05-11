'use strict';

const {domify} = require("min-dom");
const {escapeHTML} = require("bpmn-js-properties-panel/lib/Utils");

module.exports = function labelBox(translate, options, defaultParameters) {
    const resource = defaultParameters,
        label = options.label || resource.id,
        canBeShown = !!options.show && typeof options.show === 'function';
    resource.html =
        domify('<label for="camunda-' + escapeHTML(resource.id) + '" ' +
            (canBeShown ? 'data-show="isShown"' : '') +
            '>' + label + '</label>' +
            '<div class="bpp-field-wrapper" ' +
        (canBeShown ? 'data-show="isShown"' : '') +
        '>' +
        '<div id="camunda-' + escapeHTML(resource.id) + '" data-value="' + escapeHTML(options.modelProperty) + '"' +
        ' name="' + escapeHTML(options.modelProperty) + '" />' +
        '</div>');

    if (canBeShown) {
        resource.isShown = function() {
            return options.show.apply(resource, arguments);
        };
    }

    return resource;
}
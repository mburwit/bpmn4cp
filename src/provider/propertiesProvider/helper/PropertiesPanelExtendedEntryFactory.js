'use strict';

const entryFactory = require(
    'bpmn-js-properties-panel/lib/factory/EntryFactory');
const utils = require('bpmn-js-properties-panel/lib/Utils'),
    escapeHTML = utils.escapeHTML,
    domify = require('min-dom').domify,
    domQuery = require('min-dom').query,
    domEvent = require('min-dom').event;

const ExtendedEntryFactory = {};
module.exports = ExtendedEntryFactory;

ExtendedEntryFactory.selectBox = function (translate, options) {
    let resource = entryFactory.selectBox(translate, options);
    const addOption = options.addOption,
        canAddOptions = typeof addOption === 'function';
    if (canAddOptions) {
        const select = domQuery('select', resource.html);

        const wrapper = domify(
            '<div class="bpp-field-wrapper bpp-select">' +
            '</div>');
        wrapper.appendChild(select);

        const addButton = domify(
            '<button class="action-button add" ' +
            'id="cam-selectOptions-add-' + escapeHTML(resource.id) + '" ' +
            // 'data-action="addOption"' +
            '>' +
            '<span>+</span>' +
            '</button>'
        )
        domEvent.bind(addButton, 'click', () => {
            addOption(select)
        });
        wrapper.appendChild(addButton);

        resource.html.appendChild(wrapper);
    }
    return resource;
};

ExtendedEntryFactory.comboBox = function (translate, options) {
    return entryFactory.comboBox(translate, options);
}

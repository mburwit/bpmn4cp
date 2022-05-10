'use strict';

const entryFactory = require(
    'bpmn-js-properties-panel/lib/factory/EntryFactory');
const extensionElementsEntry = require('bpmn-js-properties-panel/lib/provider/camunda/parts/implementation/ExtensionElements');
const utils = require('bpmn-js-properties-panel/lib/Utils'),
    escapeHTML = utils.escapeHTML,
    domify = require('min-dom').domify,
    domQuery = require('min-dom').query,
    domEvent = require('min-dom').event;

const ExtendedEntryFactory = {};
module.exports = ExtendedEntryFactory;

ExtendedEntryFactory.textBox = function (translate, options) {
    return entryFactory.textBox(translate, options);
}

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
};

ExtendedEntryFactory.createSelectOption = function (option) {
    return '<option value="' + option.value + '">' + option.name + '</option>';
};

ExtendedEntryFactory.extensionElementsEntry = function (element, bpmnFactory, options, translate) {
    const onSelectionChange = options.onSelectionChange;
    const defaultSize = options.size || 5,
        resizable = options.resizable;
    const selectionChanged = function (element, node, event, scope) {
        if (typeof onSelectionChange === 'function') {
            return onSelectionChange(element, node, event, scope);
        }
    };
    const initSelectionSize = function (selectBox, optionsLength) {
        if (resizable) {
            selectBox.size = optionsLength > defaultSize ? optionsLength : defaultSize;
        }
    };
    const createOption = function(value) {
        return '<option value="' + escapeHTML(value) + '" data-value data-name="extensionElementValue">' + escapeHTML(value) + '</option>';
    };
    let resource = extensionElementsEntry(element, bpmnFactory, options, translate);
    resource.addAndSelectEmptyItem = (element) => {
        // create option template
        const selectBox = domQuery(`[id=cam-extensionElements-${escapeHTML(resource.id)}]`);
        const template = domify(createOption(undefined));
        // add new option as last child element
        selectBox.appendChild(template);
        // select last child element
        selectBox.lastChild.selected = 'selected';
        selectionChanged(element, selectBox);

        // update select box size
        initSelectionSize(selectBox, selectBox.options.length);
    }
    return resource;
}

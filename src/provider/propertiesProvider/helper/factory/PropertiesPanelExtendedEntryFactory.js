'use strict';

const labelTextBox = require('./LabelBoxEntryFactory');
const {getBusinessObject} = require("bpmn-js/lib/util/ModelUtil");
const cmdHelper = require('bpmn-js-properties-panel/lib/helper/CmdHelper');
const entryFactory = require(
    'bpmn-js-properties-panel/lib/factory/EntryFactory');
const extensionElementsEntry = require('bpmn-js-properties-panel/lib/provider/camunda/parts/implementation/ExtensionElements');
const entryFieldDescription = require('./EntryFieldDescription');
const utils = require('bpmn-js-properties-panel/lib/Utils'),
    escapeHTML = utils.escapeHTML,
    domify = require('min-dom').domify,
    domQuery = require('min-dom').query,
    domEvent = require('min-dom').event;

const ExtendedEntryFactory = {};
module.exports = ExtendedEntryFactory;

ExtendedEntryFactory.textBox = function (translate, options) {
    const description = options.description;
    delete options.description;
    const canBeShown = !!options.show && typeof options.show === 'function';
    const textBox = entryFactory.textBox(translate, options);

    // add replace default description with customized description below text box entry field
    if (description) {
        const domDescription = domQuery('.description', textBox.html);
        textBox.html.replaceChild(entryFieldDescription(translate, description, {show: canBeShown && 'isShown'}), domDescription);
    }
    return textBox;
}

ExtendedEntryFactory.labelBox = function (translate, options) {
    const labelBox = labelTextBox(translate, options, setDefaultParameters(options));
    const canBeShown = !!options.show && typeof options.show === 'function';

    labelBox.setControlValue = function (element, entryNode, node, name, newValue) {
        // remove previous content.
        let child = node.lastElementChild;
        while (child) {
            node.removeChild(child);
            child = node.lastElementChild;
        }
        // add new content
        node.appendChild(entryFieldDescription(translate, newValue, {show: canBeShown && 'isShown'}))
    }
    return labelBox;
}

ExtendedEntryFactory.selectBox = function (translate, options) {
    let resource = entryFactory.selectBox(translate, options);
    const addOption = options.addOption,
        canAddOptions = typeof addOption === 'function';
    if (canAddOptions) {
        const select = domQuery('select', resource.html);

        const wrapper = domify(
            '<div class="bpp-field-wrapper bpp-select default-size">' +
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
        resizable = options.resizable,
        optionCtrlClick = options.optionCtrlClick,
        createElement = options.createExtensionElement,
        canCreate = typeof createElement === 'function',
        removeElement = options.removeExtensionElement,
        canRemove = typeof removeElement === 'function';

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
    const createOption = function (value, optionCtrlClick) {
        return '<option value="' + escapeHTML(value) + '" data-value data-name="extensionElementValue" onClick=' + optionCtrlClick || "none" + '>' + escapeHTML(value) + '</option>';
    };
    let resource = extensionElementsEntry(element, bpmnFactory, options, translate);

    if (canRemove && !canCreate) {
        resource.html = resource.html.replace(/class="action-button clear([^"]*)"/, 'class="action-button clear$1 no-add"');
    }

    resource.createListEntryTemplate = function (value, index, selectBox) {
        initSelectionSize(selectBox, selectBox.options.length + 1);
        return createOption(value.extensionElementValue);
    }

    resource.addAndSelectEmptyItem = (element) => {
        // create option template
        const selectBox = domQuery(`[id=cam-extensionElements-${escapeHTML(resource.id)}]`);
        const template = domify(createOption(undefined, optionCtrlClick));
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

// helpers ////////////////////////////////////////

function ensureNotNull(prop) {
    if (!prop) {
        throw new Error(prop + ' must be set.');
    }

    return prop;
}

const setDefaultParameters = function (options) {

    // default method to fetch the current value of the input field
    const defaultGet = function (element) {
        const bo = getBusinessObject(element),
            res = {},
            prop = ensureNotNull(options.modelProperty);
        res[prop] = bo.get(prop);

        return res;
    };

    // default method to set a new value to the input field
    const defaultSet = function (element, values) {
        const res = {},
            prop = ensureNotNull(options.modelProperty);
        if (values[prop] !== '') {
            res[prop] = values[prop];
        } else {
            res[prop] = undefined;
        }

        return cmdHelper.updateProperties(element, res);
    };

    // default validation method
    const defaultValidate = function () {
        return {};
    };

    return {
        id: options.id,
        description: (options.description || ''),
        get: (options.get || defaultGet),
        set: (options.set || defaultSet),
        validate: (options.validate || defaultValidate),
        html: ''
    };
};
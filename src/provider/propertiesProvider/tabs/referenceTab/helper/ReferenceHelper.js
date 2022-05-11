'use strict';

const {getBusinessObject} = require("bpmn-js/lib/util/ModelUtil");
const extensionElementsHelper = require("bpmn-js-properties-panel/lib/helper/ExtensionElementsHelper");
const elementHelper = require("bpmn-js-properties-panel/lib/helper/ElementHelper");
const cmdHelper = require("bpmn-js-properties-panel/lib/helper/CmdHelper");
const ReferenceHelper = {};

module.exports = ReferenceHelper;

ReferenceHelper.getReferences = function (bo) {
    return bo && extensionElementsHelper.getExtensionElements(bo, 'cp:Reference') || [];
}

ReferenceHelper.getBibliographyItems = function (bo) {
    return bo && extensionElementsHelper.getExtensionElements(bo, 'cp:BibliographyItem') || [];
}

ReferenceHelper.getReferencedBibItems = function (bo) {
    return ReferenceHelper.getReferences(bo).map(ref => {
        return ref.bibItemRef;
    });
}

ReferenceHelper.addBibliographyItemCmdFn = (bpmnFactory) => {
    return (rootElement, properties) => {
        const cmds = [];
        const bo = getBusinessObject(rootElement);
        let extensionElements = bo.get('extensionElements');
        // if there is no extensionElements list, create one
        if (!extensionElements) {
            extensionElements = elementHelper.createElement('bpmn:ExtensionElements', {}, bo, bpmnFactory);
            cmds.push(cmdHelper.updateBusinessObject(rootElement, bo, {extensionElements: extensionElements}));
        }
        const item = elementHelper.createElement('cp:BibliographyItem', {
            ...{id: `BibliographyItem_${generateId(7)}`},
            ...properties
        }, extensionElements, bpmnFactory);
        cmds.push(cmdHelper.addElementsTolist(rootElement, extensionElements, 'values', [item]));

        if (cmds.length > 1) {
            return {
                item: item,
                cmd: "properties-panel.multi-command-executor",
                context: cmds
            }
        } else {
            return {...{item: item}, ...cmds[0]};
        }
    }
}

ReferenceHelper.addReferenceCmdFn = (bpmnFactory, rootElement) => {
    return (element, properties) => {
        if (typeof properties.bibItemRef === 'string') {
            properties.bibItemRef = ReferenceHelper.getBibliographyItems(getBusinessObject(rootElement))
                .find(bibItem => bibItem.id === properties.bibItemRef)
        }
        const cmds = [];
        const bo = getBusinessObject(element);
        let extensionElements = bo.get('extensionElements');
        // if there is no extensionElements list, create one
        if (!extensionElements) {
            extensionElements = elementHelper.createElement('bpmn:ExtensionElements', {}, bo, bpmnFactory);
            cmds.push(cmdHelper.updateBusinessObject(element, bo, {extensionElements: extensionElements}));
        }
        const newReference = elementHelper.createElement('cp:Reference', properties, extensionElements, bpmnFactory);
        cmds.push(cmdHelper.addElementsTolist(element, extensionElements, 'values', [newReference]));

        if (cmds.length > 1) {
            return {
                cmd: "properties-panel.multi-command-executor",
                context: cmds
            }
        } else {
            return cmds[0];
        }
    }
}

ReferenceHelper.bibItemLabel = (bibItem) => {
    return `[${bibItem.get('refLabel')}] ${bibItem.get('text') || ""}`
}

ReferenceHelper.bibItemMarkup = (bibItem) => {
    let markup = `[${bibItem.get('refLabel')}] ${bibItem.get('text') || ""}`;
    if (bibItem && bibItem.get('link')) {
        markup += ' ([' + bibItem.get('link') + '](' + bibItem.get('link') + '))';
    }
    return markup;
}

function generateId(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            characters.length));
    }
    return result;
}
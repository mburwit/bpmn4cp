'use strict';

const {is, getBusinessObject, isAny} = require("bpmn-js/lib/util/ModelUtil");
const extensionElementsHelper = require("bpmn-js-properties-panel/lib/helper/ExtensionElementsHelper");
const elementHelper = require("bpmn-js-properties-panel/lib/helper/ElementHelper");
const cmdHelper = require("bpmn-js-properties-panel/lib/helper/CmdHelper");
const ActorHelper = {};

module.exports = ActorHelper;

ActorHelper.getActors = function(bo) {
    if (bo) {
        if (isAny(bo, ['bpmn:Activity', 'bpmn:CategoryValue'])) {
            return bo && extensionElementsHelper.getExtensionElements(bo, 'cp:Actor') || [];
        } else {
            return this.getActors(bo.categoryValueRef);
        }
    }
    return [];
}

ActorHelper.handleGroupActivityIntersection = function(groups, activity, bpmnFactory) {
    let groupActors = [];
    groups.forEach(group => {
        groupActors.push(...this.getActors(getBusinessObject(group)));
    });
    // distinct values
    groupActors = groupActors.filter((value, index, self) => self.map(v => `${v.codeSystem}|${v.code}`).indexOf(`${value.codeSystem}|${value.code}`) === index);

    let command;
    let extensionElements = activity.get('extensionElements');
    if (extensionElements && extensionElements.get('values') && extensionElements.get('values').length > 0) {
        // if action has existing extensionElements, remove all its actors, and add the group actors
        const newValues = extensionElements.get('values').filter(entry => !is(entry, 'cp:Actor'));
        newValues.push(...groupActors);
        extensionElements = elementHelper.createElement('bpmn:ExtensionElements', {values: newValues}, activity, bpmnFactory)
    } else {
        // if activity has no or empty extensionElements, create a new one with the group actors
        extensionElements = elementHelper.createElement('bpmn:ExtensionElements', {values: groupActors}, activity, bpmnFactory)
    }
    command = cmdHelper.updateBusinessObject(activity, activity, {extensionElements: extensionElements})
    return command;
}
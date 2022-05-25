'use strict';

const {is, getBusinessObject} = require("bpmn-js/lib/util/ModelUtil");
const extensionElementsHelper = require("bpmn-js-properties-panel/lib/helper/ExtensionElementsHelper");
const ObservationHelper = {};

module.exports = ObservationHelper;

const CP_OBSERVATION_FEATURE = 'cp:ObservationFeature';
const CP_GOAL_STATE = 'cp:GoalState';

ObservationHelper.getObservations = function(element) {
    const bo = getBusinessObject(element);
    const type = this.getExtensionElementType(element);
    if (bo) {
        return bo && extensionElementsHelper.getExtensionElements(bo, type) || [];
    }
    return [];
}

ObservationHelper.getExtensionElementType = function getExtensionElementType(element) {
    const CP_OBSERVATION_ELEMENT = 'cp:Observation';
    const CP_GOAL_ELEMENT = 'cp:Goal';

    if (is(element, CP_OBSERVATION_FEATURE)) {
        return CP_OBSERVATION_ELEMENT;
    }
    if (is(element, CP_GOAL_STATE)) {
        return CP_GOAL_ELEMENT;
    }
}


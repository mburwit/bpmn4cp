'use strict';

import { getBusinessObject, is } from 'bpmn-js/lib/util/ModelUtil';

const extensionElementsEntry = require(
  'bpmn-js-properties-panel/lib/provider/camunda/parts/implementation/ExtensionElements'),
  extensionElementsHelper = require(
    'bpmn-js-properties-panel/lib/helper/ExtensionElementsHelper'),
  cmdHelper = require('bpmn-js-properties-panel/lib/helper/CmdHelper'),
  elementHelper = require('bpmn-js-properties-panel/lib/helper/ElementHelper');

function getObservations(bo, type) {
  return bo && extensionElementsHelper.getExtensionElements(bo, type) || [];
}

export default function(element, bpmnFactory, options, translate) {

  const CP_OBSERVATION_FEATURE = 'cp:ObservationFeature';
  const CP_GOAL_STATE = 'cp:GoalState';

  function getExtensionElementType(elem) {
    const CP_OBSERVATION_ELEMENT = 'cp:Observation';
    const CP_GOAL_ELEMENT = 'cp:Goal';

    if (is(elem, CP_OBSERVATION_FEATURE)) {
      return CP_OBSERVATION_ELEMENT;
    }
    if (is(elem, CP_GOAL_STATE)) {
      return CP_GOAL_ELEMENT;
    }
  }

  let bo;

  const result = {
    getSelectedObservation: getSelectedObservation,
  };

  const entries = result.entries = [];

  let observationEntry;

  function getSelectedObservation(elem, node) {
    const selection = (observationEntry &&
      observationEntry.getSelected(elem, node)) || { idx: -1 };

    return getObservations(bo, getExtensionElementType(element))[selection.idx];
  }

  function setOptionLabelValue(type) {
    return function(elem, node, option, property, value, idx) {
      const observations = getObservations(bo, type);
      const observation = observations[idx];
      option.text = (observation.get('name')) ?
        translate(observation.get('name')) :
        '<undefined>';
    };
  }

  function newElement(elem, type, initialObservationName) {
    return function(e, extensionElements, value) {
      const props = {
        name: initialObservationName,
      };

      const newElem = elementHelper.createElement(type, props,
        extensionElements, bpmnFactory);

      return cmdHelper.addElementsTolist(e, extensionElements, 'values',
        [newElem]);
    };
  }

  function removeElement(elem, type) {
    return function(e, extensionElements, value, idx) {
      const observations = getObservations(bo, type);
      const observation = observations[idx];
      if (observation) {
        return extensionElementsHelper.removeEntry(bo, element, observation);
      }
    };
  }

  bo = getBusinessObject(element);

  if (bo) {

    observationEntry = extensionElementsEntry(element, bpmnFactory, {
      id: 'observations',
      label: translate('Observations'),
      modelProperty: 'name',
      idGeneration: 'false',
      // reference: 'processRef',

      createExtensionElement: newElement(element,
        getExtensionElementType(element),
        'undefined'),
      removeExtensionElement: removeElement(element,
        getExtensionElementType(element)),

      getExtensionElements: function() {
        return getObservations(bo, getExtensionElementType(element));
      },

      setOptionLabelValue: setOptionLabelValue(
        getExtensionElementType(element)),

    });
    entries.push(observationEntry);

  }
  // }

  return result;

}

'use strict';

import { getBusinessObject } from 'bpmn-js/lib/util/ModelUtil';

const extensionElementsEntry = require(
  'bpmn-js-properties-panel/lib/provider/camunda/parts/implementation/ExtensionElements'),
  extensionElementsHelper = require(
    'bpmn-js-properties-panel/lib/helper/ExtensionElementsHelper'),
  cmdHelper = require('bpmn-js-properties-panel/lib/helper/CmdHelper'),
  elementHelper = require('bpmn-js-properties-panel/lib/helper/ElementHelper'),
observationHelper = require('../helper/ObservationHelper');


export default function(element, bpmnFactory, options, translate) {

  let bo;

  const result = {
    getSelectedObservation: getSelectedObservation,
  };

  result.entries = [];

  let observationEntry;

  function getSelectedObservation(elem, node) {
    const selection = (observationEntry &&
      observationEntry.getSelected(elem, node)) || { idx: -1 };

    return observationHelper.getObservations(element)[selection.idx];
  }

  function setOptionLabelValue() {
    return function(elem, node, option, property, value, idx) {
      const observations = observationHelper.getObservations(elem);
      const observation = observations[idx];
      option.text = (observation.get('name')) ?
        translate(observation.get('name')) :
        '<undefined>';
    };
  }

  function newElement(elem, type, initialObservationName) {
    return function(e, extensionElements) {
      const props = {
        name: initialObservationName,
      };

      const newElem = elementHelper.createElement(type, props,
        extensionElements, bpmnFactory);

      return cmdHelper.addElementsTolist(e, extensionElements, 'values',
        [newElem]);
    };
  }

  function removeElement() {
    return function(e, extensionElements, value, idx) {
      const observations = observationHelper.getObservations(e);
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

      createExtensionElement: newElement(element,
        observationHelper.getExtensionElementType(element),
        'undefined'),
      removeExtensionElement: removeElement(),

      getExtensionElements: function() {
        return observationHelper.getObservations(element);
      },

      setOptionLabelValue: setOptionLabelValue(
        observationHelper.getExtensionElementType(element)),

    });
    result.entries.push(observationEntry);
  }

  return result;

}

import extensionElementsHelper from "bpmn-js-properties-panel/lib/helper/ExtensionElementsHelper";

import {is} from 'bpmn-js/lib/util/ModelUtil';

export const ExtensionElementsHelper = {};

ExtensionElementsHelper.getExtensionElements = function(bo, type) {
  let elements = [];
  const extensionElements = bo.get('extensionElements');

  if (typeof extensionElements !== 'undefined') {
    const extensionValues = extensionElements.get('values');
    if (typeof extensionValues !== 'undefined') {
      elements = extensionValues.filter(function(value) {
        return !type || is(value, type);
      });
    }
  }

  return elements;
};

ExtensionElementsHelper.addEntry = function(bo, element, entry, bpmnFactory) {
  return extensionElementsHelper.addEntry(bo, element, entry, bpmnFactory);
};

ExtensionElementsHelper.removeEntry = function(bo, element, entry) {
  return extensionElementsHelper.removeEntry(bo, element, entry);
};
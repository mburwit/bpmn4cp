import entryFactory from 'bpmn-js-properties-panel/lib/factory/EntryFactory';

import { is } from 'bpmn-js/lib/util/ModelUtil';
import { domify } from 'min-dom';

const cmdHelper = require('bpmn-js-properties-panel/lib/helper/CmdHelper');

export default function(group, element, translate, options) {

  const prefix = options && options.idPrefix;

  const createOption = function(option) {
    return '<option value="' + option.value + '">' + option.name + '</option>';
  };

  // TODO: don't hard-code the available codes
  const selectionBehaviorOptions = function() {
    return [
      {
        name: translate('Any'),
        value: 'any',
      },
      {
        name: translate('All'),
        value: 'all',
      },
      {
        name: translate('All Or None'),
        value: 'all-or-none',
      },
      {
        name: translate('Exactly One'),
        value: 'exactly-one',
      },
      {
        name: translate('At Most One'),
        value: 'at-most-one',
      },
      {
        name: translate('One Or More'),
        value: 'one-or-more',
      },
    ];
  };

  const querySubProcessDefinitions = async () => {
    const response = await fetch(
      window.fhirApiUrl + '/PlanDefinition', window.fhirApiRequestInit);
    const fhirBundle = await response.json();
    return fhirBundle.entry.map((entry) => {
      return { name: entry.resource.title, value: entry.fullUrl };
    });
  };

  if (is(element, 'bpmn:SubProcess')) {
    group.entries.push(entryFactory.selectBox(translate, {
      id: prefix + 'subprocess-selection-property',
      label: translate('Selection Type of Sub-Actions'),
      selectOptions: selectionBehaviorOptions(),
      modelProperty: 'selectionBehavior',
    }));
    const subProcessDefinitionSelectBox = entryFactory.selectBox(translate, {
      id: prefix + 'subprocess-definition',
      label: translate('Detail Template'),
      modelProperty: 'definitionCanonical',
      set: function(elem, values) {
        // we get the empty option as string "undefined", so convert it to real undefined
        values.definitionCanonical = values.definitionCanonical ===
        'undefined' ? undefined : values.definitionCanonical;
        return cmdHelper.updateBusinessObject(elem, elem.businessObject,
          values);
      },
    });
    subProcessDefinitionSelectBox.setControlValue = function(
      elem, entryNode, inputNode, inputName, newValue) {

      querySubProcessDefinitions().then(selectOptions => {
        // add empty param
        selectOptions = [{ name: '', value: undefined }].concat(selectOptions);
        // remove existing options
        while (inputNode.firstChild) {
          inputNode.removeChild(inputNode.firstChild);
        }
        // add options
        selectOptions.forEach(option => {
          const template = domify(createOption(option));
          inputNode.appendChild(template);
        });
        // set select value
        if (newValue !== undefined) {
          inputNode.value = newValue;
        }
      });
    };
    group.entries.push(subProcessDefinitionSelectBox);
  }
}

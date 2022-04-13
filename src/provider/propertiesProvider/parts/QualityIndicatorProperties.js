import entryFactory from 'bpmn-js-properties-panel/lib/factory/EntryFactory';

import { is } from 'bpmn-js/lib/util/ModelUtil';

const
  elementHelper = require(
    'bpmn-js-properties-panel/lib/helper/ElementHelper'),
  cmdHelper = require('bpmn-js-properties-panel/lib/helper/CmdHelper'),
  qiDefinitionHelper = require('./implementation/QIDefinitionHelper');

export default function(group, element, bpmnFactory, translate, options) {

  // TODO: don't hard-code the available codes
  const qiDomainOptions = function() {
    return [
      {
        name: '',
        value: undefined,
        fillColor: undefined,
      },
      {
        name: translate('Continuity'),
        value: 'continuity',
        fillColor: '#ffcc00',
      },
      {
        name: translate('Effectiveness'),
        value: 'effectiveness',
        fillColor: '#0088ff',
      },
      {
        name: translate('Outcome'),
        value: 'outcome',
        fillColor: '#ff0000',
      },
      {
        name: translate('Patient-centredness'),
        value: 'patient-centredness',
        fillColor: '#ff8800',
      },
      {
        name: translate('Safety'),
        value: 'safety',
        fillColor: '#55aa33',
      },
      {
        name: translate('Structure'),
        value: 'structure',
        fillColor: '#6655aa',
      },
    ];
  };

  const qiStatusOptions = function() {
    return [
      {
        name: '',
        value: undefined,
      },
      {
        name: translate('in development'),
        value: 'dev',
      },
      {
        name: translate('in testing'),
        value: 'test',
      },
      {
        name: translate('in use'),
        value: 'use',
      },
      {
        name: translate('eliminated'),
        value: 'eliminated',
      },
    ];
  };

  const setRatioValue = function (elem, values) {
    // get the current definition or create a new one if none exists
    let definition = elem.businessObject.get('definition');
    if (definition) {
      return cmdHelper.updateBusinessObject(elem, definition, values);
    } else {
      values['type'] = 'ratio';
      definition = elementHelper.createElement('cp:QIDefinition',
        values,
        parent,
        bpmnFactory);
      return cmdHelper.updateBusinessObject(elem, elem.businessObject,
        { definition: definition });
    }
  }
  const prefix = options && options.idPrefix;

  if (is(element, 'cp:QualityIndicator')) {
    group.entries.push(entryFactory.selectBox(translate, {
      id: 'qi-domain',
      label: translate('Domain'),
      selectOptions: qiDomainOptions(),
      emptyParameter: false,
      modelProperty: 'domain',

      set: function(elem, values) {
        const bo = elem.businessObject;
        return cmdHelper.updateBusinessObject(element, bo, {
          'cp:domain': values.domain || undefined,
          'cp:fillColor': fillColor(values.domain) || undefined,
        });
      },
    }));
    group.entries.push(entryFactory.selectBox(translate, {
      id: 'qi-status',
      label: translate('Status'),
      selectOptions: qiStatusOptions(),
      emptyParameter: false,
      modelProperty: 'status',

      set: function(elem, values) {
        const bo = elem.businessObject;
        return cmdHelper.updateBusinessObject(element, bo, {
          'cp:status': values.status || undefined,
        });
      },
    }));

    group.entries.push(entryFactory.selectBox(translate, {
      id: prefix + 'qi-definition-type',
      label: translate('Definition'),
      selectOptions: [
        {
          name: '',
          value: undefined,
        },
        {
          name: translate('Text'),
          value: 'text',
        },
        {
          name: translate('Ratio'),
          value: 'ratio',
        },
      ],
      emptyParameter: false,
      modelProperty: 'type',

      get: function(elem) {
        return {
          type: qiDefinitionHelper.getQIDefinitionType(
            elem.businessObject.get('definition')) || '',
        };
      },

      set: function(elem, values) {
        // delete definition if type was unset
        if (!(values.type === 'text' || values.type === 'ratio')) {
          return cmdHelper.updateBusinessObject(elem, elem.businessObject,
            { definition: undefined });
        }

        // get the current definition or create a new one if none exists
        let definition = elem.businessObject.get('definition');
        if (definition) {
          return cmdHelper.updateBusinessObject(elem, definition, values);
        } else {
          definition = elementHelper.createElement('cp:QIDefinition',
            values,
            parent,
            bpmnFactory);
          return cmdHelper.updateBusinessObject(elem, elem.businessObject,
            { definition: definition });
        }
      },
    }));
    group.entries.push(entryFactory.textField(translate, {
      id: prefix + 'qi-definition-text',
      label: translate('Text'),
      modelProperty: 'text',

      get: function(elem) {
        return {
          text: qiDefinitionHelper.getQIDefinitionText(
            elem.businessObject.get('definition')) || '',
        };
      },

      set: function(elem, values) {
        // get the current definition or create a new one if none exists
        let definition = elem.businessObject.get('definition');
        if (definition) {
          return cmdHelper.updateBusinessObject(elem, definition, values);
        } else {
          values['type'] = 'text';
          definition = elementHelper.createElement('cp:QIDefinition',
            values,
            parent,
            bpmnFactory);
          return cmdHelper.updateBusinessObject(elem, elem.businessObject,
            { definition: definition });
        }
      },

      validate: function(elem) {
        const definition = elem.businessObject.get('definition');
        if (definition) {
          const type = qiDefinitionHelper.getQIDefinitionType(definition);
          const text = qiDefinitionHelper.getQIDefinitionText(definition);
          if (type === 'text' && !text) {
            return {
              text: translate('Must provide a value'),
            };
          }
        }
      },

      hidden: function(elem) {
        const definition = elem.businessObject.get('definition');
        return !(definition && definition.get('type') === 'text');
      },

    }));
    group.entries.push(entryFactory.textBox(translate, {
      id: prefix + 'qi-definition-numerator',
      label: translate('Numerator'),
      modelProperty: 'numerator',

      get: function(elem) {
        return {
          numerator: qiDefinitionHelper.getQIDefinitionNumerator(
            elem.businessObject.get('definition')) || '',
        };
      },

      set: function(elem, values) {
        return setRatioValue(elem, values);
      },

      validate: function(elem) {
        const definition = elem.businessObject.get('definition');
        if (definition) {
          const type = qiDefinitionHelper.getQIDefinitionType(definition);
          const numerator = qiDefinitionHelper.getQIDefinitionNumerator(definition);
          if (type === 'ratio' && !numerator) {
            return {
              numerator: translate('Must provide a value'),
            };
          }
        }
      },

      hidden: function(elem) {
        const definition = elem.businessObject.get('definition');
        return !(definition && definition.get('type') === 'ratio');
      },

    }));
    group.entries.push(entryFactory.textBox(translate, {
      id: prefix + 'qi-definition-denumerator',
      label: translate('Denominator'),
      modelProperty: 'denumerator',

      get: function(elem) {
        return {
          denumerator: qiDefinitionHelper.getQIDefinitionDenumerator(
            elem.businessObject.get('definition')) || '',
        };
      },

      set: function(elem, values) {
        return setRatioValue(elem, values);
      },

      validate: function(elem) {
        const definition = elem.businessObject.get('definition');
        if (definition) {
          const type = qiDefinitionHelper.getQIDefinitionType(definition);
          const numerator = qiDefinitionHelper.getQIDefinitionDenumerator(definition);
          if (type === 'ratio' && !numerator) {
            return {
              denumerator: translate('Must provide a value'),
            };
          }
        }
      },

      hidden: function(elem) {
        const definition = elem.businessObject.get('definition');
        return !(definition && definition.get('type') === 'ratio');
      },

    }));

  }

  function fillColor(value) {
    const known = (option) => option.value === value;
    if (qiDomainOptions().some(known)) {
      return qiDomainOptions().filter(known).map(option => {
        return option.fillColor;
      })[0];
    }
    return undefined;
  }
}

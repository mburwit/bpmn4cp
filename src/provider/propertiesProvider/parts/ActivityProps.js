import entryFactory from 'bpmn-js-properties-panel/lib/factory/EntryFactory';

import { is } from 'bpmn-js/lib/util/ModelUtil';

const
  cmdHelper = require('bpmn-js-properties-panel/lib/helper/CmdHelper');

export default function(group, element, translate) {

  // TODO: don't hard-code the available codes
  const actionCodeOptions = function() {
    return [
      {
        name: '',
        value: '',
      },
      {
        name: translate('Notification'),
        value: 'notification',
      },
      {
        name: translate('Questionnaire'),
        value: 'questionnaire',
      },
      {
        name: translate('Rehabilitation Coach'),
        value: 'rehabilitation-coach',
      },
      {
        name: translate('Scheduler'),
        value: 'scheduler',
      },
    ];
  };

  if (is(element, 'bpmn:Activity')) {
    group.entries.push(entryFactory.textField(translate, {
      id: 'activity-code',
      label: translate('Code'),
      description: translate(
        'Specify more than one code as a comma separated list.\nAvailable Codes are: ' +
        actionCodeOptions().map((option) => {
          return ' ' + option.value;
        }).filter((option) => {
          return option !== ' ';
        })),
      modelProperty: 'code',

      set: function(elem, values) {
        const bo = elem.businessObject;
        return cmdHelper.updateBusinessObject(element, bo, {
          'cp:code': values.code.replace(/\s/g, '') || undefined,
        });
      },

      validate: function(elem) {
        const values = elem.businessObject.get('code');
        if (values && values !== '') {
          const codes = values.split(',').filter(code => {
            return !actionCodeOptions().some(e => e.value === code);
          });
          if (codes.length > 0) {
            return {
              code: translate('Unknown codes:' + codes.map(code => {
                return ' ' + code;
              })),
            };
          }
        }
      },

    }));
  }
}

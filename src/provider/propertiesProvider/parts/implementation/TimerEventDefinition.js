'use strict';

const elementHelper = require(
  'bpmn-js-properties-panel/lib/helper/ElementHelper'),
  cmdHelper = require('bpmn-js-properties-panel/lib/helper/CmdHelper'),
  eventDefinitionHelper = require('./EventDefinitionHelper');

const entryFactory = require(
  'bpmn-js-properties-panel/lib/factory/EntryFactory');

const durationTimer = require(
  './DurationTimerEventDefinition');
const cycleTimer = require(
  './CycleTimerEventDefinition');

function TimerEventDefinition(
  group, element, bpmnFactory, timerEventDefinition, translate, options) {

  let newType = undefined;

  const selectOptions = [
    { value: 'timeEvent', name: translate('Event') },
    { value: 'timeDuration', name: translate('Duration') },
    { value: 'timeCycle', name: translate('Cycle') },
  ];

  const prefix = options && options.idPrefix,
    createTimerEventDefinition = options && options.createTimerEventDefinition;

  group.entries.push(entryFactory.selectBox(translate, {
    id: prefix + 'timer-event-definition-type',
    label: translate('Timer Definition Type'),
    selectOptions: selectOptions,
    emptyParameter: true,
    modelProperty: 'timerDefinitionType',

    get: function(elem, node) {
      const timerDefinition = eventDefinitionHelper.getTimerDefinition(
        timerEventDefinition, elem,
        node);

      return {
        timerDefinitionType: eventDefinitionHelper.getTimerDefinitionType(
          timerDefinition) || '',
      };
    },

    set: function(elem, values, node) {
      const props = {
        timeDuration: undefined,
        timeEvent: undefined,
        timeCycle: undefined,
      };

      let timerDefinition = eventDefinitionHelper.getTimerDefinition(
        timerEventDefinition, elem,
        node);
      newType = values.timerDefinitionType;

      if (!timerDefinition && typeof createTimerEventDefinition ===
        'function') {
        timerDefinition = createTimerEventDefinition(elem, node);
      }

      if (values.timerDefinitionType) {
        const oldType = eventDefinitionHelper.getTimerDefinitionType(
          timerDefinition);

        let value;
        if (
          (oldType === "timeCycle" && newType === "timeDuration") ||
          (oldType === "timeDuration" && newType === "timeCycle")){
          const definition = timerDefinition.get(oldType);
          value = {
            duration: definition.get('duration'),
            durationMax: definition.get('durationMax'),
            durationUnit: definition.get("durationUnit")
          };
        }

        if (newType === 'timeDuration') {
          props[newType] = elementHelper.createElement('cp:TimeDuration', value,
            parent,
            bpmnFactory);
        } else if (newType === 'timeCycle') {
          props[newType] = elementHelper.createElement('cp:TimeCycle', value,
            parent,
            bpmnFactory);
        } else {
          props[newType] = '';
        }
      }

      return cmdHelper.updateBusinessObject(elem, timerDefinition, props);
    },

    hidden: function(elem, node) {
      return eventDefinitionHelper.getTimerDefinition(timerEventDefinition,
        elem, node) === undefined;
    },

  }));

  group.entries.push(entryFactory.textField(translate, {
    id: prefix + 'timer-event-definition-event',
    label: translate('Event'),
    modelProperty: 'timeEvent',

    get: function(elem, node) {
      const timerDefinition = eventDefinitionHelper.getTimerDefinition(
        timerEventDefinition, elem,
        node);
      return {
        timeEvent: timerDefinition.get('timeEvent'),
      };
    },

    set: function(elem, values, node) {
      const timerDefinition = eventDefinitionHelper.getTimerDefinition(
        timerEventDefinition, elem,
        node);
      if (timerDefinition) {
        return cmdHelper.updateBusinessObject(elem, timerDefinition, {
          timeEvent: values.timeEvent || undefined,
        });
      }
    },

    validate: function(elem, node) {
      const timerDefinition = eventDefinitionHelper.getTimerDefinition(
        timerEventDefinition, elem,
        node);
      if (timerDefinition) {
        const value = timerDefinition.get('timeEvent');
        if (!value) {
          return {
            timeEvent: translate('Must be a valid FHIR datetime value!'),
          };
        }
        // see https://www.hl7.org/fhir/datatypes.html#dateTime
        const regex = /^([0-9]([0-9]([0-9][1-9]|[1-9]0)|[1-9]00)|[1-9]000)(-(0[1-9]|1[0-2])(-(0[1-9]|[1-2][0-9]|3[0-1])(T([01][0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9]|60)?(\.[0-9]+)?(Z|(\+|-)((0[0-9]|1[0-3]):[0-5][0-9]|14:00)))?)?)?$/;
        if (!regex.test(value)) {
          return {
            timeEvent: translate('Must be a valid FHIR datetime value!'),
          };
        }
      }
    },

    hidden: function(elem, node) {
      const timerDefinition = eventDefinitionHelper.getTimerDefinition(
        timerEventDefinition, elem,
        node);

      return 'timeEvent' !==
        eventDefinitionHelper.getTimerDefinitionType(timerDefinition);
    },

  }));

  durationTimer(group, element, bpmnFactory, timerEventDefinition, prefix,
      translate, options);
  cycleTimer(group, element, bpmnFactory, timerEventDefinition, prefix,
    translate);

}

module.exports = TimerEventDefinition;

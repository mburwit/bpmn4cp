const entryFactory = require(
  'bpmn-js-properties-panel/lib/factory/EntryFactory');
const
  cmdHelper = require('bpmn-js-properties-panel/lib/helper/CmdHelper'),
  eventDefinitionHelper = require(
    './EventDefinitionHelper');

function DurationTimerEventDefinition(
  group, element, bpmnFactory, timerEventDefinition, prefix, translate,
  options) {

  const isNotDurationOrCycleTimer = function(elem, node) {
    const timerDefinition = eventDefinitionHelper.getTimerDefinition(
      timerEventDefinition, elem,
      node);
    return !['timeDuration', 'timeCycle'].includes(
      eventDefinitionHelper.getTimerDefinitionType(timerDefinition),
    );
  };

  group.entries.push(entryFactory.textField(translate, {
    id: prefix + 'timer-event-definition-timeDuration-duration',
    label: translate('Duration'),
    modelProperty: 'duration',

    get: function(elem, node) {
      const timerDefinition = eventDefinitionHelper.getTimerDefinition(
        timerEventDefinition, elem, node);
      let durationDefinition = timerDefinition.get('timeDuration');
      if (durationDefinition === undefined) {
        durationDefinition = timerDefinition.get('timeCycle');
      }
      const value = durationDefinition ?
        durationDefinition.get('duration') :
        '';
      return {
        duration: value,
      };
    },

    set: function(elem, values, node) {
      const timerDefinition = eventDefinitionHelper.getTimerDefinition(
        timerEventDefinition, elem,
        node);
      let durationDefinition = timerDefinition.get('timeDuration');
      if (durationDefinition === undefined) {
        durationDefinition = timerDefinition.get('timeCycle');
      }
      if (durationDefinition) {
        return cmdHelper.updateBusinessObject(elem, durationDefinition, {
          duration: values.duration || undefined,
        });
      }
    },

    validate: function(elem, node) {
      const timerDefinition = eventDefinitionHelper.getTimerDefinition(
        timerEventDefinition, elem,
        node);
      if (timerDefinition) {
        let durationDefinition = timerDefinition.get('timeDuration');
        if (durationDefinition) {
          const value = durationDefinition.get('duration');
          if (!value)
            return {
              duration: translate('Must provide a value!'),
            };
        } else {
          durationDefinition = timerDefinition.get('timeCycle');
        }
        if (durationDefinition) {
          const value = parseInt(durationDefinition.get('duration'));
          const durationMax = parseInt(durationDefinition.get('durationMax'));
          const unit = durationDefinition.get('unit');
          if (unit && !value)
            return {
              duration: translate('Must provide a value!'),
            };
          if (durationMax && !value) {
            return {
              duration: translate('Must provide a value if max duration set.'),
            };
          } else if (value && value > durationMax) {
            return {
              duration: translate('Must be less than max duration.'),
            };
          }
        }
      }
    },

    hidden: isNotDurationOrCycleTimer,

  }));
  group.entries.push(entryFactory.textField(translate, {
    id: prefix + 'timer-event-definition-timeDuration-durationMax',
    label: translate('Maximum Duration'),
    modelProperty: 'durationMax',

    get: function(elem, node) {
      const timerDefinition = eventDefinitionHelper.getTimerDefinition(
        timerEventDefinition, elem, node);
      let durationDefinition = timerDefinition.get('timeDuration');
      if (durationDefinition === undefined) {
        durationDefinition = timerDefinition.get('timeCycle');
      }
      const value = durationDefinition ?
        durationDefinition.get('durationMax') :
        '';
      return {
        durationMax: value,
      };
    },

    set: function(elem, values, node) {
      const timerDefinition = eventDefinitionHelper.getTimerDefinition(
        timerEventDefinition, elem,
        node);
      let durationDefinition = timerDefinition.get('timeDuration');
      if (durationDefinition === undefined) {
        durationDefinition = timerDefinition.get('timeCycle');
      }
      if (durationDefinition) {
        return cmdHelper.updateBusinessObject(elem, durationDefinition, {
          durationMax: values.durationMax || undefined,
        });
      }
    },

    validate: function(elem, node) {
      const timerDefinition = eventDefinitionHelper.getTimerDefinition(
        timerEventDefinition, elem,
        node);
      if (timerDefinition) {
        let durationDefinition = timerDefinition.get('timeDuration');
        if (durationDefinition === undefined) {
          durationDefinition = timerDefinition.get('timeCycle');
        }
        if (durationDefinition) {
          const duration = parseInt(durationDefinition.get('duration'), 10);
          const durationMax = parseInt(durationDefinition.get('durationMax'), 10);
          if (durationMax && durationMax < duration)
            return {
              durationMax: translate('Must be greater than count.'),
            };
        }
      }
    },

    hidden: isNotDurationOrCycleTimer,

  }));
  group.entries.push(entryFactory.textField(translate, {
    id: prefix + 'timer-event-definition-timeDuration-unit',
    label: translate('Duration Time Unit'),
    modelProperty: 'durationUnit',

    get: function(elem, node) {
      const timerDefinition = eventDefinitionHelper.getTimerDefinition(
        timerEventDefinition, elem, node);
      let durationDefinition = timerDefinition.get('timeDuration');
      if (durationDefinition === undefined) {
        durationDefinition = timerDefinition.get('timeCycle');
      }
      const value = durationDefinition ?
        durationDefinition.get('durationUnit') :
        '';
      return {
        durationUnit: value,
      };
    },

    set: function(elem, values, node) {
      const timerDefinition = eventDefinitionHelper.getTimerDefinition(
        timerEventDefinition, elem,
        node);
      let durationDefinition = timerDefinition.get('timeDuration');
      if (durationDefinition === undefined) {
        durationDefinition = timerDefinition.get('timeCycle');
      }
      if (durationDefinition) {
        return cmdHelper.updateBusinessObject(elem, durationDefinition, {
          durationUnit: values.durationUnit || undefined,
        });
      }
    },

    validate: function(elem, node) {
      const timerDefinition = eventDefinitionHelper.getTimerDefinition(
        timerEventDefinition, elem,
        node);
      if (timerDefinition) {
        let durationDefinition = timerDefinition.get('timeDuration');
        if (durationDefinition === undefined) {
          durationDefinition = timerDefinition.get('timeCycle');
        }
        if (durationDefinition) {
          const unit = durationDefinition.get('durationUnit');
          const duration = durationDefinition.get('duration');
          if (duration) {
            if (!unit) {
              return {
                durationUnit: translate('Must provide a value!'),
              };
            } else if (!['s', 'min', 'h', 'd', 'wk', 'mo', 'a'].includes(
              unit)) {
              return {
                durationUnit: translate('Must be a valid time unit!'),
              };
            }
          }
        }
      }
    },

    hidden: isNotDurationOrCycleTimer,

  }));

}

module.exports = DurationTimerEventDefinition;

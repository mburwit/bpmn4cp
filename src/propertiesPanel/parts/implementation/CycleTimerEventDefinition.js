const entryFactory = require(
  'bpmn-js-properties-panel/lib/factory/EntryFactory');
const elementHelper = require(
  'bpmn-js-properties-panel/lib/helper/ElementHelper'),
  cmdHelper = require('bpmn-js-properties-panel/lib/helper/CmdHelper'),
  eventDefinitionHelper = require(
    './EventDefinitionHelper');
const {forEach} = require("min-dash");

const boundsInputs = require("./TimeCycleBoundsInputs");

function CycleTimerEventDefinition(
  group, element, bpmnFactory, timerEventDefinition, prefix, translate) {

  const boundsTypes = [
    {value: undefined, name: ""},
    {value: 'boundsDuration', name: translate('Duration')},
    {value: 'boundsRange', name: translate('Range')},
    {value: 'boundsPeriod', name: translate('Period')},
  ];


  const isNotCycleTimer = function (elem, node) {
    const timerDefinition = eventDefinitionHelper.getTimerDefinition(
      timerEventDefinition, elem,
      node);
    return 'timeCycle' !==
      eventDefinitionHelper.getTimerDefinitionType(timerDefinition);
  };

  group.entries.push(entryFactory.selectBox(translate, {
    id: prefix + 'timer-event-definition-timeCycle-bounds-type',
    label: translate('Bounds of Schedule'),
    selectOptions: boundsTypes,
    modelProperty: 'boundsType',

    get: function (elem, node) {
      const timerDefinition = eventDefinitionHelper.getTimerDefinition(
        timerEventDefinition, elem, node),
        cycleDefinition = timerDefinition.get('timeCycle'),
        value = cycleDefinition ?
          eventDefinitionHelper.getBoundsType(cycleDefinition) :
          '';
      return {
        boundsType: value,
      };
    },

    set: function (elem, values, node) {
      const props = {
        boundsDuration: undefined,
        boundsRange: undefined,
        boundsPeriod: undefined,
      };
      const timerDefinition = eventDefinitionHelper.getTimerDefinition(
        timerEventDefinition, elem,
        node),
        cycleDefinition = timerDefinition.get('timeCycle'),
        newType = values.boundsType;
      if (cycleDefinition) {
        const oldType = eventDefinitionHelper.getBoundsType(cycleDefinition);
        let value;
        if (oldType === "boundsDuration" && newType === "boundsRange") {
          const bounds = cycleDefinition.get(oldType);
          value = {
            low: elementHelper.createElement('cp:BoundsRangeLowerLimit',
              {
                value: bounds.get("value"),
                unit: bounds.get("unit")
              },
              parent,
              bpmnFactory)
          };
        } else if (oldType === "boundsRange" && newType === "boundsDuration") {
          const bounds = cycleDefinition.get(oldType);
          if (bounds.get("low")) {
            value = {
              value: bounds.get("low").get("value"),
              unit: bounds.get("low").get("unit")
            }
          } else if (bounds.get("high")) {
            value = {
              value: bounds.get("high").get("value"),
              unit: bounds.get("high").get("unit")
            }
          }
        }

        if (newType === 'boundsDuration') {
          props[newType] = elementHelper.createElement('cp:BoundsDuration', value,
            parent,
            bpmnFactory);
        } else if (newType === 'boundsRange') {
          props[newType] = elementHelper.createElement('cp:BoundsRange', value,
            parent,
            bpmnFactory);
        } else if (newType === 'boundsPeriod') {
          props[newType] = elementHelper.createElement('cp:BoundsPeriod', value,
            parent,
            bpmnFactory);
        }
        return cmdHelper.updateBusinessObject(elem, cycleDefinition, props);
      }
    },

    hidden: isNotCycleTimer,

  }));
  boundsInputs(group, element, bpmnFactory, timerEventDefinition, prefix,
      translate);
  group.entries.push(entryFactory.textField(translate, {
    id: prefix + 'timer-event-definition-timeCycle-count',
    label: translate('Count'),
    modelProperty: 'count',

    get: function (elem, node) {
      const timerDefinition = eventDefinitionHelper.getTimerDefinition(
        timerEventDefinition, elem, node),
        cycleDefinition = timerDefinition.get('timeCycle'),
        value = cycleDefinition ?
          cycleDefinition.get('count') :
          '';
      return {
        count: value,
      };
    },

    set: function (elem, values, node) {
      const timerDefinition = eventDefinitionHelper.getTimerDefinition(
        timerEventDefinition, elem,
        node),
        cycleDefinition = timerDefinition.get('timeCycle');
      if (cycleDefinition) {
        return cmdHelper.updateBusinessObject(elem, cycleDefinition, {
          count: values.count || undefined,
        });
      }
    },

    validate: function (elem, node) {
      const timerDefinition = eventDefinitionHelper.getTimerDefinition(
        timerEventDefinition, elem,
        node);
      if (timerDefinition) {
        const cycleDefinition = timerDefinition.get('timeCycle');
        if (cycleDefinition) {
          const count = parseInt(cycleDefinition.get('count'), 10);
          const countMax = parseInt(cycleDefinition.get('countMax'), 10);
          if (countMax && !count) {
            return {
              count: translate('Must provide a value if max count set.'),
            };
          } else if (count && count > countMax) {
            return {
              count: translate('Must be less than max count.'),
            };
          }
        }
      }
    },

    hidden: isNotCycleTimer,

  }));
  group.entries.push(entryFactory.textField(translate, {
    id: prefix + 'timer-event-definition-timeCycle-countMax',
    label: translate('Maximum Count'),
    modelProperty: 'countMax',

    get: function (elem, node) {
      const timerDefinition = eventDefinitionHelper.getTimerDefinition(
        timerEventDefinition, elem, node),
        cycleDefinition = timerDefinition.get('timeCycle'),
        value = cycleDefinition ?
          cycleDefinition.get('countMax') :
          '';
      return {
        countMax: value,
      };
    },

    set: function (elem, values, node) {
      const timerDefinition = eventDefinitionHelper.getTimerDefinition(
        timerEventDefinition, elem,
        node),
        cycleDefinition = timerDefinition.get('timeCycle');
      if (cycleDefinition) {
        return cmdHelper.updateBusinessObject(elem, cycleDefinition, {
          countMax: values.countMax || undefined,
        });
      }
    },

    validate: function (elem, node) {
      const timerDefinition = eventDefinitionHelper.getTimerDefinition(
        timerEventDefinition, elem,
        node);
      if (timerDefinition) {
        const cycleDefinition = timerDefinition.get('timeCycle');
        if (cycleDefinition) {
          const count = parseInt(cycleDefinition.get('count'), 10);
          const countMax = parseInt(cycleDefinition.get('countMax'), 10);
          if (countMax && countMax < count)
            return {
              countMax: translate('Must be greater than count.'),
            };
        }
      }
    },

    hidden: isNotCycleTimer,

  }));
  group.entries.push(entryFactory.textField(translate, {
    id: prefix + 'timer-event-definition-timeCycle-frequency',
    label: translate('Frequency'),
    modelProperty: 'frequency',

    get: function (elem, node) {
      const timerDefinition = eventDefinitionHelper.getTimerDefinition(
        timerEventDefinition, elem, node),
        cycleDefinition = timerDefinition.get('timeCycle'),
        value = cycleDefinition ?
          cycleDefinition.get('frequency') :
          '';
      return {
        frequency: value,
      };
    },

    set: function (elem, values, node) {
      const timerDefinition = eventDefinitionHelper.getTimerDefinition(
        timerEventDefinition, elem,
        node),
        cycleDefinition = timerDefinition.get('timeCycle');
      if (cycleDefinition) {
        return cmdHelper.updateBusinessObject(elem, cycleDefinition, {
          frequency: values.frequency || undefined,
        });
      }
    },

    validate: function (elem, node) {
      const timerDefinition = eventDefinitionHelper.getTimerDefinition(
        timerEventDefinition, elem,
        node);
      if (timerDefinition) {
        const cycleDefinition = timerDefinition.get('timeCycle');
        if (cycleDefinition) {
          const frequency = parseInt(cycleDefinition.get('frequency'), 10);
          const frequencyMax = parseInt(cycleDefinition.get('frequencyMax'),
            10);
          if (frequencyMax && !frequency) {
            return {
              frequency: translate(
                'Must provide a value if max frequency set.'),
            };
          } else if (frequency && frequency > frequencyMax) {
            return {
              frequency: translate('Must be less than max frequency.'),
            };
          }
        }
      }
    },

    hidden: isNotCycleTimer,

  }));
  group.entries.push(entryFactory.textField(translate, {
    id: prefix + 'timer-event-definition-timeCycle-frequencyMax',
    label: translate('Maximum Frequency'),
    modelProperty: 'frequencyMax',

    get: function (elem, node) {
      const timerDefinition = eventDefinitionHelper.getTimerDefinition(
        timerEventDefinition, elem, node),
        cycleDefinition = timerDefinition.get('timeCycle'),
        value = cycleDefinition ?
          cycleDefinition.get('frequencyMax') :
          '';
      return {
        frequencyMax: value,
      };
    },

    set: function (elem, values, node) {
      const timerDefinition = eventDefinitionHelper.getTimerDefinition(
        timerEventDefinition, elem,
        node),
        cycleDefinition = timerDefinition.get('timeCycle');
      if (cycleDefinition) {
        return cmdHelper.updateBusinessObject(elem, cycleDefinition, {
          frequencyMax: values.frequencyMax || undefined,
        });
      }
    },

    validate: function (elem, node) {
      const timerDefinition = eventDefinitionHelper.getTimerDefinition(
        timerEventDefinition, elem,
        node);
      if (timerDefinition) {
        const cycleDefinition = timerDefinition.get('timeCycle');
        if (cycleDefinition) {
          const frequency = parseInt(cycleDefinition.get('frequency'), 10);
          const frequencyMax = parseInt(cycleDefinition.get('frequencyMax'),
            10);
          if (frequencyMax && frequencyMax < frequency)
            return {
              frequencyMax: translate('Must be greater than frequency.'),
            };
        }
      }
    },

    hidden: isNotCycleTimer,

  }));
  group.entries.push(entryFactory.textField(translate, {
    id: prefix + 'timer-event-definition-timeCycle-period',
    label: translate('Period'),
    modelProperty: 'period',

    get: function (elem, node) {
      const timerDefinition = eventDefinitionHelper.getTimerDefinition(
        timerEventDefinition, elem, node),
        cycleDefinition = timerDefinition.get('timeCycle'),
        value = cycleDefinition ?
          cycleDefinition.get('period') :
          '';
      return {
        period: value,
      };
    },

    set: function (elem, values, node) {
      const timerDefinition = eventDefinitionHelper.getTimerDefinition(
        timerEventDefinition, elem,
        node),
        cycleDefinition = timerDefinition.get('timeCycle');
      if (cycleDefinition) {
        return cmdHelper.updateBusinessObject(elem, cycleDefinition, {
          period: values.period || undefined,
        });
      }
    },

    validate: function (elem, node) {
      const timerDefinition = eventDefinitionHelper.getTimerDefinition(
        timerEventDefinition, elem,
        node);
      if (timerDefinition) {
        const cycleDefinition = timerDefinition.get('timeCycle');
        if (cycleDefinition) {
          const period = parseFloat(cycleDefinition.get('period'));
          const periodMax = parseFloat(cycleDefinition.get('periodMax'));
          if (periodMax && !period) {
            return {
              period: translate('Must provide a value if max period set.'),
            };
          } else if (period && period > periodMax) {
            return {
              period: translate('Must be less than max period.'),
            };
          }
        }
      }
    },

    hidden: isNotCycleTimer,

  }));
  group.entries.push(entryFactory.textField(translate, {
    id: prefix + 'timer-event-definition-timeCycle-periodMax',
    label: translate('Maximum Period'),
    modelProperty: 'periodMax',

    get: function (elem, node) {
      const timerDefinition = eventDefinitionHelper.getTimerDefinition(
        timerEventDefinition, elem, node),
        cycleDefinition = timerDefinition.get('timeCycle'),
        value = cycleDefinition ?
          cycleDefinition.get('periodMax') :
          '';
      return {
        periodMax: value,
      };
    },

    set: function (elem, values, node) {
      const timerDefinition = eventDefinitionHelper.getTimerDefinition(
        timerEventDefinition, elem,
        node),
        cycleDefinition = timerDefinition.get('timeCycle');
      if (cycleDefinition) {
        return cmdHelper.updateBusinessObject(elem, cycleDefinition, {
          periodMax: values.periodMax || undefined,
        });
      }
    },

    validate: function (elem, node) {
      const timerDefinition = eventDefinitionHelper.getTimerDefinition(
        timerEventDefinition, elem,
        node);
      if (timerDefinition) {
        const cycleDefinition = timerDefinition.get('timeCycle');
        if (cycleDefinition) {
          const period = parseFloat(cycleDefinition.get('period'));
          const periodMax = parseFloat(cycleDefinition.get('periodMax'));
          if (periodMax && periodMax < period)
            return {
              periodMax: translate('Must be greater than period.'),
            };
        }
      }
    },

    hidden: isNotCycleTimer,

  }));
  group.entries.push(entryFactory.textField(translate, {
    id: prefix + 'timer-event-definition-timeCycle-unit',
    label: translate('Period Unit'),
    modelProperty: 'periodUnit',

    get: function (elem, node) {
      const timerDefinition = eventDefinitionHelper.getTimerDefinition(
        timerEventDefinition, elem, node),
        cycleDefinition = timerDefinition.get('timeCycle'),
        value = cycleDefinition ? cycleDefinition.get('periodUnit') : '';
      return {
        periodUnit: value,
      };
    },

    set: function (elem, values, node) {
      const timerDefinition = eventDefinitionHelper.getTimerDefinition(
        timerEventDefinition, elem, node),
        cycleDefinition = timerDefinition.get('timeCycle')
      if (cycleDefinition) {
        return cmdHelper.updateBusinessObject(elem, cycleDefinition, {
          periodUnit: values.periodUnit || undefined,
        });
      }
    },

    validate: function (elem, node) {
      const timerDefinition = eventDefinitionHelper.getTimerDefinition(
        timerEventDefinition, elem,
        node);
      if (timerDefinition) {
        const cycleDefinition = timerDefinition.get('timeCycle');
        if (cycleDefinition) {
          const unit = cycleDefinition.get('periodUnit');
          const period = cycleDefinition.get('period');
          if (period) {
            if (!unit) {
              return {
                periodUnit: translate('Must provide a value!'),
              };
            } else if (!['s', 'min', 'h', 'd', 'wk', 'mo', 'a'].includes(
              unit)) {
              return {
                periodUnit: translate('Must be a valid time unit!'),
              };
            }
          }
        }
      }
    },

    hidden: isNotCycleTimer,

  }));
  group.entries.push(entryFactory.textField(translate, {
    id: prefix + 'timer-event-definition-timeCycle-timeOfDay',
    label: translate('Time of Day'),
    modelProperty: 'timeOfDay',
    description: translate('Multiple values must be separated by pipes |.'),

    get: function (elem, node) {
      const timerDefinition = eventDefinitionHelper.getTimerDefinition(
        timerEventDefinition, elem, node),
        cycleDefinition = timerDefinition.get('timeCycle'),
        value = cycleDefinition ?
          cycleDefinition.get('timeOfDay') :
          '';
      return {
        timeOfDay: value,
      };
    },

    set: function (elem, values, node) {
      const timerDefinition = eventDefinitionHelper.getTimerDefinition(
        timerEventDefinition, elem,
        node),
        cycleDefinition = timerDefinition.get('timeCycle');
      if (cycleDefinition) {
        return cmdHelper.updateBusinessObject(elem, cycleDefinition, {
          timeOfDay: values.timeOfDay || undefined,
        });
      }
    },

    validate: function (elem, node) {
      const timerDefinition = eventDefinitionHelper.getTimerDefinition(
        timerEventDefinition, elem,
        node);
      if (timerDefinition) {
        const cycleDefinition = timerDefinition.get('timeCycle');
        if (cycleDefinition) {
          const timeOfDay = cycleDefinition.get('timeOfDay');
          if (!!timeOfDay) {
            const multipleValues = timeOfDay.split("|");
            let invalid = false;
            forEach(multipleValues, (value) => {
              if (!/^([01][0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9]|60)?(\.[0-9]+)?$/.test("" + value)) {
                invalid = true;
              }
            });
            if (invalid) {
              return {
                timeOfDay: translate('Must provide valid time values - hh:mm(:ss).')
              };
            }
          }
        }
      }
    },

    hidden: isNotCycleTimer,

  }));
  group.entries.push(entryFactory.textField(translate, {
    id: prefix + 'timer-event-definition-timeCycle-dayOfWeek',
    label: translate('Day of week'),
    modelProperty: 'dayOfWeek',
    description: translate('Multiple values must be separated by pipes |.'),

    get: function (elem, node) {
      const timerDefinition = eventDefinitionHelper.getTimerDefinition(
          timerEventDefinition, elem, node),
          cycleDefinition = timerDefinition.get('timeCycle'),
          value = cycleDefinition ?
              cycleDefinition.get('dayOfWeek') :
              '';
      return {
        dayOfWeek: value,
      };
    },

    set: function (elem, values, node) {
      const timerDefinition = eventDefinitionHelper.getTimerDefinition(
          timerEventDefinition, elem,
          node),
          cycleDefinition = timerDefinition.get('timeCycle');
      if (cycleDefinition) {
        return cmdHelper.updateBusinessObject(elem, cycleDefinition, {
          dayOfWeek: values.dayOfWeek || undefined,
        });
      }
    },

    validate: function (elem, node) {
      const timerDefinition = eventDefinitionHelper.getTimerDefinition(
          timerEventDefinition, elem,
          node);
      if (timerDefinition) {
        const cycleDefinition = timerDefinition.get('timeCycle');
        if (cycleDefinition) {
          const dayOfWeek = cycleDefinition.get('dayOfWeek');
          if (!!dayOfWeek) {
            const multipleValues = dayOfWeek.split("|");
            let invalid = false;
            forEach(multipleValues, (value) => {
              if (!/^(mon|tue|wed|thu|fri|sat|sun)$/.test("" + value)) {
                invalid = true;
              }
            });
            if (invalid) {
              return {
                dayOfWeek: translate('Valid values: mon | tue | wed | thu | fri | sat | sun')
              };
            }
          }
        }
      }
    },

    hidden: isNotCycleTimer,

  }));

  // TODO: implement other cycle properties...

}

module.exports = CycleTimerEventDefinition;

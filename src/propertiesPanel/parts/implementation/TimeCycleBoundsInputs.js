const entryFactory = require(
  'bpmn-js-properties-panel/lib/factory/EntryFactory');
const elementHelper = require(
  'bpmn-js-properties-panel/lib/helper/ElementHelper'),
  cmdHelper = require('bpmn-js-properties-panel/lib/helper/CmdHelper'),
  eventDefinitionHelper = require(
    './EventDefinitionHelper');

function TimeCycleBoundsInputs(
  group, element, bpmnFactory, timerEventDefinition, prefix, translate) {

  function getCycleDefinition() {
    const timerDefinition = eventDefinitionHelper.getTimerDefinition(
      timerEventDefinition, null, null);
    return timerDefinition.get('timeCycle');
  }

  const isNotBoundsDuration = function () {
    return 'boundsDuration' !== eventDefinitionHelper.getBoundsType(getCycleDefinition());
  };

  const isNotBoundsRange = function () {
    return 'boundsRange' !== eventDefinitionHelper.getBoundsType(getCycleDefinition());
  };

  const isNotBoundsPeriod = function () {
    return 'boundsPeriod' !== eventDefinitionHelper.getBoundsType(getCycleDefinition());
  };

  // bounds duration
  group.entries.push(entryFactory.textField(translate, {
    id: prefix + 'timer-event-definition-timeCycle-bounds-duration',
    label: translate('Bounds - Duration'),
    modelProperty: 'value',

    get: function () {
      const cycleDefinition = getCycleDefinition();
      const value = cycleDefinition && cycleDefinition.get("boundsDuration") ?
        cycleDefinition.get("boundsDuration").get('value') :
        '';
      return {
        value: value,
      };
    },

    set: function (elem, values) {
      const cycleDefinition = getCycleDefinition();
      let boundsDuration = cycleDefinition.get('boundsDuration');
      if (boundsDuration) {
        return cmdHelper.updateBusinessObject(elem, boundsDuration, {
          value: values.value || undefined,
        });
      }
    },

    validate: function () {
      const cycleDefinition = getCycleDefinition();
      if (cycleDefinition) {
        let boundsDuration = cycleDefinition.get('boundsDuration');
        if (boundsDuration) {
          const value = parseInt(boundsDuration.get('value'));
          if (!value)
            return {
              value: translate('Must provide a value!'),
            };
        }
      }
    },

    hidden: isNotBoundsDuration,

  }));
  group.entries.push(entryFactory.textField(translate, {
    id: prefix + 'timer-event-definition-timeCycle-bounds-durationUnit',
    label: translate('Bounds - Duration Time Unit'),
    modelProperty: 'unit',

    get: function () {
      const cycleDefinition = getCycleDefinition();
      const value = cycleDefinition && cycleDefinition.get("boundsDuration") ?
        cycleDefinition.get("boundsDuration").get('unit') :
        '';
      return {
        unit: value,
      };
    },

    set: function (elem, values) {
      const cycleDefinition = getCycleDefinition();
      let boundsDuration = cycleDefinition.get('boundsDuration');
      if (boundsDuration) {
        return cmdHelper.updateBusinessObject(elem, boundsDuration, {
          unit: values.unit || undefined,
        });
      }
    },

    validate: function () {
      const cycleDefinition = getCycleDefinition();
      if (cycleDefinition) {
        let boundsDuration = cycleDefinition.get('boundsDuration');
        if (boundsDuration) {
          const unit = boundsDuration.get('unit');
          if (!unit) {
            return {
              unit: translate('Must provide a value!'),
            };
          } else if (!['s', 'min', 'h', 'd', 'wk', 'mo', 'a'].includes(
            unit)) {
            return {
              unit: translate('Must be a valid time unit!'),
            };
          }
        }
      }
    },

    hidden: isNotBoundsDuration,

  }));

  // bounds range
  group.entries.push(entryFactory.textField(translate, {
    id: prefix + 'timer-event-definition-timeCycle-bounds-range-low',
    label: translate('Bounds - Range - Lower Limit'),
    modelProperty: 'lowerValue',

    get: function () {
      const cycleDefinition = getCycleDefinition();
      const lowerValue = cycleDefinition
      && cycleDefinition.get("boundsRange")
      && cycleDefinition.get("boundsRange").get("low") ?
        cycleDefinition.get("boundsRange").get("low").get('value') :
        '';
      return {
        lowerValue: lowerValue,
      };
    },

    set: function (elem, values) {
      const cycleDefinition = getCycleDefinition();
      let boundsRange = cycleDefinition.get('boundsRange');
      if (boundsRange) {
        let low = boundsRange.get('low');
        const high = boundsRange.get('high');
        low = elementHelper.createElement('cp:BoundsRangeLowerLimit',
          {
            value: values.lowerValue === "" ? undefined : values.lowerValue,
            unit: low ? low.get("unit") : undefined
          }, parent, bpmnFactory);
        low = low.get("value") || low.get("unit") ? low : undefined;
        return cmdHelper.updateBusinessObject(elem, boundsRange, {
          low: low,
          high: high
        });
      }
    },

    validate: function () {
      const cycleDefinition = getCycleDefinition();
      if (cycleDefinition) {
        let boundsRange = cycleDefinition.get('boundsRange');
        if (boundsRange) {
          const lowValue = boundsRange.get("low") ? boundsRange.get("low").get("value") : undefined;
          const lowUnit = boundsRange.get("low") ? boundsRange.get("low").get("unit") : undefined;
          if (lowUnit && !lowValue)
            return {
              lowerValue: translate('Must provide a value or remove unit!'),
            };
          const highValue = boundsRange.get("high") ? boundsRange.get("high").get("value") : undefined;
          const highUnit = boundsRange.get("high") ? boundsRange.get("high").get("unit") : undefined;
          if (!lowValue && !lowUnit && !highValue && !highUnit)
            return {
              lowerValue: translate('Must provide either lower or upper bound!'),
            };
        }
      }
    },

    hidden: isNotBoundsRange,

  }));
  group.entries.push(entryFactory.textField(translate, {
    id: prefix + 'timer-event-definition-timeCycle-bounds-range-lowUnit',
    label: translate('Bounds - Range - Lower Unit'),
    modelProperty: 'lowerUnit',

    get: function () {
      const cycleDefinition = getCycleDefinition();
      const lowerUnit = cycleDefinition
      && cycleDefinition.get("boundsRange")
      && cycleDefinition.get("boundsRange").get("low") ?
        cycleDefinition.get("boundsRange").get("low").get('unit') :
        '';
      return {
        lowerUnit: lowerUnit,
      };
    },

    set: function (elem, values) {
      const cycleDefinition = getCycleDefinition();
      let boundsRange = cycleDefinition.get('boundsRange');
      if (boundsRange) {
        let low = boundsRange.get('low');
        const high = boundsRange.get('high');
        low = elementHelper.createElement('cp:BoundsRangeLowerLimit',
          {
            value: low ? low.get("value") : undefined,
            unit: values.lowerUnit === "" ? undefined : values.lowerUnit
          }, parent, bpmnFactory);
        low = low.get("value") || low.get("unit") ? low : undefined;
        return cmdHelper.updateBusinessObject(elem, boundsRange, {
          low: low,
          high: high
        });
      }
    },

    validate: function () {
      const cycleDefinition = getCycleDefinition();
      if (cycleDefinition) {
        let boundsRange = cycleDefinition.get('boundsRange');
        if (boundsRange) {
          const lowValue = boundsRange.get("low") ? boundsRange.get("low").get("value") : undefined;
          const lowUnit = boundsRange.get("low") ? boundsRange.get("low").get("unit") : undefined;
          if (lowValue && !lowUnit) {
            return {
              lowerUnit: translate('Must provide a unit or remove lower limit!'),
            };
          } else if (lowUnit && !['s', 'min', 'h', 'd', 'wk', 'mo', 'a'].includes(
            lowUnit)) {
            return {
              lowerUnit: translate('Must be a valid time unit!'),
            };
          }
          const highValue = boundsRange.get("high") ? boundsRange.get("high").get("value") : undefined;
          const highUnit = boundsRange.get("high") ? boundsRange.get("high").get("unit") : undefined;
          if (!lowValue && !lowUnit && !highValue && !highUnit)
            return {
              lowerUnit: translate('Must provide either lower or upper bound!'),
            };
        }
      }
    },

    hidden: isNotBoundsRange,

  }));
  group.entries.push(entryFactory.textField(translate, {
    id: prefix + 'timer-event-definition-timeCycle-bounds-range-high',
    label: translate('Bounds - Range - Upper Limit'),
    modelProperty: 'upperValue',

    get: function () {
      const cycleDefinition = getCycleDefinition();
      const lowerValue = cycleDefinition
      && cycleDefinition.get("boundsRange")
      && cycleDefinition.get("boundsRange").get("high") ?
        cycleDefinition.get("boundsRange").get("high").get('value') :
        '';
      return {
        upperValue: lowerValue,
      };
    },

    set: function (elem, values) {
      const cycleDefinition = getCycleDefinition();
      let boundsRange = cycleDefinition.get('boundsRange');
      if (boundsRange) {
        const low = boundsRange.get('low');
        let high = boundsRange.get('high');
        high = elementHelper.createElement('cp:BoundsRangeUpperLimit',
          {
            value: values.upperValue === "" ? undefined : values.upperValue,
            unit: high ? high.get("unit") : undefined
          }, parent, bpmnFactory);
        high = high.get("value") || high.get("unit") ? high : undefined;
        return cmdHelper.updateBusinessObject(elem, boundsRange, {
          low: low,
          high: high
        });
      }
    },

    validate: function () {
      const cycleDefinition = getCycleDefinition();
      if (cycleDefinition) {
        let boundsRange = cycleDefinition.get('boundsRange');
        if (boundsRange) {
          const highValue = boundsRange.get("high") ? boundsRange.get("high").get("value") : undefined;
          const highUnit = boundsRange.get("high") ? boundsRange.get("high").get("unit") : undefined;
          if (highUnit && !highValue)
            return {
              upperValue: translate('Must provide a value or remove unit!'),
            };
          const lowValue = boundsRange.get("low") ? boundsRange.get("low").get("value") : undefined;
          const lowUnit = boundsRange.get("low") ? boundsRange.get("low").get("unit") : undefined;
          if (!lowValue && !lowUnit && !highValue && !highUnit)
            return {
              upperValue: translate('Must provide either lower or upper bound!'),
            };
        }
      }
    },

    hidden: isNotBoundsRange,

  }));
  group.entries.push(entryFactory.textField(translate, {
    id: prefix + 'timer-event-definition-timeCycle-bounds-range-highUnit',
    label: translate('Bounds - Range - Upper Unit'),
    modelProperty: 'upperUnit',

    get: function () {
      const cycleDefinition = getCycleDefinition();
      const upperUnit = cycleDefinition
      && cycleDefinition.get("boundsRange")
      && cycleDefinition.get("boundsRange").get("high") ?
        cycleDefinition.get("boundsRange").get("high").get('unit') :
        '';
      return {
        upperUnit: upperUnit,
      };
    },

    set: function (elem, values) {
      const cycleDefinition = getCycleDefinition();
      let boundsRange = cycleDefinition.get('boundsRange');
      if (boundsRange) {
        const low = boundsRange.get('low');
        let high = boundsRange.get('high');
        high = elementHelper.createElement('cp:BoundsRangeUpperLimit',
          {
            value: high ? high.get("value") : undefined,
            unit: values.upperUnit === "" ? undefined : values.upperUnit
          }, parent, bpmnFactory);
        high = high.get("value") || high.get("unit") ? high : undefined;
        return cmdHelper.updateBusinessObject(elem, boundsRange, {
          low: low,
          high: high
        });
      }
    },

    validate: function () {
      const cycleDefinition = getCycleDefinition();
      if (cycleDefinition) {
        let boundsRange = cycleDefinition.get('boundsRange');
        if (boundsRange) {
          const highValue = boundsRange.get("high") ? boundsRange.get("high").get("value") : undefined;
          const highUnit = boundsRange.get("high") ? boundsRange.get("high").get("unit") : undefined;
          if (highValue && !highUnit) {
            return {
              upperUnit: translate('Must provide a unit or remove upper limit!'),
            };
          } else if (highUnit && !['s', 'min', 'h', 'd', 'wk', 'mo', 'a'].includes(
            highUnit)) {
            return {
              upperUnit: translate('Must be a valid time unit!'),
            };
          }
          const lowValue = boundsRange.get("low") ? boundsRange.get("low").get("value") : undefined;
          const lowUnit = boundsRange.get("low") ? boundsRange.get("low").get("unit") : undefined;
          if (!lowValue && !lowUnit && !highValue && !highUnit)
            return {
              upperUnit: translate('Must provide either lower or upper bound!'),
            };
        }
      }
    },

    hidden: isNotBoundsRange,

  }));

  // bounds period
  group.entries.push(entryFactory.textField(translate, {
    id: prefix + 'timer-event-definition-timeCycle-bounds-period-start',
    label: translate('Bounds - Period - Start'),
    modelProperty: 'start',

    get: function () {
      const cycleDefinition = getCycleDefinition();
      const start = cycleDefinition && cycleDefinition.get("boundsPeriod") ?
        cycleDefinition.get("boundsPeriod").get('start') :
        '';
      return {
        start: start,
      };
    },

    set: function (elem, values) {
      const cycleDefinition = getCycleDefinition();
      let boundsPeriod = cycleDefinition.get('boundsPeriod');
      if (boundsPeriod) {
        return cmdHelper.updateBusinessObject(elem, boundsPeriod, {
          start: values.start || undefined,
        });
      }
    },

    validate: function () {
      const cycleDefinition = getCycleDefinition();
      if (cycleDefinition) {
        const boundsPeriod = cycleDefinition.get('boundsPeriod');
        if (boundsPeriod) {
          const start = boundsPeriod.get('start');
          const regex = /^([0-9]([0-9]([0-9][1-9]|[1-9]0)|[1-9]00)|[1-9]000)(-(0[1-9]|1[0-2])(-(0[1-9]|[1-2][0-9]|3[0-1])(T([01][0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9]|60)?(\.[0-9]+)?(Z|([+-])((0[0-9]|1[0-3]):[0-5][0-9]|14:00)))?)?)?$/;
          if (!!start && !regex.test(start)) {
            return {
              start: translate('Must be a valid FHIR datetime value!'),
            };
          }
          const end = boundsPeriod.get('end');
          if (!start && !end) {
            return {
              start: translate('Must provide either start or end of period!'),
            };
          }
        }
      }
    },

    hidden: isNotBoundsPeriod,

  }));
  group.entries.push(entryFactory.textField(translate, {
    id: prefix + 'timer-event-definition-timeCycle-bounds-period-end',
    label: translate('Bounds - Period - End'),
    modelProperty: 'end',

    get: function () {
      const cycleDefinition = getCycleDefinition();
      const end = cycleDefinition && cycleDefinition.get("boundsPeriod") ?
        cycleDefinition.get("boundsPeriod").get('end') :
        '';
      return {
        end: end,
      };
    },

    set: function (elem, values) {
      const cycleDefinition = getCycleDefinition();
      let boundsPeriod = cycleDefinition.get('boundsPeriod');
      if (boundsPeriod) {
        return cmdHelper.updateBusinessObject(elem, boundsPeriod, {
          end: values.end || undefined,
        });
      }
    },

    validate: function () {
      const cycleDefinition = getCycleDefinition();
      if (cycleDefinition) {
        let boundsPeriod = cycleDefinition.get('boundsPeriod');
        if (boundsPeriod) {
          const end = boundsPeriod.get('end');
          const regex = /^([0-9]([0-9]([0-9][1-9]|[1-9]0)|[1-9]00)|[1-9]000)(-(0[1-9]|1[0-2])(-(0[1-9]|[1-2][0-9]|3[0-1])(T([01][0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9]|60)?(\.[0-9]+)?(Z|(\+|-)((0[0-9]|1[0-3]):[0-5][0-9]|14:00)))?)?)?$/;
          if (!!end && !regex.test(end)) {
            return {
              end: translate('Must be a valid FHIR datetime value!'),
            };
          }
          const start = boundsPeriod.get('start');
          if (!start && !end) {
            return {
              end: translate('Must provide either start or end of period!'),
            };
          }
        }
      }
    },

    hidden: isNotBoundsPeriod,

  }));

}

module.exports = TimeCycleBoundsInputs;

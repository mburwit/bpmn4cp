'use strict';

const EventDefinitionHelper = {};

module.exports = EventDefinitionHelper;

/**
 * Get the timer definition type for a given timer event definition.
 *
 * @param {ModdleElement<bpmn:TimerEventDefinition>} timer
 *
 * @return {string|undefined} the timer definition type
 */
EventDefinitionHelper.getTimerDefinitionType = function(timer) {

  if (!timer) {
    return;
  }

  const timeEvent = timer.get('timeEvent');
  if (typeof timeEvent !== 'undefined') {
    return 'timeEvent';
  }

  const timeCycle = timer.get('timeCycle');
  if (typeof timeCycle !== 'undefined') {
    return 'timeCycle';
  }

  const timeDuration = timer.get('timeDuration');
  if (typeof timeDuration !== 'undefined') {
    return 'timeDuration';
  }
};

/**
 * Get the actual timer event definition based on option, whether it's a getter
 * to fetch the timer event definition or the exact event definition itself
 *
 * @param {ModdleElement<bpmn:TimerEventDefinition>|Function} timerOrFunction
 * @param {Shape} element
 * @param {HTMLElement} node
 *
 * @return ModdleElement<bpmn:TimerEventDefinition>
 */
EventDefinitionHelper.getTimerDefinition = function(timerOrFunction, element, node) {
  if (typeof timerOrFunction === 'function') {
    return timerOrFunction(element, node);
  }

  return timerOrFunction;
}

EventDefinitionHelper.getBoundsType = function(cycleDefinition) {
  if (!cycleDefinition) {
    return;
  }

  const boundsDuration = cycleDefinition.get('boundsDuration');
  if (typeof boundsDuration !== 'undefined') {
    return 'boundsDuration';
  }

  const boundsRange = cycleDefinition.get('boundsRange');
  if (typeof boundsRange !== 'undefined') {
    return 'boundsRange';
  }

  const boundsPeriod = cycleDefinition.get('boundsPeriod');
  if (typeof boundsPeriod !== 'undefined') {
    return 'boundsPeriod';
  }
}


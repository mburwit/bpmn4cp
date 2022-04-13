import { is } from 'bpmn-js/lib/util/ModelUtil';
import { isAny } from 'bpmn-js/lib/features/modeling/util/ModelingUtil';
const defaultEventDefinitionHelper = require(
  'bpmn-js-properties-panel/lib/helper/EventDefinitionHelper');

const message = require(
  'bpmn-js-properties-panel/lib/provider/bpmn/parts/implementation/MessageEventDefinition'),
  signal = require(
    'bpmn-js-properties-panel/lib/provider/bpmn/parts/implementation/SignalEventDefinition'),
  error = require(
    'bpmn-js-properties-panel/lib/provider/bpmn/parts/implementation/ErrorEventDefinition'),
  escalation = require(
    'bpmn-js-properties-panel/lib/provider/bpmn/parts/implementation/EscalationEventDefinition'),
  compensation = require(
    'bpmn-js-properties-panel/lib/provider/bpmn/parts/implementation/CompensateEventDefinition'),
  condition = require(
    'bpmn-js-properties-panel/lib/provider/bpmn/parts/implementation/ConditionalEventDefinition');
const timer = require(
  './implementation/TimerEventDefinition');

export default function(
  group, element, bpmnFactory, elementRegistry, translate) {
  const events = [
    'bpmn:StartEvent',
    'bpmn:EndEvent',
    'bpmn:IntermediateThrowEvent',
    'bpmn:BoundaryEvent',
    'bpmn:IntermediateCatchEvent',
  ];

  // Message and Signal Event Definition
  events.forEach(function(event) {
    if (is(element, event)) {

      const messageEventDefinition = defaultEventDefinitionHelper.getMessageEventDefinition(
        element),
        signalEventDefinition = defaultEventDefinitionHelper.getSignalEventDefinition(
          element);

      if (messageEventDefinition) {
        message(group, element, bpmnFactory, messageEventDefinition, translate);
      }

      if (signalEventDefinition) {
        signal(group, element, bpmnFactory, signalEventDefinition, translate);
      }

    }
  });

  // Special Case: Receive Task
  if (is(element, 'bpmn:ReceiveTask')) {
    message(group, element, bpmnFactory, getBusinessObject(element), translate);
  }

  // Error Event Definition
  const errorEvents = [
    'bpmn:StartEvent',
    'bpmn:BoundaryEvent',
    'bpmn:EndEvent',
  ];

  errorEvents.forEach(function(event) {
    if (is(element, event)) {

      const errorEventDefinition = defaultEventDefinitionHelper.getErrorEventDefinition(
        element);

      if (errorEventDefinition) {

        error(group, element, bpmnFactory, errorEventDefinition, translate);
      }
    }
  });

  // Escalation Event Definition
  const escalationEvents = [
    'bpmn:StartEvent',
    'bpmn:BoundaryEvent',
    'bpmn:IntermediateThrowEvent',
    'bpmn:EndEvent',
  ];

  escalationEvents.forEach(function(event) {
    if (is(element, event)) {

      const showEscalationCodeconstiable = is(element, 'bpmn:StartEvent') ||
        is(element, 'bpmn:BoundaryEvent');

      // get business object
      const escalationEventDefinition = defaultEventDefinitionHelper.getEscalationEventDefinition(
        element);

      if (escalationEventDefinition) {
        escalation(group, element, bpmnFactory, escalationEventDefinition,
          showEscalationCodeconstiable,
          translate);
      }
    }

  });

  // Timer Event Definition
  const timerEvents = [
    'bpmn:StartEvent',
    'bpmn:BoundaryEvent',
    'bpmn:IntermediateCatchEvent',
  ];

  timerEvents.forEach(function(event) {
    if (is(element, event)) {

      // get business object
      const timerEventDefinition = defaultEventDefinitionHelper.getTimerEventDefinition(
        element);

      if (timerEventDefinition) {
        timer(group, element, bpmnFactory, timerEventDefinition, translate);
      }
    }
  });

  // Compensate Event Definition
  const compensationEvents = [
    'bpmn:EndEvent',
    'bpmn:IntermediateThrowEvent',
  ];

  compensationEvents.forEach(function(event) {
    if (is(element, event)) {

      // get business object
      const compensateEventDefinition = defaultEventDefinitionHelper.getCompensateEventDefinition(
        element);

      if (compensateEventDefinition) {
        compensation(group, element, bpmnFactory, compensateEventDefinition,
          elementRegistry, translate);
      }
    }
  });

  // Conditional Event Definition
  const conditionalEvents = [
    'bpmn:StartEvent',
    'bpmn:BoundaryEvent',
    'bpmn:IntermediateThrowEvent',
    'bpmn:IntermediateCatchEvent',
  ];

  if (isAny(element, conditionalEvents)) {

    // get business object
    const conditionalEventDefinition = defaultEventDefinitionHelper.getConditionalEventDefinition(
      element);

    if (conditionalEventDefinition) {
      condition(group, element, bpmnFactory, conditionalEventDefinition,
        elementRegistry, translate);
    }
  }

}

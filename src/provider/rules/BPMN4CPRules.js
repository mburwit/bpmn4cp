import BpmnRules from 'bpmn-js/lib/features/rules/BpmnRules';

import inherits from 'inherits';

import { is } from 'bpmn-js/lib/util/ModelUtil';
import { every } from 'min-dash';

const HIGH_PRIORITY = 1500;

/**
 * BPMN specific modeling rule
 */
export default function BPMN4CPRules(eventBus) {
  BpmnRules.call(this, eventBus);
}

inherits(BPMN4CPRules, BpmnRules);

BPMN4CPRules.prototype.init = function() {

  BpmnRules.prototype.init.call(this);

  this.addRule('connection.create', HIGH_PRIORITY, function(context) {
    const source = context.source,
      target = context.target;

    return canConnect(source, target);
  });

  this.addRule('shape.resize', HIGH_PRIORITY, function(context) {
    const shape = context.shape,
      newBounds = context.newBounds;

    return canResize(shape, newBounds);
  });

  this.addRule('connection.reconnect', HIGH_PRIORITY, function(context) {
    const connection = context.connection,
      source = context.source,
      target = context.target;

    return canConnect(source, target, connection);
  });

  this.addRule('elements.create', HIGH_PRIORITY, function(context) {
    const elements = context.elements,
      position = context.position,
      target = context.target;

    return every(elements, function(element) {
      if (isConnection(element)) {
        return canConnect(element.source, element.target, element);
      }

      if (element.host) {
        return BPMN4CPRules.prototype.canAttach(element, element.host, null, position);
      }

      return BPMN4CPRules.prototype.canCreate(element, target, null, position);
    });
  });
};

// Customizations
BPMN4CPRules.prototype.canConnectAssociation = canConnectAssociation;
BPMN4CPRules.prototype.canConnect = canConnect;
BPMN4CPRules.prototype.canResize = canResize;
// Defaults
BPMN4CPRules.prototype.canConnectMessageFlow = BpmnRules.prototype.canConnectMessageFlow;
BPMN4CPRules.prototype.canConnectSequenceFlow = BpmnRules.prototype.canConnectSequenceFlow;
BPMN4CPRules.prototype.canConnectDataAssociation = BpmnRules.prototype.canConnectDataAssociation;
BPMN4CPRules.prototype.canMove = BpmnRules.prototype.canMove;
BPMN4CPRules.prototype.canAttach = BpmnRules.prototype.canAttach;
BPMN4CPRules.prototype.canReplace = BpmnRules.prototype.canReplace;
BPMN4CPRules.prototype.canDrop = BpmnRules.prototype.canDrop;
BPMN4CPRules.prototype.canInsert = BpmnRules.prototype.canInsert;
BPMN4CPRules.prototype.canCreate = BpmnRules.prototype.canCreate;
BPMN4CPRules.prototype.canCopy = BpmnRules.prototype.canCopy;

function canConnect(source, target, connection) {

  // despite associations, deny all other connections from/to
  // observation features, goal states and QIs
  if (isObservationFeature(source) || isObservationFeature(target)
    || isGoalState(source) || isGoalState(target) || isQualityIndicator(source) ||isQualityIndicator(target)) {
    if (canConnectAssociation(source, target)) {
      return {
        type: 'bpmn:Association',
      };
    } else {
      return false;
    }
  }

  // otherwise make default check
  return BpmnRules.prototype.canConnect.call(this, source,
    target, connection);
}

function canResize(shape, newBounds) {
  if (isObservationFeature(shape)) {
    return false;
  }
  if (isGoalState(shape)) {
    return false;
  }
  return !!BpmnRules.prototype.canResize.call(this, shape, newBounds);
}

function canConnectAssociation(source, target) {
  // allow connection of associations from/to observation features
  if (isObservationFeature(source)) {
    return canConnectObservationFeature(target);
  }
  if (isObservationFeature(target)) {
    return canConnectObservationFeature(source);
  }
  // allow connection of associations from/to goal states
  if (isGoalState(source)) {
    return canConnectGoalState(target);
  }
  if (isGoalState(target)) {
    return canConnectGoalState(source);
  }
  // allow connection of associations from/to quality indicators
  if (isQualityIndicator(source)) {
    return canConnectQI(target);
  }
  if (isQualityIndicator(target)) {
    return canConnectQI(source);
  }
  // enable default connections
  return !!BpmnRules.prototype.canConnectAssociation.call(this, source, target);
}

/**
 * Check, whether one side of the relationship
 * is an observation feature.
 */
function canConnectObservationFeature(target) {
  // return is(target, 'bpmn:Activity');
  return false;
}

/**
 * Check, whether one side of the relationship
 * is an observation feature.
 */
function canConnectGoalState(target) {
  return is(target, 'bpmn:Activity')
    || is(target, 'cp:QualityIndicator')
    || is(target, 'bpmn:TextAnnotation')
    || ((is(target, 'bpmn:CatchEvent') &&
      target.businessObject.eventDefinitions &&
      is(target.businessObject.eventDefinitions[0],
        'bpmn:ConditionalEventDefinition'))
      || (is(target, 'bpmn:EventBasedGateway')));
}

/**
 * Check, whether the other side of the relationship
 * is a FlowElement.
 */
function canConnectQI(target) {
  return is(target, 'bpmn:FlowElement')
    || is(target, 'bpmn:TextAnnotation');
}

/**
 * Utility functions for rule checking
 */

function isConnection(element) {
  return element.waypoints;
}

function isObservationFeature(element) {
  return is(element, 'cp:ObservationFeature');
}

function isGoalState(element) {
  return is(element, 'cp:GoalState');
}

function isQualityIndicator(element) {
  return is(element, 'cp:QualityIndicator');
}

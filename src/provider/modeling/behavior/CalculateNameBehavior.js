import inherits from 'inherits';
import CommandInterceptor from 'diagram-js/lib/command/CommandInterceptor';
import { getBusinessObject, is } from 'bpmn-js/lib/util/ModelUtil';
import { isAny } from 'bpmn-js/lib/features/modeling/util/ModelingUtil';

const extensionElementsHelper = require(
  'bpmn-js-properties-panel/lib/helper/ExtensionElementsHelper'),
  cmdHelper = require('bpmn-js-properties-panel/lib/helper/CmdHelper');

const PRIORITY = 1500;

const CP_OBSERVATION_FEATURE = 'cp:ObservationFeature';
const CP_OBSERVATION_ELEMENT = 'cp:Observation';
const CP_GOAL_STATE = 'cp:GoalState';
const CP_GOAL_ELEMENT = 'cp:Goal';

export default function CalculateNameBehavior(eventBus, commandStack) {
  CommandInterceptor.call(this, eventBus);

  function getObservations(bo, type) {
    return bo && extensionElementsHelper.getExtensionElements(bo, type) || [];
  }

  function getExtensionElementType(elem) {

    if (is(elem, CP_OBSERVATION_FEATURE)) {
      return CP_OBSERVATION_ELEMENT;
    }
    if (is(elem, CP_GOAL_STATE)) {
      return CP_GOAL_ELEMENT;
    }
  }

  function calculateName(element) {
    const bo = getBusinessObject(element);
    let name = '';
    const extensionType = getExtensionElementType(element);
    if (bo) {
      getObservations(bo, extensionType).forEach(observation => {
        if (name !== '') {
          name += '\n';
        }
        name += observation.get('name');
        const defaultValue = observation.get('defaultValue');
        if (defaultValue) {
          name += ' [' + defaultValue + ']';
        }
      });
    }
    return name;
  }

  // calculate name of ObservationFeature and GoalState, if the one of the
  // observations/goals in their list has changed
  this.postExecute('properties-panel.update-businessobject', PRIORITY,
    function(event) {
      const context = event.context,
        elem = context.element,
        businessObject = context.businessObject;
      if ((is(elem, CP_OBSERVATION_FEATURE) &&
        is(businessObject, CP_OBSERVATION_ELEMENT)) ||
        (is(elem, CP_GOAL_STATE) && is(businessObject, CP_GOAL_ELEMENT))) {
        const commandToExecute = cmdHelper.updateProperties(
          elem,
          { name: calculateName(elem) });
        commandStack.execute(
          commandToExecute.cmd,
          commandToExecute.context);
      }
    });

  // calculate name of ObservationFeature and GoalState, if their list of
  // observations/goals has changed
  this.postExecute('properties-panel.update-businessobject-list', PRIORITY,
    function(event) {
      const elem = event.context.element;
      if (isAny(elem, [CP_OBSERVATION_FEATURE, CP_GOAL_STATE])) {
        const commandToExecute = cmdHelper.updateProperties(
          elem,
          { name: calculateName(elem) });
        commandStack.execute(
          commandToExecute.cmd,
          commandToExecute.context);
      }
    },
  );

  // disable direct label editing for ObservationFeatures and GoalStates
  eventBus.on('element.dblclick', PRIORITY,
    function(event) {
      const elem = event.element;

      if (isAny(elem, [CP_OBSERVATION_FEATURE, CP_GOAL_STATE])) {
        return false; // will cancel event
      }
    },
  );
}

CalculateNameBehavior.$inject = [
  'eventBus',
  'commandStack',
];

inherits(CalculateNameBehavior, CommandInterceptor);

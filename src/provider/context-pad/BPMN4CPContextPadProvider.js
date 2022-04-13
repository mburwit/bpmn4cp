import inherits from 'inherits';
import _ from 'lodash';
import ContextPadProvider
  from 'bpmn-js/lib/features/context-pad/ContextPadProvider';
import { is } from 'bpmn-js/lib/util/ModelUtil';
import { assign } from 'min-dash';

/**
 * A provider for BPMN 2.0 elements context pad.
 *
 * This is the context pad menu, that shows up next to a modeled element when
 * this was selected. It provides the possible next modelling elements, as well
 * as delete, connect and options functions.
 */
export default function BPMN4CPContextPadProvider(
  config, injector, eventBus,
  contextPad, modeling, elementFactory,
  connect, create, popupMenu,
  canvas, rules, translate) {

  ContextPadProvider.call(this, config, injector, eventBus,
    contextPad, modeling, elementFactory,
    connect, create, popupMenu,
    canvas, rules, translate);

  const getDefaultContextPadEntries = _.bind(this.getContextPadEntries, this);

  let autoPlace;
  if (config.autoPlace !== false) {
    autoPlace = injector.get('autoPlace', false);
  }

  /**
   * This function determines the content of the ContextPad for a given element.
   * @param element
   */
  this.getContextPadEntries = function(element) {
    const actions = getDefaultContextPadEntries(element);

    if (element.type === 'label') {
      return actions;
    }

    const businessObject = element.businessObject;

    // TODO: continue with custom context pad entries here

    // enable appending goal states to conditional events, event-based gateways and actions
    if ((is(businessObject, 'bpmn:CatchEvent') &&
      businessObject.eventDefinitions &&
      is(businessObject.eventDefinitions[0],
        'bpmn:ConditionalEventDefinition'))
      || (is(businessObject, 'bpmn:EventBasedGateway'))
    || (is(businessObject, 'bpmn:Activity'))) {
      assign(actions, {
        'append.goal-state': appendAction('cp:GoalState',
          'bpmn4cp-icon-target'),
      });
    }

    return actions;
  };

  /**
   * Create an append action
   *
   * @param {String} type
   * @param {String} className
   * @param {String} [title]
   * @param {Object} [options]
   *
   * @return {{action: {dragstart: appendStart, click: ((function(...[*]=))|appendStart)}, className: String, title: String, group: string}} descriptor
   */
  function appendAction(type, className, title, options) {

    if (typeof title !== 'string') {
      options = title;
      title = translate('Append {type}', { type: type.replace(/^cp:/, '') });
    }

    function appendStart(event, element) {

      const shape = elementFactory.createShape(assign({ type: type }, options));
      create.start(event, shape, {
        source: element,
      });
    }

    const append = autoPlace ? function(event, element) {
      const shape = elementFactory.createShape(assign({ type: type }, options));

      autoPlace.append(element, shape);
    } : appendStart;

    return {
      group: 'model',
      className: className,
      title: title,
      action: {
        dragstart: appendStart,
        click: append,
      },
    };
  }
}

inherits(BPMN4CPContextPadProvider, ContextPadProvider);

import inherits from 'inherits';

import CommandInterceptor from 'diagram-js/lib/command/CommandInterceptor';

const PRIORITY = 1500;

/**
 * A component that makes sure that external labels are added
 * together with respective elements and properly updated (DI wise)
 * during move.
 *
 * @param {EventBus} eventBus
 * @param {Modeling} modeling
 * @param {BpmnFactory} bpmnFactory
 * @param {TextRenderer} textRenderer
 */
export default function I18NLabelBehavior(
    eventBus, modeling, bpmnFactory,
    textRenderer) {

  CommandInterceptor.call(this, eventBus);

  // update label if name property was updated
  this.postExecute('element.updateProperties', PRIORITY, function(e) {
    console.log(e);
  });
}

inherits(I18NLabelBehavior, CommandInterceptor);

I18NLabelBehavior.$inject = [
  'eventBus',
  'modeling',
  'bpmnFactory',
  'textRenderer'
];
import inherits from 'inherits';

import CommandInterceptor from 'diagram-js/lib/command/CommandInterceptor';
import {
    getLabel
} from 'bpmn-js/lib/features/label-editing/LabelUtil';

/**
 * A component that makes sure that each created or updated
 * Pool and Lane is assigned an isHorizontal property set to true.
 *
 * @param {EventBus} eventBus
 * @param {CommandStack} commandStack
 */
export default function LabelUpdateBehavior(
    eventBus, commandStack) {

    CommandInterceptor.call(this, eventBus);

    this.postExecute(['properties-panel.update-businessobject-list', 'properties-panel.update-businessobject'], function (event) {
        // update label
        commandStack.execute('element.updateLabel', {
            element: event.context.element,
            newLabel: getLabel(event.context.element)
        });
    });
}

LabelUpdateBehavior.$inject = [
    'eventBus',
    'commandStack'
];

inherits(LabelUpdateBehavior, CommandInterceptor);

import inherits from 'inherits';

import CommandInterceptor from 'diagram-js/lib/command/CommandInterceptor';
import {getBusinessObject, is} from 'bpmn-js/lib/util/ModelUtil';
import {intersects} from "../../../draw/BPMNDIHelper";

const actorHelper = require('../../propertiesProvider/tabs/actorTab/helper/ActorHelper');

/**
 * A component that makes sure that each created or updated
 * Pool and Lane is assigned an isHorizontal property set to true.
 *
 * @param {EventBus} eventBus
 * @param {CommandStack} commandStack
 * @param {ElementRegistry} elementRegistry
 * @param {BpmnFactory} bpmnFactory
 */
export default function ActorUpdateInterceptor(
    eventBus, commandStack, elementRegistry, bpmnFactory) {

    CommandInterceptor.call(this, eventBus);

    // TODO: revise interception handling, when actors are edited at Activity level

    // Group actors can be edited and override all activity actors
    // intercept moving, creating, resizing and deleting groups
    this.postExecute(['shape.move', 'shape.create', 'shape.resize', 'shape.delete'], function (event) {
        const bo = getBusinessObject(event.context.shape);
        if (is(bo, 'bpmn:Group')) {
            // update the actors of all activities
            elementRegistry.filter((element) => {
                return is(element, 'bpmn:Activity');
            }).forEach((activity) => {
                const command = actorHelper.handleGroupActivityIntersection(
                    elementRegistry.filter((element) => {
                        return is(element, 'bpmn:Group') && element.type !== "label" && intersects(element, activity);
                    }),
                    getBusinessObject(activity),
                    bpmnFactory
                );
                commandStack.execute(command.cmd, command.context);
            })
        }
        // else if (is(bo, 'bpmn:Activity')) {
        //     // update the actors of the moved/created/resized activity
        //     handleGroupActivityIntersection(
        //         elementRegistry.filter((element) => {
        //             return is(element, 'bpmn:Group') && element.type !== "label" && intersects(element, bo);
        //         }),
        //         getBusinessObject(bo)
        //     );
        // }
    });

    // Group actors can be edited and override all activity actors
    // intercept updating the extensionElements property of a group
    this.postExecute(['properties-panel.update-businessobject-list'], function (event) {
        const group = getBusinessObject(event.context.element);
        if (is(group, 'bpmn:Group') && is(event.context.currentObject, "bpmn:ExtensionElements")) {
            // update the actors of all activities, that intersect the updated group
            elementRegistry.filter((activity) => {
                return is(activity, 'bpmn:Activity') && intersects(activity, group);
            }).forEach((activity) => {
                const command = actorHelper.handleGroupActivityIntersection(
                    elementRegistry.filter((element) => {
                        return is(element, 'bpmn:Group') && element.type !== "label" && intersects(element, activity);
                    }),
                    getBusinessObject(activity),
                    bpmnFactory
                );
                commandStack.execute(command.cmd, command.context);
            })
        }
    });

}

ActorUpdateInterceptor.$inject = [
    'eventBus',
    'commandStack',
    'elementRegistry',
    'bpmnFactory'
];

inherits(ActorUpdateInterceptor, CommandInterceptor);

import {
    assign
} from 'min-dash';

import {
    getLabel,
    setLabel
} from './LabelUtil';

import {
    is
} from 'bpmn-js/lib/util/ModelUtil';

import {isAny} from 'bpmn-js/lib/features/modeling/util/ModelingUtil';
import {isExpanded} from 'bpmn-js/lib/util/DiUtil';

import {
    isLabelExternal,
} from 'bpmn-js/lib/util/LabelUtil';
import inherits from "inherits";
import LabelEditingProvider from "bpmn-js/lib/features/label-editing/LabelEditingProvider";
import _ from "lodash";

export default function I18NLabelEditingProvider(
    eventBus, commandStack, bpmnFactory, canvas, directEditing,
    modeling, resizeHandles, textRenderer) {

    LabelEditingProvider.call(this, eventBus, bpmnFactory, canvas, directEditing,
        modeling, resizeHandles, textRenderer);

    /**
     * Activate direct editing for activities and text annotations.
     *
     * @param  {djs.model.Base} element
     *
     * @return {Object} an object with properties bounds (position and size), text and options
     */
    this.activate = function (element) {

        // text
        const text = getLabel(element);

        if (text === undefined) {
            return;
        }

        const context = {
            text: text
        };

        // bounds
        const bounds = this.getEditingBBox(element);

        assign(context, bounds);

        const options = {};

        // tasks
        if (
            isAny(element, [
                'bpmn:Task',
                'bpmn:Participant',
                'bpmn:Lane',
                'bpmn:CallActivity'
            ]) ||
            isCollapsedSubProcess(element)
        ) {
            assign(options, {
                centerVertically: true
            });
        }

        // external labels
        if (isLabelExternal(element)) {
            assign(options, {
                autoResize: true
            });
        }

        // text annotations
        if (is(element, 'bpmn:TextAnnotation')) {
            assign(options, {
                resizable: true,
                autoResize: true
            });
        }

        assign(context, {
            options: options
        });

        return context;
    };

    const defaultUpdate = _.bind(this.update, this);

    this.update = function (
        element, newLabel,
        activeContextText, bounds) {

        defaultUpdate(element, newLabel, activeContextText, bounds);

        const commands = setLabel(element, newLabel, bpmnFactory, commandStack);
        if (Array.isArray(commands)) {
            commands.forEach(command => {
                commandStack.execute(
                    command.cmd,
                    command.context
                );
            })
        }

    };
}

I18NLabelEditingProvider.$inject = [
    'eventBus',
    'commandStack',
    'bpmnFactory',
    'canvas',
    'directEditing',
    'modeling',
    'resizeHandles',
    'textRenderer'
];
inherits(I18NLabelEditingProvider, LabelEditingProvider);

// helpers //////////////////////

function isCollapsedSubProcess(element) {
    return is(element, 'bpmn:SubProcess') && !isExpanded(element);
}
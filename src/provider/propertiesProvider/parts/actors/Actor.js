'use strict';

import {getBusinessObject, is} from 'bpmn-js/lib/util/ModelUtil';

const extensionElementsEntry = require(
        'bpmn-js-properties-panel/lib/provider/camunda/parts/implementation/ExtensionElements'),
    extensionElementsHelper = require(
        'bpmn-js-properties-panel/lib/helper/ExtensionElementsHelper'),
    cmdHelper = require('bpmn-js-properties-panel/lib/helper/CmdHelper'),
    elementHelper = require('bpmn-js-properties-panel/lib/helper/ElementHelper'),
    actorHelper = require('./ActorHelper');

export default function (element, bpmnFactory, options, translate) {

    let bo;

    const result = {
        getSelectedActor: getSelectedActor,
    };

    result.entries = [];

    let actorEntry;

    function getSelectedActor(elem, node) {
        const selection = (actorEntry &&
            actorEntry.getSelected(elem, node)) || {idx: -1};

        return actorHelper.getActors(bo)[selection.idx];
    }

    function setOptionLabelValue() {
        return function (elem, node, option, property, value, idx) {
            const actors = actorHelper.getActors(bo);
            const actor = actors[idx];
            option.text = (actor.get('name')) ?
                translate(actor.get('name')) :
                '<undefined>';
        };
    }

    function newElement(elem, initialActorName) {
        return function (e, extensionElements) {
            const props = {
                name: initialActorName,
            };

            const newElem = elementHelper.createElement('cp:Actor', props,
                extensionElements, bpmnFactory);

            return cmdHelper.addElementsTolist(e, extensionElements, 'values',
                [newElem]);
        };
    }

    function removeElement(bo) {
        return function (e, extensionElements, value, idx) {
            const actors = actorHelper.getActors(bo);
            const actor = actors[idx];
            if (actor) {
                return extensionElementsHelper.removeEntry(bo, e, actor);
            }
        };
    }

    bo = getBusinessObject(element);

    if (bo) {

        if (is(bo, 'bpmn:Activity')) {
            actorEntry = extensionElementsEntry(element, bpmnFactory, {
                id: 'actors',
                label: translate('Actors'),
                modelProperty: 'name',
                idGeneration: 'false',

                createExtensionElement: newElement(element,
                    'undefined'),
                removeExtensionElement: removeElement(bo),

                getExtensionElements: function () {
                    return actorHelper.getActors(bo);
                },

                setOptionLabelValue: setOptionLabelValue(),

            });
        } else if (is(bo, 'bpmn:Group')) {
            const categoryValueRef = bo.categoryValueRef;
            actorEntry = extensionElementsEntry(categoryValueRef, bpmnFactory, {
                id: 'actors',
                label: translate('Actors'),
                modelProperty: 'name',
                idGeneration: 'false',

                createExtensionElement: newElement(element,
                    'undefined'),
                removeExtensionElement: removeElement(categoryValueRef),

                getExtensionElements: function () {
                    return actorHelper.getActors(categoryValueRef);
                },

                setOptionLabelValue: setOptionLabelValue(),

            });
        }
        result.entries.push(actorEntry);

    }
    // }

    return result;

}
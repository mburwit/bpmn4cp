import addReferenceSelect from './referenceTab/ReferenceList'
import referenceDetails from "./referenceTab/ReferenceDetails";

function createReferenceTabGroups(
    element, bpmnFactory, canvas, elementRegistry, modeling, commandStack, translate) {

    const referenceListGroup = {
        id: 'references',
        label: translate('References'),
        entries: []
    };

    const references = addReferenceSelect(referenceListGroup, canvas, element, bpmnFactory, commandStack, elementRegistry, translate);

    const referenceDetailGroup = {
        id: 'reference-details',
        entries: [],
        enabled: function (elem, node) {
            return references.getSelectedReference(elem, node) !== undefined;
        },
        label: translate('Reference Details'),
    };

    referenceDetails(referenceDetailGroup, element, bpmnFactory, commandStack, references, translate);

    return [
        referenceListGroup,
        referenceDetailGroup
    ];
}

export const referenceTab = (
    element, bpmnFactory, canvas, elementRegistry, modeling, commandStack, translate, eventBus) => {
    return {
        id: 'references',
        label: translate('References'),
        groups: createReferenceTabGroups(element, bpmnFactory, canvas,
            elementRegistry, modeling, commandStack, translate),
    }
};
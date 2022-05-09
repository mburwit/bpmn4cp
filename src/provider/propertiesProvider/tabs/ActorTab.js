import actorsProps from "./actorTab/ActorList";
import actorDetails from "./actorTab/ActorDetails";

function createActorTabGroups(
    element, bpmnFactory, canvas, elementRegistry, modeling, commandStack, translate) {

    const actorsGroup = {
        id: 'actors',
        label: 'Actors',
        entries: []
    };

    const options = actorsProps(actorsGroup, element, bpmnFactory,
        translate);

    const actorDetailsGroup = {
        id: 'actor-details',
        entries: [],
        enabled: function (elem, node) {
            return options.getSelectedActor(elem, node);
        },
        label: 'Actor Details',
    };

    actorDetails(actorDetailsGroup, element, bpmnFactory, commandStack, options,
        translate);
    return [
        actorsGroup,
        actorDetailsGroup
    ];
}

export const actorsTab = (
    element, bpmnFactory, canvas, elementRegistry, modeling, commandStack, translate) => {
    return {
        id: 'actors',
        label: 'Actors',
        groups: createActorTabGroups(element, bpmnFactory, canvas,
            elementRegistry, modeling, commandStack, translate),
    }
};
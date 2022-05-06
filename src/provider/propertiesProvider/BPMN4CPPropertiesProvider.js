import inherits from 'inherits';
import {is, isAny} from 'bpmn-js/lib/util/ModelUtil';
import PropertiesActivator
    from 'bpmn-js-properties-panel/lib/PropertiesActivator';
// Require all properties you need from existing providers.
// In this case all available bpmn relevant properties without camunda extensions.
import processProps
    from 'bpmn-js-properties-panel/lib/provider/bpmn/parts/ProcessProps';
import eventProps
    from './parts/EventProps';
import linkProps
    from 'bpmn-js-properties-panel/lib/provider/bpmn/parts/LinkProps';
import documentationProps
    from 'bpmn-js-properties-panel/lib/provider/bpmn/parts/DocumentationProps';
import idProps from 'bpmn-js-properties-panel/lib/provider/bpmn/parts/IdProps';
import nameProps
    from 'bpmn-js-properties-panel/lib/provider/bpmn/parts/NameProps';
import observationProps from './parts/ObservationProps';
import observationDetails from './parts/ObservationDetailProps';
import actorsProps from './parts/actors/ActorProps';
import actorDetails from './parts/actors/ActorDetailProps';
import activityProps from './parts/ActivityProps';
import subProcessProps from './parts/SubProcessProps';
import qualityIndicatorProperties from './parts/QualityIndicatorProperties';

import colorPicker from './parts/ColorPicker'

const CP_OBSERVATION_FEATURE = 'cp:ObservationFeature';
const CP_GOAL_STATE = 'cp:GoalState';

function observationTabGroupLabel(elem, translate) {
    if (is(elem, CP_OBSERVATION_FEATURE)) {
        return translate('Observations');
    }
    if (is(elem, CP_GOAL_STATE)) {
        return translate('Observations and Goals');
    }
}

// The general tab contains all bpmn relevant properties.
// The properties are organized in groups.
function createGeneralTabGroups(
    element, bpmnFactory, canvas, elementRegistry, translate) {

    const generalGroup = {
        id: 'general',
        label: 'General',
        entries: [],
    };
    idProps(generalGroup, element, translate);

    if (!(is(element, CP_OBSERVATION_FEATURE)
        // || is(element, CP_GOAL_STATE)
    )) {
        nameProps(generalGroup, element, bpmnFactory, canvas, translate);
    }
    activityProps(generalGroup, element, translate);
    subProcessProps(generalGroup, element, translate);
  qualityIndicatorProperties(generalGroup, element, bpmnFactory, translate);
  processProps(generalGroup, element, translate);

    const observationGroup = {
        id: 'observations',
        label: observationTabGroupLabel(element, translate),
        entries: [],
        enabled: function (elem) {
            return (is(elem, CP_OBSERVATION_FEATURE) || is(elem, CP_GOAL_STATE));
        },
    };

    const options = observationProps(observationGroup, element, bpmnFactory,
        translate);

    function observationDetailsGroupLabel(elem) {
        if (is(elem, CP_OBSERVATION_FEATURE)) {
            return translate('Observation Details');
        }
        if (is(elem, CP_GOAL_STATE)) {
            return translate('Details');
        }
    }

    const observationDetailsGroup = {
        id: 'observation-details',
        entries: [],
        enabled: function (elem, node) {
            return options.getSelectedObservation(elem, node);
        },
        label: observationDetailsGroupLabel(element),
    };

    observationDetails(observationDetailsGroup, element, bpmnFactory, options,
        translate);

    const detailsGroup = {
        id: 'details',
        label: 'Details',
        entries: [],
    };
    linkProps(detailsGroup, element, translate);
    eventProps(detailsGroup, element, bpmnFactory, elementRegistry, translate);

    const documentationGroup = {
        id: 'documentation',
        label: 'Documentation',
        entries: [],
    };

    documentationProps(documentationGroup, element, bpmnFactory, translate);

    return [
        generalGroup,
        observationGroup,
        observationDetailsGroup,
        detailsGroup,
        documentationGroup,
    ];
}

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

function createColorTabGroups(
    element, bpmnFactory, canvas, elementRegistry, modeling, translate) {
    const colorGroup = {
        id: 'colorGroup',
        label: 'Colors',
        entries: [],
    };
    colorPicker(colorGroup, element, modeling, translate);
    return [
        colorGroup
    ];
}

export default function BPMN4CPPropertiesProvider(
    bpmnFactory,
    canvas,
    elementRegistry,
    eventBus,
    modeling,
    translate,
    commandStack) {
    PropertiesActivator.call(this, eventBus);

    this.getTabs = function (element) {

        const generalTab = {
            id: 'general',
            label: 'General',
            groups: createGeneralTabGroups(element, bpmnFactory, canvas,
                elementRegistry, translate),
        };
        const tabs = [
            generalTab
        ];

        // TODO: enable Actors Tab for Activities
        // if (isAny(element, ["bpmn:Group", "bpmn:Activity"])) {
        if (isAny(element, ["bpmn:Group"])) {
            const actorsTab = {
                id: 'actors',
                label: 'Actors',
                groups: createActorTabGroups(element, bpmnFactory, canvas,
                    elementRegistry, modeling, commandStack, translate),
            };
            tabs.push(actorsTab);
        }

        if (element.businessObject.di) {
            const colorTab = {
                id: 'color',
                label: 'Colors',
                groups: createColorTabGroups(element, bpmnFactory, canvas,
                    elementRegistry, modeling, translate),
            };
            tabs.push(colorTab);
        }

        return tabs;
    };
}

inherits(BPMN4CPPropertiesProvider, PropertiesActivator);

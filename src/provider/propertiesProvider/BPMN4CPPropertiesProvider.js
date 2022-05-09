import inherits from 'inherits';
import {isAny} from 'bpmn-js/lib/util/ModelUtil';
import PropertiesActivator from 'bpmn-js-properties-panel/lib/PropertiesActivator';
import {generalTab} from "./tabs/GeneralTab";
import {actorsTab} from "./tabs/ActorTab";
import {colorTab} from "./tabs/ColorTab";

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
        const tabs = [
            generalTab(element, bpmnFactory, canvas,
                elementRegistry, translate)
        ];

        // TODO: enable Actors Tab for Activities
        // if (isAny(element, ["bpmn:Group", "bpmn:Activity"])) {
        if (isAny(element, ["bpmn:Group"])) {
            tabs.push(
                actorsTab(element, bpmnFactory, canvas,
                elementRegistry, modeling, commandStack, translate)
            );
        }

        if (element.businessObject.di) {
            tabs.push(
                colorTab(element, bpmnFactory, canvas,
                    elementRegistry, modeling, translate)
            );
        }

        return tabs;
    };
}

inherits(BPMN4CPPropertiesProvider, PropertiesActivator);

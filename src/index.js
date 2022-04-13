import inherits from 'inherits';
import Modeler from "bpmn-js/lib/Modeler";
import PropertiesPanelModule from "bpmn-js-properties-panel";
import {default as PropertiesProviderModule} from "./provider/propertiesProvider"
import {default as ContextPadProviderModule} from "./provider/context-pad"
import {default as PopupMenuProviderModule} from "./provider/popup-menu"
import {default as ModelingModule} from "./provider/modeling"
import {default as AutoPlaceModule} from "./provider/auto-place"
import {default as DrawModule} from "./draw"
import {default as Bpmn4cpRules} from "./provider/rules"
import {METAMODEL} from "./descriptors/metamodel";

/**
 * A viewer that includes mouse navigation and other goodies.
 *
 * @param {Object} options
 */
export function BpmnModeler(options) {
    options.additionalModules = [
        PropertiesPanelModule,
        PropertiesProviderModule,
        ContextPadProviderModule,
        PopupMenuProviderModule,
        ModelingModule,
        AutoPlaceModule,
        DrawModule,
        Bpmn4cpRules
    ].concat(options.additionalModules)
    options.moddleExtensions = Object.assign({
        cp: METAMODEL
    }, options.moddleExtensions);
    Modeler.call(this, options);
}

inherits(BpmnModeler, Modeler);
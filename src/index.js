import inherits from 'inherits';
import Modeler from "bpmn-js/lib/Modeler";
import PropertiesPanelModule from "bpmn-js-properties-panel";
import {default as propertiesPanel} from "./propertiesPanel"
import {default as DrawModule} from "./draw"
import {CP_METAMODEL} from "./descriptors/CP_METAMODEL";
import {I18N_METAMODEL} from "./descriptors/I18N_METAMODEL";
import {default as importModule} from './import';
import {
    autoPlaceModule,
    contextPadProviderModule,
    modelingModule,
    popupMenuProviderModule,
    bpmn4cpRules,
    labelEditingModule,
    searchModule
} from "./features";

/**
 * A viewer that includes mouse navigation and other goodies.
 *
 * @param {Object} options
 */
export function BpmnModeler(options) {
    options.additionalModules = [
        PropertiesPanelModule,
        propertiesPanel,
        contextPadProviderModule,
        popupMenuProviderModule,
        modelingModule,
        autoPlaceModule,
        DrawModule,
        bpmn4cpRules,
        labelEditingModule,
        searchModule,
        importModule
    ].concat(options.additionalModules)
    options.moddleExtensions = Object.assign({
        cp: CP_METAMODEL,
        i18n: I18N_METAMODEL
    }, options.moddleExtensions);
    Modeler.call(this, options);
}

inherits(BpmnModeler, Modeler);
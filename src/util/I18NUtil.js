import {getBusinessObject, is} from "bpmn-js/lib/util/ModelUtil";
import elementHelper from "bpmn-js-properties-panel/lib/helper/ElementHelper";
import cmdHelper from "bpmn-js-properties-panel/lib/helper/CmdHelper";
import {ExtensionElementsHelper} from "../propertiesPanel/parts/helper/ExtensionElementsHelper";

const defaultLang = "en";

function newTranslation(elem, extensionElements, propertyName, values, lang, bpmnFactory) {
    const translationProps = {
        lang: lang,
        target: '@' + propertyName,
        value: values[propertyName] || values
    };
    const newTranslation = elementHelper.createElement("i18n:Translation", translationProps,
        extensionElements, bpmnFactory);
    return cmdHelper.addElementsTolist(elem, extensionElements, 'values',
        [newTranslation]);
}

export function i18nDefaultGet(propertyName, currentLang) {
    return function (element) {
        currentLang = currentLang || window.currentLang || defaultLang;
        const result = {};
        const bo = getBusinessObject(element);
        // check existing translations of the property
        const translations = ExtensionElementsHelper.getExtensionElements(bo, "i18n:Translation").filter(t => {
                return t.get("target") === '@' + propertyName;
            }
        );
        if (translations.length > 0) {
            // find the translation for the specified language, if not present, return the first translation
            const translation = translations.find(t => {
                    return t.get("lang") === currentLang;
                }
            ) || translations[0];
            result[propertyName] = translation.get("value");
        } else {
            // if no translations available, get the raw property value
            result[propertyName] = bo.get(`${propertyName}`);
        }
        return result;
    }
}

export function i18nDefaultSet(propertyName, bpmnFactory, currentLang) {
    return function (element, values) {
        currentLang = currentLang || window.currentLang || defaultLang;
        const bo = getBusinessObject(element);
        let extensionElements = bo.get('extensionElements');

        const commands = [];
        let otherExtensions = [];
        if (extensionElements) {
            otherExtensions = ExtensionElementsHelper.getExtensionElements(bo)
                .filter(e => {
                    return !is(e, 'i18n:Translation') || !(e.get("lang") === currentLang && e.get("target") === '@' + propertyName);
                });
        }
        // create extensionElements root
        extensionElements = elementHelper.createElement('bpmn:ExtensionElements', {values: otherExtensions}, bo, bpmnFactory);
        commands.push(cmdHelper.updateBusinessObject(element, bo, {extensionElements: extensionElements}));
        // create new translation extension
        commands.push(newTranslation(element, extensionElements, propertyName, values, currentLang, bpmnFactory));
        // update label
        commands.push({
            cmd: 'element.updateLabel',
            context: {
                element: element,
                newLabel: values[propertyName] || values
            }
        })
        return commands;
    }
}
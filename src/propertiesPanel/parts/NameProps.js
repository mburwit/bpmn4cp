const nameEntryFactory = require('bpmn-js-properties-panel/lib/provider/bpmn/parts/implementation/Name');
import {createCategoryValue} from 'bpmn-js-properties-panel/lib/helper/CategoryHelper';
import {is, getBusinessObject} from 'bpmn-js/lib/util/ModelUtil';
import {i18nDefaultGet, i18nDefaultSet} from "../../util/I18NUtil";

export default  function (group, element, bpmnFactory, canvas, translate, options) {
    if (!options) {
        options = {};
    }

    function initializeCategory(semantic) {
        const rootElement = canvas.getRootElement(),
            definitions = getBusinessObject(rootElement).$parent;

        semantic.categoryValueRef = createCategoryValue(definitions, bpmnFactory);

    }

    function setGroupName(element, values) {
        const bo = getBusinessObject(element),
            categoryValueRef = bo.categoryValueRef;

        if (!categoryValueRef) {
            initializeCategory(bo);
        }

        // needs direct call to update categoryValue properly
        return {
            cmd: 'element.updateLabel',
            context: {
                element: element,
                newLabel: values.categoryValue
            }
        };
    }

    function getGroupName(element) {
        const bo = getBusinessObject(element),
            value = (bo.categoryValueRef || {}).value;

        return {categoryValue: value};
    }

    if (!is(element, 'bpmn:Collaboration')) {
        const nameOptions = {
            id: options.id,
            label: options.label && translate(options.label),
            get: i18nDefaultGet("name"),
            set: i18nDefaultSet("name", bpmnFactory)
        };

        if (is(element, 'bpmn:TextAnnotation')) {
            nameOptions.modelProperty = 'text';
            nameOptions.label = translate('Text');
            nameOptions.get = i18nDefaultGet("text");
            nameOptions.set = i18nDefaultSet("text", bpmnFactory);
        } else if (is(element, 'bpmn:Group')) {
            nameOptions.modelProperty = 'categoryValue';
            nameOptions.label = translate('Category Value');
            nameOptions.get = getGroupName;
            nameOptions.set = setGroupName;
        }

        // name
        group.entries = group.entries.concat(nameEntryFactory(element, nameOptions, translate));
    }
};

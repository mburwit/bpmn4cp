import {is} from 'bpmn-js/lib/util/ModelUtil';
import {i18nDefaultGet, i18nDefaultSet} from "../../util/I18NUtil";

function getLabelAttr(semantic) {
    if (
        is(semantic, 'bpmn:FlowElement') ||
        is(semantic, 'bpmn:Participant') ||
        is(semantic, 'bpmn:Lane') ||
        is(semantic, 'bpmn:SequenceFlow') ||
        is(semantic, 'bpmn:MessageFlow') ||
        is(semantic, 'bpmn:DataInput') ||
        is(semantic, 'bpmn:DataOutput')
    ) {
        return 'name';
    }

    if (is(semantic, 'bpmn:TextAnnotation')) {
        return 'text';
    }

    if (is(semantic, 'bpmn:Group')) {
        return 'categoryValueRef';
    }
}

function getCategoryValue(semantic) {
    const categoryValueRef = semantic['categoryValueRef'];

    if (!categoryValueRef) {
        return '';
    }


    return categoryValueRef.value || '';
}

export function getLabel(element) {
    const semantic = element.businessObject,
        attr = getLabelAttr(semantic);

    if (attr) {
        if (attr === 'categoryValueRef') {
            return getCategoryValue(semantic);
        }
        return i18nDefaultGet(attr)(element)[`${attr}`] || '';
    }
}

export function setLabel(element, text, bpmnFactory, commandStack) {
    const semantic = element.businessObject,
        attr = getLabelAttr(semantic);

    if (attr) {
        if (attr === 'categoryValueRef') {
            semantic['categoryValueRef'].value = text;
        } else {
            i18nDefaultSet(attr, bpmnFactory)(element, text).forEach(command => {
                commandStack.execute(
                    command.cmd,
                    command.context
                );
            });
        }
    }

    return element;
}
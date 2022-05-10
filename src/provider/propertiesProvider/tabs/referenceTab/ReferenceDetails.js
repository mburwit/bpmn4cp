import entryFactory from '../../helper/PropertiesPanelExtendedEntryFactory';
import {getBusinessObject} from "bpmn-js/lib/util/ModelUtil";

const cmdHelper = require('bpmn-js-properties-panel/lib/helper/CmdHelper');

export default function (group, element, bpmnFactory, commandStack, options, translate) {

    options = options || {};

    const getSelectedReference = options.getSelectedReference;

    const bibItemText = entryFactory.textBox(translate, {
        id: 'reference-detail-text',
        label: translate('Text'),
        modelProperty: 'text',

        get: function (elem, node) {
            const ref = getSelectedReference(elem, node);
            const bibItem = ref && ref.bibItemRef;
            return {
                text: bibItem && bibItem.text || '',
            };
        },

        set: function (elem, values, node) {
            const bibItem = getSelectedReference(elem, node).bibItemRef;
            return cmdHelper.updateBusinessObject(elem, getBusinessObject(bibItem), values);
        }
    });

    group.entries.push(bibItemText);
}

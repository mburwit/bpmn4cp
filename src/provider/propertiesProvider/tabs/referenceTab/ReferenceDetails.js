import entryFactory from '../../helper/factory/PropertiesPanelExtendedEntryFactory';
import {getBusinessObject} from "bpmn-js/lib/util/ModelUtil";
import referenceHelper from './helper/ReferenceHelper';
import cmdHelper from 'bpmn-js-properties-panel/lib/helper/CmdHelper';

export default function (group, element, bpmnFactory, commandStack, options, translate) {

    options = options || {};

    const getSelectedReference = options.getSelectedReference;

    let bibItemText, bibItemLink, bibItemRendered;

    bibItemText = entryFactory.textBox(translate, {
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

    bibItemLink = entryFactory.textBox(translate, {
        id: 'reference-detail-link',
        label: translate('Link'),
        modelProperty: 'link',

        get: function (elem, node) {
            const ref = getSelectedReference(elem, node);
            const bibItem = ref && ref.bibItemRef;
            return {
                link: bibItem && bibItem.link || '',
            };
        },

        set: function (elem, values, node) {
            const bibItem = getSelectedReference(elem, node).bibItemRef;
            return cmdHelper.updateBusinessObject(elem, getBusinessObject(bibItem), values);
        }
    });

    bibItemRendered = entryFactory.labelBox(translate, {
        id: 'reference-detail-rendered',
        label: translate('Preview'),
        modelProperty: 'rendered',

        get: function (elem, node) {
            const ref = getSelectedReference(elem, node);
            const bibItem = ref && ref.bibItemRef;
            return {
                rendered: bibItem && referenceHelper.bibItemMarkup(bibItem) || ""
            };
        }
    });

    group.entries.push(bibItemRendered);
    group.entries.push(bibItemText);
    group.entries.push(bibItemLink);
}

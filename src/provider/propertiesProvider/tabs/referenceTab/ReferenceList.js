import {domify} from "min-dom";
import {getBusinessObject} from "bpmn-js/lib/util/ModelUtil";
import referenceHelper from "./helper/ReferenceHelper";
import extensionElementsHelper from "bpmn-js-properties-panel/lib/helper/ExtensionElementsHelper";
import entryFactory from '../../helper/factory/PropertiesPanelExtendedEntryFactory';
import cmdHelper from 'bpmn-js-properties-panel/lib/helper/CmdHelper';

export default function (group, canvas, element, bpmnFactory, commandStack, elementRegistry, translate) {
    let addBibItemSelectBox, referencedBibItemList;
    addBibItemSelectBox = entryFactory.selectBox(translate, {
        id: 'reference-add',
        label: translate('Select Reference to Add'),
        modelProperty: 'bibItemRef',
        emptyParameter: true,
        get: () => {
            return {bibItemRef: undefined};
        },
        set: addReferenceToExistingBibItem(),
        addOption: addNewBibItem,
    });
    addBibItemSelectBox.setControlValue = (
        elem, entryNode, inputNode) => {
        getExistingBibItemsPromise().then(allBibItems => {
            updateSelectableBibItemOptions(inputNode, allBibItems, element);
        });
    };
    referencedBibItemList = referenceList(element, bpmnFactory, {}, translate, elementRegistry, canvas.getRootElement());
    group.entries.push(addBibItemSelectBox);
    group.entries.push(referencedBibItemList.entry);

    function addReferenceToExistingBibItem() {
        if (referencedBibItemList) {
            referencedBibItemList.entry.addAndSelectEmptyItem(element);
        }
        return referenceHelper.addReferenceCmdFn(bpmnFactory, canvas.getRootElement());
    }

    function getExistingBibItemsPromise() {
        return new Promise(
            function (resolve) {
                resolve(referenceHelper.getBibliographyItems(getBusinessObject(canvas.getRootElement())));
            }
        );
    }

    function addNewBibItem() {
        getExistingBibItemsPromise().then(existingBibItems => {
            referencedBibItemList.entry.addAndSelectEmptyItem(element);
            const bibItemCmd = referenceHelper.addBibliographyItemCmdFn(bpmnFactory)(
                    canvas.getRootElement(),
                    {
                        refLabel: existingBibItems.length + 1
                    });
                const addReferenceCmd = referenceHelper.addReferenceCmdFn(bpmnFactory, canvas.getRootElement())(
                    element,
                    {
                        bibItemRef: bibItemCmd.item
                    });
            commandStack.execute(
                "properties-panel.multi-command-executor",
                [bibItemCmd, addReferenceCmd]
            );
            }
        )
    }

    function updateSelectableBibItemOptions(
        inputNode, bibliographyItems, element) {
        const referencedBibItems = referenceHelper.getReferencedBibItems(getBusinessObject(element));
        let selectOptions = [{name: '', value: undefined}].concat(
            bibliographyItems.filter(bibItem => !referencedBibItems.includes(bibItem)).map(
                (bibItem) => {
                    return {
                        name: referenceHelper.bibItemLabel(bibItem),
                        value: bibItem.id
                    };
                })
        );
        // remove existing options
        while (inputNode.firstChild) {
            inputNode.removeChild(inputNode.firstChild);
        }
        // add options
        selectOptions.forEach(option => {
            const template = domify(entryFactory.createSelectOption(option));
            inputNode.appendChild(template);
        });
    }

    return {
        getSelectedReference: referencedBibItemList.getSelectedReference
    };
}

const referenceList = (element, bpmnFactory, options, translate, elementRegistry, rootElement) => {

    let bo;
    const result = {
        getSelectedReference: getSelectedReference,
    };

    function getSelectedReference(elem, node) {
        const selection = (result.entry &&
            result.entry.getSelected(elem, node)) || {idx: -1};

        return referenceHelper.getReferences(bo)[selection.idx];
    }

    function handleOptionControlClick(event) {
        console.log(event);
    }

    function removeReference(bo) {
        return function (e, extensionElements, value, idx) {
            const references = referenceHelper.getReferences(getBusinessObject(element));
            const reference = references[idx];
            if (reference) {
                const removeReferenceCmd = extensionElementsHelper.removeEntry(bo, e, reference);
                const anyOtherElementWithThisReference = elementRegistry.find(e =>
                    e !== element && e.type !== 'label' &&
                    referenceHelper.getReferencedBibItems(getBusinessObject(e)).includes(reference.bibItemRef));
                if (anyOtherElementWithThisReference) {
                    return removeReferenceCmd;
                } else {
                    // TODO: maybe ask, if the bib item shall be completely removed
                    const removeBibItemCmd = extensionElementsHelper.removeEntry(
                        getBusinessObject(rootElement), rootElement, reference.bibItemRef
                    );
                    const commands = {
                        cmd: 'properties-panel.multi-command-executor',
                        context: [removeReferenceCmd, removeBibItemCmd]
                    };
                    const bibliographyItems = referenceHelper.getBibliographyItems(getBusinessObject(rootElement));
                    const indexToBeRemoved = bibliographyItems.indexOf(reference.bibItemRef);
                    bibliographyItems.filter((bibItem, index) => index > indexToBeRemoved).forEach(bibItem => {
                        commands.context.push(cmdHelper.updateBusinessObject(rootElement, getBusinessObject(bibItem), {refLabel: bibliographyItems.indexOf(bibItem)}));
                    });
                    return commands;
                }
            }
        };
    }

    bo = getBusinessObject(element);

    if (bo) {
        result.entry = entryFactory.extensionElementsEntry(element, bpmnFactory, {
            id: 'references',
            label: translate('References'),
            modelProperty: 'bibItemRef',
            idGeneration: 'false',
            removeExtensionElement: removeReference(getBusinessObject(element)),
            getExtensionElements: function () {
                return referenceHelper.getReferences(getBusinessObject(element));
            },
            setOptionLabelValue: function (elem, node, option, property, value, idx) {
                const referencedBibItems = referenceHelper.getReferencedBibItems(getBusinessObject(elem));
                const bibItem = referencedBibItems[idx];
                option.text = referenceHelper.bibItemLabel(bibItem);
            },
            optionCtrlClick: handleOptionControlClick
        });
    }
    return result;
}





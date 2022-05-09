const selectBox = require('../../helper/PropertiesPanelExtendedEntryFactory').selectBox;
const getCodeSystemPromise = require('../../helper/CodeSystemSelectionHelper').getCodeSystemPromise;
const addCodeToCachedCodesystem = require('../../helper/CodeSystemSelectionHelper').addCodeToCodesystemPromise;
const updateFhirCodeSystemPromise = require('../../helper/CodeSystemSelectionHelper').updateFhirCodeSystemPromise;
const getCodeName = require('../../helper/CodeSystemSelectionHelper').getCodeName;
const updateCodeSelectionBox = require('../../helper/CodeSystemSelectionHelper').updateCodeSelectionBox;

const cmdHelper = require('bpmn-js-properties-panel/lib/helper/CmdHelper');

const ACTOR_CODESYSTEM_URL = "http://www.helict.de/fhir/CodeSystem/lux/actors";
window.cachedCodeSystems = window.cachedCodeSystems || new Map();

export default function (group, element, bpmnFactory, commandStack, options, translate) {

    options = options || {};

    const getSelectedActor = options.getSelectedActor;

    const getActorName = (elem, node) => {
        const actor = getSelectedActor(elem, node);
        const actorCode = actor && actor.get('code');
        return {
            code: actorCode,
        };
    }

    const setActorNameCmd = (elem, values, node) => {
        const props = {};
        let code = values.code;
// we get the empty option as string "undefined", so convert it to real undefined
        props.code = code === 'undefined' ? undefined : code;
        props.codeSystem = props.code ? ACTOR_CODESYSTEM_URL : undefined;
        props.name = getCodeName(
            ACTOR_CODESYSTEM_URL,
            code,
            window.cachedCodeSystems);
        return cmdHelper.updateBusinessObject(elem, getSelectedActor(elem, node), props);
    }

    const setActorName = (cmd) => {
        commandStack.execute(
            cmd.cmd,
            cmd.context
        )
    }

    const addNewActorOption = (inputNode) => {
        let display = prompt(translate("Enter new actor"));
        if (display != null && display !== "") {
            let newCode = {
                name: display
            }
            addCodeToCachedCodesystem(ACTOR_CODESYSTEM_URL, newCode, window.cachedCodeSystems).catch(() => {
                return undefined;
            }).then(result => {
                if (result) {
                    updateCodeSelectionBox(inputNode, result.codes, result.newCode.code, true);
                    setActorName(setActorNameCmd(element, newCode, inputNode));
                } else {
                    throw Error(translate("Uups! Something went wrong. Please ask your administrator!"))
                }
            }).then(() => {
                updateFhirCodeSystemPromise(ACTOR_CODESYSTEM_URL, window.cachedCodeSystems);
            })

        }
    }

    const actorSelectBox = selectBox(translate, {
        id: 'actor-name',
        label: translate('Name'),
        modelProperty: 'code',
        emptyParameter: false,
        get: getActorName,
        set: setActorNameCmd,
        addOption: addNewActorOption,
        validate: (elem, node) => {
            const actor = getSelectedActor(elem, node);
            const actorCode = actor && actor.get('code');
            if (!actorCode)
                return {
                    code: translate("Must select a valid actor!"),
                };
        }
    });
    actorSelectBox.setControlValue = (
        elem, entryNode, inputNode, inputName, newValue) => {
        getCodeSystemPromise(ACTOR_CODESYSTEM_URL, window.cachedCodeSystems).catch(() => {
            return [];
        }).then(codes => {
            updateCodeSelectionBox(inputNode, codes, newValue, true);
        });
    };
    group.entries.push(actorSelectBox);
}

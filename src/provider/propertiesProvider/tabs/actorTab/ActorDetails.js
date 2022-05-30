import {getBusinessObject} from "bpmn-js/lib/util/ModelUtil";

const selectBox = require('../../helper/factory/PropertiesPanelExtendedEntryFactory').selectBox;
const getCodeSystemPromise = require('../../helper/CodeSystemSelectionHelper').getCodeSystemPromise;
const addCodeToCachedCodesystem = require('../../helper/CodeSystemSelectionHelper').addCodeToCodesystemPromise;
const updateFhirCodeSystemPromise = require('../../helper/CodeSystemSelectionHelper').updateFhirCodeSystemPromise;
const getCodeName = require('../../helper/CodeSystemSelectionHelper').getCodeName;
const updateCodeSelectionBox = require('../../helper/CodeSystemSelectionHelper').updateCodeSelectionBox;

const cmdHelper = require('bpmn-js-properties-panel/lib/helper/CmdHelper');
const actorHelper = require('./helper/ActorHelper');
const ACTOR_CODESYSTEM_URL = "http://www.helict.de/fhir/CodeSystem/lux/actors";
window.cachedCodeSystems = window.cachedCodeSystems || new Map();

export default function (group, element, bpmnFactory, commandStack, options, translate) {

    options = options || {};

    const getSelectedActor = options.getSelectedActor;
    const getSelectList = options.getSelectList;

    const getActorName = (elem, node) => {
        const actor = getSelectedActor(elem, node);
        const actorCode = actor && actor.get('code');
        return {
            code: actorCode,
        };
    }

    const predictIndex = (newCode, existingCodes) => {
        return existingCodes.filter(code => {
            return code && code < newCode;
        }).length;
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
        const selectedActor = getSelectedActor(elem, node);
        getSelectList(node).selectedIndex = predictIndex(code, actorHelper.getActors(getBusinessObject(elem)).map(value => value.code));
        return cmdHelper.updateBusinessObject(elem, selectedActor, props);
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
                name: display.replaceAll(/["|']/gi, "")
            }
            addCodeToCachedCodesystem(ACTOR_CODESYSTEM_URL, newCode, window.cachedCodeSystems).catch(() => {
                return undefined;
            }).then(result => {
                if (result) {
                    updateCodeSelectionBox(inputNode, result.codes, result.newCode.code, true, actorHelper.getActors(getBusinessObject(element)).map(value => value.code));
                    setActorName(setActorNameCmd(element, newCode, inputNode));
                } else {
                    throw Error(translate("Uups! Something went wrong. Please ask your administrator!"))
                }
            }).then(() => {
                return updateFhirCodeSystemPromise(ACTOR_CODESYSTEM_URL, window.cachedCodeSystems);
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
            updateCodeSelectionBox(inputNode, codes, newValue, true, actorHelper.getActors(getBusinessObject(elem)).map(value => value.code));
        });
    };
    group.entries.push(actorSelectBox);
}

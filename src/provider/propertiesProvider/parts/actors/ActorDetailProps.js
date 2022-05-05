
const entryFactory = require(
    'bpmn-js-properties-panel/lib/factory/EntryFactory');
const codeSystemPromise = require('../helper/CodeSystemSelectionHelper').codeSystemPromise;
const getCodeName = require('../helper/CodeSystemSelectionHelper').getCodeName;
const updateCodeSelectionBox = require('../helper/CodeSystemSelectionHelper').updateCodeSelectionBox;

const cmdHelper = require('bpmn-js-properties-panel/lib/helper/CmdHelper');

const ACTOR_CODESYSTEM_URL = "http://www.helict.de/fhir/CodeSystem/lux/actors";
let cachedCodeSystems = new Map();

export default function (group, element, bpmnFactory, options, translate) {

    options = options || {};

    const getSelectedActor = options.getSelectedActor;

    const actorSelectBox = entryFactory.selectBox(translate, {
        id: 'actor-name',
        label: translate('Name'),
        modelProperty: 'code',
        emptyParameter: false,
        get: function (elem, node) {
            const actor = getSelectedActor(elem, node);
            const actorCode = actor && actor.get('code');
            return {
                code: actorCode,
            };
        },
        set: function (elem, values, node) {
            const props = {};
            let code = values.code;
// we get the empty option as string "undefined", so convert it to real undefined
            props.code = code === 'undefined' ? undefined : code;
            props.codeSystem = props.code ? ACTOR_CODESYSTEM_URL : undefined;
            props.name = getCodeName(
                ACTOR_CODESYSTEM_URL,
                code,
                cachedCodeSystems);
            return cmdHelper.updateBusinessObject(elem, getSelectedActor(elem, node), props);
        },
        validate: function (elem, node) {
            const actor = getSelectedActor(elem, node);
            const actorCode = actor && actor.get('code');
            if (!actorCode)
                return {
                    code: "Must select a valid actor!",
                };
        }
    });
    actorSelectBox.setControlValue = function (
        elem, entryNode, inputNode, inputName, newValue) {
        codeSystemPromise(ACTOR_CODESYSTEM_URL, cachedCodeSystems).catch(() => {
            return [];
        }).then(codes => {
            updateCodeSelectionBox(inputNode, codes, newValue, true);
        });
    };
    group.entries.push(actorSelectBox);
    console.log(window.fhirApiUrl);
}

import {is} from 'bpmn-js/lib/util/ModelUtil';

const entryFactory = require(
    'bpmn-js-properties-panel/lib/factory/EntryFactory');
const codeSystemPromise = require('./helper/CodeSystemSelectionHelper').codeSystemPromise;
const getCodeName = require('./helper/CodeSystemSelectionHelper').getCodeName;
const updateCodeSelectionBox = require('./helper/CodeSystemSelectionHelper').updateCodeSelectionBox;

const cmdHelper = require('bpmn-js-properties-panel/lib/helper/CmdHelper');

const OBSERVATION_TYPES_URL = "http://www.helict.de/fhir/CodeSystem/vCare/observations";
let cachedCodeSystems = new Map();

export default function (group, element, bpmnFactory, options, translate) {

    const CP_GOAL_STATE = 'cp:GoalState';
    options = options || {};

    const getSelectedObservation = options.getSelectedObservation;

    const isSelected = function (elem, node) {
        return getSelectedObservation(elem, node);
    };

    const observationTypeSelectBox = entryFactory.selectBox(translate, {
        id: 'observation-name',
        label: translate('Name'),
        modelProperty: 'code',
        emptyParameter: false,
        get: function (elem, node) {
            const observation = getSelectedObservation(elem, node);
            const observationCode = observation && observation.get('code');
            return {
                code: observationCode,
            };
        },
        set: function (elem, values, node) {
            const props = {};
            let code = values.code;
// we get the empty option as string "undefined", so convert it to real undefined
            props.code = code === 'undefined' ? undefined : code;
            props.codeSystem = props.code ? OBSERVATION_TYPES_URL : undefined;
            props.name = getCodeName(
                OBSERVATION_TYPES_URL,
                code,
                cachedCodeSystems);
            return cmdHelper.updateBusinessObject(elem, getSelectedObservation(elem, node), props);
        },
        validate: function (elem, node) {
            const observation = getSelectedObservation(elem, node);
            const observationCode = observation && observation.get('code');
            if (!observationCode)
                return {
                    code: translate("Must select a valid observation type!"),
                };
        }
    });
    observationTypeSelectBox.setControlValue = function (
        elem, entryNode, inputNode, inputName, newValue) {
        codeSystemPromise(OBSERVATION_TYPES_URL, cachedCodeSystems).catch(() => {
            return [];
        }).then(codes => {
            updateCodeSelectionBox(inputNode, codes, newValue, true);
        });
    };
    group.entries.push(observationTypeSelectBox);

    if (is(element, CP_GOAL_STATE)) {
        group.entries.push(entryFactory.textField(translate, {
            id: 'goal-default-value',
            label: translate('Default Value'),
            modelProperty: 'defaultValue',
            emptyParameter: false,

            get: function (elem, node) {
                const goal = getSelectedObservation(elem, node);
                const defaultValue = goal && goal.get('defaultValue');
                return {
                    defaultValue: defaultValue,
                };
            },

            set: function (elem, values, node) {
                const goalDefaultValue = values.defaultValue;

                return cmdHelper.updateBusinessObject(elem,
                    getSelectedObservation(elem, node),
                    {defaultValue: goalDefaultValue});
            },

            hidden: function (elem, node) {
                return !isSelected(elem, node);
            },

        }));
    }
}

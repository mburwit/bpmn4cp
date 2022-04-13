import entryFactory from 'bpmn-js-properties-panel/lib/factory/EntryFactory';

import { is } from 'bpmn-js/lib/util/ModelUtil';

const updateCodeSelectionBox = require('./helper/CodeSystemSelectionHelper').updateCodeSelectionBox;
const codeSystemPromise = require('./helper/CodeSystemSelectionHelper').codeSystemPromise;
const getCodeDefinition = require('./helper/CodeSystemSelectionHelper').getCodeDefinition;

const cmdHelper = require('bpmn-js-properties-panel/lib/helper/CmdHelper');
const SERVICE_TYPE_URL = "http://www.helict.de/fhir/CodeSystem/vCare/service-types";

let cachedCodeSystems = new Map();

export default function(group, element, translate, options) {

  const prefix = options && options.idPrefix;

  if (is(element, 'bpmn:Activity')) {
    // create service type selectbox
    const serviceTypeSelectBox = entryFactory.selectBox(translate, {
      id: prefix + 'service-type',
      label: translate('Service Type'),
      modelProperty: 'codeSystem',
      set: function (elem, values) {
        const props = {};
        let serviceType = values.codeSystem;
// we get the empty option as string "undefined", so convert it to real undefined
        props.codeSystem = serviceType === 'undefined' ?
            undefined :
            serviceType;
        // if value changes then also remove the code and context config
        const currentValue = elem.businessObject.get('codeSystem');
        if (currentValue !== serviceType) {
          props.code = undefined;
          props.contextConfigCode = undefined;
          props.contextConfigSystem = undefined;
        }
        // set the helper attribute for FHIR transformation, that specifies the
        // code system url of the service context system
        props.contextSystem = getCodeDefinition(
            SERVICE_TYPE_URL,
            serviceType,
            cachedCodeSystems);
        return cmdHelper.updateBusinessObject(elem, elem.businessObject,
            props);
      },
    });
    serviceTypeSelectBox.setControlValue = function (
        elem, entryNode, inputNode, inputName, newValue) {
      codeSystemPromise(SERVICE_TYPE_URL, cachedCodeSystems).catch(() => {
        return [];
      }).then(codes => {
        updateCodeSelectionBox(inputNode, codes, newValue, true);
      });
    };
    group.entries.push(serviceTypeSelectBox);

    // service context selection box
    const serviceDetailSelectBox = entryFactory.selectBox(translate, {
      id: prefix + 'service-context',
      label: translate('Service Context'),
      modelProperty: 'code',
      set: function (elem, values) {
        const props = {};
        let code = values.code;
// we get the empty option as string "undefined", so convert it to real undefined
        props.code = code === 'undefined' ?
            undefined :
            code;
        // if value changes then also remove the context config code and system
        const currentValue = elem.businessObject.get('code');
        if (currentValue !== code) {
          props.contextConfigCode = undefined;
        }
        // set the helper attribute for FHIR transformation, that specifies the
        // code system url of the context config system
        props.contextConfigSystem = getCodeDefinition(
            elem.businessObject.get('contextSystem'),
            code,
            cachedCodeSystems);
        return cmdHelper.updateBusinessObject(elem, elem.businessObject,
            props);
      },
      hidden: function (elem) {
        return elem.businessObject.get('codeSystem') === undefined;
      }
    });
    serviceDetailSelectBox.setControlValue = function (
        elem, entryNode, inputNode, inputName, newValue) {
      codeSystemPromise(SERVICE_TYPE_URL, cachedCodeSystems).catch(() => {
        return [];
      }).then(() => {
        codeSystemPromise(getCodeDefinition(
            SERVICE_TYPE_URL,
            elem.businessObject.get("codeSystem"),
            cachedCodeSystems
        ), cachedCodeSystems).catch(() => {
          return [];
        }).then(codes => {
          updateCodeSelectionBox(inputNode, codes, newValue, true);
        });
      });
    };
    group.entries.push(serviceDetailSelectBox);

    // context config selection box
    const contextConfigSelectBox = entryFactory.selectBox(translate, {
      id: prefix + 'service-context-config',
      label: translate('Context Config'),
      modelProperty: 'contextConfigCode',
      set: function (elem, values) {
        const props = {};
        let contextConfigCode = values.contextConfigCode;
// we get the empty option as string "undefined", so convert it to real undefined
        props.contextConfigCode = contextConfigCode === 'undefined' ?
            undefined :
            contextConfigCode;
        return cmdHelper.updateBusinessObject(elem, elem.businessObject,
            props);
      },
      hidden: function (elem) {
        return elem.businessObject.get('codeSystem') === undefined
            || elem.businessObject.get('code') === undefined
            || elem.businessObject.get('contextConfigSystem') === undefined;
      },
    });
    contextConfigSelectBox.setControlValue = function (
        elem, entryNode, inputNode, inputName, newValue) {
      codeSystemPromise(SERVICE_TYPE_URL, cachedCodeSystems).catch(() => {
        return [];
      }).then(() => {
        codeSystemPromise(getCodeDefinition(
            SERVICE_TYPE_URL,
            elem.businessObject.get("codeSystem"),
            cachedCodeSystems
        ), cachedCodeSystems).catch(() => {
          return [];
        }).then(() => {
          codeSystemPromise(getCodeDefinition(
              elem.businessObject.get('contextSystem'),
              elem.businessObject.get('code'),
              cachedCodeSystems
          ), cachedCodeSystems).catch(() => {
            return [];
          }).then(codes => {
            updateCodeSelectionBox(inputNode, codes, newValue, true);
          });
        });
      });
    };
    group.entries.push(contextConfigSelectBox);
  }
}
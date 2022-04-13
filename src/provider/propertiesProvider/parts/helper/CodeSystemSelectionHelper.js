'use strict';

const domify = require("min-dom").domify;
const CodeSystemSelectionHelper = {};
module.exports = CodeSystemSelectionHelper;

const createOption = function(option) {
    return '<option value="' + option.value + '">' + option.name + '</option>';
};

const queryCodeSystem = async (url) => {
    if (url === undefined) {
        return [];
    }
    const response = await fetch(
        window.fhirApiUrl +
        '/CodeSystem?url=' + url,
        window.fhirApiRequestInit);
    const fhirBundle = await response.json();
    if (fhirBundle.total === 0) {
        return [];
    } else {
        return fhirBundle.entry[0].resource.concept.map(
            (concept) => {
                return {
                    name: concept.display,
                    code: concept.code,
                    definition: concept.definition
                };
            },
        );
    }
};

CodeSystemSelectionHelper.updateCodeSelectionBox = function(
    inputNode, codes, selectedValue, emptyParam) {
    let selectOptions = codes.map(
        (code) => {
            return {
                name: code.name,
                value: code.code
            };
        });
    // add empty param
    if (emptyParam) {
        selectOptions = [{name: '', value: undefined}].concat(
            selectOptions
        );
    }
    // remove existing options
    while (inputNode.firstChild) {
        inputNode.removeChild(inputNode.firstChild);
    }
    // add options
    selectOptions.forEach(option => {
        const template = domify(createOption(option));
        inputNode.appendChild(template);
    });
    // set select value
    if (selectedValue !== undefined) {
        inputNode.value = selectedValue;
    }
};

const getCodeObject = function (url, theCode, cachedCodeSystems) {
    if (url === undefined || url === "undefined" || theCode === undefined || theCode === "undefined") {
        return undefined;
    }
    const codeSystem = cachedCodeSystems.get(url);
    if (codeSystem === undefined) {
        return undefined;
    }
    return cachedCodeSystems.get(url).find((codeSystem) => {
        return codeSystem.code === theCode;
    });
};

CodeSystemSelectionHelper.getCodeDefinition = function (url, theCode, cachedCodeSystems) {
    const codeObject = getCodeObject(url, theCode, cachedCodeSystems);
    return codeObject ? codeObject.definition : undefined;
};

CodeSystemSelectionHelper.getCodeName = function (url, theCode, cachedCodeSystems) {
    const codeObject = getCodeObject(url, theCode, cachedCodeSystems);
    return codeObject ? codeObject.name : undefined;
};

CodeSystemSelectionHelper.codeSystemPromise = (codeSystem, cachedCodeSystems) => {
    return new Promise(
        function (resolve, reject) {
            if (cachedCodeSystems.get(codeSystem)) {
                resolve(cachedCodeSystems.get(codeSystem));
            } else {
                queryCodeSystem(codeSystem).catch(error => {
                    reject(error);
                }).then((codes) => {
                    cachedCodeSystems.set(codeSystem, codes);
                    resolve(codes);
                });
            }
        },
    );
}


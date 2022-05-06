'use strict';

const domify = require("min-dom").domify;
const CodeSystemSelectionHelper = {};
module.exports = CodeSystemSelectionHelper;

const createOption = function (option) {
    return '<option value="' + option.value + '">' + option.name + '</option>';
};

const queryPutFhirCodeSystem = (url, fhirCodeSystem) => {
    if (!url) {
        throw Error('Param url must not be undefined');
    }
    if (!fhirCodeSystem) {
        throw Error('Param url must not be undefined');
    }
    const init = {...{}, ...window.fhirApiRequestInit};
    init.method = 'PUT';
    init.headers.append('Content-Type', 'application/json');
    init.body = JSON.stringify(fhirCodeSystem);
    return fetch(`${window.fhirApiUrl}/CodeSystem?url=${url}`, init)
        .then(
            response => {
                if (!response.ok) {
                    throw new Error('Network response was not OK');
                }
                return response.json();
            });
};

const queryGetFhirCodeSystem = async (url) => {
    if (url === undefined) {
        throw Error('Param url must not be null');
    }
    const response = await fetch(
        window.fhirApiUrl +
        '/CodeSystem?url=' + url,
        window.fhirApiRequestInit);
    const fhirBundle = await response.json();
    if (fhirBundle.total === 0) {
        return undefined;
    } else {
        return {
            fhir: fhirBundle.entry[0].resource,
            codes: fhirBundle.entry[0].resource.concept.map(
                (concept) => {
                    return {
                        name: concept.display,
                        code: concept.code,
                        definition: concept.definition
                    };
                },
            )
        };
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

CodeSystemSelectionHelper.updateCodeSelectionBox = function (
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

CodeSystemSelectionHelper.getCodeDefinition = function (url, theCode, cachedCodeSystems) {
    const codeObject = getCodeObject(url, theCode, cachedCodeSystems);
    return codeObject ? codeObject.definition : undefined;
};

CodeSystemSelectionHelper.getCodeName = function (url, theCode, cachedCodeSystems) {
    const codeObject = getCodeObject(url, theCode, cachedCodeSystems);
    return codeObject ? codeObject.name : undefined;
};

CodeSystemSelectionHelper.getCodeSystemPromise = (codeSystem, cachedCodeSystems) => {
    return new Promise(
        function (resolve, reject) {
            if (cachedCodeSystems.get(codeSystem)) {
                resolve(cachedCodeSystems.get(codeSystem));
            } else {
                queryGetFhirCodeSystem(codeSystem).catch(error => {
                    reject(error);
                }).then((c) => {
                    if (c) {
                        cachedCodeSystems.set(`fhir::${codeSystem}`, c.fhir);
                        cachedCodeSystems.set(codeSystem, c.codes);
                        resolve(c.codes);
                    } else {
                        resolve([]);
                    }
                });
            }
        },
    );
}

CodeSystemSelectionHelper.addCodeToCodesystemPromise = (url, newCode, cachedCodeSystems) => {
    if (!newCode.code) {
        if (!newCode.name) {
            return new Promise((reject) => {
                reject(Error('Code provided contains neither "code" nor "name" property!'));
            });
        }
        newCode.code = newCode.name.replace(/ /g, "_").toLowerCase()
    }
    return CodeSystemSelectionHelper.getCodeSystemPromise(url, cachedCodeSystems)
        .then(codes => {
            return new Promise((resolve) => {
                const existingCodeIndex = codes.map(c => c.code).indexOf(newCode.code);
                if (existingCodeIndex < 0) {
                    codes.push(newCode);
                    resolve({codes: codes, newCode: newCode});
                } else {
                    resolve({codes: codes, newCode: codes[existingCodeIndex]});
                }
            });
        });
}

CodeSystemSelectionHelper.updateFhirCodeSystemPromise = (url, cachedCodeSystems) => {
    return new Promise(
        function (resolve, reject) {
            if (url === undefined) {
                reject(Error("Param url must not be undefined!"));
            }
            if (cachedCodeSystems === undefined) {
                reject(Error("Param fhirCodeSystem must not be undefined!"));
            }

            let fhirCodeSystem = cachedCodeSystems.get(`fhir::${url}`);
            let cachedCodes = cachedCodeSystems.get(url);
            if (!fhirCodeSystem || !cachedCodes) {
                reject(Error("CodeSystem to update is not properly cached!"));
            }
            // update concepts, using cached codes
            fhirCodeSystem.concept = cachedCodes.map(
                (cachedCode) => {
                    return {
                        display: cachedCode.name,
                        code: cachedCode.code,
                        definition: cachedCode.definition
                    };
                },
            );
            fhirCodeSystem.count = cachedCodes.length;
            resolve(fhirCodeSystem);
        }
    )
        .then(fhirCodeSystem => queryPutFhirCodeSystem(url, fhirCodeSystem))
        .then(updatedFhirCodeSystem => {
            cachedCodeSystems.set(`fhir::${url}`, updatedFhirCodeSystem);
        });
};

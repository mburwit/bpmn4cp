'use strict';

const QIDefinitionHelper = {};

module.exports = QIDefinitionHelper;

const getDefinitionProperty = function(definition, property) {
  if (!definition) {
    return;
  }

  return definition.get(property);
}

/**
 * Get the qi definition type for a given qi definition.
 *
 * @param {ModdleElement<cp:QIDefinition>} definition
 *
 * @return {string|undefined} the qi definition type
 */
QIDefinitionHelper.getQIDefinitionType = function(definition) {
  return getDefinitionProperty(definition, "type")
};

/**
 * Get the qi definition text for a given qi definition.
 *
 * @param {ModdleElement<cp:QIDefinition>} definition
 *
 * @return {string|undefined} the qi definition text
 */
QIDefinitionHelper.getQIDefinitionText = function(definition) {
  return getDefinitionProperty(definition, "text")
};

/**
 * Get the qi definition numerator for a given qi definition.
 *
 * @param {ModdleElement<cp:QIDefinition>} definition
 *
 * @return {string|undefined} the qi definition numerator
 */
QIDefinitionHelper.getQIDefinitionNumerator = function(definition) {
  return getDefinitionProperty(definition, "numerator")
};

/**
 * Get the qi definition denumerator for a given qi definition.
 *
 * @param {ModdleElement<cp:QIDefinition>} definition
 *
 * @return {string|undefined} the qi definition denumerator
 */
QIDefinitionHelper.getQIDefinitionDenumerator = function(definition) {
  return getDefinitionProperty(definition, "denumerator")
};

/**
 * Get the actual QI definition based on option, whether it's a getter
 * to fetch the qi definition or the exact qi definition itself
 *
 * @param {ModdleElement<cp:QIDefinition>|Function} definitionOrFunction
 * @param {Shape} element
 * @param {HTMLElement} node
 *
 * @return ModdleElement<bpmn:TimerEventDefinition>
 */
QIDefinitionHelper.getQIDefinition = function(definitionOrFunction, element, node) {
  if (typeof definitionOrFunction === 'function') {
    return definitionOrFunction(element, node);
  }

  return definitionOrFunction;
}


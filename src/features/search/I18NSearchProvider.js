import {
  map,
  filter,
  sortBy
} from 'min-dash';

import {
  getLabel
} from '../label-editing/LabelUtil';


/**
 * Provides ability to search through BPMN elements
 */
export default function I18NSearchProvider(elementRegistry, searchPad, canvas) {

  this._elementRegistry = elementRegistry;
  this._canvas = canvas;

  searchPad.registerProvider(this);
}

I18NSearchProvider.$inject = [
  'elementRegistry',
  'searchPad',
  'canvas'
];


/**
 * Finds all elements that match given pattern
 *
 * <Result> :
 *  {
 *    primaryTokens: <Array<Token>>,
 *    secondaryTokens: <Array<Token>>,
 *    element: <Element>
 *  }
 *
 * <Token> :
 *  {
 *    normal|matched: <string>
 *  }
 *
 * @param  {string} pattern
 * @return {Array<Result>}
 */
I18NSearchProvider.prototype.find = function(pattern) {
  const rootElement = this._canvas.getRootElement();

  let elements = this._elementRegistry.filter(function(element) {
    return !element.labelTarget;

  });

  // do not include root element
  elements = filter(elements, function(element) {
    return element !== rootElement;
  });

  elements = map(elements, function(element) {
    return {
      primaryTokens: matchAndSplit(getLabel(element), pattern),
      secondaryTokens: matchAndSplit(element.id, pattern),
      element: element
    };
  });

  // exclude non-matched elements
  elements = filter(elements, function(element) {
    return hasMatched(element.primaryTokens) || hasMatched(element.secondaryTokens);
  });

  elements = sortBy(elements, function(element) {
    return getLabel(element.element) + element.element.id;
  });

  return elements;
};


function hasMatched(tokens) {
  const matched = filter(tokens, function(t) {
    return !!t.matched;
  });

  return matched.length > 0;
}


function matchAndSplit(text, pattern) {
  const tokens = [],
      originalText = text;

  if (!text) {
    return tokens;
  }

  text = text.toLowerCase();
  pattern = pattern.toLowerCase();

  const i = text.indexOf(pattern);

  if (i > -1) {
    if (i !== 0) {
      tokens.push({
        normal: originalText.substr(0, i)
      });
    }

    tokens.push({
      matched: originalText.substr(i, pattern.length)
    });

    if (pattern.length + i < text.length) {
      tokens.push({
        normal: originalText.substr(pattern.length + i, text.length)
      });
    }
  } else {
    tokens.push({
      normal: originalText
    });
  }

  return tokens;
}
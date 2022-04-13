import ReplaceMenuProvider
  from 'bpmn-js/lib/features/popup-menu/ReplaceMenuProvider';
import _ from 'lodash';
import inherits from 'inherits';
import { isDifferentType } from 'bpmn-js/lib/features/popup-menu/util/TypeUtil';
import { is } from 'bpmn-js/lib/util/ModelUtil';
import { filter } from 'min-dash';
import * as replaceOptions from '../replace/BPMN4CPReplaceOptions';

/**
 * This module is an element agnostic replace menu provider for the popup menu.
 */
export default function BPMN4CPReplaceMenuProvider(
  bpmnFactory, popupMenu, modeling, moddle,
  bpmnReplace, rules, translate) {

  ReplaceMenuProvider.call(this, bpmnFactory, popupMenu, modeling, moddle,
    bpmnReplace, rules, translate);

  const getDefaultReplaceMenuEntries = _.bind(this.getEntries, this);
  const getDefaultHeaderEntries = _.bind(this.getHeaderEntries, this);

  /**
   * Get all entries from replaceOptions for the given element and apply filters
   * on them. Get for example only elements, which are different from the current one.
   *
   * @param {djs.model.Base} element
   *
   * @return {Array<Object>} a list of menu entry items
   */
  this.getEntries = function(element) {

    const businessObject = element.businessObject;

    if (!this._rules.allowed('shape.replace', { element: element })) {
      return [];
    }
    let entries;
    const differentType = isDifferentType(element);

    // flow nodes
    if (is(businessObject, 'bpmn:Task')) {
      entries = filter(replaceOptions.TASK, differentType);
    }

    // TODO: continue with custom replace menu entries here

    return this._createEntries(element, entries).
      concat(getDefaultReplaceMenuEntries(element));
  };

  /**
   * Get a list of header items for the given element. This includes buttons
   * for multi instance markers and for the ad hoc marker.
   *
   * @param {djs.model.Base} element
   *
   * @return {Array<Object>} a list of menu entry items
   */
  this.getHeaderEntries = function(element) {
    const entries = getDefaultHeaderEntries(element);

    // TODO: continue with custom header entries here

    return entries;
  };
}

inherits(BPMN4CPReplaceMenuProvider, ReplaceMenuProvider);


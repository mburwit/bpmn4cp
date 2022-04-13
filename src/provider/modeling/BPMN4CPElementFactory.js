import inherits from 'inherits';

import { is } from 'bpmn-js/lib/util/ModelUtil';

import ElementFactory from 'bpmn-js/lib/features/modeling/ElementFactory';

/**
 * A bpmn-aware factory for diagram-js shapes
 */
export default function BPMN4CPElementFactory(bpmnFactory, moddle, translate) {
  ElementFactory.call(this, bpmnFactory, moddle, translate);
}

inherits(BPMN4CPElementFactory, ElementFactory);

BPMN4CPElementFactory.prototype._getDefaultSize = function(semantic) {

  if (is(semantic, 'cp:ObservationFeature')) {
    return { width: 36, height: 36 };
  }

  if (is(semantic, 'cp:GoalState')) {
    return { width: 36, height: 36 };
  }

  return ElementFactory.prototype._getDefaultSize.call(this, semantic);
};

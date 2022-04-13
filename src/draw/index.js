import BPMN4CPRenderer from './BPMN4CPRenderer';
import TextRenderer from 'bpmn-js/lib/draw/TextRenderer';

import BPMN4CPPathMap from './BPMN4CPPathMap';

export default {
  __init__: ['bpmnRenderer'],
  bpmnRenderer: ['type', BPMN4CPRenderer],
  textRenderer: ['type', TextRenderer],
  pathMap: ['type', BPMN4CPPathMap],
};

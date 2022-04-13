import BPMN4CPRules from './BPMN4CPRules';
import BpmnModule from 'bpmn-js/lib/features/rules';

export default {
  __init__: ['bpmnRules'],
  __depends__: [
    BpmnModule
  ],
  bpmnRules: ['type', BPMN4CPRules]
};

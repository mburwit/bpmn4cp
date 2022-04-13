import { is } from 'bpmn-js/lib/util/ModelUtil';
import defaultSubProcess from './defaultPropertyValues/SubProcess';

const cmdHelper = require('bpmn-js-properties-panel/lib/helper/CmdHelper');

export default function DefaultPropertyValuesProvider(
  eventBus, modeling, commandStack) {

  eventBus.on('commandStack.shape.create.postExecuted', 1001, function(event) {
    const shape = event.context.shape;
    const defaultProps = getDefaultPropertiesForType(shape.businessObject);
    if (defaultProps) {
      const commandToExecute = cmdHelper.updateBusinessObject(
        shape,
        shape.businessObject,
        defaultProps,
      );
      commandStack.execute(
        commandToExecute.cmd,
        commandToExecute.context
      );
    }
  });

  function getDefaultPropertiesForType(businessObject) {
    if (is(businessObject, 'bpmn:SubProcess')) {
      return defaultSubProcess();
    }
  }

}

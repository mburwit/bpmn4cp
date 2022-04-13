import BPMN4CPPropertiesProvider from './BPMN4CPPropertiesProvider';
import DefaultPropertyValuesProvider from './DefaultPropertyValuesProvider';
export default {
  __init__: [
    'propertiesProvider',
    'defaultPropertyValuesProvider',
  ],
  propertiesProvider: ['type', BPMN4CPPropertiesProvider],
  defaultPropertyValuesProvider: ['type', DefaultPropertyValuesProvider],
};

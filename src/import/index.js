import translate from 'diagram-js/lib/i18n/translate';

import I18NBpmnImporter from './I18NBpmnImporter';

export default {
  __depends__: [
    translate
  ],
  bpmnImporter: [ 'type', I18NBpmnImporter ]
};
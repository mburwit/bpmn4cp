import PopupMenuModule from 'diagram-js/lib/features/popup-menu';
import ReplaceModule from 'bpmn-js/lib/features/replace';

import BPMN4CPReplaceMenuProvider from './BPMN4CPReplaceMenuProvider';

export default {
  __depends__: [
    PopupMenuModule,
    ReplaceModule,
  ],
  __init__: ['replaceMenuProvider'],
  replaceMenuProvider: ['type', BPMN4CPReplaceMenuProvider],
};

import DirectEditingModule from 'diagram-js-direct-editing';
import ContextPadModule from 'diagram-js/lib/features/context-pad';
import SelectionModule from 'diagram-js/lib/features/selection';
import ConnectModule from 'diagram-js/lib/features/connect';
import CreateModule from 'diagram-js/lib/features/create';
import PopupMenuModule from '../popup-menu';

import BPMN4CPContextPadProvider from './BPMN4CPContextPadProvider';

export default {
  __depends__: [
    DirectEditingModule,
    ContextPadModule,
    SelectionModule,
    ConnectModule,
    CreateModule,
    PopupMenuModule
  ],
  __init__: [ 'contextPadProvider' ],
  contextPadProvider: [ 'type', BPMN4CPContextPadProvider ]
};

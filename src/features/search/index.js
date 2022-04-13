import SearchPadModule from 'diagram-js/lib/features/search-pad';

import I18NSearchProvider from './I18NSearchProvider';


export default {
  __depends__: [
    SearchPadModule
  ],
  __init__: [ 'bpmnSearch'],
  bpmnSearch: [ 'type', I18NSearchProvider ]
};

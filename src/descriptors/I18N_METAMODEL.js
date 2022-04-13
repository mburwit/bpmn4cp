export const I18N_METAMODEL = {
  'name': 'I18N',
  'prefix': 'i18n',
  'uri': 'http://www.helict.de/bpmn4cp/i18n',
  'xml': {
    'tagAlias': 'lowerCase',
  },
  'associations': [],
  'types': [
    {
      'name': 'Translation',
      'superClass': ['Element'],
      'properties': [
        {
          'name': 'lang',
          'isAttr': true,
          'type': 'String',
        },{
          'name': 'target',
          'isAttr': true,
          'type': 'String',
        }
      ],
    }
  ],
};

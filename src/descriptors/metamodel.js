export const METAMODEL = {
  'name': 'BPMN4CP',
  'prefix': 'cp',
  'uri': 'http://www.helict.de/bpmn4cp',
  'xml': {
    'tagAlias': 'lowerCase',
  },
  'associations': [],
  'types': [
    {
      'name': 'Activity',
      'extends': [
        'bpmn:Activity',
      ],
      'properties': [
        {
          'name': 'code',
          'isAttr': true,
          'type': 'String',
        },
      ],
    },
    {
      'name': 'Actor',
      'superClass': ['Element'],
      'meta': {
        'allowedIn': [
          'bpmn:Activity',
        ],
      },
      'properties': [
        {
          'name': 'name',
          'isAttr': true,
          'type': 'String',
        },
        {
          'name': 'code',
          'isAttr': true,
          'type': 'String',
        },
        {
          'name': 'codeSystem',
          'isAttr': true,
          'type': 'String',
        },
      ],
    },
    {
      'name': 'SubProcess',
      'extends': ['bpmn:SubProcess'],
      'properties': [
        {
          'name': 'selectionBehavior',
          'isAttr': true,
          'type': 'String'
        },
        {
          'name': 'definitionCanonical',
          'isAttr': true,
          'type': 'String',
        },
      ],
    },
    {
      'name': 'ObservationFeature',
      'superClass': [
        'bpmn:DataObjectReference',
      ],
    },
    {
      'name': 'Observation',
      'superClass': ['Element'],
      'meta': {
        'allowedIn': [
          'cp:ObservationFeature',
        ],
      },
      'properties': [
        {
          'name': 'name',
          'isAttr': true,
          'type': 'String',
        },
      ],
    },
    {
      'name': 'GoalState',
      'superClass': [
        'bpmn:DataObjectReference',
      ],
    },
    {
      'name': 'Goal',
      'superClass': ['Observation'],
      'meta': {
        'allowedIn': [
          'cp:GoalState',
        ],
      },
      'properties': [
        {
          'name': 'code',
          'isAttr': true,
          'type': 'String',
        },
        {
          'name': 'codeSystem',
          'isAttr': true,
          'type': 'String',
        },
        {
          'name': 'defaultValue',
          'isAttr': true,
          'type': 'String',
        }
      ],
    },
    {
      'name': 'Timing',
      'isAbstract': true,
      'superClass': [
        'bpmn:TimerEventDefinition',
      ],
      'properties': [
        {
          'name': 'timeEvent',
          'isAttr': true,
          'type': 'String',
        },
        {
          'name': 'timeCycle',
          'redefines': 'bpmn:TimerEventDefinition#timeCycle',
          'type': 'TimeCycle',
        },
        {
          'name': 'timeDuration',
          'redefines': 'bpmn:TimerEventDefinition#timeDuration',
          'type': 'TimeDuration',
        },
      ],
    },
    {
      'name': 'TimeDuration',
      'properties': [
        {
          'name': 'duration',
          'isAttr': true,
          'type': 'Real',
        },
        {
          'name': 'durationMax',
          'isAttr': true,
          'type': 'Real',
        },
        {
          'name': 'durationUnit',
          'isAttr': true,
          'type': 'String',
        },
      ],
    },
    {
      'name': 'TimeCycle',
      'extends': [
        'cp:TimeDuration',
      ],
      'properties': [
        {
          'name': 'boundsDuration',
          'type': 'cp:BoundsDuration',
        },
        {
          'name': 'boundsRange',
          'type': 'cp:BoundsRange',
        },
        {
          'name': 'boundsPeriod',
          'type': 'cp:BoundsPeriod',
        },
        {
          'name': 'count',
          'isAttr': true,
          'type': 'Integer',
        },
        {
          'name': 'countMax',
          'isAttr': true,
          'type': 'Integer',
        },
        {
          'name': 'frequency',
          'isAttr': true,
          'type': 'Integer',
        },
        {
          'name': 'frequencyMax',
          'isAttr': true,
          'type': 'Integer',
        },
        {
          'name': 'period',
          'isAttr': true,
          'type': 'Real',
        },
        {
          'name': 'periodMax',
          'isAttr': true,
          'type': 'Real',
        },
        {
          'name': 'periodUnit',
          'isAttr': true,
          'type': 'String',
        },
        {
          'name': 'dayOfWeek',
          'isAttr': true,
          'type': 'String',
        },
        {
          'name': 'timeOfDay',
          'isAttr': true,
          'type': 'String',
        },
        {
          'name': 'when',
          'isAttr': true,
          'type': 'String',
        },
      ],
    },
    {
      'name': 'BoundsDuration',
      'superClass': ['Element'],
      'properties': [
        {
          'name': 'value',
          'isAttr': true,
          'type': 'String',
        },
        {
          'name': 'unit',
          'isAttr': true,
          'type': 'String',
        }
      ],
    },
    {
      'name': 'BoundsRangeLowerLimit',
      'extends': [
        'cp:BoundsDuration',
      ]
    },
    {
      'name': 'BoundsRangeUpperLimit',
      'extends': [
        'cp:BoundsDuration',
      ]
    },
    {
      'name': 'BoundsRange',
      'superClass': ['Element'],
      'properties': [
        {
          'name': 'low',
          'type': 'cp:BoundsRangeLowerLimit',
        },
        {
          'name': 'high',
          'type': 'cp:BoundsRangeUpperLimit',
        }
      ],
    },
    {
      'name': 'BoundsPeriod',
      'superClass': ['Element'],
      'properties': [
        {
          'name': 'start',
          'isAttr': true,
          'type': 'String',
        },
        {
          'name': 'end',
          'isAttr': true,
          'type': 'String',
        }
      ],
    },
    {
      'name': 'QualityIndicator',
      'superClass': [
        'bpmn:DataObjectReference',
      ],
      'properties': [
        {
          'name': 'domain',
          'isAttr': true,
          'type': 'String',
        },
        {
          'name': 'fillColor',
          'isAttr': true,
          'type': 'String',
        },
        {
          'name': 'status',
          'isAttr': true,
          'type': 'String',
        },
        {
          'name': 'definition',
          'type': 'QIDefinition',
        },
      ],
    },
    {
      'name': 'QIDefinition',
      'superClass': [
        'Element',
      ],
      'meta': {
        'allowedIn': [
          'cp:QualityIndicator',
        ],
      },
      'properties': [
        {
          'name': 'type',
          'isAttr': true,
          'type': 'String',
        },
        {
          'name': 'text',
          'isAttr': true,
          'type': 'String',
        },
        {
          'name': 'numerator',
          'isAttr': true,
          'type': 'String',
        },
        {
          'name': 'denumerator',
          'isAttr': true,
          'type': 'String',
        },
      ],
    },
    {
      "name": "Reference",
      'superClass': ['Element'],
      'meta': {
        'allowedIn': [
          'bpmn:BaseElement',
        ],
      },
      "properties": [
        {
          "name": "bibItemRef",
          "type": "BibliographyItem",
          "isAttr": true,
          "isReference": true
        }
      ]
    },
    {
      "name": "BibliographyItem",
      "superClass": [
        "Element"
      ],
      "properties": [
        {
          "name": "id",
          "isAttr": true,
          "type": "String",
          "isId": true
        },
        {
          "name": "refLabel",
          "isAttr": true,
          "type": "String"
        },
        {
          "name": "text",
          "isAttr": true,
          "type": "String"
        },
        {
          "name": "link",
          "isAttr": true,
          "type": "String"
        }
      ]
    },
  ],
};

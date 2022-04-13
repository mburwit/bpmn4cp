import { getNewBPMN4CPShapePosition } from './AutoPlaceUtil';

import { getMid } from 'diagram-js/lib/layout/LayoutUtil';
import { is } from 'bpmn-js/lib/util/ModelUtil';

/**
 * Select element after auto placement.
 *
 * @param {EventBus} eventBus
 * @param {GridSnapping} gridSnapping
 */
export default function BPMN4CPAutoPlaceBehavior(eventBus, gridSnapping) {
  eventBus.on('autoPlace', 1001, function(context) {
    const source = context.source,
      sourceMid = getMid(source),
      shape = context.shape;

    const position = getNewBPMN4CPShapePosition(source, shape);

    ['x', 'y'].forEach(function(axis) {
      const options = {};

      // do not snap if x/y equal
      if (position[axis] === sourceMid[axis]) {
        return;
      }

      if (position[axis] > sourceMid[axis]) {
        options.min = position[axis];
      } else {
        options.max = position[axis];
      }

      if (is(shape, 'cp:ObservationFeature')) {

        if (isHorizontal(axis)) {
          options.offset = -shape.width / 2;
        } else {
          options.offset = -shape.height / 2;
        }

      }

      position[axis] = gridSnapping.snapValue(position[axis], options);

    });

    // must be returned to be considered by auto place
    return position;
  });
}

BPMN4CPAutoPlaceBehavior.$inject = [
  'eventBus',
  'gridSnapping',
];

// helpers //////////

function isHorizontal(axis) {
  return axis === 'x';
}

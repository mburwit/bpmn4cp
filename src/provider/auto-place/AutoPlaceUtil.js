import { is } from 'bpmn-js/lib/util/ModelUtil';
import {
  getNewShapePosition,
} from 'bpmn-js/lib/features/auto-place/BpmnAutoPlaceUtil';

import { asTRBL } from 'diagram-js/lib/layout/LayoutUtil';
import {
  findFreePosition,
  generateGetNextPosition,
} from 'diagram-js/lib/features/auto-place/AutoPlaceUtil';

/**
 * Find the new position for the target element to
 * connect to source.
 *
 * @param  {djs.model.Shape} source
 * @param  {djs.model.Base | ModdleElement | djs.model.Shape} element
 *
 * @return {Point}
 */
export function getNewBPMN4CPShapePosition(source, element) {

  if (is(element, 'cp:ObservationFeature')) {
    return getObservationFeaturePosition(source, element);
  }

  if (is(element, 'cp:GoalState')) {
    return getGoalStatePosition(source, element);
  }

  return getNewShapePosition(source, element);
}

/**
 * Always try to place observation types top left of source.
 */
export function getObservationFeaturePosition(source, element) {

  const sourceTrbl = asTRBL(source);

  const position = {
    x: sourceTrbl.left + element.width / 2,
    y: sourceTrbl.top - 50 - element.height / 2,
  };

  const nextPositionDirection = {
    y: {
      margin: -30,
      minDistance: 20,
    },
  };

  return findFreePosition(source, element, position, generateGetNextPosition(nextPositionDirection));
}

/**
 * Always try to place goal states top right of source.
 */
export function getGoalStatePosition(source, element) {

  const sourceTrbl = asTRBL(source);

  const position = {
    x: sourceTrbl.right + element.width / 2,
    y: sourceTrbl.top - 50 - element.height / 2,
  };

  const escapeDirection = {
    y: {
      margin: -30,
      rowSize: 20,
    },
  };

  return deconflictPosition(source, element, position, escapeDirection);
}

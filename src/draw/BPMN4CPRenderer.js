import inherits from 'inherits';

import { assign } from 'min-dash';

import BpmnRenderer from 'bpmn-js/lib/draw/BpmnRenderer';

import { getFillColor, getStrokeColor } from 'bpmn-js/lib/draw/BpmnRenderUtil';

import {
  append as svgAppend,
  attr as svgAttr,
  create as svgCreate,
} from 'tiny-svg';

export default function BPMN4CPRenderer(
  config, eventBus, styles, pathMap,
  canvas, textRenderer) {

  BpmnRenderer.call(this, config, eventBus, styles, pathMap,
    canvas, textRenderer);

  const defaultFillColor = config && config.defaultFillColor,
    defaultStrokeColor = config && config.defaultStrokeColor;

  const computeStyle = styles.computeStyle;

  const additionalHandlers = {
    // 'cp:CoachTask': function(parentGfx, element) {
    //   const task = renderer('bpmn:Task')(parentGfx, element);
    //
    //   const pathData = pathMap.getScaledPath('TASK_TYPE_COACH', {
    //     abspos: {
    //       x: 17,
    //       y: 15,
    //     },
    //   });
    //
    //   /* manual path */
    //   drawPath(parentGfx, pathData, {
    //     strokeWidth: 0.5, // 0.25,
    //     stroke: getFillColor(element, defaultFillColor),
    //     fill: getStrokeColor(element, defaultStrokeColor),
    //   });
    //
    //   return task;
    // },
    // 'cp:GameTask': function(parentGfx, element) {
    //   const task = renderer('bpmn:Task')(parentGfx, element);
    //
    //   const pathData = pathMap.getScaledPath('TASK_TYPE_GAME', {
    //     abspos: {
    //       x: 17,
    //       y: 15,
    //     },
    //   });
    //
    //   /* manual path */
    //   drawPath(parentGfx, pathData, {
    //     strokeWidth: 0.5, // 0.25,
    //     stroke: getFillColor(element, defaultFillColor),
    //     fill: getStrokeColor(element, defaultStrokeColor),
    //   });
    //
    //   return task;
    // },
    'cp:ObservationFeature': function(parentGfx, element) {

      const attrs = {
        fill: getFillColor(element, defaultFillColor),
        stroke: getStrokeColor(element, defaultStrokeColor),
      };

      const pathData = pathMap.getScaledPath('OBSERVATION_FEATURE', {
        xScaleFactor: 1,
        yScaleFactor: 1,
        containerWidth: element.width,
        containerHeight: element.height,
        position: {
          mx: 0,
          my: 1,
        },
      });

      /* manual path */
      return drawPath(parentGfx, pathData, attrs);
    },
    'cp:GoalState': function(parentGfx, element) {

      const attrs = {
        fill: getFillColor(element, defaultFillColor),
        stroke: getStrokeColor(element, defaultStrokeColor),
      };

      const pathData = pathMap.getScaledPath('GOAL_STATE', {
        xScaleFactor: 1,
        yScaleFactor: 1,
        containerWidth: element.width,
        containerHeight: element.height,
        position: {
          mx: 0,
          my: 1,
        },
      });

      /* manual path */
      return drawPath(parentGfx, pathData, attrs);
    }
  };

  const handlers = this.handlers = assign(additionalHandlers, this.handlers);

  function drawPath(parentGfx, d, attrs) {

    attrs = computeStyle(attrs, ['no-fill'], {
      strokeWidth: 2,
      stroke: 'black',
    });

    const path = svgCreate('path');
    svgAttr(path, { d: d });
    svgAttr(path, attrs);

    svgAppend(parentGfx, path);

    return path;
  }

  function renderer(type) {
    return handlers[type];
  }

// extension API, use at your own risk
  this._drawPath = drawPath;

}

inherits(BPMN4CPRenderer, BpmnRenderer);

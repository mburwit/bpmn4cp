import inherits from 'inherits';

import { assign, isObject } from 'min-dash';

import BpmnRenderer from 'bpmn-js/lib/draw/BpmnRenderer';

import {
  getFillColor,
  getSemantic,
  getStrokeColor,
} from 'bpmn-js/lib/draw/BpmnRenderUtil';

import {
  append as svgAppend,
  attr as svgAttr,
  create as svgCreate,
} from 'tiny-svg';

const DEFAULT_FILL_OPACITY = .95;

export default function BPMN4CPRenderer(
  config, eventBus, styles, pathMap,
  canvas, textRenderer) {

  BpmnRenderer.call(this, config, eventBus, styles, pathMap,
    canvas, textRenderer);

  const defaultFillColor = config && config.defaultFillColor,
    defaultStrokeColor = config && config.defaultStrokeColor;

  const computeStyle = styles.computeStyle;

  const additionalHandlers = {
    'cp:QualityIndicator': function(parentGfx, element) {
      let attrs = {
        fill: getFillColor(element, getQIFillColor(element)),
        stroke: getStrokeColor(element, defaultStrokeColor),
      };

      if (!('fillOpacity' in attrs)) {
        attrs.fillOpacity = DEFAULT_FILL_OPACITY;
      }

      const circle = drawCircle(parentGfx, element.width, element.height,
        attrs);

      renderQualityIndicatorContent(element, parentGfx);

      return circle;
    },
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

  this.handlers = assign(this.handlers, additionalHandlers);

  function getQIFillColor(elem) {
    return getSemantic(elem).get('fillColor') || defaultFillColor;
  }

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

  function drawCircle(parentGfx, width, height, offset, attrs) {

    if (isObject(offset)) {
      attrs = offset;
      offset = 0;
    }

    offset = offset || 0;

    attrs = computeStyle(attrs, {
      stroke: 'black',
      strokeWidth: 2,
      fill: 'white',
    });

    if (attrs.fill === 'none') {
      delete attrs.fillOpacity;
    }

    const cx = width / 2,
      cy = height / 2;

    const circle = svgCreate('circle');
    svgAttr(circle, {
      cx: cx,
      cy: cy,
      r: Math.round((width + height) / 4 - offset),
    });
    svgAttr(circle, attrs);

    svgAppend(parentGfx, circle);

    return circle;
  }

  function renderQualityIndicatorContent(element, parentGfx) {
    const pathData = pathMap.getScaledPath('QI', {
      xScaleFactor: 1,
      yScaleFactor: 1,
      containerWidth: element.width,
      containerHeight: element.height,
      position: {
        mx: 0,
        my: 0,
      },
    });

    const fill = getStrokeColor(element, defaultStrokeColor);
    const stroke = getFillColor(element, getQIFillColor(element));

    return drawPath(parentGfx, pathData, {
      strokeWidth: 1,
      fill: fill,
      stroke: stroke,
    });
  }

// extension API, use at your own risk
  this._drawPath = drawPath;

}

inherits(BPMN4CPRenderer, BpmnRenderer);

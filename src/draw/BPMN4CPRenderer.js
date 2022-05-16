import inherits from 'inherits';

import {
    isObject,
    assign,
    forEach
} from 'min-dash';

import BaseRenderer from 'diagram-js/lib/draw/BaseRenderer';

import {
    isExpanded,
    isEventSubProcess
} from 'bpmn-js/lib/util/DiUtil';

import {
    getLabel
} from 'bpmn-js/lib/features/label-editing/LabelUtil';

import {getBusinessObject, is} from 'bpmn-js/lib/util/ModelUtil';

import {
    createLine
} from 'diagram-js/lib/util/RenderUtil';

import {
    isTypedEvent,
    isThrowEvent,
    isCollection,
    getDi,
    getSemantic,
    getCirclePath,
    getRoundRectPath,
    getDiamondPath,
    getRectPath,
    getFillColor,
    getStrokeColor,
    getLabelColor
} from 'bpmn-js/lib/draw/BpmnRenderUtil';

import {
    query as domQuery
} from 'min-dom';

import {
    append as svgAppend,
    attr as svgAttr,
    create as svgCreate,
    classes as svgClasses
} from 'tiny-svg';

import {
    rotate,
    transform,
    translate
} from 'diagram-js/lib/util/SvgTransformUtil';

import Ids from 'ids';
import {getReferences} from "../provider/propertiesProvider/tabs/referenceTab/helper/ReferenceHelper";

const RENDERER_IDS = new Ids();

const TASK_BORDER_RADIUS = 10;
const INNER_OUTER_DIST = 3;

const DEFAULT_FILL_OPACITY = .95,
    HIGH_FILL_OPACITY = .35;

const ELEMENT_LABEL_DISTANCE = 10;

export default function BPMN4CPRenderer(
    config, eventBus, styles, pathMap,
    canvas, textRenderer, priority) {

    BaseRenderer.call(this, eventBus, priority);

    const defaultFillColor = config && config.defaultFillColor,
        defaultStrokeColor = config && config.defaultStrokeColor,
        defaultLabelColor = config && config.defaultLabelColor;

    const rendererId = RENDERER_IDS.next();

    const markers = {};

    const computeStyle = styles.computeStyle;

    function addMarker(id, options) {
        const attrs = assign({
            fill: 'black',
            strokeWidth: 1,
            strokeLinecap: 'round',
            strokeDasharray: 'none'
        }, options.attrs);

        const ref = options.ref || {x: 0, y: 0};

        const scale = options.scale || 1;

        // fix for safari / chrome / firefox bug not correctly
        // resetting stroke dash array
        if (attrs.strokeDasharray === 'none') {
            attrs.strokeDasharray = [10000, 1];
        }

        const marker = svgCreate('marker');

        svgAttr(options.element, attrs);

        svgAppend(marker, options.element);

        svgAttr(marker, {
            id: id,
            viewBox: '0 0 20 20',
            refX: ref.x,
            refY: ref.y,
            markerWidth: 20 * scale,
            markerHeight: 20 * scale,
            orient: 'auto'
        });

        let defs = domQuery('defs', canvas._svg);

        if (!defs) {
            defs = svgCreate('defs');

            svgAppend(canvas._svg, defs);
        }

        svgAppend(defs, marker);

        markers[id] = marker;
    }

    function colorEscape(str) {

        // only allow characters and numbers
        return str.replace(/[^0-9a-zA-z]+/g, '_');
    }

    function marker(type, fill, stroke) {
        const id = type + '-' + colorEscape(fill) + '-' + colorEscape(stroke) + '-' + rendererId;

        if (!markers[id]) {
            createMarker(id, type, fill, stroke);
        }

        return 'url(#' + id + ')';
    }

    function createMarker(id, type, fill, stroke) {

        if (type === 'sequenceflow-end') {
            const sequenceflowEnd = svgCreate('path');
            svgAttr(sequenceflowEnd, {d: 'M 1 5 L 11 10 L 1 15 Z'});

            addMarker(id, {
                element: sequenceflowEnd,
                ref: {x: 11, y: 10},
                scale: 0.5,
                attrs: {
                    fill: stroke,
                    stroke: stroke
                }
            });
        }

        if (type === 'messageflow-start') {
            const messageflowStart = svgCreate('circle');
            svgAttr(messageflowStart, {cx: 6, cy: 6, r: 3.5});

            addMarker(id, {
                element: messageflowStart,
                attrs: {
                    fill: fill,
                    stroke: stroke
                },
                ref: {x: 6, y: 6}
            });
        }

        if (type === 'messageflow-end') {
            const messageflowEnd = svgCreate('path');
            svgAttr(messageflowEnd, {d: 'm 1 5 l 0 -3 l 7 3 l -7 3 z'});

            addMarker(id, {
                element: messageflowEnd,
                attrs: {
                    fill: fill,
                    stroke: stroke,
                    strokeLinecap: 'butt'
                },
                ref: {x: 8.5, y: 5}
            });
        }

        if (type === 'association-start') {
            const associationStart = svgCreate('path');
            svgAttr(associationStart, {d: 'M 11 5 L 1 10 L 11 15'});

            addMarker(id, {
                element: associationStart,
                attrs: {
                    fill: 'none',
                    stroke: stroke,
                    strokeWidth: 1.5
                },
                ref: {x: 1, y: 10},
                scale: 0.5
            });
        }

        if (type === 'association-end') {
            const associationEnd = svgCreate('path');
            svgAttr(associationEnd, {d: 'M 1 5 L 11 10 L 1 15'});

            addMarker(id, {
                element: associationEnd,
                attrs: {
                    fill: 'none',
                    stroke: stroke,
                    strokeWidth: 1.5
                },
                ref: {x: 12, y: 10},
                scale: 0.5
            });
        }

        if (type === 'conditional-flow-marker') {
            const conditionalflowMarker = svgCreate('path');
            svgAttr(conditionalflowMarker, {d: 'M 0 10 L 8 6 L 16 10 L 8 14 Z'});

            addMarker(id, {
                element: conditionalflowMarker,
                attrs: {
                    fill: fill,
                    stroke: stroke
                },
                ref: {x: -1, y: 10},
                scale: 0.5
            });
        }

        if (type === 'conditional-default-flow-marker') {
            const conditionaldefaultflowMarker = svgCreate('path');
            svgAttr(conditionaldefaultflowMarker, {d: 'M 6 4 L 10 16'});

            addMarker(id, {
                element: conditionaldefaultflowMarker,
                attrs: {
                    stroke: stroke
                },
                ref: {x: 0, y: 10},
                scale: 0.5
            });
        }
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
            fill: 'white'
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
            r: Math.round((width + height) / 4 - offset)
        });
        svgAttr(circle, attrs);

        svgAppend(parentGfx, circle);

        return circle;
    }

    function drawRect(parentGfx, width, height, r, offset, attrs) {

        if (isObject(offset)) {
            attrs = offset;
            offset = 0;
        }

        offset = offset || 0;

        attrs = computeStyle(attrs, {
            stroke: 'black',
            strokeWidth: 2,
            fill: 'white'
        });

        const rect = svgCreate('rect');
        svgAttr(rect, {
            x: offset,
            y: offset,
            width: width - offset * 2,
            height: height - offset * 2,
            rx: r,
            ry: r
        });
        svgAttr(rect, attrs);

        svgAppend(parentGfx, rect);

        return rect;
    }

    function drawDiamond(parentGfx, width, height, attrs) {

        const x_2 = width / 2;
        const y_2 = height / 2;

        const points = [{x: x_2, y: 0}, {x: width, y: y_2}, {x: x_2, y: height}, {x: 0, y: y_2}];

        const pointsString = points.map(function (point) {
            return point.x + ',' + point.y;
        }).join(' ');

        attrs = computeStyle(attrs, {
            stroke: 'black',
            strokeWidth: 2,
            fill: 'white'
        });

        const polygon = svgCreate('polygon');
        svgAttr(polygon, {
            points: pointsString
        });
        svgAttr(polygon, attrs);

        svgAppend(parentGfx, polygon);

        return polygon;
    }

    function drawLine(parentGfx, waypoints, attrs) {
        attrs = computeStyle(attrs, ['no-fill'], {
            stroke: 'black',
            strokeWidth: 2,
            fill: 'none'
        });

        const line = createLine(waypoints, attrs);

        svgAppend(parentGfx, line);

        return line;
    }

    function drawPath(parentGfx, d, attrs) {

        attrs = computeStyle(attrs, ['no-fill'], {
            strokeWidth: 2,
            stroke: 'black'
        });

        const path = svgCreate('path');
        svgAttr(path, {d: d});
        svgAttr(path, attrs);

        svgAppend(parentGfx, path);

        return path;
    }

    function drawMarker(type, parentGfx, path, attrs) {
        return drawPath(parentGfx, path, assign({'data-marker': type}, attrs));
    }

    function as(type) {
        return function (parentGfx, element) {
            return handlers[type](parentGfx, element);
        };
    }

    function renderer(type) {
        return handlers[type];
    }

    function renderEventContent(element, parentGfx) {

        const event = getSemantic(element);
        const isThrowing = isThrowEvent(event);

        if (event.eventDefinitions && event.eventDefinitions.length > 1) {
            if (event.parallelMultiple) {
                return renderer('bpmn:ParallelMultipleEventDefinition')(parentGfx, element, isThrowing);
            } else {
                return renderer('bpmn:MultipleEventDefinition')(parentGfx, element, isThrowing);
            }
        }

        if (isTypedEvent(event, 'bpmn:MessageEventDefinition')) {
            return renderer('bpmn:MessageEventDefinition')(parentGfx, element, isThrowing);
        }

        if (isTypedEvent(event, 'bpmn:TimerEventDefinition')) {
            return renderer('bpmn:TimerEventDefinition')(parentGfx, element, isThrowing);
        }

        if (isTypedEvent(event, 'bpmn:ConditionalEventDefinition')) {
            return renderer('bpmn:ConditionalEventDefinition')(parentGfx, element);
        }

        if (isTypedEvent(event, 'bpmn:SignalEventDefinition')) {
            return renderer('bpmn:SignalEventDefinition')(parentGfx, element, isThrowing);
        }

        if (isTypedEvent(event, 'bpmn:EscalationEventDefinition')) {
            return renderer('bpmn:EscalationEventDefinition')(parentGfx, element, isThrowing);
        }

        if (isTypedEvent(event, 'bpmn:LinkEventDefinition')) {
            return renderer('bpmn:LinkEventDefinition')(parentGfx, element, isThrowing);
        }

        if (isTypedEvent(event, 'bpmn:ErrorEventDefinition')) {
            return renderer('bpmn:ErrorEventDefinition')(parentGfx, element, isThrowing);
        }

        if (isTypedEvent(event, 'bpmn:CancelEventDefinition')) {
            return renderer('bpmn:CancelEventDefinition')(parentGfx, element, isThrowing);
        }

        if (isTypedEvent(event, 'bpmn:CompensateEventDefinition')) {
            return renderer('bpmn:CompensateEventDefinition')(parentGfx, element, isThrowing);
        }

        if (isTypedEvent(event, 'bpmn:TerminateEventDefinition')) {
            return renderer('bpmn:TerminateEventDefinition')(parentGfx, element, isThrowing);
        }

        return null;
    }

    function renderLabel(parentGfx, label, options) {

        options = assign({
            size: {
                width: 100
            }
        }, options);

        const text = textRenderer.createText(label || '', options);

        svgClasses(text).add('djs-label');

        svgAppend(parentGfx, text);

        return text;
    }

    function renderEmbeddedLabel(parentGfx, element, align) {
        const label = appendBibliographyRefs(getLabel(element), element);
        return renderLabel(parentGfx, label, {
            box: element,
            align: align,
            padding: 5,
            style: {
                fill: getLabelColor(element, defaultLabelColor, defaultStrokeColor)
            }
        });
    }

    function renderExternalLabel(parentGfx, element) {

        const box = {
            width: 90,
            height: 30,
            x: element.width / 2 + element.x,
            y: element.height / 2 + element.y
        };

        const label = appendBibliographyRefs(getLabel(element), element);
        return renderLabel(parentGfx, label, {
            box: box,
            fitBox: true,
            style: assign(
                {},
                textRenderer.getExternalStyle(),
                {
                    fill: getLabelColor(element, defaultLabelColor, defaultStrokeColor)
                }
            )
        });
    }

    function renderLaneLabel(parentGfx, text, element) {
        const textBox = renderLabel(parentGfx, text, {
            box: {
                height: 30,
                width: element.height
            },
            align: 'center-middle',
            style: {
                fill: getLabelColor(element, defaultLabelColor, defaultStrokeColor)
            }
        });

        const top = -1 * element.height;

        transform(textBox, 0, -top, 270);
    }

    function createPathFromConnection(connection) {
        const waypoints = connection.waypoints;

        let pathData = 'm  ' + waypoints[0].x + ',' + waypoints[0].y;
        for (let i = 1; i < waypoints.length; i++) {
            pathData += 'L' + waypoints[i].x + ',' + waypoints[i].y + ' ';
        }
        return pathData;
    }


    const customHandlers = {
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

    const handlers = this.handlers = assign(customHandlers, {
        'bpmn:Event': function (parentGfx, element, attrs) {

            if (!('fillOpacity' in attrs)) {
                attrs.fillOpacity = DEFAULT_FILL_OPACITY;
            }

            return drawCircle(parentGfx, element.width, element.height, attrs);
        },
        'bpmn:StartEvent': function (parentGfx, element) {
            let attrs = {
                fill: getFillColor(element, defaultFillColor),
                stroke: getStrokeColor(element, defaultStrokeColor)
            };

            const semantic = getSemantic(element);

            if (!semantic.isInterrupting) {
                attrs = {
                    strokeDasharray: '6',
                    strokeLinecap: 'round',
                    fill: getFillColor(element, defaultFillColor),
                    stroke: getStrokeColor(element, defaultStrokeColor)
                };
            }

            const circle = renderer('bpmn:Event')(parentGfx, element, attrs);

            renderEventContent(element, parentGfx);

            return circle;
        },
        'bpmn:MessageEventDefinition': function (parentGfx, element, isThrowing) {
            const pathData = pathMap.getScaledPath('EVENT_MESSAGE', {
                xScaleFactor: 0.9,
                yScaleFactor: 0.9,
                containerWidth: element.width,
                containerHeight: element.height,
                position: {
                    mx: 0.235,
                    my: 0.315
                }
            });

            const fill = isThrowing ? getStrokeColor(element, defaultStrokeColor) : getFillColor(element, defaultFillColor);
            const stroke = isThrowing ? getFillColor(element, defaultFillColor) : getStrokeColor(element, defaultStrokeColor);

            return drawPath(parentGfx, pathData, {
                strokeWidth: 1,
                fill: fill,
                stroke: stroke
            });
        },
        'bpmn:TimerEventDefinition': function (parentGfx, element) {
            const circle = drawCircle(parentGfx, element.width, element.height, 0.2 * element.height, {
                strokeWidth: 2,
                fill: getFillColor(element, defaultFillColor),
                stroke: getStrokeColor(element, defaultStrokeColor)
            });

            const pathData = pathMap.getScaledPath('EVENT_TIMER_WH', {
                xScaleFactor: 0.75,
                yScaleFactor: 0.75,
                containerWidth: element.width,
                containerHeight: element.height,
                position: {
                    mx: 0.5,
                    my: 0.5
                }
            });

            drawPath(parentGfx, pathData, {
                strokeWidth: 2,
                strokeLinecap: 'square',
                stroke: getStrokeColor(element, defaultStrokeColor)
            });

            for (let i = 0; i < 12; i++) {

                const linePathData = pathMap.getScaledPath('EVENT_TIMER_LINE', {
                    xScaleFactor: 0.75,
                    yScaleFactor: 0.75,
                    containerWidth: element.width,
                    containerHeight: element.height,
                    position: {
                        mx: 0.5,
                        my: 0.5
                    }
                });

                const width = element.width / 2;
                const height = element.height / 2;

                drawPath(parentGfx, linePathData, {
                    strokeWidth: 1,
                    strokeLinecap: 'square',
                    transform: 'rotate(' + (i * 30) + ',' + height + ',' + width + ')',
                    stroke: getStrokeColor(element, defaultStrokeColor)
                });
            }

            return circle;
        },
        'bpmn:EscalationEventDefinition': function (parentGfx, event, isThrowing) {
            const pathData = pathMap.getScaledPath('EVENT_ESCALATION', {
                xScaleFactor: 1,
                yScaleFactor: 1,
                containerWidth: event.width,
                containerHeight: event.height,
                position: {
                    mx: 0.5,
                    my: 0.2
                }
            });

            const fill = isThrowing ? getStrokeColor(event, defaultStrokeColor) : 'none';

            return drawPath(parentGfx, pathData, {
                strokeWidth: 1,
                fill: fill,
                stroke: getStrokeColor(event, defaultStrokeColor)
            });
        },
        'bpmn:ConditionalEventDefinition': function (parentGfx, event) {
            const pathData = pathMap.getScaledPath('EVENT_CONDITIONAL', {
                xScaleFactor: 1,
                yScaleFactor: 1,
                containerWidth: event.width,
                containerHeight: event.height,
                position: {
                    mx: 0.5,
                    my: 0.222
                }
            });

            return drawPath(parentGfx, pathData, {
                strokeWidth: 1,
                stroke: getStrokeColor(event, defaultStrokeColor)
            });
        },
        'bpmn:LinkEventDefinition': function (parentGfx, event, isThrowing) {
            const pathData = pathMap.getScaledPath('EVENT_LINK', {
                xScaleFactor: 1,
                yScaleFactor: 1,
                containerWidth: event.width,
                containerHeight: event.height,
                position: {
                    mx: 0.57,
                    my: 0.263
                }
            });

            const fill = isThrowing ? getStrokeColor(event, defaultStrokeColor) : 'none';

            return drawPath(parentGfx, pathData, {
                strokeWidth: 1,
                fill: fill,
                stroke: getStrokeColor(event, defaultStrokeColor)
            });
        },
        'bpmn:ErrorEventDefinition': function (parentGfx, event, isThrowing) {
            const pathData = pathMap.getScaledPath('EVENT_ERROR', {
                xScaleFactor: 1.1,
                yScaleFactor: 1.1,
                containerWidth: event.width,
                containerHeight: event.height,
                position: {
                    mx: 0.2,
                    my: 0.722
                }
            });

            const fill = isThrowing ? getStrokeColor(event, defaultStrokeColor) : 'none';

            return drawPath(parentGfx, pathData, {
                strokeWidth: 1,
                fill: fill,
                stroke: getStrokeColor(event, defaultStrokeColor)
            });
        },
        'bpmn:CancelEventDefinition': function (parentGfx, event, isThrowing) {
            const pathData = pathMap.getScaledPath('EVENT_CANCEL_45', {
                xScaleFactor: 1.0,
                yScaleFactor: 1.0,
                containerWidth: event.width,
                containerHeight: event.height,
                position: {
                    mx: 0.638,
                    my: -0.055
                }
            });

            const fill = isThrowing ? getStrokeColor(event, defaultStrokeColor) : 'none';

            const path = drawPath(parentGfx, pathData, {
                strokeWidth: 1,
                fill: fill,
                stroke: getStrokeColor(event, defaultStrokeColor)
            });

            rotate(path, 45);

            return path;
        },
        'bpmn:CompensateEventDefinition': function (parentGfx, event, isThrowing) {
            const pathData = pathMap.getScaledPath('EVENT_COMPENSATION', {
                xScaleFactor: 1,
                yScaleFactor: 1,
                containerWidth: event.width,
                containerHeight: event.height,
                position: {
                    mx: 0.22,
                    my: 0.5
                }
            });

            const fill = isThrowing ? getStrokeColor(event, defaultStrokeColor) : 'none';

            return drawPath(parentGfx, pathData, {
                strokeWidth: 1,
                fill: fill,
                stroke: getStrokeColor(event, defaultStrokeColor)
            });
        },
        'bpmn:SignalEventDefinition': function (parentGfx, event, isThrowing) {
            const pathData = pathMap.getScaledPath('EVENT_SIGNAL', {
                xScaleFactor: 0.9,
                yScaleFactor: 0.9,
                containerWidth: event.width,
                containerHeight: event.height,
                position: {
                    mx: 0.5,
                    my: 0.2
                }
            });

            const fill = isThrowing ? getStrokeColor(event, defaultStrokeColor) : 'none';

            return drawPath(parentGfx, pathData, {
                strokeWidth: 1,
                fill: fill,
                stroke: getStrokeColor(event, defaultStrokeColor)
            });
        },
        'bpmn:MultipleEventDefinition': function (parentGfx, event, isThrowing) {
            const pathData = pathMap.getScaledPath('EVENT_MULTIPLE', {
                xScaleFactor: 1.1,
                yScaleFactor: 1.1,
                containerWidth: event.width,
                containerHeight: event.height,
                position: {
                    mx: 0.222,
                    my: 0.36
                }
            });

            const fill = isThrowing ? getStrokeColor(event, defaultStrokeColor) : 'none';

            return drawPath(parentGfx, pathData, {
                strokeWidth: 1,
                fill: fill
            });
        },
        'bpmn:ParallelMultipleEventDefinition': function (parentGfx, event) {
            const pathData = pathMap.getScaledPath('EVENT_PARALLEL_MULTIPLE', {
                xScaleFactor: 1.2,
                yScaleFactor: 1.2,
                containerWidth: event.width,
                containerHeight: event.height,
                position: {
                    mx: 0.458,
                    my: 0.194
                }
            });

            return drawPath(parentGfx, pathData, {
                strokeWidth: 1,
                fill: getStrokeColor(event, defaultStrokeColor),
                stroke: getStrokeColor(event, defaultStrokeColor)
            });
        },
        'bpmn:EndEvent': function (parentGfx, element) {
            const circle = renderer('bpmn:Event')(parentGfx, element, {
                strokeWidth: 4,
                fill: getFillColor(element, defaultFillColor),
                stroke: getStrokeColor(element, defaultStrokeColor)
            });

            renderEventContent(element, parentGfx, true);

            return circle;
        },
        'bpmn:TerminateEventDefinition': function (parentGfx, element) {
            return drawCircle(parentGfx, element.width, element.height, 8, {
                strokeWidth: 4,
                fill: getStrokeColor(element, defaultStrokeColor),
                stroke: getStrokeColor(element, defaultStrokeColor)
            });
        },
        'bpmn:IntermediateEvent': function (parentGfx, element) {
            const outer = renderer('bpmn:Event')(parentGfx, element, {
                strokeWidth: 1,
                fill: getFillColor(element, defaultFillColor),
                stroke: getStrokeColor(element, defaultStrokeColor)
            });

            /* inner */
            drawCircle(parentGfx, element.width, element.height, INNER_OUTER_DIST, {
                strokeWidth: 1,
                fill: getFillColor(element, 'none'),
                stroke: getStrokeColor(element, defaultStrokeColor)
            });

            renderEventContent(element, parentGfx);

            return outer;
        },
        'bpmn:IntermediateCatchEvent': as('bpmn:IntermediateEvent'),
        'bpmn:IntermediateThrowEvent': as('bpmn:IntermediateEvent'),

        'bpmn:Activity': function (parentGfx, element, attrs) {

            attrs = attrs || {};

            if (!('fillOpacity' in attrs)) {
                attrs.fillOpacity = DEFAULT_FILL_OPACITY;
            }

            return drawRect(parentGfx, element.width, element.height, TASK_BORDER_RADIUS, attrs);
        },

        'bpmn:Task': function (parentGfx, element) {
            const attrs = {
                fill: getFillColor(element, defaultFillColor),
                stroke: getStrokeColor(element, defaultStrokeColor)
            };

            const rect = renderer('bpmn:Activity')(parentGfx, element, attrs);

            renderEmbeddedLabel(parentGfx, element, 'center-middle');
            attachTaskMarkers(parentGfx, element);

            return rect;
        },
        'bpmn:ServiceTask': function (parentGfx, element) {
            const task = renderer('bpmn:Task')(parentGfx, element);

            const pathDataBG = pathMap.getScaledPath('TASK_TYPE_SERVICE', {
                abspos: {
                    x: 12,
                    y: 18
                }
            });

            /* service bg */
            drawPath(parentGfx, pathDataBG, {
                strokeWidth: 1,
                fill: getFillColor(element, defaultFillColor),
                stroke: getStrokeColor(element, defaultStrokeColor)
            });

            const fillPathData = pathMap.getScaledPath('TASK_TYPE_SERVICE_FILL', {
                abspos: {
                    x: 17.2,
                    y: 18
                }
            });

            /* service fill */
            drawPath(parentGfx, fillPathData, {
                strokeWidth: 0,
                fill: getFillColor(element, defaultFillColor)
            });

            const pathData = pathMap.getScaledPath('TASK_TYPE_SERVICE', {
                abspos: {
                    x: 17,
                    y: 22
                }
            });

            /* service */
            drawPath(parentGfx, pathData, {
                strokeWidth: 1,
                fill: getFillColor(element, defaultFillColor),
                stroke: getStrokeColor(element, defaultStrokeColor)
            });

            return task;
        },
        'bpmn:UserTask': function (parentGfx, element) {
            const task = renderer('bpmn:Task')(parentGfx, element);

            const x = 15;
            const y = 12;

            const pathData = pathMap.getScaledPath('TASK_TYPE_USER_1', {
                abspos: {
                    x: x,
                    y: y
                }
            });

            /* user path */
            drawPath(parentGfx, pathData, {
                strokeWidth: 0.5,
                fill: getFillColor(element, defaultFillColor),
                stroke: getStrokeColor(element, defaultStrokeColor)
            });

            const pathData2 = pathMap.getScaledPath('TASK_TYPE_USER_2', {
                abspos: {
                    x: x,
                    y: y
                }
            });

            /* user2 path */
            drawPath(parentGfx, pathData2, {
                strokeWidth: 0.5,
                fill: getFillColor(element, defaultFillColor),
                stroke: getStrokeColor(element, defaultStrokeColor)
            });

            const pathData3 = pathMap.getScaledPath('TASK_TYPE_USER_3', {
                abspos: {
                    x: x,
                    y: y
                }
            });

            /* user3 path */
            drawPath(parentGfx, pathData3, {
                strokeWidth: 0.5,
                fill: getStrokeColor(element, defaultStrokeColor),
                stroke: getStrokeColor(element, defaultStrokeColor)
            });

            return task;
        },
        'bpmn:ManualTask': function (parentGfx, element) {
            const task = renderer('bpmn:Task')(parentGfx, element);

            const pathData = pathMap.getScaledPath('TASK_TYPE_MANUAL', {
                abspos: {
                    x: 17,
                    y: 15
                }
            });

            /* manual path */
            drawPath(parentGfx, pathData, {
                strokeWidth: 0.5, // 0.25,
                fill: getFillColor(element, defaultFillColor),
                stroke: getStrokeColor(element, defaultStrokeColor)
            });

            return task;
        },
        'bpmn:SendTask': function (parentGfx, element) {
            const task = renderer('bpmn:Task')(parentGfx, element);

            const pathData = pathMap.getScaledPath('TASK_TYPE_SEND', {
                xScaleFactor: 1,
                yScaleFactor: 1,
                containerWidth: 21,
                containerHeight: 14,
                position: {
                    mx: 0.285,
                    my: 0.357
                }
            });

            /* send path */
            drawPath(parentGfx, pathData, {
                strokeWidth: 1,
                fill: getStrokeColor(element, defaultStrokeColor),
                stroke: getFillColor(element, defaultFillColor)
            });

            return task;
        },
        'bpmn:ReceiveTask': function (parentGfx, element) {
            const semantic = getSemantic(element);

            const task = renderer('bpmn:Task')(parentGfx, element);
            let pathData;

            if (semantic.instantiate) {
                drawCircle(parentGfx, 28, 28, 20 * 0.22, {strokeWidth: 1});

                pathData = pathMap.getScaledPath('TASK_TYPE_INSTANTIATING_SEND', {
                    abspos: {
                        x: 7.77,
                        y: 9.52
                    }
                });
            } else {

                pathData = pathMap.getScaledPath('TASK_TYPE_SEND', {
                    xScaleFactor: 0.9,
                    yScaleFactor: 0.9,
                    containerWidth: 21,
                    containerHeight: 14,
                    position: {
                        mx: 0.3,
                        my: 0.4
                    }
                });
            }

            /* receive path */
            drawPath(parentGfx, pathData, {
                strokeWidth: 1,
                fill: getFillColor(element, defaultFillColor),
                stroke: getStrokeColor(element, defaultStrokeColor)
            });

            return task;
        },
        'bpmn:ScriptTask': function (parentGfx, element) {
            const task = renderer('bpmn:Task')(parentGfx, element);

            const pathData = pathMap.getScaledPath('TASK_TYPE_SCRIPT', {
                abspos: {
                    x: 15,
                    y: 20
                }
            });

            /* script path */
            drawPath(parentGfx, pathData, {
                strokeWidth: 1,
                stroke: getStrokeColor(element, defaultStrokeColor)
            });

            return task;
        },
        'bpmn:BusinessRuleTask': function (parentGfx, element) {
            const task = renderer('bpmn:Task')(parentGfx, element);

            const headerPathData = pathMap.getScaledPath('TASK_TYPE_BUSINESS_RULE_HEADER', {
                abspos: {
                    x: 8,
                    y: 8
                }
            });

            const businessHeaderPath = drawPath(parentGfx, headerPathData);
            svgAttr(businessHeaderPath, {
                strokeWidth: 1,
                fill: getFillColor(element, '#aaaaaa'),
                stroke: getStrokeColor(element, defaultStrokeColor)
            });

            const headerData = pathMap.getScaledPath('TASK_TYPE_BUSINESS_RULE_MAIN', {
                abspos: {
                    x: 8,
                    y: 8
                }
            });

            const businessPath = drawPath(parentGfx, headerData);
            svgAttr(businessPath, {
                strokeWidth: 1,
                stroke: getStrokeColor(element, defaultStrokeColor)
            });

            return task;
        },
        'bpmn:SubProcess': function (parentGfx, element, attrs) {
            attrs = assign({
                fill: getFillColor(element, defaultFillColor),
                stroke: getStrokeColor(element, defaultStrokeColor)
            }, attrs);

            const rect = renderer('bpmn:Activity')(parentGfx, element, attrs);

            const expanded = isExpanded(element);

            if (isEventSubProcess(element)) {
                svgAttr(rect, {
                    strokeDasharray: '1,2'
                });
            }

            renderEmbeddedLabel(parentGfx, element, expanded ? 'center-top' : 'center-middle');

            if (expanded) {
                attachTaskMarkers(parentGfx, element);
            } else {
                attachTaskMarkers(parentGfx, element, ['SubProcessMarker']);
            }

            return rect;
        },
        'bpmn:AdHocSubProcess': function (parentGfx, element) {
            return renderer('bpmn:SubProcess')(parentGfx, element);
        },
        'bpmn:Transaction': function (parentGfx, element) {
            const outer = renderer('bpmn:SubProcess')(parentGfx, element);

            const innerAttrs = styles.style(['no-fill', 'no-events'], {
                stroke: getStrokeColor(element, defaultStrokeColor)
            });

            /* inner path */
            drawRect(parentGfx, element.width, element.height, TASK_BORDER_RADIUS - 2, INNER_OUTER_DIST, innerAttrs);

            return outer;
        },
        'bpmn:CallActivity': function (parentGfx, element) {
            return renderer('bpmn:SubProcess')(parentGfx, element, {
                strokeWidth: 5
            });
        },
        'bpmn:Participant': function (parentGfx, element) {

            const attrs = {
                fillOpacity: DEFAULT_FILL_OPACITY,
                fill: getFillColor(element, defaultFillColor),
                stroke: getStrokeColor(element, defaultStrokeColor)
            };

            const lane = renderer('bpmn:Lane')(parentGfx, element, attrs);

            const expandedPool = isExpanded(element);

            const label = appendBibliographyRefs(getLabel(element), element);

            if (expandedPool) {
                drawLine(parentGfx, [
                    {x: 30, y: 0},
                    {x: 30, y: element.height}
                ], {
                    stroke: getStrokeColor(element, defaultStrokeColor)
                });
                renderLaneLabel(parentGfx, label, element);
            } else {
                // Collapsed pool draw text inline
                renderLabel(parentGfx, label, {
                    box: element, align: 'center-middle',
                    style: {
                        fill: getLabelColor(element, defaultLabelColor, defaultStrokeColor)
                    }
                });
            }

            const participantMultiplicity = !!(getSemantic(element).participantMultiplicity);

            if (participantMultiplicity) {
                renderer('ParticipantMultiplicityMarker')(parentGfx, element);
            }

            return lane;
        },
        'bpmn:Lane': function (parentGfx, element, attrs) {
            const rect = drawRect(parentGfx, element.width, element.height, 0, assign({
                fill: getFillColor(element, defaultFillColor),
                fillOpacity: HIGH_FILL_OPACITY,
                stroke: getStrokeColor(element, defaultStrokeColor)
            }, attrs));

            const semantic = getSemantic(element);

            if (semantic.$type === 'bpmn:Lane') {
                const label = appendBibliographyRefs(getLabel(element), element);
                renderLaneLabel(parentGfx, label, element);
            }

            return rect;
        },
        'bpmn:InclusiveGateway': function (parentGfx, element) {
            const diamond = renderer('bpmn:Gateway')(parentGfx, element);

            /* circle path */
            drawCircle(parentGfx, element.width, element.height, element.height * 0.24, {
                strokeWidth: 2.5,
                fill: getFillColor(element, defaultFillColor),
                stroke: getStrokeColor(element, defaultStrokeColor)
            });

            return diamond;
        },
        'bpmn:ExclusiveGateway': function (parentGfx, element) {
            const diamond = renderer('bpmn:Gateway')(parentGfx, element);

            const pathData = pathMap.getScaledPath('GATEWAY_EXCLUSIVE', {
                xScaleFactor: 0.4,
                yScaleFactor: 0.4,
                containerWidth: element.width,
                containerHeight: element.height,
                position: {
                    mx: 0.32,
                    my: 0.3
                }
            });

            if ((getDi(element).isMarkerVisible)) {
                drawPath(parentGfx, pathData, {
                    strokeWidth: 1,
                    fill: getStrokeColor(element, defaultStrokeColor),
                    stroke: getStrokeColor(element, defaultStrokeColor)
                });
            }

            return diamond;
        },
        'bpmn:ComplexGateway': function (parentGfx, element) {
            const diamond = renderer('bpmn:Gateway')(parentGfx, element);

            const pathData = pathMap.getScaledPath('GATEWAY_COMPLEX', {
                xScaleFactor: 0.5,
                yScaleFactor: 0.5,
                containerWidth: element.width,
                containerHeight: element.height,
                position: {
                    mx: 0.46,
                    my: 0.26
                }
            });

            /* complex path */
            drawPath(parentGfx, pathData, {
                strokeWidth: 1,
                fill: getStrokeColor(element, defaultStrokeColor),
                stroke: getStrokeColor(element, defaultStrokeColor)
            });

            return diamond;
        },
        'bpmn:ParallelGateway': function (parentGfx, element) {
            const diamond = renderer('bpmn:Gateway')(parentGfx, element);

            const pathData = pathMap.getScaledPath('GATEWAY_PARALLEL', {
                xScaleFactor: 0.6,
                yScaleFactor: 0.6,
                containerWidth: element.width,
                containerHeight: element.height,
                position: {
                    mx: 0.46,
                    my: 0.2
                }
            });

            /* parallel path */
            drawPath(parentGfx, pathData, {
                strokeWidth: 1,
                fill: getStrokeColor(element, defaultStrokeColor),
                stroke: getStrokeColor(element, defaultStrokeColor)
            });

            return diamond;
        },
        'bpmn:EventBasedGateway': function (parentGfx, element) {

            const semantic = getSemantic(element);

            const diamond = renderer('bpmn:Gateway')(parentGfx, element);

            /* outer circle path */
            drawCircle(parentGfx, element.width, element.height, element.height * 0.20, {
                strokeWidth: 1,
                fill: 'none',
                stroke: getStrokeColor(element, defaultStrokeColor)
            });

            const type = semantic.eventGatewayType;
            const instantiate = !!semantic.instantiate;

            function drawEvent() {

                const pathData = pathMap.getScaledPath('GATEWAY_EVENT_BASED', {
                    xScaleFactor: 0.18,
                    yScaleFactor: 0.18,
                    containerWidth: element.width,
                    containerHeight: element.height,
                    position: {
                        mx: 0.36,
                        my: 0.44
                    }
                });

                const attrs = {
                    strokeWidth: 2,
                    fill: getFillColor(element, 'none'),
                    stroke: getStrokeColor(element, defaultStrokeColor)
                };

                /* event path */
                drawPath(parentGfx, pathData, attrs);
            }

            if (type === 'Parallel') {

                const pathData = pathMap.getScaledPath('GATEWAY_PARALLEL', {
                    xScaleFactor: 0.4,
                    yScaleFactor: 0.4,
                    containerWidth: element.width,
                    containerHeight: element.height,
                    position: {
                        mx: 0.474,
                        my: 0.296
                    }
                });

                const parallelPath = drawPath(parentGfx, pathData);
                svgAttr(parallelPath, {
                    strokeWidth: 1,
                    fill: 'none'
                });
            } else if (type === 'Exclusive') {

                if (!instantiate) {
                    const innerCircle = drawCircle(parentGfx, element.width, element.height, element.height * 0.26);
                    svgAttr(innerCircle, {
                        strokeWidth: 1,
                        fill: 'none',
                        stroke: getStrokeColor(element, defaultStrokeColor)
                    });
                }

                drawEvent();
            }


            return diamond;
        },
        'bpmn:Gateway': function (parentGfx, element) {
            const attrs = {
                fill: getFillColor(element, defaultFillColor),
                fillOpacity: DEFAULT_FILL_OPACITY,
                stroke: getStrokeColor(element, defaultStrokeColor)
            };

            return drawDiamond(parentGfx, element.width, element.height, attrs);
        },
        'bpmn:SequenceFlow': function (parentGfx, element) {
            const pathData = createPathFromConnection(element);

            const fill = getFillColor(element, defaultFillColor),
                stroke = getStrokeColor(element, defaultStrokeColor);

            const attrs = {
                strokeLinejoin: 'round',
                markerEnd: marker('sequenceflow-end', fill, stroke),
                stroke: getStrokeColor(element, defaultStrokeColor)
            };

            const path = drawPath(parentGfx, pathData, attrs);

            const sequenceFlow = getSemantic(element);

            let source;

            if (element.source) {
                source = element.source.businessObject;

                // conditional flow marker
                if (sequenceFlow.conditionExpression && source.$instanceOf('bpmn:Activity')) {
                    svgAttr(path, {
                        markerStart: marker('conditional-flow-marker', fill, stroke)
                    });
                }

                // default marker
                if (source.default && (source.$instanceOf('bpmn:Gateway') || source.$instanceOf('bpmn:Activity')) &&
                    source.default === sequenceFlow) {
                    svgAttr(path, {
                        markerStart: marker('conditional-default-flow-marker', fill, stroke)
                    });
                }
            }

            return path;
        },
        'bpmn:Association': function (parentGfx, element, attrs) {

            const semantic = getSemantic(element);

            const fill = getFillColor(element, defaultFillColor),
                stroke = getStrokeColor(element, defaultStrokeColor);

            attrs = assign({
                strokeDasharray: '0.5, 5',
                strokeLinecap: 'round',
                strokeLinejoin: 'round',
                stroke: getStrokeColor(element, defaultStrokeColor)
            }, attrs || {});

            if (semantic.associationDirection === 'One' ||
                semantic.associationDirection === 'Both') {
                attrs.markerEnd = marker('association-end', fill, stroke);
            }

            if (semantic.associationDirection === 'Both') {
                attrs.markerStart = marker('association-start', fill, stroke);
            }

            return drawLine(parentGfx, element.waypoints, attrs);
        },
        'bpmn:DataInputAssociation': function (parentGfx, element) {
            const fill = getFillColor(element, defaultFillColor),
                stroke = getStrokeColor(element, defaultStrokeColor);

            return renderer('bpmn:Association')(parentGfx, element, {
                markerEnd: marker('association-end', fill, stroke)
            });
        },
        'bpmn:DataOutputAssociation': function (parentGfx, element) {
            const fill = getFillColor(element, defaultFillColor),
                stroke = getStrokeColor(element, defaultStrokeColor);

            return renderer('bpmn:Association')(parentGfx, element, {
                markerEnd: marker('association-end', fill, stroke)
            });
        },
        'bpmn:MessageFlow': function (parentGfx, element) {

            const semantic = getSemantic(element),
                di = getDi(element);

            const fill = getFillColor(element, defaultFillColor),
                stroke = getStrokeColor(element, defaultStrokeColor);

            const pathData = createPathFromConnection(element);

            const attrs = {
                markerEnd: marker('messageflow-end', fill, stroke),
                markerStart: marker('messageflow-start', fill, stroke),
                strokeDasharray: '10, 12',
                strokeLinecap: 'round',
                strokeLinejoin: 'round',
                strokeWidth: '1.5px',
                stroke: getStrokeColor(element, defaultStrokeColor)
            };

            const path = drawPath(parentGfx, pathData, attrs);

            if (semantic.messageRef) {
                const midPoint = path.getPointAtLength(path.getTotalLength() / 2);

                const markerPathData = pathMap.getScaledPath('MESSAGE_FLOW_MARKER', {
                    abspos: {
                        x: midPoint.x,
                        y: midPoint.y
                    }
                });

                const messageAttrs = {strokeWidth: 1};

                if (di.messageVisibleKind === 'initiating') {
                    messageAttrs.fill = 'white';
                    messageAttrs.stroke = 'black';
                } else {
                    messageAttrs.fill = '#888';
                    messageAttrs.stroke = 'white';
                }

                const message = drawPath(parentGfx, markerPathData, messageAttrs);

                const labelText = appendBibliographyRefs(getLabel(semantic.messageRef), semantic.messageRef);
                const label = renderLabel(parentGfx, labelText, {
                    align: 'center-top',
                    fitBox: true,
                    style: {
                        fill: getStrokeColor(element, defaultLabelColor, defaultStrokeColor)
                    }
                });

                const messageBounds = message.getBBox(),
                    labelBounds = label.getBBox();

                const translateX = midPoint.x - labelBounds.width / 2,
                    translateY = midPoint.y + messageBounds.height / 2 + ELEMENT_LABEL_DISTANCE;

                transform(label, translateX, translateY, 0);

            }

            return path;
        },
        'bpmn:DataObject': function (parentGfx, element) {
            const pathData = pathMap.getScaledPath('DATA_OBJECT_PATH', {
                xScaleFactor: 1,
                yScaleFactor: 1,
                containerWidth: element.width,
                containerHeight: element.height,
                position: {
                    mx: 0.474,
                    my: 0.296
                }
            });

            const elementObject = drawPath(parentGfx, pathData, {
                fill: getFillColor(element, defaultFillColor),
                fillOpacity: DEFAULT_FILL_OPACITY,
                stroke: getStrokeColor(element, defaultStrokeColor)
            });

            const semantic = getSemantic(element);

            if (isCollection(semantic)) {
                renderDataItemCollection(parentGfx, element);
            }

            return elementObject;
        },
        'bpmn:DataObjectReference': as('bpmn:DataObject'),
        'bpmn:DataInput': function (parentGfx, element) {

            const arrowPathData = pathMap.getRawPath('DATA_ARROW');

            // page
            const elementObject = renderer('bpmn:DataObject')(parentGfx, element);

            /* input arrow path */
            drawPath(parentGfx, arrowPathData, {strokeWidth: 1});

            return elementObject;
        },
        'bpmn:DataOutput': function (parentGfx, element) {
            const arrowPathData = pathMap.getRawPath('DATA_ARROW');

            // page
            const elementObject = renderer('bpmn:DataObject')(parentGfx, element);

            /* output arrow path */
            drawPath(parentGfx, arrowPathData, {
                strokeWidth: 1,
                fill: 'black'
            });

            return elementObject;
        },
        'bpmn:DataStoreReference': function (parentGfx, element) {
            const DATA_STORE_PATH = pathMap.getScaledPath('DATA_STORE', {
                xScaleFactor: 1,
                yScaleFactor: 1,
                containerWidth: element.width,
                containerHeight: element.height,
                position: {
                    mx: 0,
                    my: 0.133
                }
            });

            return drawPath(parentGfx, DATA_STORE_PATH, {
                strokeWidth: 2,
                fill: getFillColor(element, defaultFillColor),
                fillOpacity: DEFAULT_FILL_OPACITY,
                stroke: getStrokeColor(element, defaultStrokeColor)
            });
        },
        'bpmn:BoundaryEvent': function (parentGfx, element) {

            const semantic = getSemantic(element),
                cancel = semantic.cancelActivity;

            const attrs = {
                strokeWidth: 1,
                fill: getFillColor(element, defaultFillColor),
                stroke: getStrokeColor(element, defaultStrokeColor)
            };

            if (!cancel) {
                attrs.strokeDasharray = '6';
                attrs.strokeLinecap = 'round';
            }

            // apply fillOpacity
            const outerAttrs = assign({}, attrs, {
                fillOpacity: 1
            });

            // apply no-fill
            const innerAttrs = assign({}, attrs, {
                fill: 'none'
            });

            const outer = renderer('bpmn:Event')(parentGfx, element, outerAttrs);

            /* inner path */
            drawCircle(parentGfx, element.width, element.height, INNER_OUTER_DIST, innerAttrs);

            renderEventContent(element, parentGfx);

            return outer;
        },
        'bpmn:Group': function (parentGfx, element) {

            return drawRect(parentGfx, element.width, element.height, TASK_BORDER_RADIUS, {
                stroke: getStrokeColor(element, defaultStrokeColor),
                strokeWidth: 1,
                strokeDasharray: '8,3,1,3',
                fill: 'none',
                pointerEvents: 'none'
            });
        },
        'label': function (parentGfx, element) {
            return renderExternalLabel(parentGfx, element);
        },
        'bpmn:TextAnnotation': function (parentGfx, element) {
            const style = {
                'fill': 'none',
                'stroke': 'none'
            };

            const textElement = drawRect(parentGfx, element.width, element.height, 0, 0, style);

            const textPathData = pathMap.getScaledPath('TEXT_ANNOTATION', {
                xScaleFactor: 1,
                yScaleFactor: 1,
                containerWidth: element.width,
                containerHeight: element.height,
                position: {
                    mx: 0.0,
                    my: 0.0
                }
            });

            drawPath(parentGfx, textPathData, {
                stroke: getStrokeColor(element, defaultStrokeColor)
            });

            const label = appendBibliographyRefs(getLabel(element), element);
            renderLabel(parentGfx, label, {
                box: element,
                align: 'left-top',
                padding: 5,
                style: {
                    fill: getLabelColor(element, defaultLabelColor, defaultStrokeColor)
                }
            });

            return textElement;
        },
        'ParticipantMultiplicityMarker': function (parentGfx, element) {
            const markerPath = pathMap.getScaledPath('MARKER_PARALLEL', {
                xScaleFactor: 1,
                yScaleFactor: 1,
                containerWidth: element.width,
                containerHeight: element.height,
                position: {
                    mx: ((element.width / 2) / element.width),
                    my: (element.height - 15) / element.height
                }
            });

            drawMarker('participant-multiplicity', parentGfx, markerPath, {
                strokeWidth: 2,
                fill: getFillColor(element, defaultFillColor),
                stroke: getStrokeColor(element, defaultStrokeColor)
            });
        },
        'SubProcessMarker': function (parentGfx, element) {
            const markerRect = drawRect(parentGfx, 14, 14, 0, {
                strokeWidth: 1,
                fill: getFillColor(element, defaultFillColor),
                stroke: getStrokeColor(element, defaultStrokeColor)
            });

            // Process marker is placed in the middle of the box
            // therefore fixed values can be used here
            translate(markerRect, element.width / 2 - 7.5, element.height - 20);

            const markerPath = pathMap.getScaledPath('MARKER_SUB_PROCESS', {
                xScaleFactor: 1.5,
                yScaleFactor: 1.5,
                containerWidth: element.width,
                containerHeight: element.height,
                position: {
                    mx: (element.width / 2 - 7.5) / element.width,
                    my: (element.height - 20) / element.height
                }
            });

            drawMarker('sub-process', parentGfx, markerPath, {
                fill: getFillColor(element, defaultFillColor),
                stroke: getStrokeColor(element, defaultStrokeColor)
            });
        },
        'ParallelMarker': function (parentGfx, element, position) {
            const markerPath = pathMap.getScaledPath('MARKER_PARALLEL', {
                xScaleFactor: 1,
                yScaleFactor: 1,
                containerWidth: element.width,
                containerHeight: element.height,
                position: {
                    mx: ((element.width / 2 + position.parallel) / element.width),
                    my: (element.height - 20) / element.height
                }
            });

            drawMarker('parallel', parentGfx, markerPath, {
                fill: getFillColor(element, defaultFillColor),
                stroke: getStrokeColor(element, defaultStrokeColor)
            });
        },
        'SequentialMarker': function (parentGfx, element, position) {
            const markerPath = pathMap.getScaledPath('MARKER_SEQUENTIAL', {
                xScaleFactor: 1,
                yScaleFactor: 1,
                containerWidth: element.width,
                containerHeight: element.height,
                position: {
                    mx: ((element.width / 2 + position.seq) / element.width),
                    my: (element.height - 19) / element.height
                }
            });

            drawMarker('sequential', parentGfx, markerPath, {
                fill: getFillColor(element, defaultFillColor),
                stroke: getStrokeColor(element, defaultStrokeColor)
            });
        },
        'CompensationMarker': function (parentGfx, element, position) {
            const markerMath = pathMap.getScaledPath('MARKER_COMPENSATION', {
                xScaleFactor: 1,
                yScaleFactor: 1,
                containerWidth: element.width,
                containerHeight: element.height,
                position: {
                    mx: ((element.width / 2 + position.compensation) / element.width),
                    my: (element.height - 13) / element.height
                }
            });

            drawMarker('compensation', parentGfx, markerMath, {
                strokeWidth: 1,
                fill: getFillColor(element, defaultFillColor),
                stroke: getStrokeColor(element, defaultStrokeColor)
            });
        },
        'LoopMarker': function (parentGfx, element, position) {
            const markerPath = pathMap.getScaledPath('MARKER_LOOP', {
                xScaleFactor: 1,
                yScaleFactor: 1,
                containerWidth: element.width,
                containerHeight: element.height,
                position: {
                    mx: ((element.width / 2 + position.loop) / element.width),
                    my: (element.height - 7) / element.height
                }
            });

            drawMarker('loop', parentGfx, markerPath, {
                strokeWidth: 1,
                fill: getFillColor(element, defaultFillColor),
                stroke: getStrokeColor(element, defaultStrokeColor),
                strokeLinecap: 'round',
                strokeMiterlimit: 0.5
            });
        },
        'AdhocMarker': function (parentGfx, element, position) {
            const markerPath = pathMap.getScaledPath('MARKER_ADHOC', {
                xScaleFactor: 1,
                yScaleFactor: 1,
                containerWidth: element.width,
                containerHeight: element.height,
                position: {
                    mx: ((element.width / 2 + position.adhoc) / element.width),
                    my: (element.height - 15) / element.height
                }
            });

            drawMarker('adhoc', parentGfx, markerPath, {
                strokeWidth: 1,
                fill: getStrokeColor(element, defaultStrokeColor),
                stroke: getStrokeColor(element, defaultStrokeColor)
            });
        }
    });

    function attachTaskMarkers(parentGfx, element, taskMarkers) {
        const obj = getSemantic(element);

        const subprocess = taskMarkers && taskMarkers.indexOf('SubProcessMarker') !== -1;
        let position;

        if (subprocess) {
            position = {
                seq: -21,
                parallel: -22,
                compensation: -42,
                loop: -18,
                adhoc: 10
            };
        } else {
            position = {
                seq: -3,
                parallel: -6,
                compensation: -27,
                loop: 0,
                adhoc: 10
            };
        }

        forEach(taskMarkers, function (marker) {
            renderer(marker)(parentGfx, element, position);
        });

        if (obj.isForCompensation) {
            renderer('CompensationMarker')(parentGfx, element, position);
        }

        if (obj.$type === 'bpmn:AdHocSubProcess') {
            renderer('AdhocMarker')(parentGfx, element, position);
        }

        const loopCharacteristics = obj.loopCharacteristics,
            isSequential = loopCharacteristics && loopCharacteristics.isSequential;

        if (loopCharacteristics) {

            if (isSequential === undefined) {
                renderer('LoopMarker')(parentGfx, element, position);
            }

            if (isSequential === false) {
                renderer('ParallelMarker')(parentGfx, element, position);
            }

            if (isSequential === true) {
                renderer('SequentialMarker')(parentGfx, element, position);
            }
        }
    }

    function renderDataItemCollection(parentGfx, element) {

        const yPosition = (element.height - 18) / element.height;

        const pathData = pathMap.getScaledPath('DATA_OBJECT_COLLECTION_PATH', {
            xScaleFactor: 1,
            yScaleFactor: 1,
            containerWidth: element.width,
            containerHeight: element.height,
            position: {
                mx: 0.33,
                my: yPosition
            }
        });

        /* collection path */
        drawPath(parentGfx, pathData, {
            strokeWidth: 2
        });
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

    function getQIFillColor(elem) {
        return getSemantic(elem).get('fillColor') || defaultFillColor;
    }

    function appendBibliographyRefs(label, element) {
        const references = getReferences(getBusinessObject(element));
        if (references && references.length > 0) {
            return `${label} [${references.map(r => r.bibItemRef.refLabel).sort().join(',')}]`;
        } else {
            return label;
        }
    }

    // extension API, use at your own risk
    this._drawPath = drawPath;

}

inherits(BPMN4CPRenderer, BaseRenderer);

BPMN4CPRenderer.$inject = [
    'config.bpmnRenderer',
    'eventBus',
    'styles',
    'pathMap',
    'canvas',
    'textRenderer'
];


BPMN4CPRenderer.prototype.canRender = function (element) {
    return is(element, 'bpmn:BaseElement');
};

BPMN4CPRenderer.prototype.drawShape = function (parentGfx, element) {
    const type = element.type;
    const h = this.handlers[type];

    /* jshint -W040 */
    return h(parentGfx, element);
};

BPMN4CPRenderer.prototype.drawConnection = function (parentGfx, element) {
    const type = element.type;
    const h = this.handlers[type];

    /* jshint -W040 */
    return h(parentGfx, element);
};

BPMN4CPRenderer.prototype.getShapePath = function (element) {

    if (is(element, 'bpmn:Event')) {
        return getCirclePath(element);
    }

    if (is(element, 'bpmn:Activity')) {
        return getRoundRectPath(element, TASK_BORDER_RADIUS);
    }

    if (is(element, 'bpmn:Gateway')) {
        return getDiamondPath(element);
    }

    return getRectPath(element);
};
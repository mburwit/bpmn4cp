import colorPicker from './colorPicker/ColorPickerFactory';
import {getFillColor, getStrokeColor} from "bpmn-js/lib/draw/BpmnRenderUtil";

export default function(group, element, modeling, translate) {

  group.entries.push(colorPicker(modeling, translate, {
    id: 'fill-' + element.id,
    label: translate('Fill'),
    fillOrStroke: 'fill',
    value: getFillColor(element, "#ffffff")
  }));

  group.entries.push(colorPicker(modeling, translate, {
    id: 'stroke-' + element.id,
    label: translate('Stroke'),
    fillOrStroke: 'stroke',
    value: getStrokeColor(element, "#000000")
  }));
}

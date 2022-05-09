import colorPicker from "./colorTab/ColorPicker";

function createColorTabGroups(
    element, bpmnFactory, canvas, elementRegistry, modeling, translate) {
    const colorGroup = {
        id: 'colorGroup',
        label: 'Colors',
        entries: [],
    };
    colorPicker(colorGroup, element, modeling, translate);
    return [
        colorGroup
    ];
}

export const colorTab = (
    element, bpmnFactory, canvas, elementRegistry, modeling, translate) => {
    return {
        id: 'color',
        label: 'Colors',
        groups: createColorTabGroups(element, bpmnFactory, canvas,
            elementRegistry, modeling, translate),
    };
}
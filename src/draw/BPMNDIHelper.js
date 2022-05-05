'use strict';

const BpmnDIHelper = {};
module.exports = BpmnDIHelper;

BpmnDIHelper.intersects = function(element1, element2) {
    const di1 = element1.di ? element1.di : (element1.businessObject ? element1.businessObject.di : undefined);
    const di2 = element2.di ? element2.di : (element2.businessObject ? element2.businessObject.di : undefined);
    let result = false;
    if (di1 && di2) {
        const x1 = Math.max(di1.bounds.x, di2.bounds.x);
        const x2 = Math.min(di1.bounds.x + di1.bounds.width, di2.bounds.x + di2.bounds.width);
        const y1 = Math.max(di1.bounds.y, di2.bounds.y);
        const y2 = Math.min(di1.bounds.y + di1.bounds.height, di2.bounds.y + di2.bounds.height);
        result = x1 < x2 && y1 < y2;
    }
    return result;
}

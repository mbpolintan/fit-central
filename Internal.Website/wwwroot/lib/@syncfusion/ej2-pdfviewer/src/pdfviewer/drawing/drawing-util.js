// tslint:disable-next-line:max-line-length
import { Point, rotateMatrix, identityMatrix, transformPointByMatrix } from '@syncfusion/ej2-drawings';
import { getValue } from '@syncfusion/ej2-base';
/**
 * @hidden
 */
export function isLineShapes(obj) {
    if (obj.shapeAnnotationType === 'Line' || obj.shapeAnnotationType === 'LineWidthArrowHead'
        || obj.shapeAnnotationType === 'Distance' || obj.shapeAnnotationType === 'Polygon') {
        return true;
    }
    return false;
}
/**
 * @hidden
 */
export function setElementStype(obj, element) {
    if (obj && element) {
        var fillColor = (obj.fillColor === '#ffffff00' ? 'transparent' : obj.fillColor);
        element.style.fill = fillColor;
        element.style.strokeColor = obj.strokeColor;
        element.style.color = obj.strokeColor;
        element.style.strokeWidth = obj.thickness;
        element.style.strokeDashArray = obj.borderDashArray;
        element.style.opacity = obj.opacity;
    }
}
/**
 * @hidden
 */
export function findPointsLength(points) {
    var length = 0;
    for (var i = 0; i < points.length - 1; i++) {
        length += Point.findLength(points[i], points[i + 1]);
    }
    return length;
}
/**
 * @hidden
 */
export function findPerimeterLength(points) {
    var length = Point.getLengthFromListOfPoints(points);
    return length;
}
/**   @private  */
export function getBaseShapeAttributes(element, transform) {
    var baseShapeAttributes = {
        width: element.actualSize.width, height: element.actualSize.height,
        x: element.offsetX - element.actualSize.width * element.pivot.x + 0.5,
        y: element.offsetY - element.actualSize.height * element.pivot.y + 0.5,
        angle: element.rotateAngle + element.parentTransform, fill: element.style.fill, stroke: element.style.strokeColor,
        pivotX: element.pivot.x, pivotY: element.pivot.y, strokeWidth: 1,
        opacity: element.style.opacity, dashArray: element.style.strokeDashArray || '',
        visible: element.visible, id: element.id,
    };
    if (transform) {
        baseShapeAttributes.x += transform.tx;
        baseShapeAttributes.y += transform.ty;
    }
    return baseShapeAttributes;
}
/**
 * Get function
 * @private
 */
export function getFunction(value) {
    if (value !== undefined) {
        if (typeof value === 'string') {
            value = getValue(value, window);
        }
    }
    return value;
}
/** @private */
// tslint:disable-next-line
export function cloneObject(obj, additionalProp, key) {
    // tslint:disable-next-line
    var newObject = {};
    var keys = 'properties';
    var prop = 'propName';
    if (obj) {
        key = obj[prop];
        var sourceObject = obj[keys] || obj;
        var properties = [];
        properties = properties.concat(Object.keys(sourceObject));
        var customProperties = [];
        properties.push('version');
        if (key) {
            var propAdditional = getFunction(additionalProp);
            if (propAdditional) {
                customProperties = propAdditional(key);
            }
            else {
                customProperties = [];
            }
            properties = properties.concat(customProperties);
        }
        var internalProp = getInternalProperties(key);
        properties = properties.concat(internalProp);
        for (var _i = 0, properties_1 = properties; _i < properties_1.length; _i++) {
            var property = properties_1[_i];
            if (property !== 'historyManager') {
                if (property !== 'wrapper') {
                    var constructorId = 'constructor';
                    var name_1 = 'name';
                    var isEventEmmitter = obj[property] && obj.hasOwnProperty('observers') ? true : false;
                    if (!isEventEmmitter) {
                        if (obj[property] instanceof Array) {
                            newObject[property] = cloneArray((internalProp.indexOf(property) === -1 && obj[keys]) ? obj[keys][property] : obj[property], additionalProp, property);
                        }
                        else if (obj[property] instanceof Array === false && obj[property] instanceof HTMLElement) {
                            newObject[property] = obj[property].cloneNode(true).innerHtml;
                        }
                        else if (obj[property] instanceof Array === false && obj[property] instanceof Object) {
                            newObject[property] = cloneObject((internalProp.indexOf(property) === -1 && obj[keys]) ? obj[keys][property] : obj[property]);
                        }
                        else {
                            newObject[property] = obj[property];
                        }
                    }
                }
                else {
                    if (obj[property]) {
                        newObject[property] = {
                            actualSize: {
                                width: obj[property].actualSize.width, height: obj[property].actualSize.height
                            }, offsetX: obj[property].offsetX, offsetY: obj[property].offsetY
                        };
                    }
                }
            }
        }
    }
    return newObject;
}
/** @private */
export function cloneArray(sourceArray, additionalProp, key) {
    var clonedArray;
    if (sourceArray) {
        clonedArray = [];
        for (var i = 0; i < sourceArray.length; i++) {
            if (sourceArray[i] instanceof Array) {
                clonedArray.push(sourceArray[i]);
            }
            else if (sourceArray[i] instanceof Object) {
                clonedArray.push(cloneObject(sourceArray[i], additionalProp, key));
            }
            else {
                clonedArray.push(sourceArray[i]);
            }
        }
    }
    return clonedArray;
}
/** @private */
export function getInternalProperties(propName) {
    switch (propName) {
        case 'nodes':
        case 'children':
            return ['inEdges', 'outEdges', 'parentId', 'processId', 'nodeId', 'umlIndex', 'isPhase', 'isLane'];
        case 'connectors':
            return ['parentId'];
        case 'annotation':
            return ['nodeId'];
        case 'annotations':
            return ['nodeId'];
        case 'shape':
            return ['hasHeader'];
    }
    return [];
}
/**
 * @hidden
 */
export function isLeader(obj, position) {
    var rotatedPoint;
    if (obj.shapeAnnotationType === 'Distance') {
        var leaderCount = 0;
        var newPoint1 = void 0;
        for (var i = 0; i < obj.wrapper.children.length; i++) {
            var angle = Point.findAngle(obj.sourcePoint, obj.targetPoint);
            // tslint:disable-next-line
            var segment = obj.wrapper.children[i];
            if (segment.id.indexOf('leader') > -1) {
                var center = obj.wrapper.children[0].bounds.center;
                if (leaderCount === 0) {
                    newPoint1 = { x: obj.sourcePoint.x, y: obj.sourcePoint.y - obj.leaderHeight };
                    center = obj.sourcePoint;
                }
                else {
                    newPoint1 = { x: obj.targetPoint.x, y: obj.targetPoint.y - obj.leaderHeight };
                    center = obj.targetPoint;
                }
                var matrix = identityMatrix();
                rotateMatrix(matrix, angle, center.x, center.y);
                rotatedPoint = transformPointByMatrix(matrix, { x: newPoint1.x, y: newPoint1.y });
                if (position === 'Leader' + leaderCount) {
                    return { leader: 'leader' + leaderCount, point: rotatedPoint };
                }
                leaderCount++;
            }
        }
    }
    return { leader: '', point: rotatedPoint };
}

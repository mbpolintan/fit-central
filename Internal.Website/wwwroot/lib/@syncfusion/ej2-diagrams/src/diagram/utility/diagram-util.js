import { Size } from './../primitives/size';
import { Rect } from './../primitives/rect';
import { identityMatrix, rotateMatrix, transformPointByMatrix, scaleMatrix } from './../primitives/matrix';
import { DiagramElement } from './../core/elements/diagram-element';
import { Container } from './../core/containers/container';
import { StrokeStyle, Stop } from './../core/appearance';
import { Point } from './../primitives/point';
import { ConnectorConstraints, NodeConstraints, PortConstraints, DiagramConstraints, DiagramTools, Transform } from './../enum/enum';
import { SelectorConstraints, ThumbsConstraints } from './../enum/enum';
import { PathElement } from './../core/elements/path-element';
import { DiagramNativeElement } from './../core/elements/native-element';
import { TextElement } from '../core/elements/text-element';
import { ImageElement } from '../core/elements/image-element';
import { PathAnnotation, ShapeAnnotation } from './../objects/annotation';
import { Node, FlowShape, BasicShape, Native, Html, UmlActivityShape, BpmnGateway, BpmnDataObject, BpmnEvent, BpmnSubEvent, BpmnActivity, BpmnAnnotation, MethodArguments, UmlClassAttribute, UmlClassMethod, UmlClass, UmlInterface, UmlEnumerationMember, UmlEnumeration, Lane, Phase, ChildContainer, SwimLane, Path, Image, Text, BpmnShape, UmlClassifierShape, Header } from './../objects/node';
import { Connector, bezierPoints, BezierSegment, StraightSegment, OrthogonalSegment } from './../objects/connector';
import { getBasicShape } from './../objects/dictionary/basic-shapes';
import { getFlowShape } from './../objects/dictionary/flow-shapes';
import { Diagram } from './../diagram';
import { findAngle } from './connector';
import { getContent, removeElement, hasClass, getDiagramElement } from './dom-util';
import { getBounds, cloneObject, rotatePoint, getFunction } from './base-util';
import { getPolygonPath } from './../utility/path-util';
import { DiagramHtmlElement } from '../core/elements/html-element';
import { getRulerSize } from '../ruler/ruler';
import { canResize } from './constraints-util';
import { UserHandle } from '../interaction/selector';
import { getUMLActivityShape } from '../objects/dictionary/umlactivity-shapes';
import { Canvas } from '../core/containers/canvas';
import { PointPort } from '../objects/port';
import { Command } from '../diagram/keyboard-commands';
import { pasteSwimLane } from './swim-lane-util';
import { isBlazor, Browser } from '@syncfusion/ej2-base';
/** @private */
export function completeRegion(region, selectedObjects) {
    var collection = [];
    for (var i = 0; i < selectedObjects.length; i++) {
        var obj = selectedObjects[i];
        if (region.containsRect(obj.wrapper.bounds)) {
            collection.push(obj);
        }
    }
    return collection;
}
/** @private */
export function findNodeByName(nodes, name) {
    for (var i = 0; i < nodes.length; i++) {
        if (nodes[i].id === name) {
            return true;
        }
    }
    return false;
}
/**
 * @private
 */
export function findObjectType(drawingObject) {
    var type;
    if (drawingObject) {
        if (drawingObject.type) {
            type = 'Connector';
        }
        else if (drawingObject.shape && !drawingObject.type) {
            type = 'Node';
        }
    }
    return type;
}
/**
 * @private
 */
export function setSwimLaneDefaults(child, node) {
    if (node instanceof Node) {
        if (!child.shape.header) {
            node.shape.hasHeader = false;
        }
    }
}
/**
 * @private
 */
export function getSpaceValue(intervals, isLine, i, space) {
    space = !isLine ? ((intervals[i - 1] !== undefined) ? intervals[i - 1] + space : 0) : space;
    return space;
}
/**
 * @private
 */
export function getInterval(intervals, isLine) {
    var newInterval = [];
    if (!isLine) {
        for (var k = 0; k < intervals.length; k++) {
            newInterval.push(intervals[k]);
        }
        newInterval.push(intervals[newInterval.length - 2]);
        newInterval.push(intervals[newInterval.length - 2]);
    }
    else {
        newInterval = intervals;
    }
    return newInterval;
}
/**
 * @private
 */
export function setUMLActivityDefaults(child, node) {
    if (node instanceof Node) {
        var shape = (isBlazor() ? child.shape.umlActivityShape :
            child.shape.shape);
        switch (shape) {
            case 'JoinNode':
                if (!child.width) {
                    node.width = 20;
                }
                if (!child.height) {
                    node.height = 90;
                }
                if (!child.style || !child.style.fill) {
                    node.style.fill = 'black';
                }
                break;
            case 'ForkNode':
                if (!child.width) {
                    node.width = 90;
                }
                if (!child.height) {
                    node.height = 20;
                }
                if (!child.style || !child.style.fill) {
                    node.style.fill = 'black';
                }
                break;
            case 'InitialNode':
                if (!child.style || !child.style.fill) {
                    node.style.fill = 'black';
                }
                break;
            case 'FinalNode':
                if (!child.style || !child.style.fill) {
                    node.style.fill = 'black';
                }
                break;
        }
    }
    else {
        var flow = (isBlazor() ?
            child.shape.umlActivityFlow : child.shape.flow);
        switch (flow) {
            case 'Object':
                if (!child.style || !child.style.strokeDashArray) {
                    node.style.strokeDashArray = '8 4';
                }
                if (!child.style || !child.style.strokeWidth) {
                    node.style.strokeWidth = 2;
                }
                if (!child.targetDecorator || !child.targetDecorator.shape) {
                    node.targetDecorator.shape = 'OpenArrow';
                }
                break;
            case 'Control':
                if (!child.style || !child.style.strokeWidth) {
                    node.style.strokeWidth = 2;
                }
                if (!child.targetDecorator || !child.targetDecorator.shape) {
                    node.targetDecorator.shape = 'OpenArrow';
                }
                if (!child.sourceDecorator || !child.sourceDecorator.shape) {
                    node.sourceDecorator.shape = 'None';
                }
                break;
        }
    }
}
/* tslint:disable */
/**
 * @private
 */
export function setConnectorDefaults(child, node) {
    switch ((child.shape).type) {
        case 'Bpmn':
            var bpmnFlow = (isBlazor() ? child.shape.bpmnFlow : child.shape.flow);
            switch (bpmnFlow) {
                case 'Sequence':
                    if ((((child.shape.sequence) === 'Normal' && child.type !== 'Bezier')) ||
                        ((child.shape.sequence) === 'Default') || ((child.shape.sequence) === 'Conditional')) {
                        if (node.targetDecorator && node.targetDecorator.style) {
                            node.targetDecorator.style.fill = (child.targetDecorator && child.targetDecorator.style
                                && child.targetDecorator.style.fill) || 'black';
                        }
                        if ((child.shape.sequence) === 'Conditional' && node.sourceDecorator) {
                            if (node.sourceDecorator.style) {
                                node.sourceDecorator.style.fill = (child.sourceDecorator && child.sourceDecorator.style &&
                                    child.sourceDecorator.style.fill) || 'white';
                            }
                            node.sourceDecorator.width = (child.sourceDecorator && child.sourceDecorator.width) || 20;
                            node.sourceDecorator.height = (child.sourceDecorator && child.sourceDecorator.width) || 10;
                        }
                    }
                    break;
                case 'Association':
                    if (((child.shape.association) === 'Default') ||
                        ((child.shape.association) === 'Directional') ||
                        ((child.shape.association) === 'BiDirectional')) {
                        if (node.targetDecorator && node.targetDecorator.style) {
                            node.targetDecorator.style.fill = (child.targetDecorator && child.targetDecorator.style &&
                                child.targetDecorator.style.fill) || 'black';
                        }
                        if ((child.shape.association) === 'BiDirectional') {
                            if (node.sourceDecorator && node.sourceDecorator.style) {
                                node.sourceDecorator.style.fill = (child.sourceDecorator && child.sourceDecorator.style &&
                                    child.sourceDecorator.style.fill) || 'white';
                                node.sourceDecorator.width = (child.sourceDecorator && child.sourceDecorator.width) || 5;
                                node.sourceDecorator.height = (child.sourceDecorator && child.sourceDecorator.height) || 10;
                            }
                        }
                    }
                    break;
                case 'Message':
                    if (node.style && !node.style.strokeDashArray) {
                        node.style.strokeDashArray = (child.style && child.style.strokeDashArray) || '4 4';
                    }
                    break;
            }
            break;
        case 'UmlActivity':
            var flow = (isBlazor() ?
                child.shape.umlActivityFlow : child.shape.flow);
            switch (flow) {
                case 'Exception':
                    if (((child.shape.association) === 'Directional') ||
                        ((child.shape.association) === 'BiDirectional')) {
                        node.style.strokeDashArray = (child.style && child.style.strokeDashArray) || '2 2';
                    }
                    break;
            }
            break;
        case 'UmlClassifier':
            var hasRelation = false;
            if (child.shape.relationship === 'Association') {
                hasRelation = true;
            }
            else if (child.shape.relationship === 'Inheritance') {
                if (node.targetDecorator && node.targetDecorator.style) {
                    node.targetDecorator.style.fill = (child.targetDecorator && child.targetDecorator.style &&
                        child.targetDecorator.style.fill) || 'white';
                }
                if (node.style) {
                    hasRelation = true;
                    node.style.strokeDashArray = (child.style && child.style.strokeDashArray) || '4 4';
                }
            }
            else if (child.shape.relationship === 'Composition') {
                if (node.sourceDecorator && node.sourceDecorator.style) {
                    node.sourceDecorator.style.fill = (child.sourceDecorator && child.sourceDecorator.style &&
                        child.sourceDecorator.style.fill) || 'black';
                }
                hasRelation = true;
            }
            else if (child.shape.relationship === 'Aggregation' ||
                child.shape.relationship === undefined) {
                if (node.sourceDecorator && node.sourceDecorator.style) {
                    node.sourceDecorator.style.fill = (child.sourceDecorator && child.sourceDecorator.style &&
                        child.sourceDecorator.style.fill) || 'white';
                }
                hasRelation = true;
            }
            else if (child.shape.relationship === 'Dependency') {
                if (node.sourceDecorator && node.sourceDecorator.style) {
                    node.sourceDecorator.style.fill = (child.sourceDecorator && child.sourceDecorator.style &&
                        child.sourceDecorator.style.fill) || 'white';
                }
                hasRelation = true;
                node.style.strokeDashArray = '4 4';
            }
            else if (child.shape.relationship === 'Realization') {
                if (node.sourceDecorator && node.sourceDecorator.style) {
                    node.sourceDecorator.style.fill = (child.sourceDecorator && child.sourceDecorator.style &&
                        child.sourceDecorator.style.fill) || 'white';
                }
                hasRelation = true;
            }
            if (hasRelation) {
                node.style.strokeWidth = (child.style && child.style.strokeWidth) || 2;
            }
            break;
    }
}
/* tslint:enable */
/** @private */
export function findNearestPoint(reference, start, end) {
    var shortestPoint;
    var shortest = Point.findLength(start, reference);
    var shortest1 = Point.findLength(end, reference);
    if (shortest > shortest1) {
        shortestPoint = end;
    }
    else {
        shortestPoint = start;
    }
    var angleBWStAndEnd = Point.findAngle(start, end);
    var angleBWStAndRef = Point.findAngle(shortestPoint, reference);
    var r = Point.findLength(shortestPoint, reference);
    var vaAngle = angleBWStAndRef + ((angleBWStAndEnd - angleBWStAndRef) * 2);
    return {
        x: (shortestPoint.x + r * Math.cos(vaAngle * Math.PI / 180)),
        y: (shortestPoint.y + r * Math.sin(vaAngle * Math.PI / 180))
    };
}
function pointsForBezier(connector) {
    var points = [];
    if (connector.type === 'Bezier') {
        var k = 0;
        for (var i = 0; i < connector.segments.length; i++) {
            var tolerance = 1.5;
            var segment = connector.segments[i];
            var pt = { x: 0, y: 0 };
            var point1 = !Point.isEmptyPoint(segment.point1) ? segment.point1 : segment.bezierPoint1;
            var point2 = !Point.isEmptyPoint(segment.point2) ? segment.point2 : segment.bezierPoint2;
            var max = Number((connector.distance(point1, segment.points[0]) +
                connector.distance(point2, point1) +
                connector.distance(segment.points[1], point2)) / tolerance);
            for (var j = 0; j < max - 1; j = j + 10) {
                points[k] =
                    bezierPoints(connector, segment.points[0], !Point.isEmptyPoint(segment.point1) ? segment.point1 : segment.bezierPoint1, !Point.isEmptyPoint(segment.point2) ? segment.point2 : segment.bezierPoint2, segment.points[1], j, max);
                k++;
            }
        }
    }
    return points;
}
/** @private */
export function isDiagramChild(htmlLayer) {
    var element = htmlLayer.parentElement;
    do {
        if (hasClass(element, 'e-diagram')) {
            return true;
        }
        element = element.parentElement;
    } while (element);
    return false;
}
/** @private */
export function groupHasType(node, type, nameTable) {
    var contains = false;
    if (node && node.children && node.children.length > 0) {
        var child = void 0;
        var i = 0;
        for (; i < node.children.length; i++) {
            child = nameTable[node.children[i]];
            if (child.shape.type === type) {
                return true;
            }
            return groupHasType(child, type, nameTable);
        }
    }
    return contains;
}
/** @private */
export function updateDefaultValues(actualNode, plainValue, defaultValue, property, oldKey) {
    if (defaultValue && ((actualNode instanceof Connector) || actualNode
        && ((actualNode.shape && actualNode.shape.type !== 'SwimLane') || actualNode.shape === undefined))) {
        var keyObj = void 0;
        for (var _i = 0, _a = Object.keys(defaultValue); _i < _a.length; _i++) {
            var key = _a[_i];
            keyObj = defaultValue[key];
            if (key === 'shape' && keyObj.type) {
                actualNode.shape = { type: keyObj.type };
            }
            if (keyObj) {
                if (Array.isArray(keyObj) && keyObj.length && keyObj.length > 0 && (oldKey !== 'annotations' && oldKey !== 'ports')) {
                    if (actualNode[key].length > 0) {
                        for (var i = 0; i <= actualNode[key].length; i++) {
                            updateDefaultValues(actualNode[key], plainValue ? plainValue[key] : undefined, defaultValue[key], (key === 'annotations' || key === 'ports') ? actualNode : undefined, key);
                        }
                    }
                    else {
                        updateDefaultValues(actualNode[key], plainValue ? plainValue[key] : undefined, defaultValue[key], (key === 'annotations' || key === 'ports') ? actualNode : undefined, key);
                    }
                }
                else if (keyObj instanceof Object && plainValue && (oldKey !== 'annotations' && oldKey !== 'ports')) {
                    updateDefaultValues(actualNode[key], plainValue[key], defaultValue[key]);
                }
                else if ((oldKey !== 'annotations' && oldKey !== 'ports')
                    && (plainValue && !plainValue[key]) || (!plainValue && actualNode
                    && (actualNode[key] || actualNode[key] !== undefined))) {
                    actualNode[key] = defaultValue[key];
                }
                else {
                    var createObject = void 0;
                    if (oldKey === 'annotations' || oldKey === 'ports') {
                        if (oldKey === 'annotations') {
                            if (actualNode[key]) {
                                updateDefaultValues(actualNode[key], plainValue[key], defaultValue[key]);
                            }
                            if (!actualNode[key]) {
                                if (getObjectType(property) === Connector) {
                                    createObject = new PathAnnotation(property, 'annotations', defaultValue[key]);
                                    property.annotations.push(createObject);
                                }
                                else {
                                    createObject = new ShapeAnnotation(property, 'annotations', defaultValue[key]);
                                    property.annotations.push(createObject);
                                }
                            }
                        }
                        else {
                            if (actualNode[key]) {
                                updateDefaultValues(actualNode[key], plainValue[key], defaultValue[key]);
                            }
                            else {
                                createObject = new PointPort(property, 'ports', defaultValue[key]);
                                property.ports.push(createObject);
                            }
                        }
                    }
                }
            }
        }
    }
}
/* tslint:disable:no-string-literal */
/** @private */
export function updateLayoutValue(actualNode, defaultValue, nodes, node) {
    var keyObj;
    if (defaultValue) {
        for (var _i = 0, _a = Object.keys(defaultValue); _i < _a.length; _i++) {
            var key = _a[_i];
            keyObj = defaultValue[key];
            if (key === 'getAssistantDetails') {
                if (node.data['Role'] === defaultValue[key]['root']) {
                    var assitants = defaultValue[key]['assistants'];
                    for (var i = 0; i < assitants.length; i++) {
                        for (var j = 0; j < nodes.length; j++) {
                            if (nodes[j].data['Role'] === assitants[i]) {
                                actualNode.assistants.push(nodes[j].id);
                                actualNode.children.splice(0, 1);
                            }
                        }
                    }
                }
            }
            else if (keyObj) {
                actualNode[key] = defaultValue[key];
            }
        }
    }
    if (!actualNode.hasSubTree && defaultValue.canEnableSubTree) {
        actualNode.orientation = node.layoutInfo.orientation;
        actualNode.type = node.layoutInfo.type;
        if (node.layoutInfo.offset !== actualNode.offset && (node.layoutInfo.offset) !== undefined) {
            actualNode.offset = node.layoutInfo.offset;
        }
    }
    node.layoutInfo.hasSubTree = actualNode.hasSubTree;
}
/* tslint:enable:no-string-literal */
/** @private */
export function isPointOverConnector(connector, reference) {
    var intermediatePoints;
    intermediatePoints = connector.type === 'Bezier' ? pointsForBezier(connector) :
        connector.intermediatePoints;
    for (var i = 0; i < intermediatePoints.length - 1; i++) {
        var start = intermediatePoints[i];
        var end = intermediatePoints[i + 1];
        var rect = Rect.toBounds([start, end]);
        rect.Inflate(connector.hitPadding);
        if (rect.containsPoint(reference)) {
            var intersectinPt = findNearestPoint(reference, start, end);
            var segment1 = { x1: start.x, x2: end.x, y1: start.y, y2: end.y };
            var segment2 = { x1: reference.x, x2: intersectinPt.x, y1: reference.y, y2: intersectinPt.y };
            var intersectDetails = intersect3(segment1, segment2);
            if (intersectDetails.enabled) {
                var distance = Point.findLength(reference, intersectDetails.intersectPt);
                if (Math.abs(distance) < connector.hitPadding) {
                    return true;
                }
            }
            else {
                var rect_1 = Rect.toBounds([reference, reference]);
                rect_1.Inflate(3);
                if (rect_1.containsPoint(start) || rect_1.containsPoint(end)) {
                    return true;
                }
            }
            if (Point.equals(reference, intersectinPt)) {
                return true;
            }
        }
    }
    if (connector.annotations.length > 0) {
        var container = connector.wrapper.children;
        for (var i = 3; i < container.length; i++) {
            var textElement = container[i];
            if (textElement.bounds.containsPoint(reference)) {
                return true;
            }
        }
    }
    return false;
}
/** @private */
export function intersect3(lineUtil1, lineUtil2) {
    var point = { x: 0, y: 0 };
    var l1 = lineUtil1;
    var l2 = lineUtil2;
    var d = (l2.y2 - l2.y1) * (l1.x2 - l1.x1) - (l2.x2 - l2.x1) * (l1.y2 - l1.y1);
    var na = (l2.x2 - l2.x1) * (l1.y1 - l2.y1) - (l2.y2 - l2.y1) * (l1.x1 - l2.x1);
    var nb = (l1.x2 - l1.x1) * (l1.y1 - l2.y1) - (l1.y2 - l1.y1) * (l1.x1 - l2.x1);
    if (d === 0) {
        return { enabled: false, intersectPt: point };
    }
    var ua = na / d;
    var ub = nb / d;
    if (ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1) {
        point.x = l1.x1 + (ua * (l1.x2 - l1.x1));
        point.y = l1.y1 + (ua * (l1.y2 - l1.y1));
        return { enabled: true, intersectPt: point };
    }
    return { enabled: false, intersectPt: point };
}
/** @private */
export function intersect2(start1, end1, start2, end2) {
    var point = { x: 0, y: 0 };
    var lineUtil1 = getLineSegment(start1.x, start1.y, end1.x, end1.y);
    var lineUtil2 = getLineSegment(start2.x, start2.y, end2.x, end2.y);
    var line3 = intersect3(lineUtil1, lineUtil2);
    if (line3.enabled) {
        return line3.intersectPt;
    }
    else {
        return point;
    }
}
/** @private */
export function getLineSegment(x1, y1, x2, y2) {
    return { 'x1': Number(x1) || 0, 'y1': Number(y1) || 0, 'x2': Number(x2) || 0, 'y2': Number(y2) || 0 };
}
/** @private */
export function getPoints(element, corners, padding) {
    var line = [];
    padding = padding || 0;
    var left = { x: corners.topLeft.x - padding, y: corners.topLeft.y };
    var right = { x: corners.topRight.x + padding, y: corners.topRight.y };
    var top = { x: corners.bottomRight.x, y: corners.bottomRight.y - padding };
    var bottom = { x: corners.bottomLeft.x, y: corners.bottomLeft.y + padding };
    line.push(left);
    line.push(right);
    line.push(top);
    line.push(bottom);
    return line;
}
/**
 * @private
 * sets the offset of the tooltip.
 * @param {Diagram} diagram
 * @param {PointModel} mousePosition
 * @param {NodeModel | ConnectorModel} node
 */
export function getTooltipOffset(diagram, mousePosition, node) {
    var offset;
    var inheritTooltip = (node instanceof Node) ? (node.constraints & NodeConstraints.InheritTooltip)
        : (node.constraints & ConnectorConstraints.InheritTooltip);
    var objectTooltip = (node instanceof Node) ? (node.constraints & NodeConstraints.Tooltip)
        : (node.constraints & ConnectorConstraints.Tooltip);
    var isMouseBased = ((!inheritTooltip && objectTooltip ? node.tooltip.relativeMode
        : diagram.tooltip.relativeMode) === 'Mouse') ? true : false;
    offset = tooltipOffset(node, mousePosition, diagram, isMouseBased);
    var rulerSize = getRulerSize(diagram);
    return { x: offset.x + rulerSize.width, y: offset.y + rulerSize.height };
}
function tooltipOffset(node, mousePosition, diagram, isMouseBased) {
    var point = {};
    var scale = diagram.scroller.transform.scale;
    var element = document.getElementById(diagram.element.id);
    var bounds = node.wrapper.bounds;
    var rect = element.getBoundingClientRect();
    var horizontalOffset = diagram.scroller.horizontalOffset;
    var verticalOffset = diagram.scroller.verticalOffset;
    switch (diagram.tooltipObject.position) {
        case 'BottomCenter':
            point = offsetPoint(mousePosition, bounds.bottomCenter, diagram, isMouseBased, (rect.width / 2), rect.height);
            break;
        case 'BottomLeft':
        case 'LeftBottom':
            point = offsetPoint(mousePosition, bounds.bottomLeft, diagram, isMouseBased, 0, rect.height);
            break;
        case 'BottomRight':
        case 'RightBottom':
            point = offsetPoint(mousePosition, bounds.bottomRight, diagram, isMouseBased, rect.width, rect.height);
            break;
        case 'LeftCenter':
            point = offsetPoint(mousePosition, bounds.middleLeft, diagram, isMouseBased, 0, (rect.height / 2));
            break;
        case 'LeftTop':
        case 'TopLeft':
            point = offsetPoint(mousePosition, bounds.topLeft, diagram, isMouseBased, 0, 0);
            break;
        case 'RightCenter':
            point = offsetPoint(mousePosition, bounds.middleRight, diagram, isMouseBased, rect.width, (rect.height / 2));
            break;
        case 'RightTop':
        case 'TopRight':
            point = offsetPoint(mousePosition, bounds.topRight, diagram, isMouseBased, rect.width, 0);
            break;
        case 'TopCenter':
            point = offsetPoint(mousePosition, bounds.topCenter, diagram, isMouseBased, (rect.width / 2), 0);
            break;
    }
    return point;
}
function offsetPoint(mousePosition, bound, diagram, isMouseBased, x, y) {
    var point = {};
    var scale = diagram.scroller.transform.scale;
    var horizontalOffset = diagram.scroller.horizontalOffset;
    var verticalOffset = diagram.scroller.verticalOffset;
    point.x = (isMouseBased ? mousePosition.x : bound.x) * scale + horizontalOffset - x;
    point.y = (isMouseBased ? mousePosition.y : bound.y) * scale + verticalOffset - y;
    return point;
}
/** @private */
export function sort(objects, option) {
    var i = 0;
    var j = 0;
    var temp;
    for (i = 0; i < objects.length; i++) {
        var b = getBounds(objects[i].wrapper);
        for (j = 0; j < objects.length; j++) {
            var bounds = getBounds(objects[j].wrapper);
            if (option === 'Top' || option === 'Bottom' || option === 'BottomToTop' || option === 'Middle') {
                if (b.center.y > bounds.center.y) {
                    temp = objects[i];
                    objects[i] = objects[j];
                    objects[j] = temp;
                }
            }
            else {
                if (b.center.x > bounds.center.x) {
                    temp = objects[i];
                    objects[i] = objects[j];
                    objects[j] = temp;
                }
            }
        }
    }
    return objects;
}
/** @private */
export function getAnnotationPosition(pts, annotation, bound) {
    var angle;
    var getloop;
    var point;
    getloop = getOffsetOfConnector(pts, annotation, bound);
    angle = Point.findAngle(pts[getloop.index], pts[getloop.index + 1]);
    var alignednumber = getAlignedPosition(annotation);
    point = Point.transform(getloop.point, angle + 45, alignednumber);
    getloop.point = point;
    getloop.angle = angle;
    return getloop;
}
/** @private */
export function getOffsetOfConnector(points, annotation, bounds) {
    var length = 0;
    var offset = annotation.offset;
    var point;
    var angle;
    var offsetLength;
    var lengths = [];
    var prevLength;
    var kCount;
    for (var j = 0; j < points.length - 1; j++) {
        length += Point.distancePoints(points[j], points[j + 1]);
        lengths.push(length);
    }
    offsetLength = offset * length;
    for (var k = 0; k < lengths.length; k++) {
        if (lengths[k] >= offsetLength) {
            angle = Point.findAngle(points[k], points[k + 1]);
            point = Point.transform(points[k], angle, offsetLength - (prevLength || 0));
            kCount = k;
            return { point: point, index: kCount };
        }
        prevLength = lengths[k];
    }
    return { point: point, index: kCount };
}
/** @private */
export function getAlignedPosition(annotation) {
    var cnst = annotation.content === undefined ? 10 : 0;
    var state = 0;
    switch (annotation.alignment) {
        case 'Center':
            state = 0;
            break;
        case 'Before':
            state = -((0) / 2 + cnst);
            break;
        case 'After':
            state = ((0) / 2 + cnst);
            break;
    }
    return state;
}
/** @private */
export function alignLabelOnSegments(obj, ang, pts) {
    var angle = ang % 360;
    ang %= 360;
    var fourty5 = 45;
    var one35 = 135;
    var two25 = 225;
    var three15 = 315;
    var vAlign;
    var hAlign;
    switch (obj.alignment) {
        case 'Before':
            if (ang >= fourty5 && ang <= one35) {
                hAlign = 'right';
                vAlign = obj.offset === 0.5 ? 'center' : 'top';
            }
            else if (ang >= two25 && ang <= three15) {
                hAlign = 'left';
                vAlign = obj.offset === 0.5 ? 'center' : 'bottom';
            }
            else if (ang > fourty5 && ang < two25) {
                vAlign = 'top';
                hAlign = obj.offset === 0.5 ? 'center' : 'right';
            }
            else {
                vAlign = 'bottom';
                hAlign = (obj.offset === 0.5) ? 'center' : 'left';
            }
            break;
        case 'After':
            if (ang >= fourty5 && ang <= one35) {
                hAlign = 'left';
                vAlign = obj.offset === 0.5 ? 'center' : 'top';
            }
            else if (ang >= two25 && ang <= three15) {
                hAlign = 'right';
                vAlign = obj.offset === 0.5 ? 'center' : 'bottom';
            }
            else if (ang > fourty5 && ang < two25) {
                vAlign = 'bottom';
                hAlign = obj.offset === 0.5 ? 'center' : 'right';
            }
            else {
                vAlign = 'top';
                hAlign = obj.offset === 0.5 ? 'center' : 'left';
            }
            break;
        case 'Center':
            hAlign = 'center';
            vAlign = 'center';
            break;
    }
    if (obj.offset === 0 || obj.offset === 1) {
        var direction = void 0;
        direction = getBezierDirection(pts[0], pts[1]);
        switch (direction) {
            case 'left':
                hAlign = obj.offset === 0 ? 'right' : 'left';
                break;
            case 'right':
                hAlign = obj.offset === 0 ? 'left' : 'right';
                break;
            case 'bottom':
                vAlign = obj.offset === 0 ? 'top' : 'bottom';
                break;
            case 'top':
                vAlign = obj.offset === 0 ? 'bottom' : 'top';
                break;
        }
    }
    return { hAlign: hAlign, vAlign: vAlign };
}
/** @private */
export function getBezierDirection(src, tar) {
    if (Math.abs(tar.x - src.x) > Math.abs(tar.y - src.y)) {
        return src.x < tar.x ? 'right' : 'left';
    }
    else {
        return src.y < tar.y ? 'bottom' : 'top';
    }
}
/** @private */
export function removeChildNodes(node, diagram) {
    if (node instanceof Node && node.children) {
        for (var i = 0; i < node.children.length; i++) {
            if (diagram.nameTable[node.children[i]].children) {
                removeChildNodes(node, diagram);
            }
            diagram.removeFromAQuad(diagram.nameTable[node.children[i]]);
            diagram.removeObjectsFromLayer(diagram.nameTable[node.children[i]]);
            delete diagram.nameTable[node.children[i]];
        }
    }
}
function getChild(child, children) {
    if (child && child.children && child.children.length > 0) {
        for (var j = 0; j < child.children.length; j++) {
            var subChild = child.children[j];
            if (subChild instanceof Canvas) {
                getChild(subChild, children);
            }
        }
    }
    if (children.indexOf(child.id) === -1) {
        children.push(child.id);
    }
    return children;
}
function getSwimLaneChildren(nodes) {
    var children = [];
    var node;
    var grid;
    var childTable;
    var child;
    var gridChild = 'childTable';
    for (var i = 0; i < nodes.length; i++) {
        node = nodes[i];
        if (node.shape.type === 'SwimLane') {
            grid = node.wrapper.children[0];
            childTable = grid[gridChild];
            for (var _i = 0, _a = Object.keys(childTable); _i < _a.length; _i++) {
                var key = _a[_i];
                child = childTable[key];
                children = getChild(child, children);
            }
        }
    }
    return children;
}
function removeUnnecessaryNodes(children, diagram) {
    var nodes = diagram.nodes;
    if (nodes) {
        for (var i = 0; i < nodes.length; i++) {
            if (children.indexOf(nodes[i].id) !== -1) {
                nodes.splice(i, 1);
                i--;
            }
        }
    }
}
/** @private */
export function serialize(model) {
    var removeNodes = getSwimLaneChildren(model.nodes);
    var clonedObject = cloneObject(model, model.getCustomProperty);
    clonedObject.selectedItems.nodes = [];
    clonedObject.selectedItems.connectors = [];
    clonedObject.selectedItems.wrapper = null;
    if (model.serializationSettings.preventDefaults) {
        clonedObject = preventDefaults(clonedObject, model);
    }
    removeUnnecessaryNodes(removeNodes, clonedObject);
    return JSON.stringify(clonedObject);
}
function preventDefaults(clonedObject, model, defaultObject, isNodeShape) {
    defaultObject = getConstructor(model, defaultObject);
    var properties = [];
    properties = properties.concat(Object.keys(clonedObject));
    for (var _i = 0, properties_1 = properties; _i < properties_1.length; _i++) {
        var property = properties_1[_i];
        if (model instanceof Node) {
            isNodeShape = (property === 'shape') ? true : false;
        }
        if (clonedObject[property] instanceof Array) {
            preventArrayDefaults(clonedObject, defaultObject, model, property);
        }
        else if ((clonedObject[property] instanceof Object) && defaultObject && defaultObject[property]) {
            if (property !== 'wrapper') {
                clonedObject[property] = preventDefaults(clonedObject[property], model[property], defaultObject[property], isNodeShape);
            }
        }
        else if ((defaultObject && clonedObject[property] === defaultObject[property]) || clonedObject[property] === undefined) {
            if (!(isNodeShape && property === 'type') && !(model instanceof SwimLane && property === 'orientation')) {
                delete clonedObject[property];
            }
        }
        if (JSON.stringify(clonedObject[property]) === '[]' ||
            JSON.stringify(clonedObject[property]) === '{}' ||
            clonedObject[property] === undefined) {
            delete clonedObject[property];
        }
    }
    return clonedObject;
}
function preventArrayDefaults(clonedObject, defaultObject, model, property) {
    if (clonedObject[property].length === 0) {
        delete clonedObject[property];
        // tslint:disable-next-line:no-any
    }
    else if (clonedObject[property].every(function (element) { return typeof element === 'number'; })) {
        var i = void 0;
        var isSameArray = true;
        for (i = 0; i < clonedObject[property].length; i++) {
            if (isSameArray && clonedObject[property][i] === defaultObject[property][i]) {
                isSameArray = true;
            }
            else {
                isSameArray = false;
            }
        }
        if (isSameArray) {
            delete clonedObject[property];
        }
    }
    else {
        var i = void 0;
        if (property === 'layers') {
            clonedObject[property].splice(0, 1);
            if (clonedObject[property].length === 0) {
                delete clonedObject[property];
            }
        }
        if (clonedObject[property]) {
            for (i = clonedObject[property].length - 1; i >= 0; i--) {
                if (property === 'nodes' || property === 'connectors') {
                    clonedObject[property][i].wrapper = null;
                }
                if (property !== 'dataManager') {
                    clonedObject[property][i] = preventDefaults(clonedObject[property][i], model[property][i], (defaultObject[property] !== undefined ? defaultObject[property][i] : undefined));
                    if (JSON.stringify(clonedObject[property][i]) === '[]' ||
                        JSON.stringify(clonedObject[property][i]) === '{}' ||
                        clonedObject[property][i] === undefined) {
                        clonedObject[property].splice(i, 1);
                    }
                }
            }
        }
    }
}
/* tslint:disable */
function getConstructor(model, defaultObject) {
    var obj = [];
    var constructor;
    var parent = new Diagram();
    var getClassName = 'getClassName';
    if (model[getClassName]) {
        switch (model[getClassName]()) {
            case 'Diagram':
                constructor = new Diagram();
                break;
            case 'Node':
                constructor = new Node(parent, '', obj);
                break;
            case 'Path':
                constructor = new Path(parent, '', obj);
                break;
            case 'Native':
                constructor = new Native(parent, '', obj);
                break;
            case 'Html':
                constructor = new Html(parent, '', obj);
                break;
            case 'Image':
                constructor = new Image(parent, '', obj);
                break;
            case 'Text':
                constructor = new Text(parent, '', obj);
                break;
            case 'BasicShape':
                constructor = new BasicShape(parent, '', obj);
                break;
            case 'FlowShape':
                constructor = new FlowShape(parent, '', obj);
                break;
            case 'BpmnShape':
                constructor = new BpmnShape(parent, '', obj);
                break;
            case 'UmlActivityShape':
                constructor = new UmlActivityShape(parent, '', obj);
                break;
            case 'UmlClassifierShape':
                constructor = new UmlClassifierShape(parent, '', obj);
                break;
            case 'SwimLane':
                constructor = new SwimLane(parent, '', obj);
                if (model.header) {
                    constructor.header = new Header(parent, '', obj);
                    constructor.header.style.fill = '';
                }
                break;
            case 'ShapeAnnotation':
                constructor = new ShapeAnnotation(parent, '', obj);
                break;
            case 'PointPort':
                constructor = new PointPort(parent, '', obj);
                break;
            case 'BpmnGateway':
                constructor = new BpmnGateway(parent, '', obj);
                break;
            case 'BpmnDataObject':
                constructor = new BpmnDataObject(parent, '', obj);
                break;
            case 'BpmnEvent':
                constructor = new BpmnEvent(parent, '', obj);
                break;
            case 'BpmnSubEvent':
                constructor = new BpmnSubEvent(parent, '', obj);
                break;
            case 'BpmnActivity':
                constructor = new BpmnActivity(parent, '', obj);
                break;
            case 'BpmnAnnotation':
                constructor = new BpmnAnnotation(parent, '', obj);
                break;
            case 'MethodArguments':
                constructor = new MethodArguments(parent, '', obj);
                break;
            case 'UmlClassAttribute':
                constructor = new UmlClassAttribute(parent, '', obj);
                break;
            case 'UmlClassMethod':
                constructor = new UmlClassMethod(parent, '', obj);
                break;
            case 'UmlClass':
                constructor = new UmlClass(parent, '', obj);
                break;
            case 'UmlInterface':
                constructor = new UmlInterface(parent, '', obj);
                break;
            case 'UmlEnumerationMember':
                constructor = new UmlEnumerationMember(parent, '', obj);
                break;
            case 'UmlEnumeration':
                constructor = new UmlEnumeration(parent, '', obj);
                break;
            case 'Lane':
                constructor = new Lane(parent, '', obj);
                break;
            case 'Phase':
                constructor = new Phase(parent, '', obj);
                break;
            case 'ChildContainer':
                constructor = new ChildContainer();
                break;
            case 'Connector':
                constructor = new Connector(parent, '', obj);
                break;
            case 'StraightSegment':
                constructor = new StraightSegment(parent, '', obj);
                break;
            case 'BezierSegment':
                constructor = new BezierSegment(parent, '', obj);
                break;
            case 'OrthogonalSegment':
                constructor = new OrthogonalSegment(parent, '', obj);
                break;
            case 'PathAnnotation':
                constructor = new PathAnnotation(parent, '', obj);
                break;
            case 'Stop':
                constructor = new Stop(parent, '', obj);
                break;
            case 'Point':
                if (!defaultObject) {
                    constructor = new Point(parent, '', obj);
                }
                else {
                    constructor = defaultObject;
                }
                break;
            case 'UserHandle':
                constructor = new UserHandle(parent, '', obj);
                break;
            case 'Command':
                constructor = new Command(parent, '', obj);
                break;
        }
    }
    else {
        constructor = defaultObject;
    }
    return constructor;
}
/* tslint:enable */
/** @private */
export function deserialize(model, diagram) {
    diagram.enableServerDataBinding(false);
    diagram.clear();
    diagram.protectPropertyChange(true);
    var map = diagram.dataSourceSettings.doBinding;
    var nodeTemp = diagram.setNodeTemplate;
    var getDescription = diagram.getDescription;
    var getCustomProperty = diagram.getCustomProperty;
    var commands = {};
    for (var _i = 0, _a = diagram.commandManager.commands; _i < _a.length; _i++) {
        var command = _a[_i];
        commands[command.name] = { execute: command.execute, canExecute: command.canExecute };
    }
    var arrangeTickHorizontal = diagram.rulerSettings.horizontalRuler.arrangeTick;
    var arrangeTickVertical = diagram.rulerSettings.verticalRuler.arrangeTick;
    var getLayoutInfo = diagram.layout.getLayoutInfo;
    var getBranch = diagram.layout.getBranch;
    var nodeDefaults = diagram.getNodeDefaults;
    var connectorDefaults = diagram.getConnectorDefaults;
    var dataObj = JSON.parse(model);
    dataObj = upgrade(dataObj);
    diagram.contextMenuSettings = dataObj.contextMenuSettings || {};
    diagram.constraints = dataObj.constraints || DiagramConstraints.Default;
    diagram.tool = dataObj.tool || DiagramTools.Default;
    diagram.bridgeDirection = dataObj.bridgeDirection || 'Top';
    diagram.pageSettings = dataObj.pageSettings || {};
    diagram.drawingObject = dataObj.drawingObject || undefined;
    diagram.tooltip = dataObj.tooltip || {};
    diagram.addInfo = dataObj.addInfo || undefined;
    diagram.getDescription = getDescription;
    diagram.scrollSettings = dataObj.scrollSettings || {};
    diagram.commandManager = dataObj.commandManager || {};
    diagram.layers = dataObj.layers || [];
    diagram.rulerSettings.horizontalRuler.arrangeTick = arrangeTickHorizontal;
    diagram.rulerSettings.verticalRuler.arrangeTick = arrangeTickVertical;
    for (var _b = 0, _c = diagram.commandManager.commands; _b < _c.length; _b++) {
        var cmd = _c[_b];
        if (commands[cmd.name]) {
            cmd.execute = commands[cmd.name].execute;
            cmd.canExecute = commands[cmd.name].canExecute;
        }
    }
    diagram.backgroundColor = dataObj.backgroundColor || 'transparent';
    diagram.basicElements = dataObj.basicElements || [];
    diagram.connectors = dataObj.connectors || [];
    diagram.dataSourceSettings = dataObj.dataSourceSettings || {};
    diagram.dataSourceSettings.doBinding = map;
    diagram.height = dataObj.height || '100%';
    diagram.setNodeTemplate = nodeTemp;
    diagram.getConnectorDefaults = connectorDefaults;
    diagram.getNodeDefaults = nodeDefaults;
    diagram.getCustomProperty = getCustomProperty;
    diagram.mode = dataObj.mode || 'SVG';
    if (dataObj.nodes) {
        for (var i = 0; i < dataObj.nodes.length; i++) {
            if (dataObj.nodes[i].shape && dataObj.nodes[i].shape.type === 'SwimLane') {
                pasteSwimLane(dataObj.nodes[i], undefined, undefined, undefined, undefined, true);
            }
        }
    }
    diagram.nodes = dataObj.nodes || [];
    diagram.rulerSettings = dataObj.rulerSettings || {};
    diagram.snapSettings = dataObj.snapSettings || {};
    diagram.width = dataObj.width || '100%';
    diagram.layout = dataObj.layout || {};
    diagram.layout.getLayoutInfo = getFunction(getLayoutInfo);
    diagram.layout.getBranch = getFunction(getBranch);
    diagram.diagramActions = 0;
    diagram.isLoading = true;
    diagram.protectPropertyChange(false);
    var key = 'refresh';
    var component;
    for (var i = 0; i < diagram.views.length; i++) {
        component = diagram.views[diagram.views[i]];
        component.refresh();
        if (component instanceof Diagram) {
            diagram.element.classList.add('e-diagram');
        }
    }
    if (dataObj.selectedItems) {
        dataObj.selectedItems.nodes = [];
        dataObj.selectedItems.connectors = [];
    }
    diagram.selectedItems = dataObj.selectedItems;
    diagram.enableServerDataBinding(true);
    return dataObj;
}
/** @private */
export function upgrade(dataObj) {
    if (dataObj && (dataObj.version === undefined || (dataObj.version < 17.1)) && dataObj.nodes) {
        var nodes = dataObj.nodes;
        for (var _i = 0, nodes_1 = nodes; _i < nodes_1.length; _i++) {
            var node = nodes_1[_i];
            if (node && node.ports && node.ports.length > 0) {
                for (var _a = 0, _b = node.ports; _a < _b.length; _a++) {
                    var port = _b[_a];
                    if (port && port.constraints && port.constraints === PortConstraints.None) {
                        port.constraints = PortConstraints.Default;
                    }
                }
            }
        }
    }
    return dataObj;
}
/** @private */
export function updateStyle(changedObject, target) {
    //since text style model is the super set of shape style model, we used text style model
    var style = target.style;
    var textElement = target;
    target.canApplyStyle = true;
    for (var _i = 0, _a = Object.keys(changedObject); _i < _a.length; _i++) {
        var key = _a[_i];
        switch (key) {
            case 'fill':
                style.fill = changedObject.fill;
                if (style instanceof StrokeStyle) {
                    /* tslint:disable:no-string-literal */
                    style['fill'] = 'transparent';
                }
                break;
            case 'textOverflow':
                style.textOverflow = changedObject.textOverflow;
                break;
            case 'opacity':
                style.opacity = changedObject.opacity;
                break;
            case 'strokeColor':
                style.strokeColor = changedObject.strokeColor;
                break;
            case 'strokeDashArray':
                style.strokeDashArray = changedObject.strokeDashArray;
                break;
            case 'strokeWidth':
                style.strokeWidth = changedObject.strokeWidth;
                break;
            case 'bold':
                style.bold = changedObject.bold;
                break;
            case 'color':
                style.color = changedObject.color;
                break;
            case 'textWrapping':
                style.textWrapping = changedObject.textWrapping;
                break;
            case 'fontFamily':
                style.fontFamily = changedObject.fontFamily;
                break;
            case 'fontSize':
                style.fontSize = changedObject.fontSize;
                break;
            case 'italic':
                style.italic = changedObject.italic;
                break;
            case 'textAlign':
                style.textAlign = changedObject.textAlign;
                break;
            case 'whiteSpace':
                style.whiteSpace = changedObject.whiteSpace;
                break;
            case 'textDecoration':
                style.textDecoration = changedObject.textDecoration;
                break;
            case 'gradient':
                if (style.gradient) {
                    updateGradient(changedObject.gradient, style.gradient);
                    break;
                }
        }
    }
    if (target instanceof TextElement) {
        textElement.refreshTextElement();
    }
}
function updateGradient(changedGradient, targetGradient) {
    for (var _i = 0, _a = Object.keys(changedGradient); _i < _a.length; _i++) {
        var key = _a[_i];
        switch (key) {
            case 'type':
                targetGradient.type = changedGradient.type;
                break;
            case 'x1':
                targetGradient.x1 = changedGradient.x1;
                break;
            case 'x2':
                targetGradient.x2 = changedGradient.x2;
                break;
            case 'y1':
                targetGradient.y1 = changedGradient.y1;
                break;
            case 'y2':
                targetGradient.y2 = changedGradient.y2;
                break;
            case 'cx':
                targetGradient.cx = changedGradient.cx;
                break;
            case 'cy':
                targetGradient.cy = changedGradient.cy;
                break;
            case 'fx':
                targetGradient.fx = changedGradient.fx;
                break;
            case 'fy':
                targetGradient.fy = changedGradient.fy;
                break;
            case 'r':
                targetGradient.r = changedGradient.r;
                break;
            case 'stops':
                targetGradient.stops = changedGradient.stops;
                break;
        }
    }
}
/** @private */
export function updateHyperlink(changedObject, target, actualAnnotation) {
    var textElement = target;
    var hyperlink = textElement.hyperlink;
    for (var _i = 0, _a = Object.keys(changedObject); _i < _a.length; _i++) {
        var key = _a[_i];
        switch (key) {
            case 'color':
                textElement.style.color = hyperlink.color = changedObject.color;
                break;
            case 'content':
                textElement.content = hyperlink.content = changedObject.content || hyperlink.link;
                break;
            case 'link':
                var labelStyle = actualAnnotation.style;
                textElement.style.color = changedObject.link ? hyperlink.color : labelStyle.color;
                textElement.style.textDecoration = changedObject.link ? hyperlink.textDecoration : actualAnnotation.style.textDecoration;
                textElement.content = changedObject.link ? hyperlink.content || changedObject.link : actualAnnotation.content;
                hyperlink.link = changedObject.link;
                break;
            case 'textDecoration':
                textElement.style.textDecoration = hyperlink.textDecoration = changedObject.textDecoration;
                break;
        }
    }
}
/** @private */
export function updateShapeContent(content, actualObject, diagram) {
    content.width = actualObject.width;
    content.height = actualObject.height;
    content.minHeight = actualObject.minHeight;
    content.maxHeight = actualObject.maxHeight;
    content.minWidth = actualObject.minWidth;
    content.maxWidth = actualObject.maxWidth;
    content.horizontalAlignment = actualObject.wrapper.children[0].horizontalAlignment;
    content.verticalAlignment = actualObject.wrapper.children[0].verticalAlignment;
    content.relativeMode = actualObject.wrapper.children[0].relativeMode;
    content.visible = actualObject.wrapper.children[0].visible;
    if (actualObject.shape instanceof Text) {
        content.margin = actualObject.shape.margin;
    }
    content.id = actualObject.wrapper.children[0].id;
    content.style = actualObject.style;
    var view;
    for (var _i = 0, _a = diagram.views; _i < _a.length; _i++) {
        var elementId = _a[_i];
        removeElement(actualObject.id + '_groupElement', elementId);
        removeElement(actualObject.id + '_content_groupElement', elementId);
        removeElement(actualObject.id + '_html_element', elementId);
    }
    actualObject.wrapper.children.splice(0, 1);
    actualObject.wrapper.children.splice(0, 0, content);
}
/** @private */
export function updateShape(node, actualObject, oldObject, diagram) {
    var content = new DiagramElement();
    var i;
    var textStyle;
    var nodeStyle;
    switch (node.shape.type) {
        case 'Path':
            var pathContent = new PathElement();
            pathContent.data = actualObject.shape.data;
            content = pathContent;
            updateShapeContent(content, actualObject, diagram);
            break;
        case 'Image':
            var imageContent = new ImageElement();
            imageContent.source = actualObject.shape.source;
            imageContent.imageAlign = actualObject.shape.align;
            imageContent.imageScale = actualObject.shape.scale;
            content = imageContent;
            updateShapeContent(content, actualObject, diagram);
            break;
        case 'Text':
            //issue
            var textContent = new TextElement();
            //  (textContent as TextElement).content = (node.shape as TextModel).content;
            content = textContent;
            updateShapeContent(content, actualObject, diagram);
            break;
        case 'Basic':
            var element = void 0;
            element = ((isBlazor() ? actualObject.shape.basicShape === 'Rectangle' :
                actualObject.shape.shape === 'Rectangle')) ? new DiagramElement() : new PathElement();
            if ((!isBlazor() && actualObject.shape.shape === 'Polygon') ||
                (isBlazor() && actualObject.shape.basicShape === 'Polygon')) {
                element.data = getPolygonPath(actualObject.shape.points);
            }
            else {
                element.data = getBasicShape((isBlazor() ? actualObject.shape.basicShape :
                    actualObject.shape.shape));
            }
            updateShapeContent(content, actualObject, diagram);
            if ((!isBlazor() && actualObject.shape.shape === 'Rectangle') ||
                (isBlazor() && actualObject.shape.basicShape === 'Rectangle')) {
                element.cornerRadius = actualObject.shape.cornerRadius;
            }
            content = element;
            break;
        case 'Flow':
            var flowShapeElement = new PathElement();
            var shape = (isBlazor()) ? actualObject.shape.flowShape : actualObject.shape.shape;
            flowShapeElement.data = getFlowShape(shape);
            content = flowShapeElement;
            updateShapeContent(content, actualObject, diagram);
            break;
        case 'Native':
            var nativeContent = new DiagramNativeElement(node.id, diagram.element.id);
            nativeContent.content = actualObject.shape.content;
            nativeContent.scale = actualObject.shape.scale;
            content = nativeContent;
            updateShapeContent(content, actualObject, diagram);
            break;
        case 'HTML':
            var htmlContent = new DiagramHtmlElement(actualObject.id, diagram.element.id);
            htmlContent.content = actualObject.shape.content;
            content = htmlContent;
            updateShapeContent(content, actualObject, diagram);
    }
    if (node.shape.type === undefined || node.shape.type === oldObject.shape.type) {
        updateContent(node, actualObject, diagram);
    }
    else {
        content.width = actualObject.wrapper.children[0].width;
        content.height = actualObject.wrapper.children[0].height;
        if (actualObject.shape instanceof Text) {
            content.margin = actualObject.shape.margin;
        }
        content.style = actualObject.style;
        actualObject.wrapper.children[0] = content;
    }
}
/** @private */
export function updateContent(newValues, actualObject, diagram) {
    if (Object.keys(newValues.shape).length > 0) {
        if (actualObject.shape.type === 'Path' && newValues.shape.data !== undefined) {
            actualObject.wrapper.children[0].data = newValues.shape.data;
        }
        else if (actualObject.shape.type === 'Text' && newValues.shape.content !== undefined) {
            actualObject.wrapper.children[0].content = newValues.shape.content;
        }
        else if (actualObject.shape.type === 'Image' && newValues.shape.source !== undefined) {
            actualObject.wrapper.children[0].source = newValues.shape.source;
        }
        else if (actualObject.shape.type === 'Native') {
            var nativeElement = void 0;
            for (var i = 0; i < diagram.views.length; i++) {
                nativeElement = getDiagramElement(actualObject.wrapper.children[0].id + '_native_element', diagram.views[i]);
                if (newValues.shape.content !== undefined && nativeElement) {
                    nativeElement.removeChild(nativeElement.children[0]);
                    actualObject.wrapper.children[0].content = newValues.shape.content;
                    nativeElement.appendChild(getContent(actualObject.wrapper.children[0], false));
                }
            }
            actualObject.wrapper.children[0].scale = newValues.shape.scale ?
                newValues.shape.scale : actualObject.wrapper.children[0].scale;
        }
        else if (actualObject.shape.type === 'HTML') {
            var htmlElement = void 0;
            for (var i = 0; i < diagram.views.length; i++) {
                htmlElement = getDiagramElement(actualObject.wrapper.children[0].id + '_html_element', diagram.views[i]);
                if (htmlElement) {
                    htmlElement.removeChild(htmlElement.children[0]);
                    actualObject.wrapper.children[0].content = newValues.shape.content;
                    htmlElement.appendChild(getContent(actualObject.wrapper.children[0], true));
                }
            }
        }
        else if (actualObject.shape.type === 'Flow' && ((isBlazor() && newValues.shape.flowShape !== undefined) ||
            newValues.shape.shape !== undefined)) {
            actualObject.shape.shape = isBlazor() ? newValues.shape.flowShape :
                newValues.shape.shape;
            var shapes = actualObject.shape.shape;
            var flowshapedata = getFlowShape(shapes.toString());
            actualObject.wrapper.children[0].data = flowshapedata;
        }
        else if (actualObject.shape.type === 'UmlActivity' &&
            ((isBlazor() && newValues.shape.umlActivityShape !== undefined) ||
                (!isBlazor() && newValues.shape.shape !== undefined))) {
            updateUmlActivityNode(actualObject, newValues);
        }
        else if (newValues.shape.cornerRadius !== undefined) {
            actualObject.wrapper.children[0].cornerRadius = newValues.shape.cornerRadius;
        }
        else if (((isBlazor() && newValues.shape.basicShape !== undefined) ||
            newValues.shape.shape !== undefined)) {
            actualObject.shape.shape = isBlazor() ? newValues.shape.basicShape :
                newValues.shape.shape;
            var shapes = actualObject.shape.shape;
            var basicShapeData = getBasicShape(shapes.toString());
            actualObject.wrapper.children[0].data = basicShapeData;
        }
    }
    actualObject.wrapper.children[0].canMeasurePath = true;
}
/** @private */
export function updateUmlActivityNode(actualObject, newValues) {
    if (!isBlazor()) {
        actualObject.shape.shape = newValues.shape.shape;
    }
    else {
        actualObject.shape.umlActivityShape = newValues.shape.umlActivityShape;
    }
    var shapes = !isBlazor() ? actualObject.shape.shape :
        actualObject.shape.umlActivityShape;
    var umlActivityShapeData = getUMLActivityShape(shapes.toString());
    if ((isBlazor() && actualObject.shape.umlActivityShape === 'InitialNode') ||
        (!isBlazor() && actualObject.shape.shape === 'InitialNode')) {
        actualObject.wrapper.children[0].style.fill = 'black';
    }
    else if ((!isBlazor() && (actualObject.shape.shape === 'ForkNode' ||
        actualObject.shape.shape === 'JoinNode')) ||
        ((isBlazor() && (actualObject.shape.umlActivityShape === 'ForkNode' ||
            actualObject.shape.umlActivityShape === 'JoinNode')))) {
        actualObject.wrapper.children[0].style.fill = 'black';
    }
    else if ((!isBlazor() && actualObject.shape.shape === 'FinalNode') ||
        (isBlazor() && actualObject.shape.umlActivityShape === 'FinalNode')) {
        if (actualObject instanceof Node) {
            actualObject.wrapper = getUMLFinalNode(actualObject);
        }
        actualObject.wrapper.children[0].data = umlActivityShapeData;
    }
}
/** @private */
export function getUMLFinalNode(node) {
    var finalNodeShape = new Canvas();
    finalNodeShape.style.fill = 'transparent';
    //childNode0
    var pathData = 'M 25 50 C 11.21 50 0 38.79 0 25 C 0 11.21 11.21 0 25 0 C 38.78 0 50 11.21 50 25' +
        ' C 50 38.79 38.78 50 25 50';
    var innerFinalNode = new PathElement();
    innerFinalNode.data = pathData;
    innerFinalNode.id = node.id + '_0_finalNode';
    innerFinalNode.horizontalAlignment = 'Center';
    innerFinalNode.verticalAlignment = 'Center';
    innerFinalNode.relativeMode = 'Object';
    innerFinalNode.style.strokeColor = node.style.strokeColor;
    innerFinalNode.style.strokeWidth = node.style.strokeWidth;
    //childNode1
    var outerFinalNode = new PathElement();
    outerFinalNode.data = pathData;
    outerFinalNode.id = node.id + '_1_finalNode';
    outerFinalNode.horizontalAlignment = 'Center';
    outerFinalNode.verticalAlignment = 'Center';
    outerFinalNode.relativeMode = 'Object';
    outerFinalNode.style.fill = node.style.fill;
    outerFinalNode.style.strokeColor = node.style.strokeColor;
    outerFinalNode.style.strokeWidth = node.style.strokeWidth;
    //append child and set style
    finalNodeShape.children = [innerFinalNode, outerFinalNode];
    finalNodeShape.children[0].width = node.width;
    finalNodeShape.children[0].height = node.height;
    finalNodeShape.children[1].height = node.height / 1.5;
    finalNodeShape.children[1].width = node.width / 1.5;
    finalNodeShape.style.strokeWidth = 0;
    finalNodeShape.style.strokeColor = 'transparent';
    return finalNodeShape;
}
/** @private */
export function getUMLActivityShapes(umlActivityShape, content, node) {
    var shape = (isBlazor() ? node.shape.umlActivityShape : node.shape.shape);
    var umlActivityShapeData = getUMLActivityShape(shape);
    umlActivityShape.data = umlActivityShapeData;
    content = umlActivityShape;
    switch (shape) {
        case 'StructuredNode':
            if (node.annotations) {
                for (var i = 0; i < node.annotations.length; i++) {
                    node.annotations[i].content = '<<' + node.annotations[i].content + '>>';
                }
            }
            content = umlActivityShape;
            break;
        case 'FinalNode':
            content = getUMLFinalNode(node);
            break;
    }
    return content;
}
/**   @private  */
export function removeGradient(svgId) {
    removeElement(svgId + '_linear');
    removeElement(svgId + '_radial');
}
/** @private */
export function removeItem(array, item) {
    var index = array.indexOf(item);
    if (index >= 0) {
        array.splice(index, 1);
    }
}
/** @private */
export function updateConnector(connector, points, diagramActions) {
    var srcPoint;
    var anglePoint;
    var srcDecorator;
    var tarDecorator;
    var targetPoint;
    connector.intermediatePoints = points;
    connector.updateSegmentElement(connector, points, connector.wrapper.children[0], diagramActions);
    srcPoint = connector.sourcePoint;
    srcDecorator = connector.sourceDecorator;
    if (connector.type === 'Bezier') {
        var firstSegment = connector.segments[0];
        var lastSegment = connector.segments[connector.segments.length - 1];
        anglePoint = [!Point.isEmptyPoint(lastSegment.point2) ? lastSegment.point2 : lastSegment.bezierPoint2,
            !Point.isEmptyPoint(firstSegment.point1) ? firstSegment.point1 : firstSegment.bezierPoint1];
    }
    else {
        anglePoint = connector.intermediatePoints;
    }
    points = connector.clipDecorators(connector, points, diagramActions);
    var element = connector.wrapper.children[0];
    element.canMeasurePath = true;
    element = connector.wrapper.children[1];
    connector.updateDecoratorElement(element, points[0], anglePoint[1], srcDecorator);
    targetPoint = connector.targetPoint;
    tarDecorator = connector.targetDecorator;
    element = connector.wrapper.children[2];
    connector.updateDecoratorElement(element, points[points.length - 1], anglePoint[anglePoint.length - 2], tarDecorator);
    connector.updateShapeElement(connector);
}
/** @private */
export function getUserHandlePosition(selectorItem, handle, transform) {
    var wrapper = selectorItem.wrapper;
    var positionPoints;
    var bounds = wrapper.bounds;
    var offset = handle.offset;
    var size = handle.size / transform.scale;
    var margin = handle.margin;
    var point;
    var left = wrapper.offsetX - wrapper.actualSize.width * wrapper.pivot.x;
    var top = wrapper.offsetY - wrapper.actualSize.height * wrapper.pivot.y;
    point = { x: 0, y: 0 };
    if (selectorItem.nodes.length > 0) {
        switch (handle.side) {
            case 'Top':
                point.x += left + bounds.width * offset;
                point.y += top - (size / 2 + 12.5);
                break;
            case 'Bottom':
                point.x += left + offset * bounds.width;
                point.y += top + wrapper.actualSize.height + (size / 2 + 12.5);
                break;
            case 'Left':
                point.x += left - (size / 2 + 12.5);
                point.y += top + offset * bounds.height;
                break;
            case 'Right':
                point.x += left + wrapper.actualSize.width + (size / 2 + 12.5);
                point.y += top + offset * bounds.height;
                break;
        }
        point.x += ((margin.left - margin.right) / transform.scale) +
            (size / 2) * (handle.horizontalAlignment === 'Center' ? 0 : (handle.horizontalAlignment === 'Right' ? -1 : 1));
        point.y += ((margin.top - margin.bottom) / transform.scale) +
            (size / 2) * (handle.verticalAlignment === 'Center' ? 0 : (handle.verticalAlignment === 'Top' ? -1 : 1));
    }
    else if (selectorItem.connectors.length > 0) {
        var connector = selectorItem.connectors[0];
        var annotation = { offset: offset };
        var connectorOffset = getOffsetOfConnector(connector.intermediatePoints, annotation, bounds);
        var index = connectorOffset.index;
        point = connectorOffset.point;
        var getPointloop = getAnnotationPosition(connector.intermediatePoints, annotation, bounds);
        var points = connector.intermediatePoints;
        var offsetLength = void 0;
        var angle = getPointloop.angle;
        var matrix = identityMatrix();
        rotateMatrix(matrix, -angle, connector.intermediatePoints[index].x, connector.intermediatePoints[index].y);
        point = transformPointByMatrix(matrix, point);
        point.x += (margin.left - margin.right) +
            (size / 2) * (handle.horizontalAlignment === 'Center' ? 0 : (handle.horizontalAlignment === 'Right' ? -1 : 1));
        point.y += (margin.top - margin.bottom) +
            (size / 2) * (handle.verticalAlignment === 'Center' ? 0 : (handle.verticalAlignment === 'Top' ? -1 : 1));
        matrix = identityMatrix();
        rotateMatrix(matrix, angle, connector.intermediatePoints[index].x, connector.intermediatePoints[index].y);
        point = transformPointByMatrix(matrix, point);
    }
    if (wrapper.rotateAngle !== 0 || wrapper.parentTransform !== 0) {
        var matrix = identityMatrix();
        rotateMatrix(matrix, wrapper.rotateAngle + wrapper.parentTransform, wrapper.offsetX, wrapper.offsetY);
        point = transformPointByMatrix(matrix, point);
    }
    return point;
}
/** @private */
export function canResizeCorner(selectorConstraints, action, thumbsConstraints, selectedItems) {
    if (selectedItems.annotation) {
        if (canResize(selectedItems.annotation)) {
            return true;
        }
    }
    else if ((SelectorConstraints[action] & selectorConstraints) && (ThumbsConstraints[action] & thumbsConstraints)) {
        return true;
    }
    return false;
}
/** @private */
export function canShowCorner(selectorConstraints, action) {
    if (SelectorConstraints[action] & selectorConstraints) {
        return true;
    }
    return false;
}
/** @private */
export function checkPortRestriction(port, portVisibility) {
    return port.visibility & portVisibility;
}
/** @private */
export function findAnnotation(node, id) {
    var annotation;
    if (node.shape.type === 'Text') {
        annotation = (node.shape);
    }
    else {
        var annotationId = id.split('_');
        id = annotationId[annotationId.length - 1];
        for (var i = 0; i < node.annotations.length; i++) {
            if (id === node.annotations[i].id) {
                annotation = node.annotations[i];
            }
        }
    }
    return annotation;
}
/** @private */
export function findPort(node, id) {
    var port;
    var portId = id.split('_');
    id = portId[portId.length - 1];
    if (node) {
        node = node;
        for (var i = 0; i < node.ports.length; i++) {
            if (id === node.ports[i].id) {
                return node.ports[i];
            }
        }
    }
    return port;
}
/** @private */
export function getInOutConnectPorts(node, isInConnect) {
    var port = {};
    var i = 0;
    if (node.ports) {
        var ports = node.ports;
        for (i = 0; i < ports.length; i++) {
            if (isInConnect) {
                if ((ports[i].constraints & PortConstraints.InConnect)) {
                    port = ports[i];
                }
            }
            else {
                if ((ports[i].constraints & PortConstraints.OutConnect)) {
                    port = ports[i];
                }
            }
        }
    }
    return port;
}
/** @private */
export function findObjectIndex(node, id, annotation) {
    var index;
    var collection = (annotation) ? node.annotations : node.ports;
    for (var i = 0; i < collection.length; i++) {
        if (collection[i].id === id) {
            return (i).toString();
        }
    }
    return null;
}
/** @private */
export function getObjectFromCollection(obj, id) {
    var i;
    for (i = 0; i < obj.length; i++) {
        if (id === obj[i].id) {
            return true;
        }
    }
    return false;
}
/** @private */
export function scaleElement(element, sw, sh, refObject) {
    if (element.width !== undefined && element.height !== undefined) {
        element.width *= sw;
        element.height *= sh;
    }
    if (element instanceof Container) {
        var matrix = identityMatrix();
        var width = refObject.width || refObject.actualSize.width;
        var height = refObject.height || refObject.actualSize.height;
        if (width !== undefined && height !== undefined) {
            var x = refObject.offsetX - width * refObject.pivot.x;
            var y = refObject.offsetY - height * refObject.pivot.y;
            var refPoint = {
                x: x + width * refObject.pivot.x,
                y: y + height * refObject.pivot.y
            };
            refPoint = rotatePoint(refObject.rotateAngle, refObject.offsetX, refObject.offsetY, refPoint);
            rotateMatrix(matrix, -refObject.rotateAngle, refPoint.x, refPoint.y);
            scaleMatrix(matrix, sw, sh, refPoint.x, refPoint.y);
            rotateMatrix(matrix, refObject.rotateAngle, refPoint.x, refPoint.y);
            for (var _i = 0, _a = element.children; _i < _a.length; _i++) {
                var child = _a[_i];
                if (child.width !== undefined && child.height !== undefined) {
                    var newPosition = transformPointByMatrix(matrix, { x: child.offsetX, y: child.offsetY });
                    child.offsetX = newPosition.x;
                    child.offsetY = newPosition.y;
                    scaleElement(child, sw, sh, refObject);
                }
            }
        }
    }
}
/** @private */
export function arrangeChild(obj, x, y, nameTable, drop, diagram) {
    var child = obj.children;
    var node;
    for (var i = 0; i < child.length; i++) {
        node = nameTable[child[i]];
        if (node) {
            if (node.children) {
                arrangeChild(node, x, y, nameTable, drop, diagram);
            }
            else {
                node.offsetX -= x;
                node.offsetY -= y;
                if (!drop) {
                    var content = void 0;
                    var container = void 0;
                    nameTable[node.id] = node;
                    container = node.initContainer();
                    if (!container.children) {
                        container.children = [];
                    }
                    content = node.init(diagram);
                    container.children.push(content);
                    container.measure(new Size(node.width, node.height));
                    container.arrange(container.desiredSize);
                }
            }
        }
    }
}
/** @private */
export function insertObject(obj, key, collection) {
    if (collection.length === 0) {
        collection.push(obj);
    }
    else if (collection.length === 1) {
        if (collection[0][key] > obj[key]) {
            collection.splice(0, 0, obj);
        }
        else {
            collection.push(obj);
        }
    }
    else if (collection.length > 1) {
        var low = 0;
        var high = collection.length - 1;
        var mid = Math.floor((low + high) / 2);
        while (mid !== low) {
            if (collection[mid][key] < obj[key]) {
                low = mid;
                mid = Math.floor((low + high) / 2);
            }
            else if (collection[mid][key] > obj[key]) {
                high = mid;
                mid = Math.floor((low + high) / 2);
            }
        }
        if (collection[high][key] < obj[key]) {
            collection.push(obj);
        }
        else if (collection[low][key] > obj[key]) {
            collection.splice(low, 0, obj);
        }
        else if ((collection[low][key] < obj[key]) && collection[high][key] > obj[key]) {
            collection.splice(high, 0, obj);
        }
    }
}
/** @private */
export function getElement(element) {
    var diagramElement = document.getElementById(element.diagramId);
    var instance = 'ej2_instances';
    var node = {};
    var nodes = diagramElement[instance][0].nodes;
    if (nodes === undefined) {
        nodes = getPaletteSymbols(diagramElement[instance][0]);
    }
    var length = 'length';
    for (var i = 0; nodes && i < nodes[length]; i++) {
        if (nodes[i].id === element.nodeId) {
            return getAnnotation(nodes[i], element);
        }
    }
    var connectors = diagramElement[instance][0].connectors;
    for (var i = 0; connectors && i < connectors[length]; i++) {
        if (connectors[i].id === element.nodeId) {
            return getAnnotation(connectors[i], element);
        }
    }
    var enterObject = diagramElement[instance][0].enterObject;
    if (enterObject && (enterObject['id'] === element.nodeId || enterObject['children'])) {
        if (enterObject['children'] && groupHasType(enterObject, 'HTML', diagramElement[instance][0].enterTable)) {
            return diagramElement[instance][0].enterTable[element.nodeId];
        }
        else {
            return enterObject;
        }
    }
    return null;
}
function getAnnotation(obj, element) {
    var annotations = obj.annotations;
    var length = 'length';
    var j;
    for (j = 0; annotations && j < annotations[length]; j++) {
        if (element.annotationId && annotations[j].id === element.annotationId) {
            return annotations[j];
        }
    }
    return obj;
}
/** @private */
function getPaletteSymbols(symbolPalette) {
    var nodes = [];
    for (var i = 0; i < symbolPalette.palettes.length; i++) {
        var symbols = symbolPalette.palettes[i].symbols;
        for (var j = 0; j < symbols.length; j++) {
            if (symbols[j] instanceof Node) {
                nodes.push(symbols[j]);
            }
        }
    }
    return nodes;
}
/** @private */
export function getCollectionChangeEventArguements(args1, obj, state, type) {
    if (isBlazor()) {
        args1 = {
            cause: args1.cause, state: state, type: type, cancel: false,
            element: getObjectType(obj) === Connector ?
                { connector: cloneBlazorObject(obj) } : { node: cloneBlazorObject(obj) }
        };
    }
    return args1;
}
/** @private */
export function getDropEventArguements(args, arg) {
    if (isBlazor()) {
        var connector = (getObjectType(args.source) === Connector);
        var object = cloneBlazorObject(args.source);
        var target = cloneBlazorObject(args.target);
        arg = {
            element: connector ? { connector: object } : { node: object },
            target: connector ? { connector: target } : { node: target },
            position: arg.position, cancel: arg.cancel
        };
    }
    return arg;
}
/** @private */
export function getPoint(x, y, w, h, angle, offsetX, offsetY, cornerPoint) {
    var pivot = { x: 0, y: 0 };
    var trans = identityMatrix();
    rotateMatrix(trans, angle, offsetX, offsetY);
    switch (cornerPoint.x) {
        case 0:
            switch (cornerPoint.y) {
                case 0:
                    pivot = transformPointByMatrix(trans, ({ x: x, y: y }));
                    break;
                case 0.5:
                    pivot = transformPointByMatrix(trans, ({ x: x, y: y + h / 2 }));
                    break;
                case 1:
                    pivot = transformPointByMatrix(trans, ({ x: x, y: y + h }));
                    break;
            }
            break;
        case 0.5:
            switch (cornerPoint.y) {
                case 0:
                    pivot = transformPointByMatrix(trans, ({ x: x + w / 2, y: y }));
                    break;
                case 0.5:
                    pivot = transformPointByMatrix(trans, ({ x: x + w / 2, y: y + h / 2 }));
                    break;
                case 1:
                    pivot = transformPointByMatrix(trans, ({ x: x + w / 2, y: y + h }));
                    break;
            }
            break;
        case 1:
            switch (cornerPoint.y) {
                case 0:
                    pivot = transformPointByMatrix(trans, ({ x: x + w, y: y }));
                    break;
                case 0.5:
                    pivot = transformPointByMatrix(trans, ({ x: x + w, y: y + h / 2 }));
                    break;
                case 1:
                    pivot = transformPointByMatrix(trans, ({ x: x + w, y: y + h }));
                    break;
            }
            break;
    }
    return { x: pivot.x, y: pivot.y };
}
/**
 * Get the object as Node | Connector
 * @param {Object} obj
 */
export var getObjectType = function (obj) {
    if (obj) {
        if (obj.sourceID !== undefined || obj.sourcePoint !== undefined ||
            obj.targetID !== undefined || obj.targetPoint !== undefined ||
            obj.type !== undefined) {
            obj = Connector;
        }
        else {
            obj = Node;
        }
    }
    return obj;
};
/** @private */
export var flipConnector = function (connector) {
    if (!connector.sourceID && !connector.targetID) {
        var source = { x: connector.sourcePoint.x, y: connector.sourcePoint.y };
        var target = { x: connector.targetPoint.x, y: connector.targetPoint.y };
        if (connector.flip === 'Horizontal') {
            connector.sourcePoint.x = target.x;
            connector.targetPoint.x = source.x;
        }
        else if (connector.flip === 'Vertical') {
            connector.sourcePoint.y = target.y;
            connector.targetPoint.y = source.y;
        }
        else if (connector.flip === 'Both') {
            connector.sourcePoint = target;
            connector.targetPoint = source;
        }
    }
};
/** @private */
export var updatePortEdges = function (portContent, flip, port) {
    var offsetX = port.offset.x;
    var offsetY = port.offset.y;
    if (flip === 'Horizontal') {
        offsetX = 1 - port.offset.x;
        offsetY = port.offset.y;
    }
    else if (flip === 'Vertical') {
        offsetX = port.offset.x;
        offsetY = 1 - port.offset.y;
    }
    else if (flip === 'Both') {
        offsetX = 1 - port.offset.x;
        offsetY = 1 - port.offset.y;
    }
    portContent.setOffsetWithRespectToBounds(offsetX, offsetY, 'Fraction');
    return portContent;
};
/** @private */
export var alignElement = function (element, offsetX, offsetY, diagram, flip) {
    if (element.hasChildren()) {
        for (var _i = 0, _a = element.children; _i < _a.length; _i++) {
            var child = _a[_i];
            var childX = ((offsetX - child.offsetX) + offsetX);
            var childY = ((offsetY - child.offsetY) + offsetY);
            if (flip === 'Horizontal' || flip === 'Both') {
                child.offsetX = childX;
                child.flipOffset.x = childX - child.desiredSize.width / 2;
            }
            if (flip === 'Vertical' || flip === 'Both') {
                child.offsetY = childY;
                child.flipOffset.y = childY - child.desiredSize.height / 2;
            }
            if (child instanceof Canvas || child instanceof Container) {
                alignElement(child, offsetX, offsetY, diagram, flip);
            }
            child.measure(new Size(child.bounds.width, child.bounds.height));
            child.arrange(child.desiredSize);
            var node = diagram.nameTable[child.id];
            if (node) {
                diagram.updateConnectorEdges(node);
            }
        }
    }
};
/** @private */
export var cloneSelectedObjects = function (diagram) {
    var nodes = diagram.selectedItems.nodes;
    var connectors = diagram.selectedItems.connectors;
    diagram.protectPropertyChange(true);
    var isEnableServerDatabind = diagram.allowServerDataBinding;
    diagram.allowServerDataBinding = false;
    diagram.selectedItems.nodes = [];
    diagram.selectedItems.connectors = [];
    diagram.allowServerDataBinding = isEnableServerDatabind;
    diagram.protectPropertyChange(false);
    var clonedSelectedItems = cloneObject(diagram.selectedItems);
    for (var i = 0; i < nodes.length; i++) {
        diagram.selectedItems.nodes.push(diagram.nameTable[nodes[i].id]);
    }
    for (var i = 0; i < connectors.length; i++) {
        diagram.selectedItems.connectors.push(diagram.nameTable[connectors[i].id]);
    }
    return clonedSelectedItems;
};
/** @private */
export var updatePathElement = function (anglePoints, connector) {
    var pathElement = new PathElement();
    var pathseqData;
    for (var j = 0; j < anglePoints.length - 1; j++) {
        pathseqData = findPath(anglePoints[j], anglePoints[j + 1]);
        pathElement.data = pathseqData[0];
        pathElement.id = connector.id + '_' + (connector.shape.sequence);
        pathElement.offsetX = pathseqData[1].x;
        pathElement.offsetY = pathseqData[1].y;
        pathElement.rotateAngle = 45;
        pathElement.transform = Transform.Self;
    }
    return pathElement;
};
/** @private */
export var checkPort = function (node, element) {
    for (var i = 0; i < node.ports.length; i++) {
        if (node.ports[i].id === element.id.split('_')[1]) {
            return true;
        }
    }
    return false;
};
/** @private */
export var findPath = function (sourcePoint, targetPoint) {
    var beginningpoint = { x: sourcePoint.x, y: sourcePoint.y };
    var distance = findDistance(sourcePoint, targetPoint);
    distance = Math.min(30, distance / 2);
    var angle = findAngle(sourcePoint, targetPoint);
    var transferpt = Point.transform({ x: beginningpoint.x, y: beginningpoint.y }, angle, distance);
    var startpoint = Point.transform({ x: transferpt.x, y: transferpt.y }, angle, -12);
    var endpoint = Point.transform({ x: startpoint.x, y: startpoint.y }, angle, 12 * 2);
    var path = 'M' + startpoint.x + ' ' + startpoint.y + ' L' + endpoint.x + ' ' + endpoint.y;
    return [path, transferpt];
};
/** @private */
export var findDistance = function (point1, point2) {
    return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
};
/** @private */
export function cloneBlazorObject(args) {
    if (isBlazor()) {
        args = cloneObject(args);
    }
    return args;
}
/** @private */
export function checkBrowserInfo() {
    if ((navigator.platform.indexOf('Mac') >= 0 || navigator.platform.indexOf('iPad') >= 0
        || navigator.platform.indexOf('iPhone') >= 0 || navigator.platform.indexOf('MacIntel') >= 0)
        && (Browser.info.name === 'safari' || Browser.info.name === 'webkit')) {
        return true;
    }
    return false;
}
/** @private */
export function canMeasureDecoratorPath(objects) {
    if (objects.indexOf('shape') !== -1 || objects.indexOf('pathData') !== -1 ||
        objects.indexOf('width') !== -1 || objects.indexOf('height') !== -1) {
        return true;
    }
    return false;
}

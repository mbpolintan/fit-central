var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { Node } from '../objects/node';
import { Connector, StraightSegment } from '../objects/connector';
import { Point } from '../primitives/point';
import { BpmnSubEvent } from '../objects/node';
import { PointPort } from '../objects/port';
import { rotatePoint, cloneObject } from '../utility/base-util';
import { Rect } from '../primitives/rect';
import { getPolygonPath } from '../utility/path-util';
import { canOutConnect, canInConnect, canAllowDrop, canPortInConnect, canPortOutConnect } from '../utility/constraints-util';
import { transformPointByMatrix, rotateMatrix, identityMatrix } from '../primitives/matrix';
import { NodeConstraints, DiagramEvent, PortConstraints } from './../enum/enum';
import { TextElement } from '../core/elements/text-element';
import { contains } from './actions';
import { Selector } from '../objects/node';
import { getInOutConnectPorts, cloneBlazorObject, getDropEventArguements, getObjectType, checkPort } from '../utility/diagram-util';
import { isBlazor } from '@syncfusion/ej2-base';
import { DeepDiffMapper } from '../utility/diff-map';
/**
 * Defines the interactive tools
 */
var ToolBase = /** @class */ (function () {
    /**
     * Initializes the tool
     * @param {CommandHandler} command Command that is corresponding to the current action
     */
    function ToolBase(command, protectChange) {
        if (protectChange === void 0) { protectChange = false; }
        /**
         * Command that is corresponding to the current action
         */
        this.commandHandler = null;
        this.deepDiffer = new DeepDiffMapper();
        /**
         * Sets/Gets whether the interaction is being done
         */
        this.inAction = false;
        /**
         * Sets/Gets the protect change
         */
        this.isProtectChange = false;
        /**
         * Sets/Gets the current element that is under mouse
         */
        this.currentElement = null;
        /**   @private  */
        this.blocked = false;
        this.isTooltipVisible = false;
        /** @private */
        this.childTable = {};
        /**
         * Sets/Gets the previous object when mouse down
         */
        this.undoElement = { nodes: [], connectors: [] };
        this.checkProperty = true;
        this.undoParentElement = { nodes: [], connectors: [] };
        this.commandHandler = command;
        this.isProtectChange = protectChange;
    }
    ToolBase.prototype.startAction = function (currentElement) {
        this.currentElement = currentElement;
        this.inAction = true;
    };
    /**   @private  */
    ToolBase.prototype.mouseDown = function (args) {
        if (isBlazor()) {
            this.commandHandler.enableCloneObject(true);
            this.commandHandler.ismouseEvents(true);
        }
        this.currentElement = args.source;
        this.startPosition = this.currentPosition = this.prevPosition = args.position;
        this.isTooltipVisible = true;
        this.startAction(args.source);
        this.checkProperty = true;
    };
    ToolBase.prototype.checkPropertyValue = function () {
        if (this.checkProperty) {
            this.commandHandler.startTransaction(this.isProtectChange);
        }
    };
    /**   @private  */
    ToolBase.prototype.mouseMove = function (args) {
        this.currentPosition = args.position;
        if (this.inAction) {
            this.commandHandler.startTransaction(this.isProtectChange);
            this.checkProperty = false;
        }
        //this.currentElement = currentElement;
        return !this.blocked;
    };
    /**   @private  */
    ToolBase.prototype.mouseUp = function (args) {
        this.checkPropertyValue();
        this.currentPosition = args.position;
        // this.currentElement = currentElement;
        this.isTooltipVisible = false;
        this.commandHandler.endTransaction(this.isProtectChange);
        if (isBlazor()) {
            this.commandHandler.enableCloneObject(false);
            this.commandHandler.ismouseEvents(false);
            this.commandHandler.getBlazorOldValues(args, this instanceof LabelDragTool);
        }
        this.endAction();
    };
    ToolBase.prototype.endAction = function () {
        if (!this.isTooltipVisible) {
            this.commandHandler.closeTooltip();
        }
        this.commandHandler = null;
        this.currentElement = null;
        this.currentPosition = null;
        this.inAction = false;
        this.blocked = false;
    };
    /**   @private  */
    ToolBase.prototype.mouseWheel = function (args) {
        this.currentPosition = args.position;
    };
    /**   @private  */
    ToolBase.prototype.mouseLeave = function (args) {
        this.mouseUp(args);
    };
    ToolBase.prototype.updateSize = function (shape, startPoint, endPoint, corner, initialBounds, angle) {
        shape = this.commandHandler.renderContainerHelper(shape) || shape;
        var horizontalsnap = { snapped: false, offset: 0, left: false, right: false };
        var verticalsnap = { snapped: false, offset: 0, top: false, bottom: false };
        var difx = this.currentPosition.x - this.startPosition.x;
        var dify = this.currentPosition.y - this.startPosition.y;
        var snapEnabled = (!(shape instanceof TextElement)) && this.commandHandler.snappingModule
            && this.commandHandler.snappingModule.canSnap();
        var snapLine = snapEnabled ? this.commandHandler.snappingModule.getLayer() : null;
        var rotateAngle = (shape instanceof TextElement) ? angle : shape.rotateAngle;
        var matrix;
        matrix = identityMatrix();
        rotateMatrix(matrix, -rotateAngle, 0, 0);
        var x = shape.offsetX;
        var y = shape.offsetY;
        var w = shape.width;
        var h = shape.height;
        x = x - w * shape.pivot.x;
        y = y - h * shape.pivot.y;
        var deltaWidth = 0;
        var deltaHeight = 0;
        var diff;
        var width = (shape instanceof TextElement) ? shape.actualSize.width : shape.width;
        var height = (shape instanceof TextElement) ? shape.actualSize.height : shape.height;
        switch (corner) {
            case 'ResizeWest':
                diff = transformPointByMatrix(matrix, ({ x: difx, y: dify }));
                difx = diff.x;
                dify = diff.y;
                deltaHeight = 1;
                difx = snapEnabled ? this.commandHandler.snappingModule.snapLeft(horizontalsnap, verticalsnap, snapLine, difx, dify, shape, endPoint === startPoint, initialBounds) :
                    difx;
                dify = 0;
                deltaWidth = (initialBounds.width - difx) / width;
                break;
            case 'ResizeEast':
                diff = transformPointByMatrix(matrix, ({ x: difx, y: dify }));
                difx = diff.x;
                dify = diff.y;
                difx = snapEnabled ? this.commandHandler.snappingModule.snapRight(horizontalsnap, verticalsnap, snapLine, difx, dify, shape, endPoint === startPoint, initialBounds) :
                    difx;
                dify = 0;
                deltaWidth = (initialBounds.width + difx) / width;
                deltaHeight = 1;
                break;
            case 'ResizeNorth':
                deltaWidth = 1;
                diff = transformPointByMatrix(matrix, ({ x: difx, y: dify }));
                difx = diff.x;
                dify = diff.y;
                dify = snapEnabled ? this.commandHandler.snappingModule.snapTop(horizontalsnap, verticalsnap, snapLine, difx, dify, shape, endPoint === startPoint, initialBounds) :
                    dify;
                deltaHeight = (initialBounds.height - dify) / height;
                break;
            case 'ResizeSouth':
                deltaWidth = 1;
                diff = transformPointByMatrix(matrix, ({ x: difx, y: dify }));
                difx = diff.x;
                dify = diff.y;
                dify = snapEnabled ? this.commandHandler.snappingModule.snapBottom(horizontalsnap, verticalsnap, snapLine, difx, dify, shape, endPoint === startPoint, initialBounds) :
                    dify;
                deltaHeight = (initialBounds.height + dify) / height;
                break;
            case 'ResizeNorthEast':
                diff = transformPointByMatrix(matrix, ({ x: difx, y: dify }));
                difx = diff.x;
                dify = diff.y;
                difx = snapEnabled ? this.commandHandler.snappingModule.snapRight(horizontalsnap, verticalsnap, snapLine, difx, dify, shape, endPoint === startPoint, initialBounds) :
                    difx;
                dify = snapEnabled ? this.commandHandler.snappingModule.snapTop(horizontalsnap, verticalsnap, snapLine, difx, dify, shape, endPoint === startPoint, initialBounds) :
                    dify;
                deltaWidth = (initialBounds.width + difx) / width;
                deltaHeight = (initialBounds.height - dify) / height;
                break;
            case 'ResizeNorthWest':
                diff = transformPointByMatrix(matrix, ({ x: difx, y: dify }));
                difx = diff.x;
                dify = diff.y;
                dify = !snapEnabled ? dify : this.commandHandler.snappingModule.snapTop(horizontalsnap, verticalsnap, snapLine, difx, dify, shape, endPoint === startPoint, initialBounds);
                difx = !snapEnabled ? difx : this.commandHandler.snappingModule.snapLeft(horizontalsnap, verticalsnap, snapLine, difx, dify, shape, endPoint === startPoint, initialBounds);
                deltaWidth = (initialBounds.width - difx) / width;
                deltaHeight = (initialBounds.height - dify) / height;
                break;
            case 'ResizeSouthEast':
                diff = transformPointByMatrix(matrix, ({ x: difx, y: dify }));
                difx = diff.x;
                dify = diff.y;
                dify = !snapEnabled ? dify : this.commandHandler.snappingModule.snapBottom(horizontalsnap, verticalsnap, snapLine, difx, dify, shape, endPoint === startPoint, initialBounds);
                difx = !snapEnabled ? difx : this.commandHandler.snappingModule.snapRight(horizontalsnap, verticalsnap, snapLine, difx, dify, shape, endPoint === startPoint, initialBounds);
                deltaHeight = (initialBounds.height + dify) / height;
                deltaWidth = (initialBounds.width + difx) / width;
                break;
            case 'ResizeSouthWest':
                diff = transformPointByMatrix(matrix, ({ x: difx, y: dify }));
                difx = diff.x;
                dify = diff.y;
                dify = snapEnabled ? this.commandHandler.snappingModule.snapBottom(horizontalsnap, verticalsnap, snapLine, difx, dify, shape, endPoint === startPoint, initialBounds) : dify;
                difx = snapEnabled ? this.commandHandler.snappingModule.snapLeft(horizontalsnap, verticalsnap, snapLine, difx, dify, shape, endPoint === startPoint, initialBounds) : difx;
                deltaWidth = (initialBounds.width - difx) / width;
                deltaHeight = (initialBounds.height + dify) / height;
                break;
        }
        return { width: deltaWidth, height: deltaHeight };
    };
    ToolBase.prototype.getPivot = function (corner) {
        switch (corner) {
            case 'ResizeWest':
                return { x: 1, y: 0.5 };
            case 'ResizeEast':
                return { x: 0, y: 0.5 };
            case 'ResizeNorth':
                return { x: 0.5, y: 1 };
            case 'ResizeSouth':
                return { x: 0.5, y: 0 };
            case 'ResizeNorthEast':
                return { x: 0, y: 1 };
            case 'ResizeNorthWest':
                return { x: 1, y: 1 };
            case 'ResizeSouthEast':
                return { x: 0, y: 0 };
            case 'ResizeSouthWest':
                return { x: 1, y: 0 };
        }
        return { x: 0.5, y: 0.5 };
    };
    return ToolBase;
}());
export { ToolBase };
/**
 * Helps to select the objects
 */
var SelectTool = /** @class */ (function (_super) {
    __extends(SelectTool, _super);
    function SelectTool(commandHandler, protectChange, action) {
        var _this = _super.call(this, commandHandler, true) || this;
        _this.action = action;
        return _this;
    }
    /**   @private  */
    SelectTool.prototype.mouseDown = function (args) {
        this.inAction = true;
        _super.prototype.mouseDown.call(this, args);
    };
    /**   @private  */
    SelectTool.prototype.mouseMove = function (args) {
        _super.prototype.mouseMove.call(this, args);
        //draw selected region
        if (this.inAction && Point.equals(this.currentPosition, this.prevPosition) === false) {
            var rect = Rect.toBounds([this.prevPosition, this.currentPosition]);
            this.commandHandler.clearSelectedItems();
            this.commandHandler.drawSelectionRectangle(rect.x, rect.y, rect.width, rect.height);
        }
        return !this.blocked;
    };
    /**   @private  */
    SelectTool.prototype.mouseUp = function (args) {
        this.checkPropertyValue();
        //rubber band selection
        if (!this.commandHandler.isUserHandle(this.currentPosition)) {
            if (Point.equals(this.currentPosition, this.prevPosition) === false && this.inAction) {
                var region = Rect.toBounds([this.prevPosition, this.currentPosition]);
                this.commandHandler.doRubberBandSelection(region);
            }
            else {
                //single selection
                var arrayNodes = this.commandHandler.getSelectedObject();
                if (!this.commandHandler.hasSelection() || !args.info || !args.info.ctrlKey) {
                    this.commandHandler.clearSelection(args.source === null ? true : false);
                    if (this.action === 'LabelSelect') {
                        this.commandHandler.labelSelect(args.source, args.sourceWrapper);
                    }
                    else if (args.source) {
                        this.commandHandler.selectObjects([args.source], false, arrayNodes);
                    }
                }
                else {
                    //handling multiple selection
                    if (args && args.source) {
                        if (!this.commandHandler.isSelected(args.source)) {
                            this.commandHandler.selectObjects([args.source], true);
                        }
                        else {
                            if (args.clickCount === 1) {
                                this.commandHandler.unSelect(args.source);
                                this.commandHandler.updateBlazorSelector();
                            }
                        }
                    }
                }
            }
        }
        this.inAction = false;
        _super.prototype.mouseUp.call(this, args);
    };
    /**   @private  */
    SelectTool.prototype.mouseLeave = function (args) {
        if (this.inAction) {
            this.mouseUp(args);
        }
    };
    return SelectTool;
}(ToolBase));
export { SelectTool };
/**
 * Helps to edit the selected connectors
 */
var ConnectTool = /** @class */ (function (_super) {
    __extends(ConnectTool, _super);
    function ConnectTool(commandHandler, endPoint) {
        var _this = _super.call(this, commandHandler, true) || this;
        _this.isConnected = false;
        _this.endPoint = endPoint;
        return _this;
    }
    /**   @private  */
    ConnectTool.prototype.mouseDown = function (args) {
        return __awaiter(this, void 0, void 0, function () {
            var selectorModel, connector, arg, trigger, temparg, oldValue, connectors, i, segment, segmentpoint1, segmentpoint2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(isBlazor() && args && args.source)) return [3 /*break*/, 2];
                        selectorModel = args.source;
                        if (!selectorModel.connectors) return [3 /*break*/, 2];
                        connector = selectorModel.connectors[0];
                        this.oldConnector = cloneObject(connector);
                        arg = {
                            connector: cloneBlazorObject(connector),
                            oldValue: { connectorTargetValue: { portId: undefined, nodeId: undefined } },
                            newValue: { connectorTargetValue: { portId: undefined, nodeId: undefined } },
                            cancel: false, state: 'Changing', connectorEnd: this.endPoint
                        };
                        trigger = DiagramEvent.connectionChange;
                        temparg = void 0;
                        return [4 /*yield*/, this.commandHandler.triggerEvent(trigger, arg)];
                    case 1:
                        temparg = (_a.sent()) || arg;
                        this.tempArgs = temparg;
                        if (arg.cancel || (temparg && temparg.cancel)) {
                            this.canCancel = true;
                        }
                        _a.label = 2;
                    case 2:
                        this.inAction = true;
                        this.undoElement = undefined;
                        if (!(this instanceof ConnectorDrawingTool)) {
                            this.undoElement = cloneObject(args.source);
                        }
                        _super.prototype.mouseDown.call(this, args);
                        if (args.source && args.source.connectors) {
                            oldValue = { x: this.prevPosition.x, y: this.prevPosition.y };
                            connectors = args.source.connectors[0];
                            this.oldConnector = cloneObject(connectors);
                        }
                        // Sets the selected segment 
                        if (this.endPoint === 'BezierSourceThumb' || this.endPoint === 'BezierTargetThumb') {
                            for (i = 0; i < connectors.segments.length; i++) {
                                segment = connectors.segments[i];
                                segmentpoint1 = !Point.isEmptyPoint(segment.point1) ? segment.point1 : segment.bezierPoint1;
                                segmentpoint2 = !Point.isEmptyPoint(segment.point2) ? segment.point2 : segment.bezierPoint2;
                                if (contains(this.currentPosition, segmentpoint1, connectors.hitPadding) ||
                                    contains(this.currentPosition, segmentpoint2, connectors.hitPadding)) {
                                    this.selectedSegment = segment;
                                }
                            }
                        }
                        this.currentPosition = args.position;
                        return [2 /*return*/];
                }
            });
        });
    };
    /**   @private  */
    ConnectTool.prototype.mouseUp = function (args) {
        return __awaiter(this, void 0, void 0, function () {
            var trigger, temparg, nodeEndId, portEndId, connector, nodeEndId, portEndId, arg, oldValues, connector, targetPortName, targetNodeNode, target, arg, trigger, obj, entry, obj, entry;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!isBlazor()) return [3 /*break*/, 2];
                        trigger = DiagramEvent.connectionChange;
                        temparg = void 0;
                        if (!(this.tempArgs && this.oldConnector)) return [3 /*break*/, 2];
                        this.tempArgs.state = 'Changed';
                        nodeEndId = this.endPoint === 'ConnectorSourceEnd' ? 'sourceID' : 'targetID';
                        portEndId = this.endPoint === 'ConnectorSourceEnd' ? 'sourcePortID' : 'targetPortID';
                        this.tempArgs.oldValue = this.endPoint === 'ConnectorSourceEnd' ?
                            { connectorSourceValue: { nodeId: this.oldConnector[nodeEndId], portId: this.oldConnector[portEndId] } } :
                            { connectorTargetValue: { nodeId: this.oldConnector[nodeEndId], portId: this.oldConnector[portEndId] } };
                        return [4 /*yield*/, this.commandHandler.triggerEvent(trigger, this.tempArgs)];
                    case 1:
                        temparg = (_a.sent());
                        if (temparg) {
                            this.commandHandler.updateConnectorValue(temparg);
                        }
                        _a.label = 2;
                    case 2:
                        if (!isBlazor() && this.isConnected && args.source.connectors) {
                            connector = args.source.connectors[0];
                            nodeEndId = this.endPoint === 'ConnectorSourceEnd' ? 'sourceID' : 'targetID';
                            portEndId = this.endPoint === 'ConnectorSourceEnd' ? 'sourcePortID' : 'targetPortID';
                            arg = {
                                connector: cloneBlazorObject(connector),
                                oldValue: { nodeId: this.oldConnector[nodeEndId], portId: this.oldConnector[portEndId] },
                                newValue: { nodeId: connector[nodeEndId], portId: connector[portEndId] }, cancel: false,
                                state: 'Changed', connectorEnd: this.endPoint
                            };
                            if (connector[nodeEndId] !== this.oldConnector[nodeEndId]) {
                                this.commandHandler.triggerEvent(DiagramEvent.connectionChange, arg);
                                this.isConnected = false;
                            }
                        }
                        this.checkPropertyValue();
                        this.commandHandler.updateSelector();
                        this.commandHandler.removeSnap();
                        this.commandHandler.changeAnnotationDrag(args);
                        if ((!(this instanceof ConnectorDrawingTool)) && ((this.endPoint === 'ConnectorSourceEnd' &&
                            args.source.connectors.length &&
                            ((!Point.equals(args.source.connectors[0].sourcePoint, this.undoElement.connectors[0].sourcePoint) ||
                                (args.source.connectors[0].sourceID !== this.undoElement.connectors[0].sourceID)))) ||
                            (this.endPoint === 'ConnectorTargetEnd' &&
                                ((!Point.equals(args.source.connectors[0].targetPoint, this.undoElement.connectors[0].targetPoint))
                                    || (args.source.connectors[0].targetID !== this.undoElement.connectors[0].targetID))))) {
                            oldValues = void 0;
                            connector = void 0;
                            if (args.source && args.source.connectors) {
                                oldValues = {
                                    x: this.prevPosition.x, y: this.prevPosition.y
                                };
                                connector = args.source.connectors[0];
                            }
                            targetPortName = void 0;
                            targetNodeNode = void 0;
                            if (args.target) {
                                target = this.commandHandler.findTarget(args.targetWrapper, args.target, this.endPoint === 'ConnectorSourceEnd', true);
                                (target instanceof PointPort) ? targetPortName = target.id : targetNodeNode = target.id;
                            }
                            arg = {
                                connector: connector, state: 'Completed', targetNode: targetNodeNode,
                                oldValue: oldValues, newValue: oldValues, cancel: false, targetPort: targetPortName
                            };
                            if (isBlazor()) {
                                arg = {
                                    connector: cloneBlazorObject(connector), state: 'Completed', targetNode: targetNodeNode,
                                    oldValue: cloneBlazorObject(oldValues), newValue: oldValues, cancel: arg.cancel, targetPort: targetPortName
                                };
                            }
                            trigger = this.endPoint === 'ConnectorSourceEnd' ? DiagramEvent.sourcePointChange : DiagramEvent.targetPointChange;
                            this.commandHandler.triggerEvent(trigger, arg);
                            this.commandHandler.removeTerminalSegment(connector, true);
                            if (this.undoElement && args.source) {
                                obj = void 0;
                                obj = cloneObject(args.source);
                                entry = {
                                    type: 'ConnectionChanged', redoObject: cloneObject(obj), undoObject: cloneObject(this.undoElement),
                                    category: 'Internal'
                                };
                                this.commandHandler.addHistoryEntry(entry);
                            }
                        }
                        else if (!(this instanceof ConnectorDrawingTool) &&
                            (this.endPoint === 'BezierTargetThumb' || this.endPoint === 'BezierSourceThumb')) {
                            if (this.undoElement && args.source) {
                                obj = void 0;
                                obj = cloneObject(args.source);
                                entry = {
                                    type: 'SegmentChanged', redoObject: obj, undoObject: this.undoElement, category: 'Internal'
                                };
                                this.commandHandler.addHistoryEntry(entry);
                            }
                        }
                        this.commandHandler.updateBlazorSelector();
                        this.canCancel = undefined;
                        this.tempArgs = undefined;
                        _super.prototype.mouseUp.call(this, args);
                        return [2 /*return*/];
                }
            });
        });
    };
    /* tslint:disable */
    /**   @private  */
    ConnectTool.prototype.mouseMove = function (args) {
        _super.prototype.mouseMove.call(this, args);
        var tempArgs;
        if ((!(this instanceof ConnectorDrawingTool)) && ((this.endPoint === 'ConnectorSourceEnd' &&
            Point.equals(args.source.connectors[0].sourcePoint, this.undoElement.connectors[0].sourcePoint)) ||
            (this.endPoint === 'ConnectorTargetEnd' &&
                Point.equals(args.source.connectors[0].targetPoint, this.undoElement.connectors[0].targetPoint)))) {
            var oldValue = void 0;
            var connectors = void 0;
            if (args.source && args.source.connectors) {
                oldValue = { x: this.prevPosition.x, y: this.prevPosition.y };
                connectors = args.source.connectors[0];
            }
            var targetPort = void 0;
            var targetNode = void 0;
            if (args.target) {
                targetNode = args.target.id;
                var target = this.commandHandler.findTarget(args.targetWrapper, args.target, this.endPoint === 'ConnectorSourceEnd', true);
                (target instanceof PointPort || target instanceof BpmnSubEvent) ? targetPort = target.id : targetNode = target.id;
            }
            var arg = {
                connector: connectors, state: 'Start', targetNode: targetNode,
                oldValue: oldValue, newValue: oldValue, cancel: false, targetPort: targetPort
            };
            if (isBlazor()) {
                arg = {
                    connector: cloneBlazorObject(connectors), state: 'Start', targetNode: targetNode,
                    oldValue: oldValue, newValue: oldValue, cancel: arg.cancel, targetPort: targetPort
                };
            }
            var trigger = this.endPoint === 'ConnectorSourceEnd' ?
                DiagramEvent.sourcePointChange : DiagramEvent.targetPointChange;
            this.commandHandler.triggerEvent(trigger, arg);
        }
        this.currentPosition = args.position;
        if (this.currentPosition && this.prevPosition) {
            var diffX = this.currentPosition.x - this.prevPosition.x;
            var diffY = this.currentPosition.y - this.prevPosition.y;
            var newValue = void 0;
            var oldValue = void 0;
            var inPort = void 0;
            var outPort = void 0;
            this.currentPosition = this.commandHandler.snapConnectorEnd(this.currentPosition);
            var connector = void 0;
            if (args.source && args.source.connectors) {
                newValue = { x: this.currentPosition.x, y: this.currentPosition.y, };
                oldValue = { x: this.prevPosition.x, y: this.prevPosition.y };
                connector = args.source.connectors[0];
            }
            var targetPortId = void 0;
            var targetNodeId = void 0;
            if (args.target) {
                var target = this.commandHandler.findTarget(args.targetWrapper, args.target, this.endPoint === 'ConnectorSourceEnd', true);
                (target instanceof PointPort) ? targetPortId = target.id : targetNodeId = target.id;
            }
            var arg = {
                connector: connector, state: 'Progress', targetNode: targetNodeId,
                oldValue: oldValue, newValue: newValue, cancel: false, targetPort: targetPortId
            };
            if (isBlazor()) {
                arg = {
                    connector: cloneBlazorObject(connector), state: 'Progress', targetNode: targetNodeId,
                    oldValue: oldValue, newValue: newValue, cancel: arg.cancel, targetPort: targetPortId
                };
            }
            if (!(this instanceof ConnectorDrawingTool)) {
                var trigger = this.endPoint === 'ConnectorSourceEnd' ?
                    DiagramEvent.sourcePointChange : DiagramEvent.targetPointChange;
                this.commandHandler.triggerEvent(trigger, arg);
            }
            if (args.target) {
                inPort = getInOutConnectPorts(args.target, true);
                outPort = getInOutConnectPorts(args.target, false);
            }
            if (!arg.cancel && this.inAction && this.endPoint !== undefined && diffX !== 0 || diffY !== 0) {
                this.blocked = !this.commandHandler.dragConnectorEnds(this.endPoint, args.source, this.currentPosition, this.selectedSegment, args.target, targetPortId);
                this.commandHandler.updateSelector();
                if (args.target && ((this.endPoint === 'ConnectorSourceEnd' && (canOutConnect(args.target) || canPortOutConnect(outPort)))
                    || (this.endPoint === 'ConnectorTargetEnd' && (canInConnect(args.target) || canPortInConnect(inPort))))) {
                    if (this.commandHandler.canDisconnect(this.endPoint, args, targetPortId, targetNodeId)) {
                        tempArgs = this.commandHandler.disConnect(args.source, this.endPoint, this.canCancel);
                        this.isConnected = true;
                    }
                    var target = this.commandHandler.findTarget(args.targetWrapper, args.target, this.endPoint === 'ConnectorSourceEnd', true);
                    if (target instanceof Node) {
                        if ((canInConnect(target) && this.endPoint === 'ConnectorTargetEnd')
                            || (canOutConnect(target) && this.endPoint === 'ConnectorSourceEnd')) {
                            tempArgs = this.commandHandler.connect(this.endPoint, args, this.canCancel);
                            this.isConnected = true;
                        }
                    }
                    else {
                        var isConnect = this.checkConnect(target);
                        if (isConnect) {
                            this.isConnected = true;
                            tempArgs = this.commandHandler.connect(this.endPoint, args, this.canCancel);
                        }
                    }
                }
                else if (this.endPoint.indexOf('Bezier') === -1) {
                    this.isConnected = true;
                    tempArgs = this.commandHandler.disConnect(args.source, this.endPoint, this.canCancel);
                    this.commandHandler.updateSelector();
                }
            }
            if (this.commandHandler.canEnableDefaultTooltip()) {
                var content = this.getTooltipContent(args.position);
                this.commandHandler.showTooltip(args.source, args.position, content, 'ConnectTool', this.isTooltipVisible);
                this.isTooltipVisible = false;
            }
            if (tempArgs) {
                this.tempArgs = tempArgs;
            }
        }
        this.prevPosition = this.currentPosition;
        return !this.blocked;
    };
    /**   @private  */
    ConnectTool.prototype.mouseLeave = function (args) {
        this.mouseUp(args);
    };
    ConnectTool.prototype.getTooltipContent = function (position) {
        return 'X:' + Math.round(position.x) + ' ' + 'Y:' + Math.round(position.y);
    };
    ConnectTool.prototype.checkConnect = function (target) {
        if (canPortInConnect(target) && this.endPoint === 'ConnectorTargetEnd') {
            return true;
        }
        else if (canPortOutConnect(target) && this.endPoint === 'ConnectorSourceEnd') {
            return true;
        }
        else if (!(target.constraints & PortConstraints.None) && !canPortInConnect(target) && !canPortOutConnect(target)) {
            return true;
        }
        return false;
    };
    /**   @private  */
    ConnectTool.prototype.endAction = function () {
        _super.prototype.endAction.call(this);
        this.prevPosition = null;
        this.endPoint = null;
    };
    return ConnectTool;
}(ToolBase));
export { ConnectTool };
/**
 * Drags the selected objects
 */
var MoveTool = /** @class */ (function (_super) {
    __extends(MoveTool, _super);
    function MoveTool(commandHandler, objType) {
        var _this = _super.call(this, commandHandler, true) || this;
        /**   @private  */
        _this.currentTarget = null;
        _this.canCancel = false;
        _this.objectType = objType;
        return _this;
    }
    /**   @private  */
    MoveTool.prototype.mouseDown = function (args) {
        if (args.source instanceof Node || args.source instanceof Connector) {
            var arrayNodes = this.commandHandler.getSelectedObject();
            this.commandHandler.selectObjects([args.source], args.info && args.info.ctrlKey, arrayNodes);
            var selectedObject = { nodes: [], connectors: [] };
            if (args.source instanceof Node) {
                selectedObject.nodes.push(cloneObject(args.source));
            }
            else {
                selectedObject.connectors.push(cloneObject(args.source));
            }
            this.undoElement = cloneObject(selectedObject);
        }
        else {
            this.undoElement = cloneObject(args.source);
        }
        this.undoParentElement = this.commandHandler.getSubProcess(args.source);
        if (this.objectType === 'Port') {
            this.portId = args.sourceWrapper.id;
        }
        var oldValues;
        if (isBlazor()) {
            this.startPosition = this.currentPosition = this.prevPosition = args.position;
            this.initialOffset = { x: 0, y: 0 };
            if (args.source) {
                oldValues = { offsetX: args.source.wrapper.offsetX, offsetY: args.source.wrapper.offsetY };
            }
            var arg = {
                source: cloneObject(args.source), state: 'Start', oldValue: oldValues, newValue: {},
                target: cloneObject(args.target), targetPosition: args.position, allowDrop: true, cancel: false
            };
            this.tempArgs = arg;
        }
        _super.prototype.mouseDown.call(this, args);
        this.initialOffset = { x: 0, y: 0 };
    };
    /* tslint:disable */
    /**   @private  */
    MoveTool.prototype.mouseUp = function (args, isPreventHistory) {
        return __awaiter(this, void 0, void 0, function () {
            var oldValues, newValues, arg, blazorArgs, tx, ty, obj, historyAdded, object, redoObject, wrapper, arg, entry, entry_1, snappedPoint, arg, nodes, isEndGroup, i, entry;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(isBlazor() && this.objectType !== 'Port')) return [3 /*break*/, 2];
                        if (args.source) {
                            newValues = { offsetX: args.source.wrapper.offsetX, offsetY: args.source.wrapper.offsetY };
                            oldValues = { offsetX: args.source.wrapper.offsetX, offsetY: args.source.wrapper.offsetY };
                        }
                        arg = {
                            source: cloneBlazorObject(args.source), state: 'Completed',
                            oldValue: cloneBlazorObject(this.tempArgs.oldValue), newValue: cloneBlazorObject(newValues),
                            target: cloneBlazorObject(this.currentTarget), targetPosition: cloneBlazorObject(this.currentPosition),
                            allowDrop: true, cancel: false
                        };
                        return [4 /*yield*/, this.commandHandler.triggerEvent(DiagramEvent.positionChange, arg)];
                    case 1:
                        blazorArgs = _a.sent();
                        if (blazorArgs && blazorArgs.cancel) {
                            this.canCancel = true;
                        }
                        if (this.canCancel) {
                            tx = this.tempArgs.oldValue.offsetX - args.source.wrapper.offsetX;
                            ty = this.tempArgs.oldValue.offsetY - args.source.wrapper.offsetY;
                            this.commandHandler.dragSelectedObjects(tx, ty);
                        }
                        _a.label = 2;
                    case 2:
                        this.checkPropertyValue();
                        historyAdded = false;
                        redoObject = { nodes: [], connectors: [] };
                        if (!(this.objectType !== 'Port')) return [3 /*break*/, 7];
                        if (args.source instanceof Node || args.source instanceof Connector) {
                            if (args.source instanceof Node) {
                                redoObject.nodes.push(cloneObject(args.source));
                            }
                            else {
                                redoObject.connectors.push(cloneObject(args.source));
                            }
                            obj = cloneObject(redoObject);
                            wrapper = args.source.wrapper;
                            obj.offsetX = wrapper.offsetX;
                            obj.offsetY = wrapper.offsetY;
                        }
                        else {
                            obj = cloneObject(args.source);
                        }
                        object = this.commandHandler.renderContainerHelper(args.source) || args.source || this.commandHandler.renderContainerHelper(args.source);
                        if ((object.id === 'helper' && !obj.nodes[0].isLane && !obj.nodes[0].isPhase)
                            || (object.id !== 'helper')) {
                            if (object.offsetX !== this.undoElement.offsetX || object.offsetY !== this.undoElement.offsetY ||
                                object.sourcePoint !== this.undoElement.sourcePoint
                                || object.targetPoint !== this.undoElement.targetPoint) {
                                if (args.source) {
                                    newValues = { offsetX: args.source.wrapper.offsetX, offsetY: args.source.wrapper.offsetY };
                                    oldValues = { offsetX: args.source.wrapper.offsetX, offsetY: args.source.wrapper.offsetY };
                                }
                                arg = {
                                    source: args.source, state: 'Completed', oldValue: oldValues, newValue: newValues,
                                    target: this.currentTarget, targetPosition: this.currentPosition, allowDrop: true, cancel: false
                                };
                                arg = {
                                    source: cloneBlazorObject(args.source), state: 'Completed',
                                    oldValue: cloneBlazorObject(oldValues), newValue: cloneBlazorObject(newValues),
                                    target: cloneBlazorObject(this.currentTarget), targetPosition: cloneBlazorObject(this.currentPosition),
                                    allowDrop: arg.allowDrop, cancel: arg.cancel
                                };
                                if (isBlazor()) {
                                    arg = this.getBlazorPositionChangeEventArgs(arg, this.currentTarget);
                                }
                                if (!isBlazor()) {
                                    this.commandHandler.triggerEvent(DiagramEvent.positionChange, arg);
                                }
                                if (!isPreventHistory) {
                                    this.commandHandler.startGroupAction();
                                    historyAdded = true;
                                    entry = {
                                        type: 'PositionChanged',
                                        redoObject: cloneObject(obj), undoObject: cloneObject(this.undoElement), category: 'Internal'
                                    };
                                    if (obj.nodes[0] && obj.nodes[0].processId) {
                                        entry_1 = {
                                            type: 'SizeChanged', category: 'Internal',
                                            undoObject: this.undoParentElement, redoObject: this.commandHandler.getSubProcess(args.source)
                                        };
                                        this.commandHandler.addHistoryEntry(entry_1);
                                    }
                                    this.commandHandler.addHistoryEntry(entry);
                                }
                            }
                        }
                        snappedPoint = this.commandHandler.snapPoint(this.prevPosition, this.currentPosition, 0, 0);
                        this.commandHandler.removeSnap();
                        this.commandHandler.removeHighlighter();
                        if (!(args.source && this.currentTarget && canAllowDrop(this.currentTarget) &&
                            this.commandHandler.isDroppable(args.source, this.currentTarget))) return [3 /*break*/, 6];
                        this.commandHandler.drop(this.currentElement, this.currentTarget, this.currentPosition);
                        arg = {
                            element: args.source, target: this.currentTarget, position: this.currentPosition, cancel: false
                        };
                        if (!isBlazor()) return [3 /*break*/, 4];
                        arg = getDropEventArguements(args, arg);
                        return [4 /*yield*/, this.commandHandler.triggerEvent(DiagramEvent.drop, arg)];
                    case 3:
                        arg = (_a.sent()) || arg;
                        return [3 /*break*/, 5];
                    case 4:
                        this.commandHandler.triggerEvent(DiagramEvent.drop, arg);
                        _a.label = 5;
                    case 5:
                        if (!arg.cancel && args.source && this.commandHandler.isParentAsContainer(this.currentTarget)) {
                            nodes = (args.source instanceof Selector) ? args.source.nodes : [args.source];
                            isEndGroup = false;
                            for (i = 0; i < nodes.length; i++) {
                                if (!nodes[i].container) {
                                    isEndGroup = true;
                                    this.commandHandler.dropChildToContainer(this.currentTarget, nodes[i]);
                                    this.commandHandler.renderContainerHelper(nodes[i]);
                                }
                            }
                            if (historyAdded && this.commandHandler.isContainer && isEndGroup) {
                                this.commandHandler.endGroupAction();
                            }
                        }
                        _a.label = 6;
                    case 6:
                        if (args.source && this.currentTarget) {
                            this.commandHandler.dropAnnotation(args.source, this.currentTarget);
                        }
                        this.commandHandler.updateSelector();
                        if (historyAdded && !this.commandHandler.isContainer) {
                            this.commandHandler.endGroupAction();
                        }
                        return [3 /*break*/, 8];
                    case 7:
                        redoObject.nodes.push(cloneObject(args.source));
                        args.portId = this.portId;
                        obj = cloneObject(redoObject);
                        entry = {
                            type: 'PortPositionChanged', objectId: this.portId,
                            redoObject: cloneObject(obj), undoObject: cloneObject(this.undoElement), category: 'Internal'
                        };
                        this.commandHandler.addHistoryEntry(entry);
                        _a.label = 8;
                    case 8:
                        this.commandHandler.updateBlazorSelector();
                        _super.prototype.mouseUp.call(this, args);
                        return [2 /*return*/];
                }
            });
        });
    };
    MoveTool.prototype.getBlazorPositionChangeEventArgs = function (args, target) {
        args = {
            source: cloneBlazorObject(args.source), state: args.state, oldValue: args.oldValue, newValue: args.newValue,
            target: getObjectType(target) === Connector ? { connector: cloneBlazorObject(target) }
                : { node: cloneBlazorObject(target) },
            targetPosition: this.currentPosition, allowDrop: true, cancel: false
        };
        return args;
    };
    /* tslint:disable */
    /**   @private  */
    MoveTool.prototype.mouseMove = function (args) {
        _super.prototype.mouseMove.call(this, args);
        var isSame = false;
        var object;
        object = this.commandHandler.renderContainerHelper(args.source) ||
            args.source;
        if (object instanceof Node || object instanceof Connector) {
            if (object instanceof Node) {
                if (object.offsetX === this.undoElement.nodes[0].offsetX &&
                    object.offsetY === this.undoElement.nodes[0].offsetY) {
                    isSame = true;
                }
            }
            else {
                if (Point.equals(object.sourcePoint, this.undoElement.connectors[0].sourcePoint) &&
                    Point.equals(object.targetPoint, this.undoElement.connectors[0].targetPoint)) {
                    isSame = true;
                }
            }
        }
        else {
            if (object.wrapper.offsetX === this.undoElement.wrapper.offsetX &&
                object.wrapper.offsetY === this.undoElement.wrapper.offsetY) {
                isSame = true;
            }
        }
        var oldValues;
        if (object) {
            oldValues = { offsetX: object.wrapper.offsetX, offsetY: object.wrapper.offsetY };
        }
        var arg = {
            source: object, state: 'Start', oldValue: oldValues, newValue: oldValues,
            target: args.target, targetPosition: args.position, allowDrop: true, cancel: false
        };
        arg = {
            source: cloneBlazorObject(object), state: 'Start', oldValue: cloneBlazorObject(oldValues),
            newValue: cloneBlazorObject(oldValues),
            target: args.target, targetPosition: args.position, allowDrop: arg.allowDrop, cancel: arg.cancel
        };
        if (isSame && !isBlazor()) {
            this.commandHandler.triggerEvent(DiagramEvent.positionChange, arg);
        }
        this.currentPosition = args.position;
        if (this.objectType !== 'Port') {
            var x = this.currentPosition.x - this.prevPosition.x;
            var y = this.currentPosition.y - this.prevPosition.y;
            var diffX = this.initialOffset.x + (this.currentPosition.x - this.prevPosition.x);
            var diffY = this.initialOffset.y + (this.currentPosition.y - this.prevPosition.y);
            this.commandHandler.dragOverElement(args, this.currentPosition);
            this.commandHandler.disConnect(args.source);
            this.commandHandler.removeSnap();
            var oldValues_1;
            var newValues = void 0;
            var snappedPoint = this.commandHandler.snapPoint(this.prevPosition, this.currentPosition, diffX, diffY);
            this.initialOffset.x = diffX - snappedPoint.x;
            this.initialOffset.y = diffY - snappedPoint.y;
            if (object) {
                oldValues_1 = { offsetX: object.wrapper.offsetX, offsetY: object.wrapper.offsetY };
                newValues = {
                    offsetX: object.wrapper.offsetX + snappedPoint.x,
                    offsetY: object.wrapper.offsetY + snappedPoint.y
                };
            }
            if (this.currentTarget && args.target !== this.currentTarget) {
                this.commandHandler.removeChildFromBPmn(args.source, args.target, this.currentTarget);
            }
            this.currentTarget = args.target;
            var arg_1 = {
                source: object, state: 'Progress', oldValue: oldValues_1, newValue: newValues,
                target: args.target, targetPosition: args.position, allowDrop: true, cancel: false
            };
            if (isBlazor()) {
                arg_1 = this.getBlazorPositionChangeEventArgs(arg_1, args.target);
            }
            if (!isBlazor()) {
                this.commandHandler.triggerEvent(DiagramEvent.positionChange, arg_1);
            }
            if (!arg_1.cancel && !this.canCancel) {
                this.blocked = !this.commandHandler.dragSelectedObjects(snappedPoint.x, snappedPoint.y);
                var blocked = !(this.commandHandler.mouseOver(this.currentElement, this.currentTarget, this.currentPosition));
                this.blocked = this.blocked || blocked;
            }
            this.commandHandler.removeStackHighlighter();
            this.commandHandler.renderStackHighlighter(args);
            if (this.currentTarget && (args.source !== this.currentTarget) &&
                this.commandHandler.isDroppable(args.source, this.currentTarget) && args.source.id !== 'helper') {
                var object_1 = (args.source instanceof Selector) ? args.source.nodes[0] : args.source;
                if ((!this.commandHandler.isParentAsContainer(object_1, true))
                    && (object_1.shape.type !== 'SwimLane' && !object_1.shape.isPhase)) {
                    if (this.currentTarget.isLane) {
                        this.commandHandler.renderStackHighlighter(args, this.currentTarget);
                    }
                    else {
                        this.commandHandler.drawHighlighter(this.currentTarget);
                    }
                }
            }
            else {
                this.commandHandler.removeHighlighter();
            }
            if (this.commandHandler.canEnableDefaultTooltip()) {
                var content = this.getTooltipContent(args.source);
                this.commandHandler.showTooltip(args.source, args.position, content, 'MoveTool', this.isTooltipVisible);
                this.isTooltipVisible = false;
            }
        }
        else {
            var matrix = identityMatrix();
            var node = args.source;
            rotateMatrix(matrix, -node.rotateAngle, node.offsetX, node.offsetY);
            var prevPosition = transformPointByMatrix(matrix, { x: this.prevPosition.x, y: this.prevPosition.y });
            var position = transformPointByMatrix(matrix, { x: args.position.x, y: args.position.y });
            this.commandHandler.portDrag(args.source, args.sourceWrapper, position.x - prevPosition.x, position.y - prevPosition.y);
        }
        this.prevPosition = this.currentPosition;
        return !this.blocked;
    };
    MoveTool.prototype.getTooltipContent = function (node) {
        return 'X:' + Math.round(node.wrapper.bounds.x) + ' ' + 'Y:' + Math.round(node.wrapper.bounds.y);
    };
    /**   @private  */
    MoveTool.prototype.mouseLeave = function (args) {
        this.mouseUp(args);
    };
    /**   @private  */
    MoveTool.prototype.endAction = function () {
        _super.prototype.endAction.call(this);
        this.currentTarget = null;
        this.prevPosition = null;
    };
    return MoveTool;
}(ToolBase));
export { MoveTool };
/**
 * Rotates the selected objects
 */
var RotateTool = /** @class */ (function (_super) {
    __extends(RotateTool, _super);
    function RotateTool(commandHandler) {
        return _super.call(this, commandHandler, true) || this;
    }
    /**   @private  */
    RotateTool.prototype.mouseDown = function (args) {
        if (isBlazor()) {
            var object = void 0;
            object = this.commandHandler.renderContainerHelper(args.source) || args.source;
            var oldValue = { rotateAngle: object.wrapper.rotateAngle };
            var arg = {
                source: cloneBlazorObject(args.source), state: 'Start', oldValue: oldValue, newValue: undefined, cancel: false
            };
            var temparg = arg;
            this.tempArgs = temparg;
            if (this.tempArgs && this.tempArgs.cancel) {
                this.canCancel = true;
            }
        }
        this.undoElement = cloneObject(args.source);
        if (this.undoElement.nodes[0] && this.undoElement.nodes[0].children) {
            var objects = [];
            var nodes = this.commandHandler.getAllDescendants(this.undoElement.nodes[0], objects);
            for (var i = 0; i < nodes.length; i++) {
                var node = this.commandHandler.cloneChild(nodes[i].id);
                this.childTable[nodes[i].id] = cloneObject(node);
            }
        }
        _super.prototype.mouseDown.call(this, args);
    };
    /**   @private  */
    RotateTool.prototype.mouseUp = function (args) {
        return __awaiter(this, void 0, void 0, function () {
            var object_2, oldValue, newValue, arg, args1, object, oldValue, arg, obj, entry;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.checkPropertyValue();
                        if (!isBlazor()) return [3 /*break*/, 2];
                        object_2 = this.commandHandler.renderContainerHelper(args.source) || args.source;
                        oldValue = { rotateAngle: this.tempArgs.oldValue.rotateAngle };
                        newValue = { rotateAngle: object_2.wrapper.rotateAngle };
                        arg = {
                            source: cloneBlazorObject(args.source), state: 'Completed', oldValue: oldValue, newValue: newValue, cancel: false
                        };
                        return [4 /*yield*/, this.commandHandler.triggerEvent(DiagramEvent.rotateChange, arg)];
                    case 1:
                        args1 = _a.sent();
                        if (args1 && args1.cancel) {
                            this.canCancel = true;
                        }
                        if (this.canCancel) {
                            this.commandHandler.rotatePropertyChnage(this.tempArgs.oldValue.rotateAngle);
                        }
                        _a.label = 2;
                    case 2:
                        object = this.commandHandler.renderContainerHelper(args.source) || args.source;
                        if (this.undoElement.rotateAngle !== object.wrapper.rotateAngle) {
                            oldValue = { rotateAngle: object.wrapper.rotateAngle };
                            arg = {
                                source: args.source, state: 'Completed', oldValue: oldValue,
                                newValue: oldValue, cancel: false
                            };
                            if (!isBlazor())
                                this.commandHandler.triggerEvent(DiagramEvent.rotateChange, arg);
                            obj = void 0;
                            obj = cloneObject(args.source);
                            entry = {
                                type: 'RotationChanged', redoObject: cloneObject(obj), undoObject: cloneObject(this.undoElement), category: 'Internal',
                                childTable: this.childTable
                            };
                            this.commandHandler.addHistoryEntry(entry);
                            this.commandHandler.updateSelector();
                        }
                        this.commandHandler.updateBlazorSelector();
                        this.canCancel = undefined;
                        this.tempArgs = undefined;
                        _super.prototype.mouseUp.call(this, args);
                        return [2 /*return*/];
                }
            });
        });
    };
    /**   @private  */
    RotateTool.prototype.mouseMove = function (args) {
        _super.prototype.mouseMove.call(this, args);
        var object;
        object = this.commandHandler.renderContainerHelper(args.source) || args.source;
        if (this.undoElement.rotateAngle === object.wrapper.rotateAngle) {
            var oldValue_1 = { rotateAngle: object.wrapper.rotateAngle };
            var arg_2 = {
                source: args.source, state: 'Start', oldValue: oldValue_1, newValue: oldValue_1, cancel: false
            };
            if (!isBlazor()) {
                this.commandHandler.triggerEvent(DiagramEvent.rotateChange, arg_2);
            }
        }
        this.currentPosition = args.position;
        var refPoint = { x: object.wrapper.offsetX, y: object.wrapper.offsetY };
        var angle = Point.findAngle(refPoint, this.currentPosition) + 90;
        var snapAngle = this.commandHandler.snapAngle(angle);
        angle = snapAngle !== 0 ? snapAngle : angle;
        angle = (angle + 360) % 360;
        var oldValue = { rotateAngle: object.wrapper.rotateAngle };
        var newValue = { rotateAngle: angle };
        var arg = {
            source: args.source, state: 'Progress', oldValue: oldValue,
            newValue: newValue, cancel: false
        };
        var arg1 = {
            source: cloneBlazorObject(args.source), state: 'Progress', oldValue: cloneBlazorObject(oldValue),
            newValue: cloneBlazorObject(newValue), cancel: arg.cancel
        };
        if (!isBlazor()) {
            this.commandHandler.triggerEvent(DiagramEvent.rotateChange, arg1);
        }
        if ((!isBlazor() && !arg1.cancel) || (isBlazor() && !this.canCancel)) {
            this.blocked = !(this.commandHandler.rotateSelectedItems(angle - object.wrapper.rotateAngle));
        }
        if (this.commandHandler.canEnableDefaultTooltip()) {
            var content = this.getTooltipContent(args.source);
            this.commandHandler.showTooltip(args.source, args.position, content, 'RotateTool', this.isTooltipVisible);
            this.isTooltipVisible = false;
        }
        return !this.blocked;
    };
    RotateTool.prototype.getTooltipContent = function (node) {
        return Math.round((node.rotateAngle % 360)).toString() + '\xB0';
    };
    /**   @private  */
    RotateTool.prototype.mouseLeave = function (args) {
        this.mouseUp(args);
    };
    /**   @private  */
    RotateTool.prototype.endAction = function () {
        _super.prototype.endAction.call(this);
    };
    return RotateTool;
}(ToolBase));
export { RotateTool };
/**
 * Scales the selected objects
 */
var ResizeTool = /** @class */ (function (_super) {
    __extends(ResizeTool, _super);
    function ResizeTool(commandHandler, corner) {
        var _this = _super.call(this, commandHandler, true) || this;
        /**   @private  */
        _this.initialBounds = new Rect();
        _this.canCancel = false;
        _this.corner = corner;
        return _this;
    }
    /**   @private  */
    ResizeTool.prototype.mouseDown = function (args) {
        var oldValues;
        if (isBlazor()) {
            this.startPosition = this.currentPosition = this.prevPosition = args.position;
            this.currentElement = args.source;
            this.initialBounds.x = args.source.wrapper.offsetX;
            this.initialBounds.y = args.source.wrapper.offsetY;
            this.initialBounds.height = args.source.wrapper.actualSize.height;
            this.initialBounds.width = args.source.wrapper.actualSize.width;
            if (args.source) {
                oldValues = {
                    offsetX: args.source.wrapper.offsetX, offsetY: args.source.wrapper.offsetY,
                    width: args.source.wrapper.actualSize.width, height: args.source.wrapper.actualSize.height
                };
            }
            var arg = {
                source: cloneBlazorObject(args.source), state: 'Start', oldValue: oldValues, newValue: cloneBlazorObject(this.currentElement), cancel: false
            };
            this.tempArgs = arg;
        }
        this.undoElement = cloneObject(args.source);
        this.undoParentElement = this.commandHandler.getSubProcess(args.source);
        _super.prototype.mouseDown.call(this, args);
        if (this.undoElement.nodes[0] && this.undoElement.nodes[0].children) {
            var elements = [];
            var nodes = this.commandHandler.getAllDescendants(this.undoElement.nodes[0], elements);
            for (var i = 0; i < nodes.length; i++) {
                var node = this.commandHandler.cloneChild(nodes[i].id);
                this.childTable[nodes[i].id] = cloneObject(node);
            }
        }
        this.commandHandler.checkSelection(args.source, this.corner);
        _super.prototype.mouseDown.call(this, args);
        this.initialBounds.x = args.source.wrapper.offsetX;
        this.initialBounds.y = args.source.wrapper.offsetY;
        this.initialBounds.height = args.source.wrapper.actualSize.height;
        this.initialBounds.width = args.source.wrapper.actualSize.width;
    };
    /**   @private  */
    ResizeTool.prototype.mouseUp = function (args, isPreventHistory) {
        return __awaiter(this, void 0, void 0, function () {
            var obj, oldValues, arg, blazarArgs, scaleWidth, scaleHeight, object, deltaValues, oldValue, arg, obj, entry, entry_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!isBlazor()) return [3 /*break*/, 3];
                        obj = cloneObject(args.source);
                        oldValues = {
                            width: args.source.wrapper.actualSize.width, height: args.source.wrapper.actualSize.height,
                            offsetX: args.source.wrapper.offsetX, offsetY: args.source.wrapper.offsetY
                        };
                        arg = {
                            oldValue: this.tempArgs.oldValue, newValue: oldValues, cancel: false,
                            source: cloneBlazorObject(args.source), state: 'Completed'
                        };
                        if (!!this.canCancel) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.commandHandler.triggerEvent(DiagramEvent.sizeChange, arg)];
                    case 1:
                        blazarArgs = _a.sent();
                        if (blazarArgs && blazarArgs.cancel) {
                            scaleWidth = this.tempArgs.oldValue.width / obj.wrapper.actualSize.width;
                            scaleHeight = this.tempArgs.oldValue.height / obj.wrapper.actualSize.height;
                            this.commandHandler.scaleSelectedItems(scaleWidth, scaleHeight, this.getPivot(this.corner));
                        }
                        _a.label = 2;
                    case 2:
                        this.tempArgs = undefined;
                        this.canCancel = undefined;
                        _a.label = 3;
                    case 3:
                        this.checkPropertyValue();
                        this.commandHandler.removeSnap();
                        this.commandHandler.updateSelector();
                        object = this.commandHandler.renderContainerHelper(args.source) || args.source;
                        if ((this.undoElement.offsetX !== object.wrapper.offsetX || this.undoElement.offsetY !== object.wrapper.offsetY)) {
                            if (!isBlazor()) {
                                deltaValues = this.updateSize(args.source, this.currentPosition, this.prevPosition, this.corner, this.initialBounds);
                                this.blocked = this.scaleObjects(deltaValues.width, deltaValues.height, this.corner, this.currentPosition, this.prevPosition, object);
                                oldValue = {
                                    offsetX: args.source.wrapper.offsetX, offsetY: args.source.wrapper.offsetY,
                                    width: args.source.wrapper.actualSize.width, height: args.source.wrapper.actualSize.height
                                };
                                arg = {
                                    source: cloneBlazorObject(args.source), state: 'Completed',
                                    oldValue: oldValue, newValue: oldValue, cancel: false
                                };
                                this.commandHandler.triggerEvent(DiagramEvent.sizeChange, arg);
                            }
                            obj = cloneObject(args.source);
                            entry = {
                                type: 'SizeChanged', redoObject: cloneObject(obj), undoObject: cloneObject(this.undoElement), category: 'Internal',
                                childTable: this.childTable
                            };
                            if (!isPreventHistory) {
                                this.commandHandler.startGroupAction();
                                this.commandHandler.addHistoryEntry(entry);
                                if (obj.nodes[0] && obj.nodes[0].processId) {
                                    entry_2 = {
                                        type: 'SizeChanged', redoObject: this.commandHandler.getSubProcess(args.source),
                                        undoObject: this.undoParentElement, category: 'Internal'
                                    };
                                    this.commandHandler.addHistoryEntry(entry_2);
                                }
                                this.commandHandler.endGroupAction();
                            }
                        }
                        this.commandHandler.updateBlazorSelector();
                        _super.prototype.mouseUp.call(this, args);
                        return [2 /*return*/, !this.blocked];
                }
            });
        });
    };
    /**   @private  */
    ResizeTool.prototype.mouseMove = function (args) {
        _super.prototype.mouseMove.call(this, args);
        var object;
        object = this.commandHandler.renderContainerHelper(args.source) || args.source;
        if (this.undoElement.offsetX === object.wrapper.offsetX && this.undoElement.offsetY === object.wrapper.offsetY) {
            var oldValue = {
                offsetX: args.source.wrapper.offsetX, offsetY: args.source.wrapper.offsetY,
                width: args.source.wrapper.actualSize.width, height: args.source.wrapper.actualSize.height
            };
            var arg = {
                source: args.source, state: 'Start', oldValue: oldValue, newValue: this.currentElement, cancel: false
            };
            if (!isBlazor()) {
                this.commandHandler.triggerEvent(DiagramEvent.sizeChange, arg);
            }
        }
        this.currentPosition = args.position;
        var x = this.currentPosition.x - this.startPosition.x;
        var y = this.currentPosition.y - this.startPosition.y;
        var changes = { x: x, y: y };
        changes = rotatePoint(-this.currentElement.wrapper.rotateAngle, undefined, undefined, changes);
        var sx = (this.currentElement.wrapper.actualSize.width + changes.x) / this.currentElement.wrapper.actualSize.width;
        var sy = (this.currentElement.wrapper.actualSize.height + changes.y) / this.currentElement.wrapper.actualSize.height;
        changes = this.getChanges(changes);
        this.commandHandler.removeSnap();
        var deltaValues = this.updateSize(args.source, this.startPosition, this.currentPosition, this.corner, this.initialBounds);
        this.blocked = !(this.scaleObjects(deltaValues.width, deltaValues.height, this.corner, this.startPosition, this.currentPosition, object));
        if (this.commandHandler.canEnableDefaultTooltip()) {
            var content = this.getTooltipContent(args.source);
            this.commandHandler.showTooltip(args.source, args.position, content, 'ResizeTool', this.isTooltipVisible);
            this.isTooltipVisible = false;
        }
        this.prevPosition = this.currentPosition;
        return !this.blocked;
    };
    /**   @private  */
    ResizeTool.prototype.mouseLeave = function (args) {
        this.mouseUp(args);
    };
    ResizeTool.prototype.getTooltipContent = function (node) {
        return 'W:' + Math.round(node.wrapper.bounds.width) + ' ' + 'H:' + Math.round(node.wrapper.bounds.height);
    };
    ResizeTool.prototype.getChanges = function (change) {
        switch (this.corner) {
            case 'ResizeEast':
                return { x: change.x, y: 0 };
            case 'ResizeSouthEast':
                return change;
            case 'ResizeSouth':
                return { x: 0, y: change.y };
            case 'ResizeNorth':
                return { x: 0, y: -change.y };
            case 'ResizeNorthEast':
                return { x: change.x, y: -change.y };
            case 'ResizeNorthWest':
                return { x: -change.x, y: -change.y };
            case 'ResizeWest':
                return { x: -change.x, y: 0 };
            case 'ResizeSouthWest':
                return { x: -change.x, y: change.y };
        }
        return change;
    };
    /**
     * Updates the size with delta width and delta height using scaling.
     */
    /**
     * Aspect ratio used to resize the width or height based on resizing the height or width
     */
    ResizeTool.prototype.scaleObjects = function (deltaWidth, deltaHeight, corner, startPoint, endPoint, source) {
        if (source instanceof Selector && source.nodes.length === 1 && source.nodes[0].constraints & NodeConstraints.AspectRatio) {
            if (corner === 'ResizeWest' || corner === 'ResizeEast' || corner === 'ResizeNorth' || corner === 'ResizeSouth') {
                if (!(deltaHeight === 1 && deltaWidth === 1)) {
                    deltaHeight = deltaWidth = Math.max(deltaHeight === 1 ? 0 : deltaHeight, deltaWidth === 1 ? 0 : deltaWidth);
                }
            }
            else if (startPoint !== endPoint) {
                deltaHeight = deltaWidth = Math.max(deltaHeight, deltaWidth);
            }
            else {
                deltaHeight = deltaWidth = 0;
            }
        }
        var oldValue = {
            offsetX: source.offsetX, offsetY: source.offsetY,
            width: source.width, height: source.height
        };
        this.blocked = this.commandHandler.scaleSelectedItems(deltaWidth, deltaHeight, this.getPivot(this.corner));
        var newValue = {
            offsetX: source.offsetX, offsetY: source.offsetY,
            width: source.width, height: source.height
        };
        var arg;
        arg = { source: source, state: 'Progress', oldValue: oldValue, newValue: newValue, cancel: false };
        var arg1;
        arg1 = {
            source: cloneBlazorObject(source), state: 'Progress',
            oldValue: cloneBlazorObject(oldValue), newValue: cloneBlazorObject(newValue), cancel: arg.cancel
        };
        if (!isBlazor()) {
            this.commandHandler.triggerEvent(DiagramEvent.sizeChange, arg1);
        }
        if (arg1.cancel || this.canCancel) {
            this.commandHandler.scaleSelectedItems(1 / deltaWidth, 1 / deltaHeight, this.getPivot(this.corner));
        }
        return this.blocked;
    };
    return ResizeTool;
}(ToolBase));
export { ResizeTool };
/**
 * Draws a node that is defined by the user
 */
var NodeDrawingTool = /** @class */ (function (_super) {
    __extends(NodeDrawingTool, _super);
    function NodeDrawingTool(commandHandler, sourceObject) {
        var _this = _super.call(this, commandHandler, true) || this;
        _this.sourceObject = sourceObject;
        return _this;
    }
    /**   @private  */
    NodeDrawingTool.prototype.mouseDown = function (args) {
        _super.prototype.mouseDown.call(this, args);
        this.inAction = true;
        this.commandHandler.setFocus();
    };
    /**   @private  */
    NodeDrawingTool.prototype.mouseMove = function (args) {
        _super.prototype.mouseMove.call(this, args);
        var checkBoundaryConstraints;
        var node = {
            offsetX: this.currentPosition.x, width: 3, height: 3,
            offsetY: this.currentPosition.y
        };
        if (!this.drawingObject) {
            this.drawingObject = this.commandHandler.drawObject(node);
        }
        if (this.inAction && Point.equals(this.currentPosition, this.prevPosition) === false) {
            var rect = Rect.toBounds([this.prevPosition, this.currentPosition]);
            checkBoundaryConstraints = this.commandHandler.checkBoundaryConstraints(undefined, undefined, rect);
            if (checkBoundaryConstraints) {
                this.commandHandler.updateNodeDimension(this.drawingObject, rect);
            }
        }
        return checkBoundaryConstraints;
    };
    /**   @private  */
    NodeDrawingTool.prototype.mouseUp = function (args) {
        this.checkPropertyValue();
        var checkBoundaryConstraints;
        var rect = Rect.toBounds([this.prevPosition, this.currentPosition]);
        checkBoundaryConstraints = this.commandHandler.checkBoundaryConstraints(undefined, undefined, rect);
        if (this.drawingObject && this.drawingObject instanceof Node) {
            this.commandHandler.addObjectToDiagram(this.drawingObject);
            this.drawingObject = null;
        }
        this.commandHandler.updateBlazorSelector();
        _super.prototype.mouseUp.call(this, args);
        this.inAction = false;
    };
    /**   @private  */
    NodeDrawingTool.prototype.endAction = function () {
        _super.prototype.endAction.call(this);
    };
    /**   @private  */
    NodeDrawingTool.prototype.mouseLeave = function (args) {
        if (this.inAction) {
            this.mouseUp(args);
        }
    };
    return NodeDrawingTool;
}(ToolBase));
export { NodeDrawingTool };
/**
 * Draws a connector that is defined by the user
 */
var ConnectorDrawingTool = /** @class */ (function (_super) {
    __extends(ConnectorDrawingTool, _super);
    function ConnectorDrawingTool(commandHandler, endPoint, sourceObject) {
        var _this = _super.call(this, commandHandler, endPoint) || this;
        _this.sourceObject = sourceObject;
        return _this;
    }
    /** @private */
    ConnectorDrawingTool.prototype.mouseDown = function (args) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                _super.prototype.mouseDown.call(this, args);
                this.inAction = true;
                this.commandHandler.setFocus();
                return [2 /*return*/];
            });
        });
    };
    /**   @private  */
    ConnectorDrawingTool.prototype.mouseMove = function (args) {
        this.commandHandler.enableServerDataBinding(false);
        if (this.inAction) {
            var connector = {
                sourcePoint: this.currentPosition, targetPoint: this.currentPosition,
            };
            if (!this.drawingObject) {
                this.drawingObject = this.commandHandler.drawObject(connector);
            }
            args.source = this.drawingObject;
            if ((args.target || (args.actualObject && args.sourceWrapper && checkPort(args.actualObject, args.sourceWrapper)))
                && (this.endPoint !== 'ConnectorTargetEnd' || (canInConnect(args.target)))) {
                this.commandHandler.connect(this.endPoint, args);
            }
            this.endPoint = 'ConnectorTargetEnd';
        }
        if (!this.inAction) {
            this.commandHandler.updateSelector();
            if (args.source && args.sourceWrapper) {
                this.commandHandler.renderHighlighter(args, true);
            }
        }
        _super.prototype.mouseMove.call(this, args);
        this.commandHandler.enableServerDataBinding(true);
        return !this.blocked;
    };
    /**   @private  */
    ConnectorDrawingTool.prototype.mouseUp = function (args) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.commandHandler.enableServerDataBinding(false);
                this.checkPropertyValue();
                if (this.drawingObject && this.drawingObject instanceof Connector) {
                    this.commandHandler.addObjectToDiagram(this.drawingObject);
                    this.drawingObject = null;
                }
                this.commandHandler.updateBlazorSelector();
                this.inAction = false;
                this.commandHandler.enableServerDataBinding(true);
                _super.prototype.mouseUp.call(this, args);
                return [2 /*return*/];
            });
        });
    };
    /**   @private  */
    ConnectorDrawingTool.prototype.endAction = function () {
        _super.prototype.endAction.call(this);
    };
    /**   @private  */
    ConnectorDrawingTool.prototype.mouseLeave = function (args) {
        if (this.inAction) {
            this.mouseUp(args);
        }
    };
    return ConnectorDrawingTool;
}(ConnectTool));
export { ConnectorDrawingTool };
var TextDrawingTool = /** @class */ (function (_super) {
    __extends(TextDrawingTool, _super);
    function TextDrawingTool(commandHandler) {
        return _super.call(this, commandHandler, true) || this;
    }
    /**   @private  */
    TextDrawingTool.prototype.mouseDown = function (args) {
        _super.prototype.mouseDown.call(this, args);
        this.commandHandler.clearSelection();
        var node = {
            shape: { type: 'Text' },
            offsetX: this.currentPosition.x,
            offsetY: this.currentPosition.y
        };
        if (!args.source) {
            this.drawingNode = this.commandHandler.drawObject(node);
        }
    };
    /**   @private  */
    TextDrawingTool.prototype.mouseMove = function (args) {
        _super.prototype.mouseMove.call(this, args);
        if (!this.drawingNode) {
            var node = {
                shape: { type: 'Text' }, offsetX: this.currentPosition.x, width: 30, height: 30,
                style: { strokeDashArray: '2 2', fill: 'transparent' }, offsetY: this.currentPosition.y
            };
            this.drawingNode = this.commandHandler.drawObject(node);
        }
        else {
            this.drawingNode.style.strokeColor = 'black';
            this.drawingNode.style.strokeDashArray = '2 2';
            this.drawingNode.style.fill = 'transparent';
        }
        if (this.inAction && Point.equals(this.currentPosition, this.prevPosition) === false) {
            var rect = Rect.toBounds([this.prevPosition, this.currentPosition]);
            this.commandHandler.updateNodeDimension(this.drawingNode, rect);
        }
        return !this.blocked;
    };
    /**   @private  */
    TextDrawingTool.prototype.mouseUp = function (args) {
        this.checkPropertyValue();
        if (this.drawingNode) {
            this.drawingNode.style.strokeColor = 'none';
            this.drawingNode.style.fill = 'none';
        }
        else {
            this.drawingNode = args.source;
        }
        if (this.drawingNode && (this.drawingNode instanceof Node || this.drawingNode instanceof Connector)) {
            this.commandHandler.addText(this.drawingNode, this.currentPosition);
        }
        _super.prototype.mouseUp.call(this, args);
        this.inAction = false;
    };
    /**   @private  */
    TextDrawingTool.prototype.endAction = function () {
        _super.prototype.endAction.call(this);
    };
    return TextDrawingTool;
}(ToolBase));
export { TextDrawingTool };
/**
 * Pans the diagram control on drag
 */
var ZoomPanTool = /** @class */ (function (_super) {
    __extends(ZoomPanTool, _super);
    function ZoomPanTool(commandHandler, zoom) {
        var _this = _super.call(this, commandHandler) || this;
        _this.zooming = zoom;
        return _this;
    }
    /**   @private  */
    ZoomPanTool.prototype.mouseDown = function (args) {
        _super.prototype.mouseDown.call(this, args);
        this.inAction = true;
    };
    /**   @private  */
    ZoomPanTool.prototype.mouseMove = function (args) {
        _super.prototype.mouseMove.call(this, args);
        if (this.inAction) {
            if (!this.zooming && Point.equals(this.currentPosition, this.prevPosition) === false) {
                var difX = this.currentPosition.x - this.prevPosition.x;
                var difY = this.currentPosition.y - this.prevPosition.y;
                this.commandHandler.scroll(difX, difY, this.currentPosition);
            }
            else if (args.moveTouches && args.moveTouches.length && args.moveTouches.length >= 2) {
                var startTouch0 = args.startTouches[0];
                var startTouch1 = args.startTouches[1];
                var moveTouch0 = args.moveTouches[0];
                var moveTouch1 = args.moveTouches[1];
                var scale = this.getDistance(moveTouch0, moveTouch1) / this.getDistance(startTouch0, startTouch1);
                var focusPoint = args.position;
                this.commandHandler.zoom(scale, 0, 0, focusPoint);
                this.updateTouch(startTouch0, moveTouch0);
                this.updateTouch(startTouch1, moveTouch1);
            }
        }
        return !this.blocked;
    };
    /**   @private  */
    ZoomPanTool.prototype.mouseUp = function (args) {
        this.checkPropertyValue();
        _super.prototype.mouseUp.call(this, args);
        this.inAction = false;
    };
    /**   @private  */
    ZoomPanTool.prototype.endAction = function () {
        _super.prototype.endAction.call(this);
    };
    ZoomPanTool.prototype.getDistance = function (touch1, touch2) {
        var x = touch2.pageX - touch1.pageX;
        var y = touch2.pageY - touch1.pageY;
        return Math.sqrt((x * x) + (y * y));
    };
    ZoomPanTool.prototype.updateTouch = function (startTouch, moveTouch) {
        startTouch.pageX = moveTouch.pageX;
        startTouch.pageY = moveTouch.pageY;
    };
    return ZoomPanTool;
}(ToolBase));
export { ZoomPanTool };
/**
 * Animate the layout during expand and collapse
 */
var ExpandTool = /** @class */ (function (_super) {
    __extends(ExpandTool, _super);
    function ExpandTool(commandHandler) {
        return _super.call(this, commandHandler, true) || this;
    }
    /**   @private  */
    ExpandTool.prototype.mouseUp = function (args) {
        this.checkPropertyValue();
        this.commandHandler.initExpand(args);
        _super.prototype.mouseUp.call(this, args);
    };
    return ExpandTool;
}(ToolBase));
export { ExpandTool };
/**
 * Opens the annotation hypeLink at mouse up
 */
var LabelTool = /** @class */ (function (_super) {
    __extends(LabelTool, _super);
    function LabelTool(commandHandler) {
        return _super.call(this, commandHandler, true) || this;
    }
    /**   @private  */
    LabelTool.prototype.mouseUp = function (args) {
        this.checkPropertyValue();
        var win = window.open(args.sourceWrapper.hyperlink.link, '_blank');
        win.focus();
        _super.prototype.mouseUp.call(this, args);
    };
    return LabelTool;
}(ToolBase));
export { LabelTool };
/**
 * Draws a Polygon shape node dynamically using polygon Tool
 */
var PolygonDrawingTool = /** @class */ (function (_super) {
    __extends(PolygonDrawingTool, _super);
    function PolygonDrawingTool(commandHandler) {
        return _super.call(this, commandHandler, true) || this;
    }
    /**   @private  */
    PolygonDrawingTool.prototype.mouseDown = function (args) {
        _super.prototype.mouseDown.call(this, args);
        this.inAction = true;
        if (!this.drawingObject) {
            this.startPoint = { x: this.startPosition.x, y: this.startPosition.y };
            var node = {
                offsetX: this.currentPosition.x,
                offsetY: this.currentPosition.y,
                width: 5, height: 5,
                style: { strokeColor: 'black', strokeWidth: 1 },
                shape: {
                    type: 'Basic',
                    shape: 'Polygon',
                    points: [{ x: this.startPoint.x, y: this.startPoint.y }, { x: this.currentPosition.x, y: this.currentPosition.y }]
                }
            };
            if (isBlazor() && node.shape.type === 'Basic') {
                node.shape.basicShape = 'Polygon';
            }
            this.drawingObject = this.commandHandler.drawObject(node);
        }
        else {
            var pt = void 0;
            var obj = this.drawingObject.shape;
            pt = obj.points[obj.points.length - 1];
            pt = { x: pt.x, y: pt.y };
            this.drawingObject.shape.points.push(pt);
        }
    };
    /**   @private  */
    PolygonDrawingTool.prototype.mouseMove = function (args) {
        _super.prototype.mouseMove.call(this, args);
        if (this.inAction) {
            var obj = this.drawingObject.shape;
            if (this.drawingObject && this.currentPosition) {
                obj.points[obj.points.length - 1].x = this.currentPosition.x;
                obj.points[obj.points.length - 1].y = this.currentPosition.y;
                this.drawingObject.wrapper.children[0].data = getPolygonPath(this.drawingObject.shape.points);
                if (this.inAction && Point.equals(this.currentPosition, this.prevPosition) === false) {
                    var region = Rect.toBounds(this.drawingObject.shape.points);
                    this.commandHandler.updateNodeDimension(this.drawingObject, region);
                }
            }
        }
        return true;
    };
    /**   @private  */
    PolygonDrawingTool.prototype.mouseUp = function (args, dblClickArgs) {
        this.checkPropertyValue();
        _super.prototype.mouseMove.call(this, args);
        if (this.inAction) {
            this.inAction = false;
            if (this.drawingObject) {
                this.commandHandler.addObjectToDiagram(this.drawingObject);
            }
        }
        this.endAction();
    };
    /**   @private  */
    PolygonDrawingTool.prototype.mouseWheel = function (args) {
        _super.prototype.mouseWheel.call(this, args);
        this.mouseMove(args);
    };
    /**   @private  */
    PolygonDrawingTool.prototype.endAction = function () {
        this.inAction = false;
        this.drawingObject = null;
    };
    return PolygonDrawingTool;
}(ToolBase));
export { PolygonDrawingTool };
/**
 * Draws a PolyLine Connector dynamically using PolyLine Drawing Tool
 */
var PolyLineDrawingTool = /** @class */ (function (_super) {
    __extends(PolyLineDrawingTool, _super);
    function PolyLineDrawingTool(commandHandler) {
        return _super.call(this, commandHandler, true) || this;
    }
    /**   @private  */
    PolyLineDrawingTool.prototype.mouseMove = function (args) {
        _super.prototype.mouseMove.call(this, args);
        if (this.inAction) {
            var obj = this.drawingObject;
            obj.targetPoint = this.currentPosition;
            this.commandHandler.updateConnectorPoints(obj);
        }
        return true;
    };
    /**   @private  */
    PolyLineDrawingTool.prototype.mouseDown = function (args) {
        _super.prototype.mouseDown.call(this, args);
        this.inAction = true;
        if (!this.drawingObject) {
            var connector = {
                id: 'Connector',
                type: 'Straight',
                sourcePoint: this.currentPosition,
                targetPoint: this.currentPosition
            };
            this.drawingObject = this.commandHandler.drawObject(connector);
        }
        else {
            var drawObject = this.drawingObject;
            var segment = void 0;
            segment = new StraightSegment(drawObject, 'segments', { type: 'Straight' }, true);
            segment.point = this.currentPosition;
            drawObject.segments[drawObject.segments.length - 1] = segment;
        }
    };
    /**   @private  */
    PolyLineDrawingTool.prototype.mouseWheel = function (args) {
        _super.prototype.mouseWheel.call(this, args);
        this.mouseMove(args);
    };
    /**   @private  */
    PolyLineDrawingTool.prototype.mouseUp = function (args) {
        this.checkPropertyValue();
        _super.prototype.mouseMove.call(this, args);
        if (this.inAction) {
            if (this.drawingObject) {
                var drawObject = this.drawingObject;
                drawObject.segments[drawObject.segments.length - 1].point = { x: 0, y: 0 };
                this.commandHandler.addObjectToDiagram(this.drawingObject);
            }
        }
        this.endAction();
    };
    /**   @private  */
    PolyLineDrawingTool.prototype.endAction = function () {
        this.drawingObject = null;
        this.inAction = false;
    };
    return PolyLineDrawingTool;
}(ToolBase));
export { PolyLineDrawingTool };
var LabelDragTool = /** @class */ (function (_super) {
    __extends(LabelDragTool, _super);
    function LabelDragTool(commandHandler) {
        return _super.call(this, commandHandler, true) || this;
    }
    /**   @private  */
    LabelDragTool.prototype.mouseDown = function (args) {
        this.inAction = true;
        this.undoElement = cloneObject(args.source);
        this.annotationId = args.sourceWrapper.id;
        _super.prototype.mouseDown.call(this, args);
    };
    /**   @private  */
    LabelDragTool.prototype.mouseMove = function (args) {
        _super.prototype.mouseMove.call(this, args);
        var difx = this.currentPosition.x - this.prevPosition.x;
        var dify = this.currentPosition.y - this.prevPosition.y;
        var node = args.source;
        if (node instanceof Node) {
            var matrix = identityMatrix();
            rotateMatrix(matrix, -node.rotateAngle, 0, 0);
            var diff = transformPointByMatrix(matrix, { x: difx, y: dify });
            difx = diff.x;
            dify = diff.y;
        }
        if (this.inAction) {
            this.commandHandler.labelDrag(args.source, args.sourceWrapper, difx, dify);
            this.commandHandler.updateSelector();
        }
        this.prevPosition = this.currentPosition;
        return !this.blocked;
    };
    /**   @private  */
    LabelDragTool.prototype.mouseUp = function (args) {
        this.checkPropertyValue();
        var redoValue = args.source;
        this.inAction = false;
        var entryValue = {
            type: 'AnnotationPropertyChanged',
            objectId: this.annotationId, undoObject: cloneObject(this.undoElement),
            category: 'Internal', redoObject: cloneObject(redoValue)
        };
        this.commandHandler.addHistoryEntry(entryValue);
        _super.prototype.mouseUp.call(this, args);
    };
    /**   @private  */
    LabelDragTool.prototype.mouseLeave = function (args) {
        this.mouseUp(args);
    };
    return LabelDragTool;
}(ToolBase));
export { LabelDragTool };
var LabelResizeTool = /** @class */ (function (_super) {
    __extends(LabelResizeTool, _super);
    function LabelResizeTool(commandHandler, corner) {
        var _this = _super.call(this, commandHandler, true) || this;
        _this.corner = corner;
        return _this;
    }
    /**   @private  */
    LabelResizeTool.prototype.mouseDown = function (args) {
        this.inAction = true;
        var object = (args.source.nodes.length) ?
            args.source.nodes[0] : args.source.connectors[0];
        this.annotationId = args.source.wrapper.children[0].id;
        this.undoElement = cloneObject(object);
        var annotation = args.source.wrapper.children[0];
        this.initialBounds = {
            x: annotation.offsetX,
            y: annotation.offsetY,
            width: annotation.actualSize.width,
            height: annotation.actualSize.height
        };
        _super.prototype.mouseDown.call(this, args);
    };
    /**   @private  */
    LabelResizeTool.prototype.mouseMove = function (args) {
        _super.prototype.mouseMove.call(this, args);
        if (this.inAction) {
            this.resizeObject(args);
        }
        return !this.blocked;
    };
    /**   @private  */
    LabelResizeTool.prototype.mouseUp = function (args) {
        this.checkPropertyValue();
        var redoObject = (args.source.nodes.length) ?
            args.source.nodes[0] : args.source.connectors[0];
        this.inAction = false;
        var entry = {
            type: 'AnnotationPropertyChanged', objectId: this.annotationId,
            redoObject: cloneObject(redoObject), undoObject: cloneObject(this.undoElement), category: 'Internal'
        };
        this.commandHandler.addHistoryEntry(entry);
        _super.prototype.mouseUp.call(this, args);
    };
    /**   @private  */
    LabelResizeTool.prototype.mouseLeave = function (args) {
        this.mouseUp(args);
    };
    /**   @private  */
    LabelResizeTool.prototype.resizeObject = function (args) {
        var object;
        object = (args.source.nodes.length) ? args.source.nodes[0] : args.source.connectors[0];
        var textElement = args.source.wrapper.children[0];
        var deltaWidth;
        var deltaHeight;
        var center = { x: textElement.offsetX, y: textElement.offsetY };
        var rotateAngle = textElement.rotateAngle;
        rotateAngle += (object instanceof Node) ? object.rotateAngle : 0;
        rotateAngle = (rotateAngle + 360) % 360;
        var trans = identityMatrix();
        rotateMatrix(trans, rotateAngle, center.x, center.y);
        var corner = this.corner.slice(5);
        var pivot = this.updateSize(textElement, this.startPosition, this.currentPosition, corner, this.initialBounds, rotateAngle);
        var x = textElement.offsetX - textElement.actualSize.width * textElement.pivot.x;
        var y = textElement.offsetY - textElement.actualSize.height * textElement.pivot.y;
        var pivotPoint = this.getPivot(corner);
        pivotPoint = { x: x + textElement.actualSize.width * pivotPoint.x, y: y + textElement.actualSize.height * pivotPoint.y };
        var point = transformPointByMatrix(trans, pivotPoint);
        pivot.x = point.x;
        pivot.y = point.y;
        deltaWidth = pivot.width;
        deltaHeight = pivot.height;
        deltaWidth = (deltaWidth < 0) ? 1 : deltaWidth;
        deltaHeight = (deltaHeight < 0) ? 1 : deltaHeight;
        this.commandHandler.labelResize(object, args.source.annotation, deltaWidth, deltaHeight, pivot, args.source);
        this.commandHandler.updateSelector();
    };
    return LabelResizeTool;
}(ToolBase));
export { LabelResizeTool };
var LabelRotateTool = /** @class */ (function (_super) {
    __extends(LabelRotateTool, _super);
    function LabelRotateTool(commandHandler) {
        return _super.call(this, commandHandler, true) || this;
    }
    /**   @private  */
    LabelRotateTool.prototype.mouseDown = function (args) {
        this.inAction = true;
        this.annotationId = args.source.wrapper.children[0].id;
        var object = (args.source.nodes.length) ?
            args.source.nodes[0] : args.source.connectors[0];
        this.undoElement = cloneObject(object);
        _super.prototype.mouseDown.call(this, args);
    };
    /**   @private  */
    LabelRotateTool.prototype.mouseMove = function (args) {
        _super.prototype.mouseMove.call(this, args);
        if (args.source) {
            if (this.inAction) {
                var object = args.source.nodes[0] ? args.source.nodes[0] :
                    args.source.connectors[0];
                var annotation = void 0;
                annotation = (args.source.annotation);
                this.commandHandler.labelRotate(object, annotation, this.currentPosition, args.source);
                this.commandHandler.updateSelector();
            }
        }
        this.prevPosition = this.currentPosition;
        return !this.blocked;
    };
    /**   @private  */
    LabelRotateTool.prototype.mouseUp = function (args) {
        this.checkPropertyValue();
        this.inAction = false;
        var redoEntry = (args.source.nodes.length) ?
            args.source.nodes[0] : args.source.connectors[0];
        var entryObject = {
            type: 'AnnotationPropertyChanged', objectId: this.annotationId,
            redoObject: cloneObject(redoEntry),
            undoObject: cloneObject(this.undoElement), category: 'Internal'
        };
        this.commandHandler.addHistoryEntry(entryObject);
        _super.prototype.mouseUp.call(this, args);
    };
    /**   @private  */
    LabelRotateTool.prototype.mouseLeave = function (args) {
        this.mouseUp(args);
    };
    return LabelRotateTool;
}(ToolBase));
export { LabelRotateTool };

import { Node } from './node';
import { DiagramAction } from '../enum/enum';
import { removeItem, getObjectType } from '../utility/diagram-util';
import { cloneObject, getFunction } from '../utility/base-util';
import { findAnnotation, findPort } from '../utility/diagram-util';
import { Size, addChildToContainer } from '../index';
import { swimLaneMeasureAndArrange, laneInterChanged, findLaneIndex, updateSwimLaneObject, pasteSwimLane } from '../utility/swim-lane-util';
import { DiagramEvent } from '../enum/enum';
import { isBlazor } from '@syncfusion/ej2-base';
/**
 * Undo redo function used for revert and restore the changes
 */
var UndoRedo = /** @class */ (function () {
    /**
     * Constructor for the undo redo module
     * @private
     */
    function UndoRedo() {
        this.groupUndo = false;
        this.childTable = [];
        this.historyCount = 0;
        this.hasGroup = false;
        this.groupCount = 0;
        //constructs the undo redo module
    }
    /** @private */
    UndoRedo.prototype.initHistory = function (diagram) {
        diagram.historyManager = {
            canRedo: false, canUndo: false, currentEntry: null,
            push: diagram.addHistoryEntry.bind(diagram), undo: Function, redo: Function,
            startGroupAction: diagram.startGroupAction.bind(diagram), endGroupAction: diagram.endGroupAction.bind(diagram),
            canLog: null, undoStack: [], redoStack: [], stackLimit: diagram.historyManager ? diagram.historyManager.stackLimit : undefined
        };
    };
    /** @private */
    UndoRedo.prototype.addHistoryEntry = function (entry, diagram) {
        var entryObject = null;
        var nextEntry = null;
        if (diagram.historyManager.canLog) {
            var hEntry = diagram.historyManager.canLog(entry);
            if (hEntry.cancel === true) {
                return;
            }
        }
        if (diagram.historyManager && diagram.historyManager.canUndo && diagram.historyManager.currentEntry) {
            entryObject = diagram.historyManager.currentEntry;
            if (entryObject.next) {
                if (entryObject.previous) {
                    nextEntry = entryObject.next;
                    nextEntry.previous = null;
                    entryObject.next = entry;
                    entry.previous = entryObject;
                }
            }
            else {
                entryObject.next = entry;
                entry.previous = entryObject;
            }
        }
        diagram.historyManager.currentEntry = entry;
        if (diagram.historyManager.stackLimit) {
            if (entry.type === 'StartGroup' || entry.type === 'EndGroup') {
                var value = entry.type === 'EndGroup' ? true : false;
                this.setEntryLimit(value);
            }
            if (!this.hasGroup && this.groupCount === 0) {
                if (this.historyCount < diagram.historyManager.stackLimit) {
                    this.historyCount++;
                }
                else {
                    this.applyLimit(diagram.historyManager.currentEntry, diagram.historyManager.stackLimit, diagram);
                }
            }
        }
        this.getHistoryList(diagram);
        diagram.historyManager.canUndo = true;
        diagram.historyManager.canRedo = false;
    };
    /** @private */
    UndoRedo.prototype.applyLimit = function (list, stackLimit, diagram, limitHistory) {
        if (list && list.previous) {
            if (list.type === 'StartGroup' || list.type === 'EndGroup') {
                var value = list.type === 'StartGroup' ? true : false;
                this.setEntryLimit(value);
            }
            if (!this.hasGroup && this.groupCount === 0) {
                stackLimit--;
            }
            if (stackLimit === 0) {
                if (limitHistory) {
                    this.limitHistoryStack(list.previous, diagram);
                }
                if (diagram.historyManager.stackLimit < this.historyCount) {
                    this.historyCount = diagram.historyManager.stackLimit;
                }
                delete list.previous;
            }
            else if (list.previous) {
                this.applyLimit(list.previous, stackLimit, diagram, limitHistory);
            }
        }
        this.groupCount = 0;
    };
    /** @private */
    UndoRedo.prototype.clearHistory = function (diagram) {
        var hList = diagram.historyManager;
        hList.currentEntry = undefined;
        hList.canUndo = false;
        hList.canRedo = false;
        this.historyCount = 0;
        this.groupCount = 0;
        diagram.historyManager.undoStack = [];
        diagram.historyManager.redoStack = [];
    };
    UndoRedo.prototype.setEntryLimit = function (value) {
        value ? this.groupCount-- : this.groupCount++;
        value ? this.hasGroup = !value : this.hasGroup = value;
    };
    UndoRedo.prototype.limitHistoryStack = function (list, diagram) {
        if (list.type !== 'StartGroup' && list.type !== 'EndGroup') {
            this.removeFromStack(diagram.historyManager.undoStack, list);
            this.removeFromStack(diagram.historyManager.redoStack, list);
        }
        if (list.previous) {
            this.limitHistoryStack(list.previous, diagram);
        }
    };
    UndoRedo.prototype.removeFromStack = function (entyList, list) {
        if (entyList.length) {
            for (var i = 0; i <= entyList.length; i++) {
                if (entyList[i].undoObject === list.undoObject && entyList[i].redoObject === list.redoObject) {
                    entyList.splice(i, 1);
                    break;
                }
            }
        }
    };
    /** @private */
    UndoRedo.prototype.undo = function (diagram) {
        var entry = this.getUndoEntry(diagram);
        var endGroupActionCount = 0;
        if (entry) {
            if (entry.category === 'Internal') {
                if (entry.type === 'EndGroup') {
                    endGroupActionCount++;
                    this.groupUndo = true;
                }
                else {
                    this.undoEntry(entry, diagram);
                }
                if (this.groupUndo) {
                    this.undoGroupAction(entry, diagram, endGroupActionCount);
                    this.groupUndo = false;
                }
            }
            else {
                if (!isBlazor()) {
                    diagram.historyManager.undo(entry);
                }
                var arg = {
                    entryType: 'undo', oldValue: entry.undoObject, newValue: entry.redoObject
                };
                if (isBlazor()) {
                    arg = {
                        entryType: 'undo', oldValue: this.getHistoryChangeEvent(entry.undoObject, entry.blazorHistoryEntryType),
                        newValue: this.getHistoryChangeEvent(entry.redoObject, entry.blazorHistoryEntryType)
                    };
                }
                diagram.triggerEvent(DiagramEvent.historyStateChange, arg);
            }
        }
    };
    UndoRedo.prototype.getHistoryChangeEvent = function (object, prop) {
        var value = {};
        switch (prop) {
            case 'Node':
                value.node = object;
                break;
            case 'Connector':
                value.connector = object;
                break;
            case 'Selector':
                value.selector = object;
                break;
            case 'Diagram':
                value.diagram = object;
                break;
            case 'ShapeAnnotation':
                value.shapeAnnotation = object;
                break;
            case 'PathAnnotation':
                value.pathAnnotation = object;
                break;
            case 'PortObject':
                value.pointPortModel = object;
                break;
            case 'Object':
                value.object = object;
        }
        return value;
    };
    UndoRedo.prototype.getHistoryList = function (diagram) {
        var undoStack = [];
        var redoStack = [];
        var currEntry = diagram.historyManager.currentEntry;
        var undoObj;
        var redoObj;
        currEntry = diagram.historyManager.currentEntry;
        if (diagram.historyManager.canUndo || diagram.historyManager.undoStack.length === 0) {
            this.getHistroyObject(undoStack, currEntry);
        }
        else {
            this.getHistroyObject(redoStack, currEntry);
        }
        while (currEntry && currEntry.previous) {
            undoObj = currEntry.previous;
            this.getHistroyObject(undoStack, undoObj);
            currEntry = currEntry.previous;
        }
        currEntry = diagram.historyManager.currentEntry;
        while (currEntry && currEntry.next) {
            redoObj = currEntry.next;
            this.getHistroyObject(redoStack, redoObj);
            currEntry = currEntry.next;
        }
        diagram.historyManager.undoStack = undoStack;
        diagram.historyManager.redoStack = redoStack;
    };
    UndoRedo.prototype.getHistroyObject = function (list, obj) {
        if (obj && obj.type !== 'StartGroup' && obj.type !== 'EndGroup') {
            list.push({
                redoObject: obj.redoObject ? obj.redoObject : null,
                undoObject: obj.undoObject ? obj.undoObject : null,
                type: obj.type ? obj.type : null,
                category: obj.category ? obj.category : null
            });
        }
    };
    UndoRedo.prototype.undoGroupAction = function (entry, diagram, endGroupActionCount) {
        while (endGroupActionCount !== 0) {
            this.undoEntry(entry, diagram);
            entry = this.getUndoEntry(diagram);
            if (entry.type === 'StartGroup') {
                endGroupActionCount--;
            }
            else if (entry.type === 'EndGroup') {
                endGroupActionCount++;
            }
        }
        endGroupActionCount = 0;
    };
    UndoRedo.prototype.undoEntry = function (entry, diagram) {
        var obj;
        var nodeObject;
        if (entry.type !== 'PropertyChanged' && entry.type !== 'CollectionChanged' && entry.type !== 'LabelCollectionChanged') {
            obj = (entry.undoObject);
            nodeObject = (entry.undoObject);
        }
        if (entry.type !== 'StartGroup' && entry.type !== 'EndGroup') {
            if (diagram.historyManager.undoStack.length > 0) {
                var addObject = diagram.historyManager.undoStack.splice(0, 1);
                diagram.historyManager.redoStack.splice(0, 0, addObject[0]);
                nodeObject = (entry.undoObject);
            }
        }
        diagram.protectPropertyChange(true);
        diagram.diagramActions |= DiagramAction.UndoRedo;
        switch (entry.type) {
            case 'PositionChanged':
            case 'Align':
            case 'Distribute':
                this.recordPositionChanged(obj, diagram);
                break;
            case 'SizeChanged':
            case 'Sizing':
                this.recordSizeChanged(obj, diagram, entry);
                break;
            case 'RotationChanged':
                this.recordRotationChanged(obj, diagram, entry);
                break;
            case 'ConnectionChanged':
                this.recordConnectionChanged(obj, diagram);
                break;
            case 'PropertyChanged':
                this.recordPropertyChanged(entry, diagram, false);
                break;
            case 'CollectionChanged':
                entry.isUndo = true;
                this.recordCollectionChanged(entry, diagram);
                entry.isUndo = false;
                break;
            case 'LabelCollectionChanged':
                entry.isUndo = true;
                this.recordLabelCollectionChanged(entry, diagram);
                entry.isUndo = false;
                break;
            case 'PortCollectionChanged':
                entry.isUndo = true;
                this.recordPortCollectionChanged(entry, diagram);
                entry.isUndo = false;
                break;
            case 'Group':
                this.unGroup(entry, diagram);
                break;
            case 'UnGroup':
                this.group(entry, diagram);
                break;
            case 'SegmentChanged':
                this.recordSegmentChanged(obj, diagram);
                break;
            case 'PortPositionChanged':
                this.recordPortChanged(entry, diagram, false);
                break;
            case 'AnnotationPropertyChanged':
                this.recordAnnotationChanged(entry, diagram, false);
                break;
            case 'ChildCollectionChanged':
                this.recordChildCollectionChanged(entry, diagram, false);
                break;
            case 'StackChildPositionChanged':
                this.recordStackPositionChanged(entry, diagram, false);
                break;
            case 'RowHeightChanged':
                this.recordGridSizeChanged(entry, diagram, false, true);
                break;
            case 'ColumnWidthChanged':
                this.recordGridSizeChanged(entry, diagram, false, false);
                break;
            case 'LanePositionChanged':
                this.recordLanePositionChanged(entry, diagram, false);
                break;
            case 'LaneCollectionChanged':
            case 'PhaseCollectionChanged':
                entry.isUndo = true;
                this.recordLaneOrPhaseCollectionChanged(entry, diagram, false);
                entry.isUndo = false;
                break;
            case 'SendToBack':
            case 'SendForward':
            case 'SendBackward':
            case 'BringToFront':
                this.recordOrderCommandChanged(entry, diagram, false);
                break;
        }
        diagram.diagramActions &= ~DiagramAction.UndoRedo;
        diagram.protectPropertyChange(false);
        diagram.historyChangeTrigger(entry, 'Undo');
        if (nodeObject) {
            var object = this.checkNodeObject(nodeObject, diagram);
            if (object) {
                var getnodeDefaults = getFunction(diagram.updateSelection);
                if (getnodeDefaults) {
                    getnodeDefaults(object, diagram);
                }
            }
        }
    };
    UndoRedo.prototype.checkNodeObject = function (value, diagram) {
        var object;
        if (!value.id) {
            if ((value.nodes && value.nodes.length > 0) ||
                (value.connectors && value.connectors.length > 0)) {
                var undoNode = value.nodes.length > 0 ?
                    value.nodes : value.connectors;
                for (var _i = 0, undoNode_1 = undoNode; _i < undoNode_1.length; _i++) {
                    object = undoNode_1[_i];
                    object = diagram.nameTable[object.id];
                }
            }
            else {
                var knownNode = value.nodes ?
                    value.nodes : value.connectors;
                if (knownNode) {
                    for (var _a = 0, _b = Object.keys(knownNode); _a < _b.length; _a++) {
                        var key = _b[_a];
                        var index = Number(key);
                        object = value.nodes ? diagram.nodes[index] : diagram.connectors[index];
                    }
                }
            }
        }
        else {
            object = diagram.nameTable[value.id];
        }
        return object;
    };
    UndoRedo.prototype.group = function (historyEntry, diagram) {
        diagram.add(historyEntry.undoObject);
    };
    UndoRedo.prototype.unGroup = function (entry, diagram) {
        var i = 0;
        entry.redoObject = cloneObject(entry.undoObject);
        var node = entry.undoObject;
        diagram.commandHandler.unGroup(node);
    };
    UndoRedo.prototype.ignoreProperty = function (key) {
        if (key === 'zIndex' || key === 'wrapper') {
            return true;
        }
        return false;
    };
    UndoRedo.prototype.getProperty = function (collection, property) {
        for (var _i = 0, _a = Object.keys(property); _i < _a.length; _i++) {
            var key = _a[_i];
            if (!this.ignoreProperty(key)) {
                if (property[key] instanceof Object) {
                    this.getProperty(collection[key], property[key]);
                }
                else {
                    collection[key] = property[key];
                }
            }
        }
    };
    UndoRedo.prototype.recordLaneOrPhaseCollectionChanged = function (entry, diagram, isRedo) {
        var node = entry.redoObject;
        var obj = entry.undoObject;
        var changeType;
        if (entry.isUndo) {
            if (entry.changeType === 'Insert') {
                changeType = 'Remove';
            }
            else {
                changeType = 'Insert';
            }
        }
        else {
            changeType = entry.changeType;
        }
        if (changeType === 'Remove') {
            diagram.remove(node);
        }
        else {
            if (node.isPhase) {
                var swimlane = diagram.nameTable[node.parentId];
                diagram.addPhases(swimlane, [obj]);
            }
            else {
                var swimlane = diagram.nameTable[node.parentId];
                var laneIndex = findLaneIndex(swimlane, node);
                diagram.addLanes(swimlane, [obj], laneIndex);
            }
        }
        diagram.clearSelection();
    };
    UndoRedo.prototype.recordAnnotationChanged = function (entry, diagram, isRedo) {
        var entryObject = ((isRedo) ? entry.redoObject : entry.undoObject);
        if (diagram.canEnableBlazorObject) {
            var node = cloneObject(diagram.nameTable[entryObject.id]);
            diagram.insertValue(node, node instanceof Node ? true : false);
        }
        var oldElement = findAnnotation(entryObject, entry.objectId);
        var undoChanges = diagram.commandHandler.getAnnotationChanges(diagram.nameTable[entryObject.id], oldElement);
        var currentObject = diagram.nameTable[entryObject.id];
        var currentElement = findAnnotation(currentObject, entry.objectId);
        currentElement.offset = oldElement.offset;
        currentElement.margin = oldElement.margin;
        currentElement.width = oldElement.width;
        currentElement.height = oldElement.height;
        currentElement.rotateAngle = oldElement.rotateAngle;
        currentElement.margin = oldElement.margin;
        if (currentObject instanceof Node) {
            diagram.nodePropertyChange(currentObject, {}, undoChanges);
        }
        else {
            diagram.connectorPropertyChange(currentObject, {}, undoChanges);
        }
    };
    UndoRedo.prototype.recordChildCollectionChanged = function (entry, diagram, isRedo) {
        var entryObject = ((isRedo) ? entry.redoObject : entry.undoObject);
        var parentNode = diagram.nameTable[entryObject.parentId];
        var actualObject = diagram.nameTable[entryObject.id];
        if (parentNode) {
            addChildToContainer(diagram, parentNode, actualObject, !isRedo, entry.historyAction === 'AddNodeToLane');
        }
        else {
            if (actualObject.parentId) {
                parentNode = diagram.nameTable[actualObject.parentId];
                parentNode.children.splice(parentNode.children.indexOf(actualObject.id), 1);
                parentNode.wrapper.children.splice(parentNode.wrapper.children.indexOf(actualObject.wrapper), 1);
            }
            if (entryObject.parentId !== '') {
                parentNode = diagram.nameTable[entryObject.parentId];
                parentNode.children.push(entryObject.id);
                parentNode.wrapper.children.push(actualObject.wrapper);
            }
            actualObject.parentId = entryObject.parentId;
            diagram.removeElements(actualObject);
            diagram.updateDiagramObject(actualObject);
        }
    };
    UndoRedo.prototype.recordStackPositionChanged = function (entry, diagram, isRedo) {
        var entryObject = ((isRedo) ? entry.redoObject : entry.undoObject);
        if (entryObject.source) {
            var parent_1 = diagram.nameTable[entryObject.source.parentId];
            if (parent_1) {
                if (entryObject.target) {
                    parent_1.wrapper.children.splice(entryObject.targetIndex, 1);
                    parent_1.wrapper.children.splice(entryObject.sourceIndex, 0, entryObject.source.wrapper);
                }
                else {
                    if (entryObject.sourceIndex !== undefined) {
                        if (!diagram.nameTable[entryObject.source.id]) {
                            diagram.add(entryObject.source);
                        }
                        parent_1.wrapper.children.splice(entryObject.sourceIndex, 0, diagram.nameTable[entryObject.source.id].wrapper);
                        diagram.nameTable[entryObject.source.id].parentId = parent_1.id;
                    }
                    else {
                        parent_1.wrapper.children.splice(parent_1.wrapper.children.indexOf(diagram.nameTable[entryObject.source.id].wrapper), 1);
                        diagram.nameTable[entryObject.source.id].parentId = '';
                    }
                }
                if (isRedo && parent_1.shape.type === 'UmlClassifier') {
                    diagram.remove(entryObject.source);
                }
                parent_1.wrapper.measure(new Size());
                parent_1.wrapper.arrange(parent_1.wrapper.desiredSize);
                diagram.updateDiagramObject(parent_1);
                diagram.updateSelector();
            }
        }
    };
    UndoRedo.prototype.recordGridSizeChanged = function (entry, diagram, isRedo, isRow) {
        var obj = (isRedo) ? entry.redoObject : entry.undoObject;
        var node = (!isRedo) ? entry.redoObject : entry.undoObject;
        if (obj.parentId) {
            var swimlane = diagram.nameTable[obj.parentId];
            var actualObject = diagram.nameTable[obj.id];
            var x = swimlane.wrapper.bounds.x;
            var y = swimlane.wrapper.bounds.y;
            if (swimlane.shape.type === 'SwimLane') {
                var grid = swimlane.wrapper.children[0];
                var padding = swimlane.shape.padding;
                updateSwimLaneObject(diagram, node, swimlane, obj);
                if (isRow) {
                    grid.updateRowHeight(obj.rowIndex, obj.wrapper.actualSize.height, true, padding);
                    swimlane.height = swimlane.wrapper.height = grid.height;
                }
                else {
                    grid.updateColumnWidth(obj.columnIndex, obj.wrapper.actualSize.width, true, padding);
                    swimlane.width = swimlane.wrapper.width = grid.width;
                    if (obj.isPhase) {
                        actualObject.maxWidth = actualObject.wrapper.maxWidth = obj.wrapper.actualSize.width;
                    }
                }
                swimLaneMeasureAndArrange(swimlane);
                var tx = x - swimlane.wrapper.bounds.x;
                var ty = y - swimlane.wrapper.bounds.y;
                diagram.drag(swimlane, tx, ty);
                diagram.clearSelection();
                diagram.updateDiagramObject(swimlane);
            }
        }
    };
    UndoRedo.prototype.recordLanePositionChanged = function (entry, diagram, isRedo) {
        var entryObject = ((isRedo) ? entry.redoObject : entry.undoObject);
        if (entryObject.source) {
            var parent_2 = diagram.nameTable[entryObject.source.parentId];
            if (parent_2 && parent_2.shape.type === 'SwimLane') {
                laneInterChanged(diagram, entryObject.target, entryObject.source);
                diagram.clearSelection();
            }
        }
    };
    UndoRedo.prototype.recordPortChanged = function (entry, diagram, isRedo) {
        var entryObject = ((isRedo) ? entry.redoObject.nodes[0] :
            entry.undoObject.nodes[0]);
        if (diagram.canEnableBlazorObject) {
            var node = cloneObject(diagram.nameTable[entryObject.id]);
            diagram.insertValue(node, true);
        }
        var oldElement = findPort(entryObject, entry.objectId);
        var undoChanges = diagram.commandHandler.getPortChanges(diagram.nameTable[entryObject.id], oldElement);
        var currentObject = diagram.nameTable[entryObject.id];
        var currentElement = findPort(currentObject, entry.objectId);
        currentElement.offset = oldElement.offset;
        diagram.nodePropertyChange(currentObject, {}, undoChanges);
        if (currentObject.parentId) {
            diagram.updateConnectorEdges(diagram.nameTable[currentObject.parentId]);
        }
    };
    UndoRedo.prototype.recordPropertyChanged = function (entry, diagram, isRedo) {
        var redoObject = entry.redoObject;
        var undoObject = entry.undoObject;
        this.getProperty(diagram, (isRedo ? redoObject : undoObject));
        isRedo ? diagram.onPropertyChanged(redoObject, undoObject) : diagram.onPropertyChanged(undoObject, redoObject);
        diagram.diagramActions = diagram.diagramActions | DiagramAction.UndoRedo;
    };
    UndoRedo.prototype.recordOrderCommandChanged = function (entry, diagram, isRedo) {
        var redoObject = entry.redoObject;
        var undoObject = entry.undoObject;
        diagram.commandHandler.orderCommands(isRedo, (isRedo ? redoObject : undoObject), entry.type);
        diagram.diagramActions = diagram.diagramActions | DiagramAction.UndoRedo;
    };
    UndoRedo.prototype.recordSegmentChanged = function (obj, diagram) {
        var i = 0;
        var node;
        var connector;
        if (obj.connectors && obj.connectors.length > 0) {
            for (i = 0; i < obj.connectors.length; i++) {
                connector = obj.connectors[i];
                this.segmentChanged(connector, diagram);
            }
        }
    };
    UndoRedo.prototype.segmentChanged = function (connector, diagram) {
        var conn = diagram.nameTable[connector.id];
        conn.segments = connector.segments;
        diagram.commandHandler.updateEndPoint(conn);
    };
    UndoRedo.prototype.recordPositionChanged = function (obj, diagram) {
        var i = 0;
        var node;
        var connector;
        if (obj.nodes && obj.nodes.length > 0) {
            for (i = 0; i < obj.nodes.length; i++) {
                node = obj.nodes[i];
                this.positionChanged(node, diagram);
            }
        }
        if (obj.connectors && obj.connectors.length > 0) {
            for (i = 0; i < obj.connectors.length; i++) {
                connector = obj.connectors[i];
                this.connectionChanged(connector, diagram);
            }
        }
    };
    UndoRedo.prototype.positionChanged = function (obj, diagram) {
        var node = diagram.nameTable[obj.id];
        if (obj.processId && !node.processId) {
            diagram.addProcess(obj, obj.processId);
        }
        if (!obj.processId && node.processId) {
            diagram.removeProcess(obj.id);
        }
        if (node.processId) {
            var tx = obj.margin.left - node.margin.left;
            var ty = obj.margin.top - node.margin.top;
            diagram.drag(node, tx, ty);
        }
        else {
            if (node.parentId) {
                var parent_3 = diagram.nameTable[node.parentId];
                if (parent_3.isLane) {
                    obj.wrapper.offsetX = (obj.width / 2) + (parent_3.wrapper.bounds.x + obj.margin.left);
                    obj.wrapper.offsetY = (obj.height / 2) + (parent_3.wrapper.bounds.y + obj.margin.top);
                }
            }
            var tx = obj.wrapper.offsetX - node.offsetX;
            var ty = obj.wrapper.offsetY - node.offsetY;
            diagram.drag(node, tx, ty);
        }
        if (diagram.bpmnModule) {
            diagram.bpmnModule.updateDocks(node, diagram);
        }
    };
    UndoRedo.prototype.recordSizeChanged = function (obj, diagram, entry) {
        var i = 0;
        var connector;
        var node;
        if (obj && obj.nodes && obj.nodes.length > 0) {
            for (i = 0; i < obj.nodes.length; i++) {
                node = obj.nodes[i];
                if (node.children && !node.container) {
                    var elements = [];
                    var nodes = diagram.commandHandler.getAllDescendants(node, elements);
                    for (var i_1 = 0; i_1 < nodes.length; i_1++) {
                        var tempNode = entry.childTable[nodes[i_1].id];
                        if ((getObjectType(tempNode) === Node)) {
                            this.sizeChanged(tempNode, diagram, entry);
                            this.positionChanged(tempNode, diagram);
                        }
                        else {
                            this.connectionChanged(tempNode, diagram, entry);
                        }
                    }
                }
                else {
                    this.sizeChanged(node, diagram);
                    this.positionChanged(node, diagram);
                }
            }
        }
        if (obj && obj.connectors && obj.connectors.length > 0) {
            var connectors = obj.connectors;
            for (i = 0; i < connectors.length; i++) {
                connector = connectors[i];
                this.connectionChanged(connector, diagram);
            }
        }
    };
    UndoRedo.prototype.sizeChanged = function (obj, diagram, entry) {
        var node = diagram.nameTable[obj.id];
        var scaleWidth = obj.wrapper.actualSize.width / node.wrapper.actualSize.width;
        var scaleHeight = obj.wrapper.actualSize.height / node.wrapper.actualSize.height;
        if (entry && entry.childTable) {
            entry.childTable[obj.id] = cloneObject(node);
        }
        diagram.scale(node, scaleWidth, scaleHeight, {
            x: obj.wrapper.offsetX / node.wrapper.offsetX,
            y: obj.wrapper.offsetY / node.wrapper.offsetY
        });
    };
    UndoRedo.prototype.recordRotationChanged = function (obj, diagram, entry) {
        var i = 0;
        var node;
        var connector;
        var selectorObj = diagram.selectedItems;
        selectorObj.rotateAngle = obj.rotateAngle;
        if (selectorObj && selectorObj.wrapper) {
            selectorObj.wrapper.rotateAngle = obj.rotateAngle;
        }
        if (obj && obj.nodes && obj.nodes.length > 0) {
            for (i = 0; i < obj.nodes.length; i++) {
                node = obj.nodes[i];
                this.rotationChanged(node, diagram);
                this.positionChanged(node, diagram);
            }
        }
        if (obj && obj.connectors && obj.connectors.length > 0) {
            for (i = 0; i < obj.connectors.length; i++) {
                connector = obj.connectors[i];
                this.connectionChanged(connector, diagram);
            }
        }
    };
    UndoRedo.prototype.rotationChanged = function (obj, diagram) {
        var node = diagram.nameTable[obj.id];
        diagram.rotate(node, obj.rotateAngle - node.rotateAngle);
    };
    UndoRedo.prototype.recordConnectionChanged = function (obj, diagram) {
        var connector = obj.connectors[0];
        this.connectionChanged(connector, diagram);
    };
    UndoRedo.prototype.connectionChanged = function (obj, diagram, entry) {
        var connector = diagram.nameTable[obj.id];
        var node;
        if (obj.sourcePortID !== connector.sourcePortID) {
            diagram.removePortEdges(diagram.nameTable[connector.sourceID], connector.sourcePortID, connector.id, false);
            connector.sourcePortID = obj.sourcePortID;
            diagram.connectorPropertyChange(connector, {}, { sourcePortID: obj.sourcePortID });
        }
        if (obj.targetPortID !== connector.targetPortID) {
            diagram.removePortEdges(diagram.nameTable[connector.targetID], connector.targetPortID, connector.id, true);
            connector.targetPortID = obj.targetPortID;
            diagram.connectorPropertyChange(connector, {}, { targetPortID: obj.targetPortID });
        }
        if (obj.sourceID !== connector.sourceID) {
            if (obj.sourceID === '') {
                node = diagram.nameTable[connector.sourceID];
                removeItem(node.outEdges, obj.id);
            }
            else {
                node = diagram.nameTable[obj.sourceID];
                node.outEdges.push(obj.id);
                diagram.updatePortEdges(node, obj, false);
            }
            connector.sourceID = obj.sourceID;
            diagram.connectorPropertyChange(connector, {}, { sourceID: obj.sourceID });
        }
        if (obj.targetID !== connector.targetID) {
            if (obj.targetID === '') {
                node = diagram.nameTable[connector.targetID];
                removeItem(node.inEdges, obj.id);
            }
            else {
                node = diagram.nameTable[obj.targetID];
                node.inEdges.push(obj.id);
                diagram.updatePortEdges(node, obj, true);
            }
            connector.targetID = obj.targetID;
            diagram.connectorPropertyChange(connector, {}, { targetID: obj.targetID });
        }
        if (entry && entry.childTable) {
            entry.childTable[obj.id] = cloneObject(connector);
        }
        var sx = obj.sourcePoint.x - connector.sourcePoint.x;
        var sy = obj.sourcePoint.y - connector.sourcePoint.y;
        if (sx !== 0 || sy !== 0) {
            diagram.dragSourceEnd(connector, sx, sy);
        }
        var tx = obj.targetPoint.x - connector.targetPoint.x;
        var ty = obj.targetPoint.y - connector.targetPoint.y;
        if (tx !== 0 || ty !== 0) {
            diagram.dragTargetEnd(connector, tx, ty);
        }
        diagram.updateSelector();
        if (diagram.mode !== 'SVG') {
            diagram.refreshDiagramLayer();
        }
    };
    UndoRedo.prototype.recordCollectionChanged = function (entry, diagram) {
        var obj = entry.undoObject;
        if (entry && entry.changeType) {
            var changeType = void 0;
            if (entry.isUndo) {
                if (entry.changeType === 'Insert') {
                    changeType = 'Remove';
                }
                else {
                    changeType = 'Insert';
                }
            }
            else {
                changeType = entry.changeType;
            }
            if (changeType === 'Remove') {
                if (obj.nodeId) {
                    diagram.remove(diagram.nameTable[obj.nodeId + '_textannotation_' + obj.id]);
                }
                else {
                    diagram.remove(obj);
                    diagram.clearSelectorLayer();
                }
            }
            else {
                diagram.clearSelectorLayer();
                if (obj.parentId) {
                    var parentNode = diagram.nameTable[obj.parentId];
                    if (parentNode) {
                        diagram.addChild(parentNode, obj);
                    }
                    else {
                        diagram.add(obj);
                    }
                }
                else if (obj.nodeId) {
                    diagram.addTextAnnotation(obj, diagram.nameTable[obj.nodeId]);
                }
                else {
                    if (!diagram.nameTable[obj.id]) {
                        if (obj && obj.shape && obj.shape.type === 'SwimLane' && entry.isUndo) {
                            pasteSwimLane(obj, undefined, undefined, undefined, undefined, true);
                        }
                        diagram.add(obj);
                    }
                }
                if (obj.processId && diagram.nameTable[obj.processId]) {
                    diagram.addProcess(obj, obj.processId);
                }
            }
            if (diagram.mode !== 'SVG') {
                diagram.refreshDiagramLayer();
            }
        }
    };
    UndoRedo.prototype.recordLabelCollectionChanged = function (entry, diagram) {
        var label = entry.undoObject;
        var obj = entry.redoObject;
        var node = diagram.nameTable[obj.id];
        if (entry && entry.changeType) {
            var changeType = void 0;
            if (entry.isUndo) {
                changeType = (entry.changeType === 'Insert') ? 'Remove' : 'Insert';
            }
            else {
                changeType = entry.changeType;
            }
            if (changeType === 'Remove') {
                diagram.removeLabels(node, [label]);
                diagram.clearSelectorLayer();
            }
            else {
                diagram.clearSelectorLayer();
                diagram.addLabels(node, [label]);
            }
            if (diagram.mode !== 'SVG') {
                diagram.refreshDiagramLayer();
            }
        }
    };
    UndoRedo.prototype.recordPortCollectionChanged = function (entry, diagram) {
        var port = entry.undoObject;
        var obj = entry.redoObject;
        var node = diagram.nameTable[obj.id];
        if (entry && entry.changeType) {
            var changeType = void 0;
            if (entry.isUndo) {
                changeType = (entry.changeType === 'Insert') ? 'Remove' : 'Insert';
            }
            else {
                changeType = entry.changeType;
            }
            if (changeType === 'Remove') {
                diagram.removePorts(node, [port]);
                diagram.clearSelectorLayer();
            }
            else {
                diagram.clearSelectorLayer();
                diagram.addPorts(node, [port]);
            }
            if (diagram.mode !== 'SVG') {
                diagram.refreshDiagramLayer();
            }
        }
    };
    /** @private */
    UndoRedo.prototype.redo = function (diagram) {
        var entry = this.getRedoEntry(diagram);
        var startGroupActionCount = 0;
        if (entry) {
            if (entry.category === 'Internal') {
                if (entry.type === 'StartGroup') {
                    startGroupActionCount++;
                    this.groupUndo = true;
                }
                else {
                    this.redoEntry(entry, diagram);
                }
                if (this.groupUndo) {
                    this.redoGroupAction(entry, diagram, startGroupActionCount);
                    this.groupUndo = false;
                }
            }
            else {
                if (!isBlazor()) {
                    diagram.historyManager.redo(entry);
                }
                var arg = {
                    entryType: 'redo', oldValue: entry.redoObject, newValue: entry.undoObject
                };
                if (isBlazor()) {
                    arg = {
                        entryType: 'undo', oldValue: this.getHistoryChangeEvent(entry.redoObject, entry.blazorHistoryEntryType),
                        newValue: this.getHistoryChangeEvent(entry.undoObject, entry.blazorHistoryEntryType)
                    };
                }
                diagram.triggerEvent(DiagramEvent.historyStateChange, arg);
            }
        }
    };
    UndoRedo.prototype.redoGroupAction = function (entry, diagram, startGroupActionCount) {
        while (startGroupActionCount !== 0) {
            this.redoEntry(entry, diagram);
            entry = this.getRedoEntry(diagram);
            if (entry.type === 'EndGroup') {
                startGroupActionCount--;
            }
            else if (entry.type === 'StartGroup') {
                startGroupActionCount++;
            }
        }
        startGroupActionCount = 0;
    };
    UndoRedo.prototype.redoEntry = function (historyEntry, diagram) {
        var redoObject;
        var redovalue;
        if (historyEntry.type !== 'PropertyChanged' && historyEntry.type !== 'CollectionChanged') {
            redoObject = (historyEntry.redoObject);
            redovalue = (historyEntry.redoObject);
        }
        diagram.diagramActions |= DiagramAction.UndoRedo;
        if (historyEntry.type !== 'StartGroup' && historyEntry.type !== 'EndGroup') {
            if (diagram.historyManager.redoStack.length > 0) {
                var addObject = diagram.historyManager.redoStack.splice(0, 1);
                diagram.historyManager.undoStack.splice(0, 0, addObject[0]);
                redovalue = (historyEntry.redoObject);
            }
        }
        diagram.protectPropertyChange(true);
        switch (historyEntry.type) {
            case 'PositionChanged':
            case 'Align':
            case 'Distribute':
                this.recordPositionChanged(redoObject, diagram);
                break;
            case 'SizeChanged':
            case 'Sizing':
                this.recordSizeChanged(redoObject, diagram, historyEntry);
                break;
            case 'RotationChanged':
                this.recordRotationChanged(redoObject, diagram, historyEntry);
                break;
            case 'ConnectionChanged':
                this.recordConnectionChanged(redoObject, diagram);
                break;
            case 'PropertyChanged':
                this.recordPropertyChanged(historyEntry, diagram, true);
                break;
            case 'CollectionChanged':
                this.recordCollectionChanged(historyEntry, diagram);
                break;
            case 'LabelCollectionChanged':
                this.recordLabelCollectionChanged(historyEntry, diagram);
                break;
            case 'PortCollectionChanged':
                this.recordPortCollectionChanged(historyEntry, diagram);
                break;
            case 'Group':
                this.group(historyEntry, diagram);
                break;
            case 'UnGroup':
                this.unGroup(historyEntry, diagram);
                break;
            case 'SegmentChanged':
                this.recordSegmentChanged(redoObject, diagram);
                break;
            case 'PortPositionChanged':
                this.recordPortChanged(historyEntry, diagram, true);
                break;
            case 'AnnotationPropertyChanged':
                this.recordAnnotationChanged(historyEntry, diagram, true);
                break;
            case 'ChildCollectionChanged':
                this.recordChildCollectionChanged(historyEntry, diagram, true);
                break;
            case 'StackChildPositionChanged':
                this.recordStackPositionChanged(historyEntry, diagram, true);
                break;
            case 'RowHeightChanged':
                this.recordGridSizeChanged(historyEntry, diagram, true, true);
                break;
            case 'ColumnWidthChanged':
                this.recordGridSizeChanged(historyEntry, diagram, true, false);
                break;
            case 'LanePositionChanged':
                this.recordLanePositionChanged(historyEntry, diagram, true);
                break;
            case 'LaneCollectionChanged':
            case 'PhaseCollectionChanged':
                this.recordLaneOrPhaseCollectionChanged(historyEntry, diagram, true);
                break;
            case 'SendToBack':
            case 'SendForward':
            case 'SendBackward':
            case 'BringToFront':
                this.recordOrderCommandChanged(historyEntry, diagram, true);
                break;
        }
        diagram.protectPropertyChange(false);
        diagram.diagramActions &= ~DiagramAction.UndoRedo;
        diagram.historyChangeTrigger(historyEntry, 'Redo');
        if (redovalue) {
            var value = this.checkNodeObject(redovalue, diagram);
            if (value) {
                var getnodeDefaults = getFunction(diagram.updateSelection);
                if (getnodeDefaults) {
                    getnodeDefaults(value, diagram);
                }
            }
        }
    };
    UndoRedo.prototype.getUndoEntry = function (diagram) {
        var undoEntry = null;
        var currentObject;
        var hList = diagram.historyManager;
        if (hList.canUndo) {
            undoEntry = hList.currentEntry;
            currentObject = hList.currentEntry.previous;
            if (currentObject) {
                hList.currentEntry = currentObject;
                if (!hList.canRedo) {
                    hList.canRedo = true;
                }
            }
            else {
                hList.canRedo = true;
                hList.canUndo = false;
            }
        }
        return undoEntry;
    };
    UndoRedo.prototype.getRedoEntry = function (diagram) {
        var redoEntry = null;
        var entryCurrent;
        var hList = diagram.historyManager;
        if (hList.canRedo) {
            if (!hList.currentEntry.previous && !hList.canUndo) {
                entryCurrent = hList.currentEntry;
            }
            else {
                entryCurrent = hList.currentEntry.next;
            }
            if (entryCurrent) {
                hList.currentEntry = entryCurrent;
                if (!hList.canUndo) {
                    hList.canUndo = true;
                }
                if (!entryCurrent.next) {
                    hList.canRedo = false;
                    hList.canUndo = true;
                }
            }
            redoEntry = hList.currentEntry;
        }
        return redoEntry;
    };
    /**
     * To destroy the undo redo module
     * @return {void}
     * @private
     */
    UndoRedo.prototype.destroy = function () {
        /**
         * Destroys the undo redo module
         */
    };
    /**
     * Get module name.
     */
    UndoRedo.prototype.getModuleName = function () {
        /**
         * Returns the module name
         */
        return 'UndoRedo';
    };
    return UndoRedo;
}());
export { UndoRedo };

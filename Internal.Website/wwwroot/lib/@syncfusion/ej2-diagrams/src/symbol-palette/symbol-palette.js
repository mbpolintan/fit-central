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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component, Property, Complex, CollectionFactory, ChildProperty, Event } from '@syncfusion/ej2-base';
import { isBlazor } from '@syncfusion/ej2-base';
import { Browser, EventHandler, Draggable, Collection } from '@syncfusion/ej2-base';
import { remove } from '@syncfusion/ej2-base';
import { Accordion } from '@syncfusion/ej2-navigations';
import { Node, Connector, Shape, Size } from '../diagram/index';
import { Transform } from '../diagram/index';
import { DiagramRenderer, StackPanel, Margin } from '../diagram/index';
import { TextElement, Canvas } from '../diagram/index';
import { SvgRenderer } from '../diagram/rendering/svg-renderer';
import { parentsUntil, createSvgElement, createHtmlElement, createMeasureElements } from '../diagram/utility/dom-util';
import { removeElementsByClass, applyStyleAgainstCsp } from '../diagram/utility/dom-util';
import { scaleElement, arrangeChild, groupHasType, setUMLActivityDefaults, updateDefaultValues } from '../diagram/utility/diagram-util';
import { getFunction, randomId, cloneObject } from '../diagram/utility/base-util';
import { getOuterBounds } from '../diagram/utility/connector';
import { Point } from '../diagram/primitives/point';
import { CanvasRenderer } from '../diagram/rendering/canvas-renderer';
var getObjectType = function (obj) {
    var conn = obj;
    if (conn.sourcePoint || conn.targetPoint || conn.sourceID || conn.targetID
        || conn.sourcePortID || conn.targetPortID || conn.sourceDecorator || conn.targetDecorator) {
        return Connector;
    }
    if (obj.shape && (obj.shape instanceof Shape || obj.shape.type)) {
        return Node;
    }
    return Node;
};
/**
 * A palette allows to display a group of related symbols and it textually annotates the group with its header.
 */
var Palette = /** @class */ (function (_super) {
    __extends(Palette, _super);
    // tslint:disable-next-line:no-any
    function Palette(parent, propName, defaultValue, isArray) {
        return _super.call(this, parent, propName, defaultValue, isArray) || this;
    }
    __decorate([
        Property('')
    ], Palette.prototype, "id", void 0);
    __decorate([
        Property()
    ], Palette.prototype, "height", void 0);
    __decorate([
        Property(true)
    ], Palette.prototype, "expanded", void 0);
    __decorate([
        Property('')
    ], Palette.prototype, "iconCss", void 0);
    __decorate([
        Property('')
    ], Palette.prototype, "title", void 0);
    __decorate([
        CollectionFactory(getObjectType)
    ], Palette.prototype, "symbols", void 0);
    return Palette;
}(ChildProperty));
export { Palette };
/**
 * customize the drag size of the individual palette items.
 */
var SymbolDragSize = /** @class */ (function (_super) {
    __extends(SymbolDragSize, _super);
    function SymbolDragSize() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Property()
    ], SymbolDragSize.prototype, "width", void 0);
    __decorate([
        Property()
    ], SymbolDragSize.prototype, "height", void 0);
    return SymbolDragSize;
}(ChildProperty));
export { SymbolDragSize };
/**
 * customize the preview size and position of the individual palette items.
 */
var SymbolPreview = /** @class */ (function (_super) {
    __extends(SymbolPreview, _super);
    function SymbolPreview() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    __decorate([
        Property()
    ], SymbolPreview.prototype, "width", void 0);
    __decorate([
        Property()
    ], SymbolPreview.prototype, "height", void 0);
    __decorate([
        Complex({}, Point)
    ], SymbolPreview.prototype, "offset", void 0);
    return SymbolPreview;
}(ChildProperty));
export { SymbolPreview };
/**
 * Represents the Symbol Palette Component.
 * ```html
 * <div id="symbolpalette"></div>
 * <script>
 *  var palette = new SymbolPalatte({ allowDrag:true });
 *  palette.appendTo("#symbolpalette");
 * </script>
 * ```
 */
/**
 * The symbol palette control allows to predefine the frequently used nodes and connectors
 * and to drag and drop those nodes/connectors to drawing area
 */
var SymbolPalette = /** @class */ (function (_super) {
    __extends(SymbolPalette, _super);
    //region - protected methods 
    /**
     * Constructor for creating the component
     * @hidden
     */
    function SymbolPalette(options, element) {
        var _this = _super.call(this, options, element) || this;
        /**   @private  */
        _this.symbolTable = {};
        /**   @private  */
        _this.childTable = {};
        _this.info = 'info';
        _this.oldObject = null;
        _this.laneTable = {};
        _this.isExpand = false;
        _this.isExpandMode = false;
        _this.isMethod = false;
        _this.paletteid = 88123;
        _this.checkOnRender = false;
        /**
         * helper method for draggable
         * @return {void}
         * @private
         */
        _this.helper = function (e) {
            var clonedElement;
            var id = (_this.selectedSymbol && _this.selectedSymbol.id) || e.sender.target.id.split('_container')[0];
            var symbol = _this.symbolTable[id];
            if (symbol && _this.selectedSymbol) {
                _this.selectedSymbols = _this.selectedSymbol.id === symbol.id ? symbol : _this.selectedSymbol;
                var position = _this.getMousePosition(e.sender);
                clonedElement = _this.getSymbolPreview(_this.selectedSymbols, e.sender, _this.element);
                clonedElement.setAttribute('paletteId', _this.element.id);
            }
            return clonedElement;
        };
        var child;
        var node;
        for (var i = 0; _this && _this.palettes && i < _this.palettes.length; i++) {
            for (var j = 0; j < _this.palettes[i].symbols.length; j++) {
                child = _this.palettes[i].symbols[j];
                node = options.palettes[i].symbols[j];
                if (child && child.shape.type === 'UmlActivity') {
                    setUMLActivityDefaults(node, child);
                }
                if (_this.nodeDefaults || _this.connectorDefaults) {
                    updateDefaultValues(child, node, child instanceof Node ? _this.nodeDefaults : _this.connectorDefaults);
                }
            }
        }
        return _this;
    }
    /**
     * Refreshes the panel when the symbol palette properties are updated
     * @param {SymbolPaletteModel} newProp - Defines the new values of the changed properties
     * @param {SymbolPaletteModel} oldProp - Defines the old values of the changed properties
     */
    SymbolPalette.prototype.onPropertyChanged = function (newProp, oldProp) {
        var refresh = false;
        for (var _i = 0, _a = Object.keys(newProp); _i < _a.length; _i++) {
            var prop = _a[_i];
            switch (prop) {
                case 'width':
                    this.element.style.width = this.width.toString();
                    break;
                case 'height':
                    this.element.style.height = this.height.toString();
                    break;
                case 'symbolPreview':
                    break;
                case 'symbolWidth':
                case 'symbolHeight':
                case 'getSymbolInfo':
                    refresh = true;
                    break;
                case 'enableSearch':
                    if (newProp.enableSearch) {
                        this.createTextbox();
                    }
                    else {
                        var divElement = document.getElementById(this.element.id + '_search');
                        if (divElement) {
                            divElement.parentNode.removeChild(divElement);
                        }
                    }
                    break;
                case 'palettes':
                    for (var _b = 0, _c = Object.keys(newProp.palettes); _b < _c.length; _b++) {
                        var i = _c[_b];
                        var index = Number(i);
                        if (!this.accordionElement.items[index]) {
                            this.accordionElement.items[index] = {
                                header: newProp.palettes[index].title || '',
                                expanded: newProp.palettes[index].expanded,
                                iconCss: newProp.palettes[index].iconCss || ''
                            };
                        }
                        if (newProp.palettes[index].iconCss !== undefined) {
                            this.accordionElement.items[index].iconCss = newProp.palettes[index].iconCss || '';
                            refresh = true;
                        }
                        if (newProp.palettes[index].expanded !== undefined) {
                            if (!this.palettes[index].isInteraction) {
                                this.accordionElement.items[index].expanded = newProp.palettes[index].expanded;
                                this.isExpand = true;
                            }
                            else {
                                this.palettes[index].isInteraction = false;
                            }
                            if (!this.isExpandMode && !this.isMethod && !this.isExpand) {
                                this.isExpand = true;
                            }
                        }
                        if (isBlazor() && newProp.palettes[index].symbols === null) {
                            this.updateBlazorProperties(newProp);
                        }
                    }
                    break;
                case 'enableAnimation':
                    if (!this.enableAnimation) {
                        this.accordionElement.animation = { expand: { duration: 0 }, collapse: { duration: 0 } };
                    }
                    else {
                        this.accordionElement.animation = { expand: { duration: 400 }, collapse: { duration: 400 } };
                    }
                    break;
                case 'expandMode':
                    this.accordionElement.expandMode = this.expandMode;
                    refresh = true;
                    this.isExpandMode = true;
                    break;
                case 'allowDrag':
                    this.allowDrag = newProp.allowDrag;
                    if (!this.allowDrag) {
                        this.draggable.helper = function () {
                            return null;
                        };
                    }
                    else {
                        this.draggable.helper = this.helper;
                    }
                    break;
            }
        }
        if (refresh) {
            this.refreshPalettes();
        }
        if (this.isExpand && !refresh) {
            this.refresh();
            this.isExpand = false;
            for (var p = 0; p < this.palettes.length; p++) {
                var paletteElement = this.palettes[p].id;
                if (window[paletteElement]) {
                    if (window[paletteElement].length > 1) {
                        window[paletteElement][1].parentNode.removeChild(window[paletteElement][1]);
                        window[paletteElement][1] = null;
                    }
                }
            }
        }
        this.isMethod = false;
    };
    /**
     * @private
     */
    SymbolPalette.prototype.updateBlazorProperties = function (newProp) {
        var blazorInterop = 'sfBlazor';
        var blazor = 'Blazor';
        if (window && window[blazor]) {
            var palObj = { palette: newProp.palettes };
            var obj = { 'methodName': 'UpdateBlazorProperties', 'paletteobj': palObj };
            window[blazorInterop].updateBlazorProperties(obj, this);
        }
    };
    /**
     * Get the properties to be maintained in the persisted state.
     * @return {string}
     */
    SymbolPalette.prototype.getPersistData = function () {
        var keyEntity = ['loaded'];
        return this.addOnPersist(keyEntity);
    };
    /**
     * Initialize nodes, connectors and renderer
     */
    SymbolPalette.prototype.preRender = function () {
        var _this = this;
        if (this.element.id === '') {
            var collection = document.getElementsByClassName('e-symbolpalette').length;
            this.element.id = 'symbolpalette_' + this.paletteid + '_' + collection;
        }
        this.element.style.overflow = 'auto';
        this.element.style.height = this.height.toString();
        this.element.style.width = this.width.toString();
        if (this.enableSearch) {
            this.createTextbox();
        }
        //create accordion element
        var accordionDiv = createHtmlElement('div', { id: this.element.id + '_container' });
        this.accordionElement = new Accordion({
            expandMode: this.expandMode
        });
        if (!this.enableAnimation) {
            this.accordionElement.animation = { expand: { duration: 0 }, collapse: { duration: 0 } };
        }
        this.accordionElement.created = function () {
            _this.checkOnRender = true;
        };
        this.accordionElement.expanded = function (args) {
            var index = _this.accordionElement.items.indexOf(args.item);
            var isAllowDatabind = _this.allowServerDataBinding;
            _this.allowServerDataBinding = false;
            _this.palettes[index].expanded = args.isExpanded;
            _this.palettes[index].isInteraction = true;
            _this.allowServerDataBinding = isAllowDatabind;
        };
        this.accordionElement.expanding = function (args) {
            if (_this.checkOnRender) {
                var diagramArgs = { element: args.element, content: args.content, index: args.index, cancel: false,
                    isExpanded: args.isExpanded, palette: _this.palettes[args.index] };
                var event_1 = 'paletteExpanding';
                _this.trigger(event_1, diagramArgs);
                args.cancel = diagramArgs.cancel;
            }
        };
        this.element.appendChild(accordionDiv);
        var measureWindowElement = 'measureElement';
        if (window[measureWindowElement]) {
            window[measureWindowElement] = null;
        }
        createMeasureElements();
        this.unWireEvents();
        this.wireEvents();
    };
    /**
     * Renders nodes and connectors in the symbol palette
     */
    SymbolPalette.prototype.render = function () {
        this.diagramRenderer = new DiagramRenderer(this.element.id, new SvgRenderer(), false);
        this.svgRenderer = new DiagramRenderer(this.element.id, new SvgRenderer(), true);
        this.updatePalettes();
        this.accordionElement.appendTo('#' + this.element.id + '_container');
        this.renderComplete();
    };
    /**
     * To get Module name
     *  @private
     */
    SymbolPalette.prototype.getModuleName = function () {
        return 'SymbolPalette';
    };
    /**
     * To provide the array of modules needed for control rendering
     * @return {ModuleDeclaration[]}
     * @private
     */
    SymbolPalette.prototype.requiredModules = function () {
        var modules = [];
        modules.push({
            member: 'Bpmn',
            args: []
        });
        return modules;
    };
    /**
     * To destroy the symbol palette
     * @return {void}
     */
    SymbolPalette.prototype.destroy = function () {
        if (this.allowDrag) {
            this.draggable.destroy();
            this.unWireEvents();
            this.notify('destroy', {});
            _super.prototype.destroy.call(this);
            var content = document.getElementById(this.element.id + '_container');
            if (content) {
                this.element.removeChild(content);
                var measureElemnt = 'measureElement';
                if (window[measureElemnt]) {
                    window[measureElemnt].usageCount -= 1;
                    var measureElementCount = 'measureElementCount';
                    window[measureElementCount]--;
                    if (window[measureElementCount] === 0) {
                        window[measureElemnt].parentNode.removeChild(window[measureElemnt]);
                        window[measureElemnt] = null;
                    }
                }
            }
            content = document.getElementById(this.element.id + '_search');
            if (content) {
                content.parentNode.removeChild(content);
            }
            this.element.classList.remove('e-symbolpalette');
        }
    };
    /**
     * Add particular palettes to symbol palette at runtime.
     * @param { PaletteModel } palettes - Defines the collection of palettes to be added
     * @blazorArgsType palettes|System.Collections.ObjectModel.ObservableCollection<SymbolPalettePalette>
     */
    SymbolPalette.prototype.addPalettes = function (palettes) {
        var palette;
        for (var i = 0; i < palettes.length; i++) {
            var isEnableServerDatabind = this.allowServerDataBinding;
            this.isProtectedOnChange = true;
            this.allowServerDataBinding = false;
            palette = new Palette(this, 'palettes', palettes[i], true);
            this.palettes.push(palette);
            this.initSymbols(palette);
            this.allowServerDataBinding = isEnableServerDatabind;
            this.isProtectedOnChange = false;
            this.renderPalette(palette);
        }
        this.bulkChanges = {};
        this.accordionElement.refresh();
    };
    /**
     * @private
     */
    SymbolPalette.prototype.removePalette = function (paletteId) {
        for (var i = 0; i < this.palettes.length; i++) {
            if (this.palettes[i].id === paletteId) {
                this.palettes.splice(i, 1);
                this.accordionElement.items.splice(i, 1);
                break;
            }
        }
    };
    /**
     * Remove particular palettes to symbol palette at runtime
     * @param {string[]} palettes - Defines the collection of palettes to be remove
     * @blazorArgsType palettes|string[]
     */
    SymbolPalette.prototype.removePalettes = function (palettes) {
        var isEnableServerDatabind = this.allowServerDataBinding;
        this.allowServerDataBinding = false;
        for (var i = 0; i < palettes.length; i++) {
            this.removePalette(palettes[i]);
        }
        this.accordionElement.refresh();
        this.allowServerDataBinding = isEnableServerDatabind;
    };
    //end region - protected methods
    //region - private methods to render symbols
    /**
     * Method to initialize the items in the symbols
     */
    SymbolPalette.prototype.initSymbols = function (symbolGroup) {
        var group = [];
        var laneHeight = 0;
        var laneWidth = 0;
        for (var _i = 0, _a = symbolGroup.symbols; _i < _a.length; _i++) {
            var symbol = _a[_i];
            if (symbol.shape.type === 'SwimLane') {
                var swimLaneObj = symbol;
                var swimLaneShape = symbol.shape;
                var isHorizontal = (swimLaneShape.orientation === 'Horizontal') ? true : false;
                if (swimLaneShape.isLane) {
                    laneHeight = isHorizontal ? this.symbolHeight - this.symbolHeight / 2 : this.symbolHeight - this.symbolHeight / 4;
                    laneWidth = isHorizontal ? this.symbolWidth - this.symbolWidth / 4 : this.symbolWidth - this.symbolWidth / 2;
                    this.laneTable[symbol.id] = { height: laneHeight, width: laneWidth };
                    var header = swimLaneShape.lanes[0].header;
                    var laneStyle = swimLaneShape.lanes[0].style;
                    var headerStyle = header.style;
                    var headerObj = {
                        id: 'header' + randomId(), shape: { type: 'Basic', shape: 'Rectangle' },
                        width: isHorizontal ? header.width : swimLaneObj.width,
                        height: isHorizontal ? swimLaneObj.height : header.height,
                        style: headerStyle,
                        annotations: [{ content: header.annotation.content }]
                    };
                    headerObj.offsetX = headerObj.width / 2;
                    headerObj.offsetY = headerObj.height / 2;
                    this.addPaletteItem(symbolGroup.id, headerObj);
                    var laneObj = {
                        id: 'lane' + randomId(), shape: { type: 'Basic', shape: 'Rectangle' },
                        width: isHorizontal ? (swimLaneObj.width - header.width) : swimLaneObj.width,
                        height: isHorizontal ? swimLaneObj.height : (swimLaneObj.height - header.height),
                        style: laneStyle
                    };
                    laneObj.offsetX = isHorizontal ? (headerObj.width + (laneObj.width / 2)) : laneObj.width / 2;
                    laneObj.offsetY = isHorizontal ? laneObj.height / 2 : (headerObj.height + (laneObj.height / 2));
                    this.addPaletteItem(symbolGroup.id, laneObj);
                    swimLaneObj.children = [headerObj.id, laneObj.id];
                }
                else if (swimLaneShape.isPhase) {
                    laneHeight = swimLaneObj.height ? swimLaneObj.height : this.symbolHeight;
                    laneWidth = swimLaneObj.width ? swimLaneObj.width : this.symbolWidth;
                    symbol.shape.type = 'Path';
                    if (isHorizontal) {
                        symbol.shape.data = 'M0,0 L' + laneWidth + ',' + '0';
                    }
                    else {
                        symbol.shape.data = 'M0,0 L0,' + laneWidth;
                    }
                }
            }
            if (symbol instanceof Node) {
                var getNodeDefaults = getFunction(this.getNodeDefaults);
                if (getNodeDefaults) {
                    getNodeDefaults(symbol, this);
                }
            }
            else if (symbol instanceof Connector) {
                var getConnectorDefaults = getFunction(this.getConnectorDefaults);
                if (getConnectorDefaults) {
                    getConnectorDefaults(symbol, this);
                }
            }
            this.symbolTable[symbol.id] = symbol;
            if (symbol instanceof Node && symbol.children) {
                group.push(symbol);
            }
        }
        for (var i = 0; i < group.length; i++) {
            var node = void 0;
            for (var j = 0; j < group[i].children.length; j++) {
                node = (this.symbolTable[group[i].children[j]]);
                if (node) {
                    this.childTable[node.id] = node;
                    node.parentId = group[i].id;
                }
            }
        }
        for (var _b = 0, _c = symbolGroup.symbols; _b < _c.length; _b++) {
            var symbol = _c[_b];
            if (!(symbol instanceof Node && symbol.children)) {
                this.prepareSymbol(symbol);
            }
        }
        for (var _d = 0, group_1 = group; _d < group_1.length; _d++) {
            var symbol = group_1[_d];
            this.prepareSymbol(symbol);
        }
    };
    /**
     * Method to create the palette
     */
    SymbolPalette.prototype.renderPalette = function (symbolGroup) {
        var style = 'display:none;overflow:auto;';
        if (symbolGroup.height) {
            style += 'height:' + symbolGroup.height + 'px';
        }
        var paletteDiv = createHtmlElement('div', { 'id': symbolGroup.id, style: style, class: 'e-remove-palette' });
        this.element.appendChild(paletteDiv);
        var item = {
            header: symbolGroup.title, expanded: symbolGroup.expanded,
            content: '#' + symbolGroup.id, iconCss: symbolGroup.iconCss
        };
        this.accordionElement.items.push(item);
        this.renderSymbols(symbolGroup, paletteDiv);
    };
    /**
     * Used to add the palette item as nodes or connectors in palettes
     */
    SymbolPalette.prototype.addPaletteItem = function (paletteName, paletteSymbol, isChild) {
        paletteSymbol = cloneObject(paletteSymbol);
        var refresh;
        for (var i = 0; i < this.palettes.length; i++) {
            var symbolPaletteGroup = this.palettes[i];
            if (symbolPaletteGroup.id.indexOf(paletteName) !== -1) {
                // tslint:disable-next-line:no-any 
                var param = [undefined, symbolPaletteGroup, 'symbols', {}, true];
                // tslint:disable-next-line:no-any 
                var obj = new (Function.prototype.bind.apply(getObjectType(paletteSymbol), param));
                for (var i_1 = 0; i_1 < Object.keys(paletteSymbol).length; i_1++) {
                    var isEnableServerDatabind_1 = this.allowServerDataBinding;
                    this.allowServerDataBinding = false;
                    obj[Object.keys(paletteSymbol)[i_1]] = paletteSymbol[Object.keys(paletteSymbol)[i_1]];
                    this.allowServerDataBinding = isEnableServerDatabind_1;
                }
                updateDefaultValues(obj, paletteSymbol, obj instanceof Node ? this.nodeDefaults : this.connectorDefaults);
                symbolPaletteGroup.symbols.push(obj);
                var isEnableServerDatabind = this.allowServerDataBinding;
                this.allowServerDataBinding = false;
                this.prepareSymbol(obj);
                this.allowServerDataBinding = isEnableServerDatabind;
                this.symbolTable[obj.id] = obj;
                if (isChild) {
                    this.childTable[obj.id] = obj;
                }
                else {
                    var paletteDiv = document.getElementById(symbolPaletteGroup.id);
                    if (paletteDiv) {
                        paletteDiv.appendChild(this.getSymbolContainer(obj, paletteDiv));
                    }
                }
                break;
            }
        }
    };
    /**
     * Used to remove the palette item as nodes or connectors in palettes
     */
    SymbolPalette.prototype.removePaletteItem = function (paletteName, symbolId) {
        var refresh;
        for (var i = 0; i < this.palettes.length; i++) {
            var symbolPaletteGroup = this.palettes[i];
            if (symbolPaletteGroup.id.indexOf(paletteName) !== -1) {
                for (var _i = 0, _a = symbolPaletteGroup.symbols; _i < _a.length; _i++) {
                    var symbol = _a[_i];
                    if (symbol.id.indexOf(symbolId) !== -1) {
                        var index = symbolPaletteGroup.symbols.indexOf(symbol);
                        symbolPaletteGroup.symbols.splice(index, 1);
                        if (symbol.children) {
                            var parentNode = symbol.children;
                            for (var i_2 = 0; i_2 < parentNode.length; i_2++) {
                                delete this.symbolTable[(parentNode[i_2])];
                            }
                        }
                        delete this.symbolTable[symbol.id];
                        var element = document.getElementById(symbol.id + '_container');
                        element.parentNode.removeChild(element);
                        refresh = true;
                        break;
                    }
                }
            }
            if (refresh) {
                break;
            }
        }
    };
    /**
     * Method to create the symbols in canvas
     */
    SymbolPalette.prototype.prepareSymbol = function (symbol) {
        var width;
        var sw;
        var height;
        var sh;
        var stackPanel = new StackPanel();
        var obj = symbol;
        var content;
        var symbolContainer = new Canvas();
        var container = (symbol instanceof Node) ? symbol.initContainer() : null;
        if (container && !container.children) {
            container.children = [];
        }
        //preparing objects
        var getSymbolTemplate = getFunction(this.getSymbolTemplate);
        if (getSymbolTemplate) {
            content = getSymbolTemplate(symbol);
        }
        if (!content) {
            if (obj.children) {
                content = this.getContainer(obj, container);
            }
            else {
                content = symbol.init(this);
                if (symbol instanceof Node && symbol.parentId) {
                    container.children.push(content);
                }
            }
        }
        if (!symbol.parentId) {
            var symbolInfo = { width: this.symbolWidth, height: this.symbolHeight };
            var getSymbolInfo = getFunction(this.getSymbolInfo);
            if (getSymbolInfo) {
                symbolInfo = getSymbolInfo(symbol);
            }
            else if (isBlazor()) {
                symbolInfo = this.getBlazorSymbolInfo(symbol, symbolInfo);
            }
            symbolInfo = symbolInfo || this.symbolInfo || {};
            if (symbol.shape && symbol.shape.isPhase) {
                symbolInfo.width = symbolInfo.width || this.symbolWidth;
                symbolInfo.height = symbolInfo.height || this.symbolHeight;
            }
            //defining custom templates
            content.relativeMode = 'Object';
            content.horizontalAlignment = content.verticalAlignment = 'Center';
            symbolContainer.style.strokeColor = symbolContainer.style.fill = 'none';
            symbolContainer.children = [content];
            content.measure(new Size());
            content.arrange(content.desiredSize);
            width = symbolInfo.width = symbolInfo.width ||
                (obj.width !== undefined ? content.actualSize.width : undefined) || this.symbolWidth;
            height = symbolInfo.height = symbolInfo.height ||
                (obj.height !== undefined ? content.actualSize.height : undefined) || this.symbolHeight;
            if (width !== undefined && height !== undefined) {
                var actualWidth = width;
                var actualHeight = height;
                var isLane = symbol.shape.isLane ? true : false;
                var isPhase = symbol.shape.isPhase ? true : false;
                if (this.symbolWidth !== undefined) {
                    actualWidth = this.symbolWidth - this.symbolMargin.left - this.symbolMargin.right;
                }
                else {
                    width += obj.style.strokeWidth;
                }
                if (this.symbolHeight !== undefined) {
                    actualHeight = this.symbolHeight - this.symbolMargin.top - this.symbolMargin.bottom;
                }
                else {
                    height += obj.style.strokeWidth;
                }
                if (symbolInfo.description && symbolInfo.description.text !== '') {
                    actualHeight -= 20; // default height of the text have been reduced from the container.
                }
                sw = actualWidth / ((!isPhase && content.width) || width);
                sh = actualHeight / ((!isPhase && content.height) || height);
                if (symbolInfo.fit) {
                    sw = actualWidth / symbolInfo.width;
                    sh = actualHeight / symbolInfo.height;
                }
                width = actualWidth;
                height = actualHeight;
                sw = sh = Math.min(sw, sh);
                symbolContainer.width = width;
                symbolContainer.height = height;
                content.width = symbolInfo.width;
                content.height = symbolInfo.height;
                this.scaleSymbol(symbol, symbolContainer, sw, sh, width, height);
            }
            else {
                var outerBounds = void 0;
                if (symbol instanceof Connector) {
                    outerBounds = getOuterBounds(symbol);
                }
                content.width = symbol.width || (outerBounds) ? outerBounds.width : content.actualSize.width;
                content.height = symbol.height || (outerBounds) ? outerBounds.height : content.actualSize.height;
            }
            symbol.wrapper = stackPanel;
            stackPanel.children = [symbolContainer];
            content.pivot = stackPanel.pivot = { x: 0, y: 0 };
            stackPanel.id = content.id + '_symbol';
            stackPanel.style.fill = stackPanel.style.strokeColor = 'transparent';
            if (symbol instanceof Node) {
                stackPanel.offsetX = symbol.style.strokeWidth / 2;
                stackPanel.offsetY = symbol.style.strokeWidth / 2;
            }
            else {
                stackPanel.offsetX = 0.5;
                stackPanel.offsetY = 0.5;
            }
            //symbol description-textElement
            this.getSymbolDescription(symbolInfo, width, stackPanel);
            stackPanel.measure(new Size());
            stackPanel.arrange(stackPanel.desiredSize);
            symbolInfo.width = symbolInfo.width || content.actualSize.width;
            symbolInfo.height = symbolInfo.height || content.actualSize.height;
            symbol[this.info] = symbolInfo;
        }
        if (symbol.parentId) {
            container.measure(new Size(obj.width, obj.height));
            container.arrange(container.desiredSize);
        }
    };
    SymbolPalette.prototype.getBlazorSymbolInfo = function (symbol, symbolInfo) {
        var node = symbol;
        var shapeSymbolInfo = node.symbolInfo;
        if (shapeSymbolInfo) {
            symbolInfo.description = shapeSymbolInfo.description || this.symbolInfo.description;
            symbolInfo.fit = shapeSymbolInfo.fit || this.symbolInfo.fit;
            symbolInfo.height = shapeSymbolInfo.height || this.symbolInfo.height;
            symbolInfo.width = shapeSymbolInfo.width || this.symbolInfo.width;
            symbolInfo.tooltip = shapeSymbolInfo.tooltip || this.symbolInfo.tooltip;
            symbolInfo.template = shapeSymbolInfo.template || this.symbolInfo.template;
        }
        return symbolInfo;
    };
    SymbolPalette.prototype.getContainer = function (obj, container) {
        container.measureChildren = false;
        var bounds;
        var child = obj.children;
        container.children = [];
        for (var i = 0; i < child.length; i++) {
            if (this.symbolTable[child[i]]) {
                container.children.push(this.symbolTable[child[i]].wrapper);
            }
        }
        container.measure(new Size(obj.width, obj.height));
        container.arrange(container.desiredSize);
        if (container.bounds.x !== 0 || container.bounds.y !== 0) {
            bounds = container.bounds;
            arrangeChild(obj, bounds.x, bounds.y, this.symbolTable, false, this);
            container = this.getContainer(obj, container);
        }
        return container;
    };
    /**
     * Method to get the symbol text description
     * @return {void}
     * @private
     */
    SymbolPalette.prototype.getSymbolDescription = function (symbolInfo, width, parent) {
        if (symbolInfo && symbolInfo.description && symbolInfo.description.text) {
            var textElement = new TextElement();
            //symbol description-textElement
            symbolInfo.description.overflow = symbolInfo.description.overflow || 'Ellipsis';
            symbolInfo.description.wrap = symbolInfo.description.wrap || 'WrapWithOverflow';
            textElement.id = parent.id + '_text';
            textElement.content = symbolInfo.description.text;
            textElement.width = width;
            textElement.height = 20;
            textElement.style.strokeColor = 'transparent';
            textElement.style.fill = 'transparent';
            textElement.style.strokeWidth = 0;
            textElement.style.textWrapping = symbolInfo.description.wrap;
            textElement.style.textOverflow = symbolInfo.description.overflow;
            textElement.margin = { left: 0, right: 0, top: 0, bottom: 5 };
            parent.children.push(textElement);
        }
    };
    /**
     * Method to renders the symbols
     * @return {void}
     * @private
     */
    SymbolPalette.prototype.renderSymbols = function (symbolGroup, parentDiv) {
        for (var _i = 0, _a = symbolGroup.symbols; _i < _a.length; _i++) {
            var symbol = _a[_i];
            if (!symbol.parentId) {
                this.getSymbolContainer(symbol, parentDiv);
            }
        }
    };
    /**
     * Method to clone the symbol for previewing the symbols
     * @return {void}
     * @private
     */
    SymbolPalette.prototype.getSymbolPreview = function (symbol, evt, parentDiv) {
        this.allowServerDataBinding = false;
        var canvas;
        var sw;
        var sh;
        var symbolPreviewWidth = symbol.wrapper.children[0].desiredSize.width + symbol.style.strokeWidth;
        var symbolPreviewHeight = symbol.wrapper.children[0].desiredSize.height + symbol.style.strokeWidth;
        var content = symbol.wrapper.children[0].children[0];
        var symbolPreview = symbol.previewSize;
        if ((symbol && (symbolPreview.width || symbolPreview.height)) ||
            this.symbolPreview.width !== undefined || this.symbolPreview.height !== undefined) {
            symbolPreviewWidth = (symbolPreview.width || this.symbolPreview.width || symbolPreviewWidth) - symbol.style.strokeWidth;
            symbolPreviewHeight = (symbolPreview.height || this.symbolPreview.height || symbolPreviewHeight) - symbol.style.strokeWidth;
            sw = symbolPreviewWidth / content.actualSize.width;
            sh = symbolPreviewHeight / content.actualSize.height;
            sw = sh = Math.min(sw, sh);
            var symbolWidth = content.actualSize.width * sw;
            var symbolHeight = content.actualSize.height * sh;
            symbol.wrapper.children[0].width = symbolPreviewWidth;
            symbol.wrapper.children[0].height = symbolPreviewHeight;
            this.measureAndArrangeSymbol(content, symbol instanceof Node);
            this.scaleSymbol(symbol, symbol.wrapper.children[0], sw, sh, symbolWidth, symbolHeight, true);
            symbolPreviewWidth = symbolWidth;
            symbolPreviewHeight = symbolHeight;
        }
        var prevPosition = { x: content.offsetX, y: content.offsetY };
        content.offsetX = content.offsetY = symbol.style.strokeWidth / 2;
        content.pivot = { x: 0, y: 0 };
        this.measureAndArrangeSymbol(content, symbol instanceof Node);
        var previewContainer = createHtmlElement('div', { 'draggable': 'true', 'class': 'e-dragclone', 'style': 'pointer-events:none' });
        var div;
        document.body.appendChild(previewContainer);
        var style = 'margin:5px;';
        if (symbol.shape.type === 'Native') {
            canvas = createSvgElement('svg', {
                id: symbol.id + '_preview',
                width: Math.ceil(symbolPreviewWidth) + 1,
                height: Math.ceil(symbolPreviewHeight) + 1
            });
            var gElement = createSvgElement('g', { id: symbol.id + '_g' });
            canvas.appendChild(gElement);
            previewContainer.appendChild(canvas);
            this.svgRenderer.renderElement(content, gElement, undefined, undefined, canvas);
        }
        else if (symbol.shape.type === 'HTML') {
            div = this.getHtmlSymbol(symbol, canvas, previewContainer, symbolPreviewHeight, symbolPreviewWidth, true);
        }
        else {
            if (symbol.children &&
                symbol.children.length > 0 && groupHasType(symbol, 'HTML', this.childTable)) {
                div = this.getGroupParent(symbol, canvas, previewContainer, symbol.wrapper.actualSize.height, symbol.wrapper.actualSize.width, true);
            }
            else {
                canvas = CanvasRenderer.createCanvas(symbol.id + '_preview', (Math.ceil(symbolPreviewWidth) + symbol.style.strokeWidth + 1) * 2, (Math.ceil(symbolPreviewHeight) + symbol.style.strokeWidth + 1) * 2);
                previewContainer.appendChild(canvas);
                // BLAZ-3223: translate applied only for Basic and Flow now and need to add for remaining shapes in future 
                if (symbol.shape.type === 'Basic' || symbol.shape.type === 'Flow') {
                    style += 'transform: scale(0.5) translate(-' + canvas.width / 2 + 'px, -' + canvas.height / 2 + 'px);';
                }
                else {
                    style += 'transform:scale(0.5);';
                }
                canvas.setAttribute('transform-origin', '0 0');
                var index = 2;
                if (symbol instanceof Connector) {
                    index = 1.9;
                }
                canvas.getContext('2d').setTransform(index, 0, 0, index, 0, 0);
                this.diagramRenderer.renderElement(content, canvas, undefined);
            }
        }
        applyStyleAgainstCsp(((div && (symbol.shape.type === 'HTML' || symbol.children
            && symbol.children.length > 0)) ? div : canvas), style);
        content.offsetX = prevPosition.x;
        content.offsetY = prevPosition.y;
        this.allowServerDataBinding = true;
        return previewContainer;
    };
    SymbolPalette.prototype.measureAndArrangeSymbol = function (content, isNode) {
        if (content.children && !isNode) {
            content.children[0].transform = Transform.Self;
        }
        content.measure(new Size());
        content.arrange(content.desiredSize);
        if (content.children) {
            content.children[0].transform = Transform.Parent;
        }
    };
    SymbolPalette.prototype.updateSymbolSize = function (symbol, width, height) {
        var element = symbol.wrapper.children[0].children[0];
        var strokeWidth = symbol.style.strokeWidth;
        element.width = (width || element.width) - (strokeWidth + 1);
        element.height = (height || element.height) - (strokeWidth + 1);
        symbol.wrapper.measure(new Size());
        symbol.wrapper.arrange(symbol.wrapper.desiredSize);
    };
    /**
     * Method to create canvas and render the symbol
     * @return {void}
     * @private
     */
    SymbolPalette.prototype.getSymbolContainer = function (symbol, parentDiv, preview) {
        var symbolInfo = this.symbolTable[symbol.id][this.info];
        var size = this.getSymbolSize(symbol, symbolInfo);
        var width = size.width + 1;
        var height = size.height + 1;
        var container = createHtmlElement('div', {
            id: symbol.id + '_container',
            style: 'width:' + width + 'px;height:' + height + 'px;float:left;overflow:hidden',
            title: symbolInfo.tooltip ? symbolInfo.tooltip : symbol.id
        });
        parentDiv.appendChild(container);
        var canvas;
        var gElement;
        var div;
        if (symbol.shape.type === 'Native') {
            canvas = createSvgElement('svg', {
                id: symbol.id,
                width: Math.ceil(symbol.wrapper.actualSize.width) + 1,
                height: Math.ceil(symbol.wrapper.actualSize.height) + 1
            });
            gElement = createSvgElement('g', { id: symbol.id + '_g' });
            canvas.appendChild(gElement);
            container.appendChild(canvas);
            this.updateSymbolSize(symbol);
            this.svgRenderer.renderElement(symbol.wrapper, gElement, undefined, undefined, canvas);
        }
        else if (symbol.shape.type === 'HTML') {
            div = this.getHtmlSymbol(symbol, canvas, container, symbol.wrapper.actualSize.height, symbol.wrapper.actualSize.width, false);
        }
        else {
            if (symbol.children &&
                symbol.children.length > 0 && groupHasType(symbol, 'HTML', this.childTable)) {
                div = this.getGroupParent(symbol, canvas, container, symbol.wrapper.actualSize.height, symbol.wrapper.actualSize.width, false);
            }
            else {
                canvas = CanvasRenderer.createCanvas(symbol.id, Math.ceil((symbol.wrapper.actualSize.width + symbol.style.strokeWidth) * 2) + 1, Math.ceil((symbol.wrapper.actualSize.height + symbol.style.strokeWidth) * 2) + 1);
                container.appendChild(canvas);
                var index = 2;
                if (symbol instanceof Connector) {
                    index = 1.9;
                }
                canvas.getContext('2d').setTransform(index, 0, 0, index, 0, 0);
                this.diagramRenderer.renderElement(symbol.wrapper, gElement || canvas, undefined, undefined, undefined, undefined, true, undefined, true);
            }
        }
        if (!preview) {
            var actualWidth = symbol.wrapper.actualSize.width + symbol.style.strokeWidth;
            var actualHeight = symbol.wrapper.actualSize.height + symbol.style.strokeWidth;
            var style = 'pointer-events:none;transform-origin:0 0;overflow:hidden;';
            if (symbol.shape.isPhase) {
                if (symbol.shape.orientation === 'Horizontal') {
                    style += 'margin-left:' +
                        Math.max(this.symbolMargin.left, ((width - actualWidth) / 2))
                        + 'px;margin-top:' + size.height / 2
                        + 'px;';
                }
                else {
                    style += 'margin-left:' +
                        size.width / 2
                        + 'px;margin-top:' + Math.max(this.symbolMargin.top, ((height - actualHeight) / 2))
                        + 'px;';
                }
            }
            else {
                style += 'margin-left:' +
                    Math.max(this.symbolMargin.left, ((width - actualWidth) / 2))
                    + 'px;margin-top:' + Math.max(this.symbolMargin.top, ((height - actualHeight) / 2))
                    + 'px;';
            }
            if (canvas instanceof HTMLCanvasElement) {
                style += 'transform:scale(.5,.5);';
            }
            applyStyleAgainstCsp(((div && (symbol.shape.type === 'HTML' || symbol.children &&
                symbol.children.length > 0)) ? div : canvas), style);
            container.classList.add('e-symbol-draggable');
            return container;
        }
        return canvas;
    };
    SymbolPalette.prototype.getGroupParent = function (item, canvas, container, height, width, isPreview) {
        var div = createHtmlElement('div', { 'id': item.id + (isPreview ? '_html_div_preview' : '_html_div') });
        var htmlLayer = createHtmlElement('div', {
            'id': item.id + (isPreview ? '_htmlLayer_preview' : '_htmlLayer'),
            'style': 'width:' + Math.ceil(width + 1) + 'px;' +
                'height:' + Math.ceil(height + 1) + 'px;position:absolute',
            'class': 'e-html-layer'
        });
        var htmlLayerDiv = createHtmlElement('div', {
            'id': item.id + (isPreview ? '_htmlLayer_div_preview' : '_htmlLayer_div'),
            'style': 'width:' + Math.ceil(width + 1) + 'px;' +
                'height:' + Math.ceil(height + 1) + 'px;position:absolute',
        });
        htmlLayer.appendChild(htmlLayerDiv);
        div.appendChild(htmlLayer);
        canvas = CanvasRenderer.createCanvas((isPreview ? (item.id + '_preview') : item.id), Math.ceil(width) + 1, Math.ceil(height) + 1);
        div.appendChild(canvas);
        container.appendChild(div);
        this.diagramRenderer.renderElement(item.wrapper.children[0].children[0], canvas, htmlLayer);
        return div;
    };
    SymbolPalette.prototype.getHtmlSymbol = function (symbol, canvas, container, height, width, isPreview) {
        var div = createHtmlElement('div', {
            'id': symbol.id + (isPreview ? '_html_div_preview' : '_html_div')
        });
        var htmlLayer = createHtmlElement('div', {
            'id': symbol.id + (isPreview ? '_htmlLayer_preview' : '_htmlLayer'),
            'style': 'width:' + Math.ceil(width + 1) + 'px;' +
                'height:' + Math.ceil(height + 1) + 'px;position:absolute',
            'class': 'e-html-layer'
        });
        var htmlLayerDiv = createHtmlElement('div', {
            'id': symbol.id + (isPreview ? '_htmlLayer_div_preview' : '_htmlLayer_div'),
            'style': 'width:' + Math.ceil(width + 1) + 'px;' +
                'height:' + Math.ceil(height + 1) + 'px;position:absolute',
        });
        htmlLayer.appendChild(htmlLayerDiv);
        div.appendChild(htmlLayer);
        canvas = CanvasRenderer.createCanvas(symbol.id, Math.ceil((symbol.wrapper.actualSize.width + symbol.style.strokeWidth) * 2) + 1, Math.ceil((symbol.wrapper.actualSize.height + symbol.style.strokeWidth) * 2) + 1);
        container.appendChild(canvas);
        canvas.getContext('2d').setTransform(2, 0, 0, 2, 0, 0);
        div.appendChild(canvas);
        container.appendChild(div);
        this.diagramRenderer.renderElement(symbol.wrapper.children[0].children[0], canvas, htmlLayer);
        return div;
    };
    SymbolPalette.prototype.getSymbolSize = function (symbol, symbolInfo) {
        var width = symbol.wrapper.actualSize.width;
        var height = symbol.wrapper.actualSize.height;
        if (!this.symbolWidth && !this.symbolHeight) {
            width += this.symbolMargin.left + this.symbolMargin.right + symbol.style.strokeWidth;
            height += this.symbolMargin.top + this.symbolMargin.bottom + symbol.style.strokeWidth;
        }
        else {
            width = this.symbolWidth;
            height = Math.max(this.symbolHeight, height);
        }
        return new Size(width, height);
    };
    //end region - rendering symbols
    //region event handlers
    SymbolPalette.prototype.getMousePosition = function (e) {
        var offsetY;
        var offsetX;
        var touchArg;
        if (e.type.indexOf('touch') !== -1) {
            touchArg = e;
            var pageY = touchArg.changedTouches[0].clientY;
            var pageX = touchArg.changedTouches[0].clientX;
            offsetY = pageY - this.element.offsetTop;
            offsetX = pageX - this.element.offsetLeft;
        }
        else {
            offsetY = e.clientY - this.element.offsetTop;
            offsetX = e.clientX - this.element.offsetLeft;
        }
        return { x: offsetX, y: offsetY };
    };
    SymbolPalette.prototype.mouseMove = function (e, touches) {
        if (this.highlightedSymbol && (!this.selectedSymbol
            || this.selectedSymbol.id + '_container' !== this.highlightedSymbol.id)) {
            this.highlightedSymbol.classList.remove('e-symbol-hover');
            this.highlightedSymbol.style.backgroundColor = '';
            this.highlightedSymbol = null;
        }
        var id = e.target.id.split('_container')[0];
        if (this.symbolTable[id]) {
            var container = document.getElementById(id + '_container');
            container.classList.add('e-symbol-hover');
            this.highlightedSymbol = container;
        }
        e.preventDefault();
    };
    SymbolPalette.prototype.mouseUp = function (evt) {
        this.isMethod = true;
        if (evt && evt.target) {
            if (evt.srcElement.id === 'iconSearch') {
                var element = document.getElementById('iconSearch');
                if (element.classList.contains('e-clear-searchtext')) {
                    element.className = 'e-input-group-icon e-search e-icons';
                    document.getElementById('textEnter').value = '';
                    this.searchPalette('');
                }
            }
            else {
                var id = evt.target.id.split('_container')[0];
                if (id && this.selectedSymbol) {
                    var args = { oldValue: this.oldObject, newValue: id };
                    var event_2 = 'paletteSelectionChange';
                    this.trigger(event_2, args);
                    this.oldObject = id;
                    evt.preventDefault();
                }
            }
        }
    };
    SymbolPalette.prototype.keyUp = function (evt) {
        var _this = this;
        if (this.enableSearch) {
            var palette_1 = this;
            var element = document.getElementById('iconSearch');
            element.className = 'e-input-group-icon e-clear-searchtext e-icons';
            if (evt && (evt.key === 'Enter' || evt.keyCode === 13)) {
                if (evt.target instanceof HTMLInputElement) {
                    this.searchPalette(evt.target.value);
                }
            }
            else {
                if (this.timer) {
                    clearTimeout(this.timer);
                }
                this.timer = setTimeout(function () {
                    if (evt.target instanceof HTMLInputElement) {
                        palette_1.searchPalette(evt.target.value);
                        _this.timer = null;
                    }
                }, 500);
            }
        }
    };
    SymbolPalette.prototype.mouseDown = function (evt) {
        var id = evt.target.id.split('_container')[0];
        if (this.selectedSymbol) {
            var oldSymbol = document.getElementById(this.selectedSymbol.id + '_container');
            if (id !== this.selectedSymbol.id && oldSymbol) {
                oldSymbol.classList.remove('e-symbol-selected');
            }
            var container = document.getElementById(this.selectedSymbol.id + '_container');
            if (container) {
                container.style.backgroundColor = '';
            }
            this.selectedSymbol = null;
        }
        if (this.symbolTable[id]) {
            var container = document.getElementById(id + '_container');
            container.classList.add('e-symbol-selected');
            this.selectedSymbol = this.symbolTable[id];
            evt.preventDefault();
        }
    };
    SymbolPalette.prototype.keyDown = function (evt) {
        var palette = this;
        var helperElement = 'helperElement';
        var intDestroy = 'intDestroy';
        if (evt && (evt.key === 'Escape')) {
            var element = palette.draggable[helperElement];
            if (element && element.parentNode) {
                element.parentNode.removeChild(element);
                palette.draggable[intDestroy]();
            }
        }
    };
    //end region - event handlers
    // region - draggable
    SymbolPalette.prototype.initDraggable = function () {
        if (this.allowDrag) {
            var drag = void 0;
            this.draggable = new Draggable(this.element, {
                dragTarget: '.e-symbol-draggable',
                helper: this.helper,
                dragStart: this.dragStart,
                preventDefault: false,
                dragStop: this.dragStop,
                drag: function (args) {
                    var target = 'target';
                    var parent = parentsUntil(args[target], 'e-droppable');
                    if (parent && parent.classList.contains('e-diagram')) {
                        var e2eInstance = 'ej2_instances';
                        parent[e2eInstance][0].droppable.over(args);
                    }
                },
                cursorAt: { left: this.symbolPreview.offset.x, top: this.symbolPreview.offset.y }
            });
        }
    };
    SymbolPalette.prototype.dragStart = function (e) {
        var element = this.helper[0];
        if (element) {
            element.setAttribute('paletteId', this.element.id);
        }
        if (isBlazor()) {
            e.bindEvents(e.dragElement);
        }
    };
    SymbolPalette.prototype.dragStop = function (e) {
        if (!parentsUntil(e.target, 'e-diagram')) {
            remove(e.helper);
        }
    };
    //end region - draggable 
    //region - helper methods
    SymbolPalette.prototype.scaleSymbol = function (symbol, symbolContainer, sw, sh, width, height, preview) {
        if (symbol instanceof Connector) {
            var wrapper = symbol.wrapper;
            symbol.wrapper = symbolContainer.children[0];
            var point = symbol.scale(sw, sh, width, height, symbolContainer.children[0]);
            var difX = width / 2 - symbolContainer.children[0].children[0].offsetX + point.x / 2;
            var difY = height / 2 - symbolContainer.children[0].children[0].offsetY + point.y / 2;
            for (var _i = 0, _a = symbolContainer.children[0].children; _i < _a.length; _i++) {
                var child = _a[_i];
                child.offsetX += difX;
                child.offsetY += difY;
                child.staticSize = false;
            }
            symbol.wrapper = wrapper;
        }
        else if (symbol.shape.type === 'Bpmn' && this.bpmnModule) {
            var wrapper = symbol.wrapper;
            symbol.wrapper = symbolContainer;
            symbolContainer.children[0].width = width;
            symbolContainer.children[0].height = height;
            this.bpmnModule.updateBPMN({ width: width, height: height }, symbol, symbol, null);
            symbol.wrapper = wrapper;
        }
        else {
            if (symbol.children) {
                var parentNode = symbol.children;
                var w = 0;
                var h = 0;
                if (!preview) {
                    var node = void 0;
                    var container = void 0;
                    for (var i = 0; i < parentNode.length; i++) {
                        container = symbolContainer.children[0].children[i];
                        if (container) {
                            if (container.children[0].children) {
                                this.measureChild(container);
                            }
                            node = this.symbolTable[container.id];
                            container.width = node.width;
                            container.height = node.height;
                            container.measure(new Size());
                            container.arrange(container.children[0].desiredSize);
                        }
                    }
                }
                w = width / symbolContainer.children[0].desiredSize.width;
                h = height / symbolContainer.children[0].desiredSize.height;
                symbolContainer.children[0].measure(new Size());
                symbolContainer.children[0].arrange(symbolContainer.children[0].desiredSize);
                if (!preview) {
                    var children = void 0;
                    for (var i = 0; i < parentNode.length; i++) {
                        children = symbolContainer.children[0].children[i];
                        if (children) {
                            if (children.children[0].children) {
                                this.scaleChildren(children, w, h, symbol);
                            }
                            this.scaleGroup(children, w, h, symbol);
                        }
                    }
                }
                if (preview) {
                    var node = void 0;
                    var scaleWidth = void 0;
                    var scaleHeight = void 0;
                    var children = void 0;
                    for (var i = 0; i < parentNode.length; i++) {
                        node = this.symbolTable[parentNode[i]];
                        scaleWidth = width / symbol.wrapper.children[0].desiredSize.width;
                        scaleHeight = height / symbol.wrapper.children[0].desiredSize.height;
                        children = symbolContainer.children[0].children[i];
                        if (children) {
                            if (children.children[0].children) {
                                this.scaleChildren(children, scaleWidth, scaleHeight, symbol, true);
                            }
                            this.scaleGroup(children, scaleWidth, scaleHeight, symbol, true);
                        }
                    }
                    symbol.wrapper.children[0].measure(new Size());
                    symbol.wrapper.children[0].arrange(symbol.wrapper.children[0].desiredSize);
                }
            }
            else {
                scaleElement(symbolContainer.children[0], sw, sh, symbolContainer);
            }
        }
    };
    SymbolPalette.prototype.scaleChildren = function (container, w, h, symbol, preview) {
        var child;
        for (var i = 0; i < container.children.length; i++) {
            child = container.children[i];
            if (!child.children[0].children) {
                this.scaleGroup(child, w, h, symbol, preview);
            }
            else {
                this.scaleChildren(child, w, h, symbol, preview);
            }
        }
    };
    SymbolPalette.prototype.measureChild = function (container) {
        var childContainer;
        var node;
        for (var i = 0; i < container.children.length; i++) {
            childContainer = container.children[i];
            if (!childContainer.children[0].children) {
                node = this.symbolTable[childContainer.id];
                childContainer.width = node.width;
                childContainer.height = node.height;
                childContainer.measure(new Size());
                childContainer.arrange(childContainer.children[0].desiredSize);
            }
            else {
                this.measureChild(childContainer);
            }
        }
    };
    SymbolPalette.prototype.scaleGroup = function (child, w, h, symbol, preview) {
        child.width = child.width * w;
        child.height = (child.height * h);
        child.offsetX = preview ? (child.offsetX * w) - symbol.style.strokeWidth : (child.offsetX * w) + symbol.style.strokeWidth / 2;
        child.offsetY = preview ? (child.offsetY * h) - symbol.style.strokeWidth : (child.offsetY * h) + symbol.style.strokeWidth / 2;
        child.measure(new Size());
        child.arrange(child.children[0].desiredSize);
    };
    SymbolPalette.prototype.refreshPalettes = function () {
        this.accordionElement.items = [];
        removeElementsByClass('e-remove-palette', this.element.id);
        this.updatePalettes();
        this.accordionElement.dataBind();
    };
    SymbolPalette.prototype.updatePalettes = function () {
        for (var i = 0; i < this.palettes.length; i++) {
            var symGroup = this.palettes[i];
            this.initSymbols(symGroup);
            this.renderPalette(symGroup);
        }
    };
    SymbolPalette.prototype.createTextbox = function () {
        var searchDiv = createHtmlElement('div', { id: this.element.id + '_search' });
        applyStyleAgainstCsp(searchDiv, 'backgroundColor:white;height:30px');
        //  searchDiv.setAttribute('style', 'backgroundColor:white;height:30px');
        searchDiv.className = 'e-input-group';
        this.element.appendChild(searchDiv);
        var textBox = createHtmlElement('input', {});
        textBox.placeholder = 'Search Shapes';
        textBox.id = 'textEnter';
        applyStyleAgainstCsp(textBox, 'width:100%;height:auto');
        //textBox.setAttribute('style', 'width:100%;height:auto');
        textBox.className = 'e-input';
        searchDiv.appendChild(textBox);
        var span = createHtmlElement('span', { id: 'iconSearch', className: 'e-input-group-icon e-search e-icons' });
        searchDiv.appendChild(span);
    };
    SymbolPalette.prototype.getFilterSymbol = function (symbol) {
        var items = [];
        for (var i = 0; i < symbol.length; i++) {
            for (var j = 0; j < this.ignoreSymbolsOnSearch.length; j++) {
                if (this.ignoreSymbolsOnSearch[j] !== symbol[i].id) {
                    items.push(symbol[0]);
                }
            }
        }
        return items;
    };
    SymbolPalette.prototype.searchPalette = function (value) {
        var symbolGroup = [];
        var element = document.getElementById('SearchPalette');
        var paletteDiv;
        //remove the existing child in palette
        if (element) {
            for (var k = element.children.length - 1; k >= 0; k--) {
                element.removeChild(element.children[k]);
            }
        }
        //add the searched item in array collection
        for (var i = 0; i < this.palettes.length; i++) {
            var symbolPaletteGroup = this.palettes[i];
            for (var j = 0; j < symbolPaletteGroup.symbols.length; j++) {
                var item = symbolPaletteGroup.symbols[j];
                if (value !== '' && item.id.toLowerCase().indexOf(value.toLowerCase()) !== -1) {
                    symbolGroup.push(item);
                }
            }
        }
        var filterSymbols = getFunction(this.filterSymbols);
        if (filterSymbols) {
            symbolGroup = filterSymbols(symbolGroup) || [];
        }
        if (this.ignoreSymbolsOnSearch && this.ignoreSymbolsOnSearch.length > 0) {
            symbolGroup = this.getFilterSymbol(symbolGroup);
        }
        //create a palette collection
        if (!element) {
            paletteDiv = this.createSearchPalette(paletteDiv);
            element = paletteDiv;
        }
        //add the symbols into search palette
        if (symbolGroup.length > 0) {
            for (var _i = 0, symbolGroup_1 = symbolGroup; _i < symbolGroup_1.length; _i++) {
                var symbol = symbolGroup_1[_i];
                this.getSymbolContainer(symbol, element);
            }
        }
        else if (value !== '') {
            var emptyDiv = createHtmlElement('div', { 'id': 'EmptyDiv', 'style': 'text-align:center;font-style:italic' });
            emptyDiv.innerHTML = 'No Items To Display';
            element.appendChild(emptyDiv);
        }
        else {
            var element_1 = document.getElementById('iconSearch');
            element_1.className = 'e-input-group-icon e-search e-icons';
            this.accordionElement.removeItem(0);
            var searchPalette = document.getElementById('SearchPalette');
            if (searchPalette) {
                searchPalette.remove();
            }
        }
    };
    SymbolPalette.prototype.createSearchPalette = function (paletteDiv) {
        paletteDiv = createHtmlElement('div', { 'id': 'SearchPalette', 'style': 'display:none;overflow:auto;' });
        this.element.appendChild(paletteDiv);
        var paletteCollection = {
            header: 'Search Results', expanded: true,
            content: '#SearchPalette',
        };
        this.accordionElement.addItem(paletteCollection, 0);
        return paletteDiv;
    };
    /**
     * Method to bind events for the symbol palette
     */
    SymbolPalette.prototype.wireEvents = function () {
        var startEvent = Browser.touchStartEvent;
        var stopEvent = Browser.touchEndEvent;
        var moveEvent = Browser.touchMoveEvent;
        var cancelEvent = 'mouseleave';
        var keyEvent = 'keyup';
        var keyDownEvent = 'keydown';
        EventHandler.add(this.element, startEvent, this.mouseDown, this);
        EventHandler.add(this.element, moveEvent, this.mouseMove, this);
        EventHandler.add(this.element, stopEvent, this.mouseUp, this);
        EventHandler.add(this.element, keyEvent, this.keyUp, this);
        EventHandler.add(document, keyDownEvent, this.keyDown, this);
        // initialize the draggable component
        this.initDraggable();
    };
    /**
     * Method to unbind events for the symbol palette
     */
    SymbolPalette.prototype.unWireEvents = function () {
        var startEvent = Browser.touchStartEvent;
        var stopEvent = Browser.touchEndEvent;
        var moveEvent = Browser.touchMoveEvent;
        var cancelEvent = Browser.isPointer ? 'pointerleave' : 'mouseleave';
        var keyEvent = 'keyup';
        var keyDownEvent = 'keydown';
        EventHandler.remove(this.element, startEvent, this.mouseDown);
        EventHandler.remove(this.element, moveEvent, this.mouseMove);
        EventHandler.remove(this.element, stopEvent, this.mouseUp);
        EventHandler.remove(this.element, keyEvent, this.keyUp);
        EventHandler.remove(document, keyDownEvent, this.keyDown);
    };
    __decorate([
        Property('S')
    ], SymbolPalette.prototype, "accessKey", void 0);
    __decorate([
        Property('100%')
    ], SymbolPalette.prototype, "width", void 0);
    __decorate([
        Property('100%')
    ], SymbolPalette.prototype, "height", void 0);
    __decorate([
        Collection([], Palette)
    ], SymbolPalette.prototype, "palettes", void 0);
    __decorate([
        Property()
    ], SymbolPalette.prototype, "getSymbolInfo", void 0);
    __decorate([
        Property({ fit: true })
    ], SymbolPalette.prototype, "symbolInfo", void 0);
    __decorate([
        Property()
    ], SymbolPalette.prototype, "filterSymbols", void 0);
    __decorate([
        Property()
    ], SymbolPalette.prototype, "ignoreSymbolsOnSearch", void 0);
    __decorate([
        Property()
    ], SymbolPalette.prototype, "getSymbolTemplate", void 0);
    __decorate([
        Property()
    ], SymbolPalette.prototype, "symbolWidth", void 0);
    __decorate([
        Property()
    ], SymbolPalette.prototype, "symbolHeight", void 0);
    __decorate([
        Complex({ left: 10, right: 10, top: 10, bottom: 10 }, Margin)
    ], SymbolPalette.prototype, "symbolMargin", void 0);
    __decorate([
        Property(true)
    ], SymbolPalette.prototype, "allowDrag", void 0);
    __decorate([
        Complex({}, SymbolPreview)
    ], SymbolPalette.prototype, "symbolPreview", void 0);
    __decorate([
        Complex({}, SymbolDragSize)
    ], SymbolPalette.prototype, "symbolDragSize", void 0);
    __decorate([
        Property(false)
    ], SymbolPalette.prototype, "enableSearch", void 0);
    __decorate([
        Property(true)
    ], SymbolPalette.prototype, "enableAnimation", void 0);
    __decorate([
        Property('Multiple')
    ], SymbolPalette.prototype, "expandMode", void 0);
    __decorate([
        Event()
    ], SymbolPalette.prototype, "paletteSelectionChange", void 0);
    __decorate([
        Event()
    ], SymbolPalette.prototype, "paletteExpanding", void 0);
    __decorate([
        Property()
    ], SymbolPalette.prototype, "getNodeDefaults", void 0);
    __decorate([
        Property()
    ], SymbolPalette.prototype, "nodeDefaults", void 0);
    __decorate([
        Property()
    ], SymbolPalette.prototype, "getConnectorDefaults", void 0);
    __decorate([
        Property()
    ], SymbolPalette.prototype, "connectorDefaults", void 0);
    return SymbolPalette;
}(Component));
export { SymbolPalette };

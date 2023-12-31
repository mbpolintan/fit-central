/**
 * Tree Map Components
 */
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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
import { Component, NotifyPropertyChanges, Property, extend, Ajax, isBlazor } from '@syncfusion/ej2-base';
import { Complex, Collection, resetBlazorTemplate } from '@syncfusion/ej2-base';
import { Event, Internationalization } from '@syncfusion/ej2-base';
import { SvgRenderer } from '@syncfusion/ej2-svg-base';
import { isNullOrUndefined, createElement, EventHandler, Browser, remove } from '@syncfusion/ej2-base';
import { Border, Margin, TitleSettings, LegendSettings, InitialDrillSettings } from './model/base';
import { SelectionSettings, TooltipSettings, LevelSettings, LeafItemSettings, HighlightSettings, } from './model/base';
import { Size, stringToNumber, RectOption, Rect, textTrim, measureText, findChildren, removeElement } from '../treemap/utils/helper';
import { removeClassNames, removeShape, textFormatter } from '../treemap/utils/helper';
import { findPosition, TextOption, renderTextElement, isContainsData, TreeMapAjax } from '../treemap/utils/helper';
import { load, loaded, drillStart, drillEnd } from '../treemap/model/constants';
import { itemClick, itemMove, click, mouseMove, resize, doubleClick, rightClick } from '../treemap/model/constants';
import { LayoutPanel } from './layout/render-panel';
import { DataManager, Query } from '@syncfusion/ej2-data';
import { getThemeStyle } from './model/theme';
import { Print } from './model/print';
import { ImageExport } from './model/image-export';
import { PdfExport } from './model/pdf-export';
/**
 * Represents the treemap component.
 * ```html
 * <div id="container"/>
 * <script>
 *   var treemap = new TreeMap();
 *   treemap.appendTo("#container");
 * </script>
 * ```
 */
var TreeMap = /** @class */ (function (_super) {
    __extends(TreeMap, _super);
    /**s
     * Constructor for TreeMap component.
     */
    function TreeMap(options, element) {
        var _this = _super.call(this, options, element) || this;
        /**
         * resize the treemap
         */
        _this.isResize = false;
        /** @private */
        _this.orientation = 'Horizontal';
        /** @private */
        _this.drilledItems = [];
        /** @private */
        _this.isHierarchicalData = false;
        /** @private */
        _this.levelSelection = [];
        /** @private */
        _this.legendId = [];
        return _this;
    }
    TreeMap.prototype.preRender = function () {
        var _this = this;
        this.isBlazor = isBlazor();
        this.trigger(load, { treemap: this.isBlazor ? null : this }, function () {
            _this.initPrivateVariable();
            _this.unWireEVents();
            _this.createSvg();
            _this.wireEVents();
            _this.setCulture();
        });
    };
    TreeMap.prototype.render = function () {
        LevelsData.levelsData = null;
        LevelsData.defaultLevelsData = null;
        LevelsData.hierarchyData = null;
        this.createSecondaryElement();
        this.addTabIndex();
        this.themeStyle = getThemeStyle(this.theme);
        this.renderBorder();
        this.renderTitle(this.titleSettings, 'title', null, null);
        if (!isNullOrUndefined(LevelsData.levelsData)) {
            LevelsData.defaultLevelsData = LevelsData.levelsData;
        }
        this.processDataManager();
    };
    /* tslint:disable:no-string-literal */
    /* tslint:disable:no-eval */
    TreeMap.prototype.processDataManager = function () {
        var _this = this;
        var dataModule;
        var queryModule;
        var ajaxModule;
        var localAjax;
        if (this.dataSource instanceof DataManager) {
            dataModule = this.dataSource;
            queryModule = this.query instanceof Query ? this.query : new Query();
            var dataManager = dataModule.executeQuery(queryModule);
            dataManager.then(function (e) {
                _this.dataSource = e['result'];
                _this.renderTreeMapElements();
            });
        }
        else if (this.dataSource instanceof TreeMapAjax) {
            localAjax = this.dataSource;
            ajaxModule = new Ajax(localAjax.dataOptions, localAjax.type, localAjax.async, localAjax.contentType);
            ajaxModule.onSuccess = function (args) {
                _this.dataSource = JSON.parse('[' + args + ']')[0];
                _this.renderTreeMapElements();
            };
            ajaxModule.send(localAjax.sendData);
        }
        else {
            this.renderTreeMapElements();
        }
    };
    TreeMap.prototype.renderTreeMapElements = function () {
        this.processingData();
        if (this.treeMapLegendModule && this.legendSettings.visible) {
            this.treeMapLegendModule.renderLegend();
        }
        this.layout.processLayoutPanel();
        this.element.appendChild(this.svgObject);
        this.elementChange();
        this.trigger(loaded, this.isBlazor ? { isResized: this.isResize } : { treemap: this, isResized: this.isResize });
        this.isResize = false;
        this.renderComplete();
    };
    TreeMap.prototype.createSvg = function () {
        if (this.svgObject) {
            while (this.svgObject.childNodes.length > 0) {
                this.svgObject.removeChild(this.svgObject.firstChild);
            }
            if (!this.svgObject.hasChildNodes() && this.svgObject.parentNode) {
                remove(this.svgObject);
            }
        }
        if (this.leafItemSettings.labelTemplate) {
            resetBlazorTemplate(this.element.id + '_LabelTemplate', 'LabelTemplate');
        }
        for (var i = 0; i < this.levels.length; i++) {
            if (this.levels[i].headerTemplate) {
                resetBlazorTemplate(this.element.id + '_HeaderTemplate', 'HeaderTemplate');
            }
        }
        var containerWidth = this.element.clientWidth;
        var containerHeight = this.element.clientHeight;
        this.availableSize = new Size(stringToNumber(this.width, containerWidth) || containerWidth || 600, stringToNumber(this.height, containerHeight) || containerHeight || 450);
        this.svgObject = this.renderer.createSvg({
            id: this.element.id + '_svg',
            width: this.availableSize.width,
            height: this.availableSize.height
        });
    };
    /**
     * To initilize the private varibales of treemap.
     */
    TreeMap.prototype.initPrivateVariable = function () {
        if (this.element.id === '') {
            var collection = document.getElementsByClassName('e-treemap').length;
            this.element.id = 'treemap_control_' + collection;
        }
        this.renderer = new SvgRenderer(this.element.id);
        this.layout = new LayoutPanel(this);
    };
    TreeMap.prototype.createSecondaryElement = function () {
        var secondaryEle = document.getElementById(this.element.id + '_Secondary_Element');
        if (secondaryEle && secondaryEle.childElementCount > 0) {
            secondaryEle.parentNode.removeChild(secondaryEle);
        }
        if (isNullOrUndefined(document.getElementById(this.element.id + '_Secondary_Element'))) {
            var secondaryElement = createElement('div', {
                id: this.element.id + '_Secondary_Element',
                styles: 'position: absolute;z-index:1;'
            });
            this.element.appendChild(secondaryElement);
        }
    };
    TreeMap.prototype.elementChange = function () {
        if (this.treeMapLegendModule && this.legendSettings.visible && this.treeMapLegendModule.legendGroup && this.layout.layoutGroup) {
            this.svgObject.insertBefore(this.layout.layoutGroup, this.treeMapLegendModule.legendGroup);
        }
    };
    /**
     * @private
     * Render the treemap border
     */
    TreeMap.prototype.renderBorder = function () {
        var width = this.border.width;
        var borderElement = this.svgObject.querySelector('#' + this.element.id + '_TreeMap_Border');
        if ((this.border.width > 0 || (this.background || this.themeStyle.backgroundColor)) && isNullOrUndefined(borderElement)) {
            var borderRect = new RectOption(this.element.id + '_TreeMap_Border', this.background || this.themeStyle.backgroundColor, this.border, 1, new Rect(width / 2, width / 2, this.availableSize.width - width, this.availableSize.height - width));
            this.svgObject.appendChild(this.renderer.drawRectangle(borderRect));
        }
        else if (borderElement) {
            borderElement.setAttribute('fill', this.background || this.themeStyle.backgroundColor);
        }
    };
    TreeMap.prototype.renderTitle = function (title, type, bounds, groupEle) {
        var style = title.textStyle;
        var height;
        var titlePadding = 10;
        var width = (this.availableSize.width - this.margin.right - this.margin.left);
        title.textStyle.fontFamily = this.themeStyle.fontFamily || title.textStyle.fontFamily;
        title.textStyle.size = this.themeStyle.fontSize || title.textStyle.size;
        if (title.text) {
            if (isNullOrUndefined(groupEle)) {
                groupEle = this.renderer.createGroup({ id: this.element.id + '_Title_Group' });
            }
            var trimmedTitle = textTrim(width, title.text, style);
            var elementSize = measureText(trimmedTitle, style);
            var rect = (isNullOrUndefined(bounds)) ? new Rect(this.margin.left, this.margin.top, this.availableSize.width, this.availableSize.height) : bounds;
            var location_1 = findPosition(rect, title.alignment, elementSize, type);
            var options = new TextOption(this.element.id + '_TreeMap_' + type, location_1.x, location_1.y, 'start', trimmedTitle);
            var titleBounds = new Rect(location_1.x, location_1.y, elementSize.width, elementSize.height);
            var element = renderTextElement(options, style, style.color || (type === 'title' ? this.themeStyle.titleFontColor : this.themeStyle.subTitleFontColor), groupEle);
            element.setAttribute('aria-label', title.description || title.text);
            element.setAttribute('tabindex', (this.tabIndex + (type === 'title' ? 1 : 2)).toString());
            if ((type === 'title' && !title.subtitleSettings.text) || (type === 'subtitle')) {
                height = (this.availableSize.height - titleBounds.y - titlePadding - this.margin.bottom);
                this.areaRect = new Rect(this.margin.left, titleBounds.y + titlePadding, width, height);
            }
            if (type !== 'subtitle' && title.subtitleSettings.text) {
                this.renderTitle(title.subtitleSettings, 'subtitle', titleBounds, groupEle);
            }
            else {
                this.svgObject.appendChild(groupEle);
            }
        }
        else {
            height = (this.availableSize.height - this.margin.top - this.margin.bottom);
            this.areaRect = new Rect(this.margin.left, this.margin.top, width, height);
        }
    };
    TreeMap.prototype.processingData = function () {
        var _this = this;
        var path;
        this.dataSource = this.dataSource;
        if (!isNullOrUndefined(this.dataSource) && this.dataSource.length > 0 && this.weightValuePath) {
            LevelsData.levelsData = [];
            this.dataSource.map(function (data) {
                data[_this.weightValuePath] = (data[_this.weightValuePath]) ? data[_this.weightValuePath].toString() :
                    data[_this.weightValuePath];
            });
            this.leafItemSettings.labelPath = this.leafItemSettings.labelPath || this.weightValuePath;
            this.checkIsHierarchicalData();
            if (this.levels.length === 0) {
                var data_1 = new Object();
                data_1['level'] = 0;
                path = this.leafItemSettings.labelPath;
                data_1[path] = [];
                for (var i = 0; i < this.dataSource.length; i++) {
                    var child = findChildren(this.dataSource[i])['values'];
                    if (this.isHierarchicalData && child && child.length > 0) {
                        child.forEach(function (currentData, dataIndex) {
                            if (currentData[path]) {
                                data_1[path].push({
                                    groupIndex: 0, name: currentData[path], levelOrderName: currentData[path].toString(),
                                    data: currentData, weight: currentData[_this.weightValuePath]
                                });
                            }
                        });
                    }
                    else {
                        if (this.dataSource[i][path]) {
                            data_1[path].push({
                                groupIndex: 0, name: this.dataSource[i][path], levelOrderName: this.dataSource[i][path].toString(), data: this.dataSource[i],
                                weight: this.dataSource[i][this.weightValuePath]
                            });
                        }
                    }
                }
                LevelsData.levelsData.push(data_1);
            }
            else {
                if (this.isHierarchicalData) {
                    LevelsData.hierarchyData = [];
                    LevelsData.hierarchyData = extend([], this.dataSource, LevelsData.hierarchyData, true);
                    for (var i = 0; i < LevelsData.hierarchyData.length; i++) {
                        this.processHierarchicalData(LevelsData.hierarchyData[i], i);
                    }
                    LevelsData.levelsData = LevelsData.hierarchyData;
                }
                else {
                    this.processFlatJsonData();
                    if (LevelsData.levelsData.length > 1) {
                        this.reOrderLevelData(LevelsData.levelsData.length - 1);
                    }
                }
                path = this.levels[0].groupPath;
            }
            if (!this.isHierarchicalData) {
                this.findTotalWeight(LevelsData.levelsData[0][path], 'Parent');
            }
        }
    };
    TreeMap.prototype.checkIsHierarchicalData = function () {
        var child;
        this.dataSource = this.dataSource;
        for (var i = 0; i < this.dataSource.length; i++) {
            child = findChildren(this.dataSource[i])['values'];
            if (child && child.length) {
                this.isHierarchicalData = true;
                break;
            }
            else if (i === this.dataSource.length - 1) {
                this.isHierarchicalData = false;
            }
        }
    };
    TreeMap.prototype.processHierarchicalData = function (data, dataCount) {
        var _this = this;
        var childData;
        var levelData = [];
        var newData = new Object();
        var levelIndex;
        var path = this.leafItemSettings.labelPath ? this.leafItemSettings.labelPath : this.weightValuePath;
        var currentData = new Object();
        var level;
        var key;
        newData = findChildren(data);
        childData = newData ? newData['values'] : null;
        if (childData && childData.length > 0) {
            key = newData['key'];
            for (var i = 0; i < this.levels.length; i++) {
                if (key === this.levels[i].groupPath) {
                    level = this.levels[i];
                    levelIndex = i;
                }
            }
            for (var j = 0; j < childData.length; j++) {
                childData[j]['name'] = childData[j][path];
                childData[j]['levelOrderName'] = (levelIndex === 0 ? childData[j]['name'] :
                    data['levelOrderName'] + '#' + childData[j]['name']) + '';
                var childItemLevel = childData[j]['levelOrderName'];
                var childLevel = void 0;
                if (childItemLevel.search('#') > 0) {
                    childLevel = childItemLevel.split('#').length - 1;
                }
                childData[j]['groupIndex'] = isNullOrUndefined(levelIndex) ? childLevel === this.levels.length
                    ? this.levels.length : childLevel : levelIndex;
                if (levelIndex !== 0) {
                    childData[j]['parent'] = data;
                }
                childData[j]['groupName'] = key;
                childData[j]['data'] = childData[j];
                childData[j]['isDrilled'] = false;
                childData[j]['weight'] = childData[j][this.weightValuePath];
            }
            childData.forEach(function (currentData) {
                _this.processHierarchicalData(currentData, dataCount);
            });
        }
        if (dataCount === LevelsData.hierarchyData.length - 1) {
            var mainData_1 = LevelsData.hierarchyData[0][this.levels[0].groupPath];
            for (var k = 0; k < LevelsData.hierarchyData.length; k++) {
                childData = findChildren(LevelsData.hierarchyData[k])['values'];
                if (k !== 0 && childData) {
                    childData.forEach(function (currentData) { mainData_1.push(currentData); });
                    LevelsData.hierarchyData.splice(k, 1);
                    k -= 1;
                }
            }
            mainData_1 = LevelsData.hierarchyData[0][this.levels[0].groupPath];
            for (var l = 0; l < mainData_1.length; l++) {
                newData[this.levels[0].groupPath] = mainData_1;
                mainData_1[l]['parent'] = newData;
            }
        }
    };
    /**
     * This method is used to perform the print functionality in treemap.
     * @param id - Specifies the element to print the treemap.
     */
    TreeMap.prototype.print = function (id) {
        if (this.allowPrint && this.printModule) {
            this.printModule.print(id);
        }
    };
    /**
     * This method is used to perform the export functionality for the rendered treemap.
     * @param type - Specifies the index of the axis.
     * @param fileName - Specifies file name for exporting the rendered treemap.
     * @param orientation - Specifies the orientation of the pdf document.
     */
    TreeMap.prototype.export = function (type, fileName, orientation, allowDownload) {
        var _this = this;
        if (isNullOrUndefined(allowDownload)) {
            allowDownload = true;
        }
        if (type === 'PDF' && this.allowPdfExport && this.pdfExportModule) {
            return new Promise(function (resolve, reject) {
                resolve(_this.pdfExportModule.export(type, fileName, orientation, allowDownload));
            });
        }
        else if (this.allowImageExport && (type !== 'PDF') && this.imageExportModule) {
            return new Promise(function (resolve, reject) {
                resolve(_this.imageExportModule.export(type, fileName, allowDownload));
            });
        }
        return null;
    };
    /* tslint:disable:no-string-literal */
    TreeMap.prototype.processFlatJsonData = function () {
        this.dataSource = this.dataSource;
        var groupPath;
        var childGroupPath;
        var orderNames = [];
        var process = false;
        for (var i = 0; i < this.levels.length + 1; i++) {
            groupPath = this.levels[i] ? this.levels[i].groupPath : this.leafItemSettings.labelPath;
            var level = new Object();
            level['level'] = i;
            level[groupPath] = [];
            LevelsData.levelsData.push(level);
            for (var j = 0; j < this.dataSource.length; j++) {
                var currentData = {};
                var childName = '';
                if (this.dataSource[j][groupPath]) {
                    var name_1 = this.dataSource[j][groupPath];
                    if (i !== 0) {
                        for (var k = 0; k <= i; k++) {
                            var childGroupPath_1 = this.levels[k] ? this.levels[k].groupPath : groupPath;
                            childName += (this.dataSource[j][childGroupPath_1]) + ((k === i) ? '' : '#');
                        }
                    }
                    if (!(orderNames.length > 0 ? orderNames.indexOf(childName ?
                        childName : name_1) !== -1 : false)) {
                        currentData['name'] = name_1;
                        currentData['levelOrderName'] = ((childName) ? childName : name_1) + '';
                        currentData['groupIndex'] = i;
                        currentData['isDrilled'] = false;
                        currentData['groupName'] = groupPath;
                        currentData['data'] = this.dataSource[j];
                        LevelsData.levelsData[LevelsData.levelsData.length - 1][groupPath].push(currentData);
                        orderNames.push((childName) ? childName : name_1);
                    }
                }
            }
        }
    };
    /**
     * This method orders the treemap level data.
     * @param start - Specifies the start value of the treemap level.
     */
    TreeMap.prototype.reOrderLevelData = function (start) {
        var currentName;
        var currentPath = this.levels[start] ? this.levels[start].groupPath : this.leafItemSettings.labelPath;
        var prevPath = this.levels[start - 1].groupPath;
        var currentData = LevelsData.levelsData[start][currentPath];
        var previousData = LevelsData.levelsData[start - 1][prevPath];
        for (var i = 0; i < currentData.length; i++) {
            currentName = currentData[i]['levelOrderName'];
            for (var j = 0; j < previousData.length; j++) {
                previousData[j][currentPath] = isNullOrUndefined(previousData[j][currentPath]) ? [] : previousData[j][currentPath];
                if (currentName.indexOf(previousData[j]['levelOrderName']) !== -1) {
                    if (isNullOrUndefined(currentData[i]['parent'])) {
                        currentData[i]['parent'] = previousData[j];
                    }
                    previousData[j][currentPath].push(currentData[i]);
                    break;
                }
            }
        }
        this.findTotalWeight(LevelsData.levelsData[LevelsData.levelsData.length - 1][currentPath], 'Child');
        LevelsData.levelsData.splice(start, 1);
        if ((start - 1) > 0) {
            this.reOrderLevelData(start - 1);
        }
    };
    /**
     * This method finds the weight value of the treemap level.
     * @param processData - Specifies the treemap data.
     * @param type - Specifies the type of the data.
     */
    TreeMap.prototype.findTotalWeight = function (processData, type) {
        var _this = this;
        var totalWeight;
        var childData;
        var levelName;
        var start = 0;
        var split;
        var groupName;
        var groupObj = new Object();
        var _loop_1 = function (i) {
            totalWeight = 0;
            groupName = processData[i]['groupName'];
            split = processData[i]['levelOrderName'].split('#');
            this_1.dataSource.forEach(function (data) {
                if (isContainsData(split, processData[i]['levelOrderName'], data, _this)) {
                    totalWeight += parseFloat(data[_this.weightValuePath]);
                }
            });
            if (type === 'Parent') {
                groupObj[groupName] = processData;
                processData[i]['parent'] = groupObj;
            }
            processData[i]['weight'] = totalWeight;
        };
        var this_1 = this;
        for (var i = 0; i < processData.length; i++) {
            _loop_1(i);
        }
    };
    /**
     * To unbind event handlers for treemap.
     */
    TreeMap.prototype.unWireEVents = function () {
        EventHandler.remove(this.element, 'click', this.clickOnTreeMap);
        EventHandler.remove(this.element, 'dblclick', this.doubleClickOnTreeMap);
        EventHandler.remove(this.element, 'contextmenu', this.rightClickOnTreeMap);
        EventHandler.remove(this.element, Browser.touchStartEvent, this.mouseDownOnTreeMap);
        EventHandler.remove(this.element, Browser.touchMoveEvent, this.mouseMoveOnTreeMap);
        EventHandler.remove(this.element, Browser.touchEndEvent, this.mouseEndOnTreeMap);
        EventHandler.remove(this.element, 'pointerleave mouseleave', this.mouseLeaveOnTreeMap);
        window.removeEventListener('resize', this.resizeOnTreeMap);
    };
    /**
     * To bind event handlers for treemap.
     */
    TreeMap.prototype.wireEVents = function () {
        EventHandler.add(this.element, 'click', this.clickOnTreeMap, this);
        EventHandler.add(this.element, 'dblclick', this.doubleClickOnTreeMap, this);
        EventHandler.add(this.element, 'contextmenu', this.rightClickOnTreeMap, this);
        EventHandler.add(this.element, Browser.touchStartEvent, this.mouseDownOnTreeMap, this);
        EventHandler.add(this.element, Browser.touchMoveEvent, this.mouseMoveOnTreeMap, this);
        EventHandler.add(this.element, Browser.touchEndEvent, this.mouseEndOnTreeMap, this);
        EventHandler.add(this.element, 'pointerleave mouseleave', this.mouseLeaveOnTreeMap, this);
        window.addEventListener('resize', this.resizeOnTreeMap.bind(this));
    };
    /**
     * Method to set culture for maps
     */
    TreeMap.prototype.setCulture = function () {
        this.intl = new Internationalization();
    };
    /**
     * To add tab index for treemap element
     */
    TreeMap.prototype.addTabIndex = function () {
        this.element.setAttribute('aria-label', this.description || 'TreeMap Element');
        this.element.setAttribute('tabindex', this.tabIndex.toString());
    };
    /**
     * This method handles the window resize event on treemap.
     * @param e - Specifies the pointer event.
     */
    TreeMap.prototype.resizeOnTreeMap = function (e) {
        var _this = this;
        this.isResize = true;
        var args = {
            name: resize,
            cancel: false,
            previousSize: this.availableSize,
            currentSize: new Size(0, 0),
            treemap: this.isBlazor ? null : this
        };
        if (this.isBlazor) {
            var treemap = args.treemap, blazorEventArgs = __rest(args, ["treemap"]);
            args = blazorEventArgs;
        }
        if (this.resizeTo) {
            clearTimeout(this.resizeTo);
        }
        if (this.element.classList.contains('e-treemap')) {
            this.resizeTo = setTimeout(function () {
                _this.unWireEVents();
                _this.createSvg();
                _this.refreshing = true;
                _this.wireEVents();
                args.currentSize = _this.availableSize;
                _this.trigger(resize, args, function (observedArgs) {
                    _this.render();
                });
            }, 500);
        }
    };
    /**
     * This method handles the click event on the treemap.
     * @param e - Specifies the mouse click event in the treemap.
     */
    TreeMap.prototype.clickOnTreeMap = function (e) {
        var _this = this;
        var targetEle = e.target;
        var targetId = targetEle.id;
        var eventArgs;
        var itemIndex;
        var labelText = targetEle.innerHTML;
        var clickArgs = { cancel: false, name: click, treemap: this, mouseEvent: e };
        var clickBlazorArgs = { cancel: false, name: click, mouseEvent: e };
        this.trigger(click, this.isBlazor ? clickBlazorArgs : clickArgs);
        if (targetId.indexOf('_Item_Index') > -1) {
            e.preventDefault();
            itemIndex = parseFloat(targetId.split('_')[6]);
            eventArgs = {
                cancel: false, name: itemClick, treemap: this, item: this.layout.renderItems[itemIndex], mouseEvent: e,
                groupIndex: this.layout.renderItems[itemIndex]['groupIndex'], groupName: this.layout.renderItems[itemIndex]['name'],
                text: labelText, contentItemTemplate: labelText
            };
            if (this.isBlazor) {
                var data = {
                    groupIndex: eventArgs.item['groupIndex'],
                    groupName: eventArgs.item['groupName'],
                    isDrilled: eventArgs.item['isDrilled'],
                    isLeafItem: eventArgs.item['isLeafItem'],
                    itemArea: eventArgs.item['itemArea'],
                    levelOrderName: eventArgs.item['levelOrderName'],
                    name: eventArgs.item['name'],
                    options: eventArgs.item['options'],
                    rect: eventArgs.item['rect']
                };
                eventArgs.item = this.layout.renderItems[itemIndex]['data'];
                var treemap = eventArgs.treemap, blazorEventArgs = __rest(eventArgs, ["treemap"]);
                eventArgs = blazorEventArgs;
            }
            this.trigger(itemClick, eventArgs, function (observedArgs) {
                if (observedArgs.text !== labelText || observedArgs.contentItemTemplate !== labelText) {
                    if (isNullOrUndefined(_this.leafItemSettings.labelTemplate)) {
                        observedArgs.text = textFormatter(observedArgs.text, observedArgs['item']['data'], observedArgs.treemap);
                        targetEle.innerHTML = observedArgs.text;
                    }
                    else {
                        var itemSelect = targetId.split('_RectPath')[0];
                        var itemTemplate = void 0;
                        if (targetId.indexOf('_LabelTemplate') > -1) {
                            itemTemplate = targetEle;
                        }
                        else {
                            itemTemplate = document.querySelector('#' + itemSelect + '_LabelTemplate');
                        }
                        if (!isNullOrUndefined(itemTemplate)) {
                            if (_this.isBlazor) {
                                var templateElement = createElement('div');
                                templateElement.innerHTML = observedArgs.contentItemTemplate;
                                var currentTemplateElement = templateElement.children[0].firstElementChild;
                                itemTemplate['style']['left'] = Number(itemTemplate['style']['left'].split('px')[0])
                                    - (currentTemplateElement['style']['width'].split('px')[0] / 2) + 'px';
                                itemTemplate['style']['top'] = Number(itemTemplate['style']['top'].split('px')[0])
                                    - (currentTemplateElement['style']['height'].split('px')[0] / 2) + 'px';
                            }
                            itemTemplate.innerHTML = observedArgs.contentItemTemplate;
                        }
                    }
                }
            });
        }
        var end = new Date().getMilliseconds();
        var doubleTapTimer1;
        if (!isNullOrUndefined(this.doubleClick)) {
            if (!isNullOrUndefined(doubleTapTimer1) && end - doubleTapTimer1 < 500) {
                this.doubleClickOnTreeMap(e);
            }
            doubleTapTimer1 = end;
        }
    };
    /**
     * This method handles the double click event in the treemap.
     * @param e - Specifies the pointer event of mouse click.
     */
    TreeMap.prototype.doubleClickOnTreeMap = function (e) {
        var doubleClickArgs = { cancel: false, name: doubleClick, treemap: this, mouseEvent: e };
        var doubleClickBlazorArgs = { cancel: false, name: doubleClick, mouseEvent: e };
        this.trigger(doubleClick, this.isBlazor ? doubleClickBlazorArgs : doubleClickArgs);
        //this.notify('dblclick', e);
    };
    /**
     * This method handles the right click event in the treemap.
     * @param e - Specifies the pointer event of mouse click.
     */
    TreeMap.prototype.rightClickOnTreeMap = function (e) {
        var rightClickArgs = { cancel: false, name: rightClick, treemap: this, mouseEvent: e };
        var rightClickBlazorArgs = { cancel: false, name: rightClick, mouseEvent: e };
        this.trigger(rightClick, this.isBlazor ? rightClickBlazorArgs : rightClickArgs);
    };
    /**
     * This method handles the mouse down event in the treemap.
     * @param e - Specifies the pointer event of mouse click.
     */
    /* tslint:disable-next-line:max-func-body-length */
    TreeMap.prototype.mouseDownOnTreeMap = function (e) {
        if (e.target.id.indexOf('_Item_Index') > -1) {
            this.mouseDown = true;
        }
        this.notify(Browser.touchStartEvent, e);
    };
    /**
     * This method handles the mouse move event in the treemap.
     * @param e - Specifies the pointer event of mouse click.
     */
    TreeMap.prototype.mouseMoveOnTreeMap = function (e) {
        var targetEle = e.target;
        var targetId = targetEle.id;
        var eventArgs;
        var item;
        var moveArgs = { cancel: false, name: mouseMove, treemap: this, mouseEvent: e };
        var moveBlazorArgs = { cancel: false, name: mouseMove, mouseEvent: e };
        this.trigger(mouseMove, this.isBlazor ? moveBlazorArgs : moveArgs);
        var childItems;
        if (targetId.indexOf('_Item_Index') > -1) {
            item = this.layout.renderItems[parseFloat(targetId.split('_')[6])];
            childItems = findChildren(item)['values'];
            this.element.style.cursor = (!item['isLeafItem'] && childItems && childItems.length > 0 && this.enableDrillDown) ?
                'pointer' : 'auto';
            eventArgs = { cancel: false, name: itemMove, treemap: this, item: item, mouseEvent: e };
            if (this.isBlazor) {
                var data = {
                    isLeafItem: eventArgs.item['isLeafItem'],
                    groupIndex: eventArgs.item['groupIndex'],
                    groupName: eventArgs.item['groupName'],
                    isDrilled: eventArgs.item['isDrilled'],
                    itemArea: eventArgs.item['itemArea'],
                    levelOrderName: eventArgs.item['levelOrderName'],
                    name: eventArgs.item['name'],
                    rect: eventArgs.item['rect'],
                    options: eventArgs.item['options']
                };
                eventArgs.item = data;
                var treemap = eventArgs.treemap, blazorEventArgs = __rest(eventArgs, ["treemap"]);
                eventArgs = blazorEventArgs;
            }
            this.trigger(itemMove, eventArgs);
        }
        this.notify(Browser.touchMoveEvent, e);
    };
    /**
     * This method calculates the selected treemap levels.
     * @param labelText - Specifies the label text.
     * @param item - Specifies the treemap item.
     */
    TreeMap.prototype.calculateSelectedTextLevels = function (labelText, item) {
        //to find the levels by clicking the particular text both for drillDownView as true / false.
        var drillLevel;
        var k;
        var text;
        var levelLabels = item['levelOrderName'];
        var levelText = levelLabels.split('#');
        for (var _i = 0, _a = Object.keys(levelText); _i < _a.length; _i++) {
            k = _a[_i];
            if (levelText[k] === labelText) {
                drillLevel = parseInt(k, 10);
                text = labelText;
            }
        }
        return { drillLevel: drillLevel, currentLevelLabel: text, levelText: levelText };
    };
    /**
     * This method calculates the previous level of child items in treemap.
     * @param labelText - Specifies the label text in treemap
     * @param drillLevelValues - Specifies the values of drill level.
     * @param item - Specifies the treemap item.
     * @param directLevel - Specifies the current level.
     */
    TreeMap.prototype.calculatePreviousLevelChildItems = function (labelText, drillLevelValues, item, directLevel) {
        //By clicking any child items drilldown to the particular level.
        //At the time store all the previous drilled level items in drilledItems
        // This condition satisfies while drilldown View is set as false and the text contains '[+]'
        var text;
        var p = 0;
        var levelItems;
        var text1;
        var drillTextLevel = this.layout.renderItems[0]['levelOrderName'].split('#').length;
        for (var h = 0; h < drillTextLevel; h++) {
            text1 = h === 0 ? drillLevelValues['levelText'][h] : text1 + '#' + drillLevelValues['levelText'][h];
        }
        p = drillTextLevel > 1 ? drillTextLevel : p;
        for (var _i = 0, _a = Object['values'](this.layout.renderItems); _i < _a.length; _i++) {
            levelItems = _a[_i];
            var drillLevelText = levelItems['levelOrderName'].split('#');
            if (drillLevelText[0] === drillLevelValues['levelText'][0]) {
                text = p === 0 ? isNullOrUndefined(text1) ? text1 : drillLevelValues['levelText'][p] :
                    directLevel ? text1 : text1 + '#' + drillLevelValues['levelText'][p];
                if (text === levelItems['levelOrderName']) {
                    this.drilledItems.push({ name: levelItems['levelOrderName'], data: levelItems });
                    p++;
                    directLevel = true;
                    if (p <= item['groupIndex']) {
                        text = text + '#' + drillLevelValues['levelText'][p];
                        text1 = text;
                    }
                }
            }
        }
        return directLevel;
    };
    /**
     * This method compares the selected labels with the drill down items.
     * @param drillLevelValues - Specifies the values of drill level.
     * @param item - Specifies the treemap item.
     * @param i - Specifies the treemap item.
     */
    TreeMap.prototype.compareSelectedLabelWithDrillDownItems = function (drillLevelValues, item, i) {
        var drillLevelChild;
        var newDrillItem = new Object();
        var b = drillLevelValues['drillLevel'] + 1;
        if (b === this.drilledItems[i]['data']['groupIndex']) {
            drillLevelChild = this.drilledItems[i]['data']['parent'];
            drillLevelChild['isDrilled'] = true;
            newDrillItem[drillLevelChild[this.drilledItems[i]['data']['groupName']]]
                = [drillLevelChild];
            // to remove all the items after matched drilled items
            this.drilledItems.splice(i, this.drilledItems.length);
        }
        else if (drillLevelValues['drillLevel'] === (this.drilledItems.length - 1)
            || drillLevelValues['drillLevel'] === item['groupIndex']) {
            newDrillItem[item['groupName']] = [item];
        }
        return newDrillItem;
    };
    /**
     * This method handles mouse end event in treemap.
     * @param e - Specifies the pointer event of mouse.
     */
    /* tslint:disable-next-line:max-func-body-length */
    TreeMap.prototype.mouseEndOnTreeMap = function (e) {
        var _this = this;
        var targetEle = e.target;
        var targetId = targetEle.id;
        var totalRect;
        var startEvent;
        var endEvent;
        var directLevel = false;
        var index;
        var newDrillItem = new Object();
        var item;
        var process = true;
        var layoutID = this.element.id + '_TreeMap_' + this.layoutType + '_Layout';
        var drillLevel;
        var templateID = this.element.id + '_Label_Template_Group';
        var drillLevelValues;
        var endBlazorEvent;
        if (targetId.indexOf('_Item_Index') > -1 && this.enableDrillDown && !this.drillMouseMove) {
            e.preventDefault();
            index = parseFloat(targetId.split('_')[6]);
            item = this.layout.renderItems[index];
            var labelText = targetEle.innerHTML;
            if (this.enableBreadcrumb) {
                drillLevelValues = this.calculateSelectedTextLevels(labelText, item);
                drillLevel = drillLevelValues['drillLevel'];
                if (!this.drillDownView && labelText.search('[+]') !== -1) {
                    directLevel = this.calculatePreviousLevelChildItems(labelText, drillLevelValues, item, directLevel);
                }
            }
            if (this.levels.length !== 0 && !item['isLeafItem'] && findChildren(item)['values'] &&
                findChildren(item)['values'].length > 0) {
                if (this.drilledItems.length > 0) {
                    item = directLevel ? this.drilledItems[this.drilledItems.length - 1]['data'] : item;
                    for (var i = 0; i < this.drilledItems.length; i++) {
                        if (!isNullOrUndefined(drillLevel)) { //Compare the selected text level with drilled items
                            var drillLength = this.drilledItems.length;
                            newDrillItem = this.compareSelectedLabelWithDrillDownItems(drillLevelValues, item, i);
                            if (drillLength !== this.drilledItems.length) {
                                i -= 1;
                                break;
                            }
                        } //when clicking the levels drill back to the previous level process takes place
                        if (item['levelOrderName'] === this.drilledItems[i]['name'] && !directLevel && isNullOrUndefined(drillLevel)) {
                            if (item['groupIndex'] === 0 && item['parent'][item['groupName']] instanceof Array) {
                                item['isDrilled'] = !(item['isDrilled']);
                                if (!item['isDrilled']) {
                                    newDrillItem = item['parent'];
                                }
                                else {
                                    newDrillItem[item['groupName']] = [item];
                                }
                            }
                            else {
                                item['isDrilled'] = false;
                                item['parent']['isDrilled'] = true;
                                item = item['parent'];
                                newDrillItem[item['groupName']] = [item];
                            }
                            this.drilledItems.splice(i, 1);
                            i -= 1;
                            break;
                        }
                        else if (i === this.drilledItems.length - 1 && isNullOrUndefined(drillLevel)) {
                            item['isDrilled'] = true; // click the items move to next level.
                            newDrillItem[item['groupName']] = [item];
                        }
                    }
                }
                else {
                    item['isDrilled'] = true;
                    newDrillItem[item['groupName']] = [item];
                }
                startEvent = {
                    cancel: false, name: drillStart, treemap: this.isBlazor ? null : this,
                    element: targetEle, groupIndex: this.enableBreadcrumb &&
                        this.drilledItems.length !== 0 && !isNullOrUndefined(drillLevel) ?
                        this.drilledItems[this.drilledItems.length - 1]['data']['groupIndex'] : item['groupIndex'],
                    groupName: this.enableBreadcrumb && this.drilledItems.length !== 0 && !isNullOrUndefined(drillLevel) ?
                        this.drilledItems[this.drilledItems.length - 1]['data']['name'] : item['name'],
                    rightClick: e.which === 3 ? true : false, childItems: null, item: this.isBlazor ? null : newDrillItem,
                };
                if (this.isBlazor) {
                    var treemap = startEvent.treemap, blazorEventArgs = __rest(startEvent, ["treemap"]);
                    startEvent = blazorEventArgs;
                }
                this.trigger(drillStart, startEvent, function (observedArgs) {
                    _this.currentLevel = item['isDrilled'] && isNullOrUndefined(drillLevel) ? item['groupIndex'] :
                        (!isNullOrUndefined(drillLevel) && _this.enableBreadcrumb && item['isDrilled']) ? drillLevel : null;
                    if (!observedArgs.cancel) {
                        if (document.getElementById(layoutID)) {
                            var layerElementId = document.getElementById(layoutID);
                            layerElementId.parentNode.removeChild(layerElementId);
                        }
                        totalRect = extend({}, _this.areaRect, totalRect, true);
                        if (_this.legendSettings.visible && !isNullOrUndefined(_this.treeMapLegendModule)) {
                            if (!isNullOrUndefined(newDrillItem)) {
                                _this.treeMapLegendModule.legendGroup.textContent = '';
                                _this.treeMapLegendModule.legendGroup = null;
                                _this.treeMapLegendModule.widthIncrement = 0;
                                _this.treeMapLegendModule.heightIncrement = 0;
                                if (_this.enableBreadcrumb && !isNullOrUndefined(drillLevel)) {
                                    _this.drilledLegendItems = {
                                        name: _this.drilledItems[_this.drilledItems.length - 1]['data']['levelOrderName'],
                                        data: _this.drilledItems[_this.drilledItems.length - 1]['data']
                                    };
                                }
                                else {
                                    _this.drilledLegendItems = { name: item['levelOrderName'], data: item };
                                }
                                _this.treeMapLegendModule.renderLegend();
                            }
                            totalRect = !isNullOrUndefined(_this.totalRect) ? _this.totalRect : totalRect;
                        }
                        if (document.getElementById(templateID)) {
                            var drillElementId = document.getElementById(templateID);
                            drillElementId.parentNode.removeChild(drillElementId);
                        }
                        if (!isNullOrUndefined(observedArgs.childItems) && !observedArgs.cancel) {
                            _this.layout.onDemandProcess(observedArgs.childItems);
                        }
                        else {
                            _this.layout.calculateLayoutItems(newDrillItem, totalRect);
                            _this.layout.renderLayoutItems(newDrillItem);
                        }
                    }
                });
                endEvent = { cancel: false, name: drillEnd, treemap: this, renderItems: this.layout.renderItems };
                endBlazorEvent = { cancel: false, name: drillEnd, renderItems: this.isBlazor ? null : this.layout.renderItems };
                this.trigger(drillEnd, this.isBlazor ? endBlazorEvent : endEvent);
                if (process) {
                    if (!directLevel && isNullOrUndefined(drillLevel)) {
                        this.drilledItems.push({ name: item['levelOrderName'], data: item });
                    }
                }
            }
        }
        this.mouseDown = false;
        this.notify(Browser.touchEndEvent, e);
    };
    /**
     * This method handles mouse leave event in treemap.
     * @param e - Specifies the pointer event of mouse.
     */
    TreeMap.prototype.mouseLeaveOnTreeMap = function (e) {
        if (this.treeMapTooltipModule) {
            this.treeMapTooltipModule.removeTooltip();
        }
        if (this.treeMapLegendModule) {
            this.treeMapLegendModule.removeInteractivePointer();
        }
        removeClassNames(document.getElementsByClassName('treeMapHighLight'), 'treeMapHighLight', this);
        if (this.treeMapHighlightModule) {
            removeShape(this.treeMapHighlightModule.shapeHighlightCollection, 'highlight');
            this.treeMapHighlightModule.highLightId = '';
        }
    };
    /**
     * This method is used to select or remove the selection of treemap item based on the provided selection settings.
     */
    TreeMap.prototype.selectItem = function (levelOrder, isSelected) {
        if (isNullOrUndefined(isSelected)) {
            isSelected = true;
        }
        var levelOrderName = '';
        for (var i = 0; i < levelOrder.length; i++) {
            if (i !== levelOrder.length - 1) {
                levelOrderName += levelOrder[i] + '#';
            }
            else {
                levelOrderName += levelOrder[i];
            }
        }
        if (this.treeMapSelectionModule && this.selectionSettings.enable) {
            this.treeMapSelectionModule.selectTreemapItem(levelOrderName, isSelected);
        }
    };
    /**
     * To provide the array of modules needed for maps rendering
     * @return {ModuleDeclaration[]}
     * @private
     */
    TreeMap.prototype.requiredModules = function () {
        var modules = [];
        if (this.tooltipSettings.visible) {
            modules.push({
                member: 'treeMapTooltip',
                args: [this]
            });
        }
        if (this.highlightSettings.enable) {
            modules.push({
                member: 'treeMapHighlight',
                args: [this]
            });
        }
        if (this.selectionSettings.enable) {
            modules.push({
                member: 'treeMapSelection',
                args: [this]
            });
        }
        if (this.legendSettings.visible) {
            modules.push({
                member: 'treeMapLegend',
                args: [this]
            });
        }
        if (this.allowPrint) {
            modules.push({
                member: 'Print',
                args: [this, Print]
            });
        }
        if (this.allowImageExport) {
            modules.push({
                member: 'ImageExport',
                args: [this, ImageExport]
            });
        }
        if (this.allowPdfExport) {
            modules.push({
                member: 'PdfExport',
                args: [this, PdfExport]
            });
        }
        return modules;
    };
    /**
     * Called internally if any of the property value changed.
     * @private
     */
    TreeMap.prototype.onPropertyChanged = function (newProp, oldProp) {
        var render = false;
        for (var _i = 0, _a = Object.keys(newProp); _i < _a.length; _i++) {
            var prop = _a[_i];
            switch (prop) {
                case 'background':
                    this.renderBorder();
                    break;
                case 'height':
                case 'width':
                case 'layoutType':
                case 'levels':
                case 'drillDownView':
                case 'renderDirection':
                case 'leafItemSettings':
                case 'legendSettings':
                case 'dataSource':
                    render = true;
                    break;
            }
        }
        if (render) {
            this.createSvg();
            this.render();
        }
    };
    /**
     * Gets component name.
     */
    TreeMap.prototype.getModuleName = function () {
        return 'treemap';
    };
    /**
     * This method is used to dispose the treemap component.
     */
    TreeMap.prototype.destroy = function () {
        this.unWireEVents();
        this.drilledItems = [];
        this.levelSelection = [];
        this.legendId = [];
        this.removeSvg();
        _super.prototype.destroy.call(this);
    };
    TreeMap.prototype.removeSvg = function () {
        removeElement(this.element.id + '_Secondary_Element');
        if (this.svgObject) {
            while (this.svgObject.childNodes.length > 0) {
                this.svgObject.removeChild(this.svgObject.firstChild);
            }
            if (!this.svgObject.hasChildNodes() && this.svgObject.parentNode) {
                remove(this.svgObject);
            }
        }
    };
    /**
     * Get the properties to be maintained in the persisted state.
     * @private
     */
    TreeMap.prototype.getPersistData = function () {
        return '';
    };
    __decorate([
        Property(false)
    ], TreeMap.prototype, "allowPrint", void 0);
    __decorate([
        Property(false)
    ], TreeMap.prototype, "allowImageExport", void 0);
    __decorate([
        Property(false)
    ], TreeMap.prototype, "allowPdfExport", void 0);
    __decorate([
        Property(null)
    ], TreeMap.prototype, "width", void 0);
    __decorate([
        Property(null)
    ], TreeMap.prototype, "height", void 0);
    __decorate([
        Complex({}, Border)
    ], TreeMap.prototype, "border", void 0);
    __decorate([
        Complex({}, Margin)
    ], TreeMap.prototype, "margin", void 0);
    __decorate([
        Property(null)
    ], TreeMap.prototype, "background", void 0);
    __decorate([
        Property('Material')
    ], TreeMap.prototype, "theme", void 0);
    __decorate([
        Complex({}, TitleSettings)
    ], TreeMap.prototype, "titleSettings", void 0);
    __decorate([
        Property('Squarified')
    ], TreeMap.prototype, "layoutType", void 0);
    __decorate([
        Property(null)
    ], TreeMap.prototype, "dataSource", void 0);
    __decorate([
        Property(null)
    ], TreeMap.prototype, "query", void 0);
    __decorate([
        Property(null)
    ], TreeMap.prototype, "weightValuePath", void 0);
    __decorate([
        Property('')
    ], TreeMap.prototype, "rangeColorValuePath", void 0);
    __decorate([
        Property('')
    ], TreeMap.prototype, "equalColorValuePath", void 0);
    __decorate([
        Property(null)
    ], TreeMap.prototype, "colorValuePath", void 0);
    __decorate([
        Property([])
    ], TreeMap.prototype, "palette", void 0);
    __decorate([
        Property('TopLeftBottomRight')
    ], TreeMap.prototype, "renderDirection", void 0);
    __decorate([
        Property(false)
    ], TreeMap.prototype, "enableDrillDown", void 0);
    __decorate([
        Property(false)
    ], TreeMap.prototype, "enableBreadcrumb", void 0);
    __decorate([
        Property(' - ')
    ], TreeMap.prototype, "breadcrumbConnector", void 0);
    __decorate([
        Property(false)
    ], TreeMap.prototype, "drillDownView", void 0);
    __decorate([
        Complex({}, InitialDrillSettings)
    ], TreeMap.prototype, "initialDrillDown", void 0);
    __decorate([
        Complex({}, LeafItemSettings)
    ], TreeMap.prototype, "leafItemSettings", void 0);
    __decorate([
        Collection([], LevelSettings)
    ], TreeMap.prototype, "levels", void 0);
    __decorate([
        Complex({}, HighlightSettings)
    ], TreeMap.prototype, "highlightSettings", void 0);
    __decorate([
        Complex({}, SelectionSettings)
    ], TreeMap.prototype, "selectionSettings", void 0);
    __decorate([
        Complex({}, TooltipSettings)
    ], TreeMap.prototype, "tooltipSettings", void 0);
    __decorate([
        Complex({}, LegendSettings)
    ], TreeMap.prototype, "legendSettings", void 0);
    __decorate([
        Property(false)
    ], TreeMap.prototype, "useGroupingSeparator", void 0);
    __decorate([
        Property(null)
    ], TreeMap.prototype, "description", void 0);
    __decorate([
        Property(1)
    ], TreeMap.prototype, "tabIndex", void 0);
    __decorate([
        Property(null)
    ], TreeMap.prototype, "format", void 0);
    __decorate([
        Event()
    ], TreeMap.prototype, "load", void 0);
    __decorate([
        Event()
    ], TreeMap.prototype, "beforePrint", void 0);
    __decorate([
        Event()
    ], TreeMap.prototype, "loaded", void 0);
    __decorate([
        Event()
    ], TreeMap.prototype, "itemRendering", void 0);
    __decorate([
        Event()
    ], TreeMap.prototype, "drillStart", void 0);
    __decorate([
        Event()
    ], TreeMap.prototype, "drillEnd", void 0);
    __decorate([
        Event()
    ], TreeMap.prototype, "itemSelected", void 0);
    __decorate([
        Event()
    ], TreeMap.prototype, "itemHighlight", void 0);
    __decorate([
        Event()
    ], TreeMap.prototype, "tooltipRendering", void 0);
    __decorate([
        Event()
    ], TreeMap.prototype, "itemClick", void 0);
    __decorate([
        Event()
    ], TreeMap.prototype, "itemMove", void 0);
    __decorate([
        Event()
    ], TreeMap.prototype, "click", void 0);
    __decorate([
        Event()
    ], TreeMap.prototype, "doubleClick", void 0);
    __decorate([
        Event()
    ], TreeMap.prototype, "rightClick", void 0);
    __decorate([
        Event()
    ], TreeMap.prototype, "mouseMove", void 0);
    __decorate([
        Event()
    ], TreeMap.prototype, "resize", void 0);
    __decorate([
        Event()
    ], TreeMap.prototype, "legendItemRendering", void 0);
    __decorate([
        Event()
    ], TreeMap.prototype, "legendRendering", void 0);
    TreeMap = __decorate([
        NotifyPropertyChanges
    ], TreeMap);
    return TreeMap;
}(Component));
export { TreeMap };
/**
 * @private
 */
var LevelsData = /** @class */ (function () {
    function LevelsData() {
    }
    return LevelsData;
}());
export { LevelsData };

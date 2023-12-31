var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
import { Rect, itemsToOrder, TextOption, measureText, textTrim, hide, wordWrap, textWrap, getTemplateFunction, convertElement, findLabelLocation, PathOption, textFormatter, colorNameToHex, convertHexToColor, colorMap, measureElement, convertToContainer, convertToRect, getShortestEdge, getArea, orderByArea, isParentItem, maintainSelection } from '../utils/helper';
import { isNullOrUndefined, createElement, extend, updateBlazorTemplate } from '@syncfusion/ej2-base';
import { Location, findChildren, renderTextElement } from '../utils/helper';
import { itemRendering } from '../model/constants';
import { LevelsData } from './../treemap';
/**
 * To calculate and render the shape layer
 */
var LayoutPanel = /** @class */ (function () {
    function LayoutPanel(treemap) {
        this.treemap = treemap;
    }
    /* tslint:disable:no-string-literal */
    LayoutPanel.prototype.processLayoutPanel = function () {
        var data;
        var totalRect;
        if (LevelsData.levelsData && LevelsData.levelsData.length > 0) {
            data = (!isNullOrUndefined(this.treemap.initialDrillDown.groupIndex) &&
                !isNullOrUndefined(this.treemap.initialDrillDown.groupName)) &&
                (isNullOrUndefined(this.treemap.drilledItems) ? isNullOrUndefined(this.treemap.drilledItems)
                    : this.treemap.drilledItems.length === 0) ?
                this.getDrilldownData(LevelsData.levelsData[0], [])[0] : LevelsData.levelsData[0];
            totalRect = extend({}, this.treemap.areaRect, totalRect, false);
            if (!isNullOrUndefined(this.treemap.treeMapLegendModule) && !isNullOrUndefined(this.treemap.totalRect)) {
                if (this.treemap.legendSettings.position !== 'Float') {
                    totalRect = this.treemap.totalRect;
                }
            }
            if (!isNullOrUndefined(this.treemap.currentLevel) &&
                (isNullOrUndefined(this.treemap.drilledItems) ? !isNullOrUndefined(this.treemap.drilledItems)
                    : this.treemap.drilledItems.length !== 0)) {
                var count = this.treemap.drilledItems.length - 1;
                var x = this.treemap.drilledItems[count]['data'];
                var y = new Object();
                y[this.treemap.drilledItems[count]['data']['groupName']] = [x];
                if (!isNullOrUndefined(this.treemap.initialDrillDown.groupIndex) && !this.treemap.enableBreadcrumb) {
                    this.treemap.currentLevel = this.treemap.drilledItems[count]['data']['groupIndex'];
                }
                this.calculateLayoutItems(y || LevelsData.levelsData[0], totalRect);
                this.renderLayoutItems(y || LevelsData.levelsData[0]);
            }
            else {
                if (!isNullOrUndefined(this.treemap.initialDrillDown.groupIndex) &&
                    (isNullOrUndefined(this.treemap.drilledItems) ? isNullOrUndefined(this.treemap.drilledItems)
                        : this.treemap.drilledItems.length === 0)) {
                    this.treemap.currentLevel = this.treemap.initialDrillDown.groupIndex;
                }
                this.calculateLayoutItems(data || LevelsData.levelsData[0], totalRect);
                this.renderLayoutItems(data || LevelsData.levelsData[0]);
            }
        }
    };
    LayoutPanel.prototype.getDrilldownData = function (data, drillData) {
        var treemap = this.treemap;
        var newData = {};
        var child = findChildren(data)['values'];
        if (child && child.length > 0 && drillData.length === 0) {
            for (var i = 0; i < child.length; i++) {
                if (child[i]['groupIndex'] === treemap.initialDrillDown.groupIndex &&
                    child[i]['name'] === treemap.initialDrillDown.groupName) {
                    child[i]['isDrilled'] = true;
                    newData[child[i]['groupName']] = [child[i]];
                    drillData.push(newData);
                }
            }
            for (var j = 0; j < child.length; j++) {
                this.getDrilldownData(child[j], drillData);
            }
        }
        return drillData;
    };
    LayoutPanel.prototype.calculateLayoutItems = function (data, rect) {
        this.renderItems = [];
        this.parentData = [];
        if (!isNullOrUndefined(this.treemap.weightValuePath)) {
            if (this.treemap.layoutType.indexOf('SliceAndDice') > -1) {
                this.computeSliceAndDiceDimensional(data, rect);
            }
            else {
                rect.height = rect.height + rect.y;
                rect.width = rect.width + rect.x;
                this.computeSquarifyDimensional(data, rect);
            }
        }
    };
    LayoutPanel.prototype.computeSliceAndDiceDimensional = function (data, coords) {
        var leafItem = this.treemap.leafItemSettings;
        var rect;
        var groups = this.treemap.levels;
        var groupIndex;
        var isLeafItem = false;
        var children = findChildren(data)['values'];
        var gap;
        var headerHeight;
        if (children && children.length > 0) {
            this.sliceAndDiceProcess(children, coords);
            if (this.treemap.levels.length > 0) {
                for (var i = 0; i < children.length; i++) {
                    groupIndex = children[i]['groupIndex'];
                    isLeafItem = (groups.length === 0 || groupIndex === groups.length);
                    gap = isLeafItem ? leafItem.gap : groups[groupIndex].groupGap;
                    headerHeight = groups.length === 0 ? 0 : groups[groupIndex] ? groups[groupIndex].showHeader ?
                        groups[groupIndex].headerHeight : 0 : groups[groupIndex - 1].showHeader ? groups[groupIndex - 1].headerHeight : 0;
                    rect = children[i]['rect'];
                    rect = new Rect(rect.x + (gap / 2), rect.y + (headerHeight + (gap / 2)), rect.width - gap, Math.abs(rect.height - (gap + headerHeight)));
                    this.computeSliceAndDiceDimensional(children[i], rect);
                }
            }
        }
        return data;
    };
    LayoutPanel.prototype.sliceAndDiceProcess = function (processData, rect) {
        var parentArea = rect.height * rect.width;
        var levels = this.treemap.levels;
        var childValue;
        var alottedValue = 0;
        var totalWeight = 0;
        processData.forEach(function (data) { totalWeight += data['weight']; });
        processData.forEach(function (child) {
            child['weightArea'] = parentArea * child['weight'] / totalWeight;
        });
        var isHorizontal = (this.treemap.layoutType === 'SliceAndDiceAuto') ? (rect.width > rect.height) :
            (this.treemap.layoutType === 'SliceAndDiceHorizontal');
        processData.sort(itemsToOrder);
        for (var i = 0; i < processData.length; i++) {
            var item = processData[i];
            item['isLeafItem'] = (levels.length === 0) || ((this.treemap.isHierarchicalData ||
                isNullOrUndefined(this.treemap.leafItemSettings.labelPath)) ?
                item['groupIndex'] === levels.length - 1 : item['groupIndex'] === this.treemap.levels.length);
            if (isHorizontal) {
                childValue = ((parentArea / totalWeight) * processData[i]['weight']) / rect.height;
                if (alottedValue <= rect.width) {
                    processData[i]['rect'] = new Rect(alottedValue + rect.x, rect.y, childValue, rect.height);
                }
            }
            else {
                childValue = ((parentArea / totalWeight) * processData[i]['weight']) / rect.width;
                if (alottedValue <= rect.height) {
                    processData[i]['rect'] = new Rect(rect.x, alottedValue + rect.y, rect.width, childValue);
                }
            }
            alottedValue += childValue;
            this.renderItems.push(processData[i]);
        }
    };
    LayoutPanel.prototype.computeSquarifyDimensional = function (data, coords) {
        var leaf = this.treemap.leafItemSettings;
        var rect;
        var levels = this.treemap.levels;
        var groupIndex;
        var isLeafItem = false;
        var item;
        var child = findChildren(data)['values'];
        var index;
        var gap;
        var padding;
        var headerHeight;
        if (child && child.length > 0) {
            if (this.parentData.length === 0) {
                this.parentData = [];
                this.parentData.push(child);
            }
            this.calculateChildrenLayout(data, child, coords);
            if (this.treemap.levels.length > 0) {
                for (var i = 0; i < child.length; i++) {
                    item = child[i];
                    index = item['groupIndex'];
                    rect = item['rect'];
                    gap = (item['isLeafItem'] ? leaf.gap : levels[index].groupGap) / 2;
                    padding = (item['isLeafItem'] ? leaf.padding : levels[index].groupPadding) / 2;
                    headerHeight = this.treemap.isHierarchicalData ? index === 0 && item['isLeafItem'] ? 0 : levels[index] ?
                        levels[index].showHeader ? levels[index].headerHeight : 0 : 0 : (levels.length === 0) ? 0 : levels[index] ?
                        levels[index].showHeader ? levels[index].headerHeight : 0 : 0;
                    rect = new Rect(rect.x + padding, rect.y + (headerHeight + padding), rect.width - padding, rect.height - padding);
                    if (!item['isLeafItem'] && item['weight'] > 0) {
                        this.computeSquarifyDimensional(child[i], rect);
                    }
                }
            }
        }
    };
    LayoutPanel.prototype.calculateChildrenLayout = function (parent, children, coords) {
        this.computeTotalArea(children, getArea(coords));
        children.sort(orderByArea);
        this.performRowsLayout(children, [], coords, []);
    };
    LayoutPanel.prototype.performRowsLayout = function (data, currentRow, rect, stack) {
        var dataLength = data.length;
        if (dataLength === 0) {
            var newCoordinates = this.getCoordinates(currentRow, rect);
            var newStack = stack.concat(newCoordinates);
            return newStack;
        }
        var width = getShortestEdge(rect);
        var nextDatum = data[0];
        var restData = data.slice(1, dataLength);
        if (this.aspectRatio(currentRow, nextDatum, width)) {
            var newRow = currentRow.concat(nextDatum);
            return this.performRowsLayout(restData, newRow, rect, stack);
        }
        else {
            var currentRowLength = currentRow.length;
            var valueSum = 0;
            for (var i = 0; i < currentRowLength; i += 1) {
                valueSum += currentRow[i]['itemArea'];
            }
            var newContainer = this.cutArea(rect, valueSum);
            var newCoordinates = this.getCoordinates(currentRow, rect);
            var newStack = stack.concat(newCoordinates);
            return this.performRowsLayout(data, [], newContainer, newStack);
        }
    };
    LayoutPanel.prototype.aspectRatio = function (currentRow, nextDatum, length) {
        if (currentRow.length === 0) {
            return true;
        }
        else {
            var newRow = currentRow.concat(nextDatum);
            var currentMaxAspectRatio = this.findMaxAspectRatio(currentRow, length);
            var newMaxAspectRatio = this.findMaxAspectRatio(newRow, length);
            return (currentMaxAspectRatio >= newMaxAspectRatio);
        }
    };
    LayoutPanel.prototype.findMaxAspectRatio = function (row, length) {
        var rowLength = row.length;
        var minArea = Infinity;
        var maxArea = -Infinity;
        var sumArea = 0;
        for (var i = 0; i < rowLength; i += 1) {
            var area = row[i]['itemArea'];
            if (area < minArea) {
                minArea = area;
            }
            if (area > maxArea) {
                maxArea = area;
            }
            sumArea += area;
        }
        var result = Math.max((Math.pow(length, 2)) * maxArea / (Math.pow(sumArea, 2)), (Math.pow(sumArea, 2)) /
            ((Math.pow(length, 2)) * minArea));
        return result;
    };
    LayoutPanel.prototype.cutArea = function (rect, area) {
        var newContainer = convertToContainer(rect);
        var width = newContainer.width;
        var height = newContainer.height;
        var xOffset = newContainer.x;
        var yOffset = newContainer.y;
        if (width >= height) {
            var areaWidth = area / height;
            var newWidth = width - areaWidth;
            var container = {
                x: xOffset + areaWidth,
                y: yOffset,
                width: newWidth,
                height: height,
            };
            return convertToRect(container);
        }
        else {
            var areaHeight = area / width;
            var newHeight = height - areaHeight;
            var container = {
                x: xOffset,
                y: yOffset + areaHeight,
                width: width,
                height: newHeight,
            };
            return convertToRect(container);
        }
    };
    LayoutPanel.prototype.getCoordinates = function (row, rect) {
        var container = convertToContainer(rect);
        var headerHeight;
        var width = container.width;
        var height = container.height;
        var xOffset = container.x;
        var yOffset = container.y;
        var rowLength = row.length;
        var levels = this.treemap.levels;
        var leaf = this.treemap.leafItemSettings;
        var index;
        var valueSum = 0;
        for (var i = 0; i < rowLength; i += 1) {
            valueSum += row[i]['itemArea'];
        }
        var areaWidth = valueSum / height;
        var areaHeight = valueSum / width;
        var subXOffset = xOffset;
        var subYOffset = yOffset;
        var padding;
        var coordinates = [];
        var isParent;
        var gap;
        var parentRect;
        for (var i = 0; i < rowLength; i += 1) {
            var item = row[i];
            index = item['groupIndex'];
            item['isLeafItem'] = (levels.length === 0) || (this.treemap.isHierarchicalData ? index === levels.length :
                isNullOrUndefined(leaf.labelPath) ? false : index === levels.length);
            isParent = isParentItem(this.parentData[0], item);
            parentRect = isParent ? this.treemap.areaRect : item['parent'].rect;
            padding = item['isLeafItem'] ? leaf.padding : levels[index].groupPadding;
            if (width >= height) {
                var y1 = subYOffset + item['itemArea'] / areaWidth;
                item['rect'] = {
                    x: subXOffset,
                    y: subYOffset,
                    width: subXOffset + areaWidth,
                    height: y1,
                };
                subYOffset = y1;
            }
            else {
                var x1 = subXOffset + item['itemArea'] / areaHeight;
                item['rect'] = {
                    x: subXOffset,
                    y: subYOffset,
                    width: x1,
                    height: subYOffset + areaHeight,
                };
                subXOffset = x1;
            }
            if (item['weight'] > 0 && (isParent || (Math.round(rect.y + (padding / 2)) <=
                Math.round(parentRect.y + (parentRect.height - parentRect.y)) && Math.round(rect.x + (padding / 2)) <=
                Math.round(parentRect.x + (parentRect.width - parentRect.x))))) {
                this.renderItems.push(item);
                coordinates.push(item);
            }
        }
        return coordinates;
    };
    LayoutPanel.prototype.computeTotalArea = function (data, area) {
        var dataLength = data.length;
        var dataSum = 0;
        var result = [];
        for (var i = 0; i < dataLength; i += 1) {
            var dataLength_1 = data.length;
            var dataSum_1 = 0;
            for (var i_1 = 0; i_1 < dataLength_1; i_1 += 1) {
                dataSum_1 += data[i_1]['weight'];
            }
            var multiplier = area / dataSum_1;
            var datum = void 0;
            for (var j = 0; j < dataLength_1; j++) {
                datum = data[j];
                datum['itemArea'] = datum['weight'] * multiplier;
                result.push(datum);
            }
        }
        return result;
    };
    LayoutPanel.prototype.onDemandProcess = function (childItems) {
        var parentItem = new Object();
        var totalRect;
        parentItem = childItems[0]['parent'];
        this.treemap.currentLevel = parentItem['isDrilled'] ? parentItem['groupIndex'] : null;
        var parentItemGroupname = new Object();
        if (isNullOrUndefined(parentItem['groupName'])) {
            parentItemGroupname = parentItem;
        }
        else {
            parentItemGroupname[parentItem['groupName']] = [parentItem];
        }
        totalRect = extend({}, this.treemap.areaRect, totalRect, false);
        if (!isNullOrUndefined(this.treemap.treeMapLegendModule) && !isNullOrUndefined(this.treemap.totalRect)) {
            totalRect = this.treemap.totalRect;
        }
        var count = this.treemap.levels.length;
        for (var i = 0; i < count; i++) {
            var levelCount = childItems[0]['groupIndex'];
            if (count === levelCount) {
                this.treemap.levels[count] = this.treemap.levels[i];
            }
            else {
                this.treemap.levels.splice(count - 1, 1);
            }
        }
        this.calculateLayoutItems(parentItemGroupname, totalRect);
        this.renderLayoutItems(parentItemGroupname);
    };
    /* tslint:disable-next-line:max-func-body-length */
    LayoutPanel.prototype.renderLayoutItems = function (renderData) {
        var _this = this;
        var textCollection = [];
        var position;
        var treeMap = this.treemap;
        var colorMapping;
        var txtVisible;
        var getItemColor;
        var eventArgs;
        this.renderer = treeMap.renderer;
        var trimHeader;
        var textLocation = new Location(0, 0);
        var pathOptions;
        var elementID = treeMap.element.id;
        var index;
        var templatePosition;
        var mode = treeMap.layoutType;
        var rect;
        var format;
        var interSectAction = this.treemap.leafItemSettings.interSectAction;
        var textSize;
        var fill;
        var item;
        var renderText;
        var opacity;
        var padding = 5;
        var rectPath = '';
        var isRender;
        var secondaryEle = document.getElementById(treeMap.element.id + '_Secondary_Element');
        var groupId;
        var textOptions;
        var templateEle;
        var gap;
        var textStyle;
        var levels = treeMap.levels;
        this.layoutGroup = this.renderer.createGroup({ id: elementID + '_TreeMap_' + mode + '_Layout' });
        var itemGroup;
        var level;
        var template;
        var border;
        var templateGroup = createElement('div', {
            id: treeMap.element.id + '_Label_Template_Group',
            className: 'template',
            styles: 'overflow: hidden; position: absolute;pointer-events: none;' +
                'top:' + treeMap.areaRect.y + 'px;' +
                'left:' + treeMap.areaRect.x + 'px;' +
                'height:' + treeMap.areaRect.height + 'px;' +
                'width:' + treeMap.areaRect.width + 'px;'
        });
        var isLeafItem = false;
        var leaf = treeMap.leafItemSettings;
        var childItems;
        var connectorText;
        var _loop_1 = function (i) {
            item = this_1.renderItems[i];
            index = item['groupIndex'];
            if (this_1.treemap.drillDownView && isNullOrUndefined(this_1.treemap.currentLevel)
                && index > 0 || this_1.treemap.drillDownView
                && index > (this_1.treemap.currentLevel + 1)) {
                return "continue";
            }
            rect = item['rect'];
            isLeafItem = item['isLeafItem'];
            groupId = elementID + '_Level_Index_' + index + '_Item_Index_' + i;
            itemGroup = this_1.renderer.createGroup({ id: groupId + '_Group' });
            gap = (isLeafItem ? leaf.gap : levels[index].groupGap) / 2;
            var treemapItemRect = this_1.treemap.totalRect ? convertToContainer(this_1.treemap.totalRect) : this_1.treemap.areaRect;
            if (treeMap.layoutType === 'Squarified') {
                rect.width = Math.abs(rect.x - rect.width) - gap;
                rect.height = Math.abs(rect.y - rect.height) - gap;
            }
            if (treeMap.renderDirection === 'TopRightBottomLeft') {
                rect.x = (treemapItemRect.x + treemapItemRect.width) - rect.width - Math.abs(treemapItemRect.x - rect.x);
            }
            else if (treeMap.renderDirection === 'BottomLeftTopRight') {
                rect.y = (treemapItemRect.y + treemapItemRect.height) - rect.height - Math.abs(treemapItemRect.y - rect.y);
            }
            else if (treeMap.renderDirection === 'BottomRightTopLeft') {
                rect.x = (treemapItemRect.x + treemapItemRect.width) - rect.width - Math.abs(treemapItemRect.x - rect.x);
                rect.y = (treemapItemRect.y + treemapItemRect.height) - rect.height - Math.abs(treemapItemRect.y - rect.y);
            }
            colorMapping = isLeafItem ? leaf.colorMapping : levels[index].colorMapping;
            getItemColor = this_1.getItemColor(isLeafItem, item);
            fill = getItemColor['fill'];
            opacity = getItemColor['opacity'];
            format = isLeafItem ? leaf.labelFormat : (levels[index]).headerFormat;
            var levelName;
            txtVisible = isLeafItem ? leaf.showLabels : (levels[index]).showHeader;
            if (index === this_1.treemap.currentLevel) {
                if (this_1.treemap.enableBreadcrumb) {
                    var re = /#/gi;
                    connectorText = '#' + this_1.treemap.breadcrumbConnector + '#';
                    levelName = item['levelOrderName'].replace(re, connectorText);
                    levelName = index !== 0 ? '#' + levelName : levelName;
                }
                else {
                    levelName = item['name'];
                }
            }
            else {
                if (this_1.treemap.enableBreadcrumb) {
                    item['isDrilled'] = false;
                }
                levelName = item['name'];
            }
            renderText = textFormatter(format, item['data'], this_1.treemap) || levelName;
            childItems = findChildren(item)['values'];
            renderText = !isLeafItem && childItems && childItems.length > 0 && this_1.treemap.enableDrillDown ?
                !item['isDrilled'] ? treeMap.enableRtl ? renderText + ' [+]' : '[+] ' + renderText :
                    treeMap.enableRtl ? renderText + ' [-]' : '[-] ' + renderText : renderText;
            textStyle = (isLeafItem ? leaf.labelStyle : levels[index].headerStyle);
            textStyle.fontFamily = this_1.treemap.themeStyle.labelFontFamily || textStyle.fontFamily;
            border = isLeafItem ? leaf.border : levels[index].border;
            position = !isLeafItem ? (levels[index].headerAlignment) === 'Near' ? 'TopLeft' : (levels[index].headerAlignment) === 'Center' ?
                'TopCenter' : 'TopRight' : leaf.labelPosition;
            templatePosition = isLeafItem ? leaf.templatePosition : levels[index].templatePosition;
            template = isLeafItem ? leaf.labelTemplate : levels[index].headerTemplate;
            item['options'] = { border: border, opacity: opacity, fill: fill };
            eventArgs = {
                cancel: false, name: itemRendering, treemap: this_1.treemap, text: renderText,
                currentItem: item, RenderItems: this_1.renderItems, options: item['options']
            };
            if (this_1.treemap.isBlazor) {
                var treemap = eventArgs.treemap, RenderItems = eventArgs.RenderItems, blazorEventArgs = __rest(eventArgs, ["treemap", "RenderItems"]);
                eventArgs = blazorEventArgs;
            }
            this_1.treemap.trigger(itemRendering, eventArgs, function (observedArgs) {
                if (!observedArgs.cancel) {
                    rectPath = ' M ' + rect.x + ' ' + rect.y + ' L ' + (rect.x + rect.width) + ' ' + rect.y +
                        ' L ' + (rect.x + rect.width) + ' ' + (rect.y + rect.height) + ' L ' + rect.x + ' ' + (rect.y + rect.height) + 'z';
                    pathOptions = new PathOption(groupId + '_RectPath', fill, border.width, border.color, opacity, null, rectPath);
                    var path = _this.renderer.drawPath(pathOptions);
                    itemGroup.appendChild(path);
                    if (txtVisible) {
                        if (eventArgs.text !== renderText) {
                            eventArgs.text = textFormatter(eventArgs.text, item['data'], _this.treemap) || levelName;
                        }
                        _this.renderItemText(eventArgs.text.toString(), itemGroup, textStyle, rect, interSectAction, groupId, fill, position, connectorText);
                    }
                    if (template) {
                        templateEle = _this.renderTemplate(secondaryEle, groupId, rect, templatePosition, template, item, isLeafItem);
                        templateGroup.appendChild(templateEle);
                    }
                    itemGroup.setAttribute('aria-label', item['name']);
                    itemGroup.setAttribute('tabindex', (_this.treemap.tabIndex + i + 2).toString());
                    maintainSelection(_this.treemap, itemGroup, 'treeMapSelection');
                    _this.layoutGroup.appendChild(itemGroup);
                }
            });
        };
        var this_1 = this;
        for (var i = 0; i < this.renderItems.length; i++) {
            _loop_1(i);
        }
        if (templateGroup.childNodes.length > 0) {
            secondaryEle.appendChild(templateGroup);
            updateBlazorTemplate(this.treemap.element.id + '_HeaderTemplate', 'HeaderTemplate', levels[levels.length - 1]);
            updateBlazorTemplate(this.treemap.element.id + '_LabelTemplate', 'LabelTemplate', leaf);
        }
        this.treemap.svgObject.appendChild(this.layoutGroup);
    };
    LayoutPanel.prototype.renderItemText = function (text, parentElement, textStyle, rect, interSectAction, groupId, fill, position, connectorText) {
        var level;
        var textOptions;
        var headerPosition;
        var secondaryEle = document.getElementById(this.treemap.element.id + '_Secondary_Element');
        var leaf = this.treemap.leafItemSettings;
        var padding = 5;
        var textSize;
        var textLocation;
        var textCollection = [];
        var customText;
        var templateEle;
        var tspanText = [];
        var height = 0;
        var textName;
        textCollection = ((text.indexOf('<br>')) !== -1) ? text.split('<br>') : null;
        customText = this.labelInterSectAction(rect, text, textStyle, interSectAction);
        textSize = measureText(textCollection && textCollection[0] || customText[0], textStyle);
        if (this.treemap.enableRtl) {
            var labelSize = measureText(text, textStyle);
            var drillSymbolCount = text.search('[+]') || text.search('[-]');
            if (rect.width < labelSize.width && drillSymbolCount > 0) {
                var label = text.substring(drillSymbolCount - 1, text.length);
                var drillSymbol = '[+]';
                var drillSymbolSize = measureText(drillSymbol, textStyle);
                customText['0'] = textTrim(rect.width - drillSymbolSize.width - padding, customText[0], textStyle) + label;
            }
        }
        textLocation = findLabelLocation(rect, position, textSize, 'Text', this.treemap);
        if (!isNullOrUndefined(textCollection)) {
            var collection = [];
            var texts = null;
            var maxNumber = [];
            for (var i = 0; i < textCollection.length; i++) {
                texts = textTrim((rect.width - 5), textCollection[i], textStyle);
                textSize = measureText(texts, textStyle);
                height += textSize.height;
                maxNumber.push(textSize.width);
                collection.push(texts);
            }
            customText = collection;
            textSize.width = Math.max.apply(null, maxNumber);
            textSize.height = height;
        }
        if (interSectAction === 'WrapByWord' || interSectAction === 'Wrap' || interSectAction === 'Trim') {
            for (var j = 0; j < customText.length; j++) {
                textSize = measureText(customText[j], textStyle);
                height += textSize.height;
                if ((rect.height - padding) > height) {
                    tspanText.push(customText[j]);
                }
            }
            if (interSectAction === 'Wrap' && customText.length !== tspanText.length && tspanText.length) {
                var collectionLength = tspanText.length - 1;
                var stringText = tspanText[collectionLength];
                stringText = stringText.substring(0, (stringText.length - 1)) + '...';
                tspanText.splice(collectionLength);
                if (stringText !== '...') {
                    tspanText.push(stringText);
                }
            }
        }
        else {
            textName = customText;
            tspanText.push(textName);
        }
        textOptions = new TextOption(groupId + '_Text', textLocation.x, textLocation.y, 'start', tspanText, '', '', connectorText);
        renderTextElement(textOptions, textStyle, textStyle.color || this.getSaturatedColor(fill), parentElement);
    };
    LayoutPanel.prototype.getItemColor = function (isLeafItem, item) {
        var treemap = this.treemap;
        var itemFill = isLeafItem ? treemap.leafItemSettings.fill : treemap.levels[item['groupIndex']].fill;
        var itemOpacity = isLeafItem ? treemap.leafItemSettings.opacity : treemap.levels[item['groupIndex']].opacity;
        if (!isNullOrUndefined(LevelsData.defaultLevelsData)) {
            if (LevelsData.defaultLevelsData.length > 0) {
                LevelsData.levelsData = LevelsData.defaultLevelsData;
            }
        }
        var parentData = findChildren(LevelsData.levelsData[0])['values'];
        var colorMapping = isLeafItem ? treemap.leafItemSettings.colorMapping :
            treemap.levels[item['groupIndex']].colorMapping;
        if (colorMapping.length > 0) {
            var option = colorMap(colorMapping, item['data'][this.treemap.equalColorValuePath], item['data'][this.treemap.rangeColorValuePath], item['data'][this.treemap.weightValuePath]);
            itemFill = !isNullOrUndefined(option['fill']) ? option['fill'] : treemap.leafItemSettings.fill;
            itemOpacity = option['opacity'];
        }
        else {
            for (var i = 0; i < parentData.length; i++) {
                if (parentData[i]['levelOrderName'] === item['levelOrderName'].split('#')[0]) {
                    itemFill = !isNullOrUndefined(itemFill) ? itemFill : !isNullOrUndefined(treemap.colorValuePath) ?
                        parentData[i]['data'][treemap.colorValuePath] : treemap.palette.length > 0 ?
                        treemap.palette[i % treemap.palette.length] : '#808080';
                }
            }
        }
        return { fill: itemFill, opacity: itemOpacity };
    };
    /**
     * To find saturated color for datalabel
     */
    LayoutPanel.prototype.getSaturatedColor = function (color) {
        var saturatedColor = color;
        saturatedColor = (saturatedColor === 'transparent') ? window.getComputedStyle(document.body, null).backgroundColor : saturatedColor;
        var rgbValue = convertHexToColor(colorNameToHex(saturatedColor));
        var contrast = Math.round((rgbValue.r * 299 + rgbValue.g * 587 + rgbValue.b * 114) / 1000);
        return contrast >= 128 ? 'black' : 'white';
    };
    LayoutPanel.prototype.renderTemplate = function (secondaryEle, groupId, rect, position, template, item, isLeafItem) {
        var templateElement;
        var labelEle;
        var templateSize;
        var templateFn;
        var templateLocation;
        var templateId = isLeafItem ? groupId + '_LabelTemplate' : groupId + '_HeaderTemplate';
        var baseTemplateId = isLeafItem ? '_LabelTemplate' : '_HeaderTemplate';
        if (isNullOrUndefined(template['prototype'])) {
            var keys = Object.keys(item['data']);
            for (var i = 0; i < keys.length; i++) {
                template = template.replace(new RegExp('{{:' + keys[i] + '}}', 'g'), item['data'][keys[i].toString()]);
            }
        }
        templateFn = getTemplateFunction(template);
        templateElement = templateFn(item['data'], null, null, this.treemap.element.id + baseTemplateId, false);
        labelEle = convertElement(templateElement, templateId, item['data']);
        templateSize = measureElement(labelEle, secondaryEle);
        templateLocation = findLabelLocation(rect, position, templateSize, 'Template', this.treemap);
        labelEle.style.left = templateLocation.x + 'px';
        labelEle.style.top = templateLocation.y + 'px';
        return labelEle;
    };
    LayoutPanel.prototype.labelInterSectAction = function (rect, text, textStyle, alignment) {
        var textValue;
        var maxWidth = rect.width - 10;
        switch (alignment) {
            case 'Hide':
                textValue = [hide(maxWidth, rect.height, text, textStyle)];
                break;
            case 'Trim':
                textValue = [textTrim((maxWidth + 3), text, textStyle)];
                break;
            case 'WrapByWord':
                textValue = wordWrap(maxWidth, text, textStyle);
                break;
            case 'Wrap':
                textValue = textWrap(maxWidth, text, textStyle);
                break;
        }
        return textValue;
    };
    return LayoutPanel;
}());
export { LayoutPanel };

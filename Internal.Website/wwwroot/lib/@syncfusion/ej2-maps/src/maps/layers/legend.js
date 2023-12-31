import { click, legendRendering } from '../index';
import { Rect, measureText, PathOption, textTrim, removeClass, querySelector, getTemplateFunction, maintainStyleClass, getValueFromObject } from '../utils/helper';
import { RectOption, Size, TextOption, Point, renderTextElement, drawSymbol, checkPropertyPath, getElement } from '../utils/helper';
import { isNullOrUndefined, Browser, EventHandler, remove, extend } from '@syncfusion/ej2-base';
/**
 * Legend module is used to render legend for the maps
 */
var Legend = /** @class */ (function () {
    function Legend(maps) {
        this.legendBorderRect = new Rect(0, 0, 0, 0);
        /**
         * @private
         */
        this.totalPages = [];
        this.page = 0;
        /**
         * @private
         */
        this.currentPage = 0;
        this.legendItemRect = new Rect(0, 0, 0, 0);
        this.heightIncrement = 0;
        this.widthIncrement = 0;
        this.textMaxWidth = 0;
        this.shapeHighlightCollection = [];
        this.legendHighlightCollection = [];
        this.shapePreviousColor = [];
        this.selectedNonLegendShapes = [];
        this.shapeToggled = true;
        this.legendElement = null;
        this.maps = maps;
        this.addEventListener();
    }
    /**
     * To calculate legend bounds and draw the legend shape and text.
     */
    Legend.prototype.renderLegend = function () {
        this.legendRenderingCollections = [];
        this.legendCollection = [];
        this.totalPages = [];
        this.widthIncrement = 0;
        this.heightIncrement = 0;
        this.defsElement = this.maps.renderer.createDefs();
        this.maps.svgObject.appendChild(this.defsElement);
        this.calculateLegendBounds();
        this.drawLegend();
    };
    /* tslint:disable-next-line:max-func-body-length */
    Legend.prototype.calculateLegendBounds = function () {
        var _this = this;
        var map = this.maps;
        var legend = map.legendSettings;
        this.legendCollection = [];
        var spacing = 10;
        var leftPadding = 10;
        var topPadding = map.mapAreaRect.y;
        this.legendRenderingCollections = [];
        Array.prototype.forEach.call(map.layersCollection, function (layer, layerIndex) {
            if (!isNullOrUndefined(layer.shapeData)) {
                var layerData = layer.shapeData['features'];
                var dataPath = layer.shapeDataPath;
                var propertyPath = layer.shapePropertyPath;
                var dataSource = layer.dataSource;
                var colorValuePath = void 0;
                var colorMapping = void 0;
                if (legend.type === 'Layers' && layer.visible) {
                    colorValuePath = layer.shapeSettings.colorValuePath;
                    colorMapping = layer.shapeSettings.colorMapping;
                    _this.getLegends(layerIndex, layerData, colorMapping, dataSource, dataPath, colorValuePath, propertyPath);
                }
                else if (legend.type === 'Bubbles') {
                    for (var _i = 0, _a = layer.bubbleSettings; _i < _a.length; _i++) {
                        var bubble = _a[_i];
                        if (bubble.visible) {
                            colorValuePath = bubble.colorValuePath;
                            colorMapping = bubble.colorMapping;
                            dataSource = bubble.dataSource;
                            _this.getLegends(layerIndex, layerData, colorMapping, dataSource, dataPath, colorValuePath, propertyPath);
                        }
                    }
                }
                else {
                    _this.getMarkersLegendCollections(layerIndex, layer.markerSettings);
                }
            }
        });
        if (this.legendCollection.length > 0) {
            for (var i = 0; i < this.legendCollection.length; i++) {
                var legendItem = this.legendCollection[i];
                var eventArgs = {
                    name: legendRendering, cancel: false, fill: legendItem['fill'], shape: legend.shape,
                    shapeBorder: legend.shapeBorder,
                    text: typeof legendItem['text'] === 'number' ? legendItem['text'].toString() : legendItem['text']
                };
                map.trigger('legendRendering', eventArgs);
                legendItem['fill'] = eventArgs.fill;
                legendItem['shape'] = eventArgs.shape;
                legendItem['shapeBorder'] = eventArgs.shapeBorder;
                legendItem['text'] = eventArgs.text;
                if (eventArgs.cancel) {
                    this.legendCollection.splice(i, 1);
                    i--;
                }
            }
        }
        var defaultSize = 25;
        var legendTitle = map.legendSettings.title.text;
        var titleTextStyle = map.legendSettings.titleStyle;
        if (this.legendCollection.length > 0) {
            var legendMode = legend.mode;
            var shapeX = 0;
            var shapeY = 0;
            var textX = 0;
            var textY = 0;
            var shapePadding = legend.shapePadding;
            var textPadding = 10;
            var shapeHeight = legend.shapeHeight;
            var shapeWidth = legend.shapeWidth;
            var shapeLocation = [];
            var textLocation = [];
            var legendRectCollection = [];
            var location_1;
            var position = legend.position;
            var labelAction = legend.labelDisplayMode;
            var arrangement = (legend.orientation === 'None') ? ((position === 'Top' || position === 'Bottom')
                ? 'Horizontal' : 'Vertical') : legend.orientation;
            var legendWidth = (legend.width.length > 1) ? (legend.width.indexOf('%') > -1) ? (map.availableSize.width / 100)
                * parseInt(legend.width, 10) : parseInt(legend.width, 10) : null;
            var legendHeight = (legend.height.length > 1) ? (legend.height.indexOf('%') > -1) ? (map.availableSize.height / 100) *
                parseInt(legend.height, 10) : parseInt(legend.height, 10) : null;
            var legendItemStartX_1;
            var legendItemStartY_1;
            var startX = 0;
            var startY = 0;
            var legendtitleSize = measureText(legendTitle, titleTextStyle);
            if (legendMode === 'Interactive') {
                var itemTextStyle = legend.textStyle;
                var rectWidth = void 0;
                var rectHeight = void 0;
                var legendLength = this.legendCollection.length;
                rectWidth = (arrangement === 'Horizontal') ? (isNullOrUndefined(legendWidth)) ? (map.mapAreaRect.width / legendLength) :
                    (legendWidth / legendLength) : (isNullOrUndefined(legendWidth)) ? defaultSize : legendWidth;
                rectHeight = (arrangement === 'Horizontal') ? (isNullOrUndefined(legendHeight)) ? defaultSize : legendHeight :
                    (isNullOrUndefined(legendHeight)) ? (map.mapAreaRect.height / legendLength) : (legendHeight / legendLength);
                startX = 0;
                startY = legendtitleSize.height + spacing;
                var position_1 = legend.labelPosition;
                var textX_1 = 0;
                var textY_1 = 0;
                var textPadding_1 = 10;
                var itemStartX = 0;
                var itemStartY = 0;
                var maxTextHeight = 0;
                var maxTextWidth = 0;
                for (var i = 0; i < this.legendCollection.length; i++) {
                    startX = (arrangement === 'Horizontal') ? (startX + rectWidth) : startX;
                    startY = (arrangement === 'Horizontal') ? startY : (startY + rectHeight);
                    var legendText = this.legendCollection[i]['text'];
                    var itemTextSize = new Size(0, 0);
                    if (labelAction === 'None') {
                        itemTextSize = measureText(legendText, itemTextStyle);
                    }
                    else if (labelAction === 'Trim') {
                        legendText = textTrim((arrangement === 'Horizontal' ? rectWidth : rectHeight), legendText, itemTextStyle);
                        itemTextSize = measureText(legendText, itemTextStyle);
                    }
                    else {
                        legendText = '';
                    }
                    maxTextHeight = Math.max(maxTextHeight, itemTextSize.height);
                    maxTextWidth = Math.max(maxTextWidth, itemTextSize.width);
                    if (itemTextSize.width > 0 && itemTextSize.height > 0) {
                        if (arrangement === 'Horizontal') {
                            textX_1 = startX + (rectWidth / 2);
                            textY_1 = (position_1 === 'After') ? (startY + rectHeight + (itemTextSize.height / 2)) + textPadding_1 :
                                (startY - textPadding_1);
                        }
                        else {
                            textX_1 = (position_1 === 'After') ? startX - (itemTextSize.width / 2) - textPadding_1
                                : (startX + rectWidth + itemTextSize.width / 2) + textPadding_1;
                            textY_1 = startY + (rectHeight / 2) + (itemTextSize.height / 4);
                        }
                    }
                    if (i === 0) {
                        itemStartX = (arrangement === 'Horizontal') ? startX : (position_1 === 'After') ?
                            textX_1 - (itemTextSize.width / 2) : startX;
                        itemStartY = (arrangement === 'Horizontal') ? (position_1 === 'After') ? startY :
                            textY_1 - (itemTextSize.height / 2) : startY;
                        if (this.legendCollection.length === 1) {
                            legendWidth = (arrangement === 'Horizontal') ? Math.abs((startX + rectWidth) - itemStartX) :
                                (rectWidth + maxTextWidth + textPadding_1);
                            legendHeight = (arrangement === 'Horizontal') ? (rectHeight + (maxTextHeight / 2) + textPadding_1) :
                                Math.abs((startY + rectHeight) - itemStartY);
                        }
                    }
                    else if (i === this.legendCollection.length - 1) {
                        legendWidth = (arrangement === 'Horizontal') ? Math.abs((startX + rectWidth) - itemStartX) :
                            (rectWidth + maxTextWidth + textPadding_1);
                        legendHeight = (arrangement === 'Horizontal') ? (rectHeight + (maxTextHeight / 2) + textPadding_1) :
                            Math.abs((startY + rectHeight) - itemStartY);
                    }
                    this.legendRenderingCollections.push({
                        fill: this.legendCollection[i]['fill'], x: startX, y: startY,
                        width: rectWidth, height: rectHeight,
                        text: legendText, textX: textX_1, textY: textY_1,
                        textWidth: itemTextSize.width, textHeight: itemTextSize.height,
                        shapeBorder: this.legendCollection[i]['shapeBorder']
                    });
                }
                if (this.legendCollection.length === 1) {
                    legendHeight = rectHeight;
                    legendWidth = rectWidth;
                }
                this.legendItemRect = { x: itemStartX, y: itemStartY, width: legendWidth, height: legendHeight };
            }
            else {
                legendWidth = (isNullOrUndefined(legendWidth)) ? map.mapAreaRect.width : legendWidth;
                legendHeight = (isNullOrUndefined(legendHeight)) ? map.mapAreaRect.height : legendHeight;
                var j = 0;
                this.page = 0;
                for (var i = 0; i < this.legendCollection.length; i++) {
                    var legendItem = this.legendCollection[i];
                    if (isNullOrUndefined(this.totalPages[this.page])) {
                        this.totalPages[this.page] = { Page: (this.page + 1), Collection: [] };
                    }
                    var legendTextSize = measureText(legendItem['text'], legend.textStyle);
                    this.textMaxWidth = Math.max(this.textMaxWidth, legendTextSize.width);
                    if (i === 0) {
                        startX = shapeX = (leftPadding + (shapeWidth / 2));
                        startY = shapeY = topPadding + legendtitleSize.height + (shapeHeight > legendTextSize.height ? shapeHeight / 2
                            : (legendTextSize.height / 4));
                    }
                    else {
                        var maxSize = (legendTextSize.height > shapeHeight) ? legendTextSize.height : shapeHeight;
                        if (arrangement === 'Horizontal') {
                            var prvePositionX = (textLocation[j - 1].x + textLocation[j - 1].width) + textPadding + shapeWidth;
                            if ((prvePositionX + shapePadding + legendTextSize.width) > legendWidth) {
                                var nextPositionY = (textLocation[j - 1].y > (shapeLocation[j - 1].y + (shapeHeight / 2)) ?
                                    textLocation[j - 1].y : (shapeLocation[j - 1].y + (shapeHeight / 2))) + topPadding;
                                if ((nextPositionY + maxSize) > legendHeight) {
                                    this.getPageChanged();
                                    j = 0;
                                    shapeLocation = [];
                                    textLocation = [];
                                    legendRectCollection = [];
                                    shapeX = startX;
                                    shapeY = startY;
                                }
                                else {
                                    shapeX = (shapeLocation[0].x);
                                    shapeY = (nextPositionY + (maxSize / 2));
                                }
                            }
                            else {
                                shapeX = (prvePositionX - (shapeWidth / 2));
                                shapeY = (shapeLocation[j - 1]).y;
                            }
                        }
                        else {
                            var prevPositionY = textLocation[j - 1].y > shapeLocation[j - 1].y + (shapeHeight / 2) ?
                                textLocation[j - 1].y : shapeLocation[j - 1].y + (shapeHeight / 2);
                            if ((prevPositionY + topPadding + maxSize) > legendHeight) {
                                var nextPositionX = (textLocation[j - 1].x + this.textMaxWidth + textPadding);
                                if ((nextPositionX + shapePadding + legendTextSize.width) > legendWidth) {
                                    shapeX = startX;
                                    shapeY = startY;
                                    legendRectCollection = [];
                                    textLocation = [];
                                    shapeLocation = [];
                                    this.getPageChanged();
                                    j = 0;
                                }
                                else {
                                    shapeX = nextPositionX + (shapeWidth / 2);
                                    shapeY = (shapeLocation[0].y);
                                }
                            }
                            else {
                                shapeX = shapeLocation[j - 1].x;
                                shapeY = prevPositionY + topPadding + (shapeHeight / 2);
                            }
                        }
                    }
                    textX = shapeX + (shapeWidth / 2) + shapePadding;
                    textY = shapeY + (legendTextSize.height / 4);
                    shapeLocation.push({ x: shapeX, y: shapeY });
                    textLocation.push({ x: textX, y: textY, width: legendTextSize.width, height: (legendTextSize.height / 2) });
                    this.totalPages[this.page]['Collection'].push({
                        DisplayText: legendItem['text'],
                        ImageSrc: legendItem['imageSrc'],
                        Shape: { x: shapeX, y: shapeY },
                        Text: { x: textX, y: textY },
                        Fill: legendItem['fill'],
                        legendShape: legendItem['shape'],
                        shapeBorder: legendItem['shapeBorder'],
                        idIndex: i,
                        Rect: {
                            x: shapeLocation[j].x - (shapeWidth / 2),
                            y: (shapeLocation[j].y - (shapeHeight / 2)) < (textY - legendTextSize.height) ?
                                (shapeLocation[j].y - (shapeHeight / 2)) : (textY - legendTextSize.height),
                            width: Math.abs((shapeLocation[j].x - (shapeWidth / 2)) - (textX + legendTextSize.width)),
                            height: ((shapeHeight > legendTextSize.height) ? shapeHeight : legendTextSize.height)
                        }
                    });
                    j++;
                }
                var collection = this.totalPages[0]['Collection'];
                Array.prototype.forEach.call(collection, function (legendObj, index) {
                    var legendRect = new Rect(legendObj['Rect']['x'], legendObj['Rect']['y'], legendObj['Rect']['width'], legendObj['Rect']['height']);
                    if (index === 0) {
                        legendItemStartX_1 = legendRect.x;
                        legendItemStartY_1 = legendRect.y;
                    }
                    _this.widthIncrement = Math.max(_this.widthIncrement, Math.abs(legendItemStartX_1 - (legendRect.x + legendRect.width)));
                    _this.heightIncrement = Math.max(_this.heightIncrement, Math.abs(legendItemStartY_1 - (legendRect.y + legendRect.height)));
                });
                legendWidth = ((this.widthIncrement < legendWidth) ? this.widthIncrement : legendWidth);
                legendHeight = ((this.heightIncrement < legendHeight) ? this.heightIncrement : legendHeight);
                this.legendItemRect = {
                    x: collection[0]['Rect']['x'], y: collection[0]['Rect']['y'],
                    width: legendWidth, height: legendHeight
                };
            }
        }
    };
    /**
     *
     */
    Legend.prototype.getLegends = function (layerIndex, layerData, colorMapping, dataSource, dataPath, colorValuePath, propertyPath) {
        this.getRangeLegendCollection(layerIndex, layerData, colorMapping, dataSource, dataPath, colorValuePath, propertyPath);
        this.getEqualLegendCollection(layerIndex, layerData, colorMapping, dataSource, dataPath, colorValuePath, propertyPath);
        this.getDataLegendCollection(layerIndex, layerData, colorMapping, dataSource, dataPath, colorValuePath, propertyPath);
    };
    Legend.prototype.getPageChanged = function () {
        this.page++;
        if (isNullOrUndefined(this.totalPages[this.page])) {
            this.totalPages[this.page] = { Page: (this.page + 1), Collection: [] };
        }
    };
    Legend.prototype.legendTextTrim = function (maxWidth, text, font, legendRectSize) {
        var label = text;
        var size = measureText(text, font).width;
        var legendWithoutTextSize = legendRectSize - size;
        if (legendRectSize > maxWidth) {
            var textLength = text.length;
            for (var i = textLength - 1; i >= 0; --i) {
                label = text.substring(0, i) + '...';
                size = measureText(label, font).width;
                var totalSize = legendWithoutTextSize + size;
                if (totalSize <= maxWidth || label.length < 4) {
                    if (label.length < 4) {
                        label = ' ';
                    }
                    return label;
                }
            }
        }
        return label;
    };
    /**
     * To draw the legend shape and text.
     */
    Legend.prototype.drawLegend = function () {
        var map = this.maps;
        var legend = map.legendSettings;
        var render = map.renderer;
        var textOptions;
        var textFont = legend.textStyle;
        this.legendGroup = render.createGroup({ id: map.element.id + '_Legend_Group' });
        if (legend.mode === 'Interactive') {
            for (var i = 0; i < this.legendRenderingCollections.length; i++) {
                var itemId = map.element.id + '_Legend_Index_' + i;
                var textId = map.element.id + '_Legend_Index_' + i + '_Text';
                var item = this.legendRenderingCollections[i];
                var bounds = new Rect(item['x'], item['y'], item['width'], item['height']);
                if (i === 0) {
                    this.renderLegendBorder();
                }
                var textLocation = new Point(item['textX'], item['textY']);
                textFont.color = (textFont.color !== null) ? textFont.color : this.maps.themeStyle.legendTextColor;
                var rectOptions = new RectOption(itemId, item['fill'], item['shapeBorder'], legend.opacity, bounds);
                textOptions = new TextOption(textId, textLocation.x, textLocation.y, 'middle', item['text'], '', '');
                textFont.fontFamily = map.themeStyle.fontFamily || textFont.fontFamily;
                textFont.size = map.themeStyle.legendFontSize || textFont.size;
                renderTextElement(textOptions, textFont, textFont.color, this.legendGroup);
                this.legendGroup.appendChild(render.drawRectangle(rectOptions));
                this.legendToggle();
            }
        }
        else {
            this.drawLegendItem(this.currentPage);
        }
    };
    // tslint:disable-next-line:max-func-body-length
    Legend.prototype.drawLegendItem = function (page) {
        var map = this.maps;
        var legend = map.legendSettings;
        var spacing = 10;
        var shapeSize = new Size(legend.shapeWidth, legend.shapeHeight);
        var textOptions;
        var renderOptions;
        var render = map.renderer;
        if (page >= 0 && page < this.totalPages.length) {
            if (querySelector(this.legendGroup.id, this.maps.element.id)) {
                remove(querySelector(this.legendGroup.id, this.maps.element.id));
            }
            for (var i = 0; i < this.totalPages[page]['Collection'].length; i++) {
                var collection = this.totalPages[page]['Collection'][i];
                var shapeBorder = collection['shapeBorder'];
                var legendElement = render.createGroup({ id: map.element.id + '_Legend_Index_' + collection['idIndex'] });
                var legendText = collection['DisplayText'];
                var shape = ((legend.type === 'Markers') ? ((isNullOrUndefined(collection['ImageSrc'])) ?
                    legend.shape : 'Image') : collection['legendShape']);
                var strokeColor = (legend.shape === 'HorizontalLine' || legend.shape === 'VerticalLine'
                    || legend.shape === 'Cross') ? isNullOrUndefined(legend.fill) ? '#000000' : legend.fill : shapeBorder.color;
                var strokeWidth = (legend.shape === 'HorizontalLine' || legend.shape === 'VerticalLine'
                    || legend.shape === 'Cross') ? (shapeBorder.width === 0) ?
                    1 : shapeBorder.width : shapeBorder.width;
                var shapeId = map.element.id + '_Legend_Shape_Index_' + collection['idIndex'];
                var textId = map.element.id + '_Legend_Text_Index_' + collection['idIndex'];
                var shapeLocation = collection['Shape'];
                var textLocation = collection['Text'];
                var imageUrl = ((isNullOrUndefined(collection['ImageSrc'])) ? legend.shape : collection['ImageSrc']);
                var renderOptions_1 = new PathOption(shapeId, collection['Fill'], strokeWidth, strokeColor, legend.opacity, '');
                legend.textStyle.color = (legend.textStyle.color !== null) ? legend.textStyle.color :
                    this.maps.themeStyle.legendTextColor;
                legend.textStyle.fontFamily = map.themeStyle.fontFamily || legend.textStyle.fontFamily;
                legend.textStyle.size = map.themeStyle.legendFontSize || legend.textStyle.size;
                if (i === 0) {
                    this.renderLegendBorder();
                }
                legendElement.appendChild(drawSymbol(shapeLocation, shape, shapeSize, collection['ImageSrc'], renderOptions_1));
                var legendRectSize = collection['Rect']['x'] + collection['Rect']['width'];
                if (legendRectSize > this.legendBorderRect.width) {
                    var trimmedText = this.legendTextTrim(this.legendBorderRect.width, legendText, legend.textStyle, legendRectSize);
                    legendText = trimmedText;
                }
                textOptions = new TextOption(textId, textLocation.x, textLocation.y, 'start', legendText, '', '');
                renderTextElement(textOptions, legend.textStyle, legend.textStyle.color, legendElement);
                this.legendGroup.appendChild(legendElement);
                if (i === (this.totalPages[page]['Collection'].length - 1)) {
                    var pagingGroup = void 0;
                    var width = spacing;
                    var height = (spacing / 2);
                    if (this.page !== 0) {
                        var pagingText = (page + 1) + '/' + this.totalPages.length;
                        var pagingFont = legend.textStyle;
                        var pagingTextSize = measureText(pagingText, pagingFont);
                        var leftPageX = (this.legendItemRect.x + this.legendItemRect.width) - pagingTextSize.width -
                            (width * 2) - spacing;
                        var rightPageX = (this.legendItemRect.x + this.legendItemRect.width);
                        var locY = (this.legendItemRect.y + this.legendItemRect.height) + (height / 2) + spacing;
                        var pageTextX = rightPageX - width - (pagingTextSize.width / 2) - (spacing / 2);
                        pagingGroup = render.createGroup({ id: map.element.id + '_Legend_Paging_Group' });
                        var leftPageElement = render.createGroup({ id: map.element.id + '_Legend_Left_Paging_Group' });
                        var rightPageElement = render.createGroup({ id: map.element.id + '_Legend_Right_Paging_Group' });
                        var rightPath = ' M ' + rightPageX + ' ' + locY + ' L ' + (rightPageX - width) + ' ' + (locY - height) +
                            ' L ' + (rightPageX - width) + ' ' + (locY + height) + ' z ';
                        var leftPath = ' M ' + leftPageX + ' ' + locY + ' L ' + (leftPageX + width) + ' ' + (locY - height) +
                            ' L ' + (leftPageX + width) + ' ' + (locY + height) + ' z ';
                        var leftPageOptions = new PathOption(map.element.id + '_Left_Page', '#a6a6a6', 0, '#a6a6a6', 1, '', leftPath);
                        leftPageElement.appendChild(render.drawPath(leftPageOptions));
                        var leftRectPageOptions = new RectOption(map.element.id + '_Left_Page_Rect', 'transparent', {}, 1, new Rect(leftPageX - (width / 2), (locY - (height * 2)), width * 2, spacing * 2), null, null, '', '');
                        leftPageElement.appendChild(render.drawRectangle(leftRectPageOptions));
                        this.wireEvents(leftPageElement);
                        var rightPageOptions = new PathOption(map.element.id + '_Right_Page', '#a6a6a6', 0, '#a6a6a6', 1, '', rightPath);
                        rightPageElement.appendChild(render.drawPath(rightPageOptions));
                        var rightRectPageOptions = new RectOption(map.element.id + '_Right_Page_Rect', 'transparent', {}, 1, new Rect((rightPageX - width), (locY - height), width, spacing), null, null, '', '');
                        rightPageElement.appendChild(render.drawRectangle(rightRectPageOptions));
                        this.wireEvents(rightPageElement);
                        pagingGroup.appendChild(leftPageElement);
                        pagingGroup.appendChild(rightPageElement);
                        var pageTextOptions = {
                            'id': map.element.id + '_Paging_Text',
                            'x': pageTextX,
                            'y': locY + (pagingTextSize.height / 4),
                            'fill': '#a6a6a6',
                            'font-size': '14px',
                            'font-style': pagingFont.fontStyle,
                            'font-family': pagingFont.fontFamily,
                            'font-weight': pagingFont.fontWeight,
                            'text-anchor': 'middle',
                            'transform': '',
                            'opacity': 1,
                            'dominant-baseline': ''
                        };
                        pagingGroup.appendChild(render.createText(pageTextOptions, pagingText));
                        this.legendGroup.appendChild(pagingGroup);
                    }
                    this.legendToggle();
                }
            }
        }
    };
    // tslint:disable-next-line:max-func-body-length
    Legend.prototype.legendHighLightAndSelection = function (targetElement, value) {
        var shapeIndex;
        var layerIndex;
        var dataIndex;
        var textEle;
        var legend = this.maps.legendSettings;
        textEle = legend.mode === 'Default' ? document.getElementById(targetElement.id.replace('Shape', 'Text')) :
            document.getElementById(targetElement.id + '_Text');
        var collection = this.maps.legendModule.legendCollection;
        var length;
        var multiSelectEnable = this.maps.layers[collection[0]['data'][0]['layerIndex']].selectionSettings.enableMultiSelect;
        var selectLength = 0;
        var interactProcess = true;
        var idIndex = parseFloat(targetElement.id.charAt(targetElement.id.length - 1));
        this.updateLegendElement();
        var toggleLegendCheck = this.maps.toggledLegendId.indexOf(idIndex);
        if (this.maps.legendSettings.toggleLegendSettings.enable && value === 'highlight' && toggleLegendCheck !== -1) {
            var collectionIndex = this.getIndexofLegend(this.legendHighlightCollection, targetElement);
            if (collectionIndex !== -1) {
                this.legendHighlightCollection.splice(collectionIndex, 1);
            }
            this.removeLegendHighlightCollection();
            return null;
        }
        if (value === 'selection') {
            this.shapeHighlightCollection = [];
            if (!this.maps.shapeSelections && !multiSelectEnable) {
                this.removeAllSelections();
                this.maps.shapeSelections = true;
            }
            if (this.maps.legendSelectionCollection.length > 0 && (!multiSelectEnable ? this.maps.shapeSelections : true)) {
                for (var k = 0; k < this.maps.legendSelectionCollection.length; k++) {
                    if (targetElement === this.maps.legendSelectionCollection[k]['legendElement']) {
                        this.maps.legendSelectionCollection[k]['legendElement'] = targetElement;
                        interactProcess = false;
                        this.removeLegendSelectionCollection(this.maps.legendSelectionCollection[k]['legendElement']);
                        this.maps.selectedLegendElementId.splice(this.maps.selectedLegendElementId.indexOf(idIndex), 1);
                        this.maps.legendSelectionCollection.splice(k, 1);
                        this.maps.legendSelection = this.maps.legendSelectionCollection.length > 0 ? false : true;
                        break;
                    }
                    else if (!multiSelectEnable) {
                        if (this.maps.legendSelectionCollection.length > 1) {
                            for (var z = 0; z < this.maps.legendSelectionCollection.length; z++) {
                                this.removeLegendSelectionCollection(this.maps.legendSelectionCollection[z]['legendElement']);
                            }
                            this.maps.legendSelectionCollection = [];
                        }
                        else {
                            this.removeLegendSelectionCollection(this.maps.legendSelectionCollection[k]['legendElement']);
                            this.maps.legendSelectionCollection.splice(k, 1);
                        }
                    }
                }
            }
        }
        else {
            if (this.maps.legendSelectionCollection.length > 0) {
                for (var k = 0; k < this.maps.legendSelectionCollection.length; k++) {
                    if ((targetElement.id.indexOf('_Legend_Shape') > -1 || targetElement.id.indexOf('_Legend_Index')) &&
                        targetElement === this.maps.legendSelectionCollection[k]['legendElement']) {
                        interactProcess = false;
                        break;
                    }
                    else {
                        this.removeLegendHighlightCollection();
                    }
                }
            }
            this.removeLegendHighlightCollection();
        }
        if (interactProcess) {
            for (var i = 0; i < collection.length; i++) {
                var idIndex_1 = this.maps.legendSettings.mode === 'Interactive' ?
                    parseFloat(targetElement.id.split('_Legend_Index_')[1]) :
                    parseFloat(targetElement.id.split('_Legend_Shape_Index_')[1]);
                if (textEle.textContent === collection[i]['text'] && collection[i]['data'].length > 0
                    && idIndex_1 === i) {
                    var layer = this.maps.layers[collection[i]['data'][0]['layerIndex']];
                    var enable = void 0;
                    var module = void 0;
                    var data = void 0;
                    if (!isNullOrUndefined(layer)) {
                        enable = (value === 'selection') ? layer.selectionSettings.enable : layer.highlightSettings.enable;
                        module = void 0;
                        module = (value === 'selection') ? layer.selectionSettings : layer.highlightSettings;
                        data = collection[i]['data'];
                    }
                    if (enable) {
                        for (var j = 0; j < data.length; j++) {
                            shapeIndex = data[j]['shapeIndex'];
                            layerIndex = data[j]['layerIndex'];
                            dataIndex = data[j]['dataIndex'];
                            var shapeEle = document.getElementById(this.maps.element.id + '_LayerIndex_' +
                                layerIndex + '_shapeIndex_' + shapeIndex + '_dataIndex_' + dataIndex);
                            if (shapeEle !== null) {
                                var shapeMatch = true;
                                if (this.maps.legendSelectionCollection !== null) {
                                    for (var i_1 = 0; i_1 < this.maps.legendSelectionCollection.length; i_1++) {
                                        if (this.maps.legendSelectionCollection[i_1]['legendElement'] === targetElement) {
                                            shapeMatch = false;
                                            break;
                                        }
                                    }
                                }
                                if (value === 'highlight' && shapeMatch) {
                                    if (j === 0) {
                                        this.legendHighlightCollection = [];
                                        this.pushCollection(targetElement, this.legendHighlightCollection, collection[i], layer.shapeSettings);
                                    }
                                    length = this.legendHighlightCollection.length;
                                    var legendHighlightColor = this.legendHighlightCollection[length - 1]['legendOldFill'];
                                    this.legendHighlightCollection[length - 1]['MapShapeCollection']['Elements'].push(shapeEle);
                                    var shapeItemCount = this.legendHighlightCollection[length - 1]['MapShapeCollection']['Elements'].length - 1;
                                    var shapeOldFillColor = shapeEle.getAttribute('fill');
                                    this.legendHighlightCollection[length - 1]['shapeOldFillColor'].push(shapeOldFillColor);
                                    var shapeOldColor = this.legendHighlightCollection[length - 1]['shapeOldFillColor'][shapeItemCount];
                                    this.shapePreviousColor = this.legendHighlightCollection[length - 1]['shapeOldFillColor'];
                                    this.setColor(shapeEle, !isNullOrUndefined(module.fill) ? module.fill : shapeOldColor, module.opacity.toString(), module.border.color, module.border.width.toString(), 'highlight');
                                    this.setColor(targetElement, !isNullOrUndefined(module.fill) ? module.fill : legendHighlightColor, module.opacity.toString(), module.border.color, module.border.width.toString(), 'highlight');
                                }
                                else if (value === 'selection') {
                                    this.legendHighlightCollection = [];
                                    this.maps.legendSelectionClass = module;
                                    if (j === 0) {
                                        this.pushCollection(targetElement, this.maps.legendSelectionCollection, collection[i], layer.shapeSettings);
                                        if (multiSelectEnable) {
                                            this.maps.selectedLegendElementId.push(i);
                                        }
                                        else {
                                            if (this.maps.selectedLegendElementId.length === 0) {
                                                this.maps.selectedLegendElementId.push(i);
                                            }
                                            else {
                                                this.maps.selectedLegendElementId = [];
                                                this.maps.selectedLegendElementId.push(i);
                                            }
                                        }
                                    }
                                    selectLength = this.maps.legendSelectionCollection.length;
                                    var legendSelectionColor = void 0;
                                    legendSelectionColor = this.maps.legendSelectionCollection[selectLength - 1]['legendOldFill'];
                                    this.maps.legendSelectionCollection[selectLength - 1]['MapShapeCollection']['Elements'].push(shapeEle);
                                    this.maps.legendSelectionCollection[selectLength - 1]['shapeOldFillColor'] = this.shapePreviousColor;
                                    this.setColor(targetElement, !isNullOrUndefined(module.fill) ? module.fill : legendSelectionColor, module.opacity.toString(), module.border.color, module.border.width.toString(), 'selection');
                                    this.setColor(shapeEle, !isNullOrUndefined(module.fill) ? module.fill : legendSelectionColor, module.opacity.toString(), module.border.color, module.border.width.toString(), 'selection');
                                    if (this.maps.selectedElementId.indexOf(shapeEle.getAttribute('id')) === -1) {
                                        this.maps.selectedElementId.push(shapeEle.getAttribute('id'));
                                    }
                                    if (j === data.length - 1) {
                                        this.maps.legendSelection = false;
                                        this.removeLegend(this.maps.legendSelectionCollection);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    };
    Legend.prototype.setColor = function (element, fill, opacity, borderColor, borderWidth, type) {
        if (type === 'selection') {
            maintainStyleClass('ShapeselectionMap', 'ShapeselectionMapStyle', fill, opacity, borderColor, borderWidth, this.maps);
            element.setAttribute('class', 'ShapeselectionMapStyle');
        }
        else {
            element.setAttribute('fill', fill);
            element.setAttribute('opacity', opacity);
            element.setAttribute('stroke', borderColor);
            element.setAttribute('stroke-width', (Number(borderWidth) / this.maps.scale).toString());
        }
    };
    Legend.prototype.pushCollection = function (targetElement, collection, oldElement, shapeSettings) {
        collection.push({
            legendElement: targetElement, legendOldFill: oldElement['fill'], legendOldOpacity: oldElement['opacity'],
            legendOldBorderColor: oldElement['borderColor'], legendOldBorderWidth: oldElement['borderWidth'],
            shapeOpacity: shapeSettings.opacity, shapeOldBorderColor: shapeSettings.border.color,
            shapeOldBorderWidth: shapeSettings.border.width
        });
        length = collection.length;
        collection[length - 1]['MapShapeCollection'] = { Elements: [] };
        collection[length - 1]['shapeOldFillColor'] = [];
    };
    Legend.prototype.removeLegend = function (collection) {
        for (var i = 0; i < collection.length; i++) {
            var item = collection[i];
            this.setColor(item['legendElement'], item['legendOldFill'], item['legendOldOpacity'], item['legendOldBorderColor'], item['legendOldBorderWidth'], 'highlight');
            var dataCount = item['MapShapeCollection']['Elements'].length;
            for (var j = 0; j < dataCount; j++) {
                var shapeFillColor = item['legendOldFill'].indexOf('url') !== -1
                    ? item['shapeOldFillColor'][j] : item['legendOldFill'];
                this.setColor(item['MapShapeCollection']['Elements'][j], shapeFillColor, item['shapeOpacity'], item['shapeOldBorderColor'], item['shapeOldBorderWidth'], 'highlight');
            }
        }
    };
    Legend.prototype.removeLegendHighlightCollection = function () {
        if (this.legendHighlightCollection.length > 0) {
            this.removeLegend(this.legendHighlightCollection);
            this.legendHighlightCollection = [];
        }
    };
    Legend.prototype.removeLegendSelectionCollection = function (targetElement) {
        if (this.maps.legendSelectionCollection.length > 0) {
            removeClass(targetElement);
            var shapeElements = this.shapesOfLegend(targetElement);
            var dataCount = shapeElements.length;
            for (var j = 0; j < dataCount; j++) {
                var shapeElement = getElement(shapeElements[j]);
                if (shapeElement.getAttribute('class') === 'ShapeselectionMapStyle') {
                    removeClass(shapeElement);
                    var selectedElementIdIndex = void 0;
                    selectedElementIdIndex = this.maps.selectedElementId.indexOf(shapeElement.id);
                    if (selectedElementIdIndex !== -1) {
                        this.maps.selectedElementId.splice(selectedElementIdIndex, 1);
                    }
                }
            }
        }
    };
    Legend.prototype.removeShapeHighlightCollection = function () {
        if (this.shapeHighlightCollection.length > 0) {
            for (var i = 0; i < this.shapeHighlightCollection.length; i++) {
                var item = this.shapeHighlightCollection[i];
                var removeFill = true;
                for (var j = 0; j < this.maps.legendSelectionCollection.length; j++) {
                    if (this.maps.legendSelectionCollection[j]['legendElement'] === item['legendElement']) {
                        removeFill = false;
                    }
                }
                if (removeFill) {
                    this.setColor(item['legendElement'], item['legendOldFill'], item['legendOldOpacity'], item['legendOldBorderColor'], item['legendOldBorderWidth'], 'highlight');
                }
            }
        }
    };
    // tslint:disable-next-line:max-func-body-length
    Legend.prototype.shapeHighLightAndSelection = function (targetElement, data, module, getValue, layerIndex) {
        if (data !== undefined) {
            this.updateLegendElement();
            this.shapeToggled = true;
            var collection = this.maps.legendModule.legendCollection;
            var indexes = this.legendIndexOnShape(data, layerIndex);
            var shapeElement = this.shapeDataOnLegend(targetElement);
            var toggleLegendCheck = this.maps.toggledLegendId.indexOf(indexes['actualIndex']);
            if (this.maps.legendSettings.toggleLegendSettings.enable && toggleLegendCheck !== -1) {
                this.shapeToggled = false;
                this.legendHighlightCollection = [];
                var collectionIndex = this.getIndexofLegend(this.shapeHighlightCollection, shapeElement['LegendEle']);
                if (collectionIndex !== -1) {
                    this.shapeHighlightCollection.splice(collectionIndex, 1);
                }
                this.removeShapeHighlightCollection();
                return null;
            }
            if (indexes['currentIndex'] === undefined && indexes['actualIndex'] === undefined) {
                this.removeShapeHighlightCollection();
                return null;
            }
            if (indexes['currentIndex'] === undefined && getValue === 'selection'
                && !this.maps.layers[layerIndex].selectionSettings.enableMultiSelect &&
                targetElement.getAttribute('class') !== 'ShapeselectionMapStyle') {
                this.maps.legendSelection = false;
            }
            if (getValue === 'selection' && !this.maps.layers[layerIndex].selectionSettings.enableMultiSelect &&
                !this.maps.legendSelection) {
                this.removeAllSelections();
                this.maps.legendSelection = true;
            }
            if (indexes['currentIndex'] === undefined) {
                if (getValue === 'selection' && indexes['actualIndex'] !== undefined) {
                    var checkSelection = 0;
                    for (var i = 0; i < shapeElement['Elements'].length; i++) {
                        if (shapeElement['Elements'][i].getAttribute('class') === 'ShapeselectionMapStyle') {
                            checkSelection++;
                        }
                    }
                    var selectionIndex = this.maps.selectedLegendElementId.indexOf(indexes['actualIndex']);
                    if (selectionIndex === -1) {
                        this.maps.selectedLegendElementId.push(indexes['actualIndex']);
                        this.maps.legendSelectionClass = module;
                    }
                    else {
                        if ((checkSelection <= 1) && targetElement.getAttribute('class') === 'ShapeselectionMapStyle') {
                            if (!this.maps.layers[layerIndex].selectionSettings.enableMultiSelect) {
                                this.maps.selectedLegendElementId.splice(selectionIndex, 1);
                            }
                            else {
                                if (checkSelection <= 1 && targetElement.getAttribute('class') === 'ShapeselectionMapStyle') {
                                    this.maps.selectedLegendElementId.splice(selectionIndex, 1);
                                }
                            }
                        }
                    }
                }
                this.removeShapeHighlightCollection();
                return null;
            }
            var text = collection[indexes['actualIndex']]['text'];
            var content = void 0;
            var legendShape = void 0;
            if (this.maps.legendSettings.mode === 'Default') {
                if (indexes['currentIndex'] !== undefined) {
                    content = document.getElementById(this.maps.element.id + '_Legend_Text_Index_' + indexes['actualIndex']).textContent;
                    legendShape = document.getElementById(this.maps.element.id + '_Legend_Shape_Index_' + indexes['actualIndex']);
                }
            }
            else {
                content = document.getElementById(this.maps.element.id + '_Legend_Index_' + indexes['actualIndex']
                    + '_Text').textContent;
                legendShape = document.getElementById(this.maps.element.id + '_Legend_Index_' + indexes['actualIndex']);
            }
            this.oldShapeElement = shapeElement['LegendEle'];
            var length_1 = this.maps.legendSelectionCollection.length;
            if (text === content) {
                var shapeMatched = true;
                if (this.maps.legendSelectionCollection) {
                    for (var i = 0; i < this.maps.legendSelectionCollection.length; i++) {
                        if (this.maps.legendSelectionCollection[i]['legendElement'] === shapeElement['LegendEle']) {
                            shapeMatched = false;
                            break;
                        }
                    }
                }
                if (getValue === 'highlight' && shapeMatched) {
                    var selectionEle = this.isTargetSelected(shapeElement, this.shapeHighlightCollection);
                    if (selectionEle === undefined || (selectionEle && !selectionEle['IsSelected'])) {
                        this.pushCollection(legendShape, this.shapeHighlightCollection, collection[indexes['actualIndex']], this.maps.layers[layerIndex].shapeSettings);
                    }
                    for (var j = 0; j < this.shapeHighlightCollection.length; j++) {
                        if (shapeElement['LegendEle'].id === this.shapeHighlightCollection[j]['legendElement'].id) {
                            this.shapeHighlightCollection[j]['legendElement'] = shapeElement['LegendEle'];
                        }
                    }
                    if (length_1 > 0) {
                        for (var j = 0; j < length_1; j++) {
                            if (shapeElement['LegendEle'] === this.maps.legendSelectionCollection[j]['legendElement']) {
                                this.maps.legendSelectionCollection[j]['legendElement'] = shapeElement['LegendEle'];
                                this.removeShapeHighlightCollection();
                                break;
                            }
                            else if (j === length_1 - 1) {
                                this.removeShapeHighlightCollection();
                                this.setColor(legendShape, !isNullOrUndefined(module.fill) ? module.fill : legendShape.getAttribute('fill'), module.opacity.toString(), module.border.color, module.border.width.toString(), 'highlight');
                            }
                        }
                    }
                    else {
                        this.removeShapeHighlightCollection();
                        this.setColor(legendShape, !isNullOrUndefined(module.fill) ? module.fill : legendShape.getAttribute('fill'), module.opacity.toString(), module.border.color, module.border.width.toString(), 'highlight');
                    }
                }
                else if (getValue === 'selection') {
                    var selectionEle = this.isTargetSelected(shapeElement, this.maps.legendSelectionCollection);
                    if (length_1 > 0) {
                        var j = 0;
                        while (j < this.maps.legendSelectionCollection.length) {
                            if (shapeElement['LegendEle'] !== this.maps.legendSelectionCollection[j]['legendElement'] &&
                                !module.enableMultiSelect) {
                                var element = this.maps.legendSelectionCollection[j];
                                var selectedLegendIndex = this.maps.selectedLegendElementId.indexOf(indexes['actualIndex']);
                                this.maps.selectedLegendElementId.splice(selectedLegendIndex, 1);
                                this.maps.legendSelectionCollection.splice(j, 1);
                                removeClass(element['legendElement']);
                                this.maps.shapeSelections = true;
                                j = 0;
                            }
                            else {
                                j++;
                            }
                        }
                    }
                    if (selectionEle && (selectionEle['IsSelected'] && targetElement.getAttribute('class') === 'ShapeselectionMapStyle')) {
                        var element = this.maps.legendSelectionCollection[selectionEle['SelectionIndex']];
                        var multiSelection = 0;
                        if (module.enableMultiSelect) {
                            for (var i = 0; i < shapeElement['Elements'].length; i++) {
                                if (targetElement.getAttribute('class') === shapeElement['Elements'][i].getAttribute('class')) {
                                    multiSelection++;
                                }
                            }
                        }
                        if (multiSelection <= 1 && (!module.enableMultiSelect ?
                            this.maps.legendSelection : true)) {
                            this.maps.selectedLegendElementId.splice(this.maps.selectedLegendElementId.indexOf(indexes['actualIndex']), 1);
                            if (!isNullOrUndefined(shapeElement['LegendEle'])) {
                                removeClass(shapeElement['LegendEle']);
                            }
                            this.maps.legendSelectionCollection.splice(selectionEle['SelectionIndex'], 1);
                            this.maps.shapeSelections = true;
                        }
                    }
                    else {
                        if ((selectionEle === undefined || (selectionEle && !selectionEle['IsSelected'])) &&
                            !isNullOrUndefined(legendShape)) {
                            var legendSelectionIndex = this.getIndexofLegend(this.maps.legendSelectionCollection, legendShape);
                            if (legendSelectionIndex === -1) {
                                this.pushCollection(legendShape, this.maps.legendSelectionCollection, collection[indexes['actualIndex']], this.maps.layers[layerIndex].shapeSettings);
                            }
                        }
                        var addId = true;
                        for (var i = 0; i < this.maps.selectedLegendElementId.length; i++) {
                            if (indexes['actualIndex'] === this.maps.selectedLegendElementId[i]) {
                                addId = false;
                            }
                        }
                        if (addId) {
                            this.maps.selectedLegendElementId.push(indexes['actualIndex']);
                        }
                        this.maps.legendSelectionClass = module;
                        this.removeLegend(this.shapeHighlightCollection);
                        if (!isNullOrUndefined(legendShape)) {
                            this.setColor(legendShape, !isNullOrUndefined(module.fill) ? module.fill : legendShape.getAttribute('fill'), module.opacity.toString(), module.border.color, module.border.width.toString(), 'selection');
                            var legendSelectionIndex = this.getIndexofLegend(this.maps.legendSelectionCollection, legendShape);
                            this.maps.legendSelectionCollection[legendSelectionIndex]['MapShapeCollection']['Elements'].push(targetElement);
                        }
                        this.maps.shapeSelections = false;
                    }
                }
                else if (document.getElementsByClassName('highlightMapStyle').length > 0) {
                    this.removeShapeHighlightCollection();
                    removeClass(document.getElementsByClassName('highlightMapStyle')[0]);
                }
            }
        }
        else {
            this.removeShapeHighlightCollection();
        }
    };
    Legend.prototype.isTargetSelected = function (target, collection) {
        var selectEle;
        for (var i = 0; i < collection.length; i++) {
            if (!isNullOrUndefined(target['LegendEle'].getAttribute('id')) &&
                (target['LegendEle'].getAttribute('id') === collection[i]['legendElement'].getAttribute('id'))) {
                selectEle = { IsSelected: true, SelectionIndex: i };
            }
        }
        return selectEle;
    };
    Legend.prototype.updateLegendElement = function () {
        for (var i = 0; i < this.maps.legendSelectionCollection.length; i++) {
            if (document.getElementById(this.maps.legendSelectionCollection[i]['legendElement'].id)) {
                this.maps.legendSelectionCollection[i]['legendElement'] =
                    document.getElementById(this.maps.legendSelectionCollection[i]['legendElement'].id);
            }
        }
    };
    Legend.prototype.getIndexofLegend = function (targetCollection, targetElement) {
        var legendIndex = targetCollection.map(function (e) { return e['legendElement']; }).indexOf(targetElement);
        return legendIndex;
    };
    Legend.prototype.removeAllSelections = function () {
        for (var i = 0; i < this.maps.selectedElementId.length; i++) {
            var selectedElement = document.getElementById(this.maps.selectedElementId[i]);
            removeClass(selectedElement);
        }
        for (var j = 0; j < this.maps.selectedLegendElementId.length; j++) {
            var idIndex = this.maps.legendSettings.mode === 'Interactive' ?
                'container_Legend_Index_' : 'container_Legend_Shape_Index_';
            var selectedElement = idIndex + this.maps.selectedLegendElementId[j];
            var legendElement = document.getElementById(selectedElement);
            if (!isNullOrUndefined(legendElement)) {
                removeClass(document.getElementById(selectedElement));
            }
        }
        this.maps.legendSelectionCollection = [];
        this.maps.selectedLegendElementId = [];
        this.maps.selectedElementId = [];
    };
    Legend.prototype.legendIndexOnShape = function (data, index) {
        var legendIndex;
        var actualIndex;
        var path = this.maps.layers[index].shapeDataPath;
        var value = data[path];
        var legendType = this.maps.legendSettings.mode;
        var collection = this.maps.legendModule.legendCollection;
        var currentCollection;
        if (legendType === 'Default' && !isNullOrUndefined(this.maps.legendModule.totalPages)) {
            currentCollection = this.maps.legendModule.totalPages[this.maps.legendModule.currentPage]['Collection'];
        }
        var currentCollectionLength = legendType === 'Default' ? currentCollection['length'] : 1;
        for (var i = 0; i < collection.length; i++) {
            var dataValue = collection[i]['data'];
            for (var k = 0; k < currentCollectionLength; k++) {
                if (legendType !== 'Default' || collection[i]['text'] === currentCollection[k]['DisplayText']) {
                    for (var j = 0; j < dataValue.length; j++) {
                        if (value === dataValue[j]['name']) {
                            legendIndex = k;
                        }
                    }
                }
            }
            for (var j = 0; j < dataValue.length; j++) {
                if (value === dataValue[j]['name']) {
                    actualIndex = i;
                }
            }
        }
        return { currentIndex: legendIndex, actualIndex: actualIndex };
    };
    Legend.prototype.shapeDataOnLegend = function (targetElement) {
        var shapeIndex;
        var layerIndex;
        var dataIndex;
        var collection = this.maps.legendModule.legendCollection;
        var legend = this.maps.legendSettings;
        for (var i = 0; i < collection.length; i++) {
            var data = collection[i]['data'];
            var process = false;
            var elements = [];
            var currentElement = { Elements: [] };
            for (var j = 0; j < data.length; j++) {
                shapeIndex = data[j]['shapeIndex'];
                layerIndex = data[j]['layerIndex'];
                dataIndex = data[j]['dataIndex'];
                var shapeEle = document.getElementById(this.maps.element.id + '_LayerIndex_' +
                    layerIndex + '_shapeIndex_' + shapeIndex + '_dataIndex_' + dataIndex);
                if (targetElement === shapeEle) {
                    process = true;
                }
                elements.push(shapeEle);
            }
            if (process) {
                if (isNullOrUndefined(currentElement['LegendEle'])) {
                    currentElement['LegendEle'] = legend.mode === 'Default' ?
                        document.getElementById(this.maps.element.id + '_Legend_Shape_Index_' + i) :
                        document.getElementById(this.maps.element.id + '_Legend_Index_' + i);
                }
                currentElement['Elements'] = elements;
                return currentElement;
            }
        }
        return null;
    };
    Legend.prototype.shapesOfLegend = function (targetElement) {
        var shapeIndex;
        var layerIndex;
        var dataIndex;
        var idIndex = parseFloat(targetElement.id.charAt(targetElement.id.length - 1));
        var data = this.maps.legendModule.legendCollection[idIndex]['data'];
        var legendShapeElements = [];
        for (var i = 0; i < data.length; i++) {
            shapeIndex = data[i]['shapeIndex'];
            layerIndex = data[i]['layerIndex'];
            dataIndex = data[i]['dataIndex'];
            var shapeElement = document.getElementById(this.maps.element.id + '_LayerIndex_' +
                layerIndex + '_shapeIndex_' + shapeIndex + '_dataIndex_' + dataIndex);
            if (!isNullOrUndefined(shapeElement)) {
                legendShapeElements.push(shapeElement.id);
            }
        }
        return legendShapeElements;
    };
    //tslint:disable
    Legend.prototype.legendToggle = function () {
        var map = this.maps;
        var legend = map.legendSettings;
        if (this.maps.selectedLegendElementId) {
            // To maintain the state of legend selection during page resize.
            for (var j = 0; j < this.maps.selectedLegendElementId.length; j++) {
                var idIndex = legend.mode === 'Interactive' ? this.maps.element.id + '_Legend_Index_' : this.maps.element.id + '_Legend_Shape_Index_';
                var selectedElement = map.svgObject.querySelector('#' + idIndex + this.maps.selectedLegendElementId[j]);
                if (!isNullOrUndefined(selectedElement)) {
                    var fill = !isNullOrUndefined(this.maps.legendSelectionClass.fill) ?
                        this.maps.legendSelectionClass.fill : selectedElement.getAttribute('fill');
                    this.setColor(selectedElement, fill, this.maps.legendSelectionClass.opacity.toString(), this.maps.legendSelectionClass.border.color, this.maps.legendSelectionClass.border.width.toString(), 'selection');
                    for (var i = 0; i < this.maps.legendSelectionCollection.length; i++) {
                        if (this.maps.legendSelectionCollection[i]['legendElement'].id === selectedElement.id) {
                            this.maps.legendSelectionCollection[i]['legendElement'] = selectedElement;
                        }
                    }
                    var legendSelectionIndex = this.getIndexofLegend(this.maps.legendSelectionCollection, selectedElement);
                    if (legendSelectionIndex === -1) {
                        var layerIndex = this.maps.legendModule.legendCollection[this.maps.selectedLegendElementId[j]]['data'][j]['layerIndex'];
                        this.pushCollection(selectedElement, this.maps.legendSelectionCollection, this.maps.legendModule.legendCollection[this.maps.selectedLegendElementId[j]], this.maps.layers[layerIndex].shapeSettings);
                    }
                }
            }
            ;
        }
        if (this.maps.toggledLegendId) {
            for (var j = 0; j < this.maps.toggledLegendId.length; j++) {
                var legendTextId = legend.mode === 'Interactive' ? ('#' + this.maps.element.id + '_Legend_Index_' + this.maps.toggledLegendId[j] + '_Text') : ('#' + this.maps.element.id + '_Legend_Text_Index_' + this.maps.toggledLegendId[j]);
                var textElement = map.svgObject.querySelector(legendTextId);
                if (!isNullOrUndefined(textElement)) {
                    textElement.setAttribute("fill", "#E5E5E5");
                }
                var legendShapeId = legend.mode === 'Interactive' ? ('#' + this.maps.element.id + '_Legend_Index_' + this.maps.toggledLegendId[j]) : ('#' + this.maps.element.id + '_Legend_Shape_Index_' + this.maps.toggledLegendId[j]);
                var legendElement = map.svgObject.querySelector(legendShapeId);
                if (!isNullOrUndefined(legendElement)) {
                    legendElement.setAttribute("fill", "#E5E5E5");
                }
            }
        }
    };
    //tslint:disable
    Legend.prototype.renderLegendBorder = function () {
        var map = this.maps;
        var legend = map.legendSettings;
        var legendTitle = legend.title.text;
        var textStyle = legend.titleStyle;
        var textOptions;
        var spacing = 10;
        var trimTitle = textTrim((this.legendItemRect.width + (spacing * 2)), legendTitle, textStyle);
        var textSize = measureText(trimTitle, textStyle);
        this.legendBorderRect = new Rect((this.legendItemRect.x - spacing), (this.legendItemRect.y - spacing - textSize.height), (this.legendItemRect.width) + (spacing * 2), (this.legendItemRect.height) + (spacing * 2) + textSize.height +
            (legend.mode === 'Interactive' ? 0 : (this.page !== 0) ? spacing : 0));
        var renderOptions = new RectOption(map.element.id + '_Legend_Border', legend.background, legend.border, 1, this.legendBorderRect, null, null, '', '');
        this.legendGroup.appendChild(map.renderer.drawRectangle(renderOptions));
        this.getLegendAlignment(map, this.legendBorderRect.width, this.legendBorderRect.height, legend);
        this.legendGroup.setAttribute('transform', 'translate( ' + (this.translate.x + (-(this.legendBorderRect.x))) + ' ' +
            (this.translate.y + (-(this.legendBorderRect.y))) + ' )');
        map.svgObject.appendChild(this.legendGroup);
        if (legendTitle) {
            textStyle.color = (textStyle.color !== null) ? textStyle.color : this.maps.themeStyle.legendTextColor;
            textOptions = new TextOption(map.element.id + '_LegendTitle', (this.legendItemRect.x) + (this.legendItemRect.width / 2), this.legendItemRect.y - (textSize.height / 2) - spacing / 2, 'middle', trimTitle, '');
            renderTextElement(textOptions, textStyle, textStyle.color, this.legendGroup);
        }
    };
    Legend.prototype.changeNextPage = function (e) {
        this.currentPage = (e.target.id.indexOf('_Left_Page_') > -1) ? (this.currentPage - 1) :
            (this.currentPage + 1);
        this.legendGroup = this.maps.renderer.createGroup({ id: this.maps.element.id + '_Legend_Group' });
        this.drawLegendItem(this.currentPage);
        if (querySelector(this.maps.element.id + '_Legend_Border', this.maps.element.id)) {
            querySelector(this.maps.element.id + '_Legend_Border', this.maps.element.id).style.pointerEvents = 'none';
        }
    };
    Legend.prototype.getLegendAlignment = function (map, width, height, legend) {
        var x;
        var y;
        var spacing = 10;
        var totalRect;
        totalRect = extend({}, map.mapAreaRect, totalRect, true);
        var areaX = totalRect.x;
        var areaY = totalRect.y;
        var areaHeight = totalRect.height;
        var areaWidth = totalRect.width;
        var totalWidth = map.availableSize.width;
        var totalHeight = map.availableSize.height;
        if (legend.position === 'Float') {
            this.translate = legend.location;
        }
        else {
            switch (legend.position) {
                case 'Top':
                case 'Bottom':
                    totalRect.height = (areaHeight - height);
                    x = (totalWidth / 2) - (width / 2);
                    y = (legend.position === 'Top') ? areaY : (areaY + totalRect.height);
                    totalRect.y = (legend.position === 'Top') ? areaY + height + spacing : areaY;
                    break;
                case 'Left':
                case 'Right':
                    totalRect.width = (areaWidth - width);
                    x = (legend.position === 'Left') ? areaX : (areaX + totalRect.width) - spacing;
                    y = (totalHeight / 2) - (height / 2);
                    totalRect.x = (legend.position === 'Left') ? areaX + width : areaX;
                    break;
            }
            switch (legend.alignment) {
                case 'Near':
                    if (legend.position === 'Top' || legend.position === 'Bottom') {
                        x = totalRect.x;
                    }
                    else {
                        y = totalRect.y;
                    }
                    break;
                case 'Far':
                    if (legend.position === 'Top' || legend.position === 'Bottom') {
                        x = (totalWidth - width) - spacing;
                    }
                    else {
                        y = totalHeight - height;
                    }
                    break;
            }
            if ((legend.height || legend.width) && legend.mode !== 'Interactive') {
                map.totalRect = totalRect;
            }
            else {
                map.mapAreaRect = totalRect;
            }
            this.translate = new Point(x, y);
        }
    };
    Legend.prototype.getMarkersLegendCollections = function (layerIndex, markers) {
        var _this = this;
        Array.prototype.forEach.call(markers, function (marker, markerIndex) {
            var dataSource = marker.dataSource;
            var field = marker.legendText;
            var templateFn;
            var isDuplicate;
            Array.prototype.forEach.call(dataSource, function (data, dataIndex) {
                var imageSrc = null;
                var showLegend = isNullOrUndefined(data[_this.maps.legendSettings.showLegendPath]) ? true :
                    data[_this.maps.legendSettings.showLegendPath];
                if (marker.visible && showLegend && (!isNullOrUndefined(data['latitude'])) && (!isNullOrUndefined(data['longitude']))) {
                    if (marker.template) {
                        templateFn = getTemplateFunction(marker.template);
                        var templateElement = templateFn(_this.maps);
                        var markerEle = isNullOrUndefined(templateElement.childElementCount) ? templateElement[0] :
                            templateElement;
                        imageSrc = markerEle.querySelector('img').src;
                    }
                    var text = isNullOrUndefined(data[field]) ? '' : data[field];
                    isDuplicate = _this.maps.legendSettings.removeDuplicateLegend ?
                        _this.removeDuplicates(_this.legendCollection, text) : false;
                    if (!isDuplicate) {
                        _this.legendCollection.push({
                            layerIndex: layerIndex, markerIndex: markerIndex, dataIndex: dataIndex,
                            fill: marker.fill, text: text, imageSrc: imageSrc
                        });
                    }
                }
            });
        });
    };
    Legend.prototype.getRangeLegendCollection = function (layerIndex, layerData, colorMapping, dataSource, dataPath, colorValuePath, propertyPath) {
        var _this = this;
        var legendText;
        var legendIndex = 0;
        var fill = this.maps.legendSettings.fill;
        var rangeData = [];
        var _loop_1 = function (colorMap) {
            if (!isNullOrUndefined(colorMap.from) && !isNullOrUndefined(colorMap.to)) {
                legendText = !isNullOrUndefined(colorMap.label) ? colorMap.label : colorMap.from + ' - ' + colorMap.to;
                rangeData = [];
                var colorMapProcess_1 = false;
                Array.prototype.forEach.call(dataSource, function (data, dataIndex) {
                    var colorValue = (colorValuePath.indexOf(".") > -1) ? Number(getValueFromObject(data, colorValuePath)) :
                        parseFloat(data[colorValuePath]);
                    if (colorValue >= colorMap.from && colorValue <= colorMap.to) {
                        colorMapProcess_1 = true;
                        rangeData.push(_this.getLegendData(layerIndex, dataIndex, data, dataPath, layerData, propertyPath, colorValue));
                    }
                });
                if (!colorMapProcess_1) {
                    rangeData.push({
                        layerIndex: layerIndex, shapeIndex: null, dataIndex: null,
                        name: null, value: null
                    });
                }
                var legendFill = (isNullOrUndefined(fill)) ? Object.prototype.toString.call(colorMap.color) === '[object Array]' ?
                    !isNullOrUndefined(colorMap.value) ? colorMap.color[0] : this_1.legendGradientColor(colorMap, legendIndex) :
                    colorMap.color : fill;
                legendIndex++;
                this_1.getOverallLegendItemsCollection(legendText, legendFill, rangeData, colorMap.showLegend);
            }
        };
        var this_1 = this;
        for (var _i = 0, colorMapping_1 = colorMapping; _i < colorMapping_1.length; _i++) {
            var colorMap = colorMapping_1[_i];
            _loop_1(colorMap);
        }
    };
    Legend.prototype.getOverallLegendItemsCollection = function (legendText, legendFill, legendData, showLegend) {
        var newColllection = [];
        var legend = this.maps.legendSettings;
        if (legendData.length > 0 && showLegend) {
            for (var i = 0; i < legendData.length; i++) {
                var collection = legendData[i];
                if (collection.length > 0) {
                    for (var j = 0; j < collection.length; j++) {
                        newColllection.push(collection[j]);
                    }
                }
                else {
                    newColllection.push(legendData[i]);
                }
                newColllection['_isVisible'] = true;
            }
            var isDuplicate = this.maps.legendSettings.removeDuplicateLegend ?
                this.removeDuplicates(this.legendCollection, legendText) : false;
            if (!isDuplicate) {
                this.legendCollection.push({
                    text: legendText, fill: legendFill, data: newColllection, opacity: legend.opacity,
                    borderColor: legend.shapeBorder.color, borderWidth: legend.shapeBorder.width
                });
            }
        }
    };
    Legend.prototype.removeDuplicates = function (legendCollection, text) {
        var isDuplicate = false;
        for (var i = 0; i < legendCollection.length; i++) {
            if (legendCollection[i]['text'] === text) {
                isDuplicate = true;
                break;
            }
            else {
                continue;
            }
        }
        return isDuplicate;
    };
    Legend.prototype.getEqualLegendCollection = function (layerIndex, layerData, colorMapping, dataSource, dataPath, colorValuePath, propertyPath) {
        var _this = this;
        var fill = this.maps.legendSettings.fill;
        var equalValues = [];
        var legendText;
        var legendIndex = 0;
        var equalData = [];
        var outOfRangeValues = [];
        var outOfRange = [];
        var _loop_2 = function (colorMap) {
            if (!isNullOrUndefined(colorMap.value)) {
                legendText = !isNullOrUndefined(colorMap.label) ? colorMap.label : colorMap.value;
                equalData = [];
                var eqaulColorProcess_1 = false;
                Array.prototype.forEach.call(dataSource, function (data, dataIndex) {
                    var equalValue = ((colorValuePath.indexOf(".") > -1) ? (getValueFromObject(data, colorValuePath)) :
                        (data[colorValuePath]));
                    if (equalValue === colorMap.value) {
                        eqaulColorProcess_1 = true;
                        if (equalValues.indexOf(equalValue) === -1) {
                            equalValues.push(equalValue);
                        }
                        equalData.push(_this.getLegendData(layerIndex, dataIndex, data, dataPath, layerData, propertyPath, equalValue));
                    }
                    else {
                        if (outOfRangeValues.indexOf(equalValue) === -1) {
                            outOfRangeValues.push(equalValue);
                        }
                    }
                });
                for (var x = 0; x < equalValues.length; x++) {
                    for (var y = 0; y < outOfRangeValues.length; y++) {
                        if (equalValues[x] === outOfRangeValues[y]) {
                            var equalIndex = outOfRangeValues.indexOf(equalValues[x]);
                            outOfRangeValues.splice(equalIndex, 1);
                        }
                    }
                }
                if (!eqaulColorProcess_1) {
                    equalData.push({
                        layerIndex: layerIndex, shapeIndex: null, dataIndex: null,
                        name: null, value: null
                    });
                }
                var legendFill = (isNullOrUndefined(fill)) ? Object.prototype.toString.call(colorMap.color) === '[object Array]'
                    ? colorMap.color[0] : colorMap.color : fill;
                legendIndex++;
                this_2.getOverallLegendItemsCollection(legendText, legendFill, equalData, colorMap.showLegend);
            }
            else if (isNullOrUndefined(colorMap.minOpacity) && isNullOrUndefined(colorMap.maxOpacity) && isNullOrUndefined(colorMap.value)
                && isNullOrUndefined(colorMap.from) && isNullOrUndefined(colorMap.to) && !isNullOrUndefined(colorMap.color)) {
                Array.prototype.forEach.call(dataSource, function (data, dataIndex) {
                    var equalValue = ((colorValuePath.indexOf(".") > -1) ? (getValueFromObject(data, colorValuePath)) :
                        (data[colorValuePath]));
                    for (var k = 0; k < outOfRangeValues.length; k++) {
                        if (equalValue === outOfRangeValues[k]) {
                            outOfRange.push(_this.getLegendData(layerIndex, dataIndex, data, dataPath, layerData, propertyPath, equalValue));
                        }
                    }
                });
                if (outOfRangeValues.length === 0) {
                    var range_1 = false;
                    var outRange = [];
                    Array.prototype.forEach.call(dataSource, function (data, dataIndex) {
                        range_1 = false;
                        var rangeValue = data[colorValuePath];
                        for (var z = 0; z < colorMapping.length; z++) {
                            if (!isNullOrUndefined(rangeValue) && !isNaN(rangeValue)) {
                                if (rangeValue >= colorMapping[z].from && rangeValue <= colorMapping[z].to) {
                                    range_1 = true;
                                }
                            }
                            else if (!range_1) {
                                range_1 = false;
                            }
                        }
                        if (!range_1) {
                            outOfRange.push(_this.getLegendData(layerIndex, dataIndex, data, dataPath, layerData, propertyPath, rangeValue));
                        }
                    });
                }
                legendText = !isNullOrUndefined(colorMap.label) ? colorMap.label : 'Others';
                var outfill = ((Object.prototype.toString.call(colorMap.color) === '[object Array]'))
                    ? colorMap.color[0] : colorMap.color;
                var legendOutFill = outfill;
                legendIndex++;
                this_2.getOverallLegendItemsCollection(legendText, legendOutFill, outOfRange, colorMap.showLegend);
            }
        };
        var this_2 = this;
        for (var _i = 0, colorMapping_2 = colorMapping; _i < colorMapping_2.length; _i++) {
            var colorMap = colorMapping_2[_i];
            _loop_2(colorMap);
        }
    };
    Legend.prototype.getDataLegendCollection = function (layerIndex, layerData, colorMapping, dataSource, dataPath, colorValuePath, propertyPath) {
        var _this = this;
        var legendText;
        var fill = this.maps.legendSettings.fill;
        var valuePath = this.maps.legendSettings.valuePath;
        if (!isNullOrUndefined(colorValuePath) && !isNullOrUndefined(dataSource)) {
            Array.prototype.forEach.call(dataSource, function (data, dataIndex) {
                var showLegend = isNullOrUndefined(_this.maps.legendSettings.showLegendPath) ?
                    true : isNullOrUndefined(data[_this.maps.legendSettings.showLegendPath]) ?
                    false : data[_this.maps.legendSettings.showLegendPath];
                var dataValue = ((colorValuePath.indexOf(".") > -1) ? (getValueFromObject(data, colorValuePath)) :
                    (data[colorValuePath]));
                var newData = [];
                var legendFill = (isNullOrUndefined(fill)) ? dataValue : fill;
                if (!isNullOrUndefined(dataValue) && colorMapping.length === 0) {
                    legendText = !isNullOrUndefined(data[valuePath]) ? ((valuePath.indexOf(".") > -1) ?
                        getValueFromObject(data, valuePath) : data[valuePath]) : ((dataPath.indexOf(".") > -1) ?
                        getValueFromObject(data, dataPath) : data[dataPath]);
                    newData.push(_this.getLegendData(layerIndex, dataIndex, data, dataPath, layerData, propertyPath, dataValue));
                }
                _this.getOverallLegendItemsCollection(legendText, legendFill, newData, showLegend);
            });
        }
    };
    Legend.prototype.interactiveHandler = function (e) {
        var target = e.target;
        var legend = this.maps.legendSettings;
        var id = this.maps.element.id + '_Interactive_Legend';
        var hoverId = legend.type === 'Layers' ? '_shapeIndex_' : (legend.type === 'Markers') ? '_MarkerIndex_' :
            '_BubbleIndex_';
        if (target.id.indexOf(hoverId) > 1) {
            var layerIndex = parseFloat(target.id.split('_LayerIndex_')[1].split('_')[0]);
            var dataIndex = parseFloat(target.id.split(/_dataIndex_/i)[1].split('_')[0]);
            var fill = void 0;
            var stroke = void 0;
            var strokeWidth = void 0;
            if (!(isNullOrUndefined(querySelector(id, this.maps.element.id)))) {
                remove(querySelector(id, this.maps.element.id));
            }
            var layer = this.maps.layersCollection[layerIndex];
            var markerVisible = (legend.type === 'Layers' ? layer.visible :
                legend.type === 'Markers' ? layer.markerSettings[parseFloat(target.id.split('_MarkerIndex_')[1].split('_')[0])].visible :
                    (this.maps.getBubbleVisible(this.maps.layersCollection[layerIndex])));
            if (legend.visible && this.legendRenderingCollections.length > 0
                && legend.mode === 'Interactive' && markerVisible) {
                var svgRect = this.maps.svgObject.getBoundingClientRect();
                for (var i = 0; i < this.legendCollection.length; i++) {
                    var currentData = this.legendCollection[i];
                    var legendElement = querySelector(this.maps.element.id + '_Legend_Index_' + i, this.maps.element.id);
                    var legendRect = legendElement.getBoundingClientRect();
                    var rect = new Rect(Math.abs(legendRect.left - svgRect.left), Math.abs(legendRect.top - svgRect.top), legendRect.width, legendRect.height);
                    fill = legendElement.getAttribute('fill');
                    stroke = legend.shapeBorder.color;
                    strokeWidth = legend.shapeBorder.width;
                    if (!isNullOrUndefined(currentData['data'])) {
                        var data = currentData['data'];
                        for (var j = 0; j < data.length; j++) {
                            if (dataIndex === data[j]['dataIndex'] && layerIndex === data[j]['layerIndex']) {
                                this.renderInteractivePointer(legend, fill, stroke, id, strokeWidth, rect);
                                break;
                            }
                        }
                    }
                }
            }
        }
        else {
            if (!(isNullOrUndefined(querySelector(id, this.maps.element.id)))) {
                remove(querySelector(id, this.maps.element.id));
            }
        }
    };
    Legend.prototype.renderInteractivePointer = function (legend, fill, stroke, id, strokeWidth, rect) {
        var path;
        var pathOptions;
        var locX;
        var locY;
        var height = 10;
        var width = 10;
        var direction = (legend.orientation === 'None') ? (legend.position === 'Top' || legend.position === 'Bottom')
            ? 'Horizontal' : 'Vertical' : legend.orientation;
        if (direction === 'Horizontal') {
            if (!legend.invertedPointer) {
                locX = rect.x + (rect.width / 2);
                locY = rect.y;
                path = ' M ' + locX + ' ' + locY + ' L ' + (locX - width) + ' ' + (locY - height) +
                    ' L ' + (locX + width) + ' ' + (locY - height) + ' Z ';
            }
            else {
                locX = rect.x + (rect.width / 2);
                locY = rect.y + (rect.height);
                path = ' M ' + locX + ' ' + locY + ' L ' + (locX - width) + ' ' + (locY + height) +
                    ' L ' + (locX + width) + ' ' + (locY + height) + ' Z ';
            }
        }
        else {
            if (!legend.invertedPointer) {
                locX = rect.x + (rect.width);
                locY = rect.y + (rect.height / 2);
                path = ' M ' + locX + ' ' + locY + ' L ' + (locX + width) + ' ' + (locY - height) +
                    ' L ' + (locX + width) + ' ' + (locY + height) + ' z ';
            }
            else {
                locX = rect.x;
                locY = rect.y + (rect.height / 2);
                path = ' M ' + locX + ' ' + locY + ' L ' + (locX - width) + ' ' + (locY - height) +
                    ' L ' + (locX - width) + ' ' + (locY + height) + ' z ';
            }
        }
        pathOptions = new PathOption(id, fill, strokeWidth, stroke, 1, '', path);
        this.maps.svgObject.appendChild(this.maps.renderer.drawPath(pathOptions));
    };
    Legend.prototype.wireEvents = function (element) {
        EventHandler.add(element, Browser.touchStartEvent, this.changeNextPage, this);
    };
    Legend.prototype.addEventListener = function () {
        if (this.maps.isDestroyed) {
            return;
        }
        this.maps.on(Browser.touchMoveEvent, this.interactiveHandler, this);
        this.maps.on(Browser.touchEndEvent, this.interactiveHandler, this);
        this.maps.on(click, this.legendClick, this);
    };
    Legend.prototype.legendClick = function (targetEle) {
        var legendShapeId;
        var legendTextId;
        var legendTextColor;
        var legendToggleFill = this.maps.legendSettings.toggleLegendSettings.fill;
        var legendToggleOpacity = this.maps.legendSettings.toggleLegendSettings.opacity;
        var legendToggleBorderColor = this.maps.legendSettings.toggleLegendSettings.border.color;
        var legendToggleBorderWidth = this.maps.legendSettings.toggleLegendSettings.border.width;
        if (targetEle.parentNode['id'].indexOf(this.maps.element.id + '_Legend_Index_') > -1) {
            var mapElement = void 0;
            var legendIndex = parseFloat(targetEle.parentElement.id.substr((this.maps.element.id + '_Legend_Index_').length));
            var selectedItem = this.legendCollection[legendIndex]['data'];
            var isVisible = selectedItem['_isVisible'];
            var shape = void 0;
            if (this.maps.legendSettings.toggleLegendSettings.enable && this.maps.legendSettings.type === "Bubbles") {
                for (var k = 0; k < this.maps.layers.length; k++) {
                    for (var j = 0; j < this.maps.layers[k].bubbleSettings.length; j++) {
                        for (var i = 0; i < selectedItem.length; i++) {
                            shape = this.legendCollection[legendIndex]['data'][i];
                            mapElement = querySelector(this.maps.element.id + '_LayerIndex_' + shape['layerIndex'] +
                                '_BubbleIndex_' + j + '_dataIndex_' + shape['dataIndex'], this.maps.element.id);
                            if (isVisible && mapElement !== null) {
                                if (this.maps.legendSettings.toggleLegendSettings.applyShapeSettings) {
                                    mapElement.setAttribute('fill', this.maps.layers[k].shapeSettings.fill);
                                    mapElement.setAttribute('stroke', this.maps.layers[k].shapeSettings.border.color);
                                    mapElement.setAttribute('opacity', (this.maps.layers[k].shapeSettings.opacity).toString());
                                    mapElement.setAttribute('stroke-width', (this.maps.layers[k].shapeSettings.border.width).toString());
                                }
                                else {
                                    mapElement.setAttribute("fill", legendToggleFill);
                                    mapElement.setAttribute("opacity", (legendToggleOpacity).toString());
                                    mapElement.setAttribute('stroke', legendToggleBorderColor);
                                    mapElement.setAttribute('stroke-width', (legendToggleBorderWidth).toString());
                                }
                                if (targetEle !== null) {
                                    legendShapeId = querySelector(this.maps.element.id + '_Legend_Shape_Index_' + legendIndex, this.maps.element.id);
                                    legendShapeId.setAttribute("fill", "#E5E5E5");
                                    legendTextId = querySelector(this.maps.element.id + '_Legend_Text_Index_' + legendIndex, this.maps.element.id);
                                    legendTextId.setAttribute("fill", "#E5E5E5");
                                }
                            }
                            else {
                                mapElement.setAttribute('fill', this.legendCollection[legendIndex]['fill']);
                                mapElement.setAttribute('stroke', this.maps.layers[k].bubbleSettings[j].border.color);
                                mapElement.setAttribute('opacity', (this.maps.layers[k].bubbleSettings[j].opacity).toString());
                                mapElement.setAttribute('stroke-width', (this.maps.layers[k].bubbleSettings[j].border.width).toString());
                                if (targetEle !== null) {
                                    legendShapeId = querySelector(this.maps.element.id + '_Legend_Shape_Index_' + legendIndex, this.maps.element.id);
                                    legendShapeId.setAttribute("fill", this.legendCollection[legendIndex]['fill']);
                                    legendTextId = querySelector(this.maps.element.id + '_Legend_Text_Index_' + legendIndex, this.maps.element.id);
                                    legendTextId.setAttribute("fill", "#757575");
                                }
                            }
                        }
                        selectedItem['_isVisible'] = isVisible ? false : true;
                    }
                }
            }
            if (this.maps.legendSettings.type === "Layers" && this.maps.legendSettings.toggleLegendSettings.enable) {
                var layerElement = void 0;
                this.removeCollections(targetEle, legendIndex);
                var toggledLegendIdIndex = this.maps.toggledLegendId.indexOf(legendIndex);
                if (toggledLegendIdIndex !== -1) {
                    isVisible = false;
                }
                ;
                for (var j = 0; j < this.maps.layers.length; j++) {
                    for (var i = 0; i < selectedItem.length; i++) {
                        shape = this.legendCollection[legendIndex]['data'][i];
                        layerElement = querySelector(this.maps.element.id + '_LayerIndex_' + shape['layerIndex'] +
                            '_shapeIndex_' + shape['shapeIndex'] + '_dataIndex_' + shape['dataIndex'], this.maps.element.id);
                        if (layerElement !== null) {
                            var toggledShapeIdIndex = this.maps.toggledShapeElementId.indexOf(layerElement.id);
                            if (isVisible) {
                                if (i === 0) {
                                    this.maps.toggledLegendId.push(legendIndex);
                                }
                                if (toggledShapeIdIndex === -1) {
                                    this.maps.toggledShapeElementId.push(layerElement.id);
                                }
                                if (this.maps.legendSettings.toggleLegendSettings.applyShapeSettings) {
                                    layerElement.setAttribute('fill', this.maps.layers[j].shapeSettings.fill);
                                    layerElement.setAttribute('opacity', (this.maps.layers[j].shapeSettings.opacity).toString());
                                    layerElement.setAttribute('stroke', this.maps.layers[j].shapeSettings.border.color);
                                    layerElement.setAttribute('stroke-width', (this.maps.layers[j].shapeSettings.border.width).toString());
                                }
                                else {
                                    layerElement.setAttribute("fill", legendToggleFill);
                                    layerElement.setAttribute("opacity", (legendToggleOpacity).toString());
                                    layerElement.setAttribute('stroke', legendToggleBorderColor);
                                    layerElement.setAttribute('stroke-width', (legendToggleBorderWidth).toString());
                                }
                                if (targetEle !== null) {
                                    legendTextId = querySelector(this.maps.element.id + '_Legend_Text_Index_' + legendIndex, this.maps.element.id);
                                    legendTextId.setAttribute("fill", "#E5E5E5");
                                    legendShapeId = querySelector(this.maps.element.id + '_Legend_Shape_Index_' + legendIndex, this.maps.element.id);
                                    legendShapeId.setAttribute("fill", "#E5E5E5");
                                }
                            }
                            else {
                                if (toggledLegendIdIndex !== -1 && i === 0) {
                                    this.maps.toggledLegendId.splice(toggledLegendIdIndex, 1);
                                }
                                if (toggledShapeIdIndex !== -1) {
                                    this.maps.toggledShapeElementId.splice(toggledShapeIdIndex, 1);
                                }
                                layerElement.setAttribute('fill', this.legendCollection[legendIndex]['fill']);
                                layerElement.setAttribute('opacity', (this.maps.layers[j].shapeSettings.opacity).toString());
                                layerElement.setAttribute('stroke', this.maps.layers[j].shapeSettings.border.color);
                                layerElement.setAttribute('stroke-width', (this.maps.layers[j].shapeSettings.border.width).toString());
                                if (targetEle !== null) {
                                    legendTextId = querySelector(this.maps.element.id + '_Legend_Text_Index_' + legendIndex, this.maps.element.id);
                                    legendTextId.setAttribute("fill", "#757575");
                                    legendShapeId = querySelector(this.maps.element.id + '_Legend_Shape_Index_' + legendIndex, this.maps.element.id);
                                    legendShapeId.setAttribute("fill", this.legendCollection[legendIndex]['fill']);
                                }
                            }
                        }
                    }
                }
                selectedItem['_isVisible'] = isVisible ? false : true;
            }
        }
        else if (!isNullOrUndefined(targetEle.id) && (targetEle.id.indexOf(this.maps.element.id + '_Legend_Shape_Index') > -1 ||
            targetEle.id.indexOf(this.maps.element.id + '_Legend_Index') !== -1) && this.maps.legendSettings.visible &&
            targetEle.id.indexOf('_Text') === -1) {
            var LegendInteractive = void 0;
            var legendIndex = parseFloat(targetEle.id.substr((this.maps.element.id + '_Legend_Index_').length));
            var mapdata = void 0;
            var selectedItem = this.legendCollection[legendIndex]['data'];
            var isVisible = selectedItem['_isVisible'];
            if (this.maps.legendSettings.type === "Bubbles" && this.maps.legendSettings.toggleLegendSettings.enable) {
                for (var k = 0; k < this.maps.layers.length; k++) {
                    for (var j = 0; j < this.maps.layers[k].bubbleSettings.length; j++) {
                        for (var i = 0; i < selectedItem.length; i++) {
                            mapdata = this.legendCollection[legendIndex]['data'][i];
                            LegendInteractive = querySelector(this.maps.element.id + '_LayerIndex_' + mapdata['layerIndex'] +
                                '_BubbleIndex_' + j + '_dataIndex_' + mapdata['dataIndex'], this.maps.element.id);
                            if (isVisible && LegendInteractive !== null) {
                                if (this.maps.legendSettings.toggleLegendSettings.applyShapeSettings) {
                                    LegendInteractive.setAttribute('fill', this.maps.layers[k].shapeSettings.fill);
                                    LegendInteractive.setAttribute('stroke', this.maps.layers[k].shapeSettings.border.color);
                                    LegendInteractive.setAttribute('stroke-width', (this.maps.layers[k].shapeSettings.border.width).toString());
                                    LegendInteractive.setAttribute('opacity', (this.maps.layers[k].shapeSettings.opacity).toString());
                                }
                                else {
                                    LegendInteractive.setAttribute("fill", legendToggleFill);
                                    LegendInteractive.setAttribute("opacity", (legendToggleOpacity).toString());
                                    LegendInteractive.setAttribute('stroke', legendToggleBorderColor);
                                    LegendInteractive.setAttribute('stroke-width', (legendToggleBorderWidth).toString());
                                }
                                if (targetEle !== null) {
                                    legendTextId = querySelector(this.maps.element.id + '_Legend_Index_' + legendIndex + '_Text', this.maps.element.id);
                                    legendTextId.setAttribute("fill", "#E5E5E5");
                                    legendShapeId = querySelector(this.maps.element.id + '_Legend_Index_' + legendIndex, this.maps.element.id);
                                    legendShapeId.setAttribute("fill", "#E5E5E5");
                                }
                            }
                            else {
                                LegendInteractive.setAttribute('fill', this.legendCollection[legendIndex]['fill']);
                                LegendInteractive.setAttribute('stroke', this.maps.layers[k].bubbleSettings[j].border.color);
                                LegendInteractive.setAttribute('stroke-width', (this.maps.layers[k].bubbleSettings[j].border.width).toString());
                                LegendInteractive.setAttribute('opacity', (this.maps.layers[k].bubbleSettings[j].opacity).toString());
                                if (targetEle !== null) {
                                    legendShapeId = querySelector(this.maps.element.id + '_Legend_Index_' + legendIndex, this.maps.element.id);
                                    legendShapeId.setAttribute("fill", this.legendCollection[legendIndex]['fill']);
                                    legendTextId = querySelector(this.maps.element.id + '_Legend_Index_' + legendIndex + '_Text', this.maps.element.id);
                                    legendTextId.setAttribute("fill", "#757575");
                                }
                            }
                        }
                        selectedItem['_isVisible'] = isVisible ? false : true;
                    }
                }
            }
            if (this.maps.legendSettings.type === "Layers" && this.maps.legendSettings.toggleLegendSettings.enable) {
                var mapLegendElement = void 0;
                this.removeCollections(targetEle, legendIndex);
                var toggleLegendIdIndex = this.maps.toggledLegendId.indexOf(legendIndex);
                if (toggleLegendIdIndex !== -1) {
                    isVisible = false;
                }
                ;
                for (var k = 0; k < this.maps.layers.length; k++) {
                    for (var i = 0; i < selectedItem.length; i++) {
                        mapdata = this.legendCollection[legendIndex]['data'][i];
                        mapLegendElement = querySelector(this.maps.element.id + '_LayerIndex_' + mapdata['layerIndex'] +
                            '_shapeIndex_' + mapdata['shapeIndex'] + '_dataIndex_' + mapdata['dataIndex'], this.maps.element.id);
                        if (mapLegendElement !== null) {
                            var toggledShapeIdIndex = this.maps.toggledShapeElementId.indexOf(mapLegendElement.id);
                            if (isVisible) {
                                if (i === 0) {
                                    this.maps.toggledLegendId.push(legendIndex);
                                }
                                if (toggledShapeIdIndex === -1) {
                                    this.maps.toggledShapeElementId.push(mapLegendElement.id);
                                }
                                if (this.maps.legendSettings.toggleLegendSettings.applyShapeSettings) {
                                    mapLegendElement.setAttribute('fill', this.maps.layers[0].shapeSettings.fill);
                                    mapLegendElement.setAttribute('stroke', this.maps.layers[0].shapeSettings.border.color);
                                    mapLegendElement.setAttribute('opacity', (this.maps.layers[k].shapeSettings.opacity).toString());
                                    mapLegendElement.setAttribute('stroke-width', (this.maps.layers[k].shapeSettings.border.width).toString());
                                }
                                else {
                                    mapLegendElement.setAttribute("fill", legendToggleFill);
                                    mapLegendElement.setAttribute("opacity", (legendToggleOpacity).toString());
                                    mapLegendElement.setAttribute('stroke', legendToggleBorderColor);
                                    mapLegendElement.setAttribute('stroke-width', (legendToggleBorderWidth).toString());
                                }
                                if (targetEle !== null) {
                                    legendShapeId = querySelector(this.maps.element.id + '_Legend_Index_' + legendIndex, this.maps.element.id);
                                    legendShapeId.setAttribute("fill", "#E5E5E5");
                                    legendTextId = querySelector(this.maps.element.id + '_Legend_Index_' + legendIndex + '_Text', this.maps.element.id);
                                    legendTextId.setAttribute("fill", "#E5E5E5");
                                }
                            }
                            else {
                                if (toggleLegendIdIndex !== -1 && i === 0) {
                                    this.maps.toggledLegendId.splice(toggleLegendIdIndex, 1);
                                }
                                if (toggledShapeIdIndex !== -1) {
                                    this.maps.toggledShapeElementId.splice(toggledShapeIdIndex, 1);
                                }
                                mapLegendElement.setAttribute('fill', this.legendCollection[legendIndex]['fill']);
                                mapLegendElement.setAttribute('stroke', this.maps.layers[0].shapeSettings.border.color);
                                mapLegendElement.setAttribute('opacity', (this.maps.layers[k].shapeSettings.opacity).toString());
                                mapLegendElement.setAttribute('stroke-width', (this.maps.layers[k].shapeSettings.border.width).toString());
                                if (targetEle !== null) {
                                    legendTextId = querySelector(this.maps.element.id + '_Legend_Index_' + legendIndex + '_Text', this.maps.element.id);
                                    legendTextId.setAttribute("fill", "#757575");
                                    legendShapeId = querySelector(this.maps.element.id + '_Legend_Index_' + legendIndex, this.maps.element.id);
                                    legendShapeId.setAttribute("fill", this.legendCollection[legendIndex]['fill']);
                                }
                            }
                        }
                    }
                }
                selectedItem['_isVisible'] = isVisible ? false : true;
            }
        }
    };
    Legend.prototype.removeCollections = function (targetEle, legendIndex) {
        this.removeLegendSelectionCollection(targetEle);
        var legendSelectionIndex = this.getIndexofLegend(this.maps.legendSelectionCollection, targetEle);
        if (legendSelectionIndex !== -1) {
            this.maps.legendSelectionCollection.splice(legendSelectionIndex, 1);
        }
        var legendHighlightIndex = this.getIndexofLegend(this.legendHighlightCollection, targetEle);
        if (legendHighlightIndex !== -1) {
            this.legendHighlightCollection.splice(legendSelectionIndex, 1);
        }
        var shapeHighlightIndex = this.getIndexofLegend(this.shapeHighlightCollection, targetEle);
        if (shapeHighlightIndex !== -1) {
            this.shapeHighlightCollection.splice(shapeHighlightIndex, 1);
        }
        var selectedIndex = this.maps.selectedLegendElementId.indexOf(legendIndex);
        if (selectedIndex !== -1) {
            this.maps.selectedLegendElementId.splice(selectedIndex, 1);
        }
    };
    Legend.prototype.removeEventListener = function () {
        if (this.maps.isDestroyed) {
            return;
        }
        this.maps.off(Browser.touchMoveEvent, this.interactiveHandler);
        this.maps.off(Browser.touchEndEvent, this.interactiveHandler);
        this.maps.off(click, this.legendClick);
    };
    Legend.prototype.getLegendData = function (layerIndex, dataIndex, data, dataPath, layerData, shapePropertyPath, value) {
        var legendData = [];
        if (Object.prototype.toString.call(layerData) === '[object Array]') {
            for (var i = 0; i < layerData.length; i++) {
                var shapeData = layerData[i];
                var dataPathValue = (dataPath.indexOf(".") > -1) ? getValueFromObject(data, dataPath) : data[dataPath];
                var shapePath = checkPropertyPath(data[dataPath], shapePropertyPath, shapeData['properties']);
                var dataPathValueCase = !isNullOrUndefined(dataPathValue)
                    ? dataPathValue.toLowerCase() : dataPathValue;
                var shapeDataValueCase = !isNullOrUndefined(shapeData['properties'][shapePath])
                    && isNaN(shapeData['properties'][shapePath]) ? shapeData['properties'][shapePath].toLowerCase() : shapeData['properties'][shapePath];
                if (shapeDataValueCase === dataPathValueCase) {
                    legendData.push({
                        layerIndex: layerIndex, shapeIndex: i, dataIndex: dataIndex,
                        name: data[dataPath], value: value
                    });
                }
            }
        }
        return legendData;
    };
    Legend.prototype.legendGradientColor = function (colorMap, legendIndex) {
        var legendFillColor;
        var xmlns = 'http://www.w3.org/2000/svg';
        if (!isNullOrUndefined(colorMap.color) && typeof (colorMap.color) === 'object') {
            var linerGradientEle = document.createElementNS(xmlns, 'linearGradient');
            var opacity = 1;
            var position = this.maps.legendSettings.position;
            var x2 = void 0;
            var y2 = void 0;
            x2 = position === 'Top' || position === 'Bottom' ? '100' : '0';
            y2 = position === 'Top' || position === 'Bottom' ? '0' : '100';
            linerGradientEle.setAttribute('id', 'linear_' + legendIndex + '_' + this.maps.element.id);
            linerGradientEle.setAttribute('x1', 0 + '%');
            linerGradientEle.setAttribute('y1', 0 + '%');
            linerGradientEle.setAttribute('x2', x2 + '%');
            linerGradientEle.setAttribute('y2', y2 + '%');
            for (var b = 0; b < colorMap.color.length; b++) {
                var offsetColor = 100 / (colorMap.color.length - 1);
                var stopEle = document.createElementNS(xmlns, 'stop');
                stopEle.setAttribute('offset', b * offsetColor + '%');
                stopEle.setAttribute('stop-color', colorMap.color[b]);
                stopEle.setAttribute('stop-opacity', opacity.toString());
                linerGradientEle.appendChild(stopEle);
            }
            this.legendLinearGradient = linerGradientEle;
            var color = 'url(' + '#linear_' + legendIndex + '_' + this.maps.element.id + ')';
            this.defsElement.appendChild(linerGradientEle);
            legendFillColor = color;
        }
        return legendFillColor;
    };
    /**
     * Get module name.
     */
    Legend.prototype.getModuleName = function () {
        return 'Legend';
    };
    /**
     * To destroy the legend.
     * @return {void}
     * @private
     */
    Legend.prototype.destroy = function (maps) {
        /**
         * Destroy method performed here
         */
        this.removeEventListener();
    };
    return Legend;
}());
export { Legend };

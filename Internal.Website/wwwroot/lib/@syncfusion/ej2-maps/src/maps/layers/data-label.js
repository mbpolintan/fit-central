var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
import { findMidPointOfPolygon, Rect, filter, getTemplateFunction, getZoomTranslate, getTranslate, RectOption, convertElementFromLabel, Point, TextOption, renderTextElement, textTrim, measureText, Internalize } from '../utils/helper';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { dataLabelRendering } from '../model/constants';
/**
 * DataLabel Module used to render the maps datalabel
 */
var DataLabel = /** @class */ (function () {
    function DataLabel(maps) {
        this.value = { rightWidth: 0, leftWidth: 0, heightTop: 0, heightBottom: 0 };
        this.maps = maps;
        this.dataLabelCollections = [];
    }
    //tslint:disable:max-func-body-length
    DataLabel.prototype.getDataLabel = function (dataSource, labelPath, shapeName, shapeDataPath) {
        var text;
        var shapeNameValue;
        for (var i = 0; i < dataSource.length; i++) {
            var data = dataSource[i];
            var dataShapePathValue = void 0;
            dataShapePathValue = !isNullOrUndefined(data[shapeDataPath]) && isNaN(data[shapeDataPath]) ?
                data[shapeDataPath].toLowerCase() : data[shapeDataPath];
            shapeName = !isNullOrUndefined(shapeName) ? shapeName.toString() : shapeName;
            shapeNameValue = !isNullOrUndefined(shapeName) ? shapeName.toLowerCase() : shapeName;
            if ((dataShapePathValue) === shapeNameValue) {
                text = data;
                break;
            }
        }
        return text;
    };
    /**
     * To render label for maps
     * @param layer
     * @param layerIndex
     * @param shape
     * @param layerData
     * @param group
     * @param labelTemplateElement
     * @param index
     */
    DataLabel.prototype.renderLabel = function (layer, layerIndex, shape, layerData, group, labelTemplateElement, index, intersect) {
        var _this = this;
        var dataLabel = layer.dataLabelSettings;
        var style = layer.dataLabelSettings.textStyle;
        var markerEle;
        var templateFn;
        var options;
        var dataLabelSettings = layer.dataLabelSettings;
        var labelpath = layer.dataLabelSettings.labelPath;
        var shapePoint = [[]];
        var midIndex = 0;
        var pointsLength = 0;
        var shapeData = shape;
        var element;
        var data;
        var text = '';
        var datasrcObj;
        var currentLength = 0;
        var oldIndex;
        var location;
        var sublayerIndexLabel = false;
        var shapeProperties = shape['properties'];
        var labelId = this.maps.element.id + '_LayerIndex_' + layerIndex + '_shapeIndex_' + index + '_LabelIndex_' + index;
        var textLocation = new Point(0, 0);
        /* tslint:disable:no-string-literal */
        var shapes = layerData[index];
        var locationX;
        var locationY;
        style.fontFamily = this.maps.theme.toLowerCase() !== 'material' ? this.maps.themeStyle.labelFontFamily : style.fontFamily;
        shape = shapes['property'];
        var properties = (Object.prototype.toString.call(layer.shapePropertyPath) === '[object Array]' ?
            layer.shapePropertyPath : [layer.shapePropertyPath]);
        var propertyPath;
        var isPoint = false;
        var animate = layer.animationDuration !== 0 || isNullOrUndefined(this.maps.zoomModule);
        var translate = (this.maps.isTileMap) ? new Object() : ((this.maps.zoomSettings.zoomFactor > 1 &&
            !isNullOrUndefined(this.maps.zoomModule)) ? getZoomTranslate(this.maps, layer, animate) :
            getTranslate(this.maps, layer, animate));
        var scale = (this.maps.isTileMap) ? this.maps.scale : translate['scale'];
        var transPoint = (this.maps.isTileMap) ? this.maps.translatePoint : translate['location'];
        var zoomTransPoint = this.maps.zoomTranslatePoint;
        var shapeWidth;
        var scaleZoomValue = !isNullOrUndefined(this.maps.scale) ? Math.floor(this.maps.scale) : 1;
        var zoomLabelsPosition = this.maps.zoomSettings.enable ? !isNullOrUndefined(this.maps.zoomShapeCollection) &&
            this.maps.zoomShapeCollection.length > 0 : this.maps.zoomSettings.enable;
        this.maps.translateType = 'labels';
        for (var j = 0; j < properties.length; j++) {
            if (shapeProperties[properties[j]]) {
                propertyPath = properties[j];
                datasrcObj = this.getDataLabel(layer.dataSource, layer.shapeDataPath, shapeData['properties'][propertyPath], layer.shapeDataPath);
                if (datasrcObj) {
                    break;
                }
            }
        }
        datasrcObj = this.getDataLabel(layer.dataSource, layer.shapeDataPath, shapeData['properties'][propertyPath], layer.shapeDataPath);
        if (!isNullOrUndefined(shapes['property'])) {
            shapePoint = [[]];
            if (!layerData[index]['_isMultiPolygon'] && layerData[index]['type'] !== 'Point') {
                shapePoint.push(this.getPoint(layerData[index], []));
                currentLength = shapePoint[shapePoint.length - 1].length;
                if (pointsLength < currentLength) {
                    pointsLength = currentLength;
                    midIndex = shapePoint.length - 1;
                }
            }
            else {
                var layer_1 = layerData[index];
                if (layer_1['type'] === 'Point') {
                    isPoint = true;
                    var layerPoints = [];
                    layerPoints.push(this.getPoint(layerData, []));
                    shapePoint = layerPoints;
                    currentLength = shapePoint[shapePoint.length - 1].length;
                    if (pointsLength < currentLength) {
                        pointsLength = currentLength;
                        midIndex = shapePoint.length - 1;
                    }
                }
                for (var j = 0; j < layer_1.length; j++) {
                    shapePoint.push(this.getPoint(layer_1[j], []));
                    currentLength = shapePoint[shapePoint.length - 1].length;
                    if (pointsLength < currentLength) {
                        pointsLength = currentLength;
                        midIndex = shapePoint.length - 1;
                    }
                }
            }
        }
        text = (!isNullOrUndefined(datasrcObj)) ? !isNullOrUndefined(datasrcObj[labelpath]) ?
            datasrcObj[layer.shapeDataPath].toString() : datasrcObj[layer.shapeDataPath] : shapeData['properties'][labelpath];
        if ((Object.prototype.toString.call(layer.shapePropertyPath) === '[object Array]') &&
            (isNullOrUndefined(text) && layer.dataSource['length'] === 0)) {
            for (var l = 0; l < layer.shapePropertyPath.length; l++) {
                if (shapeData['properties'][layer.shapePropertyPath[l]]) {
                    text = shapeData['properties'][layer.shapePropertyPath[l]];
                    break;
                }
            }
        }
        if (isNullOrUndefined(text) && (layer.dataLabelSettings.template !== "" && layer.dataSource['length'] === 0)) {
            text = shapeData['properties'][layer.shapePropertyPath];
        }
        var dataLabelText = text;
        var projectionType = this.maps.projectionType;
        if (isPoint) {
            location = {
                x: shapePoint[midIndex][index]['x'], y: shapePoint[midIndex][index]['y'],
                rightMin: 0, rightMax: 0, leftMin: 0, leftMax: 0,
                points: shapePoint[midIndex][index], topMax: 0, topMin: 0,
                bottomMax: 0, bottomMin: 0, height: 0
            };
        }
        else {
            location = findMidPointOfPolygon(shapePoint[midIndex], projectionType);
        }
        var firstLevelMapLocation = location;
        if (!isNullOrUndefined(text) && !isNullOrUndefined(location)) {
            if (zoomLabelsPosition && scaleZoomValue > 1 && !this.maps.zoomNotApplied && dataLabel.template === '') {
                if (layerIndex > 0) {
                    for (var k = 0; k < this.maps.zoomLabelPositions.length; k++) {
                        if (this.maps.zoomLabelPositions[k]['dataLabelText'] === text) {
                            oldIndex = index;
                            index = k;
                            sublayerIndexLabel = true;
                            break;
                        }
                    }
                }
                locationX = location['x'];
                locationY = location['y'];
                location['x'] = ((location['x'] + zoomTransPoint['x']) * scale);
                location['y'] = ((location['y'] + zoomTransPoint['y']) * scale);
            }
            location['y'] = (this.maps.projectionType === 'Mercator') ? location['y'] : (-location['y']);
            data = location;
            if (!isNullOrUndefined(this.maps.format) && !isNaN(parseFloat(text))) {
                if (this.maps.useGroupingSeparator) {
                    text = Internalize(this.maps, parseFloat(text));
                    if (!isNullOrUndefined(datasrcObj)) {
                        datasrcObj[labelpath] = text;
                    }
                }
            }
            var eventargs_1 = {
                name: dataLabelRendering, maps: this.maps, cancel: false, border: dataLabel.border, datalabel: dataLabel,
                fill: dataLabel.fill, template: dataLabel.template, text: text
            };
            if (this.maps.isBlazor) {
                var maps = eventargs_1.maps, datalabel = eventargs_1.datalabel, blazorEventArgs = __rest(eventargs_1, ["maps", "datalabel"]);
                eventargs_1 = blazorEventArgs;
            }
            this.maps.trigger('dataLabelRendering', eventargs_1, function (labelArgs) {
                if (eventargs_1.cancel) {
                    return;
                }
                var border = { color: 'yellow' };
                var position = [];
                var width = zoomLabelsPosition && scaleZoomValue > 1 && !_this.maps.zoomNotApplied
                    && _this.maps.zoomShapeCollection.length > index ? _this.maps.zoomShapeCollection[index]['width'] :
                    (location['rightMax']['x'] - location['leftMax']['x']) * scale;
                if (!isNullOrUndefined(_this.maps.dataLabelShape)) {
                    shapeWidth = firstLevelMapLocation['rightMax']['x'] - firstLevelMapLocation['leftMax']['x'];
                    _this.maps.dataLabelShape.push(shapeWidth);
                }
                if (eventargs_1.text !== text && !eventargs_1.cancel) {
                    text = eventargs_1.text;
                }
                var textSize = measureText(text, style);
                var trimmedLable = text;
                var elementSize = textSize;
                var startY = location['y'] - textSize['height'] / 4;
                var endY = location['y'] + textSize['height'] / 4;
                var start = ((location['y'] + transPoint['y']) * scale) - textSize['height'] / 4;
                var end = ((location['y'] + transPoint['y']) * scale) + textSize['height'] / 4;
                position = filter(shapePoint[midIndex], startY, endY);
                if (!isPoint && position.length > 5 && (shapeData['geometry']['type'] !== 'MultiPolygon') &&
                    (shapeData['type'] !== 'MultiPolygon')) {
                    var location1 = findMidPointOfPolygon(position, projectionType);
                    if (zoomLabelsPosition && scaleZoomValue > 1 && !_this.maps.zoomNotApplied && eventargs_1.template === '') {
                        location1['x'] = ((_this.maps.zoomLabelPositions[index]['location']['x'] + zoomTransPoint['x']) * scale);
                        location1['y'] = ((_this.maps.zoomLabelPositions[index]['location']['y'] + zoomTransPoint['y']) * scale);
                    }
                    locationX = location1['x'];
                    location['x'] = location1['x'];
                    width = zoomLabelsPosition && scaleZoomValue > 1 && !_this.maps.zoomNotApplied
                        && _this.maps.zoomShapeCollection.length > index ? _this.maps.zoomShapeCollection[index]['width'] :
                        (location1['rightMax']['x'] - location1['leftMax']['x']) * scale;
                }
                var xpositionEnds = ((location['x'] + transPoint['x']) * scale) + textSize['width'] / 2;
                var xpositionStart = ((location['x'] + transPoint['x']) * scale) - textSize['width'] / 2;
                _this.value[index] = { rightWidth: xpositionEnds, leftWidth: xpositionStart, heightTop: start, heightBottom: end };
                var labelElement;
                if (eventargs_1.template !== '') {
                    templateFn = getTemplateFunction(eventargs_1.template);
                    var templateElement = templateFn ? templateFn(!isNullOrUndefined(datasrcObj) ?
                        datasrcObj : shapeData['properties'], null, null, _this.maps.element.id + '_LabelTemplate', false) : document.createElement('div');
                    templateElement.innerHTML = !templateFn ? eventargs_1.template : '';
                    labelElement = convertElementFromLabel(templateElement, labelId, !isNullOrUndefined(datasrcObj) ? datasrcObj : shapeData['properties'], index, _this.maps);
                    labelElement.style.left = ((Math.abs(_this.maps.baseMapRectBounds['min']['x'] - location['x'])) * scale) + 'px';
                    labelElement.style.top = ((Math.abs(_this.maps.baseMapRectBounds['min']['y'] - location['y'])) * scale) + 'px';
                    labelTemplateElement.appendChild(labelElement);
                }
                else {
                    if (dataLabelSettings.smartLabelMode === 'Trim') {
                        trimmedLable = textTrim(width, text, style);
                        elementSize = measureText(trimmedLable, style);
                        options = new TextOption(labelId, textLocation.x, textLocation.y, 'middle', trimmedLable, '', '');
                    }
                    if (dataLabelSettings.smartLabelMode === 'None') {
                        options = new TextOption(labelId, (textLocation.x), textLocation.y, 'middle', text, '', '');
                    }
                    if (dataLabelSettings.smartLabelMode === 'Hide') {
                        text = (width >= textSize['width']) ? text : '';
                        options = new TextOption(labelId, (textLocation.x), (textLocation.y), 'middle', text, '', '');
                    }
                    text = options['text'];
                    if (dataLabelSettings.intersectionAction === 'Hide') {
                        for (var i = 0; i < intersect.length; i++) {
                            if (!isNullOrUndefined(intersect[i])) {
                                if (_this.value[index]['leftWidth'] > intersect[i]['rightWidth']
                                    || _this.value[index]['rightWidth'] < intersect[i]['leftWidth']
                                    || _this.value[index]['heightTop'] > intersect[i]['heightBottom']
                                    || _this.value[index]['heightBottom'] < intersect[i]['heightTop']) {
                                    text = text;
                                }
                                else {
                                    text = '';
                                    break;
                                }
                            }
                        }
                        intersect.push(_this.value[index]);
                        options = new TextOption(labelId, textLocation.x, textLocation.y, 'middle', text, '', '');
                    }
                    var difference = void 0;
                    if (dataLabelSettings.intersectionAction === 'Trim') {
                        for (var j = 0; j < intersect.length; j++) {
                            if (!isNullOrUndefined(intersect[j])) {
                                if (intersect[j]['rightWidth'] < _this.value[index]['leftWidth']
                                    || intersect[j]['leftWidth'] > _this.value[index]['rightWidth']
                                    || intersect[j]['heightBottom'] < _this.value[index]['heightTop']
                                    || intersect[j]['heightTop'] > _this.value[index]['heightBottom']) {
                                    trimmedLable = text;
                                    difference = 0;
                                }
                                else {
                                    if (_this.value[index]['leftWidth'] > intersect[j]['leftWidth']) {
                                        width = intersect[j]['rightWidth'] - _this.value[index]['leftWidth'];
                                        difference = width - (_this.value[index]['rightWidth'] - _this.value[index]['leftWidth']);
                                        trimmedLable = textTrim(difference, text, style);
                                        break;
                                    }
                                    if (_this.value[index]['leftWidth'] < intersect[j]['leftWidth']) {
                                        width = _this.value[index]['rightWidth'] - intersect[j]['leftWidth'];
                                        difference = Math.abs(width - (_this.value[index]['rightWidth'] - _this.value[index]['leftWidth']));
                                        trimmedLable = textTrim(difference, text, style);
                                        break;
                                    }
                                }
                            }
                        }
                        elementSize = measureText(trimmedLable, style);
                        intersect.push(_this.value[index]);
                        options = new TextOption(labelId, textLocation.x, (textLocation.y), 'middle', trimmedLable, '', '');
                    }
                    if (dataLabelSettings.intersectionAction === 'None') {
                        options = new TextOption(labelId, (textLocation.x), (textLocation.y), 'middle', text, '', '');
                    }
                    if (trimmedLable.length > 1) {
                        var border_1 = eventargs_1.border;
                        if (border_1['width'] > 1) {
                            var fill = eventargs_1.fill;
                            var opacity = dataLabelSettings.opacity;
                            var rx = dataLabelSettings.rx;
                            var ry = dataLabelSettings.ry;
                            var x = void 0;
                            var y = void 0;
                            var padding = 5;
                            if (zoomLabelsPosition && scaleZoomValue > 1 && !_this.maps.zoomNotApplied) {
                                x = ((location['x'])) - textSize['width'] / 2;
                                y = ((location['y'])) - textSize['height'] / 2 - padding;
                            }
                            else {
                                x = ((location['x'] + transPoint['x']) * scale) - textSize['width'] / 2;
                                y = ((location['y'] + transPoint['y']) * scale) - textSize['height'] / 2;
                            }
                            var rectOptions = new RectOption(_this.maps.element.id + '_LayerIndex_' + layerIndex + '_shapeIndex_' + index + '_rectIndex_' + index, fill, border_1, opacity, new Rect(x, y, textSize['width'], textSize['height']), rx, ry);
                            var rect = _this.maps.renderer.drawRectangle(rectOptions);
                            group.appendChild(rect);
                        }
                    }
                    element = renderTextElement(options, style, style.color || _this.maps.themeStyle.dataLabelFontColor, group);
                    if (zoomLabelsPosition && scaleZoomValue > 1 && !_this.maps.zoomNotApplied) {
                        element.setAttribute('transform', 'translate( ' + ((location['x'])) + ' '
                            + (((location['y']))) + ' )');
                        location['x'] = locationX;
                        location['y'] = locationY;
                    }
                    else {
                        element.setAttribute('transform', 'translate( ' + ((location['x'] + transPoint.x) * scale) + ' '
                            + (((location['y'] + transPoint.y) * scale) + (elementSize.height / 4)) + ' )');
                    }
                    group.appendChild(element);
                }
                _this.dataLabelCollections.push({
                    location: { x: location['x'], y: location['y'] },
                    element: isNullOrUndefined(labelElement) ? element : labelElement,
                    layerIndex: layerIndex,
                    shapeIndex: sublayerIndexLabel ? oldIndex : index,
                    labelIndex: sublayerIndexLabel ? oldIndex : index,
                    dataLabelText: dataLabelText
                });
                if (labelTemplateElement.childElementCount > 0 && !_this.maps.element.contains(labelTemplateElement)) {
                    document.getElementById(_this.maps.element.id + '_Secondary_Element').appendChild(labelTemplateElement);
                }
            });
        }
    };
    DataLabel.prototype.getPoint = function (shapes, points) {
        shapes.map(function (current, index) {
            points.push(new Point(current['point']['x'], current['point']['y']));
        });
        return points;
    };
    /**
     * Get module name.
     */
    DataLabel.prototype.getModuleName = function () {
        return 'DataLabel';
    };
    /**
     * To destroy the layers.
     * @return {void}
     * @private
     */
    DataLabel.prototype.destroy = function (maps) {
        /**
         * Destroy method performed here
         */
    };
    return DataLabel;
}());
export { DataLabel };

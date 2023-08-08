import { ZOrderPageTable, PdfAnnotationBase } from './pdf-annotation';
// tslint:disable-next-line:max-line-length
import { Rect, Point, identityMatrix, rotateMatrix, getDiagramElement, ThumbsConstraints, scaleMatrix, cornersPointsBeforeRotation, ImageElement } from '@syncfusion/ej2-drawings';
import { DrawingElement } from '@syncfusion/ej2-drawings';
import { PathElement } from '@syncfusion/ej2-drawings';
import { createMeasureElements } from '@syncfusion/ej2-drawings';
import { randomId } from '@syncfusion/ej2-drawings';
import { Size, transformPointByMatrix, RotateTransform, TextElement } from '@syncfusion/ej2-drawings';
import { Canvas, refreshDiagramElements, DrawingRenderer } from '@syncfusion/ej2-drawings';
import { Selector } from './selector';
import { SvgRenderer } from '@syncfusion/ej2-drawings';
import { isLineShapes, setElementStype, findPointsLength, getBaseShapeAttributes, isLeader, cloneObject } from './drawing-util';
// tslint:disable-next-line:max-line-length
import { getConnectorPoints, updateSegmentElement, getSegmentElement, updateDecoratorElement, getDecoratorElement, clipDecorators, initDistanceLabel, initLeaders, initLeader, getPolygonPath, initPerimeterLabel } from './connector-util';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
/**
 * Renderer module is used to render basic diagram elements
 * @hidden
 */
var Drawing = /** @class */ (function () {
    function Drawing(viewer) {
        this.isDynamicStamps = false;
        this.pdfViewer = viewer;
        this.renderer = new DrawingRenderer('this.pdfViewer.element.id', false);
        this.svgRenderer = new SvgRenderer();
    }
    /**
     * @private
     */
    Drawing.prototype.renderLabels = function (viewer) {
        var annotations = viewer.annotations;
        if (annotations) {
            for (var i = 0; i < annotations.length; i++) {
                var annotation = annotations[i];
                this.initObject(annotation);
            }
        }
    };
    Drawing.prototype.createNewZindexTable = function (pageId) {
        var zIndexTable = new ZOrderPageTable();
        this.pdfViewer.zIndex++;
        zIndexTable.pageId = this.pdfViewer.zIndex;
        this.pdfViewer.zIndexTable.push(zIndexTable);
        return zIndexTable;
    };
    /**
     * @private
     */
    Drawing.prototype.getPageTable = function (pageId) {
        var zIndexTable;
        if (this.pdfViewer.zIndexTable.length !== undefined) {
            var notFound = true;
            for (var i = 0; i < this.pdfViewer.zIndexTable.length; i++) {
                if (this.pdfViewer.zIndexTable[i].pageId === pageId) {
                    notFound = false;
                    zIndexTable = this.pdfViewer.zIndexTable[i];
                    break;
                }
            }
            if (notFound) {
                zIndexTable = this.createNewZindexTable(pageId);
                zIndexTable.pageId = pageId;
            }
        }
        else {
            zIndexTable = this.createNewZindexTable(pageId);
        }
        return zIndexTable;
    };
    /**
     * @private
     */
    Drawing.prototype.setZIndex = function (index, obj) {
        if (obj.pageIndex !== undefined) {
            var pageTable = this.getPageTable(obj.pageIndex);
            if (obj.zIndex === -1) {
                pageTable.zIndex++;
                obj.zIndex = pageTable.zIndex;
                pageTable.objects.push(obj);
            }
            else {
                var index_1 = obj.zIndex;
                var tabelLength = pageTable.objects.length;
                obj.zIndex = tabelLength++;
                pageTable.objects.push(obj);
            }
        }
    };
    /**
     * @private
     */
    Drawing.prototype.initObject = function (obj) {
        //Move the common properties like zindex and id to an abstract class
        this.setZIndex(this.pdfViewer.zIndex, obj);
        createMeasureElements();
        if (!isLineShapes(obj)) {
            this.initNode(obj);
        }
        else {
            this.initLine(obj);
            obj.wrapper.measure(new Size(undefined, undefined));
            obj.wrapper.arrange(obj.wrapper.desiredSize);
        }
        if (obj.wrapper === null) {
            //Init default wrapper
        }
        // tslint:disable-next-line:no-any
        this.pdfViewer.nameTable[obj.id] = obj;
        //Add some methodologies to add the children of group to name table
        return obj;
    };
    Drawing.prototype.initNode = function (obj) {
        var canvas = this.initContainer(obj);
        var content;
        if (!canvas.children) {
            canvas.children = [];
        }
        if (!content) {
            content = this.init(obj, canvas);
        }
        //canvas.children.push(content);
        canvas.rotateAngle = obj.rotateAngle;
        canvas.measure(new Size(obj.wrapper.width, obj.wrapper.height));
        canvas.arrange(canvas.desiredSize);
        if (this.isDynamicStamps) {
            this.pdfViewer.annotation.stampAnnotationModule.updateSessionStorage(obj, null, 'dynamicStamp');
            this.isDynamicStamps = false;
        }
    };
    /**
     * Allows to initialize the UI of a node
     */
    /**
     * @private
     */
    /* tslint:disable */
    Drawing.prototype.init = function (obj, canvas) {
        var content;
        content = new DrawingElement();
        var textStyle;
        // let changedProperties: string = 'changedProperties';
        var changedProperties = 'cangedProperties';
        var oldProperties = 'oldProperties';
        var pathContent;
        var basicElement;
        var isStamp = false;
        // tslint:disable-next-line
        var annotationSettings = this.pdfViewer.annotationModule.findAnnotationSettings(obj);
        var annotationMaxHeight = 0;
        var annotationMaxWidth = 0;
        var annotationMinHeight = 0;
        var annotationMinWidth = 0;
        if (annotationSettings.minWidth || annotationSettings.maxWidth || annotationSettings.minHeight || annotationSettings.maxHeight) {
            annotationMaxHeight = annotationSettings.maxHeight ? annotationSettings.maxHeight : 2000;
            annotationMaxWidth = annotationSettings.maxWidth ? annotationSettings.maxWidth : 2000;
            annotationMinHeight = annotationSettings.minHeight ? annotationSettings.minHeight : 0;
            annotationMinWidth = annotationSettings.minWidth ? annotationSettings.minWidth : 0;
        }
        var isAnnotationSet = false;
        if (annotationMinHeight || annotationMinWidth || annotationMaxHeight || annotationMaxWidth) {
            isAnnotationSet = true;
        }
        switch (obj.shapeAnnotationType) {
            case 'Ellipse':
                pathContent = new PathElement();
                pathContent.data = 'M80.5,12.5 C80.5,19.127417 62.59139,24.5 40.5,24.5 C18.40861,24.5 0.5,19.127417 0.5,12.5' +
                    'C0.5,5.872583 18.40861,0.5 40.5,0.5 C62.59139,0.5 80.5,5.872583 80.5,12.5 z';
                content = pathContent;
                canvas.children.push(content);
                if (obj.enableShapeLabel) {
                    var textLabel = this.textElement(obj);
                    textLabel.content = obj.labelContent;
                    textLabel.style.color = obj.fontColor;
                    textLabel.style.strokeColor = obj.labelBorderColor;
                    textLabel.style.fill = obj.labelFillColor;
                    textLabel.style.fontSize = obj.fontSize;
                    textLabel.style.fontFamily = obj.fontFamily;
                    textLabel.style.opacity = obj.labelOpacity;
                    canvas.children.push(textLabel);
                }
                break;
            case 'Path':
                pathContent = new PathElement();
                pathContent.data = obj.data;
                content = pathContent;
                canvas.children.push(content);
                break;
            case 'HandWrittenSignature':
            case 'Ink':
                pathContent = new PathElement();
                pathContent.data = obj.data;
                pathContent.style.strokeColor = obj.strokeColor;
                pathContent.style.strokeWidth = obj.thickness;
                pathContent.style.opacity = obj.opacity;
                content = pathContent;
                canvas.children.push(content);
                break;
            case 'Polygon':
                pathContent = new PathElement();
                pathContent.data = getPolygonPath(obj.vertexPoints);
                content = pathContent;
                canvas.children.push(content);
                break;
            case 'Stamp':
                isStamp = true;
                this.isDynamicStamps = true;
                if (obj && obj.annotationAddMode && obj.annotationAddMode === 'Existing Annotation') {
                    obj.bounds.width = obj.bounds.width - 20;
                    obj.bounds.height = obj.bounds.height - 20;
                }
                if (obj.isDynamicStamp) {
                    canvas.horizontalAlignment = 'Left';
                    basicElement = new DrawingElement();
                    content = basicElement;
                    content.cornerRadius = 10;
                    content.style.fill = obj.stampFillColor;
                    content.style.strokeColor = obj.stampStrokeColor;
                    canvas.children.push(content);
                    var textele_1 = this.textElement(obj);
                    textele_1 = new TextElement();
                    textele_1.style.fontFamily = 'Helvetica';
                    textele_1.style.fontSize = 14;
                    textele_1.style.italic = true;
                    textele_1.style.bold = true;
                    textele_1.style.color = obj.fillColor;
                    textele_1.rotateValue = undefined;
                    textele_1.content = obj.dynamicText;
                    textele_1.relativeMode = 'Point';
                    textele_1.margin.left = 10;
                    textele_1.margin.bottom = -7;
                    textele_1.setOffsetWithRespectToBounds(0, 0.57, null);
                    textele_1.relativeMode = 'Point';
                    canvas.children.push(textele_1);
                    // tslint:disable-next-line
                    var pathContent1 = new PathElement();
                    pathContent1.id = randomId() + '_stamp';
                    pathContent1.data = obj.data;
                    pathContent1.width = obj.bounds.width;
                    if (isAnnotationSet && (obj.bounds.width > annotationMaxWidth)) {
                        pathContent1.width = annotationMaxWidth;
                        obj.bounds.width = annotationMaxWidth;
                    }
                    pathContent1.height = obj.bounds.height / 2;
                    if (isAnnotationSet && (obj.bounds.height > annotationMaxHeight)) {
                        pathContent1.height = annotationMaxHeight / 2;
                        obj.bounds.height = annotationMaxHeight / 2;
                    }
                    pathContent1.rotateValue = undefined;
                    pathContent1.margin.left = 10;
                    pathContent1.margin.bottom = -5;
                    pathContent1.relativeMode = 'Point';
                    pathContent1.setOffsetWithRespectToBounds(0, 0.1, null);
                    // tslint:disable-next-line
                    var content1 = pathContent1;
                    pathContent1.style.fill = obj.fillColor;
                    pathContent1.style.strokeColor = obj.strokeColor;
                    pathContent1.style.opacity = obj.opacity;
                    content.width = obj.bounds.width + 20;
                    content.height = obj.bounds.height + 20;
                    content.style.opacity = obj.opacity;
                    canvas.children.push(content1);
                }
                else {
                    canvas.horizontalAlignment = 'Left';
                    basicElement = new DrawingElement();
                    content = basicElement;
                    content.cornerRadius = 10;
                    content.style.fill = obj.stampFillColor;
                    content.style.strokeColor = obj.stampStrokeColor;
                    canvas.children.push(content);
                    // tslint:disable-next-line
                    var pathContent1 = new PathElement();
                    pathContent1.id = randomId() + '_stamp';
                    pathContent1.data = obj.data;
                    pathContent1.width = obj.bounds.width;
                    if (isAnnotationSet && (obj.bounds.width > annotationMaxWidth)) {
                        pathContent1.width = annotationMaxWidth;
                        obj.bounds.width = annotationMaxWidth;
                    }
                    pathContent1.height = obj.bounds.height;
                    if (isAnnotationSet && (obj.bounds.height > annotationMaxHeight)) {
                        pathContent1.height = annotationMaxHeight;
                        obj.bounds.height = annotationMaxHeight;
                    }
                    pathContent1.minWidth = pathContent1.width / 2;
                    pathContent1.minHeight = pathContent1.height / 2;
                    // tslint:disable-next-line
                    var content1 = pathContent1;
                    pathContent1.style.fill = obj.fillColor;
                    pathContent1.style.strokeColor = obj.strokeColor;
                    pathContent1.style.opacity = obj.opacity;
                    content.width = obj.bounds.width + 20;
                    content.height = obj.bounds.height + 20;
                    content.minWidth = pathContent1.width / 2;
                    content.minHeight = pathContent1.height / 2;
                    content.style.opacity = obj.opacity;
                    canvas.children.push(content1);
                    canvas.minHeight = content.minHeight + 20;
                    canvas.minWidth = content.minWidth + 20;
                }
                if (obj && obj.annotationAddMode && obj.annotationAddMode === 'Existing Annotation') {
                    obj.bounds.width = obj.bounds.width + 20;
                    obj.bounds.height = obj.bounds.height + 20;
                }
                break;
            case 'Image':
                // tslint:disable-next-line
                var pathContent11 = new ImageElement();
                pathContent11.source = obj.data;
                content = pathContent11;
                canvas.children.push(content);
                break;
            case 'Rectangle':
                basicElement = new DrawingElement();
                content = basicElement;
                canvas.children.push(content);
                if (obj.enableShapeLabel) {
                    var textLabel = this.textElement(obj);
                    textLabel.content = obj.labelContent;
                    textLabel.style.color = obj.fontColor;
                    textLabel.style.strokeColor = obj.labelBorderColor;
                    textLabel.style.fill = obj.labelFillColor;
                    textLabel.style.fontSize = obj.fontSize;
                    textLabel.style.fontFamily = obj.fontFamily;
                    textLabel.style.opacity = obj.labelOpacity;
                    canvas.children.push(textLabel);
                }
                break;
            case 'Perimeter':
                pathContent = new PathElement();
                pathContent.data = 'M80.5,12.5 C80.5,19.127417 62.59139,24.5 40.5,24.5 C18.40861,24.5 0.5,19.127417 0.5,12.5' +
                    'C0.5,5.872583 18.40861,0.5 40.5,0.5 C62.59139,0.5 80.5,5.872583 80.5,12.5 z';
                content = pathContent;
                setElementStype(obj, pathContent);
                canvas.children.push(content);
                basicElement = new DrawingElement();
                basicElement.id = 'perimeter_' + randomId();
                basicElement.height = .2;
                basicElement.width = .2;
                basicElement.transform = RotateTransform.Self;
                basicElement.horizontalAlignment = 'Stretch';
                this.setNodePosition(basicElement, obj);
                basicElement.rotateAngle = obj.rotateAngle;
                setElementStype(obj, basicElement);
                canvas.children.push(basicElement);
                var textele = this.textElement(obj);
                textele = new TextElement();
                textele.content = textele.content = findPointsLength([
                    { x: obj.bounds.x, y: obj.bounds.y },
                    { x: obj.bounds.x + obj.bounds.width, y: obj.bounds.y + obj.bounds.height }
                ]).toString();
                textele.rotateValue = { y: -10, angle: obj.rotateAngle };
                canvas.children.push(textele);
                break;
            case 'Radius':
                pathContent = new PathElement();
                pathContent.data = 'M80.5,12.5 C80.5,19.127417 62.59139,24.5 40.5,24.5 C18.40861,24.5 0.5,19.127417 0.5,12.5' +
                    'C0.5,5.872583 18.40861,0.5 40.5,0.5 C62.59139,0.5 80.5,5.872583 80.5,12.5 z';
                content = pathContent;
                setElementStype(obj, pathContent);
                canvas.children.push(content);
                basicElement = new DrawingElement();
                basicElement.id = 'radius_' + randomId();
                basicElement.height = .2;
                basicElement.width = obj.bounds.width / 2;
                basicElement.transform = RotateTransform.Self;
                this.setNodePosition(basicElement, obj);
                basicElement.rotateAngle = obj.rotateAngle;
                setElementStype(obj, basicElement);
                canvas.children.push(basicElement);
                textele = this.textElement(obj);
                if (obj.enableShapeLabel) {
                    textele.style.color = obj.fontColor;
                    textele.style.strokeColor = obj.labelBorderColor;
                    textele.style.fill = obj.labelFillColor;
                    textele.style.fontSize = obj.fontSize;
                    textele.style.fontFamily = obj.fontFamily;
                    textele.style.opacity = obj.labelOpacity;
                }
                var length_1 = findPointsLength([
                    { x: obj.bounds.x, y: obj.bounds.y },
                    { x: obj.bounds.x + obj.bounds.width, y: obj.bounds.y + obj.bounds.height }
                ]);
                if (!this.pdfViewer.enableImportAnnotationMeasurement && obj.notes && obj.notes !== '') {
                    textele.content = obj.notes;
                }
                else {
                    // tslint:disable-next-line:max-line-length
                    textele.content = this.pdfViewer.annotation.measureAnnotationModule.setConversion((length_1 / 2) * this.pdfViewer.annotation.measureAnnotationModule.pixelToPointFactor, obj);
                }
                textele.rotateValue = { y: -10, x: obj.bounds.width / 4, angle: obj.rotateAngle };
                canvas.children.push(textele);
                break;
            case 'StickyNotes':
                // tslint:disable-next-line
                var pathContent2 = new ImageElement();
                pathContent2.source = obj.data;
                pathContent2.width = obj.bounds.width;
                pathContent2.height = obj.bounds.height;
                pathContent2.style.strokeColor = obj.strokeColor;
                pathContent2.style.strokeWidth = 0;
                content = pathContent2;
                canvas.children.push(content);
                break;
            case 'FreeText':
                // tslint:disable-next-line
                var rectElement = new DrawingElement();
                content = rectElement;
                canvas.children.push(content);
                var freeTextEle = this.textElement(obj);
                freeTextEle = new TextElement();
                freeTextEle.style.fontFamily = obj.fontFamily;
                freeTextEle.style.fontSize = obj.fontSize;
                freeTextEle.style.textAlign = 'Left';
                if (obj.textAlign.toLowerCase() === 'center') {
                    freeTextEle.style.textAlign = 'Center';
                }
                else if (obj.textAlign.toLowerCase() === 'right') {
                    freeTextEle.style.textAlign = 'Right';
                }
                else if (obj.textAlign.toLowerCase() === 'justify') {
                    freeTextEle.style.textAlign = 'Justify';
                }
                freeTextEle.style.color = obj.fontColor;
                freeTextEle.style.bold = obj.font.isBold;
                freeTextEle.style.italic = obj.font.isItalic;
                if (obj.font.isUnderline === true) {
                    freeTextEle.style.textDecoration = 'Underline';
                }
                else if (obj.font.isStrikeout === true) {
                    freeTextEle.style.textDecoration = 'LineThrough';
                }
                freeTextEle.rotateValue = undefined;
                freeTextEle.content = obj.dynamicText;
                freeTextEle.margin.left = 2;
                freeTextEle.margin.top = 5;
                freeTextEle.style.textWrapping = 'Wrap';
                freeTextEle.relativeMode = 'Point';
                freeTextEle.setOffsetWithRespectToBounds(0, 0, null);
                freeTextEle.relativeMode = 'Point';
                canvas.children.push(freeTextEle);
                break;
        }
        content.id = obj.id + '_content';
        content.relativeMode = 'Object';
        if (!isStamp) {
            if (obj.bounds.width !== undefined) {
                content.width = obj.bounds.width;
                if (isAnnotationSet) {
                    if ((content.width < annotationMinWidth) || (content.width > annotationMaxWidth)) {
                        if (content.width < annotationMinWidth) {
                            content.width = annotationMinWidth;
                        }
                        if (content.width > annotationMaxWidth) {
                            content.width = annotationMaxWidth;
                        }
                    }
                }
            }
            content.horizontalAlignment = 'Stretch';
            if (obj.bounds.height !== undefined) {
                content.height = obj.bounds.height;
                if (isAnnotationSet) {
                    if ((content.height < annotationMinHeight) || (content.width > annotationMaxHeight)) {
                        if (content.height < annotationMinHeight) {
                            content.height = annotationMinHeight;
                        }
                        if (content.height > annotationMaxHeight) {
                            content.height = annotationMaxHeight;
                        }
                    }
                }
            }
            setElementStype(obj, content);
        }
        content.isRectElement = true;
        content.verticalAlignment = 'Stretch';
        return content;
    };
    Drawing.prototype.textElement = function (obj) {
        var textele = new TextElement();
        setElementStype(obj, textele);
        textele.horizontalAlignment = 'Center';
        textele.verticalAlignment = 'Top';
        textele.relativeMode = 'Object';
        textele.setOffsetWithRespectToBounds(.5, .5, 'Absolute');
        return textele;
    };
    /**
     * @private
     */
    Drawing.prototype.setNodePosition = function (obj, node) {
        if (node.shapeAnnotationType === 'Perimeter') {
            obj.offsetX = node.bounds.x + node.bounds.width / 2;
            obj.offsetY = node.bounds.y + node.bounds.height / 2;
        }
        else if (node.shapeAnnotationType === 'Radius') {
            // tslint:disable-next-line:max-line-length
            var trasPoint = { x: node.bounds.x + (node.bounds.width / 2) + (node.bounds.width / 4), y: node.bounds.y + (node.bounds.height / 2) };
            var center = { x: (node.bounds.x + (node.bounds.width / 2)), y: (node.bounds.y + (node.bounds.height / 2)) };
            var matrix = identityMatrix();
            rotateMatrix(matrix, node.rotateAngle, center.x, center.y);
            var rotatedPoint = transformPointByMatrix(matrix, trasPoint);
            var newPoint1 = { x: rotatedPoint.x, y: rotatedPoint.y };
            obj.offsetX = newPoint1.x;
            obj.offsetY = newPoint1.y;
            obj.width = node.bounds.width / 2;
        }
    };
    /* tslint:enable */
    /**
     * @private
     */
    Drawing.prototype.initContainer = function (obj) {
        if (!obj.id) {
            obj.id = randomId();
        }
        // Creates canvas element
        var canvas;
        canvas = new Canvas();
        canvas.id = obj.id;
        canvas.offsetX = obj.bounds.x + (obj.bounds.width * 0.5);
        canvas.offsetY = obj.bounds.y + (obj.bounds.height * 0.5);
        canvas.style.fill = 'transparent';
        canvas.style.strokeColor = 'transparent';
        canvas.rotateAngle = obj.rotateAngle;
        obj.wrapper = canvas;
        return canvas;
    };
    /**
     * @private
     */
    // tslint:disable-next-line:no-any
    Drawing.prototype.initLine = function (obj) {
        if (!obj.id) {
            obj.id = randomId();
        }
        var bpmnElement;
        var container = new Canvas();
        var segment = new PathElement();
        segment.id = obj.id + '_path';
        var srcDecorator = new PathElement();
        var targetDecorator = new PathElement();
        if (obj.vertexPoints.length) {
            obj.sourcePoint = obj.vertexPoints[0];
            obj.targetPoint = obj.vertexPoints[obj.vertexPoints.length - 1];
            for (var i = 0; i < obj.vertexPoints.length; i++) {
                if (i !== 0 && i !== obj.vertexPoints.length - 1) {
                    obj.segments.push(obj.vertexPoints[i]);
                }
            }
        }
        segment = getSegmentElement(obj, segment);
        var bounds;
        var points = [];
        points = getConnectorPoints(obj);
        //  points = this.clipDecorators(this, points);
        var leaders = [];
        var labels = [];
        if (obj.shapeAnnotationType === 'Distance') {
            leaders = initLeaders(obj, points);
            labels = initDistanceLabel(obj, points, this.pdfViewer.annotation.measureAnnotationModule, this.pdfViewer);
        }
        if ((obj.shapeAnnotationType === 'Line' || obj.shapeAnnotationType === 'LineWidthArrowHead') && obj.measureType === 'Perimeter') {
            labels = initPerimeterLabel(obj, points, this.pdfViewer.annotation.measureAnnotationModule, this.pdfViewer);
        }
        if (obj.enableShapeLabel === true && !(obj.shapeAnnotationType === 'Distance') && !(obj.measureType === 'Perimeter')) {
            var textele = void 0;
            var angle = Point.findAngle(points[0], points[1]);
            textele = this.textElement(obj);
            textele.id = randomId();
            if (!this.pdfViewer.enableImportAnnotationMeasurement && obj.notes && obj.notes !== '') {
                textele.content = obj.notes;
            }
            else {
                textele.content = obj.labelContent;
            }
            textele.style.strokeColor = obj.labelBorderColor;
            textele.style.fill = obj.labelFillColor;
            textele.style.fontSize = obj.fontSize;
            textele.style.color = obj.fontColor;
            textele.style.fontFamily = obj.fontFamily;
            textele.style.opacity = obj.labelOpacity;
            textele.rotateValue = { y: -10, angle: angle };
            labels.push(textele);
        }
        points = clipDecorators(obj, points);
        bounds = Rect.toBounds(points);
        container.width = bounds.width;
        container.height = bounds.height;
        container.offsetX = bounds.x + container.pivot.x * bounds.width;
        container.offsetY = bounds.y + container.pivot.y * bounds.height;
        var anglePoints = obj.vertexPoints;
        var accessContent = 'getDescription';
        // tslint:disable-next-line:max-line-length
        if (obj.shapeAnnotationType === 'Line' || obj.shapeAnnotationType === 'LineWidthArrowHead' || obj.shapeAnnotationType === 'Distance') {
            srcDecorator = getDecoratorElement(obj, points[0], anglePoints[1], true);
            targetDecorator = getDecoratorElement(obj, points[points.length - 1], anglePoints[anglePoints.length - 2], false);
        }
        srcDecorator.id = obj.id + '_srcDec';
        targetDecorator.id = obj.id + '_tarDec';
        /* tslint:disable:no-string-literal */
        segment.style['fill'] = 'transparent';
        container.style.strokeColor = 'transparent';
        container.style.fill = 'transparent';
        container.style.strokeWidth = 0;
        container.children = [];
        setElementStype(obj, segment);
        container.children.push(segment);
        if (leaders.length > 0) {
            for (var i = 0; i < leaders.length; i++) {
                container.children.push(leaders[i]);
            }
        }
        if (labels.length > 0) {
            for (var i = 0; i < labels.length; i++) {
                container.children.push(labels[i]);
            }
        }
        container.children.push(srcDecorator);
        container.children.push(targetDecorator);
        container.id = obj.id;
        container.offsetX = segment.offsetX;
        container.offsetY = segment.offsetY;
        container.width = segment.width;
        container.height = segment.height;
        points = getConnectorPoints(obj);
        obj.wrapper = container;
        return container;
    };
    /**
     * @private
     */
    Drawing.prototype.add = function (obj) {
        obj = new PdfAnnotationBase(this.pdfViewer, 'annotations', obj, true);
        obj = this.initObject(obj);
        this.pdfViewer.annotations.push(obj);
        return obj;
    };
    /**
     * @private
     */
    Drawing.prototype.remove = function (obj) {
        var index = obj.pageIndex;
        for (var i = 0; i < this.pdfViewer.annotations.length; i++) {
            var annotation = this.pdfViewer.annotations[i];
            if (annotation.id === obj.id || annotation.wrapper.id === obj.id) {
                this.pdfViewer.annotations.splice(i, 1);
                var objects = this.getPageObjects(obj.pageIndex);
                for (var j = 0; j < objects.length; j++) {
                    if (objects[j].id === obj.id) {
                        objects.splice(j, 1);
                    }
                }
                // need to add code snippet to remove from z index table
            }
        }
        this.pdfViewer.renderDrawing(undefined, index);
    };
    /**
     * @private
     */
    Drawing.prototype.getPageObjects = function (pageIndex) {
        var pageTable = this.getPageTable(pageIndex);
        return pageTable.objects;
    };
    /**
     * @private
     */
    Drawing.prototype.refreshCanvasDiagramLayer = function (diagramLayer, pageIndex) {
        if (!diagramLayer) {
            diagramLayer = document.getElementById(this.pdfViewer.element.id + '_annotationCanvas_' + pageIndex);
        }
        if (diagramLayer) {
            var width = diagramLayer.width / this.pdfViewer.viewerBase.getZoomFactor();
            var height = diagramLayer.height / this.pdfViewer.viewerBase.getZoomFactor();
            var zoom = this.pdfViewer.viewerBase.getZoomFactor();
            var ctx = diagramLayer.getContext('2d');
            ctx.setTransform(zoom, 0, 0, zoom, 0, 0);
            ctx.clearRect(0, 0, width, height);
            var objects = this.getPageObjects(pageIndex);
            for (var i = 0; i < objects.length; i++) {
                // tslint:disable-next-line:no-any
                var renderElement = this.pdfViewer.nameTable[objects[i].id].wrapper;
                refreshDiagramElements(diagramLayer, [renderElement], this.renderer);
            }
        }
    };
    /**
     * @private
     */
    Drawing.prototype.clearHighlighter = function (index) {
        var adornerSvg = this.getAdornerLayerSvg(this.pdfViewer.element.id + index + '_diagramAdornerLayer', index);
        if (adornerSvg) {
            var highlighter = adornerSvg.getElementById(adornerSvg.id + '_highlighter');
            if (highlighter) {
                highlighter.parentNode.removeChild(highlighter);
            }
        }
    };
    /**
     * @private
     */
    Drawing.prototype.getSelectorElement = function (diagramId, index) {
        var adornerLayer = null;
        var adornerSvg = this.getAdornerLayerSvg(diagramId, index);
        if (adornerSvg) {
            adornerLayer = adornerSvg.getElementById(diagramId + '_SelectorElement');
        }
        return adornerLayer;
    };
    /**
     * @private
     */
    Drawing.prototype.getAdornerLayerSvg = function (diagramId, index) {
        var adornerLayerSvg = null;
        var diagramElement = getDiagramElement(diagramId + index + '_diagramAdornerLayer');
        var elementcoll;
        if (diagramElement) {
            elementcoll = diagramElement.getElementsByClassName('e-adorner-layer' + index);
            adornerLayerSvg = elementcoll[0];
        }
        return adornerLayerSvg;
    };
    /**
     * @private
     */
    Drawing.prototype.clearSelectorLayer = function (index) {
        var adornerSvg = this.getAdornerLayerSvg(this.pdfViewer.element.id, index);
        if (adornerSvg) {
            var selectionRect = adornerSvg.getElementById(this.pdfViewer.adornerSvgLayer.id + '_selected_region');
            if (selectionRect) {
                selectionRect.parentNode.removeChild(selectionRect);
            }
            this.clearHighlighter(index);
            var childNodes = this.getSelectorElement(this.pdfViewer.element.id, index).childNodes;
            var child = void 0;
            for (var i = childNodes.length; i > 0; i--) {
                child = childNodes[i - 1];
                child.parentNode.removeChild(child);
            }
        }
    };
    /**
     * @private
     */
    // tslint:disable-next-line:max-line-length
    Drawing.prototype.renderSelector = function (select, currentSelector, helper, isSelect) {
        if (!helper || isSelect) {
            var size = new Size();
            var selectorModel = this.pdfViewer.selectedItems;
            this.clearSelectorLayer(select);
            if (selectorModel.wrapper) {
                selectorModel.wrapper.measure(size);
                var zoom = this.pdfViewer.viewerBase.getZoomFactor();
                selectorModel.wrapper.arrange(selectorModel.wrapper.desiredSize);
                selectorModel.width = selectorModel.wrapper.actualSize.width;
                selectorModel.height = selectorModel.wrapper.actualSize.height;
                selectorModel.offsetX = selectorModel.wrapper.offsetX;
                selectorModel.offsetY = selectorModel.wrapper.offsetY;
                if (selectorModel.annotations.length === 1) {
                    selectorModel.rotateAngle = selectorModel.annotations[0].rotateAngle;
                    selectorModel.wrapper.rotateAngle = selectorModel.annotations[0].rotateAngle;
                    //selectorModel.pivot = selectorModel.annotations[0].pivot;
                }
                var bounds = selectorModel.wrapper.bounds;
                // tslint:disable-next-line
                var selectorElement = void 0;
                if (selectorModel.annotations.length) {
                    for (var j = 0; j < selectorModel.annotations.length; j++) {
                        var node = selectorModel.annotations[j];
                        selectorElement = this.getSelectorElement(this.pdfViewer.element.id, select);
                        var constraints = true;
                        if (selectorElement && node.pageIndex === select) {
                            if (node.shapeAnnotationType === 'Distance' || node.shapeAnnotationType === 'Line' ||
                                node.shapeAnnotationType === 'LineWidthArrowHead' || node.shapeAnnotationType === 'Polygon') {
                                this.renderEndPointHandle(node, selectorElement, selectorModel.thumbsConstraints, { scale: zoom, tx: 0, ty: 0 }, undefined, undefined, true, currentSelector);
                            }
                            else {
                                if (node.shapeAnnotationType === 'StickyNotes') {
                                    this.renderResizeHandle(node.wrapper.children[0], selectorElement, selectorModel.thumbsConstraints, zoom, undefined, undefined, undefined, false, true, null, null, currentSelector);
                                }
                                else {
                                    if (this.pdfViewer.tool !== 'Stamp') {
                                        this.renderResizeHandle(node.wrapper.children[0], selectorElement, selectorModel.thumbsConstraints, zoom, 
                                        // tslint:disable-next-line:max-line-length
                                        undefined, undefined, undefined, node.shapeAnnotationType === 'Stamp', false, node.shapeAnnotationType === 'Path', (node.shapeAnnotationType === 'FreeText' || node.shapeAnnotationType === 'HandWrittenSignature' || node.shapeAnnotationType === 'Image'), currentSelector);
                                    }
                                }
                            }
                            if (!this.pdfViewer.viewerBase.isNewSignatureAdded && node.shapeAnnotationType === 'HandWrittenSignature') {
                                this.pdfViewer.annotationModule.selectSignature(node.signatureName, node.pageIndex, node);
                            }
                            if (node.annotName !== '') {
                                if (helper && (node === helper)) {
                                    // tslint:disable-next-line:max-line-length
                                    if (!this.pdfViewer.viewerBase.isAnnotationSelect && !this.pdfViewer.viewerBase.isAnnotationMouseDown && !this.pdfViewer.viewerBase.isAnnotationMouseMove && !this.pdfViewer.viewerBase.isInkAdded) {
                                        this.pdfViewer.viewerBase.isAnnotationSelect = true;
                                        this.pdfViewer.annotationModule.annotationSelect(node.annotName, node.pageIndex, node);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    };
    /**
     * Rotates the given nodes/connectors by the given angle
     * @param obj Defines the objects to be rotated
     * @param angle Defines the angle by which the objects have to be rotated
     * @param pivot Defines the reference point with reference to which the objects have to be rotated
     */
    /**
     * @private
     */
    // tslint:disable-next-line:max-line-length
    Drawing.prototype.rotate = function (obj, angle, pivot, currentSelector) {
        var checkBoundaryConstraints;
        if (obj) {
            pivot = pivot || { x: obj.wrapper.offsetX, y: obj.wrapper.offsetY };
            if (obj instanceof Selector) {
                obj.rotateAngle += angle;
                obj.wrapper.rotateAngle += angle;
                var objects = [];
                objects = objects.concat(obj.annotations);
                this.rotateObjects(obj, objects, angle, pivot, null, currentSelector);
            }
            else {
                this.rotateObjects(obj, [obj], angle, pivot);
            }
        }
        return checkBoundaryConstraints;
    };
    /**
     * @private
     */
    Drawing.prototype.rotateObjects = function (parent, objects, angle, pivot, includeParent, currentSelector) {
        pivot = pivot || {};
        var matrix = identityMatrix();
        rotateMatrix(matrix, angle, pivot.x, pivot.y);
        for (var _i = 0, objects_1 = objects; _i < objects_1.length; _i++) {
            var obj = objects_1[_i];
            if (obj instanceof PdfAnnotationBase) {
                if (includeParent !== false || parent !== obj) {
                    obj.rotateAngle += angle;
                    obj.rotateAngle = (obj.rotateAngle + 360) % 360;
                    var newOffset = transformPointByMatrix(matrix, { x: obj.wrapper.offsetX, y: obj.wrapper.offsetY });
                    obj.wrapper.offsetX = newOffset.x;
                    obj.wrapper.offsetY = newOffset.y;
                    this.nodePropertyChange(obj, { rotateAngle: obj.rotateAngle });
                }
                this.renderSelector(obj.pageIndex, currentSelector);
            }
        }
    };
    Drawing.prototype.getParentSvg = function (element, targetElement, canvas) {
        if (element && element.id) {
            if (targetElement && targetElement === 'selector') {
                return this.pdfViewer.adornerSvgLayer;
            }
        }
        return canvas;
    };
    /**
     * @private
     */
    // tslint:disable-next-line
    Drawing.prototype.renderBorder = function (selector, canvas, currentSelector, transform, enableNode, isBorderTickness, isSwimlane, isSticky) {
        var wrapper = selector;
        var options = getBaseShapeAttributes(wrapper, transform);
        transform = transform || { scale: 1, tx: 0, ty: 0 };
        if (!isSticky) {
            options.x *= transform.scale;
            options.y *= transform.scale;
            options.width *= transform.scale;
            options.height *= transform.scale;
            options.fill = 'transparent';
            var shapeType = void 0;
            shapeType = this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType;
            if (currentSelector && (typeof (currentSelector) !== 'object') && currentSelector !== '') {
                // tslint:disable-next-line
                var annotationSelector = JSON.parse(currentSelector);
                // tslint:disable-next-line:max-line-length
                var borderColor = annotationSelector.selectionBorderColor === '' ? 'black' : annotationSelector.selectionBorderColor;
                options.stroke = borderColor;
                // tslint:disable-next-line:max-line-length
                options.strokeWidth = currentSelector.selectionBorderThickness === 1 ? 1 : annotationSelector.selectionBorderThickness;
                var lineDash = annotationSelector.selectorLineDashArray.length === 0 ? [6, 3] : annotationSelector.selectorLineDashArray;
                if (lineDash.length > 2) {
                    lineDash = [lineDash[0], lineDash[1]];
                }
                options.dashArray = lineDash.toString();
            }
            else {
                if (shapeType === 'HandWrittenSignature' || shapeType === 'Ink') {
                    this.getSignBorder(shapeType, options);
                }
                else {
                    this.getBorderSelector(shapeType, options);
                }
            }
            options.class = 'e-pv-diagram-border';
            if (isSwimlane) {
                options.class += ' e-diagram-lane';
            }
            options.id = 'borderRect';
            options.id = 'borderRect';
            if (!enableNode) {
                options.class += ' e-disabled';
            }
            if (isBorderTickness) {
                options.class += ' e-thick-border';
            }
            options.cornerRadius = 0;
        }
        else {
            options.x *= transform.scale;
            options.y *= transform.scale;
            options.width *= transform.scale;
            options.height *= transform.scale;
            var shapeType = void 0;
            shapeType = this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType;
            if (currentSelector && (typeof (currentSelector) !== 'object') && currentSelector !== '') {
                var annotationSelector = JSON.parse(currentSelector);
                // tslint:disable-next-line:max-line-length
                var borderColor = annotationSelector.selectionBorderColor === '' ? 'black' : annotationSelector.selectionBorderColor;
                options.stroke = borderColor;
                // tslint:disable-next-line:max-line-length
                options.strokeWidth = currentSelector.selectionBorderThickness === 1 ? 1 : annotationSelector.selectionBorderThickness;
                var lineDash = annotationSelector.selectorLineDashArray.length === 0 ? [6, 3] : annotationSelector.selectorLineDashArray;
                if (lineDash.length > 2) {
                    lineDash = [lineDash[0], lineDash[1]];
                }
                options.dashArray = lineDash.toString();
            }
            else {
                this.getBorderSelector(shapeType, options);
            }
        }
        var parentSvg = this.getParentSvg(selector, 'selector');
        // tslint:disable-next-line:max-line-length
        this.svgRenderer.drawRectangle(canvas, options, this.pdfViewer.element.id, undefined, true, parentSvg);
    };
    /**
     * @private
     */
    Drawing.prototype.getSignBorder = function (type, options) {
        if (type === 'HandWrittenSignature' && this.pdfViewer.handWrittenSignatureSettings.annotationSelectorSettings) {
            // tslint:disable-next-line:max-line-length
            var borderColor = void 0;
            borderColor = isNullOrUndefined(this.pdfViewer.handWrittenSignatureSettings.annotationSelectorSettings.selectionBorderColor) || this.pdfViewer.handWrittenSignatureSettings.annotationSelectorSettings.selectionBorderColor === '' ? '#0000ff' : this.pdfViewer.handWrittenSignatureSettings.annotationSelectorSettings.selectionBorderColor;
            options.stroke = borderColor;
            // tslint:disable-next-line:max-line-length
            var thickness = void 0;
            thickness = isNullOrUndefined(this.pdfViewer.handWrittenSignatureSettings.annotationSelectorSettings.selectionBorderThickness) ? 1 : this.pdfViewer.handWrittenSignatureSettings.annotationSelectorSettings.selectionBorderThickness;
            options.strokeWidth = thickness;
            // tslint:disable-next-line:max-line-length
            var lineDash = void 0;
            lineDash = isNullOrUndefined(this.pdfViewer.handWrittenSignatureSettings.annotationSelectorSettings.selectorLineDashArray) || this.pdfViewer.handWrittenSignatureSettings.annotationSelectorSettings.selectorLineDashArray.length === 0 ? [4] : this.pdfViewer.handWrittenSignatureSettings.annotationSelectorSettings.selectorLineDashArray;
            if (lineDash.length > 2) {
                lineDash = [lineDash[0], lineDash[1]];
            }
            options.dashArray = lineDash.toString();
        }
        else if (type === 'Ink' && this.pdfViewer.inkAnnotationSettings.annotationSelectorSettings) {
            // tslint:disable-next-line:max-line-length
            var borderColor = void 0;
            borderColor = isNullOrUndefined(this.pdfViewer.inkAnnotationSettings.annotationSelectorSettings.selectionBorderColor) || this.pdfViewer.inkAnnotationSettings.annotationSelectorSettings.selectionBorderColor === '' ? '#0000ff' : this.pdfViewer.inkAnnotationSettings.annotationSelectorSettings.selectionBorderColor;
            options.stroke = borderColor;
            // tslint:disable-next-line:max-line-length
            var thickness = void 0;
            thickness = isNullOrUndefined(this.pdfViewer.inkAnnotationSettings.annotationSelectorSettings.selectionBorderThickness) ? 1 : this.pdfViewer.inkAnnotationSettings.annotationSelectorSettings.selectionBorderThickness;
            options.strokeWidth = thickness;
            // tslint:disable-next-line:max-line-length
            var lineDash = void 0;
            lineDash = isNullOrUndefined(this.pdfViewer.inkAnnotationSettings.annotationSelectorSettings.selectorLineDashArray) || this.pdfViewer.inkAnnotationSettings.annotationSelectorSettings.selectorLineDashArray.length === 0 ? [4] : this.pdfViewer.inkAnnotationSettings.annotationSelectorSettings.selectorLineDashArray;
            if (lineDash.length > 2) {
                lineDash = [lineDash[0], lineDash[1]];
            }
            options.dashArray = lineDash.toString();
        }
        else {
            var annotationSelector = this.pdfViewer.annotationSelectorSettings;
            // tslint:disable-next-line:max-line-length
            var borderColor = annotationSelector.selectionBorderColor === '' ? 'black' : annotationSelector.selectionBorderColor;
            options.stroke = borderColor;
            // tslint:disable-next-line:max-line-length
            options.strokeWidth = annotationSelector.selectionBorderThickness === 1 ? 1 : annotationSelector.selectionBorderThickness;
            var lineDash = annotationSelector.selectorLineDashArray.length === 0 ? [6, 3] : annotationSelector.selectorLineDashArray;
            if (lineDash.length > 2) {
                lineDash = [lineDash[0], lineDash[1]];
            }
            options.dashArray = lineDash.toString();
        }
    };
    /**
     * @private
     */
    Drawing.prototype.getBorderSelector = function (type, options) {
        var annotationSelector = this.pdfViewer.annotationSelectorSettings;
        // tslint:disable-next-line:max-line-length
        var borderColor = isNullOrUndefined(annotationSelector.selectionBorderColor) || annotationSelector.selectionBorderColor === '' ? 'black' : annotationSelector.selectionBorderColor;
        options.stroke = borderColor;
        // tslint:disable-next-line:max-line-length
        options.strokeWidth = isNullOrUndefined(annotationSelector.selectionBorderThickness) || annotationSelector.selectionBorderThickness === 1 ? 1 : annotationSelector.selectionBorderThickness;
        var lineDash = isNullOrUndefined(annotationSelector.selectorLineDashArray) || annotationSelector.selectorLineDashArray.length === 0 ? [6, 3] : annotationSelector.selectorLineDashArray;
        if (lineDash.length > 2) {
            lineDash = [lineDash[0], lineDash[1]];
        }
        options.dashArray = lineDash.toString();
        if (type === 'Rectangle' && this.pdfViewer.rectangleSettings.annotationSelectorSettings) {
            // tslint:disable-next-line:max-line-length
            var borderColor_1 = isNullOrUndefined(this.pdfViewer.rectangleSettings.annotationSelectorSettings.selectionBorderColor) || this.pdfViewer.rectangleSettings.annotationSelectorSettings.selectionBorderColor === '' ? 'black' : this.pdfViewer.rectangleSettings.annotationSelectorSettings.selectionBorderColor;
            options.stroke = borderColor_1;
            // tslint:disable-next-line:max-line-length
            var thickness = isNullOrUndefined(this.pdfViewer.rectangleSettings.annotationSelectorSettings.selectionBorderThickness) ? 1 : this.pdfViewer.rectangleSettings.annotationSelectorSettings.selectionBorderThickness;
            options.strokeWidth = thickness;
            // tslint:disable-next-line:max-line-length
            var lineDash_1 = isNullOrUndefined(this.pdfViewer.rectangleSettings.annotationSelectorSettings.selectorLineDashArray) || this.pdfViewer.rectangleSettings.annotationSelectorSettings.selectorLineDashArray.length === 0 ? [4] : this.pdfViewer.rectangleSettings.annotationSelectorSettings.selectorLineDashArray;
            if (lineDash_1.length > 2) {
                lineDash_1 = [lineDash_1[0], lineDash_1[1]];
            }
            options.dashArray = lineDash_1.toString();
        }
        else if (type === 'Ellipse' && this.pdfViewer.circleSettings.annotationSelectorSettings) {
            // tslint:disable-next-line:max-line-length
            var borderColor_2 = isNullOrUndefined(this.pdfViewer.circleSettings.annotationSelectorSettings.selectionBorderColor) || this.pdfViewer.circleSettings.annotationSelectorSettings.selectionBorderColor === '' ? 'black' : this.pdfViewer.circleSettings.annotationSelectorSettings.selectionBorderColor;
            options.stroke = borderColor_2;
            // tslint:disable-next-line:max-line-length
            var thickness = isNullOrUndefined(this.pdfViewer.circleSettings.annotationSelectorSettings.selectionBorderThickness) ? 1 : this.pdfViewer.circleSettings.annotationSelectorSettings.selectionBorderThickness;
            options.strokeWidth = thickness;
            // tslint:disable-next-line:max-line-length
            var lineDash_2 = isNullOrUndefined(this.pdfViewer.circleSettings.annotationSelectorSettings.selectorLineDashArray) || this.pdfViewer.circleSettings.annotationSelectorSettings.selectorLineDashArray.length === 0 ? [4] : this.pdfViewer.circleSettings.annotationSelectorSettings.selectorLineDashArray;
            if (lineDash_2.length > 2) {
                lineDash_2 = [lineDash_2[0], lineDash_2[1]];
            }
            options.dashArray = lineDash_2.toString();
        }
        else if (type === 'Radius' && this.pdfViewer.radiusSettings.annotationSelectorSettings) {
            // tslint:disable-next-line:max-line-length
            var borderColor_3 = isNullOrUndefined(this.pdfViewer.radiusSettings.annotationSelectorSettings.selectionBorderColor) || this.pdfViewer.radiusSettings.annotationSelectorSettings.selectionBorderColor === '' ? 'black' : this.pdfViewer.radiusSettings.annotationSelectorSettings.selectionBorderColor;
            options.stroke = borderColor_3;
            // tslint:disable-next-line:max-line-length
            var thickness = isNullOrUndefined(this.pdfViewer.radiusSettings.annotationSelectorSettings.selectionBorderThickness) ? 1 : this.pdfViewer.radiusSettings.annotationSelectorSettings.selectionBorderThickness;
            options.strokeWidth = thickness;
            // tslint:disable-next-line:max-line-length
            var lineDash_3 = isNullOrUndefined(this.pdfViewer.radiusSettings.annotationSelectorSettings.selectorLineDashArray) || this.pdfViewer.radiusSettings.annotationSelectorSettings.selectorLineDashArray.length === 0 ? [4] : this.pdfViewer.radiusSettings.annotationSelectorSettings.selectorLineDashArray;
            if (lineDash_3.length > 2) {
                lineDash_3 = [lineDash_3[0], lineDash_3[1]];
            }
            options.dashArray = lineDash_3.toString();
        }
        else if (type === 'FreeText' && this.pdfViewer.freeTextSettings.annotationSelectorSettings) {
            // tslint:disable-next-line:max-line-length
            var borderColor_4 = isNullOrUndefined(this.pdfViewer.freeTextSettings.annotationSelectorSettings.selectionBorderColor) || this.pdfViewer.freeTextSettings.annotationSelectorSettings.selectionBorderColor === '' ? 'black' : this.pdfViewer.freeTextSettings.annotationSelectorSettings.selectionBorderColor;
            options.stroke = borderColor_4;
            // tslint:disable-next-line:max-line-length
            var thickness = isNullOrUndefined(this.pdfViewer.freeTextSettings.annotationSelectorSettings.selectionBorderThickness) ? 1 : this.pdfViewer.freeTextSettings.annotationSelectorSettings.selectionBorderThickness;
            options.strokeWidth = thickness;
            // tslint:disable-next-line:max-line-length
            var lineDash_4 = isNullOrUndefined(this.pdfViewer.freeTextSettings.annotationSelectorSettings.selectorLineDashArray) || this.pdfViewer.freeTextSettings.annotationSelectorSettings.selectorLineDashArray.length === 0 ? [4] : this.pdfViewer.freeTextSettings.annotationSelectorSettings.selectorLineDashArray;
            if (lineDash_4.length > 2) {
                lineDash_4 = [lineDash_4[0], lineDash_4[1]];
            }
            options.dashArray = lineDash_4.toString();
        }
        else if (type === 'StickyNotes' && this.pdfViewer.stickyNotesSettings.annotationSelectorSettings) {
            // tslint:disable-next-line:max-line-length
            var borderColor_5 = isNullOrUndefined(this.pdfViewer.stickyNotesSettings.annotationSelectorSettings.selectionBorderColor) || this.pdfViewer.stickyNotesSettings.annotationSelectorSettings.selectionBorderColor === '' ? 'black' : this.pdfViewer.stickyNotesSettings.annotationSelectorSettings.selectionBorderColor;
            options.stroke = borderColor_5;
            // tslint:disable-next-line:max-line-length
            var thickness = isNullOrUndefined(this.pdfViewer.stickyNotesSettings.annotationSelectorSettings.selectionBorderThickness) ? 1 : this.pdfViewer.stickyNotesSettings.annotationSelectorSettings.selectionBorderThickness;
            options.strokeWidth = thickness;
            // tslint:disable-next-line:max-line-length
            var lineDash_5 = isNullOrUndefined(this.pdfViewer.stickyNotesSettings.annotationSelectorSettings.selectorLineDashArray) || this.pdfViewer.stickyNotesSettings.annotationSelectorSettings.selectorLineDashArray.length === 0 ? [6, 3] : this.pdfViewer.stickyNotesSettings.annotationSelectorSettings.selectorLineDashArray;
            if (lineDash_5.length > 2) {
                lineDash_5 = [lineDash_5[0], lineDash_5[1]];
            }
            options.dashArray = lineDash_5.toString();
        }
        else if (type === 'Stamp' && this.pdfViewer.stampSettings.annotationSelectorSettings) {
            // tslint:disable-next-line:max-line-length
            var borderColor_6 = isNullOrUndefined(this.pdfViewer.stampSettings.annotationSelectorSettings.selectionBorderColor) || this.pdfViewer.stampSettings.annotationSelectorSettings.selectionBorderColor === '' ? '#0000ff' : this.pdfViewer.stampSettings.annotationSelectorSettings.selectionBorderColor;
            options.stroke = borderColor_6;
            // tslint:disable-next-line:max-line-length
            var thickness = isNullOrUndefined(this.pdfViewer.stampSettings.annotationSelectorSettings.selectionBorderThickness) ? 1 : this.pdfViewer.stampSettings.annotationSelectorSettings.selectionBorderThickness;
            options.strokeWidth = thickness;
            // tslint:disable-next-line:max-line-length
            var lineDash_6 = isNullOrUndefined(this.pdfViewer.stampSettings.annotationSelectorSettings.selectorLineDashArray) || this.pdfViewer.stampSettings.annotationSelectorSettings.selectorLineDashArray.length === 0 ? [4] : this.pdfViewer.stampSettings.annotationSelectorSettings.selectorLineDashArray;
            if (lineDash_6.length > 2) {
                lineDash_6 = [lineDash_6[0], lineDash_6[1]];
            }
            options.dashArray = lineDash_6.toString();
        }
    };
    /**
     * @private
     */
    Drawing.prototype.renderCircularHandle = function (id, selector, cx, cy, canvas, visible, enableSelector, t, connected, canMask, ariaLabel, count, className, currentSelector) {
        var wrapper = selector;
        var radius = 7;
        var newPoint = { x: cx, y: cy };
        t = t || { scale: 1, tx: 0, ty: 0 };
        if (wrapper.rotateAngle !== 0 || wrapper.parentTransform !== 0) {
            var matrix = identityMatrix();
            rotateMatrix(matrix, wrapper.rotateAngle + wrapper.parentTransform, wrapper.offsetX, wrapper.offsetY);
            newPoint = transformPointByMatrix(matrix, newPoint);
        }
        var options = getBaseShapeAttributes(wrapper);
        var shapeType;
        if (this.pdfViewer.selectedItems.annotations[0].measureType) {
            shapeType = this.pdfViewer.selectedItems.annotations[0].measureType;
        }
        else {
            shapeType = this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType;
        }
        this.getResizerColors(shapeType, options, currentSelector, t);
        this.getShapeSize(shapeType, options, currentSelector, t);
        options.strokeWidth = 1;
        if (count !== undefined) {
            radius = 5;
            options.id = 'segmentEnd_' + count;
        }
        options.centerX = (newPoint.x + t.tx) * t.scale;
        options.centerY = (newPoint.y + t.ty) * t.scale;
        options.angle = 0;
        options.id = id;
        options.visible = visible;
        options.class = className;
        options.opacity = 1;
        if (connected) {
            options.class += ' e-connected';
        }
        if (canMask) {
            options.visible = false;
        }
        options.x = (newPoint.x * t.scale) - (options.width / 2);
        options.y = (newPoint.y * t.scale) - (options.height / 2);
        var parentSvg = this.getParentSvg(selector, 'selector');
        if (this.getShape(shapeType, currentSelector) === 'Square') {
            // tslint:disable-next-line:max-line-length
            this.svgRenderer.drawRectangle(canvas, options, id, undefined, true, parentSvg);
        }
        else if (this.getShape(shapeType, currentSelector) === 'Circle') {
            // tslint:disable-next-line:max-line-length
            this.svgRenderer.drawCircle(canvas, options, 1);
        }
    };
    /**
     * @private
     */
    // tslint:disable-next-line
    Drawing.prototype.getShapeSize = function (type, options, currentSelector, t) {
        if (currentSelector && typeof (currentSelector) !== 'object' && currentSelector !== '') {
            // tslint:disable-next-line
            var annotationSelector = JSON.parse(currentSelector);
            // tslint:disable-next-line:max-line-length
            options.radius = (isNullOrUndefined(annotationSelector.resizerSize) || annotationSelector.resizerSize === 8 ? 8 : annotationSelector.resizerSize) / 2;
            // tslint:disable-next-line:max-line-length
            options.width = (isNullOrUndefined(annotationSelector.resizerSize) || annotationSelector.resizerSize === 8 ? 8 : annotationSelector.resizerSize) * t.scale;
            // tslint:disable-next-line:max-line-length
            options.height = (isNullOrUndefined(annotationSelector.resizerSize) || annotationSelector.resizerSize === 8 ? 8 : annotationSelector.resizerSize) * t.scale;
        }
        else {
            // tslint:disable-next-line
            var annotationSelector = this.pdfViewer.annotationSelectorSettings;
            // tslint:disable-next-line:max-line-length
            options.radius = (isNullOrUndefined(annotationSelector.resizerSize) || annotationSelector.resizerSize === 8 ? 8 : annotationSelector.resizerSize) / 2;
            // tslint:disable-next-line:max-line-length
            options.width = (isNullOrUndefined(annotationSelector.resizerSize) || annotationSelector.resizerSize === 8 ? 8 : annotationSelector.resizerSize) * t.scale;
            // tslint:disable-next-line:max-line-length
            options.height = (isNullOrUndefined(annotationSelector.resizerSize) || annotationSelector.resizerSize === 8 ? 8 : annotationSelector.resizerSize) * t.scale;
            if (type === 'Line' && this.pdfViewer.lineSettings.annotationSelectorSettings) {
                // tslint:disable-next-line:max-line-length
                options.radius = (isNullOrUndefined(this.pdfViewer.lineSettings.annotationSelectorSettings.resizerSize) || this.pdfViewer.lineSettings.annotationSelectorSettings.resizerSize === 8 ? 8 : this.pdfViewer.lineSettings.annotationSelectorSettings.resizerSize) / 2;
                // tslint:disable-next-line:max-line-length
                options.width = (isNullOrUndefined(this.pdfViewer.lineSettings.annotationSelectorSettings.resizerSize) || this.pdfViewer.lineSettings.annotationSelectorSettings.resizerSize === 8 ? 8 : this.pdfViewer.lineSettings.annotationSelectorSettings.resizerSize) * t.scale;
                // tslint:disable-next-line:max-line-length
                options.height = (isNullOrUndefined(this.pdfViewer.lineSettings.annotationSelectorSettings.resizerSize) || this.pdfViewer.lineSettings.annotationSelectorSettings.resizerSize === 8 ? 8 : this.pdfViewer.lineSettings.annotationSelectorSettings.resizerSize) * t.scale;
            }
            else if (type === 'LineWidthArrowHead' && this.pdfViewer.arrowSettings.annotationSelectorSettings) {
                // tslint:disable-next-line:max-line-length
                options.radius = (isNullOrUndefined(this.pdfViewer.arrowSettings.annotationSelectorSettings.resizerSize) || this.pdfViewer.arrowSettings.annotationSelectorSettings.resizerSize === 8 ? 8 : this.pdfViewer.arrowSettings.annotationSelectorSettings.resizerSize) / 2;
                // tslint:disable-next-line:max-line-length
                options.width = (isNullOrUndefined(this.pdfViewer.arrowSettings.annotationSelectorSettings.resizerSize) || this.pdfViewer.arrowSettings.annotationSelectorSettings.resizerSize === 8 ? 8 : this.pdfViewer.arrowSettings.annotationSelectorSettings.resizerSize) * t.scale;
                // tslint:disable-next-line:max-line-length
                options.height = (isNullOrUndefined(this.pdfViewer.arrowSettings.annotationSelectorSettings.resizerSize) || this.pdfViewer.arrowSettings.annotationSelectorSettings.resizerSize === 8 ? 8 : this.pdfViewer.arrowSettings.annotationSelectorSettings.resizerSize) * t.scale;
            }
            else if (type === 'Rectangle' && this.pdfViewer.rectangleSettings.annotationSelectorSettings) {
                // tslint:disable-next-line:max-line-length
                options.radius = (isNullOrUndefined(this.pdfViewer.rectangleSettings.annotationSelectorSettings.resizerSize) || this.pdfViewer.rectangleSettings.annotationSelectorSettings.resizerSize === 8 ? 8 : this.pdfViewer.rectangleSettings.annotationSelectorSettings.resizerSize) / 2;
                // tslint:disable-next-line:max-line-length
                options.width = (isNullOrUndefined(this.pdfViewer.rectangleSettings.annotationSelectorSettings.resizerSize) || this.pdfViewer.rectangleSettings.annotationSelectorSettings.resizerSize === 8 ? 8 : this.pdfViewer.rectangleSettings.annotationSelectorSettings.resizerSize) * t.scale;
                // tslint:disable-next-line:max-line-length
                options.height = (isNullOrUndefined(this.pdfViewer.rectangleSettings.annotationSelectorSettings.resizerSize) || this.pdfViewer.rectangleSettings.annotationSelectorSettings.resizerSize === 8 ? 8 : this.pdfViewer.rectangleSettings.annotationSelectorSettings.resizerSize) * t.scale;
            }
            else if (type === 'Ellipse' && this.pdfViewer.circleSettings.annotationSelectorSettings) {
                // tslint:disable-next-line:max-line-length
                options.radius = (isNullOrUndefined(this.pdfViewer.circleSettings.annotationSelectorSettings.resizerSize) || this.pdfViewer.circleSettings.annotationSelectorSettings.resizerSize === 8 ? 8 : this.pdfViewer.circleSettings.annotationSelectorSettings.resizerSize) / 2;
                // tslint:disable-next-line:max-line-length
                options.width = (isNullOrUndefined(this.pdfViewer.circleSettings.annotationSelectorSettings.resizerSize) || this.pdfViewer.circleSettings.annotationSelectorSettings.resizerSize === 8 ? 8 : this.pdfViewer.circleSettings.annotationSelectorSettings.resizerSize) * t.scale;
                // tslint:disable-next-line:max-line-length
                options.height = (isNullOrUndefined(this.pdfViewer.circleSettings.annotationSelectorSettings.resizerSize) || this.pdfViewer.circleSettings.annotationSelectorSettings.resizerSize === 8 ? 8 : this.pdfViewer.circleSettings.annotationSelectorSettings.resizerSize) * t.scale;
            }
            else if (type === 'Distance' && this.pdfViewer.distanceSettings.annotationSelectorSettings) {
                // tslint:disable-next-line:max-line-length
                options.radius = (isNullOrUndefined(this.pdfViewer.distanceSettings.annotationSelectorSettings.resizerSize) || this.pdfViewer.distanceSettings.annotationSelectorSettings.resizerSize === 8 ? 8 : this.pdfViewer.distanceSettings.annotationSelectorSettings.resizerSize) / 2;
                // tslint:disable-next-line:max-line-length
                options.width = (isNullOrUndefined(this.pdfViewer.distanceSettings.annotationSelectorSettings.resizerSize) || this.pdfViewer.distanceSettings.annotationSelectorSettings.resizerSize === 8 ? 8 : this.pdfViewer.distanceSettings.annotationSelectorSettings.resizerSize) * t.scale;
                // tslint:disable-next-line:max-line-length
                options.height = (isNullOrUndefined(this.pdfViewer.distanceSettings.annotationSelectorSettings.resizerSize) || this.pdfViewer.distanceSettings.annotationSelectorSettings.resizerSize === 8 ? 8 : this.pdfViewer.distanceSettings.annotationSelectorSettings.resizerSize) * t.scale;
            }
            else if (type === 'Polygon' && this.pdfViewer.polygonSettings.annotationSelectorSettings) {
                // tslint:disable-next-line:max-line-length
                options.radius = (isNullOrUndefined(this.pdfViewer.polygonSettings.annotationSelectorSettings.resizerSize) || this.pdfViewer.polygonSettings.annotationSelectorSettings.resizerSize === 8 ? 8 : this.pdfViewer.polygonSettings.annotationSelectorSettings.resizerSize) / 2;
                // tslint:disable-next-line:max-line-length
                options.width = (isNullOrUndefined(this.pdfViewer.polygonSettings.annotationSelectorSettings.resizerSize) || this.pdfViewer.polygonSettings.annotationSelectorSettings.resizerSize === 8 ? 8 : this.pdfViewer.polygonSettings.annotationSelectorSettings.resizerSize) * t.scale;
                // tslint:disable-next-line:max-line-length
                options.height = (isNullOrUndefined(this.pdfViewer.polygonSettings.annotationSelectorSettings.resizerSize) || this.pdfViewer.polygonSettings.annotationSelectorSettings.resizerSize === 8 ? 8 : this.pdfViewer.polygonSettings.annotationSelectorSettings.resizerSize) * t.scale;
            }
            else if (type === 'Radius' && this.pdfViewer.radiusSettings.annotationSelectorSettings) {
                // tslint:disable-next-line:max-line-length
                options.radius = (isNullOrUndefined(this.pdfViewer.radiusSettings.annotationSelectorSettings.resizerSize) || this.pdfViewer.radiusSettings.annotationSelectorSettings.resizerSize === 8 ? 8 : this.pdfViewer.radiusSettings.annotationSelectorSettings.resizerSize) / 2;
                // tslint:disable-next-line:max-line-length
                options.width = (isNullOrUndefined(this.pdfViewer.radiusSettings.annotationSelectorSettings.resizerSize) || this.pdfViewer.radiusSettings.annotationSelectorSettings.resizerSize === 8 ? 8 : this.pdfViewer.radiusSettings.annotationSelectorSettings.resizerSize) * t.scale;
                // tslint:disable-next-line:max-line-length
                options.height = (isNullOrUndefined(this.pdfViewer.radiusSettings.annotationSelectorSettings.resizerSize) || this.pdfViewer.radiusSettings.annotationSelectorSettings.resizerSize === 8 ? 8 : this.pdfViewer.radiusSettings.annotationSelectorSettings.resizerSize) * t.scale;
            }
            else if (type === 'Stamp' && this.pdfViewer.stampSettings.annotationSelectorSettings) {
                // tslint:disable-next-line:max-line-length
                options.radius = (isNullOrUndefined(this.pdfViewer.stampSettings.annotationSelectorSettings.resizerSize) || this.pdfViewer.stampSettings.annotationSelectorSettings.resizerSize === 8 ? 8 : this.pdfViewer.stampSettings.annotationSelectorSettings.resizerSize) / 2;
                // tslint:disable-next-line:max-line-length
                options.width = (isNullOrUndefined(this.pdfViewer.stampSettings.annotationSelectorSettings.resizerSize) || this.pdfViewer.stampSettings.annotationSelectorSettings.resizerSize === 8 ? 8 : this.pdfViewer.stampSettings.annotationSelectorSettings.resizerSize) * t.scale;
                // tslint:disable-next-line:max-line-length
                options.height = (isNullOrUndefined(this.pdfViewer.stampSettings.annotationSelectorSettings.resizerSize) || this.pdfViewer.stampSettings.annotationSelectorSettings.resizerSize === 8 ? 8 : this.pdfViewer.stampSettings.annotationSelectorSettings.resizerSize) * t.scale;
            }
            else if (type === 'FreeText' && this.pdfViewer.freeTextSettings.annotationSelectorSettings) {
                // tslint:disable-next-line:max-line-length
                options.radius = (isNullOrUndefined(this.pdfViewer.freeTextSettings.annotationSelectorSettings.resizerSize) || this.pdfViewer.freeTextSettings.annotationSelectorSettings.resizerSize === 8 ? 8 : this.pdfViewer.freeTextSettings.annotationSelectorSettings.resizerSize) / 2;
                // tslint:disable-next-line:max-line-length
                options.width = (isNullOrUndefined(this.pdfViewer.freeTextSettings.annotationSelectorSettings.resizerSize) || this.pdfViewer.freeTextSettings.annotationSelectorSettings.resizerSize === 8 ? 8 : this.pdfViewer.freeTextSettings.annotationSelectorSettings.resizerSize) * t.scale;
                // tslint:disable-next-line:max-line-length
                options.height = (isNullOrUndefined(this.pdfViewer.freeTextSettings.annotationSelectorSettings.resizerSize) || this.pdfViewer.freeTextSettings.annotationSelectorSettings.resizerSize === 8 ? 8 : this.pdfViewer.freeTextSettings.annotationSelectorSettings.resizerSize) * t.scale;
            }
            else if (type === 'HandWrittenSignature' && this.pdfViewer.handWrittenSignatureSettings.annotationSelectorSettings) {
                // tslint:disable-next-line:max-line-length
                options.radius = (isNullOrUndefined(this.pdfViewer.handWrittenSignatureSettings.annotationSelectorSettings.resizerSize) || this.pdfViewer.handWrittenSignatureSettings.annotationSelectorSettings.resizerSize === 8 ? 8 : this.pdfViewer.handWrittenSignatureSettings.annotationSelectorSettings.resizerSize) / 2;
                // tslint:disable-next-line:max-line-length
                options.width = (isNullOrUndefined(this.pdfViewer.handWrittenSignatureSettings.annotationSelectorSettings.resizerSize) || this.pdfViewer.handWrittenSignatureSettings.annotationSelectorSettings.resizerSize === 8 ? 8 : this.pdfViewer.handWrittenSignatureSettings.annotationSelectorSettings.resizerSize) * t.scale;
                // tslint:disable-next-line:max-line-length
                options.height = (isNullOrUndefined(this.pdfViewer.handWrittenSignatureSettings.annotationSelectorSettings.resizerSize) || this.pdfViewer.handWrittenSignatureSettings.annotationSelectorSettings.resizerSize === 8 ? 8 : this.pdfViewer.handWrittenSignatureSettings.annotationSelectorSettings.resizerSize) * t.scale;
            }
            else if (type === 'Perimeter' && this.pdfViewer.perimeterSettings.annotationSelectorSettings) {
                // tslint:disable-next-line:max-line-length
                options.radius = (isNullOrUndefined(this.pdfViewer.perimeterSettings.annotationSelectorSettings.resizerSize) || this.pdfViewer.perimeterSettings.annotationSelectorSettings.resizerSize === 8 ? 8 : this.pdfViewer.perimeterSettings.annotationSelectorSettings.resizerSize) / 2;
                // tslint:disable-next-line:max-line-length
                options.width = (isNullOrUndefined(this.pdfViewer.perimeterSettings.annotationSelectorSettings.resizerSize) || this.pdfViewer.perimeterSettings.annotationSelectorSettings.resizerSize === 8 ? 8 : this.pdfViewer.perimeterSettings.annotationSelectorSettings.resizerSize) * t.scale;
                // tslint:disable-next-line:max-line-length
                options.height = (isNullOrUndefined(this.pdfViewer.perimeterSettings.annotationSelectorSettings.resizerSize) || this.pdfViewer.perimeterSettings.annotationSelectorSettings.resizerSize === 8 ? 8 : this.pdfViewer.perimeterSettings.annotationSelectorSettings.resizerSize) * t.scale;
            }
            else if (type === 'Area' && this.pdfViewer.areaSettings.annotationSelectorSettings) {
                // tslint:disable-next-line:max-line-length
                options.radius = (isNullOrUndefined(this.pdfViewer.areaSettings.annotationSelectorSettings.resizerSize) || this.pdfViewer.areaSettings.annotationSelectorSettings.resizerSize === 8 ? 8 : this.pdfViewer.areaSettings.annotationSelectorSettings.resizerSize) / 2;
                // tslint:disable-next-line:max-line-length
                options.width = (isNullOrUndefined(this.pdfViewer.areaSettings.annotationSelectorSettings.resizerSize) || this.pdfViewer.areaSettings.annotationSelectorSettings.resizerSize === 8 ? 8 : this.pdfViewer.areaSettings.annotationSelectorSettings.resizerSize) * t.scale;
                // tslint:disable-next-line:max-line-length
                options.height = (isNullOrUndefined(this.pdfViewer.areaSettings.annotationSelectorSettings.resizerSize) || this.pdfViewer.areaSettings.annotationSelectorSettings.resizerSize === 8 ? 8 : this.pdfViewer.areaSettings.annotationSelectorSettings.resizerSize) * t.scale;
            }
            else if (type === 'Volume' && this.pdfViewer.volumeSettings.annotationSelectorSettings) {
                // tslint:disable-next-line:max-line-length
                options.radius = (isNullOrUndefined(this.pdfViewer.volumeSettings.annotationSelectorSettings.resizerSize) || this.pdfViewer.volumeSettings.annotationSelectorSettings.resizerSize === 8 ? 8 : this.pdfViewer.volumeSettings.annotationSelectorSettings.resizerSize) / 2;
                // tslint:disable-next-line:max-line-length
                options.width = (isNullOrUndefined(this.pdfViewer.volumeSettings.annotationSelectorSettings.resizerSize) || this.pdfViewer.volumeSettings.annotationSelectorSettings.resizerSize === 8 ? 8 : this.pdfViewer.volumeSettings.annotationSelectorSettings.resizerSize) * t.scale;
                // tslint:disable-next-line:max-line-length
                options.height = (isNullOrUndefined(this.pdfViewer.volumeSettings.annotationSelectorSettings.resizerSize) || this.pdfViewer.volumeSettings.annotationSelectorSettings.resizerSize === 8 ? 8 : this.pdfViewer.volumeSettings.annotationSelectorSettings.resizerSize) * t.scale;
            }
            else if (type === 'Ink' && this.pdfViewer.inkAnnotationSettings.annotationSelectorSettings) {
                // tslint:disable-next-line:max-line-length
                options.radius = (isNullOrUndefined(this.pdfViewer.inkAnnotationSettings.annotationSelectorSettings.resizerSize) || this.pdfViewer.inkAnnotationSettings.annotationSelectorSettings.resizerSize === 8 ? 8 : this.pdfViewer.inkAnnotationSettings.annotationSelectorSettings.resizerSize) / 2;
                // tslint:disable-next-line:max-line-length
                options.width = (isNullOrUndefined(this.pdfViewer.inkAnnotationSettings.annotationSelectorSettings.resizerSize) || this.pdfViewer.inkAnnotationSettings.annotationSelectorSettings.resizerSize === 8 ? 8 : this.pdfViewer.inkAnnotationSettings.annotationSelectorSettings.resizerSize) * t.scale;
                // tslint:disable-next-line:max-line-length
                options.height = (isNullOrUndefined(this.pdfViewer.inkAnnotationSettings.annotationSelectorSettings.resizerSize) || this.pdfViewer.inkAnnotationSettings.annotationSelectorSettings.resizerSize === 8 ? 8 : this.pdfViewer.inkAnnotationSettings.annotationSelectorSettings.resizerSize) * t.scale;
            }
        }
    };
    /**
     * @private
     */
    // tslint:disable-next-line
    Drawing.prototype.getShape = function (type, currentSelector) {
        // tslint:disable-next-line
        var shapeType;
        {
            if (currentSelector && typeof (currentSelector) !== 'object' && currentSelector !== '') {
                // tslint:disable-next-line
                var annotationSelector = JSON.parse(currentSelector);
                // tslint:disable-next-line:max-line-length
                shapeType = isNullOrUndefined(annotationSelector.resizerShape) || annotationSelector.resizerShape === 'Square' ? 'Square' : annotationSelector.resizerShape;
            }
            else {
                // tslint:disable-next-line
                var annotationSelector = this.pdfViewer.annotationSelectorSettings;
                // tslint:disable-next-line:max-line-length
                shapeType = isNullOrUndefined(annotationSelector.resizerShape) || annotationSelector.resizerShape === 'Square' ? 'Square' : annotationSelector.resizerShape;
                if (type === 'Line' && this.pdfViewer.lineSettings.annotationSelectorSettings) {
                    // tslint:disable-next-line:max-line-length
                    shapeType = isNullOrUndefined(this.pdfViewer.lineSettings.annotationSelectorSettings.resizerShape) || this.pdfViewer.lineSettings.annotationSelectorSettings.resizerShape === 'Square' ? 'Square' : this.pdfViewer.lineSettings.annotationSelectorSettings.resizerShape;
                }
                else if (type === 'LineWidthArrowHead' && this.pdfViewer.arrowSettings.annotationSelectorSettings) {
                    // tslint:disable-next-line:max-line-length
                    shapeType = isNullOrUndefined(this.pdfViewer.arrowSettings.annotationSelectorSettings.resizerShape) || this.pdfViewer.arrowSettings.annotationSelectorSettings.resizerShape === 'Square' ? 'Square' : this.pdfViewer.arrowSettings.annotationSelectorSettings.resizerShape;
                }
                else if (type === 'Rectangle' && this.pdfViewer.rectangleSettings.annotationSelectorSettings) {
                    // tslint:disable-next-line:max-line-length
                    shapeType = isNullOrUndefined(this.pdfViewer.rectangleSettings.annotationSelectorSettings.resizerShape) || this.pdfViewer.rectangleSettings.annotationSelectorSettings.resizerShape === 'Square' ? 'Square' : this.pdfViewer.rectangleSettings.annotationSelectorSettings.resizerShape;
                }
                else if (type === 'Ellipse' && this.pdfViewer.circleSettings.annotationSelectorSettings) {
                    // tslint:disable-next-line:max-line-length
                    shapeType = isNullOrUndefined(this.pdfViewer.circleSettings.annotationSelectorSettings.resizerShape) || this.pdfViewer.circleSettings.annotationSelectorSettings.resizerShape === 'Square' ? 'Square' : this.pdfViewer.circleSettings.annotationSelectorSettings.resizerShape;
                }
                else if (type === 'Polygon' && this.pdfViewer.polygonSettings.annotationSelectorSettings) {
                    // tslint:disable-next-line:max-line-length
                    shapeType = isNullOrUndefined(this.pdfViewer.polygonSettings.annotationSelectorSettings.resizerShape) || this.pdfViewer.polygonSettings.annotationSelectorSettings.resizerShape === 'Square' ? 'Square' : this.pdfViewer.polygonSettings.annotationSelectorSettings.resizerShape;
                }
                else if (type === 'Distance' && this.pdfViewer.distanceSettings.annotationSelectorSettings) {
                    // tslint:disable-next-line:max-line-length
                    shapeType = isNullOrUndefined(this.pdfViewer.distanceSettings.annotationSelectorSettings.resizerShape) || this.pdfViewer.distanceSettings.annotationSelectorSettings.resizerShape === 'Square' ? 'Square' : this.pdfViewer.distanceSettings.annotationSelectorSettings.resizerShape;
                }
                else if (type === 'Radius' && this.pdfViewer.radiusSettings.annotationSelectorSettings) {
                    // tslint:disable-next-line:max-line-length
                    shapeType = isNullOrUndefined(this.pdfViewer.radiusSettings.annotationSelectorSettings.resizerShape) || this.pdfViewer.radiusSettings.annotationSelectorSettings.resizerShape === 'Square' ? 'Square' : this.pdfViewer.radiusSettings.annotationSelectorSettings.resizerShape;
                }
                else if (type === 'Stamp' && this.pdfViewer.stampSettings.annotationSelectorSettings) {
                    // tslint:disable-next-line:max-line-length
                    shapeType = isNullOrUndefined(this.pdfViewer.stampSettings.annotationSelectorSettings.resizerShape) || this.pdfViewer.stampSettings.annotationSelectorSettings.resizerShape === 'Square' ? 'Square' : this.pdfViewer.stampSettings.annotationSelectorSettings.resizerShape;
                }
                else if (type === 'FreeText' && this.pdfViewer.freeTextSettings.annotationSelectorSettings) {
                    // tslint:disable-next-line:max-line-length
                    shapeType = isNullOrUndefined(this.pdfViewer.freeTextSettings.annotationSelectorSettings.resizerShape) || this.pdfViewer.freeTextSettings.annotationSelectorSettings.resizerShape === 'Square' ? 'Square' : this.pdfViewer.freeTextSettings.annotationSelectorSettings.resizerShape;
                }
                else if (type === 'HandWrittenSignature' && this.pdfViewer.handWrittenSignatureSettings && this.pdfViewer.handWrittenSignatureSettings.annotationSelectorSettings) {
                    // tslint:disable-next-line:max-line-length
                    shapeType = isNullOrUndefined(this.pdfViewer.handWrittenSignatureSettings.annotationSelectorSettings.resizerShape) || this.pdfViewer.handWrittenSignatureSettings.annotationSelectorSettings.resizerShape === 'Square' ? 'Square' : this.pdfViewer.handWrittenSignatureSettings.annotationSelectorSettings.resizerShape;
                }
                else if (type === 'Perimeter' && this.pdfViewer.perimeterSettings.annotationSelectorSettings) {
                    // tslint:disable-next-line:max-line-length
                    shapeType = isNullOrUndefined(this.pdfViewer.perimeterSettings.annotationSelectorSettings.resizerShape) || this.pdfViewer.perimeterSettings.annotationSelectorSettings.resizerShape === 'Square' ? 'Square' : this.pdfViewer.perimeterSettings.annotationSelectorSettings.resizerShape;
                }
                else if (type === 'Area' && this.pdfViewer.areaSettings.annotationSelectorSettings) {
                    // tslint:disable-next-line:max-line-length
                    shapeType = isNullOrUndefined(this.pdfViewer.areaSettings.annotationSelectorSettings.resizerShape) || this.pdfViewer.areaSettings.annotationSelectorSettings.resizerShape === 'Square' ? 'Square' : this.pdfViewer.areaSettings.annotationSelectorSettings.resizerShape;
                }
                else if (type === 'Volume' && this.pdfViewer.volumeSettings.annotationSelectorSettings) {
                    // tslint:disable-next-line:max-line-length
                    shapeType = isNullOrUndefined(this.pdfViewer.volumeSettings.annotationSelectorSettings.resizerShape) || this.pdfViewer.volumeSettings.annotationSelectorSettings.resizerShape === 'Square' ? 'Square' : this.pdfViewer.volumeSettings.annotationSelectorSettings.resizerShape;
                }
                else if (type === 'Ink' && this.pdfViewer.inkAnnotationSettings.annotationSelectorSettings) {
                    // tslint:disable-next-line:max-line-length
                    shapeType = isNullOrUndefined(this.pdfViewer.inkAnnotationSettings.annotationSelectorSettings.resizerShape) || this.pdfViewer.inkAnnotationSettings.annotationSelectorSettings.resizerShape === 'Square' ? 'Square' : this.pdfViewer.inkAnnotationSettings.annotationSelectorSettings.resizerShape;
                }
            }
            return shapeType;
        }
    };
    /**
     * @private
     */
    // tslint:disable-next-line
    Drawing.prototype.getResizerColors = function (type, options, currentSelector, t) {
        if (currentSelector && typeof (currentSelector) !== 'object' && currentSelector !== '') {
            // tslint:disable-next-line
            var annotationSelector = JSON.parse(currentSelector);
            // tslint:disable-next-line:max-line-length
            options.stroke = isNullOrUndefined(annotationSelector.resizerBorderColor) || annotationSelector.resizerBorderColor === 'black' ? 'black' : annotationSelector.resizerBorderColor;
            // tslint:disable-next-line:max-line-length
            options.fill = isNullOrUndefined(annotationSelector.resizerFillColor) || annotationSelector.resizerFillColor === '#FF4081' ? '#FF4081' : annotationSelector.resizerFillColor;
        }
        else {
            // tslint:disable-next-line
            var annotationSelector = this.pdfViewer.annotationSelectorSettings;
            // tslint:disable-next-line:max-line-length
            options.stroke = isNullOrUndefined(annotationSelector.resizerBorderColor) || annotationSelector.resizerBorderColor === 'black' ? 'black' : annotationSelector.resizerBorderColor;
            // tslint:disable-next-line:max-line-length
            options.fill = isNullOrUndefined(annotationSelector.resizerFillColor) || annotationSelector.resizerFillColor === '#FF4081' ? '#FF4081' : annotationSelector.resizerFillColor;
            if (type === 'Line' && this.pdfViewer.lineSettings.annotationSelectorSettings) {
                // tslint:disable-next-line:max-line-length
                options.stroke = isNullOrUndefined(this.pdfViewer.lineSettings.annotationSelectorSettings.resizerBorderColor) || this.pdfViewer.lineSettings.annotationSelectorSettings.resizerBorderColor === 'black' ? 'black' : this.pdfViewer.lineSettings.annotationSelectorSettings.resizerBorderColor;
                // tslint:disable-next-line:max-line-length
                options.fill = isNullOrUndefined(this.pdfViewer.lineSettings.annotationSelectorSettings.resizerFillColor) || this.pdfViewer.lineSettings.annotationSelectorSettings.resizerFillColor === '#FF4081' ? '#FF4081' : this.pdfViewer.lineSettings.annotationSelectorSettings.resizerFillColor;
            }
            else if (type === 'LineWidthArrowHead' && this.pdfViewer.arrowSettings.annotationSelectorSettings) {
                // tslint:disable-next-line:max-line-length
                options.stroke = isNullOrUndefined(this.pdfViewer.arrowSettings.annotationSelectorSettings.resizerBorderColor) || this.pdfViewer.arrowSettings.annotationSelectorSettings.resizerBorderColor === 'black' ? 'black' : this.pdfViewer.arrowSettings.annotationSelectorSettings.resizerBorderColor;
                // tslint:disable-next-line:max-line-length
                options.fill = isNullOrUndefined(this.pdfViewer.arrowSettings.annotationSelectorSettings.resizerFillColor) || this.pdfViewer.arrowSettings.annotationSelectorSettings.resizerFillColor === '#FF4081' ? '#FF4081' : this.pdfViewer.arrowSettings.annotationSelectorSettings.resizerFillColor;
            }
            else if (type === 'Rectangle' && this.pdfViewer.rectangleSettings.annotationSelectorSettings) {
                // tslint:disable-next-line:max-line-length
                options.stroke = isNullOrUndefined(this.pdfViewer.rectangleSettings.annotationSelectorSettings.resizerBorderColor) || this.pdfViewer.rectangleSettings.annotationSelectorSettings.resizerBorderColor === 'black' ? 'black' : this.pdfViewer.rectangleSettings.annotationSelectorSettings.resizerBorderColor;
                // tslint:disable-next-line:max-line-length
                options.fill = isNullOrUndefined(this.pdfViewer.rectangleSettings.annotationSelectorSettings.resizerFillColor) || this.pdfViewer.rectangleSettings.annotationSelectorSettings.resizerFillColor === '#FF4081' ? '#FF4081' : this.pdfViewer.rectangleSettings.annotationSelectorSettings.resizerFillColor;
            }
            else if (type === 'Ellipse' && this.pdfViewer.circleSettings.annotationSelectorSettings) {
                // tslint:disable-next-line:max-line-length
                options.stroke = isNullOrUndefined(this.pdfViewer.circleSettings.annotationSelectorSettings.resizerBorderColor) || this.pdfViewer.circleSettings.annotationSelectorSettings.resizerBorderColor === 'black' ? 'black' : this.pdfViewer.circleSettings.annotationSelectorSettings.resizerBorderColor;
                // tslint:disable-next-line:max-line-length
                options.fill = isNullOrUndefined(this.pdfViewer.circleSettings.annotationSelectorSettings.resizerFillColor) || this.pdfViewer.circleSettings.annotationSelectorSettings.resizerFillColor === '#FF4081' ? '#FF4081' : this.pdfViewer.circleSettings.annotationSelectorSettings.resizerFillColor;
            }
            else if (type === 'Distance' && this.pdfViewer.distanceSettings.annotationSelectorSettings) {
                // tslint:disable-next-line:max-line-length
                options.stroke = isNullOrUndefined(this.pdfViewer.distanceSettings.annotationSelectorSettings.resizerBorderColor) || this.pdfViewer.distanceSettings.annotationSelectorSettings.resizerBorderColor === 'black' ? 'black' : this.pdfViewer.distanceSettings.annotationSelectorSettings.resizerBorderColor;
                // tslint:disable-next-line:max-line-length
                options.fill = isNullOrUndefined(this.pdfViewer.distanceSettings.annotationSelectorSettings.resizerFillColor) || this.pdfViewer.distanceSettings.annotationSelectorSettings.resizerFillColor === '#FF4081' ? '#FF4081' : this.pdfViewer.distanceSettings.annotationSelectorSettings.resizerFillColor;
            }
            else if (type === 'Polygon' && this.pdfViewer.polygonSettings.annotationSelectorSettings) {
                // tslint:disable-next-line:max-line-length
                options.stroke = isNullOrUndefined(this.pdfViewer.polygonSettings.annotationSelectorSettings.resizerBorderColor) || this.pdfViewer.polygonSettings.annotationSelectorSettings.resizerBorderColor === 'black' ? 'black' : this.pdfViewer.polygonSettings.annotationSelectorSettings.resizerBorderColor;
                // tslint:disable-next-line:max-line-length
                options.fill = isNullOrUndefined(this.pdfViewer.polygonSettings.annotationSelectorSettings.resizerFillColor) || this.pdfViewer.polygonSettings.annotationSelectorSettings.resizerFillColor === '#FF4081' ? '#FF4081' : this.pdfViewer.polygonSettings.annotationSelectorSettings.resizerFillColor;
            }
            else if (type === 'Radius' && this.pdfViewer.radiusSettings.annotationSelectorSettings) {
                // tslint:disable-next-line:max-line-length
                options.stroke = isNullOrUndefined(this.pdfViewer.radiusSettings.annotationSelectorSettings.resizerBorderColor) || this.pdfViewer.radiusSettings.annotationSelectorSettings.resizerBorderColor === 'black' ? 'black' : this.pdfViewer.radiusSettings.annotationSelectorSettings.resizerBorderColor;
                // tslint:disable-next-line:max-line-length
                options.fill = isNullOrUndefined(this.pdfViewer.radiusSettings.annotationSelectorSettings.resizerFillColor) || this.pdfViewer.radiusSettings.annotationSelectorSettings.resizerFillColor === '#FF4081' ? '#FF4081' : this.pdfViewer.radiusSettings.annotationSelectorSettings.resizerFillColor;
            }
            else if (type === 'Stamp' && this.pdfViewer.stampSettings.annotationSelectorSettings) {
                // tslint:disable-next-line:max-line-length
                options.stroke = isNullOrUndefined(this.pdfViewer.stampSettings.annotationSelectorSettings.resizerBorderColor) || this.pdfViewer.stampSettings.annotationSelectorSettings.resizerBorderColor === 'black' ? 'black' : this.pdfViewer.stampSettings.annotationSelectorSettings.resizerBorderColor;
                // tslint:disable-next-line:max-line-length
                options.fill = isNullOrUndefined(this.pdfViewer.stampSettings.annotationSelectorSettings.resizerFillColor) || this.pdfViewer.stampSettings.annotationSelectorSettings.resizerFillColor === '#FF4081' ? '#FF4081' : this.pdfViewer.stampSettings.annotationSelectorSettings.resizerFillColor;
            }
            else if (type === 'FreeText' && this.pdfViewer.freeTextSettings.annotationSelectorSettings) {
                // tslint:disable-next-line:max-line-length
                options.stroke = isNullOrUndefined(this.pdfViewer.freeTextSettings.annotationSelectorSettings.resizerBorderColor) || this.pdfViewer.freeTextSettings.annotationSelectorSettings.resizerBorderColor === 'black' ? 'black' : this.pdfViewer.freeTextSettings.annotationSelectorSettings.resizerBorderColor;
                // tslint:disable-next-line:max-line-length
                options.fill = isNullOrUndefined(this.pdfViewer.freeTextSettings.annotationSelectorSettings.resizerFillColor) || this.pdfViewer.freeTextSettings.annotationSelectorSettings.resizerFillColor === '#FF4081' ? '#FF4081' : this.pdfViewer.freeTextSettings.annotationSelectorSettings.resizerFillColor;
            }
            else if (type === 'HandWrittenSignature' && this.pdfViewer.handWrittenSignatureSettings.annotationSelectorSettings) {
                // tslint:disable-next-line:max-line-length
                options.stroke = isNullOrUndefined(this.pdfViewer.handWrittenSignatureSettings.annotationSelectorSettings.resizerBorderColor) || this.pdfViewer.handWrittenSignatureSettings.annotationSelectorSettings.resizerBorderColor === 'black' ? 'black' : this.pdfViewer.handWrittenSignatureSettings.annotationSelectorSettings.resizerBorderColor;
                // tslint:disable-next-line:max-line-length
                options.fill = isNullOrUndefined(this.pdfViewer.handWrittenSignatureSettings.annotationSelectorSettings.resizerFillColor) || this.pdfViewer.handWrittenSignatureSettings.annotationSelectorSettings.resizerFillColor === '#FF4081' ? '#FF4081' : this.pdfViewer.handWrittenSignatureSettings.annotationSelectorSettings.resizerFillColor;
            }
            else if (type === 'Perimeter' && this.pdfViewer.perimeterSettings.annotationSelectorSettings) {
                // tslint:disable-next-line:max-line-length
                options.stroke = isNullOrUndefined(this.pdfViewer.perimeterSettings.annotationSelectorSettings.resizerBorderColor) || this.pdfViewer.perimeterSettings.annotationSelectorSettings.resizerBorderColor === 'black' ? 'black' : this.pdfViewer.perimeterSettings.annotationSelectorSettings.resizerBorderColor;
                // tslint:disable-next-line:max-line-length
                options.fill = isNullOrUndefined(this.pdfViewer.perimeterSettings.annotationSelectorSettings.resizerFillColor) || this.pdfViewer.perimeterSettings.annotationSelectorSettings.resizerFillColor === '#FF4081' ? '#FF4081' : this.pdfViewer.perimeterSettings.annotationSelectorSettings.resizerFillColor;
            }
            else if (type === 'Area' && this.pdfViewer.areaSettings.annotationSelectorSettings) {
                // tslint:disable-next-line:max-line-length
                options.stroke = isNullOrUndefined(this.pdfViewer.areaSettings.annotationSelectorSettings.resizerBorderColor) || this.pdfViewer.areaSettings.annotationSelectorSettings.resizerBorderColor === 'black' ? 'black' : this.pdfViewer.areaSettings.annotationSelectorSettings.resizerBorderColor;
                // tslint:disable-next-line:max-line-length
                options.fill = isNullOrUndefined(this.pdfViewer.areaSettings.annotationSelectorSettings.resizerFillColor) || this.pdfViewer.areaSettings.annotationSelectorSettings.resizerFillColor === '#FF4081' ? '#FF4081' : this.pdfViewer.areaSettings.annotationSelectorSettings.resizerFillColor;
            }
            else if (type === 'Volume' && this.pdfViewer.volumeSettings.annotationSelectorSettings) {
                // tslint:disable-next-line:max-line-length
                options.stroke = isNullOrUndefined(this.pdfViewer.volumeSettings.annotationSelectorSettings.resizerBorderColor) || this.pdfViewer.volumeSettings.annotationSelectorSettings.resizerBorderColor === 'black' ? 'black' : this.pdfViewer.volumeSettings.annotationSelectorSettings.resizerBorderColor;
                // tslint:disable-next-line:max-line-length
                options.fill = isNullOrUndefined(this.pdfViewer.volumeSettings.annotationSelectorSettings.resizerFillColor) || this.pdfViewer.volumeSettings.annotationSelectorSettings.resizerFillColor === '#FF4081' ? '#FF4081' : this.pdfViewer.volumeSettings.annotationSelectorSettings.resizerFillColor;
            }
            else if (type === 'Ink' && this.pdfViewer.inkAnnotationSettings.annotationSelectorSettings) {
                // tslint:disable-next-line:max-line-length
                options.stroke = isNullOrUndefined(this.pdfViewer.inkAnnotationSettings.annotationSelectorSettings.resizerBorderColor) || this.pdfViewer.inkAnnotationSettings.annotationSelectorSettings.resizerBorderColor === 'black' ? 'black' : this.pdfViewer.inkAnnotationSettings.annotationSelectorSettings.resizerBorderColor;
                // tslint:disable-next-line:max-line-length
                options.fill = isNullOrUndefined(this.pdfViewer.inkAnnotationSettings.annotationSelectorSettings.resizerFillColor) || this.pdfViewer.inkAnnotationSettings.annotationSelectorSettings.resizerFillColor === '#FF4081' ? '#FF4081' : this.pdfViewer.inkAnnotationSettings.annotationSelectorSettings.resizerFillColor;
            }
        }
    };
    /**
     * @private
     */
    Drawing.prototype.renderRotateThumb = function (wrapper, canvas, transform, selectorConstraints, canMask) {
        var element = new PathElement();
        var newPoint;
        var top = wrapper.offsetY - wrapper.actualSize.height * wrapper.pivot.y;
        var left = wrapper.offsetX - wrapper.actualSize.width * wrapper.pivot.x;
        var pivotX = left + wrapper.pivot.x * wrapper.actualSize.width;
        var pivotY = top;
        pivotX = (pivotX + transform.tx) * transform.scale;
        pivotY = (pivotY + transform.ty) * transform.scale;
        newPoint = { x: pivotX, y: pivotY - 25 };
        if (wrapper.rotateAngle !== 0 || wrapper.parentTransform !== 0) {
            var matrix = identityMatrix();
            rotateMatrix(matrix, wrapper.rotateAngle + wrapper.parentTransform, (transform.tx + wrapper.offsetX) * transform.scale, (transform.ty + wrapper.offsetY) * transform.scale);
            newPoint = transformPointByMatrix(matrix, newPoint);
        }
        var options = getBaseShapeAttributes(wrapper);
        options.stroke = 'black';
        options.strokeWidth = 1;
        options.opacity = 1;
        options.fill = '#FF4081';
        options.centerX = newPoint.x;
        options.centerY = newPoint.y;
        options.radius = 4;
        options.angle = 0;
        options.visible = true;
        options.class = 'e-diagram-rotate-handle';
        options.id = 'rotateThumb';
        // tslint:disable-next-line:max-line-length
        this.svgRenderer.drawCircle(canvas, options, ThumbsConstraints.Rotate, { 'aria-label': 'Thumb to rotate the selected object' });
    };
    /**
     * @private
     */
    Drawing.prototype.renderResizeHandle = function (element, canvas, constraints, currentZoom, canMask, enableNode, nodeConstraints, isStamp, isSticky, isPath, isFreeText, currentSelector) {
        var left = element.offsetX - element.actualSize.width * element.pivot.x;
        var top = element.offsetY - element.actualSize.height * element.pivot.y;
        var height = element.actualSize.height;
        var width = element.actualSize.width;
        var transform = { scale: currentZoom, tx: 0, ty: 0 };
        if (isStamp) {
            this.renderPivotLine(element, canvas, transform);
            this.renderRotateThumb(element, canvas, transform);
        }
        if (isFreeText) {
            isStamp = true;
        }
        this.renderBorder(element, canvas, currentSelector, transform, enableNode, nodeConstraints, true, isSticky);
        var nodeWidth = element.actualSize.width * currentZoom;
        var nodeHeight = element.actualSize.height * currentZoom;
        var shapeType = this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType;
        var resizerLocation = this.getResizerLocation(shapeType, currentSelector);
        if (resizerLocation < 1 || resizerLocation > 3) {
            resizerLocation = 3;
        }
        var isNodeShape = false;
        // tslint:disable-next-line:max-line-length
        if (this.pdfViewer.selectedItems.annotations[0] && (this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'Ellipse' || this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'Radius' || this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'Rectangle' || this.pdfViewer.selectedItems.annotations[0].shapeAnnotationType === 'Ink')) {
            isNodeShape = true;
        }
        if (!nodeConstraints && !isSticky && !isPath) {
            // tslint:disable-next-line:max-line-length
            if (isStamp || (isNodeShape && (nodeWidth >= 40 && nodeHeight >= 40) && (resizerLocation === 1 || resizerLocation === 3))) {
                //Hide corners when the size is less than 40
                this.renderCircularHandle('resizeNorthWest', element, left, top, canvas, true, constraints & ThumbsConstraints.ResizeNorthWest, transform, undefined, canMask, { 'aria-label': 'Thumb to resize the selected object on top left side direction' }, undefined, 'e-pv-diagram-resize-handle e-northwest', currentSelector);
                this.renderCircularHandle('resizeNorthEast', element, left + width, top, canvas, true, constraints & ThumbsConstraints.ResizeNorthEast, transform, undefined, canMask, { 'aria-label': 'Thumb to resize the selected object on top right side direction' }, undefined, 'e-pv-diagram-resize-handle e-northeast', currentSelector);
                this.renderCircularHandle('resizeSouthWest', element, left, top + height, canvas, true, constraints & ThumbsConstraints.ResizeSouthWest, transform, undefined, canMask, { 'aria-label': 'Thumb to resize the selected object on bottom left side direction' }, undefined, 'e-pv-diagram-resize-handle e-southwest', currentSelector);
                this.renderCircularHandle('resizeSouthEast', element, left + width, top + height, canvas, true, constraints & ThumbsConstraints.ResizeSouthEast, transform, undefined, canMask, { 'aria-label': 'Thumb to resize the selected object on bottom right side direction' }, undefined, 'e-pv-diagram-resize-handle e-southeast', currentSelector);
            }
            // tslint:disable-next-line:max-line-length
            if ((!isStamp && !isNodeShape) || (isNodeShape && (resizerLocation === 2 || resizerLocation === 3 || (!(nodeWidth >= 40 && nodeHeight >= 40) && resizerLocation === 1)))) {
                this.renderCircularHandle('resizeNorth', element, left + width / 2, top, canvas, true, constraints & ThumbsConstraints.ResizeNorth, transform, undefined, canMask, { 'aria-label': 'Thumb to resize the selected object on top side direction' }, undefined, 'e-pv-diagram-resize-handle e-north', currentSelector);
                this.renderCircularHandle('resizeSouth', element, left + width / 2, top + height, canvas, true, constraints & ThumbsConstraints.ResizeSouth, transform, undefined, canMask, { 'aria-label': 'Thumb to resize the selected object on bottom side direction' }, undefined, 'e-pv-diagram-resize-handle e-south', currentSelector);
                this.renderCircularHandle('resizeWest', element, left, top + height / 2, canvas, true, constraints & ThumbsConstraints.ResizeWest, transform, undefined, canMask, { 'aria-label': 'Thumb to resize the selected object on left side direction' }, undefined, 'e-pv-diagram-resize-handle e-west', currentSelector);
                this.renderCircularHandle('resizeEast', element, left + width, top + height / 2, canvas, true, constraints & ThumbsConstraints.ResizeEast, transform, undefined, canMask, { 'aria-label': 'Thumb to resize the selected object on right side direction' }, undefined, 'e-pv-diagram-resize-handle e-east', currentSelector);
            }
        }
    };
    /**
     * @private
     */
    // tslint:disable-next-line
    Drawing.prototype.getResizerLocation = function (type, currentSelector) {
        // tslint:disable-next-line
        var resizerLocation;
        {
            if (currentSelector && typeof (currentSelector) !== 'object' && currentSelector !== '') {
                // tslint:disable-next-line
                var annotationSelector = JSON.parse(currentSelector);
                // tslint:disable-next-line:max-line-length
                resizerLocation = isNullOrUndefined(annotationSelector.resizerLocation) || annotationSelector.resizerLocation === 3 ? 3 : annotationSelector.resizerLocation;
            }
            else {
                // tslint:disable-next-line
                var annotationSelector = this.pdfViewer.annotationSelectorSettings;
                // tslint:disable-next-line:max-line-length
                resizerLocation = isNullOrUndefined(annotationSelector.resizerLocation) || annotationSelector.resizerLocation === 3 ? 3 : annotationSelector.resizerLocation;
                if (type === 'Line' && this.pdfViewer.lineSettings.annotationSelectorSettings) {
                    // tslint:disable-next-line:max-line-length
                    resizerLocation = isNullOrUndefined(this.pdfViewer.lineSettings.annotationSelectorSettings.resizerLocation) || this.pdfViewer.lineSettings.annotationSelectorSettings.resizerLocation === 3 ? 3 : this.pdfViewer.lineSettings.annotationSelectorSettings.resizerLocation;
                }
                else if (type === 'LineWidthArrowHead' && this.pdfViewer.arrowSettings.annotationSelectorSettings) {
                    // tslint:disable-next-line:max-line-length
                    resizerLocation = isNullOrUndefined(this.pdfViewer.arrowSettings.annotationSelectorSettings.resizerLocation) || this.pdfViewer.arrowSettings.annotationSelectorSettings.resizerLocation === 3 ? 3 : this.pdfViewer.arrowSettings.annotationSelectorSettings.resizerLocation;
                }
                else if (type === 'Rectangle' && this.pdfViewer.rectangleSettings.annotationSelectorSettings) {
                    // tslint:disable-next-line:max-line-length
                    resizerLocation = isNullOrUndefined(this.pdfViewer.rectangleSettings.annotationSelectorSettings.resizerLocation) || this.pdfViewer.rectangleSettings.annotationSelectorSettings.resizerLocation === 3 ? 3 : this.pdfViewer.rectangleSettings.annotationSelectorSettings.resizerLocation;
                }
                else if (type === 'Ellipse' && this.pdfViewer.circleSettings.annotationSelectorSettings) {
                    // tslint:disable-next-line:max-line-length
                    resizerLocation = isNullOrUndefined(this.pdfViewer.circleSettings.annotationSelectorSettings.resizerLocation) || this.pdfViewer.circleSettings.annotationSelectorSettings.resizerLocation === 3 ? 3 : this.pdfViewer.circleSettings.annotationSelectorSettings.resizerLocation;
                }
                else if (type === 'Polygon' && this.pdfViewer.polygonSettings.annotationSelectorSettings) {
                    // tslint:disable-next-line:max-line-length
                    resizerLocation = isNullOrUndefined(this.pdfViewer.polygonSettings.annotationSelectorSettings.resizerLocation) || this.pdfViewer.polygonSettings.annotationSelectorSettings.resizerLocation === 3 ? 3 : this.pdfViewer.polygonSettings.annotationSelectorSettings.resizerLocation;
                }
                else if (type === 'Distance') {
                    // tslint:disable-next-line:max-line-length
                    resizerLocation = isNullOrUndefined(this.pdfViewer.distanceSettings.annotationSelectorSettings.resizerLocation) || this.pdfViewer.distanceSettings.annotationSelectorSettings.resizerLocation === 3 ? 3 : this.pdfViewer.distanceSettings.annotationSelectorSettings.resizerLocation;
                }
                else if (type === 'Radius' && this.pdfViewer.radiusSettings.annotationSelectorSettings) {
                    // tslint:disable-next-line:max-line-length
                    resizerLocation = isNullOrUndefined(this.pdfViewer.radiusSettings.annotationSelectorSettings.resizerLocation) || this.pdfViewer.radiusSettings.annotationSelectorSettings.resizerLocation === 3 ? 3 : this.pdfViewer.radiusSettings.annotationSelectorSettings.resizerLocation;
                }
                else if (type === 'Stamp' && this.pdfViewer.stampSettings.annotationSelectorSettings) {
                    // tslint:disable-next-line:max-line-length
                    resizerLocation = isNullOrUndefined(this.pdfViewer.stampSettings.annotationSelectorSettings.resizerLocation) || this.pdfViewer.stampSettings.annotationSelectorSettings.resizerLocation === 3 ? 3 : this.pdfViewer.stampSettings.annotationSelectorSettings.resizerLocation;
                }
                else if (type === 'FreeText' && this.pdfViewer.freeTextSettings.annotationSelectorSettings) {
                    // tslint:disable-next-line:max-line-length
                    resizerLocation = isNullOrUndefined(this.pdfViewer.freeTextSettings.annotationSelectorSettings.resizerLocation) || this.pdfViewer.freeTextSettings.annotationSelectorSettings.resizerLocation === 3 ? 3 : this.pdfViewer.freeTextSettings.annotationSelectorSettings.resizerLocation;
                }
                else if (type === 'HandWrittenSignature' && this.pdfViewer.handWrittenSignatureSettings.annotationSelectorSettings) {
                    // tslint:disable-next-line:max-line-length
                    resizerLocation = isNullOrUndefined(this.pdfViewer.handWrittenSignatureSettings.annotationSelectorSettings.resizerLocation) || this.pdfViewer.handWrittenSignatureSettings.annotationSelectorSettings.resizerLocation === 3 ? 3 : this.pdfViewer.handWrittenSignatureSettings.annotationSelectorSettings.resizerLocation;
                }
                else if (type === 'Ink' && this.pdfViewer.inkAnnotationSettings.annotationSelectorSettings) {
                    // tslint:disable-next-line:max-line-length
                    resizerLocation = isNullOrUndefined(this.pdfViewer.inkAnnotationSettings.annotationSelectorSettings.resizerLocation) || this.pdfViewer.inkAnnotationSettings.annotationSelectorSettings.resizerLocation === 3 ? 3 : this.pdfViewer.inkAnnotationSettings.annotationSelectorSettings.resizerLocation;
                }
            }
            return resizerLocation;
        }
    };
    /**
     * @private
     */
    Drawing.prototype.renderPivotLine = function (element, canvas, transform, selectorConstraints, canMask) {
        var wrapper = element;
        var dashArray = '2,3';
        var visible = true;
        if (canMask) {
            visible = false;
        }
        var options = getBaseShapeAttributes(wrapper, transform);
        options.fill = 'None';
        options.stroke = 'black';
        options.strokeWidth = 1;
        options.dashArray = dashArray;
        options.visible = visible;
        var scale = transform.scale;
        options.x *= scale;
        options.y *= scale;
        options.width *= scale;
        options.height *= scale;
        options.id = 'pivotLine';
        options.class = 'e-diagram-pivot-line';
        var startPoint = { x: wrapper.actualSize.width * wrapper.pivot.x * scale, y: -20 };
        var endPoint = { x: wrapper.actualSize.width * wrapper.pivot.x * scale, y: 0 };
        options.startPoint = startPoint;
        options.endPoint = endPoint;
        this.svgRenderer.drawLine(canvas, options);
    };
    /**
     * @private
     */
    Drawing.prototype.renderEndPointHandle = function (selector, canvas, constraints, transform, connectedSource, connectedTarget, isSegmentEditing, currentSelector) {
        transform = transform || { tx: 0, ty: 0, scale: 1 };
        var sourcePoint = selector.sourcePoint;
        var targetPoint = selector.targetPoint;
        var wrapper = selector.wrapper;
        var i;
        for (i = 0; i < selector.vertexPoints.length; i++) {
            var segment = selector.vertexPoints[i];
            this.renderCircularHandle(('segementThumb_' + (i + 1)), wrapper, segment.x, segment.y, canvas, true, constraints & ThumbsConstraints.ConnectorSource, transform, connectedSource, null, null, i, null, currentSelector);
        }
        var leaderCount = 0;
        if (selector.shapeAnnotationType === 'Distance') {
            for (i = 0; i < selector.wrapper.children.length; i++) {
                var segment = selector.wrapper.children[i];
                var newPoint1 = void 0;
                var angle = Point.findAngle(selector.sourcePoint, selector.targetPoint);
                if (segment.id.indexOf('leader') > -1) {
                    var center = selector.wrapper.children[0].bounds.center;
                    if (leaderCount === 0) {
                        newPoint1 = { x: selector.sourcePoint.x, y: selector.sourcePoint.y - selector.leaderHeight };
                        center = sourcePoint;
                    }
                    else {
                        newPoint1 = { x: selector.targetPoint.x, y: selector.targetPoint.y - selector.leaderHeight };
                        center = targetPoint;
                    }
                    var matrix = identityMatrix();
                    rotateMatrix(matrix, angle, center.x, center.y);
                    var rotatedPoint = transformPointByMatrix(matrix, { x: newPoint1.x, y: newPoint1.y });
                    // tslint:disable-next-line:max-line-length
                    this.renderCircularHandle(('leaderThumb_' + (i + 1)), wrapper, rotatedPoint.x, rotatedPoint.y, canvas, true, constraints & ThumbsConstraints.ConnectorSource, transform, connectedSource, null, null, i, null, currentSelector);
                    leaderCount++;
                }
            }
        }
    };
    /**
     * @private
     */
    Drawing.prototype.initSelectorWrapper = function () {
        var selectorModel = this.pdfViewer.selectedItems;
        selectorModel.init(this);
    };
    /**
     * @private
     */
    // tslint:disable-next-line
    Drawing.prototype.select = function (objArray, currentSelector, multipleSelection, preventUpdate) {
        var selectorModel = this.pdfViewer.selectedItems;
        for (var i = 0; i < objArray.length; i++) {
            // tslint:disable-next-line
            var obj = this.pdfViewer.nameTable[objArray[i]];
            if (obj) {
                if (!(obj instanceof Selector) && obj.wrapper.visible) {
                    // tslint:disable-next-line
                    var annotationSettings = void 0;
                    if (obj.annotationSettings) {
                        annotationSettings = obj.annotationSettings;
                        annotationSettings.isLock = JSON.parse(annotationSettings.isLock);
                    }
                    else {
                        annotationSettings = this.pdfViewer.annotationModule.findAnnotationSettings(obj, true);
                        obj.annotationSettings = annotationSettings;
                    }
                    var isLock = annotationSettings.isLock;
                    if (annotationSettings.isLock && this.pdfViewer.annotationModule.checkAllowedInteractions('Select', obj)) {
                        isLock = false;
                    }
                    if (!isLock) {
                        selectorModel.annotations.push(obj);
                        this.initSelectorWrapper();
                        selectorModel.wrapper.rotateAngle = selectorModel.rotateAngle = 0;
                        selectorModel.wrapper.children.push(obj.wrapper);
                        if (!preventUpdate) {
                            this.renderSelector(obj.pageIndex, currentSelector, obj, true);
                        }
                    }
                }
            }
        }
    };
    /**
     * @private
     */
    // tslint:disable-next-line
    Drawing.prototype.dragSelectedObjects = function (tx, ty, pageIndex, currentSelector, helper) {
        var obj = this.pdfViewer.selectedItems;
        this.drag(obj, tx, ty, currentSelector, helper);
        return true;
    };
    /**
     * @private
     */
    // tslint:disable-next-line
    Drawing.prototype.drag = function (obj, tx, ty, currentSelector, helper) {
        if (obj instanceof Selector) {
            if (obj.annotations.length) {
                for (var _i = 0, _a = obj.annotations; _i < _a.length; _i++) {
                    var node = _a[_i];
                    this.drag(node, tx, ty, currentSelector, helper);
                    this.renderSelector(node.pageIndex, currentSelector, helper);
                }
            }
        }
        else {
            this.dragAnnotation(obj, tx, ty);
        }
    };
    /**
     * @private
     */
    Drawing.prototype.dragAnnotation = function (obj, tx, ty) {
        var tempNode;
        var elements = [];
        // tslint:disable-next-line
        var oldValues = { x: obj.wrapper.offsetX, y: obj.wrapper.offsetY };
        obj.wrapper.offsetX += tx;
        obj.wrapper.offsetY += ty;
        if (isLineShapes(obj) || obj.shapeAnnotationType === 'Polygon') {
            if (obj.wrapper.children.length) {
                var nodes = obj.wrapper.children;
                for (var i = 0; i < nodes.length; i++) {
                    nodes[i].offsetX += tx;
                    nodes[i].offsetY += ty;
                }
            }
            this.dragControlPoint(obj, tx, ty, true);
        }
        this.nodePropertyChange(obj, { bounds: { x: obj.wrapper.offsetX, y: obj.wrapper.offsetY } });
        obj.wrapper.measureChildren = false;
        // tslint:disable-next-line
        var canvas = document.getElementById(this.pdfViewer.element.id + '_annotationCanvas_' + obj.pageIndex);
        // tslint:disable-next-line
        this.pdfViewer.renderDrawing(canvas, obj.pageIndex);
    };
    /**
     * @private
     */
    Drawing.prototype.dragControlPoint = function (obj, tx, ty, preventUpdate, segmentNumber) {
        // tslint:disable-next-line
        var connector = this.pdfViewer.nameTable[obj.id];
        for (var i = 0; i < connector.vertexPoints.length; i++) {
            (connector.vertexPoints[i]).x += tx;
            (connector.vertexPoints[i]).y += ty;
        }
        if (!preventUpdate) {
            this.updateEndPoint(connector);
        }
        return true;
    };
    /**
     * @private
     */
    Drawing.prototype.updateEndPoint = function (connector) {
        this.nodePropertyChange(connector, { vertexPoints: connector.vertexPoints });
        this.renderSelector(connector.pageIndex);
    };
    /**
     * @private
     */
    /* tslint:disable */
    Drawing.prototype.nodePropertyChange = function (actualObject, node) {
        var existingBounds = actualObject.wrapper.outerBounds;
        var existingInnerBounds = actualObject.wrapper.bounds;
        var updateConnector = false;
        var i;
        var j;
        var offsetX;
        var offsetY;
        var update;
        var tx;
        var ty;
        if (node.bounds) {
            if (node.bounds.width !== undefined) {
                actualObject.bounds.width = actualObject.wrapper.width = node.bounds.width;
            }
            if (node.bounds.height !== undefined) {
                actualObject.bounds.height = actualObject.wrapper.height = node.bounds.height;
            }
            if (node.bounds.x !== undefined) {
                actualObject.bounds.x = node.bounds.x - (actualObject.bounds.width * 0.5);
                actualObject.wrapper.offsetX = node.bounds.x;
                update = true;
                updateConnector = true;
            }
            if (node.bounds.y !== undefined) {
                actualObject.bounds.y = node.bounds.y - (actualObject.bounds.height * 0.5);
                actualObject.wrapper.offsetY = node.bounds.y;
                update = true;
                updateConnector = true;
            }
            if (node.leaderHeight !== undefined) {
                actualObject.leaderHeight = node.leaderHeight;
                this.updateConnector(actualObject, actualObject.vertexPoints);
            }
            if (actualObject.wrapper.children.length) {
                var children = actualObject.wrapper.children;
                for (var i_1 = 0; i_1 < children.length; i_1++) {
                    if (children[i_1].id) {
                        var names = children[i_1].id.split('_');
                        if (names.length && (names.indexOf('perimeter') > -1 || names.indexOf('radius') > -1)) {
                            this.setNodePosition(children[i_1], actualObject);
                        }
                        else if (names.length && (names.indexOf('srcDec') > -1)) {
                            children[i_1].offsetX = actualObject.vertexPoints[0].x;
                            children[i_1].offsetY = actualObject.vertexPoints[0].y;
                        }
                        else if (names.length && names.indexOf('tarDec') > -1) {
                            children[i_1].offsetX = actualObject.vertexPoints[actualObject.vertexPoints.length - 1].x;
                            children[i_1].offsetY = actualObject.vertexPoints[actualObject.vertexPoints.length - 1].y;
                        }
                        else if (names.length && (names.indexOf('stamp') > -1)) {
                            var ratio = 0;
                            var heightRatio = 2;
                            if (actualObject.wrapper.width != undefined && actualObject.wrapper.height != undefined) {
                                ratio = 20;
                                heightRatio = 2.9;
                            }
                            if (actualObject.isDynamicStamp) {
                                children[i_1].width = actualObject.bounds.width - ratio;
                                children[i_1].height = (actualObject.bounds.height / 2) - ratio;
                                var element = children[1];
                                var annotationSettings = this.pdfViewer.stampSettings ? this.pdfViewer.stampSettings : this.pdfViewer.annotationSettings;
                                if (annotationSettings && (annotationSettings.maxHeight || annotationSettings.maxWidth) && (actualObject.bounds.height > 60)) {
                                    if ((actualObject.bounds.height * 3) < actualObject.bounds.width) {
                                        element.style.fontSize = ((actualObject.bounds.height / 2) / heightRatio);
                                    }
                                    else {
                                        if (actualObject.bounds.height > actualObject.bounds.width) {
                                            element.style.fontSize = ((actualObject.bounds.width / 8) / heightRatio);
                                        }
                                        else if ((actualObject.bounds.height * 2) < actualObject.bounds.width) {
                                            element.style.fontSize = ((actualObject.bounds.height / 4) / heightRatio);
                                        }
                                        else {
                                            element.style.fontSize = ((actualObject.bounds.height / 6) / heightRatio);
                                        }
                                    }
                                }
                                else {
                                    element.style.fontSize = ((actualObject.bounds.height / 2) / heightRatio);
                                }
                                if (ratio != 0) {
                                    element.margin.bottom = -(children[i_1].height / 2);
                                }
                            }
                            else {
                                children[i_1].width = actualObject.bounds.width - ratio;
                                children[i_1].height = actualObject.bounds.height - ratio;
                            }
                            children[i_1].offsetX = actualObject.wrapper.offsetX;
                            children[i_1].offsetY = actualObject.wrapper.offsetX;
                            children[i_1].isDirt = true;
                        }
                    }
                }
            }
        }
        if (node.sourceDecoraterShapes !== undefined) {
            actualObject.sourceDecoraterShapes = node.sourceDecoraterShapes;
            this.updateConnector(actualObject, actualObject.vertexPoints);
        }
        if (node.taregetDecoraterShapes !== undefined) {
            actualObject.taregetDecoraterShapes = node.taregetDecoraterShapes;
            update = true;
            this.updateConnector(actualObject, actualObject.vertexPoints);
        }
        if (node.fillColor !== undefined) {
            actualObject.fillColor = node.fillColor;
            actualObject.wrapper.children[0].style.fill = node.fillColor;
            if ((actualObject.enableShapeLabel || actualObject.measureType) && actualObject.wrapper && actualObject.wrapper.children) {
                var children = actualObject.wrapper.children;
                for (var i_2 = 0; i_2 < children.length; i_2++) {
                    if (children[i_2].textNodes) {
                        if (actualObject.enableShapeLabel) {
                            actualObject.labelFillColor = node.fillColor;
                            children[i_2].style.fill = node.fillColor;
                        }
                        if (actualObject.measureType) {
                            children[i_2].style.fill = node.fillColor;
                        }
                    }
                }
            }
            update = true;
        }
        if (actualObject.enableShapeLabel && node.labelFillColor !== undefined) {
            if (actualObject.enableShapeLabel && actualObject.wrapper && actualObject.wrapper.children) {
                var children = actualObject.wrapper.children;
                for (var i_3 = 0; i_3 < children.length; i_3++) {
                    if (children[i_3].textNodes) {
                        children[i_3].style.fill = node.labelFillColor;
                    }
                }
            }
        }
        if (node.opacity !== undefined) {
            if (actualObject.shapeAnnotationType == "Stamp" || actualObject.shapeAnnotationType === "FreeText") {
                actualObject.wrapper.children[1].style.opacity = node.opacity;
                if (actualObject.wrapper.children[2]) {
                    actualObject.wrapper.children[2].style.opacity = node.opacity;
                }
            }
            else {
                actualObject.opacity = node.opacity;
            }
            actualObject.wrapper.children[0].style.opacity = node.opacity;
            if (actualObject.enableShapeLabel && actualObject.wrapper && actualObject.wrapper.children) {
                var children = actualObject.wrapper.children;
                for (var i_4 = 0; i_4 < children.length; i_4++) {
                    if (children[i_4].textNodes) {
                        children[i_4].style.opacity = node.labelOpacity;
                    }
                }
            }
            update = true;
            updateConnector = true;
        }
        if (actualObject.enableShapeLabel && node.labelOpacity !== undefined) {
            if (actualObject.enableShapeLabel && actualObject.wrapper && actualObject.wrapper.children) {
                var children = actualObject.wrapper.children;
                for (var i_5 = 0; i_5 < children.length; i_5++) {
                    if (children[i_5].textNodes) {
                        children[i_5].style.opacity = node.labelOpacity;
                    }
                }
            }
        }
        if (node.rotateAngle !== undefined) {
            actualObject.rotateAngle = node.rotateAngle;
            actualObject.wrapper.rotateAngle = node.rotateAngle;
            update = true;
            updateConnector = true;
        }
        if (node.strokeColor !== undefined) {
            actualObject.strokeColor = node.strokeColor;
            actualObject.wrapper.children[0].style.strokeColor = node.strokeColor;
            update = true;
            updateConnector = true;
        }
        if (node.fontColor !== undefined) {
            actualObject.fontColor = node.fontColor;
            if (actualObject.shapeAnnotationType === 'FreeText' && actualObject.wrapper && actualObject.wrapper.children
                && actualObject.wrapper.children.length) {
                var children = actualObject.wrapper.children;
                children[1].style.color = node.fontColor;
                if (actualObject.textAlign === 'Justify') {
                    children[1].horizontalAlignment = 'Center';
                }
                else {
                    children[1].horizontalAlignment = 'Auto';
                }
            }
            if (actualObject.enableShapeLabel && actualObject.wrapper && actualObject.wrapper.children) {
                var children = actualObject.wrapper.children;
                for (var i_6 = 0; i_6 < children.length; i_6++) {
                    if (children[i_6].textNodes) {
                        children[i_6].style.color = node.fontColor;
                    }
                }
            }
            update = true;
            updateConnector = true;
        }
        if (node.fontFamily !== undefined) {
            actualObject.fontFamily = node.fontFamily;
            if (actualObject.shapeAnnotationType === 'FreeText' && actualObject.wrapper && actualObject.wrapper.children
                && actualObject.wrapper.children.length) {
                var children = actualObject.wrapper.children;
                children[1].style.fontFamily = node.fontFamily;
            }
            if (actualObject.enableShapeLabel && actualObject.wrapper && actualObject.wrapper.children) {
                var children = actualObject.wrapper.children;
                for (var i_7 = 0; i_7 < children.length; i_7++) {
                    if (children[i_7].textNodes) {
                        children[i_7].style.fontFamily = node.fontFamily;
                    }
                }
            }
            update = true;
            updateConnector = true;
        }
        if (node.fontSize !== undefined) {
            actualObject.fontSize = node.fontSize;
            if (actualObject.shapeAnnotationType === 'FreeText' && actualObject.wrapper && actualObject.wrapper.children
                && actualObject.wrapper.children.length) {
                var children = actualObject.wrapper.children;
                children[1].style.fontSize = node.fontSize;
            }
            if (actualObject.enableShapeLabel && actualObject.wrapper && actualObject.wrapper.children) {
                var children = actualObject.wrapper.children;
                for (var i_8 = 0; i_8 < children.length; i_8++) {
                    if (children[i_8].textNodes) {
                        children[i_8].style.fontSize = node.fontSize;
                    }
                }
            }
            update = true;
            updateConnector = true;
        }
        if (node.font !== undefined) {
            if (actualObject.shapeAnnotationType === 'FreeText' && actualObject.wrapper && actualObject.wrapper.children
                && actualObject.wrapper.children.length) {
                var children = actualObject.wrapper.children;
                if (node.font.isBold !== undefined) {
                    children[1].style.bold = node.font.isBold;
                    actualObject.font.isBold = node.font.isBold;
                }
                if (node.font.isItalic !== undefined) {
                    children[1].style.italic = node.font.isItalic;
                    actualObject.font.isItalic = node.font.isItalic;
                }
                if (node.font.isUnderline !== undefined) {
                    actualObject.font.isStrikeout = false;
                    if (node.font.isUnderline === true) {
                        children[1].style.textDecoration = 'Underline';
                    }
                    else {
                        children[1].style.textDecoration = 'None';
                    }
                    actualObject.font.isUnderline = node.font.isUnderline;
                }
                if (node.font.isStrikeout !== undefined) {
                    actualObject.font.isUnderline = false;
                    if (node.font.isStrikeout === true) {
                        children[1].style.textDecoration = 'LineThrough';
                    }
                    else {
                        children[1].style.textDecoration = 'None';
                    }
                    actualObject.font.isStrikeout = node.font.isStrikeout;
                }
            }
            update = true;
            updateConnector = true;
        }
        if (node.textAlign !== undefined) {
            actualObject.textAlign = node.textAlign;
            if (actualObject.shapeAnnotationType === 'FreeText' && actualObject.wrapper && actualObject.wrapper.children
                && actualObject.wrapper.children.length) {
                var children = actualObject.wrapper.children;
                children[1].style.textAlign = node.textAlign;
                if (children[1].childNodes.length === 1) {
                    if (actualObject.textAlign === 'Justify') {
                        children[1].horizontalAlignment = 'Left';
                        children[1].setOffsetWithRespectToBounds(0, 0, null);
                    }
                    else if (actualObject.textAlign === 'Right') {
                        children[1].horizontalAlignment = 'Right';
                        children[1].setOffsetWithRespectToBounds(0.97, 0, null);
                    }
                    else if (actualObject.textAlign === 'Left') {
                        children[1].horizontalAlignment = 'Left';
                        children[1].setOffsetWithRespectToBounds(0, 0, null);
                    }
                    else if (actualObject.textAlign === 'Center') {
                        children[1].horizontalAlignment = 'Center';
                        children[1].setOffsetWithRespectToBounds(0.46, 0, null);
                    }
                }
                else if (children[1].childNodes.length > 1 && actualObject.textAlign === 'Justify') {
                    children[1].horizontalAlignment = 'Center';
                }
                else {
                    children[1].horizontalAlignment = 'Auto';
                }
            }
            update = true;
            updateConnector = true;
        }
        if (node.thickness !== undefined) {
            actualObject.thickness = node.thickness;
            actualObject.wrapper.children[0].style.strokeWidth = node.thickness;
            update = true;
            updateConnector = true;
        }
        if (node.borderDashArray !== undefined) {
            actualObject.borderDashArray = node.borderDashArray;
            actualObject.wrapper.children[0].style.strokeDashArray = node.borderDashArray;
        }
        if (node.borderStyle !== undefined) {
            actualObject.borderStyle = node.borderStyle;
        }
        if (node.vertexPoints !== undefined) {
            actualObject.vertexPoints = node.vertexPoints;
            this.pdfViewer.nameTable[actualObject.id].vertexPoints = node.vertexPoints;
            this.updateConnector(actualObject, node.vertexPoints);
        }
        if (node.leaderHeight !== undefined && actualObject.shapeAnnotationType !== 'Polygon') {
            actualObject.leaderHeight = node.leaderHeight;
            this.updateConnector(actualObject, actualObject.vertexPoints);
        }
        if (node.notes !== undefined) {
            actualObject.notes = node.notes;
        }
        if (node.annotName !== undefined) {
            actualObject.annotName = node.annotName;
        }
        if (actualObject.shapeAnnotationType === 'Distance') {
            for (i = 0; i < actualObject.wrapper.children.length; i++) {
                var segment = actualObject.wrapper.children[i];
                var points = getConnectorPoints(actualObject);
                if (segment.id.indexOf('leader1') > -1) {
                    this.setLineDistance(actualObject, points, segment, false);
                }
                if (segment.id.indexOf('leader2') > -1) {
                    this.setLineDistance(actualObject, points, segment, true);
                }
            }
            this.updateConnector(actualObject, actualObject.vertexPoints);
        }
        if (actualObject.shapeAnnotationType === 'Polygon' && node.vertexPoints) {
            actualObject.data = getPolygonPath(actualObject.vertexPoints);
            var path = actualObject.wrapper.children[0];
            path.data = actualObject.data;
            path.canMeasurePath = true;
        }
        if (isLineShapes(actualObject)) {
            for (var i_9 = 0; i_9 < actualObject.wrapper.children.length; i_9++) {
                var childElement = actualObject.wrapper.children[i_9];
                if (!childElement.textNodes) {
                    setElementStype(actualObject, actualObject.wrapper.children[i_9]);
                }
                if (actualObject.enableShapeLabel === true) {
                    if (actualObject.wrapper.children[i_9] instanceof TextElement) {
                        actualObject.wrapper.children[i_9].style.fill = actualObject.labelFillColor;
                    }
                    if ((actualObject.wrapper.children[i_9] instanceof PathElement && actualObject.measureType === 'Perimeter')) {
                        actualObject.wrapper.children[i_9].style.fill = 'transparent';
                    }
                }
                else {
                    if ((actualObject.wrapper.children[i_9] instanceof PathElement && actualObject.measureType === 'Perimeter') || actualObject.wrapper.children[i_9] instanceof TextElement) {
                        actualObject.wrapper.children[i_9].style.fill = 'transparent';
                    }
                }
            }
        }
        if (actualObject && (actualObject.shapeAnnotationType === "FreeText" || actualObject.enableShapeLabel === true)) {
            if (actualObject.wrapper && actualObject.wrapper.children && actualObject.wrapper.children.length) {
                var children = actualObject.wrapper.children;
                for (var i_10 = 0; i_10 < children.length; i_10++) {
                    if (children[i_10].textNodes) {
                        if (actualObject.shapeAnnotationType === "FreeText") {
                            if (node.dynamicText !== undefined) {
                                children[i_10].content = node.dynamicText;
                                actualObject.dynamicText = node.dynamicText;
                            }
                            else {
                                children[i_10].content = actualObject.dynamicText;
                            }
                            children[i_10].width = actualObject.bounds.width - 8;
                        }
                        else if (actualObject.enableShapeLabel === true && actualObject.measureType) {
                            if (node.labelContent) {
                                children[i_10].content = node.labelContent;
                                actualObject.labelContent = node.labelContent;
                            }
                            else {
                                children[i_10].content = actualObject.labelContent;
                            }
                            actualObject.notes = children[i_10].content;
                        }
                        else if (actualObject.enableShapeLabel === true) {
                            if (node.labelContent) {
                                children[i_10].content = node.labelContent;
                                actualObject.labelContent = node.labelContent;
                            }
                            else {
                                children[i_10].content = actualObject.labelContent;
                            }
                            actualObject.notes = children[i_10].content;
                        }
                        children[i_10].isDirt = true;
                    }
                    /** set text node width less than the parent */
                }
            }
        }
        actualObject.wrapper.measure(new Size(actualObject.wrapper.bounds.width, actualObject.wrapper.bounds.height));
        actualObject.wrapper.arrange(actualObject.wrapper.desiredSize);
        if (actualObject && actualObject.shapeAnnotationType === "FreeText" && actualObject.subject === "Text Box") {
            if (actualObject.wrapper && actualObject.wrapper.children && actualObject.wrapper.children.length) {
                var children = actualObject.wrapper.children;
                if (children[1].childNodes.length > 1 && actualObject.textAlign === 'Justify') {
                    children[1].horizontalAlignment = 'Center';
                }
                else if (children[1].childNodes.length === 1) {
                    if (actualObject.textAlign === 'Justify') {
                        children[1].horizontalAlignment = 'Left';
                        children[1].setOffsetWithRespectToBounds(0, 0, null);
                    }
                    else if (actualObject.textAlign === 'Right') {
                        children[1].horizontalAlignment = 'Right';
                        children[1].setOffsetWithRespectToBounds(0.97, 0, null);
                    }
                    else if (actualObject.textAlign === 'Left') {
                        children[1].horizontalAlignment = 'Left';
                        children[1].setOffsetWithRespectToBounds(0, 0, null);
                    }
                    else if (actualObject.textAlign === 'Center') {
                        children[1].horizontalAlignment = 'Center';
                        children[1].setOffsetWithRespectToBounds(0.46, 0, null);
                    }
                }
                for (var i_11 = 0; i_11 < children.length; i_11++) {
                    if (children[i_11].textNodes && children[i_11].textNodes.length > 0) {
                        children[i_11].isDirt = true;
                        var childNodeHeight = children[i_11].textNodes.length * children[i_11].textNodes[0].dy;
                        var heightDiff = actualObject.bounds.height - childNodeHeight;
                        if (heightDiff > 0 && heightDiff < children[i_11].textNodes[0].dy) {
                            childNodeHeight = childNodeHeight + children[i_11].textNodes[0].dy;
                        }
                        if (childNodeHeight > actualObject.bounds.height) {
                            var contString = '';
                            for (var index = 0; index < children[i_11].textNodes.length; index++) {
                                var childHeight = children[i_11].textNodes[0].dy * (index + 1);
                                childHeight = childHeight;
                                if (childHeight > actualObject.bounds.height) {
                                    break;
                                }
                                contString = contString + children[i_11].textNodes[index].text;
                            }
                            children[i_11].content = contString;
                        }
                    }
                    /** set text node width less than the parent */
                    children[i_11].width = actualObject.bounds.width - 8;
                }
            }
            actualObject.wrapper.measure(new Size(actualObject.wrapper.bounds.width, actualObject.wrapper.bounds.height));
            actualObject.wrapper.arrange(actualObject.wrapper.desiredSize);
        }
        this.pdfViewer.renderDrawing(undefined, actualObject.pageIndex);
        if (actualObject && actualObject.shapeAnnotationType === "FreeText") {
            if (actualObject.wrapper && actualObject.wrapper.children && actualObject.wrapper.children.length) {
                var children = actualObject.wrapper.children;
                if (children[1].childNodes.length == 1 && actualObject.textAlign === 'Justify') {
                    children[1].horizontalAlignment = 'Left';
                    children[1].setOffsetWithRespectToBounds(0.5, 0, null);
                }
                else if (children[1].childNodes.length > 1 && actualObject.textAlign === 'Justify') {
                    children[1].horizontalAlignment = 'Center';
                    children[1].setOffsetWithRespectToBounds(0, 0, null);
                }
            }
        }
    };
    /* tslint:disable */
    Drawing.prototype.setLineDistance = function (actualObject, points, segment, leader) {
        var node1;
        if (leader) {
            node1 = initLeader(actualObject, points[1], points[0], leader);
        }
        else {
            node1 = initLeader(actualObject, points[0], points[1], leader);
        }
        segment.data = node1.data;
        segment.offsetX = node1.offsetX;
        segment.offsetY = node1.offsetY;
        segment.rotateAngle = node1.rotateAngle;
        segment.width = node1.width;
        segment.height = node1.height;
        segment.pivot = node1.pivot;
        segment.canMeasurePath = true;
        segment.isDirt = true;
    };
    /**
     * @private
     */
    Drawing.prototype.scaleSelectedItems = function (sx, sy, pivot) {
        var obj = this.pdfViewer.selectedItems;
        return this.scale(obj, sx, sy, pivot);
    };
    /**
     * @private
     */
    Drawing.prototype.scale = function (obj, sx, sy, pivot) {
        var checkBoundaryConstraints = true;
        if (obj instanceof Selector) {
            if (obj.annotations && obj.annotations.length) {
                for (var _i = 0, _a = obj.annotations; _i < _a.length; _i++) {
                    var node = _a[_i];
                    checkBoundaryConstraints = this.scaleAnnotation(node, sx, sy, pivot, obj);
                }
            }
        }
        else {
            checkBoundaryConstraints = this.scaleAnnotation(obj, sx, sy, pivot, undefined);
        }
        return checkBoundaryConstraints;
    };
    /**
     * @private
     */
    Drawing.prototype.scaleObject = function (sw, sh, pivot, obj, element, refObject) {
        sw = sw < 0 ? 1 : sw;
        sh = sh < 0 ? 1 : sh;
        var process;
        if (sw !== 1 || sh !== 1) {
            var width = void 0;
            var height = void 0;
            if (!isLineShapes(obj)) {
                var node = obj;
                var isResize = void 0;
                var bound = void 0;
                width = node.wrapper.actualSize.width * sw;
                height = node.wrapper.actualSize.height * sh;
                if (isResize) {
                    width = Math.max(width, (bound.right - node.wrapper.bounds.x));
                    height = Math.max(height, (bound.bottom - node.wrapper.bounds.y));
                }
                sw = width / node.wrapper.actualSize.width;
                sh = height / node.wrapper.actualSize.height;
            }
            var matrix = identityMatrix();
            var refWrapper = void 0;
            if (!refObject) {
                refObject = obj;
            }
            refWrapper = refObject.wrapper;
            rotateMatrix(matrix, -refWrapper.rotateAngle, pivot.x, pivot.y);
            scaleMatrix(matrix, sw, sh, pivot.x, pivot.y);
            rotateMatrix(matrix, refWrapper.rotateAngle, pivot.x, pivot.y);
            if (!isLineShapes(obj)) {
                var node = obj;
                var left = void 0;
                var top_1;
                var newPosition = transformPointByMatrix(matrix, { x: node.wrapper.offsetX, y: node.wrapper.offsetY });
                var oldleft = node.wrapper.offsetX - node.wrapper.actualSize.width;
                var oldtop = node.wrapper.offsetY - node.wrapper.actualSize.height;
                if (width > 0) {
                    node.wrapper.width = width;
                    node.wrapper.offsetX = newPosition.x;
                }
                if (height > 0) {
                    node.wrapper.height = height;
                    node.wrapper.offsetY = newPosition.y;
                }
                left = node.wrapper.offsetX - node.wrapper.actualSize.width; // * node.pivot.x;
                top_1 = node.wrapper.offsetY - node.wrapper.actualSize.height; // * node.pivot.y;
                this.nodePropertyChange(obj, {
                    bounds: { width: node.wrapper.width, height: node.wrapper.height, x: node.wrapper.offsetX, y: node.wrapper.offsetY, }
                });
            }
        }
    };
    /**
     * @private
     */
    Drawing.prototype.scaleAnnotation = function (obj, sw, sh, pivot, refObject) {
        var node = this.pdfViewer.nameTable[obj.id];
        var tempNode = node;
        var elements = [];
        var element = node.wrapper;
        if (!refObject) {
            refObject = obj;
        }
        var refWrapper = refObject.wrapper;
        var x = refWrapper.offsetX - refWrapper.actualSize.width * refWrapper.pivot.x;
        var y = refWrapper.offsetY - refWrapper.actualSize.height * refWrapper.pivot.y;
        var refPoint = this.getShapePoint(x, y, refWrapper.actualSize.width, refWrapper.actualSize.height, refWrapper.rotateAngle, refWrapper.offsetX, refWrapper.offsetY, pivot);
        if (element.actualSize.width !== undefined && element.actualSize.height !== undefined) {
            this.scaleObject(sw, sh, refPoint, node, element, refObject);
            var bounds = this.getShapeBounds(obj.wrapper);
        }
        var constraints = this.checkBoundaryConstraints(undefined, undefined, obj.pageIndex, obj.wrapper.bounds);
        if (!constraints) {
            this.scaleObject(1 / sw, 1 / sh, refPoint, node, element, refObject);
        }
        return constraints;
    };
    /**
     * @private
     */
    Drawing.prototype.checkBoundaryConstraints = function (tx, ty, pageIndex, nodeBounds, isStamp) {
        var selectorBounds = !nodeBounds ? this.pdfViewer.selectedItems.wrapper.bounds : undefined;
        var bounds = nodeBounds;
        var canvas = document.getElementById(this.pdfViewer.element.id + '_annotationCanvas_' + pageIndex);
        var heightDifference = 10;
        if (canvas) {
            var width = canvas.clientWidth / this.pdfViewer.viewerBase.getZoomFactor();
            var height = canvas.clientHeight / this.pdfViewer.viewerBase.getZoomFactor();
            var right = (nodeBounds ? bounds.right : selectorBounds.right) + (tx || 0);
            var left = (nodeBounds ? bounds.left : selectorBounds.left) + (tx || 0);
            var top_2 = (nodeBounds ? bounds.top : selectorBounds.top) + (ty || 0);
            var bottom = (nodeBounds ? bounds.bottom : selectorBounds.bottom) + (ty || 0);
            if (isStamp) {
                heightDifference = 50;
                if (this.pdfViewer.viewerBase.eventArgs && this.pdfViewer.viewerBase.eventArgs.source) {
                    if (this.RestrictStamp(this.pdfViewer.viewerBase.eventArgs.source)) {
                        return false;
                    }
                }
            }
            if (right <= width - 10 && left >= 10
                && bottom <= height - 10 && top_2 >= heightDifference) {
                return true;
            }
        }
        return false;
    };
    Drawing.prototype.RestrictStamp = function (source) {
        // tslint:disable-next-line:max-line-length
        if (source && source.pageIndex !== undefined && this.pdfViewer.viewerBase.activeElements && source.pageIndex !== this.pdfViewer.viewerBase.activeElements.activePageID) {
            return true;
        }
        return false;
    };
    /**
     * @private
     */
    Drawing.prototype.getShapeBounds = function (shapeElement) {
        var shapeBounds = new Rect();
        var shapeCorners;
        shapeCorners = cornersPointsBeforeRotation(shapeElement);
        var shapeMiddleLeft = shapeCorners.middleLeft;
        var shapeTopCenter = shapeCorners.topCenter;
        var shapeBottomCenter = shapeCorners.bottomCenter;
        var shapeMiddleRight = shapeCorners.middleRight;
        var shapeTopLeft = shapeCorners.topLeft;
        var shapeTopRight = shapeCorners.topRight;
        var shapeBottomLeft = shapeCorners.bottomLeft;
        var shapeBottomRight = shapeCorners.bottomRight;
        shapeElement.corners = {
            topLeft: shapeTopLeft, topCenter: shapeTopCenter, topRight: shapeTopRight, middleLeft: shapeMiddleLeft,
            middleRight: shapeMiddleRight, bottomLeft: shapeBottomLeft, bottomCenter: shapeBottomCenter, bottomRight: shapeBottomRight
        };
        if (shapeElement.rotateAngle !== 0 || shapeElement.parentTransform !== 0) {
            var matrix = identityMatrix();
            rotateMatrix(matrix, shapeElement.rotateAngle + shapeElement.parentTransform, shapeElement.offsetX, shapeElement.offsetY);
            shapeElement.corners.topLeft = shapeTopLeft = transformPointByMatrix(matrix, shapeTopLeft);
            shapeElement.corners.topCenter = shapeTopCenter = transformPointByMatrix(matrix, shapeTopCenter);
            shapeElement.corners.topRight = shapeTopRight = transformPointByMatrix(matrix, shapeTopRight);
            shapeElement.corners.middleLeft = shapeMiddleLeft = transformPointByMatrix(matrix, shapeMiddleLeft);
            shapeElement.corners.middleRight = shapeMiddleRight = transformPointByMatrix(matrix, shapeMiddleRight);
            shapeElement.corners.bottomLeft = shapeBottomLeft = transformPointByMatrix(matrix, shapeBottomLeft);
            shapeElement.corners.bottomCenter = shapeBottomCenter = transformPointByMatrix(matrix, shapeBottomCenter);
            shapeElement.corners.bottomRight = shapeBottomRight = transformPointByMatrix(matrix, shapeBottomRight);
            //Set corners based on rotate angle
        }
        shapeBounds = Rect.toBounds([shapeTopLeft, shapeTopRight, shapeBottomLeft, shapeBottomRight]);
        shapeElement.corners.left = shapeBounds.left;
        shapeElement.corners.right = shapeBounds.right;
        shapeElement.corners.top = shapeBounds.top;
        shapeElement.corners.bottom = shapeBounds.bottom;
        shapeElement.corners.center = shapeBounds.center;
        shapeElement.corners.width = shapeBounds.width;
        shapeElement.corners.height = shapeBounds.height;
        return shapeBounds;
    };
    /**
     * @private
     */
    Drawing.prototype.getShapePoint = function (x, y, w, h, angle, offsetX, offsetY, cornerPoint) {
        var pivotPoint = { x: 0, y: 0 };
        var transformMatrix = identityMatrix();
        rotateMatrix(transformMatrix, angle, offsetX, offsetY);
        switch (cornerPoint.x) {
            case 1:
                switch (cornerPoint.y) {
                    case 1:
                        pivotPoint = transformPointByMatrix(transformMatrix, ({ x: x + w, y: y + h }));
                        break;
                    case 0:
                        pivotPoint = transformPointByMatrix(transformMatrix, ({ x: x + w, y: y }));
                        break;
                    case 0.5:
                        pivotPoint = transformPointByMatrix(transformMatrix, ({ x: x + w, y: y + h / 2 }));
                        break;
                }
                break;
            case 0:
                switch (cornerPoint.y) {
                    case 0.5:
                        pivotPoint = transformPointByMatrix(transformMatrix, ({ x: x, y: y + h / 2 }));
                        break;
                    case 1:
                        pivotPoint = transformPointByMatrix(transformMatrix, ({ x: x, y: y + h }));
                        break;
                    case 0:
                        pivotPoint = transformPointByMatrix(transformMatrix, ({ x: x, y: y }));
                        break;
                }
                break;
            case 0.5:
                switch (cornerPoint.y) {
                    case 0:
                        pivotPoint = transformPointByMatrix(transformMatrix, ({ x: x + w / 2, y: y }));
                        break;
                    case 0.5:
                        pivotPoint = transformPointByMatrix(transformMatrix, ({ x: x + w / 2, y: y + h / 2 }));
                        break;
                    case 1:
                        pivotPoint = transformPointByMatrix(transformMatrix, ({ x: x + w / 2, y: y + h }));
                        break;
                }
                break;
        }
        return { x: pivotPoint.x, y: pivotPoint.y };
    };
    /**
     * @private
     */
    // tslint:disable-next-line:max-line-length
    Drawing.prototype.dragConnectorEnds = function (endPoint, obj, point, segment, target, targetPortId, currentSelector) {
        var selectorModel;
        var connector;
        var node;
        var tx;
        var segmentPoint;
        var ty;
        var index;
        var checkBezierThumb = false;
        if (obj instanceof Selector) {
            selectorModel = obj;
            connector = selectorModel.annotations[0];
        }
        else {
            connector = obj;
        }
        point = { x: point.x / this.pdfViewer.viewerBase.getZoomFactor(), y: point.y / this.pdfViewer.viewerBase.getZoomFactor() };
        if (this.checkBoundaryConstraints(undefined, undefined, connector.pageIndex, connector.wrapper.bounds)) {
            if (connector.shapeAnnotationType === 'Distance') {
                var leader = isLeader(connector, endPoint);
                if (endPoint === 'Leader0') {
                    tx = point.x - leader.point.x;
                    ty = point.y - leader.point.y;
                    connector.vertexPoints[0].x += tx;
                    connector.vertexPoints[0].y += ty;
                }
                else if (endPoint === 'Leader1') {
                    var length_2 = connector.vertexPoints.length - 1;
                    tx = point.x - leader.point.x;
                    ty = point.y - leader.point.y;
                    connector.vertexPoints[length_2].x += tx;
                    connector.vertexPoints[length_2].y += ty;
                }
                else {
                    var angle = Point.findAngle(connector.sourcePoint, connector.targetPoint);
                    var center = obj.wrapper.children[0].bounds.center;
                    var matrix = identityMatrix();
                    rotateMatrix(matrix, -angle, center.x, center.y);
                    var rotatedPoint = transformPointByMatrix(matrix, { x: point.x, y: point.y });
                    if (endPoint.split('_')[0] === 'ConnectorSegmentPoint') {
                        var matrix = identityMatrix();
                        rotateMatrix(matrix, -angle, center.x, center.y);
                        var rotatedPoint1 = transformPointByMatrix(matrix, connector.vertexPoints[0]);
                        var rotatedPoint2 = transformPointByMatrix(matrix, connector.vertexPoints[connector.vertexPoints.length - 1]);
                        ty = rotatedPoint.y - rotatedPoint1.y;
                        if (connector.leaderHeight === 0 && connector.leaderHeight != null) {
                            connector.leaderHeight = this.pdfViewer.distanceSettings.leaderLength;
                        }
                        else {
                            connector.leaderHeight += ty;
                            rotatedPoint1.y += ty;
                            rotatedPoint2.y += ty;
                            var matrix = identityMatrix();
                            rotateMatrix(matrix, angle, center.x, center.y);
                            connector.vertexPoints[0] = transformPointByMatrix(matrix, rotatedPoint1);
                            connector.vertexPoints[connector.vertexPoints.length - 1] = transformPointByMatrix(matrix, rotatedPoint2);
                        }
                    }
                }
            }
            else if (endPoint.split('_')[0] === 'ConnectorSegmentPoint') {
                var i = Number(endPoint.split('_')[1]);
                tx = point.x - connector.vertexPoints[i].x;
                ty = point.y - connector.vertexPoints[i].y;
                connector.vertexPoints[i].x += tx;
                connector.vertexPoints[i].y += ty;
                if (connector.vertexPoints.length > 2 && obj.measureType !== 'Perimeter') {
                    if (parseFloat(endPoint.split('_')[1]) === 0) {
                        connector.vertexPoints[connector.vertexPoints.length - 1].x += tx;
                        connector.vertexPoints[connector.vertexPoints.length - 1].y += ty;
                    }
                    else if (parseFloat(endPoint.split('_')[1]) === connector.vertexPoints.length - 1) {
                        connector.vertexPoints[0].x += tx;
                        connector.vertexPoints[0].y += ty;
                    }
                }
            }
            this.nodePropertyChange(connector, { vertexPoints: connector.vertexPoints });
            this.renderSelector(connector.pageIndex, currentSelector);
        }
        this.pdfViewer.renderDrawing();
        return true;
    };
    /**
     * @private
     */
    Drawing.prototype.dragSourceEnd = function (obj, tx, ty, i) {
        var connector = this.pdfViewer.nameTable[obj.id];
        connector.vertexPoints[i].x += tx;
        connector.vertexPoints[i].y += ty;
        this.pdfViewer.renderDrawing();
        return true;
    };
    /**
     * @private
     */
    Drawing.prototype.updateConnector = function (connector, points) {
        var srcPoint;
        var anglePoint;
        var srcDecorator;
        var tarDecorator;
        var targetPoint;
        connector.vertexPoints = points;
        updateSegmentElement(connector, points, connector.wrapper.children[0]);
        srcPoint = connector.sourcePoint;
        anglePoint = connector.vertexPoints;
        //  points = this.clipDecorators(connector, points);
        var element = connector.wrapper.children[0];
        element.canMeasurePath = true;
        for (var i = 0; i < connector.wrapper.children.length; i++) {
            element = connector.wrapper.children[i];
            if (connector.shapeAnnotationType !== 'Polygon') {
                if (element.id.indexOf('srcDec') > -1) {
                    updateDecoratorElement(connector, element, points[0], anglePoint[1], true);
                }
                targetPoint = connector.targetPoint;
                if (element.id.indexOf('tarDec') > -1) {
                    updateDecoratorElement(connector, element, points[points.length - 1], anglePoint[anglePoint.length - 2], false);
                }
            }
        }
    };
    /**
     * @private
     */
    Drawing.prototype.copy = function () {
        this.pdfViewer.clipboardData.pasteIndex = 1;
        this.pdfViewer.clipboardData.clipObject = this.copyObjects();
        return this.pdfViewer.clipboardData.clipObject;
    };
    /**
     * @private
     */
    Drawing.prototype.copyObjects = function () {
        var selectedItems = [];
        var obj = [];
        this.pdfViewer.clipboardData.childTable = {};
        if (this.pdfViewer.selectedItems.annotations.length > 0) {
            selectedItems = this.pdfViewer.selectedItems.annotations;
            for (var j = 0; j < selectedItems.length; j++) {
                var element = void 0;
                element = cloneObject((selectedItems[j]));
                obj.push(element);
            }
        }
        if (this.pdfViewer.clipboardData.pasteIndex === 0) {
            //  this.startGroupAction();
            for (var _i = 0, selectedItems_1 = selectedItems; _i < selectedItems_1.length; _i++) {
                var item = selectedItems_1[_i];
                if (this.pdfViewer.nameTable[item.id]) {
                    this.pdfViewer.remove(item);
                }
            }
            //this.endGroupAction();
        }
        this.sortByZIndex(obj, 'zIndex');
        return obj;
    };
    Drawing.prototype.getNewObject = function (obj) {
        var newObj;
        var newobjs = [];
        this.pdfViewer.clipboardData.pasteIndex = 1;
        for (var i = 0; i < obj.length; i++) {
            newObj = cloneObject(obj[i]);
            newobjs.push(newObj);
        }
        return newobjs;
    };
    /**
     * @private
     */
    Drawing.prototype.paste = function (obj, index) {
        if (obj || this.pdfViewer.clipboardData.clipObject) {
            var copiedItems = obj ? this.getNewObject(obj) :
                this.pdfViewer.clipboardData.clipObject;
            if (copiedItems) {
                var multiSelect = copiedItems.length !== 1;
                var groupAction = false;
                var objectTable = {};
                var keyTable = {};
                if (this.pdfViewer.clipboardData.pasteIndex !== 0) {
                    this.pdfViewer.clearSelection(index);
                }
                for (var _i = 0, copiedItems_1 = copiedItems; _i < copiedItems_1.length; _i++) {
                    var copy = copiedItems_1[_i];
                    objectTable[copy.id] = copy;
                }
                for (var j = 0; j < copiedItems.length; j++) {
                    var copy = copiedItems[j];
                    var pageDiv = this.pdfViewer.viewerBase.getElement('_pageDiv_' + copy.pageIndex);
                    var events = event;
                    if (isLineShapes(copy)) {
                        this.calculateCopyPosition(copy, pageDiv, events);
                    }
                    else {
                        if (pageDiv) {
                            var pageCurrentRect = pageDiv.getBoundingClientRect();
                            copy.bounds.x = events.clientX - pageCurrentRect.left;
                            copy.bounds.y = events.clientY - pageCurrentRect.top;
                        }
                    }
                    var newNode = cloneObject(copy);
                    if (this.pdfViewer.viewerBase.contextMenuModule.previousAction !== 'Cut') {
                        newNode.id += randomId();
                        if (this.pdfViewer.annotationModule) {
                            newNode.annotName = newNode.id;
                            this.pdfViewer.annotationModule.stickyNotesAnnotationModule.updateAnnotationCollection(newNode, copiedItems[0]);
                        }
                        // tslint:disable-next-line:max-line-length
                        this.pdfViewer.annotation.addAction(newNode.pageIndex, null, newNode, 'Addition', '', newNode, newNode);
                    }
                    var addedAnnot = this.add(newNode);
                    if ((newNode.shapeAnnotationType === 'FreeText' || newNode.enableShapeLabel) && addedAnnot) {
                        this.nodePropertyChange(addedAnnot, {});
                    }
                    this.pdfViewer.select([newNode.id], this.pdfViewer.annotationSelectorSettings);
                }
            }
            this.pdfViewer.renderDrawing(undefined, index);
            this.pdfViewer.clipboardData.pasteIndex++;
        }
    };
    Drawing.prototype.calculateCopyPosition = function (copy, pageDiv, events) {
        var x1;
        var y1;
        var x2;
        var y2;
        for (var i = 0; i < copy.vertexPoints.length; i++) {
            if (pageDiv) {
                if (i === 0) {
                    var pageCurrentRect = pageDiv.getBoundingClientRect();
                    x1 = copy.vertexPoints[i].x;
                    y1 = copy.vertexPoints[i].y;
                    copy.vertexPoints[i].x = events.clientX - pageCurrentRect.left;
                    copy.vertexPoints[i].y = events.clientY - pageCurrentRect.top;
                    x2 = copy.vertexPoints[i].x;
                    y2 = copy.vertexPoints[i].y;
                }
                else {
                    copy.vertexPoints[i].x += x2 - x1;
                    copy.vertexPoints[i].y += y2 - y1;
                }
            }
        }
    };
    /**
     * @private
     */
    Drawing.prototype.cut = function (index) {
        this.pdfViewer.clipboardData.pasteIndex = 0;
        this.pdfViewer.clipboardData.clipObject = this.copyObjects();
        this.pdfViewer.renderDrawing(undefined, index);
    };
    /**
     * @private
     */
    Drawing.prototype.sortByZIndex = function (nodeArray, sortID) {
        var id = sortID ? sortID : 'zIndex';
        nodeArray = nodeArray.sort(function (a, b) {
            return a[id] - b[id];
        });
        return nodeArray;
    };
    return Drawing;
}());
export { Drawing };

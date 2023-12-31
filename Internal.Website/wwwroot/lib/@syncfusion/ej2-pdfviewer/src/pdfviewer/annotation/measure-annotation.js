import { ColorPicker, NumericTextBox } from '@syncfusion/ej2-inputs';
import { createElement, Browser, isNullOrUndefined } from '@syncfusion/ej2-base';
import { Dialog } from '@syncfusion/ej2-popups';
import { DropDownButton } from '@syncfusion/ej2-splitbuttons';
import { Point } from '@syncfusion/ej2-drawings';
/**
 * @hidden
 */
var MeasureAnnotation = /** @class */ (function () {
    function MeasureAnnotation(pdfviewer, pdfViewerBase) {
        /**
         * @private
         */
        this.measureShapeCount = 0;
        this.pdfViewer = pdfviewer;
        this.pdfViewerBase = pdfViewerBase;
        this.distanceFillColor = this.pdfViewer.distanceSettings.fillColor ? this.pdfViewer.distanceSettings.fillColor : '#ff0000';
        this.distanceStrokeColor = this.pdfViewer.distanceSettings.strokeColor ? this.pdfViewer.distanceSettings.strokeColor : '#ff0000';
        this.distanceOpacity = this.pdfViewer.distanceSettings.opacity ? this.pdfViewer.distanceSettings.opacity : 1;
        this.distanceThickness = this.pdfViewer.distanceSettings.thickness ? this.pdfViewer.distanceSettings.thickness : 1;
        this.distanceDashArray = this.pdfViewer.distanceSettings.borderDashArray ? this.pdfViewer.distanceSettings.borderDashArray : 0;
        this.leaderLength = this.pdfViewer.distanceSettings.leaderLength != null ? this.pdfViewer.distanceSettings.leaderLength : 40;
        // tslint:disable-next-line:max-line-length
        this.distanceStartHead = this.pdfViewer.distanceSettings.lineHeadStartStyle ? this.pdfViewer.distanceSettings.lineHeadStartStyle : 'Closed';
        this.distanceEndHead = this.pdfViewer.distanceSettings.lineHeadEndStyle ? this.pdfViewer.distanceSettings.lineHeadEndStyle : 'Closed';
        this.perimeterFillColor = this.pdfViewer.perimeterSettings.fillColor ? this.pdfViewer.perimeterSettings.fillColor : '#ffffff00';
        this.perimeterStrokeColor = this.pdfViewer.perimeterSettings.strokeColor ? this.pdfViewer.perimeterSettings.strokeColor : '#ff0000';
        this.perimeterOpacity = this.pdfViewer.perimeterSettings.opacity ? this.pdfViewer.perimeterSettings.opacity : 1;
        this.perimeterThickness = this.pdfViewer.perimeterSettings.thickness ? this.pdfViewer.perimeterSettings.thickness : 1;
        this.perimeterDashArray = this.pdfViewer.perimeterSettings.borderDashArray ? this.pdfViewer.perimeterSettings.borderDashArray : 0;
        // tslint:disable-next-line:max-line-length
        this.perimeterStartHead = this.pdfViewer.perimeterSettings.lineHeadStartStyle ? this.pdfViewer.perimeterSettings.lineHeadStartStyle : 'Open';
        this.perimeterEndHead = this.pdfViewer.perimeterSettings.lineHeadEndStyle ? this.pdfViewer.perimeterSettings.lineHeadEndStyle : 'Open';
        this.areaFillColor = this.pdfViewer.areaSettings.fillColor ? this.pdfViewer.areaSettings.fillColor : '#ffffff00';
        this.areaStrokeColor = this.pdfViewer.areaSettings.strokeColor ? this.pdfViewer.areaSettings.strokeColor : '#ff0000';
        this.areaOpacity = this.pdfViewer.areaSettings.opacity ? this.pdfViewer.areaSettings.opacity : 1;
        this.areaThickness = this.pdfViewer.areaSettings.thickness ? this.pdfViewer.areaSettings.thickness : 1;
        this.radiusFillColor = this.pdfViewer.radiusSettings.fillColor ? this.pdfViewer.radiusSettings.fillColor : '#ffffff00';
        this.radiusStrokeColor = this.pdfViewer.radiusSettings.strokeColor ? this.pdfViewer.radiusSettings.strokeColor : '#ff0000';
        this.radiusOpacity = this.pdfViewer.radiusSettings.opacity ? this.pdfViewer.radiusSettings.opacity : 1;
        this.radiusThickness = this.pdfViewer.radiusSettings.thickness ? this.pdfViewer.radiusSettings.thickness : 1;
        this.volumeFillColor = this.pdfViewer.volumeSettings.fillColor ? this.pdfViewer.volumeSettings.fillColor : '#ffffff00';
        this.volumeStrokeColor = this.pdfViewer.volumeSettings.strokeColor ? this.pdfViewer.volumeSettings.strokeColor : '#ff0000';
        this.volumeOpacity = this.pdfViewer.volumeSettings.opacity ? this.pdfViewer.volumeSettings.opacity : 1;
        this.volumeThickness = this.pdfViewer.volumeSettings.thickness ? this.pdfViewer.volumeSettings.thickness : 1;
        this.unit = this.pdfViewer.measurementSettings.conversionUnit.toLowerCase();
        this.displayUnit = this.pdfViewer.measurementSettings.displayUnit.toLowerCase();
        this.ratio = this.pdfViewer.measurementSettings.scaleRatio;
        this.volumeDepth = this.pdfViewer.measurementSettings.depth;
        this.scaleRatioString = '1 ' + this.unit + ' = ' + '1 ' + this.displayUnit;
    }
    Object.defineProperty(MeasureAnnotation.prototype, "pixelToPointFactor", {
        /**
         * @private
         */
        get: function () {
            return (72 / 96);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @private
     */
    // tslint:disable-next-line
    MeasureAnnotation.prototype.renderMeasureShapeAnnotations = function (shapeAnnotations, pageNumber, isImportAction) {
        if (shapeAnnotations) {
            if (shapeAnnotations.length >= 1) {
                // tslint:disable-next-line
                var measureAnnots = this.pdfViewer.annotation.getStoredAnnotations(pageNumber, shapeAnnotations, '_annotations_shape_measure');
                if (!measureAnnots || isImportAction) {
                    for (var i = 0; i < shapeAnnotations.length; i++) {
                        // tslint:disable-next-line
                        var annotation = shapeAnnotations[i];
                        var annotationObject = null;
                        this.measureShapeCount = this.measureShapeCount + 1;
                        // tslint:disable-next-line:max-line-length
                        annotation.annotationAddMode = this.pdfViewer.annotationModule.findAnnotationMode(annotation, pageNumber, annotation.AnnotType);
                        if (annotation.ShapeAnnotationType) {
                            var vertexPoints = null;
                            if (annotation.VertexPoints) {
                                vertexPoints = [];
                                for (var j = 0; j < annotation.VertexPoints.length; j++) {
                                    var point = { x: annotation.VertexPoints[j].X, y: annotation.VertexPoints[j].Y };
                                    vertexPoints.push(point);
                                }
                            }
                            if (annotation.Bounds && annotation.EnableShapeLabel === true) {
                                // tslint:disable-next-line:max-line-length
                                annotation.LabelBounds = this.pdfViewer.annotationModule.inputElementModule.calculateLabelBoundsFromLoadedDocument(annotation.Bounds);
                                annotation.LabelBorderColor = annotation.LabelBorderColor ? annotation.LabelBorderColor : annotation.StrokeColor;
                                annotation.FontColor = annotation.FontColor ? annotation.FontColor : annotation.StrokeColor;
                                annotation.LabelFillColor = annotation.LabelFillColor ? annotation.LabelFillColor : annotation.FillColor;
                                annotation.FontSize = annotation.FontSize ? annotation.FontSize : 16;
                                // tslint:disable-next-line:max-line-length
                                annotation.LabelSettings = annotation.LabelSettings ? annotation.LabelSettings : this.pdfViewer.shapeLabelSettings;
                            }
                            // tslint:disable-next-line:max-line-length
                            annotation.AnnotationSettings = annotation.AnnotationSettings ? annotation.AnnotationSettings : this.pdfViewer.annotationModule.updateAnnotationSettings(annotation);
                            var measureObject = {
                                // tslint:disable-next-line:max-line-length
                                ratio: annotation.Calibrate.Ratio, x: this.getNumberFormatArray(annotation.Calibrate.X), distance: this.getNumberFormatArray(annotation.Calibrate.Distance), area: this.getNumberFormatArray(annotation.Calibrate.Area), angle: this.getNumberFormatArray(annotation.Calibrate.Angle), volume: this.getNumberFormatArray(annotation.Calibrate.Volume),
                                targetUnitConversion: annotation.Calibrate.TargetUnitConversion
                            };
                            if (annotation.Calibrate.Depth) {
                                measureObject.depth = annotation.Calibrate.Depth;
                            }
                            annotationObject = {
                                // tslint:disable-next-line:max-line-length
                                id: 'measure' + this.measureShapeCount, shapeAnnotationType: annotation.ShapeAnnotationType, author: annotation.Author, modifiedDate: annotation.ModifiedDate, subject: annotation.Subject,
                                note: annotation.Note, strokeColor: annotation.StrokeColor, fillColor: annotation.FillColor, opacity: annotation.Opacity, thickness: annotation.Thickness, rectangleDifference: annotation.RectangleDifference,
                                // tslint:disable-next-line:max-line-length
                                borderStyle: annotation.BorderStyle, borderDashArray: annotation.BorderDashArray, rotateAngle: annotation.RotateAngle, isCloudShape: annotation.IsCloudShape,
                                cloudIntensity: annotation.CloudIntensity, vertexPoints: vertexPoints, lineHeadStart: annotation.LineHeadStart, lineHeadEnd: annotation.LineHeadEnd, isLocked: annotation.IsLocked,
                                // tslint:disable-next-line:max-line-length
                                bounds: { left: annotation.Bounds.X, top: annotation.Bounds.Y, width: annotation.Bounds.Width, height: annotation.Bounds.Height, right: annotation.Bounds.Right, bottom: annotation.Bounds.Bottom },
                                caption: annotation.Caption, captionPosition: annotation.CaptionPosition, calibrate: measureObject, leaderLength: annotation.LeaderLength, leaderLineExtension: annotation.LeaderLineExtension,
                                // tslint:disable-next-line:max-line-length
                                leaderLineOffset: annotation.LeaderLineOffset, indent: annotation.Indent, annotName: annotation.AnnotName, comments: this.pdfViewer.annotationModule.getAnnotationComments(annotation.Comments, annotation, annotation.Author),
                                review: { state: annotation.State, stateModel: annotation.StateModel, modifiedDate: annotation.ModifiedDate, author: annotation.Author },
                                // tslint:disable-next-line:max-line-length
                                labelContent: annotation.LabelContent, enableShapeLabel: annotation.EnableShapeLabel, labelFillColor: annotation.LabelFillColor,
                                fontColor: annotation.FontColor, labelBorderColor: annotation.LabelBorderColor, fontSize: annotation.FontSize,
                                // tslint:disable-next-line:max-line-length
                                labelBounds: annotation.LabelBounds, annotationSelectorSettings: this.getSettings(annotation), labelSettings: annotation.LabelSettings, annotationSettings: annotation.AnnotationSettings,
                                customData: this.pdfViewer.annotation.getCustomData(annotation)
                            };
                            var annot = void 0;
                            // tslint:disable-next-line
                            var vPoints = annotationObject.vertexPoints;
                            if (vertexPoints == null) {
                                vPoints = [];
                            }
                            // tslint:disable-next-line:max-line-length
                            annotation.AnnotationSelectorSettings = annotation.AnnotationSelectorSettings ? annotation.AnnotationSelectorSettings : this.pdfViewer.annotationSelectorSettings;
                            annot = {
                                // tslint:disable-next-line:max-line-length
                                id: 'measure' + this.measureShapeCount, shapeAnnotationType: this.getShapeType(annotationObject), author: annotationObject.author, modifiedDate: annotationObject.modifiedDate,
                                subject: annotationObject.subject, notes: annotationObject.note, fillColor: annotationObject.fillColor, strokeColor: annotationObject.strokeColor, opacity: annotationObject.opacity,
                                // tslint:disable-next-line:max-line-length
                                thickness: annotationObject.thickness, borderStyle: annotationObject.borderStyle, borderDashArray: annotationObject.borderDashArray.toString(), rotateAngle: parseFloat(annotationObject.rotateAngle.split('Angle')[1]),
                                isCloudShape: annotationObject.isCloudShape, cloudIntensity: annotationObject.cloudIntensity, taregetDecoraterShapes: this.pdfViewer.annotation.getArrowType(annotationObject.lineHeadEnd), sourceDecoraterShapes: this.pdfViewer.annotation.getArrowType(annotationObject.lineHeadStart),
                                // tslint:disable-next-line:max-line-length
                                vertexPoints: vPoints, bounds: { x: annotationObject.bounds.left, y: annotationObject.bounds.top, width: annotationObject.bounds.width, height: annotationObject.bounds.height }, leaderHeight: annotationObject.leaderLength,
                                pageIndex: pageNumber, annotName: annotationObject.annotName, comments: annotationObject.comments, review: annotationObject.review,
                                measureType: this.getMeasureType(annotationObject),
                                // tslint:disable-next-line:max-line-length
                                labelContent: annotation.LabelContent, enableShapeLabel: annotation.EnableShapeLabel, labelFillColor: annotation.LabelFillColor,
                                fontColor: annotation.FontColor, labelBorderColor: annotation.LabelBorderColor, fontSize: annotation.FontSize,
                                labelBounds: annotation.LabelBounds, annotationSelectorSettings: annotation.AnnotationSelectorSettings,
                                annotationSettings: annotationObject.annotationSettings, annotationAddMode: annotation.annotationAddMode
                            };
                            this.pdfViewer.annotation.storeAnnotations(pageNumber, annotationObject, '_annotations_shape_measure');
                            this.pdfViewer.add(annot);
                        }
                    }
                }
            }
            else if (shapeAnnotations.shapeAnnotationType) {
                var annotationObject = this.createAnnotationObject(shapeAnnotations);
                this.pdfViewer.annotationModule.storeAnnotations(pageNumber, annotationObject, '_annotations_shape_measure');
                this.pdfViewer.annotationModule.triggerAnnotationAdd(shapeAnnotations);
            }
        }
    };
    /**
     * @private
     */
    // tslint:disable-next-line
    MeasureAnnotation.prototype.getSettings = function (annotation) {
        var selector = this.pdfViewer.annotationSelectorSettings;
        if (annotation.AnnotationSelectorSettings) {
            selector = annotation.AnnotationSelectorSettings;
        }
        else {
            selector = this.getSelector(annotation.Subject);
        }
        return selector;
    };
    /**
     * @private
     */
    MeasureAnnotation.prototype.setAnnotationType = function (type) {
        var date = new Date();
        var author = 'Guest';
        this.pdfViewerBase.disableTextSelectionMode();
        switch (type) {
            case 'Distance':
                this.currentAnnotationMode = 'Distance';
                var modifiedDateDist = date.toLocaleString();
                // tslint:disable-next-line:max-line-length
                author = (this.pdfViewer.annotationSettings.author !== 'Guest') ? this.pdfViewer.annotationSettings.author : this.pdfViewer.distanceSettings.author ? this.pdfViewer.distanceSettings.author : 'Guest';
                this.pdfViewer.drawingObject = {
                    sourceDecoraterShapes: this.pdfViewer.annotation.getArrowType(this.distanceStartHead),
                    taregetDecoraterShapes: this.pdfViewer.annotation.getArrowType(this.distanceEndHead), measureType: 'Distance',
                    fillColor: this.distanceFillColor, notes: '', strokeColor: this.distanceStrokeColor, leaderHeight: this.leaderLength,
                    opacity: this.distanceOpacity, thickness: this.distanceThickness, borderDashArray: this.distanceDashArray.toString(),
                    // tslint:disable-next-line:max-line-length
                    shapeAnnotationType: 'Distance', author: author, subject: 'Distance calculation'
                };
                this.pdfViewer.tool = 'Distance';
                break;
            case 'Perimeter':
                this.currentAnnotationMode = 'Perimeter';
                var modifiedDatePeri = date.toLocaleString();
                // tslint:disable-next-line:max-line-length
                author = (this.pdfViewer.annotationSettings.author !== 'Guest') ? this.pdfViewer.annotationSettings.author : this.pdfViewer.perimeterSettings.author ? this.pdfViewer.perimeterSettings.author : 'Guest';
                this.pdfViewer.drawingObject = {
                    // tslint:disable-next-line:max-line-length
                    shapeAnnotationType: 'LineWidthArrowHead', fillColor: this.perimeterFillColor, notes: '', strokeColor: this.perimeterStrokeColor, opacity: this.perimeterOpacity,
                    thickness: this.perimeterThickness, sourceDecoraterShapes: this.pdfViewer.annotation.getArrowType(this.perimeterStartHead),
                    // tslint:disable-next-line:max-line-length
                    taregetDecoraterShapes: this.pdfViewer.annotation.getArrowType(this.perimeterEndHead), measureType: 'Perimeter', borderDashArray: this.perimeterDashArray.toString(),
                    author: author, subject: 'Perimeter calculation'
                };
                this.pdfViewer.tool = 'Perimeter';
                break;
            case 'Area':
                this.currentAnnotationMode = 'Area';
                var modifiedDateArea = date.toLocaleString();
                // tslint:disable-next-line:max-line-length
                author = (this.pdfViewer.annotationSettings.author !== 'Guest') ? this.pdfViewer.annotationSettings.author : this.pdfViewer.areaSettings.author ? this.pdfViewer.areaSettings.author : 'Guest';
                this.pdfViewer.drawingObject = {
                    // tslint:disable-next-line:max-line-length
                    shapeAnnotationType: 'Polygon', fillColor: this.areaFillColor, notes: '', strokeColor: this.areaStrokeColor,
                    thickness: this.areaThickness, opacity: this.areaOpacity, measureType: 'Area',
                    modifiedDate: modifiedDateArea, borderStyle: '', borderDashArray: '0',
                    author: author, subject: 'Area calculation'
                };
                this.pdfViewer.tool = 'Polygon';
                break;
            case 'Radius':
                this.currentAnnotationMode = 'Radius';
                var modifiedDateRad = date.toLocaleString();
                // tslint:disable-next-line:max-line-length
                author = (this.pdfViewer.annotationSettings.author !== 'Guest') ? this.pdfViewer.annotationSettings.author : this.pdfViewer.radiusSettings.author ? this.pdfViewer.radiusSettings.author : 'Guest';
                this.pdfViewer.drawingObject = {
                    // tslint:disable-next-line:max-line-length
                    shapeAnnotationType: 'Radius', fillColor: this.radiusFillColor, notes: '', strokeColor: this.radiusStrokeColor, opacity: this.radiusOpacity,
                    thickness: this.radiusThickness, measureType: 'Radius', modifiedDate: modifiedDateRad, borderStyle: '', borderDashArray: '0',
                    author: author, subject: 'Radius calculation'
                };
                this.pdfViewer.tool = 'DrawTool';
                break;
            case 'Volume':
                this.currentAnnotationMode = 'Volume';
                var modifiedDateVol = date.toLocaleString();
                // tslint:disable-next-line:max-line-length
                author = (this.pdfViewer.annotationSettings.author !== 'Guest') ? this.pdfViewer.annotationSettings.author : this.pdfViewer.volumeSettings.author ? this.pdfViewer.volumeSettings.author : 'Guest';
                this.pdfViewer.drawingObject = {
                    // tslint:disable-next-line:max-line-length
                    shapeAnnotationType: 'Polygon', notes: '', fillColor: this.volumeFillColor, strokeColor: this.volumeStrokeColor,
                    opacity: this.volumeOpacity, thickness: this.volumeThickness, measureType: 'Volume',
                    modifiedDate: modifiedDateVol, borderStyle: '', borderDashArray: '0',
                    author: author, subject: 'Volume calculation'
                };
                this.pdfViewer.tool = 'Polygon';
                break;
        }
    };
    MeasureAnnotation.prototype.createAnnotationObject = function (annotationModel) {
        var bound;
        var labelBound;
        var annotationName = this.pdfViewer.annotation.createGUID();
        // tslint:disable-next-line:max-line-length
        var commentsDivid = this.pdfViewer.annotation.stickyNotesAnnotationModule.addComments('shape_measure', (annotationModel.pageIndex + 1), annotationModel.measureType);
        if (commentsDivid) {
            document.getElementById(commentsDivid).id = annotationName;
        }
        annotationModel.annotName = annotationName;
        annotationModel.author = this.pdfViewer.annotationModule.updateAnnotationAuthor('measure', annotationModel.subject);
        this.pdfViewer.annotation.stickyNotesAnnotationModule.addTextToComments(annotationName, annotationModel.notes);
        if (annotationModel.wrapper.bounds) {
            bound = {
                // tslint:disable-next-line:max-line-length
                left: annotationModel.wrapper.bounds.x, top: annotationModel.wrapper.bounds.y, height: annotationModel.wrapper.bounds.height, width: annotationModel.wrapper.bounds.width,
                right: annotationModel.wrapper.bounds.right, bottom: annotationModel.wrapper.bounds.bottom
            };
            labelBound = this.pdfViewer.annotationModule.inputElementModule.calculateLabelBounds(annotationModel.wrapper.bounds);
        }
        else {
            bound = { left: 0, top: 0, height: 0, width: 0, right: 0, bottom: 0 };
            labelBound = { left: 0, top: 0, height: 0, width: 0, right: 0, bottom: 0 };
        }
        // tslint:disable-next-line:radix
        var borderDashArray = parseInt(annotationModel.borderDashArray);
        borderDashArray = isNaN(borderDashArray) ? 0 : borderDashArray;
        var date = new Date();
        // tslint:disable-next-line:max-line-length
        var measure = { ratio: this.scaleRatioString, x: [this.createNumberFormat('x')], distance: [this.createNumberFormat('d')], area: [this.createNumberFormat('a')] };
        if (annotationModel.measureType === 'Volume') {
            measure.depth = this.volumeDepth;
        }
        // tslint:disable-next-line
        var annotationSettings = this.pdfViewer.annotationModule.findAnnotationSettings(annotationModel, true);
        return {
            // tslint:disable-next-line:max-line-length
            id: annotationModel.id, shapeAnnotationType: this.getShapeAnnotType(annotationModel.measureType), author: annotationModel.author,
            subject: annotationModel.subject, note: annotationModel.notes, strokeColor: annotationModel.strokeColor,
            fillColor: annotationModel.fillColor, opacity: annotationModel.opacity, thickness: annotationModel.thickness,
            // tslint:disable-next-line:max-line-length
            borderStyle: annotationModel.borderStyle, borderDashArray: borderDashArray, bounds: bound, modifiedDate: date.toLocaleString(),
            rotateAngle: 'RotateAngle' + annotationModel.rotateAngle, isCloudShape: annotationModel.isCloudShape, cloudIntensity: annotationModel.cloudIntensity,
            // tslint:disable-next-line:max-line-length
            vertexPoints: annotationModel.vertexPoints, lineHeadStart: this.pdfViewer.annotation.getArrowTypeForCollection(annotationModel.sourceDecoraterShapes),
            lineHeadEnd: this.pdfViewer.annotation.getArrowTypeForCollection(annotationModel.taregetDecoraterShapes), rectangleDifference: [], isLocked: annotationSettings.isLock,
            // tslint:disable-next-line:max-line-length
            leaderLength: annotationModel.leaderHeight, leaderLineExtension: 2, leaderLineOffset: 0, calibrate: measure, caption: true, captionPosition: 'Top',
            indent: this.getIndent(annotationModel.measureType), annotName: annotationName, comments: [], review: { state: '', stateModel: '', modifiedDate: date.toLocaleString(), author: annotationModel.author },
            // tslint:disable-next-line:max-line-length
            labelContent: annotationModel.labelContent, enableShapeLabel: annotationModel.enableShapeLabel, labelFillColor: annotationModel.labelFillColor,
            labelBorderColor: annotationModel.labelBorderColor, fontColor: annotationModel.fontColor, fontSize: annotationModel.fontSize,
            // tslint:disable-next-line:max-line-length
            labelBounds: labelBound, annotationSelectorSettings: this.getSelector(annotationModel.subject), labelSettings: this.pdfViewer.shapeLabelSettings, annotationSettings: annotationSettings,
            customData: this.pdfViewer.annotation.getMeasureData(annotationModel.subject)
        };
    };
    MeasureAnnotation.prototype.getSelector = function (type) {
        var selector = this.pdfViewer.annotationSelectorSettings;
        if ((type === 'Distance calculation') && this.pdfViewer.distanceSettings.annotationSelectorSettings) {
            selector = this.pdfViewer.distanceSettings.annotationSelectorSettings;
        }
        else if ((type === 'Perimeter calculation') && this.pdfViewer.perimeterSettings.annotationSelectorSettings) {
            selector = this.pdfViewer.perimeterSettings.annotationSelectorSettings;
            // tslint:disable-next-line:max-line-length
        }
        else if ((type === 'Area calculation') && this.pdfViewer.areaSettings.annotationSelectorSettings) {
            selector = this.pdfViewer.areaSettings.annotationSelectorSettings;
        }
        else if ((type === 'Radius calculation') && this.pdfViewer.radiusSettings.annotationSelectorSettings) {
            selector = this.pdfViewer.radiusSettings.annotationSelectorSettings;
        }
        else if ((type === 'Volume calculation') && this.pdfViewer.volumeSettings.annotationSelectorSettings) {
            selector = this.pdfViewer.volumeSettings.annotationSelectorSettings;
        }
        return selector;
    };
    MeasureAnnotation.prototype.getShapeAnnotType = function (measureType) {
        var annotationType;
        switch (measureType) {
            case 'Distance':
                annotationType = 'Line';
                break;
            case 'Perimeter':
                annotationType = 'Polyline';
                break;
            case 'Area':
            case 'Volume':
                annotationType = 'Polygon';
                break;
            case 'Radius':
                annotationType = 'Circle';
                break;
        }
        return annotationType;
    };
    MeasureAnnotation.prototype.getShapeType = function (shape) {
        var shapeType;
        if (shape.shapeAnnotationType === 'Line') {
            shapeType = 'Distance';
        }
        else if (shape.shapeAnnotationType === 'Polyline') {
            shapeType = 'LineWidthArrowHead';
        }
        else if (shape.shapeAnnotationType === 'Polygon' && shape.indent === 'PolygonDimension') {
            shapeType = 'Polygon';
            // tslint:disable-next-line:max-line-length
        }
        else if ((shape.shapeAnnotationType === 'Polygon' && shape.indent === 'PolygonRadius') || shape.shapeAnnotationType === 'Circle') {
            shapeType = 'Radius';
        }
        else if (shape.shapeAnnotationType === 'Polygon' && shape.indent === 'PolygonVolume') {
            shapeType = 'Polygon';
        }
        return shapeType;
    };
    MeasureAnnotation.prototype.getMeasureType = function (shape) {
        var measureType;
        if (shape.shapeAnnotationType === 'Line') {
            measureType = 'Distance';
        }
        else if (shape.shapeAnnotationType === 'Polyline') {
            measureType = 'Perimeter';
        }
        else if (shape.shapeAnnotationType === 'Polygon' && shape.indent === 'PolygonDimension') {
            measureType = 'Area';
            // tslint:disable-next-line:max-line-length
        }
        else if ((shape.shapeAnnotationType === 'Polygon' && shape.indent === 'PolygonRadius') || shape.shapeAnnotationType === 'Circle') {
            measureType = 'Radius';
        }
        else if (shape.shapeAnnotationType === 'Polygon' && shape.indent === 'PolygonVolume') {
            measureType = 'Volume';
        }
        return measureType;
    };
    MeasureAnnotation.prototype.getIndent = function (measureType) {
        var indent;
        switch (measureType) {
            case 'Distance':
                indent = 'LineDimension';
                break;
            case 'Perimeter':
                indent = 'PolyLineDimension';
                break;
            case 'Area':
                indent = 'PolygonDimension';
                break;
            case 'Radius':
                indent = 'PolygonRadius';
                break;
            case 'Volume':
                indent = 'PolygonVolume';
                break;
        }
        return indent;
    };
    // tslint:disable-next-line
    MeasureAnnotation.prototype.getNumberFormatArray = function (list) {
        // tslint:disable-next-line
        var numberFormatArray = new Array();
        if (list) {
            for (var i = 0; i < list.length; i++) {
                // tslint:disable-next-line:max-line-length
                numberFormatArray[i] = { unit: list[i].Unit, fractionalType: list[i].FractionalType, conversionFactor: list[i].ConversionFactor, denominator: list[i].Denominator, formatDenominator: list[i].FormatDenominator };
            }
        }
        return numberFormatArray;
    };
    MeasureAnnotation.prototype.createNumberFormat = function (type) {
        var cFactor = 1;
        var unit = this.displayUnit;
        if (type === 'x') {
            cFactor = this.getFactor(this.unit);
        }
        if (type === 'a') {
            unit = 'sq ' + this.displayUnit;
        }
        // tslint:disable-next-line:max-line-length
        var numberFormat = { unit: unit, fractionalType: 'D', conversionFactor: cFactor, denominator: 100, formatDenominator: false };
        return numberFormat;
    };
    /**
     * @private
     */
    MeasureAnnotation.prototype.saveMeasureShapeAnnotations = function () {
        // tslint:disable-next-line
        var storeObject = window.sessionStorage.getItem(this.pdfViewerBase.documentId + '_annotations_shape_measure');
        if (this.pdfViewerBase.isStorageExceed) {
            storeObject = this.pdfViewerBase.annotationStorage[this.pdfViewerBase.documentId + '_annotations_shape_measure'];
        }
        // tslint:disable-next-line
        var annotations = new Array();
        var colorpick = new ColorPicker();
        for (var j = 0; j < this.pdfViewerBase.pageCount; j++) {
            annotations[j] = [];
        }
        if (storeObject && !this.pdfViewer.annotationSettings.skipDownload) {
            var annotationCollection = JSON.parse(storeObject);
            for (var i = 0; i < annotationCollection.length; i++) {
                var newArray = [];
                var pageAnnotationObject = annotationCollection[i];
                if (pageAnnotationObject) {
                    for (var z = 0; pageAnnotationObject.annotations.length > z; z++) {
                        this.pdfViewer.annotationModule.updateModifiedDate(pageAnnotationObject.annotations[z]);
                        // tslint:disable-next-line:max-line-length
                        pageAnnotationObject.annotations[z].bounds = JSON.stringify(this.pdfViewer.annotation.getBounds(pageAnnotationObject.annotations[z].bounds, pageAnnotationObject.pageIndex));
                        var strokeColorString = pageAnnotationObject.annotations[z].strokeColor;
                        pageAnnotationObject.annotations[z].strokeColor = JSON.stringify(this.getRgbCode(strokeColorString));
                        var fillColorString = pageAnnotationObject.annotations[z].fillColor;
                        pageAnnotationObject.annotations[z].fillColor = JSON.stringify(this.getRgbCode(fillColorString));
                        // tslint:disable-next-line:max-line-length
                        pageAnnotationObject.annotations[z].vertexPoints = JSON.stringify(this.pdfViewer.annotation.getVertexPoints(pageAnnotationObject.annotations[z].vertexPoints, pageAnnotationObject.pageIndex));
                        if (pageAnnotationObject.annotations[z].rectangleDifference !== null) {
                            // tslint:disable-next-line:max-line-length
                            pageAnnotationObject.annotations[z].rectangleDifference = JSON.stringify(pageAnnotationObject.annotations[z].rectangleDifference);
                        }
                        // tslint:disable-next-line:max-line-length
                        pageAnnotationObject.annotations[z].calibrate = this.getStringifiedMeasure(pageAnnotationObject.annotations[z].calibrate);
                        if (pageAnnotationObject.annotations[z].enableShapeLabel === true) {
                            // tslint:disable-next-line:max-line-length
                            pageAnnotationObject.annotations[z].labelBounds = JSON.stringify(this.pdfViewer.annotationModule.inputElementModule.calculateLabelBounds(JSON.parse(pageAnnotationObject.annotations[z].bounds)));
                            var labelFillColorString = pageAnnotationObject.annotations[z].labelFillColor;
                            pageAnnotationObject.annotations[z].labelFillColor = JSON.stringify(this.getRgbCode(labelFillColorString));
                            var labelBorderColorString = pageAnnotationObject.annotations[z].labelBorderColor;
                            pageAnnotationObject.annotations[z].labelBorderColor = JSON.stringify(this.getRgbCode(labelBorderColorString));
                            var fontColorString = pageAnnotationObject.annotations[z].fontColor;
                            pageAnnotationObject.annotations[z].fontColor = JSON.stringify(this.getRgbCode(fontColorString));
                        }
                    }
                    newArray = pageAnnotationObject.annotations;
                }
                annotations[pageAnnotationObject.pageIndex] = newArray;
            }
        }
        return JSON.stringify(annotations);
    };
    /**
     * @private
     */
    MeasureAnnotation.prototype.createScaleRatioWindow = function () {
        var _this = this;
        var elementID = this.pdfViewer.element.id;
        var dialogDiv = createElement('div', { id: elementID + '_scale_ratio_window', className: 'e-pv-scale-ratio-window' });
        this.pdfViewerBase.pageContainer.appendChild(dialogDiv);
        var contentElement = this.createRatioUI();
        this.scaleRatioDialog = new Dialog({
            showCloseIcon: true, closeOnEscape: false, isModal: true, header: this.pdfViewer.localeObj.getConstant('Scale Ratio'),
            target: this.pdfViewer.element, content: contentElement, close: function () {
                _this.sourceTextBox.destroy();
                _this.convertUnit.destroy();
                _this.destTextBox.destroy();
                _this.dispUnit.destroy();
                _this.scaleRatioDialog.destroy();
                var dialogElement = _this.pdfViewerBase.getElement('_scale_ratio_window');
                dialogElement.parentElement.removeChild(dialogElement);
            }
        });
        if (!Browser.isDevice) {
            this.scaleRatioDialog.buttons = [
                // tslint:disable-next-line:max-line-length
                { buttonModel: { content: this.pdfViewer.localeObj.getConstant('OK'), isPrimary: true }, click: this.onOkClicked.bind(this) },
                { buttonModel: { content: this.pdfViewer.localeObj.getConstant('Cancel') }, click: this.onCancelClicked.bind(this) }
            ];
        }
        else {
            this.scaleRatioDialog.buttons = [
                { buttonModel: { content: this.pdfViewer.localeObj.getConstant('Cancel') }, click: this.onCancelClicked.bind(this) },
                // tslint:disable-next-line:max-line-length
                { buttonModel: { content: this.pdfViewer.localeObj.getConstant('OK'), isPrimary: true }, click: this.onOkClicked.bind(this) }
            ];
        }
        if (this.pdfViewer.enableRtl) {
            this.scaleRatioDialog.enableRtl = true;
        }
        this.scaleRatioDialog.appendTo(dialogDiv);
        this.convertUnit.content = this.createContent(this.unit).outerHTML;
        this.dispUnit.content = this.createContent(this.displayUnit).outerHTML;
        this.depthUnit.content = this.createContent(this.displayUnit).outerHTML;
    };
    MeasureAnnotation.prototype.createRatioUI = function () {
        var element = createElement('div');
        var elementID = this.pdfViewer.element.id;
        // tslint:disable-next-line:max-line-length
        var items = [{ text: 'pt' }, { text: 'in' }, { text: 'mm' }, { text: 'cm' }, { text: 'p' }, { text: 'ft' }, { text: 'ft_in' }, { text: 'm' }];
        var labelText = createElement('div', { id: elementID + '_scale_ratio_label', className: 'e-pv-scale-ratio-text' });
        labelText.textContent = this.pdfViewer.localeObj.getConstant('Scale Ratio');
        element.appendChild(labelText);
        var sourceContainer = createElement('div', { id: elementID + '_scale_src_container' });
        element.appendChild(sourceContainer);
        // tslint:disable-next-line:max-line-length
        var srcInputElement = this.createInputElement('input', 'e-pv-scale-ratio-src-input', elementID + '_src_input', sourceContainer);
        this.sourceTextBox = new NumericTextBox({ value: 1, format: '##', cssClass: 'e-pv-scale-ratio-src-input', min: 1, max: 100 }, srcInputElement);
        // tslint:disable-next-line:max-line-length
        var srcUnitElement = this.createInputElement('button', 'e-pv-scale-ratio-src-unit', elementID + '_src_unit', sourceContainer);
        this.convertUnit = new DropDownButton({ items: items, cssClass: 'e-pv-scale-ratio-src-unit' }, srcUnitElement);
        this.convertUnit.select = this.convertUnitSelect.bind(this);
        var destinationContainer = createElement('div', { id: elementID + '_scale_dest_container' });
        // tslint:disable-next-line:max-line-length
        var destInputElement = this.createInputElement('input', 'e-pv-scale-ratio-dest-input', elementID + '_dest_input', destinationContainer);
        this.destTextBox = new NumericTextBox({ value: 1, format: '##', cssClass: 'e-pv-scale-ratio-dest-input', min: 1, max: 100 }, destInputElement);
        // tslint:disable-next-line:max-line-length
        var destUnitElement = this.createInputElement('button', 'e-pv-scale-ratio-dest-unit', elementID + '_dest_unit', destinationContainer);
        this.dispUnit = new DropDownButton({ items: items, cssClass: 'e-pv-scale-ratio-dest-unit' }, destUnitElement);
        this.dispUnit.select = this.dispUnitSelect.bind(this);
        element.appendChild(destinationContainer);
        var depthLabelText = createElement('div', { id: elementID + '_depth_label', className: 'e-pv-depth-text' });
        depthLabelText.textContent = this.pdfViewer.localeObj.getConstant('Depth');
        element.appendChild(depthLabelText);
        var depthContainer = createElement('div', { id: elementID + '_depth_container' });
        element.appendChild(depthContainer);
        // tslint:disable-next-line:max-line-length
        var depthInputElement = this.createInputElement('input', 'e-pv-depth-input', elementID + '_depth_input', depthContainer);
        this.depthTextBox = new NumericTextBox({ value: this.volumeDepth, format: '##', cssClass: 'e-pv-depth-input', min: 1 }, depthInputElement);
        // tslint:disable-next-line:max-line-length
        var depthUnitElement = this.createInputElement('button', 'e-pv-depth-unit', elementID + '_depth_unit', depthContainer);
        this.depthUnit = new DropDownButton({ items: items, cssClass: 'e-pv-depth-unit' }, depthUnitElement);
        this.depthUnit.select = this.depthUnitSelect.bind(this);
        return element;
    };
    MeasureAnnotation.prototype.convertUnitSelect = function (args) {
        this.convertUnit.content = this.createContent(args.item.text).outerHTML;
    };
    MeasureAnnotation.prototype.dispUnitSelect = function (args) {
        this.dispUnit.content = this.createContent(args.item.text).outerHTML;
        this.depthUnit.content = this.createContent(args.item.text).outerHTML;
    };
    MeasureAnnotation.prototype.depthUnitSelect = function (args) {
        this.depthUnit.content = this.createContent(args.item.text).outerHTML;
    };
    MeasureAnnotation.prototype.createContent = function (text) {
        var divElement = createElement('div', { className: 'e-pv-scale-unit-content' });
        divElement.textContent = text;
        return divElement;
    };
    MeasureAnnotation.prototype.createInputElement = function (input, className, idString, parentElement) {
        var container = createElement('div', { id: idString + '_container', className: className + '-container' });
        var textBoxInput = createElement(input, { id: idString });
        if (input === 'input') {
            textBoxInput.type = 'text';
        }
        container.appendChild(textBoxInput);
        parentElement.appendChild(container);
        return textBoxInput;
    };
    MeasureAnnotation.prototype.onOkClicked = function () {
        this.unit = this.getContent(this.convertUnit.content);
        this.displayUnit = this.getContent(this.dispUnit.content);
        this.ratio = this.destTextBox.value / this.sourceTextBox.value;
        this.volumeDepth = this.depthTextBox.value;
        this.scaleRatioString = this.sourceTextBox.value + ' ' + this.unit + ' = ' + this.destTextBox.value + ' ' + this.displayUnit;
        this.scaleRatioDialog.hide();
        this.updateMeasureValues(this.scaleRatioString, this.displayUnit, this.unit, this.volumeDepth);
    };
    /**
     * @private
     */
    MeasureAnnotation.prototype.updateMeasureValues = function (ratio, displayUnit, conversionUnit, depth) {
        this.scaleRatioString = ratio;
        this.displayUnit = displayUnit;
        this.unit = conversionUnit;
        this.volumeDepth = depth;
        for (var i = 0; i < this.pdfViewerBase.pageCount; i++) {
            var pageAnnotations = this.getAnnotations(i, null);
            if (pageAnnotations) {
                for (var j = 0; j < pageAnnotations.length; j++) {
                    pageAnnotations = this.getAnnotations(i, null);
                    var measureObject = pageAnnotations[j];
                    measureObject.calibrate.ratio = ratio;
                    measureObject.calibrate.x[0].unit = displayUnit;
                    measureObject.calibrate.distance[0].unit = displayUnit;
                    measureObject.calibrate.area[0].unit = displayUnit;
                    measureObject.calibrate.x[0].conversionFactor = this.getFactor(conversionUnit);
                    if (measureObject.indent === 'PolygonVolume') {
                        measureObject.calibrate.depth = depth;
                    }
                    pageAnnotations[j] = measureObject;
                    this.manageAnnotations(pageAnnotations, i);
                    this.pdfViewer.annotation.updateCalibrateValues(this.getAnnotationBaseModel(measureObject.id));
                }
            }
            this.pdfViewer.annotation.renderAnnotations(i, null, null, null, null, false);
        }
    };
    MeasureAnnotation.prototype.getAnnotationBaseModel = function (id) {
        var annotationBase = null;
        for (var i = 0; i < this.pdfViewer.annotations.length; i++) {
            if (id === this.pdfViewer.annotations[i].id) {
                annotationBase = this.pdfViewer.annotations[i];
                break;
            }
        }
        return annotationBase;
    };
    MeasureAnnotation.prototype.getContent = function (unit) {
        return unit.split('</div>')[0].split('">')[1];
    };
    /**
     * @private
     */
    // tslint:disable-next-line
    MeasureAnnotation.prototype.setConversion = function (value, currentAnnot) {
        // tslint:disable-next-line
        var values;
        if (currentAnnot) {
            var pageIndex = currentAnnot.pageIndex;
            if (currentAnnot.id === 'diagram_helper') {
                pageIndex = currentAnnot.pageIndex ? currentAnnot.pageIndex : this.pdfViewerBase.activeElements.activePageID;
                currentAnnot = this.getCurrentObject(pageIndex, null, currentAnnot.annotName);
            }
            if (currentAnnot) {
                values = this.getCurrentValues(currentAnnot.id, pageIndex);
            }
            else {
                values = this.getCurrentValues();
            }
        }
        else {
            values = this.getCurrentValues();
        }
        var scaledValue = value * values.ratio;
        return this.convertPointToUnits(values.factor, scaledValue, values.unit);
    };
    MeasureAnnotation.prototype.onCancelClicked = function () {
        this.scaleRatioDialog.hide();
    };
    /**
     * @private
     */
    // tslint:disable-next-line
    MeasureAnnotation.prototype.modifyInCollection = function (property, pageNumber, annotationBase, isNewlyAdded) {
        if (!isNewlyAdded) {
            this.pdfViewer.isDocumentEdited = true;
        }
        var currentAnnotObject = null;
        var pageAnnotations = this.getAnnotations(pageNumber, null);
        if (pageAnnotations != null && annotationBase) {
            for (var i = 0; i < pageAnnotations.length; i++) {
                if (annotationBase.id === pageAnnotations[i].id) {
                    var date = new Date();
                    if (property === 'bounds') {
                        this.pdfViewer.annotationModule.stickyNotesAnnotationModule.updateAnnotationModifiedDate(annotationBase, true);
                        if (pageAnnotations[i].shapeAnnotationType === 'Line' || pageAnnotations[i].shapeAnnotationType === 'Polyline') {
                            pageAnnotations[i].vertexPoints = annotationBase.vertexPoints;
                        }
                        else if (pageAnnotations[i].shapeAnnotationType === 'Polygon') {
                            pageAnnotations[i].vertexPoints = annotationBase.vertexPoints;
                            // tslint:disable-next-line:max-line-length
                            pageAnnotations[i].bounds = { left: annotationBase.bounds.x, top: annotationBase.bounds.y, width: annotationBase.bounds.width, height: annotationBase.bounds.height, right: annotationBase.bounds.right, bottom: annotationBase.bounds.bottom };
                        }
                        else {
                            // tslint:disable-next-line:max-line-length
                            pageAnnotations[i].bounds = { left: annotationBase.bounds.x, top: annotationBase.bounds.y, width: annotationBase.bounds.width, height: annotationBase.bounds.height, right: annotationBase.bounds.right, bottom: annotationBase.bounds.bottom };
                        }
                        if (pageAnnotations[i].enableShapeLabel === true && annotationBase.wrapper) {
                            // tslint:disable-next-line:max-line-length
                            pageAnnotations[i].labelBounds = this.pdfViewer.annotationModule.inputElementModule.calculateLabelBounds(annotationBase.wrapper.bounds);
                        }
                        pageAnnotations[i].modifiedDate = date.toLocaleString();
                    }
                    else if (property === 'fill') {
                        pageAnnotations[i].fillColor = annotationBase.wrapper.children[0].style.fill;
                        pageAnnotations[i].modifiedDate = date.toLocaleString();
                    }
                    else if (property === 'stroke') {
                        pageAnnotations[i].strokeColor = annotationBase.wrapper.children[0].style.strokeColor;
                        pageAnnotations[i].modifiedDate = date.toLocaleString();
                    }
                    else if (property === 'opacity') {
                        pageAnnotations[i].opacity = annotationBase.wrapper.children[0].style.opacity;
                        pageAnnotations[i].modifiedDate = date.toLocaleString();
                    }
                    else if (property === 'thickness') {
                        pageAnnotations[i].thickness = annotationBase.wrapper.children[0].style.strokeWidth;
                        pageAnnotations[i].modifiedDate = date.toLocaleString();
                    }
                    else if (property === 'dashArray') {
                        pageAnnotations[i].borderDashArray = annotationBase.wrapper.children[0].style.strokeDashArray;
                        pageAnnotations[i].borderStyle = annotationBase.borderStyle;
                        pageAnnotations[i].modifiedDate = date.toLocaleString();
                    }
                    else if (property === 'startArrow') {
                        // tslint:disable-next-line:max-line-length
                        pageAnnotations[i].lineHeadStart = this.pdfViewer.annotation.getArrowTypeForCollection(annotationBase.sourceDecoraterShapes);
                        pageAnnotations[i].modifiedDate = date.toLocaleString();
                    }
                    else if (property === 'endArrow') {
                        // tslint:disable-next-line:max-line-length
                        pageAnnotations[i].lineHeadEnd = this.pdfViewer.annotation.getArrowTypeForCollection(annotationBase.taregetDecoraterShapes);
                        pageAnnotations[i].modifiedDate = date.toLocaleString();
                    }
                    else if (property === 'leaderLength') {
                        pageAnnotations[i].leaderLength = annotationBase.leaderHeight;
                        pageAnnotations[i].modifiedDate = date.toLocaleString();
                    }
                    else if (property === 'notes') {
                        pageAnnotations[i].note = annotationBase.notes;
                        pageAnnotations[i].modifiedDate = date.toLocaleString();
                        if (pageAnnotations[i].enableShapeLabel === true) {
                            pageAnnotations[i].labelContent = annotationBase.notes;
                        }
                    }
                    else if (property === 'delete') {
                        currentAnnotObject = pageAnnotations.splice(i, 1)[0];
                        break;
                    }
                    else if (property === 'labelContent') {
                        pageAnnotations[i].note = annotationBase.labelContent;
                        pageAnnotations[i].labelContent = annotationBase.labelContent;
                        pageAnnotations[i].modifiedDate = date.toLocaleString();
                        break;
                    }
                    else if (property === 'fontColor') {
                        pageAnnotations[i].fontColor = annotationBase.fontColor;
                        pageAnnotations[i].modifiedDate = date.toLocaleString();
                    }
                    else if (property === 'fontSize') {
                        pageAnnotations[i].fontSize = annotationBase.fontSize;
                        pageAnnotations[i].modifiedDate = date.toLocaleString();
                    }
                    this.pdfViewer.annotationModule.storeAnnotationCollections(pageAnnotations[i], pageNumber);
                }
            }
            this.manageAnnotations(pageAnnotations, pageNumber);
        }
        return currentAnnotObject;
    };
    /**
     * @private
     */
    MeasureAnnotation.prototype.addInCollection = function (pageNumber, annotationBase) {
        var pageAnnotations = this.getAnnotations(pageNumber, null);
        if (pageAnnotations) {
            pageAnnotations.push(annotationBase);
        }
        this.manageAnnotations(pageAnnotations, pageNumber);
    };
    MeasureAnnotation.prototype.manageAnnotations = function (pageAnnotations, pageNumber) {
        // tslint:disable-next-line
        var storeObject = window.sessionStorage.getItem(this.pdfViewerBase.documentId + '_annotations_shape_measure');
        if (this.pdfViewerBase.isStorageExceed) {
            storeObject = this.pdfViewerBase.annotationStorage[this.pdfViewerBase.documentId + '_annotations_shape_measure'];
        }
        if (storeObject) {
            var annotObject = JSON.parse(storeObject);
            if (!this.pdfViewerBase.isStorageExceed) {
                window.sessionStorage.removeItem(this.pdfViewerBase.documentId + '_annotations_shape_measure');
            }
            var index = this.pdfViewer.annotationModule.getPageCollection(annotObject, pageNumber);
            if (annotObject[index]) {
                annotObject[index].annotations = pageAnnotations;
            }
            var annotationStringified = JSON.stringify(annotObject);
            if (this.pdfViewerBase.isStorageExceed) {
                this.pdfViewerBase.annotationStorage[this.pdfViewerBase.documentId + '_annotations_shape_measure'] = annotationStringified;
            }
            else {
                window.sessionStorage.setItem(this.pdfViewerBase.documentId + '_annotations_shape_measure', annotationStringified);
            }
        }
    };
    // tslint:disable-next-line
    MeasureAnnotation.prototype.getAnnotations = function (pageIndex, shapeAnnotations) {
        // tslint:disable-next-line
        var annotationCollection;
        // tslint:disable-next-line
        var storeObject = window.sessionStorage.getItem(this.pdfViewerBase.documentId + '_annotations_shape_measure');
        if (this.pdfViewerBase.isStorageExceed) {
            storeObject = this.pdfViewerBase.annotationStorage[this.pdfViewerBase.documentId + '_annotations_shape_measure'];
        }
        if (storeObject) {
            var annotObject = JSON.parse(storeObject);
            var index = this.pdfViewer.annotationModule.getPageCollection(annotObject, pageIndex);
            if (annotObject[index]) {
                annotationCollection = annotObject[index].annotations;
            }
            else {
                annotationCollection = shapeAnnotations;
            }
        }
        else {
            annotationCollection = shapeAnnotations;
        }
        return annotationCollection;
    };
    MeasureAnnotation.prototype.getCurrentObject = function (pageNumber, id, annotName) {
        var currentAnnotObject = null;
        var pageAnnotations = this.getAnnotations(pageNumber, null);
        if (pageAnnotations != null) {
            for (var i = 0; i < pageAnnotations.length; i++) {
                if (id) {
                    if (id === pageAnnotations[i].id) {
                        currentAnnotObject = pageAnnotations[i];
                        break;
                    }
                }
                else if (annotName) {
                    if (annotName === pageAnnotations[i].annotName) {
                        currentAnnotObject = pageAnnotations[i];
                        break;
                    }
                }
            }
        }
        return currentAnnotObject;
    };
    // tslint:disable-next-line
    MeasureAnnotation.prototype.getCurrentValues = function (id, pageNumber) {
        var ratio;
        var unit;
        var factor;
        var depth;
        if (id && !isNaN(pageNumber)) {
            var currentAnnotObject = this.getCurrentObject(pageNumber, id);
            if (currentAnnotObject) {
                ratio = this.getCurrentRatio(currentAnnotObject.calibrate.ratio);
                unit = currentAnnotObject.calibrate.x[0].unit;
                factor = currentAnnotObject.calibrate.x[0].conversionFactor;
                depth = currentAnnotObject.calibrate.depth;
            }
            else {
                ratio = this.ratio;
                unit = this.displayUnit;
                factor = this.getFactor(this.unit);
                depth = this.volumeDepth;
            }
        }
        else {
            ratio = this.ratio;
            unit = this.displayUnit;
            factor = this.getFactor(this.unit);
            depth = this.volumeDepth;
        }
        return { ratio: ratio, unit: unit, factor: factor, depth: depth };
    };
    MeasureAnnotation.prototype.getCurrentRatio = function (ratioString) {
        var stringArray = ratioString.split(' ');
        if (stringArray[3] === '=') {
            return parseFloat(stringArray[4]) / parseFloat(stringArray[0]);
        }
        else {
            return parseFloat(stringArray[3]) / parseFloat(stringArray[0]);
        }
    };
    /**
     * @private
     */
    MeasureAnnotation.prototype.calculateArea = function (points, id, pageNumber) {
        // tslint:disable-next-line
        var values = this.getCurrentValues(id, pageNumber);
        var area = this.getArea(points, values.factor) * values.ratio;
        if (values.unit === 'ft_in') {
            // tslint:disable-next-line
            var calculateValue = Math.round(area * 100) / 100;
            if (calculateValue >= 12) {
                calculateValue = (Math.round(calculateValue / 12 * 100) / 100).toString();
                calculateValue = calculateValue.split('.');
                if (calculateValue[1]) {
                    // tslint:disable-next-line
                    var inchValue = 0;
                    if (calculateValue[1].charAt(1)) {
                        // tslint:disable-next-line
                        inchValue = parseInt(calculateValue[1].charAt(0)) + '.' + parseInt(calculateValue[1].charAt(1));
                        inchValue = Math.round(inchValue);
                    }
                    else {
                        inchValue = calculateValue[1];
                    }
                    if (!inchValue) {
                        return (calculateValue[0] + ' sq ft');
                    }
                    else {
                        return (calculateValue[0] + ' sq ft ' + inchValue + ' in');
                    }
                }
                else {
                    return (calculateValue[0] + ' sq ft');
                }
            }
            else {
                return (Math.round(area * 100) / 100) + ' sq in';
            }
        }
        if (values.unit === 'm') {
            return ((area * 100) / 100) + ' sq ' + values.unit;
        }
        return (Math.round(area * 100) / 100) + ' sq ' + values.unit;
    };
    MeasureAnnotation.prototype.getArea = function (points, factor) {
        var area = 0;
        var j = points.length - 1;
        for (var i = 0; i < points.length; i++) {
            // tslint:disable-next-line:max-line-length
            area += (points[j].x * this.pixelToPointFactor * factor + points[i].x * this.pixelToPointFactor * factor) * (points[j].y * this.pixelToPointFactor * factor - points[i].y * this.pixelToPointFactor * factor);
            j = i;
        }
        return (Math.abs((area) / 2.0));
    };
    /**
     * @private
     */
    MeasureAnnotation.prototype.calculateVolume = function (points, id, pageNumber) {
        // tslint:disable-next-line
        var values = this.getCurrentValues(id, pageNumber);
        var depth = values.depth ? values.depth : this.volumeDepth;
        var area = this.getArea(points, values.factor);
        var volume = area * ((depth * this.convertUnitToPoint(values.unit)) * values.factor) * values.ratio;
        if (values.unit === 'ft_in') {
            // tslint:disable-next-line
            var calculateValue = Math.round(volume * 100) / 100;
            if (calculateValue >= 12) {
                calculateValue = (Math.round(calculateValue / 12 * 100) / 100).toString();
                calculateValue = calculateValue.split('.');
                if (calculateValue[1]) {
                    // tslint:disable-next-line
                    var inchValue = 0;
                    if (calculateValue[1].charAt(1)) {
                        // tslint:disable-next-line
                        inchValue = parseInt(calculateValue[1].charAt(0)) + '.' + parseInt(calculateValue[1].charAt(1));
                        inchValue = Math.round(inchValue);
                    }
                    else {
                        inchValue = calculateValue[1];
                    }
                    if (!inchValue) {
                        return (calculateValue[0] + ' cu ft');
                    }
                    else {
                        return (calculateValue[0] + ' cu ft ' + inchValue + ' in');
                    }
                }
                else {
                    return (calculateValue[0] + ' cu ft');
                }
            }
            else {
                return (Math.round(volume * 100) / 100) + ' cu in';
            }
        }
        return (Math.round(volume * 100) / 100) + ' cu ' + values.unit;
    };
    /**
     * @private
     */
    MeasureAnnotation.prototype.calculatePerimeter = function (pdfAnnotationBase) {
        var perimeter = Point.getLengthFromListOfPoints(pdfAnnotationBase.vertexPoints);
        return this.setConversion(perimeter * this.pixelToPointFactor, pdfAnnotationBase);
    };
    MeasureAnnotation.prototype.getFactor = function (unit) {
        var factor;
        switch (unit) {
            case 'in':
                factor = (1 / 72);
                break;
            case 'cm':
                factor = (1 / 28.346);
                break;
            case 'mm':
                factor = (1 / 2.835);
                break;
            case 'pt':
                factor = 1;
                break;
            case 'p':
                factor = 1 / 12;
                break;
            case 'ft':
                factor = 1 / 864;
                break;
            case 'ft_in':
                factor = 1 / 72;
                break;
            case 'm':
                factor = (1 / 2834.64567);
                break;
        }
        return factor;
    };
    MeasureAnnotation.prototype.convertPointToUnits = function (factor, value, unit) {
        var convertedValue;
        if (unit === 'ft_in') {
            // tslint:disable-next-line
            var calculateValue = Math.round((value * factor) * 100) / 100;
            if (calculateValue >= 12) {
                calculateValue = (Math.round(calculateValue / 12 * 100) / 100).toString();
                calculateValue = calculateValue.split('.');
                if (calculateValue[1]) {
                    // tslint:disable-next-line
                    var inchValue = 0;
                    if (calculateValue[1].charAt(1)) {
                        // tslint:disable-next-line
                        inchValue = parseInt(calculateValue[1].charAt(0)) + '.' + parseInt(calculateValue[1].charAt(1));
                        inchValue = Math.round(inchValue);
                    }
                    else {
                        inchValue = calculateValue[1];
                    }
                    if (!inchValue) {
                        convertedValue = calculateValue[0] + ' ft';
                    }
                    else {
                        convertedValue = calculateValue[0] + ' ft ' + inchValue + ' in';
                    }
                }
                else {
                    convertedValue = calculateValue[0] + ' ft';
                }
            }
            else {
                convertedValue = Math.round((value * factor) * 100) / 100 + '  in';
            }
        }
        else {
            convertedValue = Math.round((value * factor) * 100) / 100 + ' ' + unit;
        }
        return convertedValue;
    };
    MeasureAnnotation.prototype.convertUnitToPoint = function (unit) {
        var factor;
        switch (unit) {
            case 'in':
                factor = 72;
                break;
            case 'cm':
                factor = 28.346;
                break;
            case 'mm':
                factor = 2.835;
                break;
            case 'pt':
                factor = 1;
                break;
            case 'p':
                factor = 12;
                break;
            case 'ft':
                factor = 864;
                break;
            case 'ft_in':
                factor = 72;
                break;
            case 'm':
                factor = 2834.64567;
                break;
        }
        return factor;
    };
    // tslint:disable-next-line
    MeasureAnnotation.prototype.getStringifiedMeasure = function (measure) {
        if (!isNullOrUndefined(measure)) {
            measure.angle = JSON.stringify(measure.angle);
            measure.area = JSON.stringify(measure.area);
            measure.distance = JSON.stringify(measure.distance);
            measure.volume = JSON.stringify(measure.volume);
        }
        return JSON.stringify(measure);
    };
    // tslint:disable-next-line
    MeasureAnnotation.prototype.getRgbCode = function (colorString) {
        if (!colorString.match(/#([a-z0-9]+)/gi) && !colorString.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/)) {
            colorString = this.pdfViewer.annotationModule.nameToHash(colorString);
        }
        var stringArray = colorString.split(',');
        if (isNullOrUndefined(stringArray[1])) {
            var colorpick = new ColorPicker();
            colorString = colorpick.getValue(colorString, 'rgba');
            stringArray = colorString.split(',');
        }
        // tslint:disable-next-line:radix
        var r = parseInt(stringArray[0].split('(')[1]);
        // tslint:disable-next-line:radix
        var g = parseInt(stringArray[1]);
        // tslint:disable-next-line:radix
        var b = parseInt(stringArray[2]);
        // tslint:disable-next-line:radix
        var a = parseInt(stringArray[3]);
        return { r: r, g: g, b: b, a: a };
    };
    /**
     * @private
     */
    // tslint:disable-next-line
    MeasureAnnotation.prototype.saveImportedMeasureAnnotations = function (annotation, pageNumber) {
        var annotationObject = null;
        var vertexPoints = null;
        if (annotation.VertexPoints) {
            vertexPoints = [];
            for (var j = 0; j < annotation.VertexPoints.length; j++) {
                var point = { x: annotation.VertexPoints[j].X, y: annotation.VertexPoints[j].Y };
                vertexPoints.push(point);
            }
        }
        var measureObject = {
            // tslint:disable-next-line:max-line-length
            ratio: annotation.Calibrate.Ratio, x: this.getNumberFormatArray(annotation.Calibrate.X), distance: this.getNumberFormatArray(annotation.Calibrate.Distance), area: this.getNumberFormatArray(annotation.Calibrate.Area), angle: this.getNumberFormatArray(annotation.Calibrate.Angle), volume: this.getNumberFormatArray(annotation.Calibrate.Volume),
            targetUnitConversion: annotation.Calibrate.TargetUnitConversion
        };
        if (annotation.Calibrate.Depth) {
            measureObject.depth = annotation.Calibrate.Depth;
        }
        if (annotation.Bounds && annotation.EnableShapeLabel === true) {
            // tslint:disable-next-line:max-line-length
            annotation.LabelBounds = this.pdfViewer.annotationModule.inputElementModule.calculateLabelBoundsFromLoadedDocument(annotation.Bounds);
            annotation.LabelBorderColor = annotation.LabelBorderColor ? annotation.LabelBorderColor : annotation.StrokeColor;
            annotation.FontColor = annotation.FontColor ? annotation.FontColor : annotation.StrokeColor;
            annotation.LabelFillColor = annotation.LabelFillColor ? annotation.LabelFillColor : annotation.FillColor;
            annotation.FontSize = annotation.FontSize ? annotation.FontSize : 16;
            annotation.LabelSettings = annotation.LabelSettings ? annotation.LabelSettings : this.pdfViewer.shapeLabelSettings;
        }
        // tslint:disable-next-line:max-line-length
        annotation.AnnotationSettings = annotation.AnnotationSettings ? annotation.AnnotationSettings : this.pdfViewer.annotationModule.updateAnnotationSettings(annotation);
        annotation.Author = this.pdfViewer.annotationModule.updateAnnotationAuthor('measure', annotation.Subject);
        annotationObject = {
            // tslint:disable-next-line:max-line-length
            id: 'measure', shapeAnnotationType: annotation.ShapeAnnotationType, author: annotation.Author, modifiedDate: annotation.ModifiedDate, subject: annotation.Subject,
            note: annotation.Note, strokeColor: annotation.StrokeColor, fillColor: annotation.FillColor, opacity: annotation.Opacity, thickness: annotation.Thickness, rectangleDifference: annotation.RectangleDifference,
            // tslint:disable-next-line:max-line-length
            borderStyle: annotation.BorderStyle, borderDashArray: annotation.BorderDashArray, rotateAngle: annotation.RotateAngle, isCloudShape: annotation.IsCloudShape,
            cloudIntensity: annotation.CloudIntensity, vertexPoints: vertexPoints, lineHeadStart: annotation.LineHeadStart, lineHeadEnd: annotation.LineHeadEnd, isLocked: annotation.IsLocked,
            // tslint:disable-next-line:max-line-length
            bounds: { left: annotation.Bounds.X, top: annotation.Bounds.Y, width: annotation.Bounds.Width, height: annotation.Bounds.Height, right: annotation.Bounds.Right, bottom: annotation.Bounds.Bottom },
            caption: annotation.Caption, captionPosition: annotation.CaptionPosition, calibrate: measureObject, leaderLength: annotation.LeaderLength, leaderLineExtension: annotation.LeaderLineExtension,
            // tslint:disable-next-line:max-line-length
            leaderLineOffset: annotation.LeaderLineOffset, indent: annotation.Indent, annotName: annotation.AnnotName, comments: this.pdfViewer.annotationModule.getAnnotationComments(annotation.Comments, annotation, annotation.Author),
            review: { state: annotation.State, stateModel: annotation.StateModel, modifiedDate: annotation.ModifiedDate, author: annotation.Author },
            labelContent: annotation.LabelContent, enableShapeLabel: annotation.EnableShapeLabel, labelFillColor: annotation.LabelFillColor,
            labelBorderColor: annotation.LabelBorderColor, fontColor: annotation.FontColor, fontSize: annotation.FontSize,
            // tslint:disable-next-line:max-line-length
            labelBounds: annotation.LabelBounds, annotationSelectorSettings: this.getSettings(annotation), labelSettings: annotation.LabelSettings, annotationSettings: annotation.AnnotationSettings,
            customData: this.pdfViewer.annotation.getCustomData(annotation)
        };
        this.pdfViewer.annotationModule.storeAnnotations(pageNumber, annotationObject, '_annotations_shape_measure');
    };
    /**
     * @private
     */
    // tslint:disable-next-line
    MeasureAnnotation.prototype.updateMeasureAnnotationCollections = function (annotation, pageNumber) {
        // tslint:disable-next-line
        var annotationObject = null;
        var vertexPoints = null;
        if (annotation.VertexPoints) {
            vertexPoints = [];
            for (var j = 0; j < annotation.VertexPoints.length; j++) {
                var point = { x: annotation.VertexPoints[j].X, y: annotation.VertexPoints[j].Y };
                vertexPoints.push(point);
            }
        }
        var measureObject = {
            // tslint:disable-next-line:max-line-length
            ratio: annotation.Calibrate.Ratio, x: this.getNumberFormatArray(annotation.Calibrate.X), distance: this.getNumberFormatArray(annotation.Calibrate.Distance), area: this.getNumberFormatArray(annotation.Calibrate.Area), angle: this.getNumberFormatArray(annotation.Calibrate.Angle), volume: this.getNumberFormatArray(annotation.Calibrate.Volume),
            targetUnitConversion: annotation.Calibrate.TargetUnitConversion
        };
        if (annotation.Calibrate.Depth) {
            measureObject.depth = annotation.Calibrate.Depth;
        }
        if (annotation.Bounds && annotation.EnableShapeLabel === true) {
            // tslint:disable-next-line:max-line-length
            annotation.LabelBounds = this.pdfViewer.annotationModule.inputElementModule.calculateLabelBoundsFromLoadedDocument(annotation.Bounds);
            annotation.LabelBorderColor = annotation.LabelBorderColor ? annotation.LabelBorderColor : annotation.StrokeColor;
            annotation.FontColor = annotation.FontColor ? annotation.FontColor : annotation.StrokeColor;
            annotation.LabelFillColor = annotation.LabelFillColor ? annotation.LabelFillColor : annotation.FillColor;
            annotation.FontSize = annotation.FontSize ? annotation.FontSize : 16;
            annotation.LabelSettings = annotation.LabelSettings ? annotation.LabelSettings : this.pdfViewer.shapeLabelSettings;
        }
        // tslint:disable-next-line:max-line-length
        annotation.AnnotationSelectorSettings = annotation.AnnotationSelectorSettings ? annotation.AnnotationSelectorSettings : this.pdfViewer.annotationSelectorSettings;
        // tslint:disable-next-line:max-line-length
        annotation.AnnotationSettings = annotation.AnnotationSettings ? annotation.AnnotationSettings : this.pdfViewer.annotationModule.updateAnnotationSettings(annotation);
        annotationObject = {
            // tslint:disable-next-line:max-line-length
            id: 'measure', shapeAnnotationType: annotation.ShapeAnnotationType, author: annotation.Author, modifiedDate: annotation.ModifiedDate, subject: annotation.Subject,
            note: annotation.Note, strokeColor: annotation.StrokeColor, fillColor: annotation.FillColor, opacity: annotation.Opacity, thickness: annotation.Thickness, rectangleDifference: annotation.RectangleDifference,
            // tslint:disable-next-line:max-line-length
            borderStyle: annotation.BorderStyle, borderDashArray: annotation.BorderDashArray, rotateAngle: annotation.RotateAngle, isCloudShape: annotation.IsCloudShape,
            cloudIntensity: annotation.CloudIntensity, vertexPoints: vertexPoints, lineHeadStart: annotation.LineHeadStart, lineHeadEnd: annotation.LineHeadEnd, isLocked: annotation.IsLocked,
            // tslint:disable-next-line:max-line-length
            bounds: { left: annotation.Bounds.X, top: annotation.Bounds.Y, width: annotation.Bounds.Width, height: annotation.Bounds.Height, right: annotation.Bounds.Right, bottom: annotation.Bounds.Bottom },
            caption: annotation.Caption, captionPosition: annotation.CaptionPosition, calibrate: measureObject, leaderLength: annotation.LeaderLength, leaderLineExtension: annotation.LeaderLineExtension,
            // tslint:disable-next-line:max-line-length
            leaderLineOffset: annotation.LeaderLineOffset, indent: annotation.Indent, annotationId: annotation.AnnotName, comments: this.pdfViewer.annotationModule.getAnnotationComments(annotation.Comments, annotation, annotation.Author),
            review: { state: annotation.State, stateModel: annotation.StateModel, modifiedDate: annotation.ModifiedDate, author: annotation.Author },
            labelContent: annotation.LabelContent, enableShapeLabel: annotation.EnableShapeLabel, labelFillColor: annotation.LabelFillColor,
            labelBorderColor: annotation.LabelBorderColor, fontColor: annotation.FontColor, fontSize: annotation.FontSize,
            // tslint:disable-next-line:max-line-length
            labelBounds: annotation.LabelBounds, pageNumber: pageNumber, annotationSelectorSettings: annotation.AnnotationSelectorSettings, labelSettings: annotation.labelSettings, annotationSettings: annotation.AnnotationSettings,
            customData: this.pdfViewer.annotation.getCustomData(annotation)
        };
        return annotationObject;
    };
    return MeasureAnnotation;
}());
export { MeasureAnnotation };

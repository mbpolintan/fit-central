import { createElement, isNullOrUndefined } from '@syncfusion/ej2-base';
import { Dialog } from '@syncfusion/ej2-popups';
import { splitArrayCollection, processPathData, getPathString } from '@syncfusion/ej2-drawings';
import { ColorPicker } from '@syncfusion/ej2-inputs';
import { cloneObject } from '../drawing/drawing-util';
import { CheckBox } from '@syncfusion/ej2-buttons';
/**
 * @hidden
 */
var Signature = /** @class */ (function () {
    /**
     * @private
     */
    function Signature(pdfViewer, pdfViewerBase) {
        // tslint:disable-next-line
        this.newObject = [];
        /**
         * @private
         */
        this.outputString = '';
        /**
         * @private
         */
        // tslint:disable-next-line
        this.signaturecollection = [];
        /**
         * @private
         */
        // tslint:disable-next-line
        this.outputcollection = [];
        this.pdfViewer = pdfViewer;
        this.pdfViewerBase = pdfViewerBase;
    }
    /**
     * @private
     */
    Signature.prototype.createSignaturePanel = function () {
        var _this = this;
        var elementID = this.pdfViewer.element.id;
        var dialogDiv = createElement('div', { id: elementID + '_signature_window', className: 'e-pv-signature-window' });
        dialogDiv.style.display = 'block';
        this.pdfViewerBase.pageContainer.appendChild(dialogDiv);
        var appearanceTab = this.createSignatureCanvas();
        if (this.signatureDialog) {
            this.signatureDialog.content = appearanceTab;
        }
        else {
            this.signatureDialog = new Dialog({
                showCloseIcon: true, closeOnEscape: false, isModal: true, header: this.pdfViewer.localeObj.getConstant('Draw Signature'),
                target: this.pdfViewer.element, content: appearanceTab, width: '750px', visible: true,
                beforeClose: function () {
                    _this.clearSignatureCanvas();
                    _this.signatureDialog.destroy();
                    _this.signatureDialog = null;
                    // tslint:disable-next-line
                    var signatureWindow = document.getElementById(_this.pdfViewer.element.id + '_signature_window');
                    if (signatureWindow) {
                        signatureWindow.remove();
                    }
                }
            });
            this.signatureDialog.buttons = [
                // tslint:disable-next-line:max-line-length
                { buttonModel: { content: this.pdfViewer.localeObj.getConstant('Clear'), disabled: true, cssClass: 'e-pv-clearbtn' }, click: this.clearSignatureCanvas.bind(this) },
                // tslint:disable-next-line:max-line-length
                { buttonModel: { content: this.pdfViewer.localeObj.getConstant('Cancel') }, click: this.closeSignaturePanel.bind(this) },
                // tslint:disable-next-line:max-line-length
                { buttonModel: { content: this.pdfViewer.localeObj.getConstant('Create'), isPrimary: true, disabled: true, cssClass: 'e-pv-createbtn' }, click: this.addSignature.bind(this) },
            ];
            this.signatureDialog.appendTo(dialogDiv);
        }
    };
    Signature.prototype.addSignature = function () {
        var zoomvalue = this.pdfViewerBase.getZoomFactor();
        var annot;
        if (this.pdfViewerBase.isToolbarSignClicked) {
            var annotationName = this.pdfViewer.annotation.createGUID();
            this.pdfViewerBase.currentSignatureAnnot = null;
            this.pdfViewerBase.isSignatureAdded = true;
            var pageIndex = this.pdfViewerBase.currentPageNumber - 1;
            var pageDiv = document.getElementById(this.pdfViewer.element.id + '_pageDiv_' + pageIndex);
            var currentLeft = 0;
            var currentTop = 0;
            // tslint:disable-next-line:max-line-length
            var currentWidth = this.pdfViewer.handWrittenSignatureSettings.width ? this.pdfViewer.handWrittenSignatureSettings.width : 100;
            // tslint:disable-next-line:max-line-length
            var currentHeight = this.pdfViewer.handWrittenSignatureSettings.height ? this.pdfViewer.handWrittenSignatureSettings.height : 100;
            // tslint:disable-next-line:max-line-length
            var thickness = this.pdfViewer.handWrittenSignatureSettings.thickness ? this.pdfViewer.handWrittenSignatureSettings.thickness : 1;
            // tslint:disable-next-line:max-line-length
            var opacity = this.pdfViewer.handWrittenSignatureSettings.opacity ? this.pdfViewer.handWrittenSignatureSettings.opacity : 1;
            // tslint:disable-next-line:max-line-length
            var strokeColor = this.pdfViewer.handWrittenSignatureSettings.strokeColor ? this.pdfViewer.handWrittenSignatureSettings.strokeColor : '#000000';
            currentLeft = ((parseFloat(pageDiv.style.width) / 2) - (currentWidth / 2)) / zoomvalue;
            // tslint:disable-next-line:max-line-length
            currentTop = ((parseFloat(pageDiv.style.height) / 2) - (currentHeight / 2)) / zoomvalue;
            annot = {
                // tslint:disable-next-line:max-line-length
                id: 'sign' + this.pdfViewerBase.signatureCount, bounds: { x: currentLeft, y: currentTop, width: currentWidth, height: currentHeight }, pageIndex: pageIndex, data: this.outputString,
                shapeAnnotationType: 'HandWrittenSignature', opacity: opacity, strokeColor: strokeColor, thickness: thickness, signatureName: annotationName,
            };
            // tslint:disable-next-line
            var checkbox = document.getElementById('checkbox');
            if (checkbox.checked) {
                this.addSignatureCollection();
            }
            this.hideSignaturePanel();
            this.pdfViewerBase.currentSignatureAnnot = annot;
            this.pdfViewerBase.isToolbarSignClicked = false;
        }
        else {
            this.pdfViewer.formFieldsModule.drawSignature();
            this.hideSignaturePanel();
        }
    };
    Signature.prototype.hideSignaturePanel = function () {
        if (this.signatureDialog) {
            this.signatureDialog.hide();
        }
    };
    // tslint:disable-next-line
    Signature.prototype.createSignatureCanvas = function () {
        // tslint:disable-next-line
        var previousField = document.getElementById(this.pdfViewer.element.id + '_signatureCanvas_');
        // tslint:disable-next-line
        var field = document.getElementById(this.pdfViewer.element.id + 'Signature_appearance');
        if (previousField) {
            previousField.remove();
        }
        if (field) {
            field.remove();
        }
        // tslint:disable-next-line:max-line-length
        var appearanceDiv = createElement('div', { id: this.pdfViewer.element.id + 'Signature_appearance', className: 'e-pv-signature-apperance' });
        // tslint:disable-next-line:max-line-length
        var canvas = createElement('canvas', { id: this.pdfViewer.element.id + '_signatureCanvas_', className: 'e-pv-signature-canvas' });
        if (this.pdfViewer.element.offsetWidth > 750) {
            canvas.width = 715;
            canvas.style.width = '715px';
        }
        else {
            canvas.width = this.pdfViewer.element.offsetWidth - 35;
            canvas.style.width = canvas.width + 'px';
        }
        canvas.height = 335;
        canvas.style.height = '335px';
        canvas.style.border = '1px dotted #bdbdbd';
        canvas.style.backgroundColor = 'white';
        canvas.addEventListener('mousedown', this.signaturePanelMouseDown.bind(this));
        canvas.addEventListener('mousemove', this.signaturePanelMouseMove.bind(this));
        canvas.addEventListener('mouseup', this.signaturePanelMouseUp.bind(this));
        canvas.addEventListener('mouseleave', this.signaturePanelMouseUp.bind(this));
        canvas.addEventListener('touchstart', this.signaturePanelMouseDown.bind(this));
        canvas.addEventListener('touchmove', this.signaturePanelMouseMove.bind(this));
        canvas.addEventListener('touchend', this.signaturePanelMouseUp.bind(this));
        appearanceDiv.appendChild(canvas);
        // tslint:disable-next-line
        var input = document.createElement('input');
        input.type = 'checkbox';
        input.id = 'checkbox';
        appearanceDiv.appendChild(input);
        // tslint:disable-next-line
        var checkBoxObj = new CheckBox({ label: 'Save signature', disabled: false, checked: false });
        checkBoxObj.appendTo(input);
        return appearanceDiv;
    };
    Signature.prototype.addSignatureCollection = function () {
        var minimumX = -1;
        var minimumY = -1;
        var maximumX = -1;
        var maximumY = -1;
        //tslint:disable-next-line
        var collectionData = processPathData(this.outputString);
        // tslint:disable-next-line
        for (var k = 0; k < collectionData.length; k++) {
            //tslint:disable-next-line
            var val = collectionData[k];
            if (minimumX === -1) {
                // tslint:disable-next-line
                minimumX = (val['x']);
                // tslint:disable-next-line
                maximumX = (val['x']);
                // tslint:disable-next-line
                minimumY = (val['y']);
                // tslint:disable-next-line
                maximumY = (val['y']);
            }
            else {
                // tslint:disable-next-line
                var point1 = (val['x']);
                // tslint:disable-next-line
                var point2 = (val['y']);
                if (minimumX >= point1) {
                    minimumX = point1;
                }
                if (minimumY >= point2) {
                    minimumY = point2;
                }
                if (maximumX <= point1) {
                    maximumX = point1;
                }
                if (maximumY <= point2) {
                    maximumY = point2;
                }
            }
        }
        var newdifferenceX = maximumX - minimumX;
        var newdifferenceY = maximumY - minimumY;
        // tslint:disable-next-line
        var newCanvas = document.createElement('canvas');
        newCanvas.width = 100;
        newCanvas.height = 100;
        var differenceX = newdifferenceX / 100;
        var differenceY = newdifferenceY / 100;
        // tslint:disable-next-line
        var context = newCanvas.getContext('2d');
        context.beginPath();
        for (var n = 0; n < collectionData.length; n++) {
            // tslint:disable-next-line
            var val = collectionData[n];
            // tslint:disable-next-line
            var point1 = (val['x'] - minimumX) / differenceX;
            // tslint:disable-next-line
            var point2 = (val['y'] - minimumY) / differenceY;
            // tslint:disable-next-line
            if (val['command'] === 'M') {
                context.moveTo(point1, point2);
                // tslint:disable-next-line
            }
            else if (val['command'] === 'L') {
                context.lineTo(point1, point2);
            }
        }
        context.stroke();
        context.closePath();
        // tslint:disable-next-line
        var imageString = newCanvas.toDataURL();
        // tslint:disable-next-line
        var signCollection = {};
        signCollection['sign_' + this.pdfViewerBase.imageCount] = this.outputString;
        this.outputcollection.push(signCollection);
        // tslint:disable-next-line
        var signature = {};
        signature['sign_' + this.pdfViewerBase.imageCount] = imageString;
        this.signaturecollection.push(signature);
        this.pdfViewerBase.imageCount++;
    };
    /**
     * @private
     */
    Signature.prototype.RenderSavedSignature = function () {
        this.pdfViewerBase.signatureCount++;
        var zoomvalue = this.pdfViewerBase.getZoomFactor();
        var annot;
        if (this.pdfViewerBase.isAddedSignClicked) {
            var annotationName = this.pdfViewer.annotation.createGUID();
            this.pdfViewerBase.currentSignatureAnnot = null;
            this.pdfViewerBase.isSignatureAdded = true;
            var pageIndex = this.pdfViewerBase.currentPageNumber - 1;
            var pageDiv = document.getElementById(this.pdfViewer.element.id + '_pageDiv_' + pageIndex);
            var currentLeft = 0;
            var currentTop = 0;
            // tslint:disable-next-line:max-line-length
            var currentWidth = this.pdfViewer.handWrittenSignatureSettings.width ? this.pdfViewer.handWrittenSignatureSettings.width : 100;
            // tslint:disable-next-line:max-line-length
            var currentHeight = this.pdfViewer.handWrittenSignatureSettings.height ? this.pdfViewer.handWrittenSignatureSettings.height : 100;
            // tslint:disable-next-line:max-line-length
            var thickness = this.pdfViewer.handWrittenSignatureSettings.thickness ? this.pdfViewer.handWrittenSignatureSettings.thickness : 1;
            // tslint:disable-next-line:max-line-length
            var opacity = this.pdfViewer.handWrittenSignatureSettings.opacity ? this.pdfViewer.handWrittenSignatureSettings.opacity : 1;
            // tslint:disable-next-line:max-line-length
            var strokeColor = this.pdfViewer.handWrittenSignatureSettings.strokeColor ? this.pdfViewer.handWrittenSignatureSettings.strokeColor : '#000000';
            currentLeft = ((parseFloat(pageDiv.style.width) / 2) - (currentWidth / 2)) / zoomvalue;
            // tslint:disable-next-line:max-line-length
            currentTop = ((parseFloat(pageDiv.style.height) / 2) - (currentHeight / 2)) / zoomvalue;
            var keyString = '';
            for (var collection = 0; collection < this.outputcollection.length; collection++) {
                // tslint:disable-next-line
                var collectionAddedsign = this.outputcollection[collection];
                // tslint:disable-next-line
                var eventTarget = event.target;
                // tslint:disable-next-line:max-line-length
                if (eventTarget && eventTarget.id === 'sign_' + collection || eventTarget && eventTarget.id === 'sign_border' + collection) {
                    keyString = collectionAddedsign['sign_' + collection];
                    break;
                }
            }
            annot = {
                // tslint:disable-next-line:max-line-length
                id: 'sign' + this.pdfViewerBase.signatureCount, bounds: { x: currentLeft, y: currentTop, width: currentWidth, height: currentHeight }, pageIndex: pageIndex, data: keyString,
                // tslint:disable-next-line:max-line-length
                shapeAnnotationType: 'HandWrittenSignature', opacity: opacity, strokeColor: strokeColor, thickness: thickness, signatureName: annotationName,
            };
            this.pdfViewerBase.currentSignatureAnnot = annot;
            this.pdfViewerBase.isAddedSignClicked = false;
        }
        else {
            this.pdfViewer.formFieldsModule.drawSignature();
        }
    };
    /**
     * @private
     */
    Signature.prototype.updateCanvasSize = function () {
        // tslint:disable-next-line
        var canvas = document.getElementById(this.pdfViewer.element.id + '_signatureCanvas_');
        if (canvas && this.signatureDialog && this.signatureDialog.visible) {
            if (this.pdfViewer.element.offsetWidth > 750) {
                canvas.width = 715;
                canvas.style.width = '715px';
            }
            else {
                canvas.width = this.pdfViewer.element.offsetWidth - 35;
                canvas.style.width = canvas.width + 'px';
            }
        }
    };
    Signature.prototype.signaturePanelMouseDown = function (e) {
        if (e.type !== 'contextmenu') {
            e.preventDefault();
            this.findMousePosition(e);
            this.mouseDetection = true;
            this.oldX = this.mouseX;
            this.oldY = this.mouseY;
            this.newObject = [];
            this.enableCreateButton(false);
            this.drawMousePosition(e);
        }
    };
    Signature.prototype.enableCreateButton = function (isEnable) {
        // tslint:disable-next-line
        var createbtn = document.getElementsByClassName('e-pv-createbtn')[0];
        if (createbtn) {
            createbtn.disabled = isEnable;
        }
        // tslint:disable-next-line
        var clearbtn = document.getElementsByClassName('e-pv-clearbtn')[0];
        if (clearbtn) {
            clearbtn.disabled = isEnable;
        }
    };
    Signature.prototype.signaturePanelMouseMove = function (e) {
        if (this.mouseDetection) {
            this.findMousePosition(e);
            this.drawMousePosition(e);
        }
    };
    Signature.prototype.findMousePosition = function (event) {
        var offsetX;
        var offsetY;
        if (event.type.indexOf('touch') !== -1) {
            event = event;
            var element = event.target;
            // tslint:disable-next-line
            var currentRect = element.getBoundingClientRect();
            this.mouseX = event.touches[0].pageX - currentRect.left;
            this.mouseY = event.touches[0].pageY - currentRect.top;
        }
        else {
            event = event;
            this.mouseX = event.offsetX;
            this.mouseY = event.offsetY;
        }
    };
    Signature.prototype.drawMousePosition = function (event) {
        if (this.mouseDetection) {
            this.drawSignatureInCanvas();
            this.oldX = this.mouseX;
            this.oldY = this.mouseY;
        }
    };
    Signature.prototype.drawSignatureInCanvas = function () {
        // tslint:disable-next-line
        var canvas = document.getElementById(this.pdfViewer.element.id + '_signatureCanvas_');
        // tslint:disable-next-line
        var context = canvas.getContext('2d');
        context.beginPath();
        context.moveTo(this.oldX, this.oldY);
        context.lineTo(this.mouseX, this.mouseY);
        context.stroke();
        context.lineWidth = 2;
        context.arc(this.oldX, this.oldY, 2 / 2, 0, Math.PI * 2, true);
        context.closePath();
        this.newObject.push(this.mouseX, this.mouseY);
    };
    Signature.prototype.signaturePanelMouseUp = function () {
        if (this.mouseDetection) {
            this.convertToPath(this.newObject);
        }
        this.mouseDetection = false;
    };
    // tslint:disable-next-line
    Signature.prototype.convertToPath = function (newObject) {
        this.movePath(newObject[0], newObject[1]);
        this.linePath(newObject[0], newObject[1]);
        for (var n = 2; n < newObject.length; n = n + 2) {
            this.linePath(newObject[n], newObject[n + 1]);
        }
    };
    Signature.prototype.linePath = function (x, y) {
        this.outputString += 'L' + x + ',' + y + ' ';
    };
    Signature.prototype.movePath = function (x, y) {
        this.outputString += 'M' + x + ',' + y + ' ';
    };
    Signature.prototype.clearSignatureCanvas = function () {
        this.outputString = '';
        this.newObject = [];
        // tslint:disable-next-line
        var canvas = document.getElementById(this.pdfViewer.element.id + '_signatureCanvas_');
        // tslint:disable-next-line
        var context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);
        this.enableCreateButton(true);
    };
    Signature.prototype.closeSignaturePanel = function () {
        this.clearSignatureCanvas();
        this.signatureDialog.hide();
    };
    /**
     * @private
     */
    Signature.prototype.saveSignature = function () {
        // tslint:disable-next-line
        var storeObject = window.sessionStorage.getItem(this.pdfViewerBase.documentId + '_annotations_sign');
        // tslint:disable-next-line
        var annotations = new Array();
        for (var j = 0; j < this.pdfViewerBase.pageCount; j++) {
            annotations[j] = [];
        }
        if (storeObject) {
            var annotationCollection = JSON.parse(storeObject);
            for (var i = 0; i < annotationCollection.length; i++) {
                var newArray = [];
                var pageAnnotationObject = annotationCollection[i];
                if (pageAnnotationObject) {
                    for (var z = 0; pageAnnotationObject.annotations.length > z; z++) {
                        // tslint:disable-next-line:max-line-length
                        var strokeColorString = pageAnnotationObject.annotations[z].strokeColor;
                        pageAnnotationObject.annotations[z].strokeColor = JSON.stringify(this.getRgbCode(strokeColorString));
                        // tslint:disable-next-line:max-line-length
                        pageAnnotationObject.annotations[z].bounds = JSON.stringify(this.pdfViewer.annotation.getBounds(pageAnnotationObject.annotations[z].bounds, pageAnnotationObject.pageIndex));
                        // tslint:disable-next-line
                        var collectionData = processPathData(pageAnnotationObject.annotations[z].data);
                        // tslint:disable-next-line
                        var csData = splitArrayCollection(collectionData);
                        pageAnnotationObject.annotations[z].data = JSON.stringify(csData);
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
    // tslint:disable-next-line
    Signature.prototype.getRgbCode = function (colorString) {
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
    Signature.prototype.renderSignature = function (left, top) {
        var annot;
        // tslint:disable-next-line
        var currentAnnotation = this.pdfViewerBase.currentSignatureAnnot;
        var annotationName = this.pdfViewer.annotation.createGUID();
        if (currentAnnotation) {
            annot = {
                // tslint:disable-next-line:max-line-length
                id: currentAnnotation.id, bounds: { x: left, y: top, width: currentAnnotation.bounds.width, height: currentAnnotation.bounds.height }, pageIndex: currentAnnotation.pageIndex, data: currentAnnotation.data,
                shapeAnnotationType: 'HandWrittenSignature', opacity: currentAnnotation.opacity, strokeColor: currentAnnotation.strokeColor, thickness: currentAnnotation.thickness, signatureName: annotationName,
            };
            this.pdfViewer.add(annot);
            // tslint:disable-next-line
            var canvass = document.getElementById(this.pdfViewer.element.id + '_annotationCanvas_' + currentAnnotation.pageIndex);
            // tslint:disable-next-line
            this.pdfViewer.renderDrawing(canvass, currentAnnotation.pageIndex);
            this.pdfViewerBase.signatureAdded = true;
            // tslint:disable-next-line:max-line-length
            this.pdfViewer.fireSignatureAdd(currentAnnotation.pageIndex, currentAnnotation.signatureName, currentAnnotation.shapeAnnotationType, currentAnnotation.bounds, currentAnnotation.opacity, currentAnnotation.strokeColor, currentAnnotation.thickness);
            this.storeSignatureData(currentAnnotation.pageIndex, annot);
            this.pdfViewerBase.currentSignatureAnnot = null;
            this.pdfViewerBase.signatureCount++;
        }
    };
    /**
     * @private
     */
    // tslint:disable-next-line
    Signature.prototype.renderExistingSignature = function (annotationCollection, pageIndex, isImport) {
        var annot;
        for (var n = 0; n < annotationCollection.length; n++) {
            // tslint:disable-next-line
            var currentAnnotation = annotationCollection[n];
            //tslint:disable-next-line
            if (currentAnnotation) {
                // tslint:disable-next-line
                var bounds = currentAnnotation.Bounds;
                var currentLeft = bounds.X;
                var currentTop = bounds.Y;
                var currentWidth = bounds.Width;
                var currentHeight = bounds.Height;
                // tslint:disable-next-line
                var data = currentAnnotation.PathData;
                if (isImport) {
                    data = getPathString(JSON.parse(currentAnnotation.PathData));
                }
                annot = {
                    // tslint:disable-next-line:max-line-length
                    id: 'sign' + this.pdfViewerBase.signatureCount, bounds: { x: currentLeft, y: currentTop, width: currentWidth, height: currentHeight }, pageIndex: pageIndex, data: data,
                    shapeAnnotationType: 'HandWrittenSignature', opacity: currentAnnotation.Opacity, strokeColor: currentAnnotation.StrokeColor, thickness: currentAnnotation.Thickness, signatureName: currentAnnotation.SignatureName,
                };
                this.pdfViewer.add(annot);
                // tslint:disable-next-line
                var canvass = document.getElementById(this.pdfViewer.element.id + '_annotationCanvas_' + currentAnnotation.pageIndex);
                // tslint:disable-next-line
                this.pdfViewer.renderDrawing(canvass, annot.pageIndex);
                this.storeSignatureData(annot.pageIndex, annot);
                this.pdfViewerBase.currentSignatureAnnot = null;
                this.pdfViewerBase.signatureCount++;
                // tslint:disable-next-line:max-line-length
                if (this.pdfViewerBase.navigationPane && this.pdfViewerBase.navigationPane.annotationMenuObj && this.pdfViewer.isSignatureEditable) {
                    // tslint:disable-next-line:max-line-length
                    this.pdfViewerBase.navigationPane.annotationMenuObj.enableItems([this.pdfViewer.localeObj.getConstant('Export Annotations')], true);
                }
            }
        }
    };
    /**
     * @private
     */
    // tslint:disable-next-line
    Signature.prototype.storeSignatureData = function (pageNumber, annotations) {
        // tslint:disable-next-line:max-line-length
        this.pdfViewer.annotation.addAction(annotations.pageIndex, null, annotations, 'Addition', '', annotations, annotations);
        var annotation = null;
        var left = annotations.bounds.left ? annotations.bounds.left : annotations.bounds.x;
        var top = annotations.bounds.top ? annotations.bounds.top : annotations.bounds.y;
        if (annotations.wrapper && annotations.wrapper.bounds) {
            left = annotations.wrapper.bounds.left;
            top = annotations.wrapper.bounds.top;
        }
        annotation = {
            // tslint:disable-next-line:max-line-length
            id: annotations.id, bounds: { left: left, top: top, width: annotations.bounds.width, height: annotations.bounds.height }, shapeAnnotationType: 'Signature', opacity: annotations.opacity, thickness: annotations.thickness, strokeColor: annotations.strokeColor, pageIndex: annotations.pageIndex, data: annotations.data, signatureName: annotations.signatureName,
        };
        // tslint:disable-next-line
        var storeObject = window.sessionStorage.getItem(this.pdfViewerBase.documentId + '_annotations_sign');
        var index = 0;
        if (!storeObject) {
            this.storeSignatureCollections(annotation, pageNumber);
            var shapeAnnotation = { pageIndex: pageNumber, annotations: [] };
            shapeAnnotation.annotations.push(annotation);
            index = shapeAnnotation.annotations.indexOf(annotation);
            var annotationCollection = [];
            annotationCollection.push(shapeAnnotation);
            var annotationStringified = JSON.stringify(annotationCollection);
            window.sessionStorage.setItem(this.pdfViewerBase.documentId + '_annotations_sign', annotationStringified);
        }
        else {
            this.storeSignatureCollections(annotation, pageNumber);
            var annotObject = JSON.parse(storeObject);
            window.sessionStorage.removeItem(this.pdfViewerBase.documentId + '_annotations_sign');
            var pageIndex = this.pdfViewer.annotationModule.getPageCollection(annotObject, pageNumber);
            if (annotObject[pageIndex]) {
                annotObject[pageIndex].annotations.push(annotation);
                index = annotObject[pageIndex].annotations.indexOf(annotation);
            }
            else {
                var markupAnnotation = { pageIndex: pageNumber, annotations: [] };
                markupAnnotation.annotations.push(annotation);
                index = markupAnnotation.annotations.indexOf(annotation);
                annotObject.push(markupAnnotation);
            }
            var annotationStringified = JSON.stringify(annotObject);
            window.sessionStorage.setItem(this.pdfViewerBase.documentId + '_annotations_sign', annotationStringified);
        }
    };
    /**
     * @private
     */
    // tslint:disable-next-line
    Signature.prototype.modifySignatureCollection = function (property, pageNumber, annotationBase, isSignatureEdited) {
        this.pdfViewer.isDocumentEdited = true;
        var currentAnnotObject = null;
        var pageAnnotations = this.getAnnotations(pageNumber, null);
        if (pageAnnotations != null && annotationBase) {
            for (var i = 0; i < pageAnnotations.length; i++) {
                if (annotationBase.id === pageAnnotations[i].id) {
                    if (property === 'bounds') {
                        // tslint:disable-next-line:max-line-length
                        pageAnnotations[i].bounds = { left: annotationBase.wrapper.bounds.left, top: annotationBase.wrapper.bounds.top, width: annotationBase.bounds.width, height: annotationBase.bounds.height };
                    }
                    else if (property === 'stroke') {
                        pageAnnotations[i].strokeColor = annotationBase.wrapper.children[0].style.strokeColor;
                    }
                    else if (property === 'opacity') {
                        pageAnnotations[i].opacity = annotationBase.wrapper.children[0].style.opacity;
                    }
                    else if (property === 'thickness') {
                        pageAnnotations[i].thickness = annotationBase.wrapper.children[0].style.strokeWidth;
                    }
                    else if (property === 'delete') {
                        this.updateSignatureCollection(pageAnnotations[i]);
                        currentAnnotObject = pageAnnotations.splice(i, 1)[0];
                        break;
                    }
                    if (property && property !== 'delete') {
                        this.storeSignatureCollections(pageAnnotations[i], pageNumber);
                    }
                    if (isSignatureEdited) {
                        pageAnnotations[i].opacity = annotationBase.wrapper.children[0].style.opacity;
                        pageAnnotations[i].strokeColor = annotationBase.wrapper.children[0].style.strokeColor;
                        pageAnnotations[i].thickness = annotationBase.wrapper.children[0].style.strokeWidth;
                        this.storeSignatureCollections(pageAnnotations[i], pageNumber);
                        break;
                    }
                }
            }
            this.manageAnnotations(pageAnnotations, pageNumber);
        }
        return currentAnnotObject;
    };
    /**
     * @private
     */
    // tslint:disable-next-line
    Signature.prototype.storeSignatureCollections = function (annotation, pageNumber) {
        // tslint:disable-next-line
        var collectionDetails = this.checkSignatureCollection(annotation);
        // tslint:disable-next-line
        var selectAnnotation = cloneObject(annotation);
        selectAnnotation.annotationId = annotation.signatureName;
        selectAnnotation.pageNumber = pageNumber;
        delete selectAnnotation.annotName;
        if (annotation.id) {
            selectAnnotation.uniqueKey = annotation.id;
            delete selectAnnotation.id;
        }
        if (collectionDetails.isExisting) {
            this.pdfViewer.signatureCollection.splice(collectionDetails.position, 0, selectAnnotation);
        }
        else {
            this.pdfViewer.signatureCollection.push(selectAnnotation);
        }
    };
    // tslint:disable-next-line
    Signature.prototype.checkSignatureCollection = function (signature) {
        // tslint:disable-next-line
        var collections = this.pdfViewer.signatureCollection;
        if (collections && signature) {
            for (var i = 0; i < collections.length; i++) {
                if (collections[i].annotationId === signature.signatureName) {
                    this.pdfViewer.signatureCollection.splice(i, 1);
                    return { isExisting: true, position: i };
                }
            }
        }
        return { isExisting: false, position: null };
    };
    /**
     * @private
     */
    // tslint:disable-next-line
    Signature.prototype.updateSignatureCollection = function (signature) {
        // tslint:disable-next-line
        var collections = this.pdfViewer.signatureCollection;
        if (collections && signature) {
            for (var i = 0; i < collections.length; i++) {
                if (collections[i].annotationId === signature.signatureName) {
                    this.pdfViewer.signatureCollection.splice(i, 1);
                    break;
                }
            }
        }
    };
    /**
     * @private
     */
    // tslint:disable-next-line
    Signature.prototype.addInCollection = function (pageNumber, signature) {
        if (signature) {
            this.storeSignatureCollections(signature, pageNumber);
            // tslint:disable-next-line
            var pageSignatures = this.getAnnotations(pageNumber, null);
            if (pageSignatures) {
                pageSignatures.push(signature);
            }
            this.manageAnnotations(pageSignatures, pageNumber);
        }
    };
    // tslint:disable-next-line
    Signature.prototype.getAnnotations = function (pageIndex, shapeAnnotations) {
        // tslint:disable-next-line
        var annotationCollection;
        // tslint:disable-next-line
        var storeObject = window.sessionStorage.getItem(this.pdfViewerBase.documentId + '_annotations_sign');
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
    Signature.prototype.manageAnnotations = function (pageAnnotations, pageNumber) {
        // tslint:disable-next-line
        var storeObject = window.sessionStorage.getItem(this.pdfViewerBase.documentId + '_annotations_sign');
        if (storeObject) {
            var annotObject = JSON.parse(storeObject);
            window.sessionStorage.removeItem(this.pdfViewerBase.documentId + '_annotations_sign');
            var index = this.pdfViewer.annotationModule.getPageCollection(annotObject, pageNumber);
            if (annotObject[index]) {
                annotObject[index].annotations = pageAnnotations;
            }
            var annotationStringified = JSON.stringify(annotObject);
            window.sessionStorage.setItem(this.pdfViewerBase.documentId + '_annotations_sign', annotationStringified);
        }
    };
    /**
     * @private
     */
    Signature.prototype.showSignatureDialog = function (isShow) {
        if (isShow) {
            this.createSignaturePanel();
        }
    };
    /**
     * @private
     */
    Signature.prototype.setAnnotationMode = function () {
        this.pdfViewerBase.isToolbarSignClicked = true;
        this.showSignatureDialog(true);
    };
    /**
     * @private
     */
    // tslint:disable-next-line
    Signature.prototype.ConvertPointToPixel = function (number) {
        return (number * (96 / 72));
    };
    /**
     * @private
     */
    // tslint:disable-next-line
    Signature.prototype.updateSignatureCollections = function (signature, pageIndex, isImport) {
        var annot;
        //tslint:disable-next-line
        if (signature) {
            // tslint:disable-next-line
            var bounds = signature.Bounds;
            var currentLeft = bounds.X;
            var currentTop = bounds.Y;
            var currentWidth = bounds.Width;
            var currentHeight = bounds.Height;
            // tslint:disable-next-line
            var data = signature.PathData;
            if (isImport) {
                data = getPathString(JSON.parse(signature.PathData));
            }
            annot = {
                // tslint:disable-next-line:max-line-length
                id: 'sign' + signature.SignatureName, bounds: { x: currentLeft, y: currentTop, width: currentWidth, height: currentHeight }, pageIndex: pageIndex, data: data,
                shapeAnnotationType: 'HandWrittenSignature', opacity: signature.Opacity, strokeColor: signature.StrokeColor, thickness: signature.Thickness, signatureName: signature.SignatureName,
            };
            return annot;
        }
    };
    /**
     * @private
     */
    Signature.prototype.destroy = function () {
        window.sessionStorage.removeItem('_annotations_sign');
    };
    return Signature;
}());
export { Signature };

import { createElement, Browser } from '@syncfusion/ej2-base';
import { AjaxHandler } from '../index';
/**
 * Print module
 */
var Print = /** @class */ (function () {
    /**
     * @private
     */
    function Print(viewer, base) {
        this.pdfViewer = viewer;
        this.pdfViewerBase = base;
    }
    /**
     * Print the PDF document being loaded in the ejPdfViewer control.
     * @returns void
     */
    Print.prototype.print = function () {
        var _this = this;
        var pageIndex;
        if (this.pdfViewerBase.pageCount > 0) {
            // tslint:disable-next-line:max-line-length
            this.printViewerContainer = createElement('div', {
                id: this.pdfViewer.element.id + '_print_viewer_container',
                className: 'e-pv-print-viewer-container'
            });
            if (this.pdfViewer.printMode === 'Default') {
                this.pdfViewerBase.showPrintLoadingIndicator(true);
                this.iframe = document.createElement('iframe');
                this.iframe.className = 'iframeprint';
                this.iframe.id = 'iframePrint';
                this.iframe.style.position = 'absolute';
                this.iframe.style.top = '-100000000px';
                document.body.appendChild(this.iframe);
                this.frameDoc = this.iframe.contentWindow ? this.iframe.contentWindow : this.iframe.contentDocument;
                this.frameDoc.document.open();
            }
            else {
                this.printWindow = window.open('', 'print', 'height=' + window.outerHeight + ',width=' + window.outerWidth + ',tabbar=no');
                this.printWindow.moveTo(0, 0);
                this.printWindow.resizeTo(screen.availWidth, screen.availHeight);
                this.createPrintLoadingIndicator(this.printWindow.document.body);
            }
            setTimeout(function () {
                for (pageIndex = 0; pageIndex < _this.pdfViewerBase.pageCount; pageIndex++) {
                    var pageWidth = _this.pdfViewerBase.pageSize[pageIndex].width;
                    var pageHeight = _this.pdfViewerBase.pageSize[pageIndex].height;
                    _this.pdfViewer.printModule.createRequestForPrint(pageIndex, pageWidth, pageHeight, _this.pdfViewerBase.pageCount);
                }
                _this.pdfViewer.firePrintEnd(_this.pdfViewer.downloadFileName);
            }, 100);
        }
    };
    Print.prototype.createRequestForPrint = function (pageIndex, pageWidth, pageHeight, pageCount) {
        var proxy = this;
        // tslint: disable-next-line:max-line-length
        // set default zoomFactor value.  
        var jsonObject = {
            pageNumber: pageIndex, documentId: this.pdfViewerBase.documentId,
            hashId: this.pdfViewerBase.hashId, zoomFactor: 1,
            action: 'PrintImages',
            elementId: this.pdfViewer.element.id,
            uniqueId: this.pdfViewerBase.documentId
        };
        if (this.pdfViewerBase.jsonDocumentId) {
            // tslint:disable-next-line
            jsonObject.documentId = this.pdfViewerBase.jsonDocumentId;
        }
        proxy.pdfViewerBase.createFormfieldsJsonData();
        proxy.printRequestHandler = new AjaxHandler(proxy.pdfViewer);
        proxy.printRequestHandler.url = proxy.pdfViewer.serviceUrl + '/' + proxy.pdfViewer.serverActionSettings.print;
        proxy.printRequestHandler.responseType = null;
        proxy.printRequestHandler.mode = false;
        if (this.pdfViewerBase.validateForm && this.pdfViewer.enableFormFieldsValidation) {
            this.pdfViewer.fireValidatedFailed(proxy.pdfViewer.serverActionSettings.download);
            this.pdfViewerBase.validateForm = false;
            this.pdfViewerBase.showPrintLoadingIndicator(false);
        }
        else {
            proxy.printRequestHandler.send(jsonObject);
        }
        // tslint:disable-next-line
        proxy.printRequestHandler.onSuccess = function (result) {
            // tslint:disable-next-line
            var printImage = result.data;
            if (printImage) {
                if (typeof printImage !== 'object') {
                    try {
                        printImage = JSON.parse(printImage);
                        if (typeof printImage !== 'object') {
                            proxy.pdfViewerBase.onControlError(500, printImage, proxy.pdfViewer.serverActionSettings.print);
                            printImage = null;
                        }
                    }
                    catch (error) {
                        proxy.pdfViewerBase.onControlError(500, printImage, proxy.pdfViewer.serverActionSettings.print);
                        printImage = null;
                    }
                }
            }
            if (printImage && printImage.uniqueId === proxy.pdfViewerBase.documentId) {
                var annotationSource_1 = '';
                if (!proxy.pdfViewer.annotationSettings.skipPrint) {
                    // tslint:disable-next-line
                    var annotationCollections = proxy.pdfViewerBase.documentAnnotationCollections;
                    if (annotationCollections && annotationCollections[printImage.pageNumber] && proxy.pdfViewerBase.isTextMarkupAnnotationModule()) {
                        // tslint:disable-next-line
                        var printCollection = annotationCollections[printImage.pageNumber];
                        if (proxy.pdfViewerBase.isImportAction) {
                            var textMarkupAnnotation = printCollection.textMarkupAnnotation;
                            var shapeAnnotation = printCollection.shapeAnnotation;
                            var measureShapeAnnotation = printCollection.measureShapeAnnotation;
                            var stampAnnotation = printCollection.stampAnnotations;
                            // tslint:disable-next-line
                            var stickyNoteAnnotation = printCollection.stickyNotesAnnotation;
                            // tslint:disable-next-line:max-line-length
                            annotationSource_1 = proxy.pdfViewer.annotationModule.textMarkupAnnotationModule.printTextMarkupAnnotations(textMarkupAnnotation, printImage.pageNumber, stampAnnotation, shapeAnnotation, measureShapeAnnotation, stickyNoteAnnotation);
                        }
                        else {
                            // tslint:disable-next-line:max-line-length
                            annotationSource_1 = proxy.pdfViewer.annotationModule.textMarkupAnnotationModule.printTextMarkupAnnotations(printCollection.textMarkupAnnotation, printImage.pageNumber, printCollection.stampAnnotations, printCollection.shapeAnnotation, printCollection.measureShapeAnnotation, printCollection.stickyNoteAnnotation);
                        }
                    }
                    if (proxy.pdfViewerBase.isAnnotationCollectionRemoved) {
                        // tslint:disable-next-line:max-line-length
                        annotationSource_1 = proxy.pdfViewer.annotationModule.textMarkupAnnotationModule.printTextMarkupAnnotations(null, printImage.pageNumber, null, null, null, null);
                    }
                }
                var currentPageNumber_1 = printImage.pageNumber;
                // tslint:disable-next-line:max-line-length
                proxy.printCanvas = createElement('canvas', { id: proxy.pdfViewer.element.id + '_printCanvas_' + pageIndex, className: 'e-pv-print-canvas' });
                proxy.printCanvas.style.width = pageWidth + 'px';
                proxy.printCanvas.style.height = pageHeight + 'px';
                var printScaleValue = 1.5;
                proxy.printCanvas.height = 1056 * printScaleValue * window.devicePixelRatio;
                proxy.printCanvas.width = 816 * printScaleValue * window.devicePixelRatio;
                var context_1 = proxy.printCanvas.getContext('2d');
                var pageImage_1 = new Image();
                var annotationImage_1 = new Image();
                pageImage_1.onload = function () {
                    if (pageHeight > pageWidth) {
                        context_1.drawImage(pageImage_1, 0, 0, proxy.printCanvas.width, proxy.printCanvas.height);
                        if (annotationSource_1) {
                            context_1.drawImage(annotationImage_1, 0, 0, proxy.printCanvas.width, proxy.printCanvas.height);
                        }
                    }
                    else {
                        // translate to center canvas
                        context_1.translate(proxy.printCanvas.width * 0.5, proxy.printCanvas.height * 0.5);
                        // rotate the canvas to - 90 degree 
                        context_1.rotate(-0.5 * Math.PI);
                        // un translate the canvas back to origin
                        context_1.translate(-proxy.printCanvas.height * 0.5, -proxy.printCanvas.width * 0.5);
                        // draw the image
                        context_1.drawImage(pageImage_1, 0, 0, proxy.printCanvas.height, proxy.printCanvas.width);
                        if (annotationSource_1) {
                            context_1.drawImage(annotationImage_1, 0, 0, proxy.printCanvas.height, proxy.printCanvas.width);
                        }
                    }
                    if (currentPageNumber_1 === (proxy.pdfViewerBase.pageCount - 1)) {
                        proxy.printWindowOpen();
                    }
                    proxy.pdfViewer.renderDrawing(null, pageIndex);
                };
                pageImage_1.src = printImage.image;
                annotationImage_1.src = annotationSource_1;
                proxy.printViewerContainer.appendChild(proxy.printCanvas);
            }
        };
        // tslint:disable-next-line
        this.printRequestHandler.onFailure = function (result) {
            proxy.pdfViewer.fireAjaxRequestFailed(result.status, result.statusText, proxy.pdfViewer.serverActionSettings.print);
        };
        // tslint:disable-next-line
        this.printRequestHandler.onError = function (result) {
            proxy.pdfViewerBase.openNotificationPopup();
            proxy.pdfViewer.fireAjaxRequestFailed(result.status, result.statusText, proxy.pdfViewer.serverActionSettings.print);
        };
    };
    // tslint:disable-next-line
    Print.prototype.renderFieldsForPrint = function (pageIndex, heightRatio, widthRatio) {
        // tslint:disable-next-line
        var data = window.sessionStorage.getItem(this.pdfViewerBase.documentId + '_formfields');
        // tslint:disable-next-line
        var formFieldsData = JSON.parse(data);
        if (formFieldsData) {
            for (var i = 0; i < formFieldsData.length; i++) {
                // tslint:disable-next-line
                var currentData = formFieldsData[i];
                // tslint:disable-next-line
                if (parseFloat(currentData['PageIndex']) === pageIndex) {
                    // tslint:disable-next-line
                    var targetField = void 0;
                    if (this.pdfViewer.printMode === 'Default') {
                        targetField = this.frameDoc.document.getElementById('fields_' + pageIndex);
                    }
                    else {
                        targetField = this.printWindow.document.getElementById('fields_' + pageIndex);
                    }
                    // tslint:disable-next-line
                    var inputField = this.pdfViewer.formFieldsModule.createFormFields(currentData, pageIndex, i, targetField);
                    if (inputField) {
                        // tslint:disable-next-line
                        var bounds = currentData['LineBounds'];
                        // tslint:disable-next-line
                        var font = currentData['Font'];
                        this.applyPosition(inputField, bounds, font, heightRatio, widthRatio);
                        inputField.style.backgroundColor = 'transparent';
                        if (!currentData.IsSignatureField) {
                            inputField.style.borderColor = 'transparent';
                        }
                        targetField.appendChild(inputField);
                    }
                }
            }
        }
    };
    /**
     * @private
     */
    // tslint:disable-next-line
    Print.prototype.applyPosition = function (inputField, bounds, font, heightRatio, widthRatio) {
        if (bounds) {
            var left = (this.pdfViewer.formFieldsModule.ConvertPointToPixel(bounds.X)) / widthRatio;
            var top_1 = (this.pdfViewer.formFieldsModule.ConvertPointToPixel(bounds.Y)) / heightRatio;
            var width = (this.pdfViewer.formFieldsModule.ConvertPointToPixel(bounds.Width)) / widthRatio;
            var height = (this.pdfViewer.formFieldsModule.ConvertPointToPixel(bounds.Height)) / heightRatio;
            var fontHeight = 0;
            if (font !== null && font.Height) {
                inputField.style.fontfamily = font.Name;
                if (font.Italic) {
                    inputField.style.fontStyle = 'italic';
                }
                if (font.Bold) {
                    inputField.style.fontWeight = 'Bold';
                }
                fontHeight = this.pdfViewer.formFieldsModule.ConvertPointToPixel(font.Size);
            }
            if (Browser.isIE) {
                top_1 = top_1 - 1;
            }
            this.pdfViewer.formFieldsModule.setStyleToTextDiv(inputField, left, top_1, fontHeight, width, height, true);
        }
    };
    Print.prototype.printWindowOpen = function () {
        var _this = this;
        var browserUserAgent = navigator.userAgent;
        // tslint:disable-next-line
        var printDocument;
        if (this.pdfViewer.printMode === 'Default') {
            printDocument = this.frameDoc.document;
        }
        else {
            printDocument = this.printWindow.document;
        }
        // tslint: disable-next-line:max-line-length
        if ((browserUserAgent.indexOf('Chrome') !== -1) || (browserUserAgent.indexOf('Safari') !== -1) ||
            (browserUserAgent.indexOf('Firefox')) !== -1) {
            //chrome and firefox
            printDocument.write('<!DOCTYPE html>');
            // tslint: disable-next-line:max-line-length
            printDocument.write('<html moznomarginboxes mozdisallowselectionprint><head><style>html, body { height: 100%; }'
                + ' img { height: 100%; width: 100%; display: block; }@media print { body { margin: 0cm; }'
                + ' img { width:100%; max-width: 1048px; box-sizing: border-box; }br, button { display: none; }'
                // set default page Height and page Width for A4 size.
                + ' div{ page-break-inside: avoid; }} @page{margin:0mm; size: 816px 1056px;}</style></head><body><center class="loader">');
        }
        else {
            //ie
            printDocument.write('<!DOCTYPE html>');
            // tslint: disable-next-line:max-line-length
            printDocument.write('<html><head>'
                + '<style>html, body { height: 100%; } img { height: 100%; width: 100%; }@media print { body { margin: 0cm; }'
                + 'img { width:100%; max-width: 1048px; box-sizing: border-box; }br, button { display: none; } '
                // set default page Height and page Width for A4 size.
                + 'div{ page-break-inside: avoid; }} @page{margin:0mm; size: 816px 1056px;}</style></head><body><center>');
        }
        for (var i = 0; i < this.printViewerContainer.children.length; i++) {
            // tslint:disable-next-line:max-line-length
            var canvasUrl = this.printViewerContainer.children[i].toDataURL();
            printDocument.write('<div style="margin:0mm;width:816px;height:1056px;position:relative"><img src="' + canvasUrl + '" id="' + 'image_' + i + '" /><div id="' + 'fields_' + i + '" style="margin:0px;top:0px;left:0px;position:absolute;width:816px;height:1056px;z-index:2"></div></div>');
            if (this.pdfViewer.formFieldsModule) {
                var pageWidth = this.pdfViewerBase.pageSize[i].width;
                var pageHeight = this.pdfViewerBase.pageSize[i].height;
                var heightRatio = pageHeight / 1056;
                var widthRatio = pageWidth / 816;
                this.renderFieldsForPrint(i, heightRatio, widthRatio);
            }
        }
        if (Browser.isIE || Browser.info.name === 'edge') {
            try {
                if (this.pdfViewer.printMode === 'Default') {
                    this.pdfViewerBase.showPrintLoadingIndicator(false);
                    this.iframe.contentWindow.document.execCommand('print', false, null);
                }
                else {
                    this.printWindow.document.execCommand('print', false, null);
                }
            }
            catch (e) {
                if (this.pdfViewer.printMode === 'Default') {
                    this.pdfViewerBase.showPrintLoadingIndicator(false);
                    this.iframe.contentWindow.print();
                }
                else {
                    this.printWindow.print();
                }
            }
        }
        else {
            setTimeout(function () {
                if (_this.pdfViewer.printMode === 'Default') {
                    _this.pdfViewerBase.showPrintLoadingIndicator(false);
                    _this.iframe.contentWindow.print();
                    _this.iframe.contentWindow.focus();
                    document.body.removeChild(_this.iframe);
                }
                else {
                    if (_this.printWindow) {
                        try {
                            _this.printWindow.print();
                            _this.printWindow.focus();
                            _this.printWindow.close();
                        }
                        catch (error) {
                            return null;
                        }
                    }
                }
            }, 200);
        }
    };
    // tslint:disable-next-line
    Print.prototype.createPrintLoadingIndicator = function (element) {
        // tslint:disable-next-line
        var printWindowContainer = createElement('div', {
            id: this.pdfViewer.element.id + '_printWindowcontainer'
        });
        printWindowContainer.style.height = '100%';
        printWindowContainer.style.width = '100%';
        printWindowContainer.style.position = 'absolute';
        printWindowContainer.style.zIndex = 2000;
        printWindowContainer.style.left = 0;
        printWindowContainer.style.top = 0;
        printWindowContainer.style.overflow = 'auto';
        printWindowContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
        element.appendChild(printWindowContainer);
        var printWaitingPopup = createElement('div', {
            id: this.pdfViewer.element.id + '_printLoadingContainer'
        });
        printWaitingPopup.style.position = 'absolute';
        printWaitingPopup.style.width = '50px';
        printWaitingPopup.style.height = '50px';
        printWaitingPopup.style.left = '46%';
        printWaitingPopup.style.top = '45%';
        printWindowContainer.style.zIndex = 3000;
        printWindowContainer.appendChild(printWaitingPopup);
        // tslint:disable-next-line
        var printImageContainer = new Image();
        // tslint:disable-next-line
        printImageContainer.src = 'data:image/gif;base64,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';
        printImageContainer.style.width = '50px';
        printImageContainer.style.height = '50px';
        printWaitingPopup.appendChild(printImageContainer);
        var printLabelContainer = createElement('div', {
            id: this.pdfViewer.element.id + '_printLabelContainer'
        });
        printLabelContainer.style.position = 'absolute';
        printLabelContainer.textContent = 'Loading ...';
        printLabelContainer.style.fontWeight = 'Bold';
        printLabelContainer.style.left = '46%';
        printLabelContainer.style.top = '54.5%';
        printLabelContainer.style.zIndex = '3000';
        printWindowContainer.appendChild(printLabelContainer);
    };
    /**
     * @private
     */
    Print.prototype.destroy = function () {
        this.printViewerContainer = undefined;
        this.frameDoc = undefined;
        this.printWindow = undefined;
    };
    /**
     * @private
     */
    Print.prototype.getModuleName = function () {
        return 'Print';
    };
    return Print;
}());
export { Print };

import { addClass, detach, EventHandler, isNullOrUndefined, select, isBlazor } from '@syncfusion/ej2-base';
import { Browser, closest, removeClass, isNullOrUndefined as isNOU } from '@syncfusion/ej2-base';
import * as events from '../base/constant';
import * as classes from '../base/classes';
import { Uploader, NumericTextBox } from '@syncfusion/ej2-inputs';
import { Popup } from '@syncfusion/ej2-popups';
import { Button, CheckBox } from '@syncfusion/ej2-buttons';
import { RenderType } from '../base/enum';
import { dispatchEvent, parseHtml, hasClass, convertToBlob } from '../base/util';
import { isIDevice } from '../../common/util';
/**
 * `Image` module is used to handle image actions.
 */
var Image = /** @class */ (function () {
    function Image(parent, serviceLocator) {
        this.isImgUploaded = false;
        this.pageX = null;
        this.pageY = null;
        this.deletedImg = [];
        this.parent = parent;
        this.rteID = parent.element.id;
        this.i10n = serviceLocator.getService('rteLocale');
        this.rendererFactory = serviceLocator.getService('rendererFactory');
        this.dialogRenderObj = serviceLocator.getService('dialogRenderObject');
        this.addEventListener();
    }
    Image.prototype.addEventListener = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.on(events.keyDown, this.onKeyDown, this);
        this.parent.on(events.keyUp, this.onKeyUp, this);
        this.parent.on(events.insertImage, this.insertImage, this);
        this.parent.on(events.insertCompleted, this.showImageQuickToolbar, this);
        this.parent.on(events.imageToolbarAction, this.onToolbarAction, this);
        this.parent.on(events.imageCaption, this.caption, this);
        this.parent.on(events.imageDelete, this.deleteImg, this);
        this.parent.on(events.imageLink, this.insertImgLink, this);
        this.parent.on(events.imageAlt, this.insertAltText, this);
        this.parent.on(events.editAreaClick, this.editAreaClickHandler, this);
        this.parent.on(events.iframeMouseDown, this.onIframeMouseDown, this);
        this.parent.on(events.imageSize, this.imageSize, this);
        this.parent.on(events.dropDownSelect, this.alignmentSelect, this);
        this.parent.on(events.initialEnd, this.afterRender, this);
        this.parent.on(events.paste, this.imagePaste, this);
        this.parent.on(events.destroy, this.removeEventListener, this);
    };
    Image.prototype.removeEventListener = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off(events.keyDown, this.onKeyDown);
        this.parent.off(events.keyUp, this.onKeyUp);
        this.parent.off(events.insertImage, this.insertImage);
        this.parent.off(events.insertCompleted, this.showImageQuickToolbar);
        this.parent.off(events.imageCaption, this.caption);
        this.parent.off(events.imageToolbarAction, this.onToolbarAction);
        this.parent.off(events.imageDelete, this.deleteImg);
        this.parent.off(events.imageLink, this.insertImgLink);
        this.parent.off(events.imageAlt, this.insertAltText);
        this.parent.off(events.editAreaClick, this.editAreaClickHandler);
        this.parent.off(events.iframeMouseDown, this.onIframeMouseDown);
        this.parent.off(events.imageSize, this.imageSize);
        this.parent.off(events.dropDownSelect, this.alignmentSelect);
        this.parent.off(events.initialEnd, this.afterRender);
        this.parent.off(events.paste, this.imagePaste);
        this.parent.off(events.destroy, this.removeEventListener);
        var dropElement = this.parent.iframeSettings.enable ? this.parent.inputElement.ownerDocument
            : this.parent.inputElement;
        dropElement.removeEventListener('drop', this.dragDrop.bind(this), true);
        dropElement.removeEventListener('dragstart', this.dragStart.bind(this), true);
        dropElement.removeEventListener('dragenter', this.dragEnter.bind(this), true);
        dropElement.removeEventListener('dragover', this.dragOver.bind(this), true);
        if (!isNullOrUndefined(this.contentModule)) {
            EventHandler.remove(this.contentModule.getEditPanel(), Browser.touchEndEvent, this.imageClick);
            this.parent.formatter.editorManager.observer.off(events.checkUndo, this.undoStack);
            if (this.parent.insertImageSettings.resize) {
                EventHandler.remove(this.parent.contentModule.getEditPanel(), Browser.touchStartEvent, this.resizeStart);
                EventHandler.remove(this.parent.element.ownerDocument, 'mousedown', this.onDocumentClick);
                EventHandler.remove(this.contentModule.getEditPanel(), 'cut', this.onCutHandler);
            }
        }
    };
    Image.prototype.onIframeMouseDown = function () {
        if (this.dialogObj) {
            this.dialogObj.hide({ returnValue: true });
        }
    };
    Image.prototype.afterRender = function () {
        this.contentModule = this.rendererFactory.getRenderer(RenderType.Content);
        EventHandler.add(this.contentModule.getEditPanel(), Browser.touchEndEvent, this.imageClick, this);
        if (this.parent.insertImageSettings.resize) {
            EventHandler.add(this.parent.contentModule.getEditPanel(), Browser.touchStartEvent, this.resizeStart, this);
            EventHandler.add(this.parent.element.ownerDocument, 'mousedown', this.onDocumentClick, this);
            EventHandler.add(this.contentModule.getEditPanel(), 'cut', this.onCutHandler, this);
        }
        var dropElement = this.parent.iframeSettings.enable ? this.parent.inputElement.ownerDocument :
            this.parent.inputElement;
        dropElement.addEventListener('drop', this.dragDrop.bind(this), true);
        dropElement.addEventListener('dragstart', this.dragStart.bind(this), true);
        dropElement.addEventListener('dragenter', this.dragOver.bind(this), true);
        dropElement.addEventListener('dragover', this.dragOver.bind(this), true);
    };
    Image.prototype.undoStack = function (args) {
        if (args.subCommand.toLowerCase() === 'undo' || args.subCommand.toLowerCase() === 'redo') {
            for (var i = 0; i < this.parent.formatter.getUndoRedoStack().length; i++) {
                var temp = this.parent.createElement('div');
                var contentElem = parseHtml(this.parent.formatter.getUndoRedoStack()[i].text);
                temp.appendChild(contentElem);
                var img = temp.querySelectorAll('img');
                if (temp.querySelector('.e-img-resize') && img.length > 0) {
                    for (var j = 0; j < img.length; j++) {
                        img[j].style.outline = '';
                    }
                    detach(temp.querySelector('.e-img-resize'));
                    this.parent.formatter.getUndoRedoStack()[i].text = temp.innerHTML;
                }
            }
        }
    };
    Image.prototype.resizeEnd = function (e) {
        this.resizeBtnInit();
        this.imgEle.parentElement.style.cursor = 'auto';
        if (Browser.isDevice) {
            removeClass([e.target.parentElement], 'e-mob-span');
        }
        var args = isBlazor() ? { requestType: 'images' } : { event: e, requestType: 'images' };
        this.parent.trigger(events.resizeStop, args);
        var pageX = this.getPointX(e);
        var pageY = (this.parent.iframeSettings.enable) ? window.pageYOffset +
            this.parent.element.getBoundingClientRect().top + e.clientY : e.pageY;
        this.parent.formatter.editorManager.observer.on(events.checkUndo, this.undoStack, this);
        this.parent.formatter.saveData();
    };
    Image.prototype.resizeStart = function (e, ele) {
        var _this = this;
        if (this.parent.readonly) {
            return;
        }
        var target = ele ? ele : e.target;
        if (target.tagName === 'IMG') {
            this.parent.preventDefaultResize(e);
            var img = target;
            if (this.imgResizeDiv && this.contentModule.getEditPanel().contains(this.imgResizeDiv)) {
                detach(this.imgResizeDiv);
            }
            this.imageResize(img);
        }
        if (target.classList.contains('e-rte-imageboxmark')) {
            if (this.parent.formatter.getUndoRedoStack().length === 0) {
                this.parent.formatter.saveData();
            }
            this.pageX = this.getPointX(e);
            this.pageY = this.getPointY(e);
            e.preventDefault();
            e.stopImmediatePropagation();
            this.resizeBtnInit();
            if (this.quickToolObj) {
                this.quickToolObj.imageQTBar.hidePopup();
            }
            if (target.classList.contains('e-rte-topLeft')) {
                this.resizeBtnStat.topLeft = true;
            }
            if (target.classList.contains('e-rte-topRight')) {
                this.resizeBtnStat.topRight = true;
            }
            if (target.classList.contains('e-rte-botLeft')) {
                this.resizeBtnStat.botLeft = true;
            }
            if (target.classList.contains('e-rte-botRight')) {
                this.resizeBtnStat.botRight = true;
            }
            if (Browser.isDevice && this.contentModule.getEditPanel().contains(this.imgResizeDiv) &&
                !this.imgResizeDiv.classList.contains('e-mob-span')) {
                addClass([this.imgResizeDiv], 'e-mob-span');
            }
            else {
                var args = isBlazor() ? { requestType: 'images' } : { event: e, requestType: 'images' };
                this.parent.trigger(events.resizeStart, args, function (resizeStartArgs) {
                    if (resizeStartArgs.cancel) {
                        _this.cancelResizeAction();
                    }
                });
            }
            EventHandler.add(this.contentModule.getDocument(), Browser.touchEndEvent, this.resizeEnd, this);
        }
    };
    Image.prototype.imageClick = function (e) {
        if (Browser.isDevice) {
            if ((e.target.tagName === 'IMG' &&
                e.target.parentElement.tagName === 'A') ||
                (e.target.tagName === 'IMG')) {
                this.contentModule.getEditPanel().setAttribute('contenteditable', 'false');
                e.target.focus();
            }
            else {
                if (!this.parent.readonly) {
                    this.contentModule.getEditPanel().setAttribute('contenteditable', 'true');
                }
            }
        }
        if (e.target.tagName === 'IMG' &&
            e.target.parentElement.tagName === 'A') {
            e.preventDefault();
        }
    };
    Image.prototype.onCutHandler = function () {
        if (this.imgResizeDiv && this.contentModule.getEditPanel().contains(this.imgResizeDiv)) {
            this.cancelResizeAction();
        }
    };
    Image.prototype.imageResize = function (e) {
        this.resizeBtnInit();
        this.imgEle = e;
        addClass([this.imgEle], 'e-resize');
        this.imgResizeDiv = this.parent.createElement('span', { className: 'e-img-resize', id: this.rteID + '_imgResize' });
        this.imgResizeDiv.appendChild(this.parent.createElement('span', {
            className: 'e-rte-imageboxmark e-rte-topLeft', styles: 'cursor: nwse-resize'
        }));
        this.imgResizeDiv.appendChild(this.parent.createElement('span', {
            className: 'e-rte-imageboxmark e-rte-topRight', styles: 'cursor: nesw-resize'
        }));
        this.imgResizeDiv.appendChild(this.parent.createElement('span', {
            className: 'e-rte-imageboxmark e-rte-botLeft', styles: 'cursor: nesw-resize'
        }));
        this.imgResizeDiv.appendChild(this.parent.createElement('span', {
            className: 'e-rte-imageboxmark e-rte-botRight', styles: 'cursor: nwse-resize'
        }));
        if (Browser.isDevice) {
            addClass([this.imgResizeDiv], 'e-mob-rte');
        }
        e.style.outline = '2px solid #4a90e2';
        this.imgResizePos(e, this.imgResizeDiv);
        this.resizeImgDupPos(e);
        this.contentModule.getEditPanel().appendChild(this.imgResizeDiv);
        EventHandler.add(this.contentModule.getDocument(), Browser.touchMoveEvent, this.resizing, this);
    };
    Image.prototype.getPointX = function (e) {
        if (e.touches && e.touches.length) {
            return e.touches[0].pageX;
        }
        else {
            return e.pageX;
        }
    };
    Image.prototype.getPointY = function (e) {
        if (e.touches && e.touches.length) {
            return e.touches[0].pageY;
        }
        else {
            return e.pageY;
        }
    };
    Image.prototype.imgResizePos = function (e, imgResizeDiv) {
        var pos = this.calcPos(e);
        var top = pos.top;
        var left = pos.left;
        var imgWid = e.width;
        var imgHgt = e.height;
        var borWid = (Browser.isDevice) ? (4 * parseInt((e.style.outline.slice(-3)), 10)) + 2 :
            (2 * parseInt((e.style.outline.slice(-3)), 10)) + 2; //span border width + image outline width
        var devWid = ((Browser.isDevice) ? 0 : 2); // span border width
        imgResizeDiv.querySelector('.e-rte-botLeft').style.left = (left - borWid) + 'px';
        imgResizeDiv.querySelector('.e-rte-botLeft').style.top = ((imgHgt - borWid) + top) + 'px';
        imgResizeDiv.querySelector('.e-rte-botRight').style.left = ((imgWid - (borWid - devWid)) + left) + 'px';
        imgResizeDiv.querySelector('.e-rte-botRight').style.top = ((imgHgt - borWid) + top) + 'px';
        imgResizeDiv.querySelector('.e-rte-topRight').style.left = ((imgWid - (borWid - devWid)) + left) + 'px';
        imgResizeDiv.querySelector('.e-rte-topRight').style.top = (top - (borWid)) + 'px';
        imgResizeDiv.querySelector('.e-rte-topLeft').style.left = (left - borWid) + 'px';
        imgResizeDiv.querySelector('.e-rte-topLeft').style.top = (top - borWid) + 'px';
    };
    Image.prototype.calcPos = function (elem) {
        var ignoreOffset = ['TD', 'TH', 'TABLE', 'A'];
        var parentOffset = { top: 0, left: 0 };
        var offset = elem.getBoundingClientRect();
        var doc = elem.ownerDocument;
        var offsetParent = ((elem.offsetParent && (elem.offsetParent.classList.contains('e-img-caption') ||
            ignoreOffset.indexOf(elem.offsetParent.tagName) > -1)) ?
            closest(elem, '#' + this.parent.getID() + '_rte-edit-view') : elem.offsetParent) || doc.documentElement;
        while (offsetParent &&
            (offsetParent === doc.body || offsetParent === doc.documentElement) &&
            offsetParent.style.position === 'static') {
            offsetParent = offsetParent.parentNode;
        }
        if (offsetParent && offsetParent !== elem && offsetParent.nodeType === 1) {
            parentOffset = offsetParent.getBoundingClientRect();
        }
        return {
            top: offset.top - parentOffset.top,
            left: offset.left - parentOffset.left
        };
    };
    Image.prototype.setAspectRatio = function (img, expectedX, expectedY) {
        if (isNullOrUndefined(img.width)) {
            return;
        }
        var width = img.style.width !== '' ? parseInt(img.style.width, 10) : img.width;
        var height = img.style.height !== '' ? parseInt(img.style.height, 10) : img.height;
        if (width > height) {
            if (this.parent.insertImageSettings.resizeByPercent) {
                img.style.width = this.pixToPerc((width / height * expectedY), (img.previousElementSibling || img.parentElement)) + '%';
                img.style.height = null;
                img.removeAttribute('height');
            }
            else if (img.style.width !== '') {
                img.style.width = (width / height * expectedY) + 'px';
                img.style.height = expectedY + 'px';
            }
            else {
                img.setAttribute('width', (width / height * expectedY).toString());
                img.setAttribute('height', expectedY.toString());
            }
        }
        else if (height > width) {
            if (this.parent.insertImageSettings.resizeByPercent) {
                img.style.width = this.pixToPerc(expectedX, (img.previousElementSibling || img.parentElement)) + '%';
                img.style.height = null;
                img.removeAttribute('height');
            }
            else if (img.style.width !== '') {
                img.style.width = expectedX + 'px';
                img.style.height = (height / width * expectedX) + 'px';
            }
            else {
                img.setAttribute('width', expectedX.toString());
                img.setAttribute('height', (height / width * expectedX).toString());
            }
        }
        else {
            if (this.parent.insertImageSettings.resizeByPercent) {
                img.style.width = this.pixToPerc(expectedX, (img.previousElementSibling || img.parentElement)) + '%';
                img.style.height = null;
                img.removeAttribute('height');
            }
            else if (img.style.width !== '') {
                img.style.width = expectedX + 'px';
                img.style.height = expectedX + 'px';
            }
            else {
                img.setAttribute('width', expectedX.toString());
                img.setAttribute('height', expectedX.toString());
            }
        }
    };
    Image.prototype.getMaxWidth = function () {
        var maxWidth = this.parent.insertImageSettings.maxWidth;
        var imgPadding = 12;
        var imgResizeBorder = 2;
        var editEle = this.parent.contentModule.getEditPanel();
        var eleStyle = window.getComputedStyle(editEle);
        var editEleMaxWidth = editEle.offsetWidth - (imgPadding + imgResizeBorder +
            parseFloat(eleStyle.paddingLeft.split('px')[0]) + parseFloat(eleStyle.paddingRight.split('px')[0]) +
            parseFloat(eleStyle.marginLeft.split('px')[0]) + parseFloat(eleStyle.marginRight.split('px')[0]));
        return isNOU(maxWidth) ? editEleMaxWidth : maxWidth;
    };
    Image.prototype.pixToPerc = function (expected, parentEle) {
        return expected / parseFloat(getComputedStyle(parentEle).width) * 100;
    };
    Image.prototype.imgDupMouseMove = function (width, height, e) {
        var _this = this;
        var args = isBlazor() ? { requestType: 'images' } : { event: e, requestType: 'images' };
        this.parent.trigger(events.onResize, args, function (resizingArgs) {
            if (resizingArgs.cancel) {
                _this.cancelResizeAction();
            }
            else {
                if ((parseInt(_this.parent.insertImageSettings.minWidth, 10) >= parseInt(width, 10) ||
                    parseInt(_this.getMaxWidth(), 10) <= parseInt(width, 10))) {
                    return;
                }
                if (!_this.parent.insertImageSettings.resizeByPercent &&
                    (parseInt(_this.parent.insertImageSettings.minHeight, 10) >= parseInt(height, 10) ||
                        parseInt(_this.parent.insertImageSettings.maxHeight, 10) <= parseInt(height, 10))) {
                    return;
                }
                _this.imgEle.parentElement.style.cursor = 'pointer';
                _this.setAspectRatio(_this.imgEle, parseInt(width, 10), parseInt(height, 10));
                _this.resizeImgDupPos(_this.imgEle);
                _this.imgResizePos(_this.imgEle, _this.imgResizeDiv);
                _this.parent.setContentHeight('', false);
            }
        });
    };
    Image.prototype.resizing = function (e) {
        if (this.imgEle.offsetWidth >= this.getMaxWidth()) {
            this.imgEle.style.maxHeight = this.imgEle.offsetHeight + 'px';
        }
        var pageX = this.getPointX(e);
        var pageY = this.getPointY(e);
        var mouseX = (this.resizeBtnStat.botLeft || this.resizeBtnStat.topLeft) ? -(pageX - this.pageX) : (pageX - this.pageX);
        var mouseY = (this.resizeBtnStat.topLeft || this.resizeBtnStat.topRight) ? -(pageY - this.pageY) : (pageY - this.pageY);
        var width = parseInt(this.imgDupPos.width, 10) + mouseX;
        var height = parseInt(this.imgDupPos.height, 10) + mouseY;
        this.pageX = pageX;
        this.pageY = pageY;
        if (this.resizeBtnStat.botRight) {
            this.imgDupMouseMove(width + 'px', height + 'px', e);
        }
        else if (this.resizeBtnStat.botLeft) {
            this.imgDupMouseMove(width + 'px', height + 'px', e);
        }
        else if (this.resizeBtnStat.topRight) {
            this.imgDupMouseMove(width + 'px', height + 'px', e);
        }
        else if (this.resizeBtnStat.topLeft) {
            this.imgDupMouseMove(width + 'px', height + 'px', e);
        }
    };
    Image.prototype.cancelResizeAction = function () {
        EventHandler.remove(this.contentModule.getDocument(), Browser.touchMoveEvent, this.resizing);
        EventHandler.remove(this.contentModule.getDocument(), Browser.touchEndEvent, this.resizeEnd);
        if (this.imgEle && this.imgResizeDiv && this.contentModule.getEditPanel().contains(this.imgResizeDiv)) {
            detach(this.imgResizeDiv);
            this.imgEle.style.outline = '';
            this.imgResizeDiv = null;
            this.pageX = null;
            this.pageY = null;
        }
    };
    Image.prototype.resizeImgDupPos = function (e) {
        this.imgDupPos = {
            width: (e.style.height !== '') ? this.imgEle.style.width : e.width + 'px',
            height: (e.style.height !== '') ? this.imgEle.style.height : e.height + 'px'
        };
    };
    Image.prototype.resizeBtnInit = function () {
        return this.resizeBtnStat = { botLeft: false, botRight: false, topRight: false, topLeft: false };
    };
    Image.prototype.onToolbarAction = function (args) {
        if (isIDevice()) {
            this.parent.notify(events.selectionRestore, {});
        }
        var item = args.args.item;
        switch (item.subCommand) {
            case 'Replace':
                this.parent.notify(events.insertImage, args);
                break;
            case 'Caption':
                this.parent.notify(events.imageCaption, args);
                break;
            case 'InsertLink':
                this.parent.notify(events.imageLink, args);
                break;
            case 'AltText':
                this.parent.notify(events.imageAlt, args);
                break;
            case 'Remove':
                this.parent.notify(events.imageDelete, args);
                break;
            case 'Dimension':
                this.parent.notify(events.imageSize, args);
                break;
            case 'OpenImageLink':
                this.openImgLink(args);
                break;
            case 'EditImageLink':
                this.editImgLink(args);
                break;
            case 'RemoveImageLink':
                this.removeImgLink(args);
                break;
        }
    };
    Image.prototype.openImgLink = function (e) {
        var target = e.selectParent[0].parentNode.target === '' ? '_self' : '_blank';
        this.parent.formatter.process(this.parent, e.args, e.args, {
            url: e.selectParent[0].parentNode.href, target: target, selectNode: e.selectNode,
            subCommand: e.args.item.subCommand
        });
    };
    Image.prototype.editImgLink = function (e) {
        var selectParentEle = e.selectParent[0].parentNode;
        var linkUpdate = this.i10n.getConstant('dialogUpdate');
        var inputDetails = {
            url: selectParentEle.href, target: selectParentEle.target,
            header: 'Edit Link', btnText: linkUpdate
        };
        this.insertImgLink(e, inputDetails);
    };
    Image.prototype.removeImgLink = function (e) {
        if (Browser.isIE) {
            this.contentModule.getEditPanel().focus();
        }
        e.selection.restore();
        var isCapLink = (this.contentModule.getEditPanel().contains(this.captionEle) && select('a', this.captionEle)) ?
            true : false;
        var selectParent = isCapLink ? [this.captionEle] : [e.selectNode[0].parentElement];
        this.parent.formatter.process(this.parent, e.args, e.args, {
            insertElement: e.selectNode[0], selectParent: selectParent, selection: e.selection,
            subCommand: e.args.item.subCommand
        });
        if (this.quickToolObj && document.body.contains(this.quickToolObj.imageQTBar.element)) {
            this.quickToolObj.imageQTBar.hidePopup();
            if (!isNullOrUndefined(e.selectParent)) {
                removeClass([e.selectParent[0]], 'e-img-focus');
            }
        }
        if (isCapLink) {
            select('.e-img-inner', this.captionEle).focus();
        }
    };
    Image.prototype.onKeyDown = function (event) {
        var originalEvent = event.args;
        var range;
        var save;
        var selectNodeEle;
        var selectParentEle;
        this.deletedImg = [];
        var isCursor;
        var keyCodeValues = [27, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123,
            44, 45, 9, 16, 17, 18, 19, 20, 33, 34, 35, 36, 37, 38, 39, 40, 91, 92, 93, 144, 145, 182, 183];
        if (this.parent.editorMode === 'HTML') {
            range = this.parent.formatter.editorManager.nodeSelection.getRange(this.parent.contentModule.getDocument());
            isCursor = range.startContainer === range.endContainer && range.startOffset === range.endOffset;
        }
        if (!isCursor && this.parent.editorMode === 'HTML' && keyCodeValues.indexOf(originalEvent.which) < 0) {
            var nodes = this.parent.formatter.editorManager.nodeSelection.getNodeCollection(range);
            for (var i = 0; i < nodes.length; i++) {
                if (nodes[i].nodeName === 'IMG') {
                    this.deletedImg.push(nodes[i]);
                }
            }
        }
        if (this.parent.editorMode === 'HTML' && ((originalEvent.which === 8 && originalEvent.code === 'Backspace') ||
            (originalEvent.which === 46 && originalEvent.code === 'Delete'))) {
            var isCursor_1 = range.startContainer === range.endContainer && range.startOffset === range.endOffset;
            if ((originalEvent.which === 8 && originalEvent.code === 'Backspace' && isCursor_1)) {
                this.checkImageBack(range);
            }
            else if ((originalEvent.which === 46 && originalEvent.code === 'Delete' && isCursor_1)) {
                this.checkImageDel(range);
            }
        }
        if (!isNullOrUndefined(this.parent.formatter.editorManager.nodeSelection) &&
            originalEvent.code !== 'KeyK') {
            range = this.parent.formatter.editorManager.nodeSelection.getRange(this.parent.contentModule.getDocument());
            save = this.parent.formatter.editorManager.nodeSelection.save(range, this.parent.contentModule.getDocument());
            selectNodeEle = this.parent.formatter.editorManager.nodeSelection.getNodeCollection(range);
            selectParentEle = this.parent.formatter.editorManager.nodeSelection.getParentNodeCollection(range);
            if (!originalEvent.ctrlKey && originalEvent.key && (originalEvent.key.length === 1 || originalEvent.action === 'enter') &&
                (selectParentEle[0].tagName === 'IMG') && selectParentEle[0].parentElement) {
                var prev = selectParentEle[0].parentElement.childNodes[0];
                if (this.contentModule.getEditPanel().querySelector('.e-img-resize')) {
                    this.remvoeResizEle();
                }
                this.parent.formatter.editorManager.nodeSelection.setSelectionText(this.contentModule.getDocument(), prev, prev, prev.textContent.length, prev.textContent.length);
                removeClass([selectParentEle[0]], 'e-img-focus');
                this.quickToolObj.imageQTBar.hidePopup();
            }
        }
        if (originalEvent.ctrlKey && (originalEvent.keyCode === 89 || originalEvent.keyCode === 90)) {
            this.undoStack({ subCommand: (originalEvent.keyCode === 90 ? 'undo' : 'redo') });
        }
        if (originalEvent.keyCode === 8 || originalEvent.keyCode === 46) {
            if (selectNodeEle && selectNodeEle[0].nodeName === 'IMG' && selectNodeEle.length < 1) {
                originalEvent.preventDefault();
                var event_1 = {
                    selectNode: selectNodeEle, selection: save, selectParent: selectParentEle,
                    args: {
                        item: { command: 'Images', subCommand: 'Remove' },
                        originalEvent: originalEvent
                    }
                };
                this.deleteImg(event_1, originalEvent.keyCode);
            }
            if (this.parent.contentModule.getEditPanel().querySelector('.e-img-resize')) {
                this.remvoeResizEle();
            }
        }
        switch (originalEvent.action) {
            case 'escape':
                if (!isNullOrUndefined(this.dialogObj)) {
                    this.dialogObj.close();
                }
                break;
            case 'insert-image':
                if (this.parent.editorMode === 'HTML') {
                    this.insertImage({
                        args: {
                            item: { command: 'Images', subCommand: 'Image' },
                            originalEvent: originalEvent
                        },
                        selectNode: selectNodeEle,
                        selection: save,
                        selectParent: selectParentEle
                    });
                }
                else {
                    this.insertImage({
                        args: {
                            item: { command: 'Images', subCommand: 'Image' },
                            originalEvent: originalEvent
                        },
                        member: 'image',
                        text: this.parent.formatter.editorManager.markdownSelection.getSelectedText(this.parent.contentModule.getEditPanel()),
                        module: 'Markdown',
                        name: 'insertImage'
                    });
                }
                originalEvent.preventDefault();
                break;
        }
    };
    Image.prototype.onKeyUp = function (event) {
        if (!isNOU(this.deletedImg) && this.deletedImg.length > 0) {
            for (var i = 0; i < this.deletedImg.length; i++) {
                var args = {
                    element: this.deletedImg[i],
                    src: this.deletedImg[i].getAttribute('src')
                };
                this.parent.trigger(events.afterImageDelete, args);
            }
        }
    };
    Image.prototype.checkImageBack = function (range) {
        if (range.startContainer.nodeName === '#text' && range.startOffset === 0 &&
            !isNOU(range.startContainer.previousSibling) && range.startContainer.previousSibling.nodeName === 'IMG') {
            this.deletedImg.push(range.startContainer.previousSibling);
        }
        else if (range.startContainer.nodeName !== '#text' && !isNOU(range.startContainer.childNodes[range.startOffset - 1]) &&
            range.startContainer.childNodes[range.startOffset - 1].nodeName === 'IMG') {
            this.deletedImg.push(range.startContainer.childNodes[range.startOffset - 1]);
        }
    };
    Image.prototype.checkImageDel = function (range) {
        if (range.startContainer.nodeName === '#text' && range.startOffset === range.startContainer.textContent.length &&
            !isNOU(range.startContainer.nextSibling) && range.startContainer.nextSibling.nodeName === 'IMG') {
            this.deletedImg.push(range.startContainer.nextSibling);
        }
        else if (range.startContainer.nodeName !== '#text' && !isNOU(range.startContainer.childNodes[range.startOffset]) &&
            range.startContainer.childNodes[range.startOffset].nodeName === 'IMG') {
            this.deletedImg.push(range.startContainer.childNodes[range.startOffset]);
        }
    };
    Image.prototype.alignmentSelect = function (e) {
        var item = e.item;
        if (!document.body.contains(document.body.querySelector('.e-rte-quick-toolbar')) || item.command !== 'Images') {
            return;
        }
        var range = this.parent.formatter.editorManager.nodeSelection.getRange(this.parent.contentModule.getDocument());
        var selectNodeEle = this.parent.formatter.editorManager.nodeSelection.getNodeCollection(range);
        selectNodeEle = (selectNodeEle[0].nodeName === 'IMG') ? selectNodeEle : [this.imgEle];
        var args = { args: e, selectNode: selectNodeEle };
        if (this.parent.formatter.getUndoRedoStack().length === 0) {
            this.parent.formatter.saveData();
        }
        switch (item.subCommand) {
            case 'JustifyLeft':
                this.justifyImageLeft(args);
                break;
            case 'JustifyCenter':
                this.justifyImageCenter(args);
                break;
            case 'JustifyRight':
                this.justifyImageRight(args);
                break;
            case 'Inline':
                this.inline(args);
                break;
            case 'Break':
                this.break(args);
                break;
        }
        if (this.quickToolObj && document.body.contains(this.quickToolObj.imageQTBar.element)) {
            this.quickToolObj.imageQTBar.hidePopup();
            removeClass([selectNodeEle[0]], 'e-img-focus');
        }
        this.cancelResizeAction();
    };
    Image.prototype.imageWithLinkQTBarItemUpdate = function () {
        var separator;
        var items = this.quickToolObj.imageQTBar.toolbarElement.querySelectorAll('.e-toolbar-item');
        for (var i = 0; i < items.length; i++) {
            if (items[i].getAttribute('title') === this.i10n.getConstant('openLink') ||
                items[i].getAttribute('title') === this.i10n.getConstant('editLink') ||
                items[i].getAttribute('title') === this.i10n.getConstant('removeLink')) {
                addClass([items[i]], 'e-link-groups');
                items[i].style.display = 'none';
            }
            else if (items[i].getAttribute('title') === 'Insert Link') {
                items[i].style.display = '';
            }
            else if (items[i].classList.contains('e-rte-horizontal-separator')) {
                separator = items[i];
                detach(items[i]);
            }
        }
        var newItems = this.quickToolObj.imageQTBar.toolbarElement.querySelectorAll('.e-toolbar-item:not(.e-link-groups)');
        this.quickToolObj.imageQTBar.addQTBarItem(['-'], Math.round(newItems.length / 2));
    };
    Image.prototype.showImageQuickToolbar = function (e) {
        var _this = this;
        if (e.type !== 'Images' || isNullOrUndefined(this.parent.quickToolbarModule)
            || isNullOrUndefined(this.parent.quickToolbarModule.imageQTBar)) {
            return;
        }
        this.quickToolObj = this.parent.quickToolbarModule;
        var args = e.args;
        var target = e.elements;
        [].forEach.call(e.elements, function (element, index) {
            if (index === 0) {
                target = element;
            }
        });
        if (target && !closest(target, 'a')) {
            this.imageWithLinkQTBarItemUpdate();
        }
        if (target.nodeName === 'IMG') {
            addClass([target], ['e-img-focus']);
        }
        var pageY = (this.parent.iframeSettings.enable) ? window.pageYOffset +
            this.parent.element.getBoundingClientRect().top + args.clientY : args.pageY;
        if (this.parent.quickToolbarModule.imageQTBar) {
            if (e.isNotify) {
                setTimeout(function () { _this.quickToolObj.imageQTBar.showPopup(args.pageX, pageY, target); }, 400);
            }
            else {
                this.quickToolObj.imageQTBar.showPopup(args.pageX, pageY, target);
            }
        }
    };
    Image.prototype.hideImageQuickToolbar = function () {
        if (!isNullOrUndefined(this.contentModule.getEditPanel().querySelector('.e-img-focus'))) {
            removeClass([this.contentModule.getEditPanel().querySelector('.e-img-focus')], 'e-img-focus');
            if (this.quickToolObj && this.quickToolObj.imageQTBar && document.body.contains(this.quickToolObj.imageQTBar.element)) {
                this.quickToolObj.imageQTBar.hidePopup();
            }
        }
    };
    Image.prototype.editAreaClickHandler = function (e) {
        if (this.parent.readonly) {
            this.hideImageQuickToolbar();
            return;
        }
        var args = e.args;
        var showOnRightClick = this.parent.quickToolbarSettings.showOnRightClick;
        if (args.which === 2 || (showOnRightClick && args.which === 1) || (!showOnRightClick && args.which === 3)) {
            if ((showOnRightClick && args.which === 1) && !isNullOrUndefined(args.target) &&
                args.target.tagName === 'IMG') {
                this.parent.formatter.editorManager.nodeSelection.Clear(this.contentModule.getDocument());
                this.parent.formatter.editorManager.nodeSelection.setSelectionContents(this.contentModule.getDocument(), args.target);
            }
            return;
        }
        if (this.parent.editorMode === 'HTML' && this.parent.quickToolbarModule && this.parent.quickToolbarModule.imageQTBar) {
            this.quickToolObj = this.parent.quickToolbarModule;
            var target = args.target;
            this.contentModule = this.rendererFactory.getRenderer(RenderType.Content);
            var isPopupOpen = this.quickToolObj.imageQTBar.element.classList.contains('e-rte-pop');
            if (target.nodeName === 'IMG' && this.parent.quickToolbarModule) {
                if (isPopupOpen) {
                    return;
                }
                this.parent.formatter.editorManager.nodeSelection.Clear(this.contentModule.getDocument());
                this.parent.formatter.editorManager.nodeSelection.setSelectionContents(this.contentModule.getDocument(), target);
                if (isIDevice()) {
                    this.parent.notify(events.selectionSave, e);
                }
                addClass([target], 'e-img-focus');
                var items = this.quickToolObj.imageQTBar.toolbarElement.querySelectorAll('.e-toolbar-item');
                var separator = void 0;
                if (closest(target, 'a')) {
                    for (var i = 0; i < items.length; i++) {
                        if (items[i].getAttribute('title') === this.i10n.getConstant('openLink') ||
                            items[i].getAttribute('title') === this.i10n.getConstant('editLink') ||
                            items[i].getAttribute('title') === this.i10n.getConstant('removeLink')) {
                            items[i].style.display = '';
                            removeClass([items[i]], 'e-link-groups');
                        }
                        else if (items[i].getAttribute('title') === 'Insert Link') {
                            items[i].style.display = 'none';
                        }
                        else if (items[i].classList.contains('e-rte-horizontal-separator')) {
                            separator = items[i];
                            detach(items[i]);
                        }
                    }
                    var newItems = this.quickToolObj.imageQTBar.toolbarElement.querySelectorAll('.e-toolbar-item:not(.e-link-groups)');
                    this.quickToolObj.imageQTBar.addQTBarItem(['-'], Math.round(newItems.length / 2));
                }
                else if (!closest(target, 'a')) {
                    this.imageWithLinkQTBarItemUpdate();
                }
                this.showImageQuickToolbar({ args: args, type: 'Images', elements: [args.target] });
            }
            else {
                this.hideImageQuickToolbar();
            }
        }
    };
    Image.prototype.insertImgLink = function (e, inputDetails) {
        var _this = this;
        if (e.selectNode[0].nodeName !== 'IMG') {
            return;
        }
        this.imagDialog(e);
        if (!isNullOrUndefined(this.dialogObj)) {
            var linkWrap = this.parent.createElement('div', { className: 'e-img-linkwrap' });
            var linkUrl = this.i10n.getConstant('linkurl');
            var content = '<div class="e-rte-field">' +
                '<input type="text" data-role ="none" class="e-input e-img-link" spellcheck="false" placeholder="' + linkUrl + '"/></div>' +
                '<div class="e-rte-label"></div>' + '<div class="e-rte-field">' +
                '<input type="checkbox" class="e-rte-linkTarget"  data-role ="none"></div>';
            var contentElem = parseHtml(content);
            linkWrap.appendChild(contentElem);
            var linkTarget = linkWrap.querySelector('.e-rte-linkTarget');
            var inputLink = linkWrap.querySelector('.e-img-link');
            var linkOpenLabel = this.i10n.getConstant('linkOpenInNewWindow');
            this.checkBoxObj = new CheckBox({
                label: linkOpenLabel, checked: true, enableRtl: this.parent.enableRtl, change: function (e) {
                    if (e.checked) {
                        target_1 = '_blank';
                    }
                    else {
                        target_1 = null;
                    }
                }
            });
            this.checkBoxObj.isStringTemplate = true;
            this.checkBoxObj.createElement = this.parent.createElement;
            this.checkBoxObj.appendTo(linkTarget);
            var target_1 = this.checkBoxObj.checked ? '_blank' : null;
            var linkUpdate = this.i10n.getConstant('dialogUpdate');
            var linkargs_1 = {
                args: e.args,
                selfImage: this, selection: e.selection,
                selectNode: e.selectNode, selectParent: e.selectParent, link: inputLink, target: target_1
            };
            this.dialogObj.setProperties({
                height: 'inherit',
                width: '290px',
                header: this.parent.localeObj.getConstant('imageInsertLinkHeader'),
                content: linkWrap,
                position: { X: 'center', Y: 'center' },
                buttons: [{
                        click: function (e) { _this.insertlink(linkargs_1); },
                        buttonModel: {
                            content: linkUpdate, cssClass: 'e-flat e-update-link', isPrimary: true
                        }
                    }]
            });
            if (!isNullOrUndefined(inputDetails)) {
                inputLink.value = inputDetails.url;
                (inputDetails.target) ? this.checkBoxObj.checked = true : this.checkBoxObj.checked = false;
                this.dialogObj.header = inputDetails.header;
            }
            this.dialogObj.element.style.maxHeight = 'inherit';
            this.dialogObj.content.querySelector('input').focus();
        }
    };
    Image.prototype.insertAltText = function (e) {
        var _this = this;
        if (e.selectNode[0].nodeName !== 'IMG') {
            return;
        }
        this.imagDialog(e);
        var altText = this.i10n.getConstant('altText');
        if (!isNullOrUndefined(this.dialogObj)) {
            var altWrap = this.parent.createElement('div', { className: 'e-img-altwrap' });
            var altHeader = this.i10n.getConstant('alternateHeader');
            var linkUpdate = this.i10n.getConstant('dialogUpdate');
            var getAlt = (e.selectNode[0].getAttribute('alt') === null) ? '' :
                e.selectNode[0].getAttribute('alt');
            var content = '<div class="e-rte-field">' +
                '<input type="text" spellcheck="false" value="' + getAlt + '" class="e-input e-img-alt" placeholder="' + altText + '"/>' +
                '</div>';
            var contentElem = parseHtml(content);
            altWrap.appendChild(contentElem);
            var inputAlt = altWrap.querySelector('.e-img-alt');
            var altArgs_1 = {
                args: e.args, selfImage: this, selection: e.selection, selectNode: e.selectNode,
                alt: inputAlt
            };
            this.dialogObj.setProperties({
                height: 'inherit', width: '290px', header: altHeader, content: altWrap, position: { X: 'center', Y: 'center' },
                buttons: [{
                        click: function (e) { _this.insertAlt(altArgs_1); },
                        buttonModel: {
                            content: linkUpdate, cssClass: 'e-flat e-update-alt', isPrimary: true
                        }
                    }]
            });
            this.dialogObj.element.style.maxHeight = 'inherit';
            this.dialogObj.content.querySelector('input').focus();
        }
    };
    Image.prototype.insertAlt = function (e) {
        if (!isNullOrUndefined(e.alt)) {
            e.selection.restore();
            if (this.parent.formatter.getUndoRedoStack().length === 0) {
                this.parent.formatter.saveData();
            }
            var altText = e.alt.value;
            this.parent.formatter.process(this.parent, e.args, e.args, {
                altText: altText, selectNode: e.selectNode,
                subCommand: e.args.item.subCommand
            });
            this.dialogObj.hide({ returnValue: false });
        }
    };
    Image.prototype.insertlink = function (e) {
        if (e.selectNode[0].nodeName !== 'IMG') {
            return;
        }
        var url = e.link.value;
        if (url === '') {
            addClass([e.link], 'e-error');
            e.link.setSelectionRange(0, url.length);
            e.link.focus();
            return;
        }
        if (!this.isUrl(url)) {
            url = 'http://' + url;
        }
        else {
            removeClass([e.link], 'e-error');
        }
        var proxy = e.selfImage;
        if (proxy.parent.editorMode === 'HTML') {
            e.selection.restore();
        }
        if (proxy.parent.formatter.getUndoRedoStack().length === 0) {
            proxy.parent.formatter.saveData();
        }
        if (e.selectNode[0].parentElement.nodeName === 'A') {
            proxy.parent.formatter.process(proxy.parent, e.args, e.args, {
                url: url, target: proxy.checkBoxObj.checked ? '_blank' : null, selectNode: e.selectNode,
                subCommand: e.args.item.subCommand
            });
            proxy.dialogObj.hide({ returnValue: true });
            return;
        }
        proxy.parent.formatter.process(proxy.parent, e.args, e.args, {
            url: url, target: proxy.checkBoxObj.checked ? '_blank' : null, selectNode: e.selectNode,
            subCommand: e.args.item.subCommand, selection: e.selection
        });
        var captionEle = closest(e.selectNode[0], '.e-img-caption');
        if (captionEle) {
            select('.e-img-inner', captionEle).focus();
        }
        proxy.dialogObj.hide({ returnValue: false });
    };
    Image.prototype.isUrl = function (url) {
        var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/gi;
        return regexp.test(url);
    };
    Image.prototype.deleteImg = function (e, keyCode) {
        if (e.selectNode[0].nodeName !== 'IMG') {
            return;
        }
        var args = {
            element: e.selectNode[0],
            src: e.selectNode[0].getAttribute('src')
        };
        if (this.parent.formatter.getUndoRedoStack().length === 0) {
            this.parent.formatter.saveData();
        }
        e.selection.restore();
        if (this.contentModule.getEditPanel().querySelector('.e-img-resize')) {
            this.remvoeResizEle();
        }
        this.parent.formatter.process(this.parent, e.args, e.args, {
            selectNode: e.selectNode,
            captionClass: classes.CLS_CAPTION,
            subCommand: e.args.item.subCommand
        });
        if (this.quickToolObj && document.body.contains(this.quickToolObj.imageQTBar.element)) {
            this.quickToolObj.imageQTBar.hidePopup();
        }
        this.cancelResizeAction();
        if (isNullOrUndefined(keyCode)) {
            this.parent.trigger(events.afterImageDelete, args);
        }
    };
    Image.prototype.caption = function (e) {
        var selectNode = e.selectNode[0];
        if (selectNode.nodeName !== 'IMG') {
            return;
        }
        e.selection.restore();
        if (this.parent.formatter.getUndoRedoStack().length === 0) {
            this.parent.formatter.saveData();
        }
        this.cancelResizeAction();
        addClass([selectNode], 'e-rte-image');
        var subCommand = (e.args.item) ?
            e.args.item.subCommand : 'Caption';
        if (!isNullOrUndefined(closest(selectNode, '.' + classes.CLS_CAPTION))) {
            detach(closest(selectNode, '.' + classes.CLS_CAPTION));
            if (Browser.isIE) {
                this.contentModule.getEditPanel().focus();
                e.selection.restore();
            }
            if (selectNode.parentElement.tagName === 'A') {
                this.parent.formatter.process(this.parent, e.args, e.args, { insertElement: selectNode.parentElement, selectNode: e.selectNode, subCommand: subCommand });
            }
            else {
                this.parent.formatter.process(this.parent, e.args, e.args, { insertElement: selectNode, selectNode: e.selectNode, subCommand: subCommand });
            }
        }
        else {
            this.captionEle = this.parent.createElement('span', {
                className: classes.CLS_CAPTION + ' ' + classes.CLS_RTE_CAPTION,
                attrs: { contenteditable: 'false', draggable: 'false' }
            });
            var imgWrap = this.parent.createElement('span', { className: 'e-img-wrap' });
            var imgInner = this.parent.createElement('span', { className: 'e-img-inner', attrs: { contenteditable: 'true' } });
            var parent_1 = e.selectNode[0].parentElement;
            if (parent_1.tagName === 'A') {
                parent_1.setAttribute('contenteditable', 'true');
            }
            imgWrap.appendChild(parent_1.tagName === 'A' ? parent_1 : e.selectNode[0]);
            imgWrap.appendChild(imgInner);
            var imgCaption = this.i10n.getConstant('imageCaption');
            imgInner.innerHTML = imgCaption;
            this.captionEle.appendChild(imgWrap);
            if (selectNode.classList.contains(classes.CLS_IMGINLINE)) {
                addClass([this.captionEle], classes.CLS_CAPINLINE);
            }
            if (selectNode.classList.contains(classes.CLS_IMGBREAK)) {
                addClass([this.captionEle], classes.CLS_IMGBREAK);
            }
            if (selectNode.classList.contains(classes.CLS_IMGLEFT)) {
                addClass([this.captionEle], classes.CLS_IMGLEFT);
            }
            if (selectNode.classList.contains(classes.CLS_IMGRIGHT)) {
                addClass([this.captionEle], classes.CLS_IMGRIGHT);
            }
            if (selectNode.classList.contains(classes.CLS_IMGCENTER)) {
                addClass([this.captionEle], classes.CLS_IMGCENTER);
            }
            this.parent.formatter.process(this.parent, e.args, e.args, { insertElement: this.captionEle, selectNode: e.selectNode, subCommand: subCommand });
            this.parent.formatter.editorManager.nodeSelection.setSelectionText(this.contentModule.getDocument(), imgInner.childNodes[0], imgInner.childNodes[0], 0, imgInner.childNodes[0].textContent.length);
        }
        if (this.quickToolObj && document.body.contains(this.quickToolObj.imageQTBar.element)) {
            this.quickToolObj.imageQTBar.hidePopup();
            removeClass([selectNode], 'e-img-focus');
        }
    };
    Image.prototype.imageSize = function (e) {
        var _this = this;
        if (e.selectNode[0].nodeName !== 'IMG') {
            return;
        }
        this.imagDialog(e);
        if (!isNullOrUndefined(this.dialogObj)) {
            var imgSizeHeader = this.i10n.getConstant('imageSizeHeader');
            var linkUpdate = this.i10n.getConstant('dialogUpdate');
            var dialogContent = this.imgsizeInput(e);
            var selectObj_1 = { args: e.args, selfImage: this, selection: e.selection, selectNode: e.selectNode };
            this.dialogObj.setProperties({
                height: 'inherit', width: '290px', header: imgSizeHeader, content: dialogContent, position: { X: 'center', Y: 'center' },
                buttons: [{
                        click: function (e) { _this.insertSize(selectObj_1); },
                        buttonModel: {
                            content: linkUpdate, cssClass: 'e-flat e-update-size', isPrimary: true
                        }
                    }]
            });
            this.dialogObj.element.style.maxHeight = 'inherit';
            this.dialogObj.content.querySelector('input').focus();
        }
    };
    Image.prototype.break = function (e) {
        if (e.selectNode[0].nodeName !== 'IMG') {
            return;
        }
        var subCommand = (e.args.item) ?
            e.args.item.subCommand : 'Break';
        this.parent.formatter.process(this.parent, e.args, e.args, { selectNode: e.selectNode, subCommand: subCommand });
    };
    Image.prototype.inline = function (e) {
        if (e.selectNode[0].nodeName !== 'IMG') {
            return;
        }
        var subCommand = (e.args.item) ?
            e.args.item.subCommand : 'Inline';
        this.parent.formatter.process(this.parent, e.args, e.args, { selectNode: e.selectNode, subCommand: subCommand });
    };
    Image.prototype.justifyImageLeft = function (e) {
        var subCommand = (e.args.item) ?
            e.args.item.subCommand : 'JustifyLeft';
        this.parent.formatter.process(this.parent, e.args, e.args, { selectNode: e.selectNode, subCommand: subCommand });
    };
    Image.prototype.justifyImageRight = function (e) {
        var subCommand = (e.args.item) ?
            e.args.item.subCommand : 'JustifyRight';
        this.parent.formatter.process(this.parent, e.args, e.args, { selectNode: e.selectNode, subCommand: subCommand });
    };
    Image.prototype.justifyImageCenter = function (e) {
        var subCommand = (e.args.item) ?
            e.args.item.subCommand : 'JustifyCenter';
        this.parent.formatter.process(this.parent, e.args, e.args, { selectNode: e.selectNode, subCommand: subCommand });
    };
    Image.prototype.imagDialog = function (e) {
        var _this = this;
        if (this.dialogObj) {
            this.dialogObj.hide({ returnValue: true });
            return;
        }
        var imgDialog = this.parent.createElement('div', { className: 'e-rte-img-dialog', id: this.rteID + '_image' });
        this.parent.element.appendChild(imgDialog);
        var imgInsert = this.i10n.getConstant('dialogInsert');
        var imglinkCancel = this.i10n.getConstant('dialogCancel');
        var imgHeader = this.i10n.getConstant('imageHeader');
        var selection = e.selection;
        var selectObj = { selfImage: this, selection: e.selection, args: e.args, selectParent: e.selectParent };
        var dialogModel = {
            header: imgHeader,
            cssClass: classes.CLS_RTE_ELEMENTS,
            enableRtl: this.parent.enableRtl,
            locale: this.parent.locale,
            showCloseIcon: true, closeOnEscape: true, width: (Browser.isDevice) ? '290px' : '340px', height: 'inherit',
            position: { X: 'center', Y: (Browser.isDevice) ? 'center' : 'top' },
            isModal: Browser.isDevice,
            buttons: [{
                    click: this.insertImageUrl.bind(selectObj),
                    buttonModel: { content: imgInsert, cssClass: 'e-flat e-insertImage', isPrimary: true }
                },
                {
                    click: function (e) { _this.cancelDialog(e); },
                    buttonModel: { cssClass: 'e-flat e-cancel', content: imglinkCancel }
                }],
            target: (Browser.isDevice) ? document.body : this.parent.element,
            animationSettings: { effect: 'None' },
            close: function (event) {
                if (_this.isImgUploaded) {
                    _this.uploadObj.removing();
                }
                _this.parent.isBlur = false;
                if (event && event.event.returnValue) {
                    if (_this.parent.editorMode === 'HTML') {
                        selection.restore();
                    }
                    else {
                        _this.parent.formatter.editorManager.markdownSelection.restore(_this.parent.contentModule.getEditPanel());
                    }
                }
                _this.dialogObj.destroy();
                detach(_this.dialogObj.element);
                _this.dialogRenderObj.close(event);
                _this.dialogObj = null;
            },
        };
        var dialogContent = this.parent.createElement('div', { className: 'e-img-content' });
        if ((!isNullOrUndefined(this.parent.insertImageSettings.path) && this.parent.editorMode === 'Markdown')
            || this.parent.editorMode === 'HTML') {
            dialogContent.appendChild(this.imgUpload(e));
        }
        var linkHeader = this.parent.createElement('div', { className: 'e-linkheader' });
        var linkHeaderText = this.i10n.getConstant('imageLinkHeader');
        if (this.parent.editorMode === 'HTML') {
            linkHeader.innerHTML = linkHeaderText;
        }
        else {
            linkHeader.innerHTML = this.i10n.getConstant('mdimageLink');
        }
        dialogContent.appendChild(linkHeader);
        dialogContent.appendChild(this.imageUrlPopup(e));
        if (e.selectNode && e.selectNode[0].nodeName === 'IMG') {
            dialogModel.header = this.parent.localeObj.getConstant('editImageHeader');
            dialogModel.content = dialogContent;
        }
        else {
            dialogModel.content = dialogContent;
        }
        this.dialogObj = this.dialogRenderObj.render(dialogModel);
        this.dialogObj.createElement = this.parent.createElement;
        this.dialogObj.appendTo(imgDialog);
        if (e.selectNode && e.selectNode[0].nodeName === 'IMG' && (e.name === 'insertImage')) {
            this.dialogObj.element.querySelector('.e-insertImage').textContent = this.parent.localeObj.getConstant('dialogUpdate');
        }
        imgDialog.style.maxHeight = 'inherit';
        if (this.quickToolObj) {
            if (this.quickToolObj.imageQTBar && document.body.contains(this.quickToolObj.imageQTBar.element)) {
                this.quickToolObj.imageQTBar.hidePopup();
                if (!isNullOrUndefined(e.selectParent)) {
                    removeClass([e.selectParent[0]], 'e-img-focus');
                }
            }
            if (this.quickToolObj.inlineQTBar && document.body.contains(this.quickToolObj.inlineQTBar.element)) {
                this.quickToolObj.inlineQTBar.hidePopup();
            }
        }
    };
    Image.prototype.cancelDialog = function (e) {
        this.parent.isBlur = false;
        this.dialogObj.hide({ returnValue: true });
        if (this.isImgUploaded) {
            this.uploadObj.removing();
        }
    };
    Image.prototype.onDocumentClick = function (e) {
        var target = e.target;
        if (target.nodeName === 'IMG') {
            this.imgEle = target;
        }
        if (!isNullOrUndefined(this.dialogObj) && ((!closest(target, '#' + this.dialogObj.element.id) && this.parent.toolbarSettings.enable && this.parent.getToolbarElement() &&
            !this.parent.getToolbarElement().contains(e.target)) ||
            (this.parent.getToolbarElement() && this.parent.getToolbarElement().contains(e.target) &&
                !closest(target, '#' + this.parent.getID() + '_toolbar_Image') &&
                !target.querySelector('#' + this.parent.getID() + '_toolbar_Image')))) {
            this.dialogObj.hide({ returnValue: true });
            this.parent.isBlur = true;
            dispatchEvent(this.parent.element, 'focusout');
        }
        if (e.target.tagName !== 'IMG' && this.imgResizeDiv && !(this.quickToolObj &&
            this.quickToolObj.imageQTBar && this.quickToolObj.imageQTBar.element.contains(e.target)) &&
            this.contentModule.getEditPanel().contains(this.imgResizeDiv)) {
            this.cancelResizeAction();
        }
        if (target.tagName !== 'IMG' && this.contentModule.getEditPanel().querySelector('.e-img-resize')) {
            this.remvoeResizEle();
            this.contentModule.getEditPanel().querySelector('img').style.outline = '';
        }
    };
    Image.prototype.remvoeResizEle = function () {
        EventHandler.remove(this.contentModule.getDocument(), Browser.touchMoveEvent, this.resizing);
        EventHandler.remove(this.contentModule.getDocument(), Browser.touchEndEvent, this.resizeEnd);
        detach(this.contentModule.getEditPanel().querySelector('.e-img-resize'));
    };
    Image.prototype.imageUrlPopup = function (e) {
        var imgUrl = this.parent.createElement('div', { className: 'imgUrl' });
        var placeUrl = this.i10n.getConstant('imageUrl');
        this.inputUrl = this.parent.createElement('input', {
            className: 'e-input e-img-url',
            attrs: { placeholder: placeUrl, spellcheck: 'false' }
        });
        imgUrl.appendChild(this.inputUrl);
        return imgUrl;
    };
    Image.prototype.insertImageUrl = function (e) {
        var proxy = this.selfImage;
        proxy.isImgUploaded = false;
        var url = proxy.inputUrl.value;
        if (proxy.parent.formatter.getUndoRedoStack().length === 0) {
            proxy.parent.formatter.saveData();
        }
        if (!isNullOrUndefined(proxy.uploadUrl) && proxy.uploadUrl.url !== '') {
            proxy.uploadUrl.cssClass = (proxy.parent.insertImageSettings.display === 'inline' ?
                classes.CLS_IMGINLINE : classes.CLS_IMGBREAK);
            proxy.dialogObj.hide({ returnValue: false });
            proxy.parent.formatter.process(proxy.parent, this.args, this.args.originalEvent, proxy.uploadUrl);
            proxy.uploadUrl.url = '';
            if (proxy.contentModule.getEditPanel().querySelector('.e-img-resize')) {
                proxy.imgEle.style.outline = '';
                proxy.remvoeResizEle();
            }
        }
        else if (url !== '') {
            if (proxy.parent.editorMode === 'HTML' && isNullOrUndefined(closest(this.selection.range.startContainer.parentNode, '#' + proxy.contentModule.getPanel().id))) {
                proxy.contentModule.getEditPanel().focus();
                var range = proxy.parent.formatter.editorManager.nodeSelection.getRange(proxy.contentModule.getDocument());
                this.selection = proxy.parent.formatter.editorManager.nodeSelection.save(range, proxy.contentModule.getDocument());
                this.selectParent = proxy.parent.formatter.editorManager.nodeSelection.getParentNodeCollection(range);
            }
            var regex = /[\w-]+.(jpg|png|jpeg|gif)/g;
            var matchUrl = (!isNullOrUndefined(url.match(regex)) && proxy.parent.editorMode === 'HTML') ? url.match(regex)[0] : '';
            var value = {
                cssClass: (proxy.parent.insertImageSettings.display === 'inline' ? classes.CLS_IMGINLINE : classes.CLS_IMGBREAK),
                url: url, selection: this.selection, altText: matchUrl,
                selectParent: this.selectParent, width: {
                    width: proxy.parent.insertImageSettings.width, minWidth: proxy.parent.insertImageSettings.minWidth,
                    maxWidth: proxy.getMaxWidth()
                },
                height: {
                    height: proxy.parent.insertImageSettings.height, minHeight: proxy.parent.insertImageSettings.minHeight,
                    maxHeight: proxy.parent.insertImageSettings.maxHeight
                }
            };
            proxy.parent.formatter.process(proxy.parent, this.args, this.args.originalEvent, value);
            proxy.dialogObj.hide({ returnValue: false });
        }
    };
    Image.prototype.imgsizeInput = function (e) {
        var selectNode = e.selectNode[0];
        var imgHeight = this.i10n.getConstant('imageHeight');
        var imgWidth = this.i10n.getConstant('imageWidth');
        var imgSizeWrap = this.parent.createElement('div', { className: 'e-img-sizewrap' });
        var widthVal = (selectNode.getAttribute('width') === 'auto' ||
            isNullOrUndefined(selectNode.getAttribute('width'))) ? selectNode.width : selectNode.getClientRects()[0].width;
        var heightVal = (selectNode.getAttribute('height') === 'auto' ||
            isNullOrUndefined(selectNode.getAttribute('height'))) ? selectNode.height : selectNode.getClientRects()[0].height;
        var content = '<div class="e-rte-label"><label>' + imgWidth +
            '</label></div><div class="e-rte-field"><input type="text" data-role ="none" id="imgwidth" class="e-img-width" value=' +
            widthVal
            + ' /></div>' +
            '<div class="e-rte-label">' + '<label>' + imgHeight + '</label></div><div class="e-rte-field"> ' +
            '<input type="text" data-role ="none" id="imgheight" class="e-img-height" value=' +
            heightVal
            + ' /></div>';
        var contentElem = parseHtml(content);
        imgSizeWrap.appendChild(contentElem);
        var widthNum = new NumericTextBox({
            format: '###.### px', min: this.parent.insertImageSettings.minWidth,
            max: this.getMaxWidth(),
            enableRtl: this.parent.enableRtl, locale: this.parent.locale
        });
        widthNum.isStringTemplate = true;
        widthNum.createElement = this.parent.createElement;
        widthNum.appendTo(imgSizeWrap.querySelector('#imgwidth'));
        var heightNum = new NumericTextBox({
            format: '###.### px', min: this.parent.insertImageSettings.minHeight,
            max: this.parent.insertImageSettings.maxHeight,
            enableRtl: this.parent.enableRtl, locale: this.parent.locale
        });
        heightNum.isStringTemplate = true;
        heightNum.createElement = this.parent.createElement;
        heightNum.appendTo(imgSizeWrap.querySelector('#imgheight'));
        return imgSizeWrap;
    };
    Image.prototype.insertSize = function (e) {
        e.selection.restore();
        var proxy = e.selfImage;
        if (proxy.parent.formatter.getUndoRedoStack().length === 0) {
            proxy.parent.formatter.saveData();
        }
        var dialogEle = proxy.dialogObj.element;
        var width = parseFloat(dialogEle.querySelector('.e-img-width').value);
        var height = parseFloat(dialogEle.parentElement.querySelector('.e-img-height').value);
        proxy.parent.formatter.process(this.parent, e.args, e.args, {
            width: width, height: height, selectNode: e.selectNode,
            subCommand: e.args.item.subCommand
        });
        if (this.imgResizeDiv) {
            proxy.imgResizePos(e.selectNode[0], this.imgResizeDiv);
        }
        proxy.dialogObj.hide({ returnValue: true });
    };
    Image.prototype.insertImage = function (e) {
        this.imagDialog(e);
        if (!isNullOrUndefined(this.dialogObj)) {
            this.dialogObj.element.style.maxHeight = 'inherit';
            var dialogContent = this.dialogObj.element.querySelector('.e-img-content');
            if ((!isNullOrUndefined(this.parent.insertImageSettings.path) && this.parent.editorMode === 'Markdown')
                || this.parent.editorMode === 'HTML') {
                dialogContent.querySelector('#' + this.rteID + '_insertImage').focus();
            }
            else {
                dialogContent.querySelector('.e-img-url').focus();
            }
        }
    };
    Image.prototype.imgUpload = function (e) {
        var _this = this;
        var save;
        var selectParent;
        var proxy = this;
        var iframe = proxy.parent.iframeSettings.enable;
        if (proxy.parent.editorMode === 'HTML' && (!iframe && isNullOrUndefined(closest(e.selection.range.startContainer.parentNode, '#' +
            this.parent.contentModule.getPanel().id))
            || (iframe && !hasClass(e.selection.range.startContainer.parentNode.ownerDocument.querySelector('body'), 'e-lib')))) {
            this.contentModule.getEditPanel().focus();
            var range = this.parent.formatter.editorManager.nodeSelection.getRange(this.parent.contentModule.getDocument());
            save = this.parent.formatter.editorManager.nodeSelection.save(range, this.parent.contentModule.getDocument());
            selectParent = this.parent.formatter.editorManager.nodeSelection.getParentNodeCollection(range);
        }
        else {
            save = e.selection;
            selectParent = e.selectParent;
        }
        var uploadParentEle = this.parent.createElement('div', { className: 'e-img-uploadwrap e-droparea' });
        var deviceImgUpMsg = this.i10n.getConstant('imageDeviceUploadMessage');
        var imgUpMsg = this.i10n.getConstant('imageUploadMessage');
        var span = this.parent.createElement('span', { className: 'e-droptext' });
        var spanMsg = this.parent.createElement('span', {
            className: 'e-rte-upload-text', innerHTML: ((Browser.isDevice) ? deviceImgUpMsg : imgUpMsg)
        });
        span.appendChild(spanMsg);
        var btnEle = this.parent.createElement('button', {
            className: 'e-browsebtn', id: this.rteID + '_insertImage', attrs: { autofocus: 'true', type: 'button' }
        });
        span.appendChild(btnEle);
        uploadParentEle.appendChild(span);
        var browserMsg = this.i10n.getConstant('browse');
        var button = new Button({ content: browserMsg, enableRtl: this.parent.enableRtl });
        button.isStringTemplate = true;
        button.createElement = this.parent.createElement;
        button.appendTo(btnEle);
        var btnClick = (Browser.isDevice) ? span : btnEle;
        EventHandler.add(btnClick, 'click', this.fileSelect, this);
        var uploadEle = this.parent.createElement('input', {
            id: this.rteID + '_upload', attrs: { type: 'File', name: 'UploadFiles' }
        });
        uploadParentEle.appendChild(uploadEle);
        var altText;
        var rawFile;
        var selectArgs;
        var filesData;
        var beforeUploadArgs;
        this.uploadObj = new Uploader({
            asyncSettings: { saveUrl: this.parent.insertImageSettings.saveUrl, },
            dropArea: span, multiple: false, enableRtl: this.parent.enableRtl,
            allowedExtensions: this.parent.insertImageSettings.allowedTypes.toString(),
            selected: function (e) {
                proxy.isImgUploaded = true;
                selectArgs = e;
                filesData = e.filesData;
                if (_this.parent.isServerRendered) {
                    selectArgs = JSON.parse(JSON.stringify(e));
                    e.cancel = true;
                    rawFile = e.filesData;
                    selectArgs.filesData = rawFile;
                }
                _this.parent.trigger(events.imageSelected, selectArgs, function (selectArgs) {
                    _this.checkExtension(selectArgs.filesData[0]);
                    altText = selectArgs.filesData[0].name;
                    if (_this.parent.editorMode === 'HTML' && isNullOrUndefined(_this.parent.insertImageSettings.path)) {
                        var reader_1 = new FileReader();
                        reader_1.addEventListener('load', function (e) {
                            var url = _this.parent.insertImageSettings.saveFormat === 'Base64' ? reader_1.result :
                                URL.createObjectURL(convertToBlob(reader_1.result));
                            proxy.uploadUrl = {
                                url: url, selection: save, altText: altText,
                                selectParent: selectParent,
                                width: {
                                    width: proxy.parent.insertImageSettings.width, minWidth: proxy.parent.insertImageSettings.minWidth,
                                    maxWidth: proxy.getMaxWidth()
                                }, height: {
                                    height: proxy.parent.insertImageSettings.height, minHeight: proxy.parent.insertImageSettings.minHeight,
                                    maxHeight: proxy.parent.insertImageSettings.maxHeight
                                }
                            };
                            proxy.inputUrl.setAttribute('disabled', 'true');
                        });
                        reader_1.readAsDataURL(selectArgs.filesData[0].rawFile);
                    }
                    if (_this.parent.isServerRendered) {
                        /* tslint:disable */
                        _this.uploadObj._internalRenderSelect(selectArgs, rawFile);
                        /* tslint:enable */
                    }
                });
            },
            beforeUpload: function (args) {
                if (_this.parent.isServerRendered) {
                    beforeUploadArgs = JSON.parse(JSON.stringify(args));
                    beforeUploadArgs.filesData = filesData;
                    _this.parent.trigger(events.imageUploading, beforeUploadArgs, function (beforeUploadArgs) {
                        if (beforeUploadArgs.cancel) {
                            return;
                        }
                        /* tslint:disable */
                        _this.uploadObj.uploadFiles(rawFile, null);
                        /* tslint:enable */
                    });
                }
                else {
                    _this.parent.trigger(events.beforeImageUpload, args);
                }
            },
            uploading: function (e) {
                if (!_this.parent.isServerRendered) {
                    _this.parent.trigger(events.imageUploading, e);
                }
            },
            success: function (e) {
                _this.parent.trigger(events.imageUploadSuccess, e, function (e) {
                    if (!isNullOrUndefined(_this.parent.insertImageSettings.path)) {
                        var url = _this.parent.insertImageSettings.path + e.file.name;
                        var value = { url: url, selection: save };
                        proxy.uploadUrl = {
                            url: url, selection: save, altText: altText, selectParent: selectParent,
                            width: {
                                width: proxy.parent.insertImageSettings.width, minWidth: proxy.parent.insertImageSettings.minWidth,
                                maxWidth: proxy.getMaxWidth()
                            }, height: {
                                height: proxy.parent.insertImageSettings.height, minHeight: proxy.parent.insertImageSettings.minHeight,
                                maxHeight: proxy.parent.insertImageSettings.maxHeight
                            }
                        };
                        proxy.inputUrl.setAttribute('disabled', 'true');
                    }
                });
            },
            failure: function (e) {
                _this.parent.trigger(events.imageUploadFailed, e);
            },
            removing: function () {
                _this.parent.trigger(events.imageRemoving, e, function (e) {
                    proxy.isImgUploaded = false;
                    proxy.inputUrl.removeAttribute('disabled');
                    if (proxy.uploadUrl) {
                        proxy.uploadUrl.url = '';
                    }
                    _this.dialogObj.getButtons(0).element.removeAttribute('disabled');
                });
            }
        });
        this.uploadObj.isStringTemplate = true;
        this.uploadObj.createElement = this.parent.createElement;
        this.uploadObj.appendTo(uploadEle);
        return uploadParentEle;
    };
    Image.prototype.checkExtension = function (e) {
        if (this.uploadObj.allowedExtensions) {
            if (this.uploadObj.allowedExtensions.toLocaleLowerCase().indexOf(('.' + e.type).toLocaleLowerCase()) === -1) {
                this.dialogObj.getButtons(0).element.setAttribute('disabled', 'disabled');
            }
            else {
                this.dialogObj.getButtons(0).element.removeAttribute('disabled');
            }
        }
    };
    Image.prototype.fileSelect = function () {
        this.dialogObj.element.getElementsByClassName('e-file-select-wrap')[0].querySelector('button').click();
        return false;
    };
    Image.prototype.dragStart = function (e) {
        if (e.target.nodeName === 'IMG') {
            this.parent.trigger(events.actionBegin, e, function (actionBeginArgs) {
                if (actionBeginArgs.cancel) {
                    e.preventDefault();
                }
                else {
                    e.dataTransfer.effectAllowed = 'copyMove';
                    e.target.classList.add(classes.CLS_RTE_DRAG_IMAGE);
                }
            });
        }
        else {
            return true;
        }
    };
    ;
    Image.prototype.dragEnter = function (e) {
        e.dataTransfer.dropEffect = 'copy';
        e.preventDefault();
    };
    ;
    Image.prototype.dragOver = function (e) {
        if ((Browser.info.name === 'edge' && e.dataTransfer.items[0].type.split('/')[0].indexOf('image') > -1) ||
            (Browser.isIE && e.dataTransfer.types[0] === 'Files')) {
            e.preventDefault();
        }
        else {
            return true;
        }
    };
    ;
    /**
     * USed to set range When drop an image
     */
    Image.prototype.dragDrop = function (e) {
        var _this = this;
        var imgElement = this.parent.inputElement.ownerDocument.querySelector('.' + classes.CLS_RTE_DRAG_IMAGE);
        if ((imgElement && imgElement.tagName === 'IMG') || e.dataTransfer.files.length > 0) {
            this.parent.trigger(events.actionBegin, e, function (actionBeginArgs) {
                if (actionBeginArgs.cancel) {
                    e.preventDefault();
                }
                else {
                    if (closest(e.target, '#' + _this.parent.getID() + '_toolbar') ||
                        _this.parent.inputElement.contentEditable === 'false') {
                        e.preventDefault();
                        return;
                    }
                    if (_this.parent.element.querySelector('.' + classes.CLS_IMG_RESIZE)) {
                        detach(_this.imgResizeDiv);
                    }
                    e.preventDefault();
                    var range = void 0;
                    if (_this.contentModule.getDocument().caretRangeFromPoint) { //For chrome
                        range = _this.contentModule.getDocument().caretRangeFromPoint(e.clientX, e.clientY);
                    }
                    else if ((e.rangeParent)) { //For mozilla firefox
                        range = _this.contentModule.getDocument().createRange();
                        range.setStart(e.rangeParent, e.rangeOffset);
                    }
                    else {
                        range = _this.getDropRange(e.clientX, e.clientY); //For internet explorer
                    }
                    _this.parent.notify(events.selectRange, { range: range });
                    var uploadArea = _this.parent.element.querySelector('.' + classes.CLS_DROPAREA);
                    if (uploadArea) {
                        return;
                    }
                    _this.insertDragImage(e);
                }
            });
        }
        else {
            return true;
        }
    };
    /**
     * Used to calculate range on internet explorer
     */
    Image.prototype.getDropRange = function (x, y) {
        var startRange = this.contentModule.getDocument().createRange();
        this.parent.formatter.editorManager.nodeSelection.setRange(this.contentModule.getDocument(), startRange);
        var elem = this.contentModule.getDocument().elementFromPoint(x, y);
        var startNode = (elem.childNodes.length > 0 ? elem.childNodes[0] : elem);
        var startCharIndexCharacter = 0;
        if (this.parent.inputElement.firstChild.innerHTML === '<br>') {
            startRange.setStart(startNode, startCharIndexCharacter);
            startRange.setEnd(startNode, startCharIndexCharacter);
        }
        else {
            var rangeRect = void 0;
            do {
                startCharIndexCharacter++;
                startRange.setStart(startNode, startCharIndexCharacter);
                startRange.setEnd(startNode, startCharIndexCharacter + 1);
                rangeRect = startRange.getBoundingClientRect();
            } while (rangeRect.left < x && startCharIndexCharacter < startNode.length - 1);
        }
        return startRange;
    };
    Image.prototype.insertDragImage = function (e) {
        var _this = this;
        e.preventDefault();
        var activePopupElement = this.parent.element.querySelector('' + classes.CLS_POPUP_OPEN);
        this.parent.notify(events.drop, { args: e });
        if (activePopupElement) {
            activePopupElement.classList.add(classes.CLS_HIDE);
        }
        if (e.dataTransfer.files.length > 0) { //For external image drag and drop
            if (e.dataTransfer.files.length > 1) {
                return;
            }
            var imgFiles = e.dataTransfer.files;
            var fileName = imgFiles[0].name;
            var imgType = fileName.substring(fileName.lastIndexOf('.'));
            var allowedTypes = this.parent.insertImageSettings.allowedTypes;
            for (var i = 0; i < allowedTypes.length; i++) {
                if (imgType.toLocaleLowerCase() === allowedTypes[i].toLowerCase()) {
                    if (this.parent.insertImageSettings.saveUrl) {
                        this.onSelect(e);
                    }
                    else {
                        var args = { args: e, text: '', file: imgFiles[0] };
                        e.preventDefault();
                        this.imagePaste(args);
                    }
                }
            }
        }
        else { //For internal image drag and drop
            var range = this.parent.formatter.editorManager.nodeSelection.getRange(this.parent.contentModule.getDocument());
            var imgElement = this.parent.inputElement.ownerDocument.querySelector('.' + classes.CLS_RTE_DRAG_IMAGE);
            if (imgElement && imgElement.tagName === 'IMG') {
                if (imgElement.nextElementSibling) {
                    if (imgElement.nextElementSibling.classList.contains(classes.CLS_IMG_INNER)) {
                        range.insertNode(imgElement.parentElement.parentElement);
                    }
                    else {
                        range.insertNode(imgElement);
                    }
                }
                else {
                    range.insertNode(imgElement);
                }
                imgElement.classList.remove(classes.CLS_RTE_DRAG_IMAGE);
                var imgArgs_1 = { elements: [imgElement] };
                imgElement.addEventListener('load', function () {
                    _this.parent.trigger(events.actionComplete, imgArgs_1);
                });
                this.parent.formatter.editorManager.nodeSelection.Clear(this.contentModule.getDocument());
                var args = e;
                this.resizeStart(args, imgElement);
                this.hideImageQuickToolbar();
            }
        }
    };
    Image.prototype.onSelect = function (args) {
        var _this = this;
        var proxy = this;
        var range = this.parent.formatter.editorManager.nodeSelection.getRange(this.parent.contentModule.getDocument());
        var parentElement = this.parent.createElement('ul', { className: classes.CLS_UPLOAD_FILES });
        this.parent.element.appendChild(parentElement);
        var validFiles = {
            name: '',
            size: 0,
            status: '',
            statusCode: '',
            type: '',
            rawFile: args.dataTransfer.files[0],
            validationMessages: {}
        };
        var imageTag = this.parent.createElement('IMG');
        imageTag.style.opacity = '0.5';
        imageTag.classList.add(classes.CLS_RTE_IMAGE);
        imageTag.classList.add(classes.CLS_IMGINLINE);
        imageTag.classList.add(classes.CLS_RESIZE);
        var file = validFiles.rawFile;
        var reader = new FileReader();
        reader.addEventListener('load', function () {
            var url = URL.createObjectURL(convertToBlob(reader.result));
            imageTag.src = proxy.parent.insertImageSettings.saveFormat === 'Blob' ? url : reader.result;
        });
        if (file) {
            reader.readAsDataURL(file);
        }
        range.insertNode(imageTag);
        this.uploadMethod(args, imageTag);
        var e = { elements: [imageTag] };
        imageTag.addEventListener('load', function () {
            _this.parent.trigger(events.actionComplete, e);
        });
    };
    /**
     * Rendering uploader and popup for drag and drop
     */
    Image.prototype.uploadMethod = function (dragEvent, imageElement) {
        var _this = this;
        var isUploading = false;
        var proxy = this;
        var popupEle = this.parent.createElement('div');
        this.parent.element.appendChild(popupEle);
        var uploadEle = this.parent.createElement('input', {
            id: this.rteID + '_upload', attrs: { type: 'File', name: 'UploadFiles' }
        });
        var offsetY = this.parent.iframeSettings.enable ? -50 : -90;
        this.popupObj = new Popup(popupEle, {
            relateTo: imageElement,
            height: '85px',
            width: '300px',
            offsetY: offsetY,
            content: uploadEle,
            viewPortElement: this.parent.element,
            position: { X: 'center', Y: 'top' },
            enableRtl: this.parent.enableRtl,
            zIndex: 10001,
            close: function (event) {
                _this.parent.isBlur = false;
                _this.popupObj.destroy();
                detach(_this.popupObj.element);
                _this.popupObj = null;
            }
        });
        this.popupObj.element.style.display = 'none';
        addClass([this.popupObj.element], classes.CLS_POPUP_OPEN);
        addClass([this.popupObj.element], classes.CLS_RTE_UPLOAD_POPUP);
        var timeOut = dragEvent.dataTransfer.files[0].size > 1000000 ? 300 : 100;
        setTimeout(function () { proxy.refreshPopup(imageElement); }, timeOut);
        var range = this.parent.formatter.editorManager.nodeSelection.getRange(this.parent.contentModule.getDocument());
        var rawFile;
        var beforeUploadArgs;
        this.uploadObj = new Uploader({
            asyncSettings: {
                saveUrl: this.parent.insertImageSettings.saveUrl,
            },
            cssClass: classes.CLS_RTE_DIALOG_UPLOAD,
            dropArea: this.parent.element,
            allowedExtensions: this.parent.insertImageSettings.allowedTypes.toString(),
            removing: function () {
                _this.parent.inputElement.contentEditable = 'true';
                isUploading = false;
                detach(imageElement);
                _this.popupObj.close();
            },
            canceling: function () {
                _this.parent.inputElement.contentEditable = 'true';
                isUploading = false;
                detach(imageElement);
                _this.popupObj.close();
            },
            beforeUpload: function (args) {
                if (_this.parent.isServerRendered) {
                    beforeUploadArgs = JSON.parse(JSON.stringify(args));
                    beforeUploadArgs.filesData = rawFile;
                    isUploading = true;
                    _this.parent.trigger(events.imageUploading, beforeUploadArgs, function (beforeUploadArgs) {
                        if (beforeUploadArgs.cancel) {
                            return;
                        }
                        /* tslint:disable */
                        _this.uploadObj.uploadFiles(rawFile, null);
                        _this.parent.inputElement.contentEditable = 'false';
                        /* tslint:enable */
                    });
                }
                else {
                    _this.parent.trigger(events.beforeImageUpload, args);
                }
            },
            uploading: function (e) {
                if (!_this.parent.isServerRendered) {
                    isUploading = true;
                    _this.parent.trigger(events.imageUploading, e);
                    _this.parent.inputElement.contentEditable = 'false';
                }
            },
            selected: function (e) {
                if (isUploading) {
                    e.cancel = true;
                }
                if (_this.parent.isServerRendered) {
                    rawFile = e.filesData;
                }
            },
            failure: function (e) {
                isUploading = false;
                _this.parent.inputElement.contentEditable = 'true';
                var args = {
                    args: dragEvent,
                    type: 'Images',
                    isNotify: undefined,
                    elements: imageElement
                };
                setTimeout(function () { _this.uploadFailure(imageElement, args, e); }, 900);
            },
            success: function (e) {
                isUploading = false;
                _this.parent.inputElement.contentEditable = 'true';
                var args = {
                    args: dragEvent,
                    type: 'Images',
                    isNotify: undefined,
                    elements: imageElement
                };
                setTimeout(function () { _this.uploadSuccess(imageElement, dragEvent, args, e); }, 900);
            }
        });
        this.uploadObj.appendTo(this.popupObj.element.childNodes[0]);
        detach(this.popupObj.element.querySelector('.e-rte-dialog-upload .e-file-select-wrap'));
        range.selectNodeContents(imageElement);
        this.parent.formatter.editorManager.nodeSelection.setRange(this.contentModule.getDocument(), range);
    };
    Image.prototype.refreshPopup = function (imageElement) {
        var imgPosition = this.parent.iframeSettings.enable ? this.parent.element.offsetTop +
            imageElement.offsetTop : imageElement.offsetTop;
        var rtePosition = this.parent.element.offsetTop + this.parent.element.offsetHeight;
        if (imgPosition > rtePosition) {
            this.popupObj.relateTo = this.parent.inputElement;
            this.popupObj.offsetY = this.parent.iframeSettings.enable ? -30 : -65;
            this.popupObj.element.style.display = 'block';
        }
        else {
            if (this.popupObj) {
                this.popupObj.refreshPosition(imageElement);
                this.popupObj.element.style.display = 'block';
            }
        }
    };
    /**
     * Called when drop image upload was failed
     */
    Image.prototype.uploadFailure = function (imgEle, args, e) {
        detach(imgEle);
        if (this.popupObj) {
            this.popupObj.close();
        }
        this.parent.trigger(events.imageUploadFailed, e);
        this.uploadObj.destroy();
    };
    /**
     * Called when drop image upload was successful
     */
    Image.prototype.uploadSuccess = function (imageElement, dragEvent, args, e) {
        var _this = this;
        imageElement.style.opacity = '1';
        imageElement.classList.add(classes.CLS_IMG_FOCUS);
        this.parent.trigger(events.imageUploadSuccess, e, function (e) {
            if (!isNullOrUndefined(_this.parent.insertImageSettings.path)) {
                var url = _this.parent.insertImageSettings.path + e.file.name;
                imageElement.src = url;
                imageElement.setAttribute('alt', e.file.name);
            }
        });
        this.popupObj.close();
        this.showImageQuickToolbar(args);
        this.resizeStart(dragEvent, imageElement);
        this.uploadObj.destroy();
    };
    Image.prototype.imagePaste = function (args) {
        var _this = this;
        if (args.text.length === 0 && !isNullOrUndefined(args.file)) {
            var proxy_1 = this;
            var reader_2 = new FileReader();
            args.args.preventDefault();
            reader_2.addEventListener('load', function (e) {
                var url = {
                    cssClass: (proxy_1.parent.insertImageSettings.display === 'inline' ? classes.CLS_IMGINLINE : classes.CLS_IMGBREAK),
                    url: _this.parent.insertImageSettings.saveFormat === 'Base64' || !isNullOrUndefined(args.callBack) ?
                        reader_2.result : URL.createObjectURL(convertToBlob(reader_2.result)),
                    width: {
                        width: proxy_1.parent.insertImageSettings.width, minWidth: proxy_1.parent.insertImageSettings.minWidth,
                        maxWidth: proxy_1.getMaxWidth()
                    },
                    height: {
                        height: proxy_1.parent.insertImageSettings.height, minHeight: proxy_1.parent.insertImageSettings.minHeight,
                        maxHeight: proxy_1.parent.insertImageSettings.maxHeight
                    }
                };
                if (!isNullOrUndefined(args.callBack)) {
                    args.callBack(url);
                    return;
                }
                else {
                    proxy_1.parent.formatter.process(proxy_1.parent, { item: { command: 'Images', subCommand: 'Image' } }, args.args, url);
                    _this.showPopupToolBar(args, url);
                }
            });
            reader_2.readAsDataURL(args.file);
        }
    };
    Image.prototype.showPopupToolBar = function (e, url) {
        var _this = this;
        var imageSrc = 'img[src="' + url.url + '"]';
        var imageElement = this.parent.inputElement.querySelector(imageSrc);
        this.parent.quickToolbarModule.createQTBar('Image', 'MultiRow', this.parent.quickToolbarSettings.image, RenderType.ImageToolbar);
        var args = {
            args: e.args,
            type: 'Images',
            isNotify: undefined,
            elements: imageElement
        };
        if (imageElement) {
            setTimeout(function () { _this.showImageQuickToolbar(args); _this.resizeStart(e.args, imageElement); }, 0);
        }
    };
    /**
     * Destroys the ToolBar.
     * @method destroy
     * @return {void}
     * @hidden

     */
    Image.prototype.destroy = function () {
        this.removeEventListener();
    };
    /**
     * For internal use only - Get the module name.
     */
    Image.prototype.getModuleName = function () {
        return 'image';
    };
    return Image;
}());
export { Image };

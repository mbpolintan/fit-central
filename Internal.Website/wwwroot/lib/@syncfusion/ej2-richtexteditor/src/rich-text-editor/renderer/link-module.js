import { EventHandler, detach, isNullOrUndefined, select, isBlazor, extend } from '@syncfusion/ej2-base';
import { closest, addClass, removeClass, Browser } from '@syncfusion/ej2-base';
import * as events from '../base/constant';
import { CLS_RTE_ELEMENTS } from '../base/classes';
import { CheckBox } from '@syncfusion/ej2-buttons';
import { RenderType } from '../base/enum';
import { dispatchEvent, parseHtml } from '../base/util';
import { isIDevice } from '../../common/util';
/**
 * `Link` module is used to handle undo actions.
 */
var Link = /** @class */ (function () {
    function Link(parent, serviceLocator) {
        this.parent = parent;
        this.rteID = parent.element.id;
        this.i10n = serviceLocator.getService('rteLocale');
        this.addEventListener();
        this.serviceLocator = serviceLocator;
        this.rendererFactory = serviceLocator.getService('rendererFactory');
        this.dialogRenderObj = serviceLocator.getService('dialogRenderObject');
    }
    Link.prototype.addEventListener = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.on(events.insertLink, this.linkDialog, this);
        this.parent.on(events.keyDown, this.onKeyDown, this);
        this.parent.on(events.insertCompleted, this.showLinkQuickToolbar, this);
        this.parent.on(events.linkToolbarAction, this.onToolbarAction, this);
        this.parent.on(events.iframeMouseDown, this.onIframeMouseDown, this);
        this.parent.on(events.unLink, this.removeLink, this);
        this.parent.on(events.editLink, this.editLink, this);
        this.parent.on(events.openLink, this.openLink, this);
        this.parent.on(events.editAreaClick, this.editAreaClickHandler, this);
        this.parent.on(events.destroy, this.destroy, this);
    };
    Link.prototype.onToolbarAction = function (args) {
        var item = args.args.item;
        switch (item.subCommand) {
            case 'OpenLink':
                this.parent.notify(events.openLink, args);
                break;
            case 'EditLink':
                this.parent.notify(events.editLink, args);
                break;
            case 'RemoveLink':
                this.parent.notify(events.unLink, args);
                break;
        }
    };
    Link.prototype.removeEventListener = function () {
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.off(events.insertLink, this.linkDialog);
        this.parent.off(events.keyDown, this.onKeyDown);
        this.parent.off(events.insertCompleted, this.showLinkQuickToolbar);
        this.parent.off(events.linkToolbarAction, this.onToolbarAction);
        this.parent.off(events.unLink, this.removeLink);
        this.parent.off(events.iframeMouseDown, this.onIframeMouseDown);
        this.parent.off(events.editLink, this.editLink);
        this.parent.off(events.openLink, this.openLink);
        this.parent.off(events.editAreaClick, this.editAreaClickHandler);
        this.parent.off(events.destroy, this.destroy);
    };
    Link.prototype.onIframeMouseDown = function () {
        if (this.dialogObj) {
            this.dialogObj.hide({ returnValue: true });
        }
    };
    Link.prototype.showLinkQuickToolbar = function (e) {
        if (e.args.action !== 'enter' && e.args.action !== 'space') {
            var pageX = void 0;
            var pageY = void 0;
            if (e.type !== 'Links' || isNullOrUndefined(this.parent.quickToolbarModule) ||
                isNullOrUndefined(this.parent.quickToolbarModule.linkQTBar)) {
                return;
            }
            this.quickToolObj = this.parent.quickToolbarModule;
            var parentTop = this.parent.element.getBoundingClientRect().top;
            var parentLeft = this.parent.element.getBoundingClientRect().left;
            var range = this.parent.formatter.editorManager.nodeSelection.getRange(this.parent.contentModule.getDocument());
            var target_1;
            [].forEach.call(e.elements, function (element, index) {
                if (index === 0) {
                    target_1 = ((element.nodeName === '#text') ? (element.parentNode) : element);
                }
            });
            if (e.isNotify) {
                var tbElement = this.parent.toolbarModule.getToolbarElement();
                var linkTop = target_1.getBoundingClientRect().top;
                var linkLeft = target_1.getBoundingClientRect().left;
                var linkPos = linkTop - parentTop;
                var tbHeight = (tbElement) ? (tbElement.offsetHeight + this.parent.toolbarModule.getExpandTBarPopHeight()) : 0;
                pageX = (this.parent.iframeSettings.enable) ? parentLeft + linkLeft : target_1.getBoundingClientRect().left;
                pageY = window.pageYOffset + ((this.parent.iframeSettings.enable) ?
                    (parentTop + tbHeight + linkTop) : (parentTop + linkPos));
            }
            else {
                var args = void 0;
                args = e.args.touches ? e.args.changedTouches[0] : args = e.args;
                pageX = (this.parent.iframeSettings.enable) ? window.pageXOffset + parentLeft + args.clientX : args.pageX;
                pageY = (this.parent.iframeSettings.enable) ? window.pageYOffset + parentTop + args.clientY : args.pageY;
            }
            if (this.quickToolObj.linkQTBar) {
                this.quickToolObj.linkQTBar.showPopup(pageX, pageY, range.endContainer);
            }
        }
    };
    Link.prototype.hideLinkQuickToolbar = function () {
        if (this.quickToolObj && this.quickToolObj.linkQTBar && document.body.contains(this.quickToolObj.linkQTBar.element)) {
            this.quickToolObj.linkQTBar.hidePopup();
        }
    };
    Link.prototype.editAreaClickHandler = function (e) {
        if (this.parent.readonly) {
            this.hideLinkQuickToolbar();
            return;
        }
        var args = e.args;
        var showOnRightClick = this.parent.quickToolbarSettings.showOnRightClick;
        if (args.which === 2 || (showOnRightClick && args.which === 1) || (!showOnRightClick && args.which === 3)) {
            return;
        }
        if (this.parent.editorMode === 'HTML' && this.parent.quickToolbarModule && this.parent.quickToolbarModule.linkQTBar) {
            this.quickToolObj = this.parent.quickToolbarModule;
            var target = args.target;
            target = this.getAnchorNode(target);
            this.contentModule = this.rendererFactory.getRenderer(RenderType.Content);
            var isPopupOpen = this.quickToolObj.linkQTBar.element.classList.contains('e-rte-pop');
            if (target.nodeName === 'A' && (target.childNodes.length > 0 && target.childNodes[0].nodeName !== 'IMG') &&
                e.args.target.nodeName !== 'IMG') {
                if (isPopupOpen) {
                    return;
                }
                this.showLinkQuickToolbar({
                    args: args,
                    isNotify: false,
                    type: 'Links',
                    elements: [args.target]
                });
            }
            else {
                this.hideLinkQuickToolbar();
            }
        }
    };
    Link.prototype.onKeyDown = function (event) {
        var originalEvent = event.args;
        switch (originalEvent.action) {
            case 'escape':
                if (!isNullOrUndefined(this.dialogObj)) {
                    this.dialogObj.close();
                }
                break;
            case 'insert-link':
                if (this.parent.editorMode === 'HTML') {
                    var range = this.parent.formatter.editorManager.nodeSelection.getRange(this.parent.contentModule.getDocument());
                    var save = this.parent.formatter.editorManager.nodeSelection.save(range, this.parent.contentModule.getDocument());
                    var selectNodeEle = this.parent.formatter.editorManager.nodeSelection.getNodeCollection(range);
                    var selectParentEle = this.parent.formatter.editorManager.nodeSelection.getParentNodeCollection(range);
                    var eventArgs = {
                        args: event.args, selectNode: selectNodeEle, selection: save, selectParent: selectParentEle
                    };
                    this.linkDialog(eventArgs);
                }
                else {
                    var textArea = this.parent.contentModule.getEditPanel();
                    this.parent.formatter.editorManager.markdownSelection.save(textArea.selectionStart, textArea.selectionEnd);
                    this.linkDialog({
                        args: {
                            item: { command: 'Links', subCommand: 'Link' },
                            originalEvent: originalEvent
                        },
                        member: 'link',
                        text: this.parent.formatter.editorManager.markdownSelection.getSelectedText(this.parent.contentModule.getEditPanel()),
                        module: 'Markdown',
                        name: 'insertLink'
                    });
                }
                originalEvent.preventDefault();
                break;
        }
    };
    Link.prototype.linkDialog = function (e, inputDetails) {
        var _this = this;
        if (this.dialogObj) {
            this.dialogObj.hide({ returnValue: true });
            return;
        }
        if (this.parent.editorMode === 'HTML' && (e.selectParent.length > 0 &&
            !isNullOrUndefined(e.selectParent[0].classList) &&
            e.selectParent[0].classList.contains('e-rte-anchor')) && isNullOrUndefined(inputDetails)) {
            this.editLink(e);
            return;
        }
        var selectText;
        var linkWebAddress = this.i10n.getConstant('linkWebUrl');
        var linkDisplayText = this.i10n.getConstant('linkText');
        var linkTooltip = this.i10n.getConstant('linkTooltipLabel');
        var urlPlace = this.i10n.getConstant('linkurl');
        var textPlace = this.i10n.getConstant('textPlaceholder');
        var title = this.i10n.getConstant('linkTitle');
        var linkDialogEle = this.parent.createElement('div', { className: 'e-rte-link-dialog', id: this.rteID + '_rtelink' });
        this.parent.element.appendChild(linkDialogEle);
        var linkContent = this.parent.createElement('div', {
            className: 'e-rte-linkcontent', id: this.rteID + '_linkContent'
        });
        var htmlTextbox = (this.parent.editorMode === 'HTML') ? '<label>' + linkTooltip +
            '</label></div><div class="e-rte-field">' +
            '<input type="text" data-role ="none" spellcheck="false" placeholder = "' + title + '" class="e-input e-rte-linkTitle"></div>' +
            '<div class="e-rte-label"></div>' + '<div class="e-rte-field">' +
            '<input type="checkbox" class="e-rte-linkTarget"  data-role ="none"></div>' : '';
        var content = '<div class="e-rte-label"><label>' + linkWebAddress + '</label></div>' + '<div class="e-rte-field">' +
            '<input type="text" data-role ="none" spellcheck="false" placeholder="' + urlPlace + '" class="e-input e-rte-linkurl"/></div>' +
            '<div class="e-rte-label">' + '<label>' + linkDisplayText + '</label></div><div class="e-rte-field"> ' +
            '<input type="text" data-role ="none" spellcheck="false" class="e-input e-rte-linkText" placeholder="' + textPlace + '">' +
            '</div><div class="e-rte-label">' + htmlTextbox;
        var contentElem = parseHtml(content);
        linkContent.appendChild(contentElem);
        var linkTarget = linkContent.querySelector('.e-rte-linkTarget');
        var linkUrl = linkContent.querySelector('.e-rte-linkurl');
        var linkText = linkContent.querySelector('.e-rte-linkText');
        var linkTitle = linkContent.querySelector('.e-rte-linkTitle');
        var linkOpenLabel = this.i10n.getConstant('linkOpenInNewWindow');
        this.checkBoxObj = new CheckBox({ label: linkOpenLabel, checked: true, enableRtl: this.parent.enableRtl });
        this.checkBoxObj.isStringTemplate = true;
        this.checkBoxObj.createElement = this.parent.createElement;
        this.checkBoxObj.appendTo(linkTarget);
        selectText = (this.parent.editorMode === 'HTML') ? e.selection.getRange(this.parent.contentModule.getDocument()).toString() :
            e.text;
        var linkInsert = this.i10n.getConstant('dialogInsert');
        var linkCancel = this.i10n.getConstant('dialogCancel');
        var selection = e.selection;
        var selectObj = { selfLink: this, selection: e.selection, selectParent: e.selectParent, args: e.args };
        var dialogModel = {
            header: this.i10n.getConstant('linkHeader'),
            content: linkContent,
            cssClass: CLS_RTE_ELEMENTS,
            enableRtl: this.parent.enableRtl,
            locale: this.parent.locale,
            showCloseIcon: true, closeOnEscape: true, width: (Browser.isDevice) ? '290px' : '310px', height: 'inherit',
            isModal: Browser.isDevice,
            buttons: [{
                    click: this.insertlink.bind(selectObj),
                    buttonModel: { content: linkInsert, cssClass: 'e-flat e-insertLink', isPrimary: true }
                },
                { click: this.cancelDialog.bind(selectObj), buttonModel: { cssClass: 'e-flat', content: linkCancel } }],
            target: (Browser.isDevice) ? document.body : this.parent.element,
            animationSettings: { effect: 'None' },
            close: function (event) {
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
                var args = isBlazor() ? null : _this.dialogObj;
                _this.dialogRenderObj.close(args);
                _this.dialogObj = null;
            },
        };
        this.dialogObj = this.dialogRenderObj.render(dialogModel);
        this.dialogObj.createElement = this.parent.createElement;
        this.dialogObj.appendTo(linkDialogEle);
        linkDialogEle.style.maxHeight = 'inherit';
        if (!isNullOrUndefined(inputDetails)) {
            linkUrl.value = inputDetails.url;
            linkText.value = inputDetails.text;
            linkTitle.value = inputDetails.title;
            (inputDetails.target) ? this.checkBoxObj.checked = true : this.checkBoxObj.checked = false;
            this.dialogObj.header = inputDetails.header;
            this.dialogObj.element.querySelector('.e-insertLink').textContent = inputDetails.btnText;
        }
        this.checkUrl(false);
        if ((this.parent.editorMode === 'HTML' && isNullOrUndefined(inputDetails) && ((!isNullOrUndefined(selectText)
            && selectText !== '') && (e.selection.range.startOffset === 0) || e.selection.range.startOffset !==
            e.selection.range.endOffset)) || e.module === 'Markdown') {
            linkText.value = selectText;
        }
        EventHandler.add(this.parent.element.ownerDocument, 'mousedown', this.onDocumentClick, this);
        if (this.quickToolObj) {
            this.hideLinkQuickToolbar();
            if (this.quickToolObj.inlineQTBar && document.body.contains(this.quickToolObj.inlineQTBar.element)) {
                this.quickToolObj.inlineQTBar.hidePopup();
            }
        }
    };
    Link.prototype.insertlink = function (e) {
        var linkEle = this.selfLink.dialogObj.element;
        var linkUrl = linkEle.querySelector('.e-rte-linkurl').value;
        var linkText = linkEle.querySelector('.e-rte-linkText').value;
        var linkTitle;
        if (this.selfLink.parent.editorMode === 'HTML') {
            linkTitle = linkEle.querySelector('.e-rte-linkTitle').value;
        }
        var target = (this.selfLink.checkBoxObj.checked) ? '_blank' : null;
        if (linkUrl === '') {
            this.selfLink.checkUrl(true);
            return;
        }
        if (!this.selfLink.isUrl(linkUrl)) {
            linkText = (linkText === '') ? linkUrl : linkText;
            if (!this.selfLink.parent.enableAutoUrl) {
                linkUrl = linkUrl.indexOf('http') > -1 ? linkUrl : 'http://' + linkUrl;
            }
            else {
                linkUrl = linkUrl;
            }
        }
        else {
            this.selfLink.checkUrl(false);
        }
        var proxy = this.selfLink;
        if (proxy.parent.editorMode === 'HTML' && isNullOrUndefined(closest(this.selection.range.startContainer.parentNode, '#' + proxy.parent.contentModule.getPanel().id))) {
            proxy.parent.contentModule.getEditPanel().focus();
            if (Browser.isIE && proxy.parent.iframeSettings.enable) {
                this.selection.restore();
            }
            var range = proxy.parent.formatter.editorManager.nodeSelection.getRange(proxy.parent.contentModule.getDocument());
            this.selection = proxy.parent.formatter.editorManager.nodeSelection.save(range, proxy.parent.contentModule.getDocument());
            this.selectParent = proxy.parent.formatter.editorManager.nodeSelection.getParentNodeCollection(range);
        }
        var value = {
            url: linkUrl, text: linkText, title: linkTitle, target: target,
            selection: this.selection, selectParent: this.selectParent
        };
        if (document.body.contains(proxy.dialogObj.element)) {
            this.selfLink.dialogObj.hide({ returnValue: false });
        }
        if (isIDevice() && proxy.parent.iframeSettings.enable) {
            select('iframe', proxy.parent.element).contentWindow.focus();
        }
        if (proxy.parent.editorMode === 'HTML') {
            this.selection.restore();
        }
        if (proxy.parent.formatter.getUndoRedoStack().length === 0) {
            proxy.parent.formatter.saveData();
        }
        var argsValue;
        if (this.args.code === 'KeyK') {
            var originalEvent = this.args;
            extend(this.args, { item: { command: 'Links', subCommand: 'CreateLink' }, originalEvent: originalEvent }, true);
            var argsVal = {
                item: { command: 'Links', subCommand: 'CreateLink' }, originalEvent: originalEvent
            };
            argsValue = argsVal;
        }
        else {
            argsValue = this.args;
        }
        this.selfLink.parent.formatter.process(this.selfLink.parent, argsValue, this.args.originalEvent, value);
        this.selfLink.parent.contentModule.getEditPanel().focus();
    };
    Link.prototype.isUrl = function (url) {
        var regexp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/gi;
        return regexp.test(url);
    };
    Link.prototype.checkUrl = function (e) {
        var linkEle = this.dialogObj.element;
        var linkUrl = linkEle.querySelector('.e-rte-linkurl');
        if (e) {
            addClass([linkUrl], 'e-error');
            linkUrl.setSelectionRange(0, linkUrl.value.length);
            linkUrl.focus();
        }
        else {
            removeClass([linkUrl], 'e-error');
        }
    };
    Link.prototype.removeLink = function (e) {
        if (this.parent.formatter.getUndoRedoStack().length === 0) {
            this.parent.formatter.saveData();
        }
        this.parent.formatter.process(this.parent, e.args, e.args, {
            selectNode: e.selectNode, selectParent: e.selectParent, selection: e.selection,
            subCommand: e.args.item.subCommand
        });
        if (isIDevice() && this.parent.iframeSettings.enable) {
            select('iframe', this.parent.element).contentWindow.focus();
        }
        else {
            this.parent.contentModule.getEditPanel().focus();
        }
        this.hideLinkQuickToolbar();
    };
    Link.prototype.openLink = function (e) {
        var selectParentEle = this.getAnchorNode(e.selectParent[0]);
        if (selectParentEle.classList.contains('e-rte-anchor') || selectParentEle.tagName === 'A') {
            this.parent.formatter.process(this.parent, e.args, e.args, {
                url: selectParentEle.href,
                target: selectParentEle.target === '' ? '_self' : '_blank', selectNode: e.selectNode,
                subCommand: e.args.item.subCommand
            });
        }
    };
    Link.prototype.getAnchorNode = function (element) {
        var selectParent = closest(element, 'a');
        return (selectParent ? selectParent : element);
    };
    Link.prototype.editLink = function (e) {
        var selectedNode = this.getAnchorNode(e.selectNode[0]);
        var selectParentEle = this.getAnchorNode(e.selectParent[0]);
        selectParentEle = selectedNode.nodeName === 'A' ? selectedNode : selectParentEle;
        if (selectParentEle.classList.contains('e-rte-anchor') || selectParentEle.tagName === 'A') {
            var linkUpdate = this.i10n.getConstant('dialogUpdate');
            var inputDetails = {
                url: selectParentEle.getAttribute('href'), text: selectParentEle.innerText,
                title: selectParentEle.title, target: selectParentEle.target,
                header: this.i10n.getConstant('editLink'), btnText: linkUpdate
            };
            this.linkDialog(e, inputDetails);
        }
    };
    Link.prototype.cancelDialog = function (e) {
        this.selfLink.parent.isBlur = false;
        this.selfLink.dialogObj.hide({ returnValue: true });
        if (isIDevice()) {
            this.selection.restore();
        }
        else {
            this.selfLink.parent.contentModule.getEditPanel().focus();
        }
    };
    Link.prototype.onDocumentClick = function (e) {
        var target = e.target;
        if (!isNullOrUndefined(this.dialogObj) && ((!closest(target, '#' + this.dialogObj.element.id) && this.parent.toolbarSettings.enable &&
            this.parent.getToolbarElement() && !this.parent.getToolbarElement().contains(e.target)) ||
            (((this.parent.getToolbarElement() && this.parent.getToolbarElement().contains(e.target)) ||
                this.parent.inlineMode.enable && !closest(target, '#' + this.dialogObj.element.id)) &&
                !closest(target, '#' + this.parent.getID() + '_toolbar_CreateLink') &&
                !target.querySelector('#' + this.parent.getID() + '_toolbar_CreateLink')))) {
            this.dialogObj.hide({ returnValue: true });
            this.parent.isBlur = true;
            dispatchEvent(this.parent.element, 'focusout');
        }
    };
    /**
     * Destroys the ToolBar.
     * @method destroy
     * @return {void}
     * @hidden

     */
    Link.prototype.destroy = function () {
        this.removeEventListener();
    };
    /**
     * For internal use only - Get the module name.
     */
    Link.prototype.getModuleName = function () {
        return 'link';
    };
    return Link;
}());
export { Link };

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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component, EventHandler, Complex, Browser, addClass, select, detach } from '@syncfusion/ej2-base';
import { Property, NotifyPropertyChanges, formatUnit, L10n, closest } from '@syncfusion/ej2-base';
import { setStyleAttribute, Event, removeClass, print as printWindow, attributes } from '@syncfusion/ej2-base';
import { isNullOrUndefined as isNOU, compile, append, extend, debounce, isBlazor } from '@syncfusion/ej2-base';
import { Touch as EJ2Touch } from '@syncfusion/ej2-base';
import { getScrollableParent } from '@syncfusion/ej2-popups';
import * as events from '../base/constant';
import * as classes from '../base/classes';
import { Render } from '../renderer/render';
import { ViewSource } from '../renderer/view-source';
import { executeGroup } from './interface';
import { ServiceLocator } from '../services/service-locator';
import { RendererFactory } from '../services/renderer-factory';
import { RenderType, ToolbarType } from './enum';
import { ExecCommandCallBack } from '../actions/execute-command-callback';
import { KeyboardEvents } from '../actions/keyboard';
import { ToolbarSettings, ImageSettings, QuickToolbarSettings, FontFamily, FontSize, Format } from '../models/toolbar-settings';
import { TableSettings, PasteCleanupSettings } from '../models/toolbar-settings';
import { FontColor, BackgroundColor } from '../models/toolbar-settings';
import { IFrameSettings } from '../models/iframe-settings';
import { InlineMode } from '../models/inline-mode';
import { defaultLocale } from '../models/default-locale';
import { setAttributes } from '../actions/html-attributes';
import { FullScreen } from '../actions/full-screen';
import * as CONSTANT from '../../common/constant';
import { dispatchEvent, getEditValue, isIDevice, decode, isEditableValueEmpty } from '../base/util';
import { DialogRenderer } from '../renderer/dialog-renderer';
/**
 * Represents the Rich Text Editor component.
 * ```html
 * <textarea id="rte"></textarea>
 * <script>
 *  var rteObj = new RichTextEditor();
 *  rteObj.appendTo("#rte");
 * </script>
 * ```
 */
var RichTextEditor = /** @class */ (function (_super) {
    __extends(RichTextEditor, _super);
    function RichTextEditor(options, element) {
        var _this = _super.call(this, options, element) || this;
        _this.defaultResetValue = null;
        /**
         * @hidden

         */
        _this.isFocusOut = false;
        /**
         * @hidden

         */
        _this.isRTE = false;
        /**
         * @hidden

         */
        _this.isBlur = true;
        _this.needsID = true;
        return _this;
    }
    /**
     * To provide the array of modules needed for component rendering
     * @return {ModuleDeclaration[]}
     * @hidden

     */
    RichTextEditor.prototype.requiredModules = function () {
        var modules = [];
        if (this.toolbarSettings.enable) {
            modules.push({ member: 'toolbar', args: [this, this.serviceLocator] });
            modules.push({
                member: 'link',
                args: [this, this.serviceLocator]
            });
            modules.push({
                member: 'table',
                args: [this, this.serviceLocator]
            });
            modules.push({
                member: 'image',
                args: [this, this.serviceLocator]
            });
            if (this.quickToolbarSettings.enable) {
                modules.push({ member: 'quickToolbar', args: [this, this.serviceLocator] });
            }
        }
        if (this.showCharCount) {
            modules.push({ member: 'count', args: [this, this.serviceLocator] });
        }
        if (this.editorMode === 'Markdown') {
            modules.push({ member: 'markdownEditor', args: [this, this.serviceLocator] });
        }
        if (this.editorMode === 'HTML') {
            modules.push({ member: 'htmlEditor', args: [this, this.serviceLocator] });
            modules.push({ member: 'pasteCleanup', args: [this, this.serviceLocator] });
        }
        if (this.enableResize) {
            modules.push({ member: 'resize', args: [this] });
        }
        return modules;
    };
    RichTextEditor.prototype.updateEnable = function () {
        if (this.enabled) {
            removeClass([this.element], classes.CLS_DISABLED);
            this.element.setAttribute('aria-disabled', 'false');
            if (!isNOU(this.htmlAttributes.tabindex)) {
                this.inputElement.setAttribute('tabindex', this.htmlAttributes.tabindex);
            }
            else {
                this.inputElement.setAttribute('tabindex', '0');
            }
        }
        else {
            if (this.getToolbar()) {
                removeClass(this.getToolbar().querySelectorAll('.' + classes.CLS_ACTIVE), classes.CLS_ACTIVE);
                removeClass([this.getToolbar()], [classes.CLS_TB_FLOAT, classes.CLS_TB_ABS_FLOAT]);
            }
            addClass([this.element], classes.CLS_DISABLED);
            this.element.tabIndex = -1;
            this.element.setAttribute('aria-disabled', 'true');
            this.inputElement.setAttribute('tabindex', '-1');
        }
    };
    /**
     * setEnable method
     * @hidden

     */
    RichTextEditor.prototype.setEnable = function () {
        this.updateEnable();
        (this.enabled) ? this.eventInitializer() : this.unWireEvents();
    };
    /**
     * For internal use only - Initialize the event handler;
     * @private
     */
    RichTextEditor.prototype.preRender = function () {
        this.onBlurHandler = this.blurHandler.bind(this);
        this.onFocusHandler = this.focusHandler.bind(this);
        this.onResizeHandler = this.resizeHandler.bind(this);
        this.clickPoints = { clientX: 0, clientY: 0 };
        this.initialValue = this.value;
        this.serviceLocator = new ServiceLocator;
        this.initializeServices();
        this.setContainer();
        this.persistData();
        setStyleAttribute(this.element, { 'width': formatUnit(this.width) });
        attributes(this.element, { role: 'application' });
    };
    RichTextEditor.prototype.persistData = function () {
        if (this.enablePersistence && this.originalElement.tagName === 'TEXTAREA') {
            this.element.id = this.originalElement.id + '_wrapper';
            var data = window.localStorage.getItem(this.getModuleName() + this.element.id);
            if (!(isNOU(data) || (data === ''))) {
                this.setProperties(JSON.parse(data), true);
            }
        }
    };
    ;
    RichTextEditor.prototype.setContainer = function () {
        this.originalElement = this.element.cloneNode(true);
        if (this.value === null || this.valueTemplate !== null) {
            this.setValue();
        }
        if (this.element.hasAttribute('tabindex')) {
            this.htmlAttributes = { 'tabindex': this.element.getAttribute('tabindex') };
            this.element.removeAttribute('tabindex');
        }
        if (!this.isBlazor()) {
            this.element.innerHTML = '';
        }
        var invalidAttr = ['class', 'style', 'id', 'ejs-for'];
        var htmlAttr = {};
        for (var a = 0; a < this.element.attributes.length; a++) {
            if (invalidAttr.indexOf(this.element.attributes[a].name) === -1 &&
                !(/^data-val/.test(this.element.attributes[a].name))) { // data-val for asp.net core data annotation validation.
                htmlAttr[this.element.attributes[a].name] = this.element.getAttribute(this.element.attributes[a].name);
            }
        }
        extend(htmlAttr, this.htmlAttributes, htmlAttr);
        this.setProperties({ htmlAttributes: htmlAttr }, true);
        if (!isNOU(this.htmlAttributes.id)) {
            this.element.id = this.htmlAttributes.id;
        }
        if (this.element.tagName === 'TEXTAREA') {
            var rteOuterWrapper = this.createElement('div', {
                className: this.element.getAttribute('class')
            });
            if (!this.isBlazor()) {
                this.element.innerHTML = '';
            }
            this.element.parentElement.insertBefore(rteOuterWrapper, this.element);
            if (isBlazor()) {
                rteOuterWrapper.appendChild(this.element);
                this.valueContainer = this.createElement('textarea', {
                    id: this.element.id + '-value'
                });
            }
            else {
                this.valueContainer = this.element;
            }
            removeClass([this.valueContainer], this.element.getAttribute('class').split(' '));
            if (this.isBlazor()) {
                addClass([this.element], classes.CLS_RTE_HIDDEN);
            }
            this.element = rteOuterWrapper;
        }
        else {
            this.valueContainer = this.createElement('textarea', {
                id: this.getID() + '-value'
            });
        }
        this.valueContainer.name = this.getID();
        addClass([this.valueContainer], classes.CLS_RTE_HIDDEN);
        this.element.appendChild(this.valueContainer);
    };
    /**
     * getPersistData method
     * @hidden

     */
    RichTextEditor.prototype.getPersistData = function () {
        return this.addOnPersist(['value']);
    };
    /**
     * Focuses the Rich Text Editor component
     * @public
     */
    RichTextEditor.prototype.focusIn = function () {
        if (this.enabled) {
            this.inputElement.focus();
            this.focusHandler({});
        }
    };
    /**
     * Blurs the Rich Text Editor component
     * @public
     */
    RichTextEditor.prototype.focusOut = function () {
        if (this.enabled) {
            this.inputElement.blur();
            this.blurHandler({});
        }
    };
    /**
     * Selects all the content in RichTextEditor
     * @public
     */
    RichTextEditor.prototype.selectAll = function () {
        this.notify(events.selectAll, {});
    };
    /**
     * Selects a content range or an element
     * @param {Range} range - Specify the range which you want to select within the content.
     * The method used to select a particular sentence or word or entire document.
     * @public
     */
    RichTextEditor.prototype.selectRange = function (range) {
        this.notify(events.selectRange, { range: range });
    };
    /**
     * Retrieves the HTML markup content from currently selected content of RichTextEditor.
     * @public
     */
    RichTextEditor.prototype.getSelection = function () {
        var str = '';
        this.notify(events.getSelectedHtml, {
            callBack: function (txt) {
                str = txt;
            }
        });
        return str;
    };
    /**
     * Executes the commands
     * @param {CommandName} CommandName - Specifies the name of the command to be executed.
     * @param {string | HTMLElement | ILinkCommandsArgs | IImageCommandsArgs} value - Specifies the value that you want to execute.
     * @public
     */
    RichTextEditor.prototype.executeCommand = function (commandName, value, option) {
        value = this.htmlPurifier(commandName, value);
        if (this.editorMode === 'HTML') {
            var range = this.getRange();
            if (this.iframeSettings.enable) {
                this.formatter.editorManager.nodeSelection.Clear(this.element.ownerDocument);
            }
            var toFocus = (this.iframeSettings.enable &&
                range.startContainer === this.inputElement) ? true : !this.inputElement.contains(range.startContainer);
            if (toFocus) {
                this.focusIn();
            }
        }
        var tool = executeGroup[commandName];
        if (option && option.undo) {
            if (option.undo && this.formatter.getUndoRedoStack().length === 0) {
                this.formatter.saveData();
            }
        }
        this.formatter.editorManager.execCommand(tool.command, tool.subCommand ? tool.subCommand : (value ? value : tool.value), null, null, (value ? value : tool.value), (value ? value : tool.value));
        if (option && option.undo) {
            this.formatter.saveData();
            this.formatter.enableUndo(this);
        }
        this.setPlaceHolder();
        this.notify(events.contentChanged, {});
    };
    RichTextEditor.prototype.htmlPurifier = function (command, value) {
        if (this.editorMode === 'HTML') {
            switch (command) {
                case 'insertHTML':
                    if (this.enableHtmlSanitizer) {
                        if (typeof value === 'string') {
                            value = this.htmlEditorModule.sanitizeHelper(value);
                        }
                        else {
                            value = this.htmlEditorModule.sanitizeHelper(value.outerHTML);
                        }
                    }
                    break;
                case 'insertTable':
                    if (isNOU(value.width)) {
                        value.width = { minWidth: this.tableSettings.minWidth,
                            maxWidth: this.tableSettings.maxWidth, width: this.tableSettings.width };
                    }
                    break;
                case 'insertImage':
                    var temp = this.createElement('img', {
                        attrs: {
                            src: value.url
                        }
                    });
                    var imageValue = temp.outerHTML;
                    if (this.enableHtmlSanitizer) {
                        imageValue = this.htmlEditorModule.sanitizeHelper(temp.outerHTML);
                    }
                    var url = (imageValue !== '' && (this.createElement('div', {
                        innerHTML: imageValue
                    }).firstElementChild).getAttribute('src')) || null;
                    url = !isNOU(url) ? url : '';
                    value.url = url;
                    if (isNOU(value.width)) {
                        value.width = { minWidth: this.insertImageSettings.minWidth,
                            maxWidth: this.insertImageSettings.maxWidth, width: this.insertImageSettings.width };
                    }
                    if (isNOU(value.height)) {
                        value.height = { minHeight: this.insertImageSettings.minHeight,
                            maxHeight: this.insertImageSettings.maxHeight, height: this.insertImageSettings.height };
                    }
                    break;
                case 'createLink':
                    var tempNode = this.createElement('a', {
                        attrs: {
                            href: value.url
                        }
                    });
                    var linkValue = tempNode.outerHTML;
                    if (this.enableHtmlSanitizer) {
                        linkValue = this.htmlEditorModule.sanitizeHelper(tempNode.outerHTML);
                    }
                    var href = (linkValue !== '' && (this.createElement('div', {
                        innerHTML: linkValue
                    }).firstElementChild).getAttribute('href')) || null;
                    href = !isNOU(href) ? href : '';
                    value.url = href;
                    break;
            }
        }
        return value;
    };
    RichTextEditor.prototype.encode = function (value) {
        var divNode = this.createElement('div');
        divNode.innerText = value.trim();
        return divNode.innerHTML.replace(/<br\s*[\/]?>/gi, '\n');
    };
    /**
     * For internal use only - To Initialize the component rendering.
     * @private

     */
    RichTextEditor.prototype.render = function () {
        if (this.value && !this.valueTemplate) {
            this.setProperties({ value: this.serializeValue(this.value) }, true);
        }
        this.renderModule = new Render(this, this.serviceLocator);
        this.sourceCodeModule = new ViewSource(this, this.serviceLocator);
        this.notify(events.initialLoad, {});
        this.trigger(events.load);
        this.RTERender();
        var execCommandCallBack = new ExecCommandCallBack(this);
        this.notify(events.initialEnd, {});
        if (this.toolbarSettings.enable && this.toolbarSettings.type === 'Expand' && !isNOU(this.getToolbar()) &&
            (this.toolbarSettings.items.indexOf('Undo') > -1 && this.toolbarSettings.items.indexOf('Redo') > -1)) {
            this.disableToolbarItem(['Undo', 'Redo']);
        }
        this.setContentHeight();
        if (this.value !== null) {
            if (!this.isBlazor()) {
                this.valueContainer.defaultValue = this.value;
            }
            else {
                this.defaultResetValue = this.value;
            }
        }
        (!this.enabled) ? this.unWireEvents() : this.eventInitializer();
        this.renderComplete();
    };
    /**
     * For internal use only - Initialize the event handler
     * @private

     */
    RichTextEditor.prototype.eventInitializer = function () {
        this.wireEvents();
    };
    /**
     * For internal use only - keydown the event handler;
     * @private

     */
    RichTextEditor.prototype.keyDown = function (e) {
        this.notify(events.keyDown, { member: 'keydown', args: e });
        this.restrict(e);
        if (this.editorMode === 'HTML' && ((e.which === 8 && e.code === 'Backspace') || (e.which === 46 && e.code === 'Delete'))) {
            var range = this.getRange();
            var startNode = range.startContainer.nodeName === '#text' ? range.startContainer.parentElement :
                range.startContainer;
            if (closest(startNode, 'pre') &&
                (e.which === 8 && range.startContainer.textContent.charCodeAt(range.startOffset - 1) === 8203) ||
                (e.which === 46 && range.startContainer.textContent.charCodeAt(range.startOffset) === 8203)) {
                var regEx = new RegExp(String.fromCharCode(8203), 'g');
                var pointer = e.which === 8 ? range.startOffset - 1 : range.startOffset;
                range.startContainer.textContent = range.startContainer.textContent.replace(regEx, '');
                this.formatter.editorManager.nodeSelection.setCursorPoint(this.contentModule.getDocument(), range.startContainer, pointer);
            }
            else if ((e.code === 'Backspace' && e.which === 8) &&
                range.startContainer.textContent.charCodeAt(0) === 8203 && range.collapsed) {
                var parentEle = range.startContainer.parentElement;
                var index = void 0;
                var i = void 0;
                for (i = 0; i < parentEle.childNodes.length; i++) {
                    if (parentEle.childNodes[i] === range.startContainer) {
                        index = i;
                    }
                }
                var bool = true;
                var removeNodeArray = [];
                for (i = index; i >= 0; i--) {
                    if (parentEle.childNodes[i].nodeType === 3 && parentEle.childNodes[i].textContent.charCodeAt(0) === 8203 && bool) {
                        removeNodeArray.push(i);
                    }
                    else {
                        bool = false;
                    }
                }
                if (removeNodeArray.length > 0) {
                    for (i = removeNodeArray.length - 1; i > 0; i--) {
                        parentEle.childNodes[removeNodeArray[i]].textContent = '';
                    }
                }
                this.formatter.editorManager.nodeSelection.setCursorPoint(this.contentModule.getDocument(), range.startContainer, range.startOffset);
            }
        }
        if (this.formatter.getUndoRedoStack().length === 0) {
            this.formatter.saveData();
        }
        if (e.action !== 'insert-link' &&
            (e.action && e.action !== 'paste' || e.which === 9 ||
                (e.code === 'Backspace' && e.which === 8))) {
            this.formatter.process(this, null, e);
            switch (e.action) {
                case 'toolbar-focus':
                    if (this.toolbarSettings.enable) {
                        var selector = '.e-toolbar-item[aria-disabled="false"][title] [tabindex]';
                        this.toolbarModule.baseToolbar.toolbarObj.element.querySelector(selector).focus();
                    }
                    break;
                case 'escape':
                    this.contentModule.getEditPanel().focus();
                    break;
            }
        }
        if (!isNOU(this.placeholder)) {
            if ((!isNOU(this.placeHolderWrapper)) && (this.inputElement.textContent.length !== 1)) {
                this.placeHolderWrapper.style.display = 'none';
            }
            else {
                this.setPlaceHolder();
            }
        }
        this.autoResize();
    };
    RichTextEditor.prototype.keyUp = function (e) {
        this.notify(events.keyUp, { member: 'keyup', args: e });
        if (e.code === 'KeyX' && e.which === 88 && e.keyCode === 88 && e.ctrlKey && (this.inputElement.innerHTML === '' ||
            this.inputElement.innerHTML === '<br>')) {
            this.inputElement.innerHTML = getEditValue('<p><br></p>', this);
        }
        var allowedKeys = e.which === 32 || e.which === 13 || e.which === 8 || e.which === 46;
        if (((e.key !== 'shift' && !e.ctrlKey) && e.key && e.key.length === 1 || allowedKeys) || (this.editorMode === 'Markdown'
            && ((e.key !== 'shift' && !e.ctrlKey) && e.key && e.key.length === 1 || allowedKeys)) && !this.inlineMode.enable) {
            this.formatter.onKeyHandler(this, e);
        }
        if (this.inputElement && this.inputElement.textContent.length !== 0) {
            this.notify(events.toolbarRefresh, { args: e });
        }
        if (!isNOU(this.placeholder)) {
            this.setPlaceHolder();
        }
    };
    /**
     * @hidden

     */
    RichTextEditor.prototype.serializeValue = function (value) {
        if (this.editorMode === 'HTML' && !isNOU(value)) {
            if (this.enableHtmlEncode) {
                value = this.htmlEditorModule.sanitizeHelper(decode(value));
                value = this.encode(value);
            }
            else {
                value = this.htmlEditorModule.sanitizeHelper(value);
            }
        }
        return value;
    };
    /**
     * This method will clean up the HTML against cross-site scripting attack and return the HTML as string.
     * It's only applicable to editorMode as `HTML`.
     * @param {string} value - Specifies the value that you want to sanitize.
     * @return {string}
     */
    RichTextEditor.prototype.sanitizeHtml = function (value) {
        return this.serializeValue(value);
    };
    /**
     * updateValue method
     * @hidden

     */
    RichTextEditor.prototype.updateValue = function (value) {
        if (isNOU(value)) {
            var inputVal = this.inputElement.innerHTML;
            this.setProperties({ value: isEditableValueEmpty(inputVal) ? null : inputVal });
        }
        else {
            this.setProperties({ value: value });
        }
    };
    RichTextEditor.prototype.triggerEditArea = function (e) {
        if (!isIDevice()) {
            this.notify(events.editAreaClick, { member: 'editAreaClick', args: e });
        }
        else {
            var touch = (e.touches ? e.changedTouches[0] : e);
            if (this.clickPoints.clientX === touch.clientX && this.clickPoints.clientY === touch.clientY) {
                this.notify(events.editAreaClick, { member: 'editAreaClick', args: e });
            }
        }
    };
    RichTextEditor.prototype.notifyMouseUp = function (e) {
        var touch = (e.touches ? e.changedTouches[0] : e);
        this.notify(events.mouseUp, { member: 'mouseUp', args: e,
            touchData: { prevClientX: this.clickPoints.clientX, prevClientY: this.clickPoints.clientY,
                clientX: touch.clientX, clientY: touch.clientY }
        });
        if (this.inputElement && ((this.editorMode === 'HTML' && this.inputElement.textContent.length !== 0) ||
            (this.editorMode === 'Markdown' && this.inputElement.value.length !== 0))) {
            this.notify(events.toolbarRefresh, { args: e });
        }
        this.triggerEditArea(e);
    };
    RichTextEditor.prototype.mouseUp = function (e) {
        if (this.quickToolbarSettings.showOnRightClick && Browser.isDevice) {
            var target = e.target;
            var closestTable = closest(target, 'table');
            if (target && target.nodeName === 'A' || target.nodeName === 'IMG' || (target.nodeName === 'TD' || target.nodeName === 'TH' ||
                target.nodeName === 'TABLE' || (closestTable && this.contentModule.getEditPanel().contains(closestTable)))) {
                return;
            }
        }
        this.notifyMouseUp(e);
    };
    /**
     * @hidden

     */
    RichTextEditor.prototype.ensureModuleInjected = function (module) {
        return this.getInjectedModules().indexOf(module) >= 0;
    };
    /**
     * @hidden

     */
    RichTextEditor.prototype.onCopy = function () {
        this.contentModule.getDocument().execCommand('copy', false, null);
    };
    /**
     * @hidden

     */
    RichTextEditor.prototype.onCut = function () {
        this.contentModule.getDocument().execCommand('cut', false, null);
    };
    /**
     * @hidden

     */
    RichTextEditor.prototype.onPaste = function (e) {
        var _this = this;
        var evenArgs = {
            originalEvent: e,
            cancel: false,
            requestType: 'Paste'
        };
        this.trigger(events.actionBegin, evenArgs, function (pasteArgs) {
            var currentLength = _this.getText().length;
            var selectionLength = _this.getSelection().length;
            var pastedContentLength = (isNOU(e) || isNOU(e.clipboardData))
                ? 0 : e.clipboardData.getData('text/plain').length;
            var totalLength = (currentLength - selectionLength) + pastedContentLength;
            if (!pasteArgs.cancel && _this.inputElement.contentEditable === 'true' &&
                (_this.maxLength === -1 || totalLength < _this.maxLength)) {
                if (!isNOU(_this.pasteCleanupModule)) {
                    _this.notify(events.pasteClean, { args: e });
                }
                else {
                    var args_1 = { requestType: 'Paste', editorMode: _this.editorMode, event: e };
                    var value = null;
                    if (e && !isNOU(e.clipboardData)) {
                        value = e.clipboardData.getData('text/plain');
                    }
                    var file = e && e.clipboardData && e.clipboardData.items.length > 0 ?
                        e.clipboardData.items[0].getAsFile() : null;
                    if (value !== null) {
                        _this.notify(events.paste, {
                            file: file,
                            args: e,
                            text: value
                        });
                    }
                    setTimeout(function () { _this.formatter.onSuccess(_this, args_1); }, 0);
                }
            }
            else {
                e.preventDefault();
            }
        });
    };
    /**
     * @hidden

     */
    RichTextEditor.prototype.clipboardAction = function (action, event) {
        switch (action.toLowerCase()) {
            case 'cut':
                this.onCut();
                this.formatter.onSuccess(this, {
                    requestType: 'Cut',
                    editorMode: this.editorMode,
                    event: event
                });
                break;
            case 'copy':
                this.onCopy();
                this.formatter.onSuccess(this, {
                    requestType: 'Copy',
                    editorMode: this.editorMode,
                    event: event
                });
                break;
            case 'paste':
                this.onPaste(event);
                break;
        }
    };
    /**
     * Destroys the component (detaches/removes all event handlers, attributes, classes, and empties the component element).
     * @method destroy
     * @return {void}
     */
    RichTextEditor.prototype.destroy = function () {
        if (this.isDestroyed) {
            return;
        }
        if (this.isRendered) {
            this.notify(events.destroy, {});
            this.destroyDependentModules();
            if (!isNOU(this.timeInterval)) {
                clearInterval(this.timeInterval);
                this.timeInterval = null;
            }
            this.unWireEvents();
            if (this.originalElement.tagName === 'TEXTAREA') {
                if (isBlazor()) {
                    detach(this.valueContainer);
                    this.valueContainer = this.element.querySelector('.e-blazor-hidden.e-control.e-richtexteditor');
                }
                this.element.parentElement.insertBefore(this.valueContainer, this.element);
                this.valueContainer.id = this.getID();
                this.valueContainer.removeAttribute('name');
                detach(this.element);
                if (this.originalElement.innerHTML.trim() !== '') {
                    if (!isBlazor()) {
                        this.valueContainer.value = this.originalElement.innerHTML.trim();
                        this.setProperties({ value: (!isNOU(this.initialValue) ? this.initialValue : null) }, true);
                    }
                }
                else {
                    this.valueContainer.value = !this.isBlazor() ? this.valueContainer.defaultValue : this.defaultResetValue;
                }
                this.element = this.valueContainer;
                for (var i = 0; i < this.originalElement.classList.length; i++) {
                    addClass([this.element], this.originalElement.classList[i]);
                }
                removeClass([this.element], classes.CLS_RTE_HIDDEN);
            }
            else {
                if (this.originalElement.innerHTML.trim() !== '') {
                    this.element.innerHTML = this.originalElement.innerHTML.trim();
                    this.setProperties({ value: (!isNOU(this.initialValue) ? this.initialValue : null) }, true);
                }
                else {
                    this.element.innerHTML = '';
                }
            }
            if (this.placeholder && this.placeHolderWrapper) {
                this.placeHolderWrapper = null;
            }
            if (!isNOU(this.cssClass)) {
                removeClass([this.element], this.cssClass);
            }
            this.removeHtmlAttributes();
            this.removeAttributes();
            _super.prototype.destroy.call(this);
            this.isRendered = false;
            if (this.enablePersistence) {
                window.localStorage.removeItem(this.getModuleName() + this.element.id);
            }
        }
    };
    RichTextEditor.prototype.removeHtmlAttributes = function () {
        if (this.htmlAttributes) {
            var keys = Object.keys(this.htmlAttributes);
            for (var i = 0; i < keys.length && this.element.hasAttribute(keys[i]); i++) {
                this.element.removeAttribute(keys[i]);
            }
        }
    };
    RichTextEditor.prototype.removeAttributes = function () {
        if (!this.enabled) {
            removeClass([this.element], classes.CLS_DISABLED);
        }
        if (this.enableRtl) {
            removeClass([this.element], classes.CLS_RTL);
        }
        if (this.readonly) {
            removeClass([this.element], classes.CLS_RTE_READONLY);
        }
        if (this.element.style.width !== '' && this.originalElement.style.width === '') {
            this.element.style.removeProperty('width');
        }
        if (this.element.style.height !== '' && this.originalElement.style.height === '') {
            this.element.style.removeProperty('height');
        }
        this.element.removeAttribute('aria-disabled');
        this.element.removeAttribute('role');
        this.element.removeAttribute('tabindex');
    };
    RichTextEditor.prototype.destroyDependentModules = function () {
        /* destroy dependent modules */
        this.renderModule.destroy();
        this.formatter.editorManager.undoRedoManager.destroy();
        this.sourceCodeModule.destroy();
    };
    /**
     * Returns the HTML or Text inside the RichTextEditor.
     * @return {Element}
     */
    RichTextEditor.prototype.getContent = function () {
        if (this.iframeSettings.enable && isBlazor()) {
            return this.inputElement;
        }
        else {
            return this.contentModule.getPanel();
        }
    };
    /**
     * Returns the text content as string.
     * @return {string}
     */
    RichTextEditor.prototype.getText = function () {
        return this.contentModule.getText();
    };
    /**
     * Returns the html value of the selected content as string.
     * @return {string}
     */
    RichTextEditor.prototype.getSelectedHtml = function () {
        var range;
        var wrapperElm = this.createElement('div');
        var selection = this.contentModule.getDocument().getSelection();
        if (selection.rangeCount > 0) {
            range = selection.getRangeAt(0);
            var selectedHtml = range.cloneContents();
            wrapperElm.appendChild(selectedHtml);
        }
        return wrapperElm.innerHTML;
    };
    /**
     * It shows the inline quick toolbar
     */
    RichTextEditor.prototype.showInlineToolbar = function () {
        if (this.inlineMode.enable) {
            var currentRange = this.getRange();
            var targetElm = currentRange.endContainer.nodeName === '#text' ?
                currentRange.endContainer.parentElement : currentRange.endContainer;
            var x = currentRange.getClientRects()[0].left;
            var y = currentRange.getClientRects()[0].top;
            this.quickToolbarModule.showInlineQTBar(x, y, targetElm);
        }
    };
    /**
     * It hides the inline quick toolbar
     */
    RichTextEditor.prototype.hideInlineToolbar = function () {
        this.quickToolbarModule.hideInlineQTBar();
    };
    /**
     * For internal use only - Get the module name.
     * @private

     */
    RichTextEditor.prototype.getModuleName = function () {
        return 'richtexteditor';
    };
    /**
     * Called internally if any of the property value changed.
     * @hidden

     */
    RichTextEditor.prototype.onPropertyChanged = function (newProp, oldProp) {
        for (var _i = 0, _a = Object.keys(newProp); _i < _a.length; _i++) {
            var prop = _a[_i];
            switch (prop) {
                case 'value':
                    var val = void 0;
                    var nVal = newProp[prop];
                    val = this.editorMode === 'HTML' ? getEditValue(nVal, this) : nVal;
                    if (!isNOU(nVal) && nVal !== '') {
                        this.value = this.serializeValue(((this.enableHtmlEncode) ? this.encode(decode(val)) : val));
                    }
                    this.updatePanelValue();
                    this.setPlaceHolder();
                    this.notify(events.xhtmlValidation, { module: 'XhtmlValidation', newProp: newProp, oldProp: oldProp });
                    if (this.showCharCount) {
                        this.countModule.refresh();
                    }
                    break;
                case 'valueTemplate':
                    this.setValue();
                    if (this.showCharCount) {
                        this.countModule.refresh();
                    }
                    break;
                case 'width':
                    this.setWidth(newProp[prop]);
                    if (this.toolbarSettings.enable) {
                        this.toolbarModule.refreshToolbarOverflow();
                        this.resizeHandler();
                    }
                    break;
                case 'height':
                    this.setHeight(newProp[prop]);
                    this.setContentHeight();
                    this.autoResize();
                    break;
                case 'readonly':
                    this.setReadOnly(false);
                    break;
                case 'cssClass':
                    this.element.classList.remove(oldProp[prop]);
                    this.setCssClass(newProp[prop]);
                    break;
                case 'enabled':
                    this.setEnable();
                    break;
                case 'enableRtl':
                    this.updateRTL();
                    break;
                case 'placeholder':
                    this.placeholder = newProp[prop];
                    this.setPlaceHolder();
                    break;
                case 'htmlAttributes':
                    setAttributes(this.htmlAttributes, this, false, false);
                    break;
                case 'iframeSettings':
                    var frameSetting = oldProp[prop];
                    if (frameSetting.resources) {
                        var iframe = this.contentModule.getDocument();
                        var header = iframe.querySelector('head');
                        var files = void 0;
                        if (frameSetting.resources.scripts) {
                            files = header.querySelectorAll('.' + classes.CLS_SCRIPT_SHEET);
                            this.removeSheets(files);
                        }
                        if (frameSetting.resources.styles) {
                            files = header.querySelectorAll('.' + classes.CLS_STYLE_SHEET);
                            this.removeSheets(files);
                        }
                    }
                    this.setIframeSettings();
                    break;
                case 'locale':
                    _super.prototype.refresh.call(this);
                    break;
                case 'inlineMode':
                    this.notify(events.modelChanged, { module: 'quickToolbar', newProp: newProp, oldProp: oldProp });
                    this.setContentHeight();
                    break;
                case 'toolbarSettings':
                    this.notify(events.modelChanged, { module: 'toolbar', newProp: newProp, oldProp: oldProp });
                    this.setContentHeight();
                    break;
                case 'maxLength':
                    if (this.showCharCount) {
                        this.countModule.refresh();
                    }
                    break;
                case 'showCharCount':
                    if (newProp[prop] && this.countModule) {
                        this.countModule.renderCount();
                    }
                    else if (newProp[prop] === false && this.countModule) {
                        this.countModule.destroy();
                    }
                    break;
                case 'enableHtmlEncode':
                    this.updateValueData();
                    this.updatePanelValue();
                    this.setPlaceHolder();
                    if (this.showCharCount) {
                        this.countModule.refresh();
                    }
                    break;
                case 'undoRedoSteps':
                case 'undoRedoTimer':
                    this.formatter.editorManager.observer.notify(CONSTANT.MODEL_CHANGED, { newProp: newProp, oldProp: oldProp });
                    break;
                case 'enableXhtml':
                    this.notify(events.xhtmlValidation, { module: 'XhtmlValidation', newProp: newProp, oldProp: oldProp });
                    break;
                case 'quickToolbarSettings':
                    newProp.quickToolbarSettings.showOnRightClick ? this.wireContextEvent() : this.unWireContextEvent();
                    this.notify(events.modelChanged, { newProp: newProp, oldProp: oldProp });
                    break;
                default:
                    this.notify(events.modelChanged, { newProp: newProp, oldProp: oldProp });
                    break;
            }
        }
    };
    /**
     * @hidden

     */
    RichTextEditor.prototype.updateValueData = function () {
        if (this.enableHtmlEncode) {
            this.setProperties({ value: this.encode(decode(this.inputElement.innerHTML)) }, true);
        }
        else {
            this.setProperties({
                value: /<[a-z][\s\S]*>/i.test(this.inputElement.innerHTML) ? this.inputElement.innerHTML :
                    decode(this.inputElement.innerHTML)
            });
        }
    };
    RichTextEditor.prototype.removeSheets = function (srcList) {
        var i;
        for (i = 0; i < srcList.length; i++) {
            detach(srcList[i]);
        }
    };
    RichTextEditor.prototype.updatePanelValue = function () {
        var value = this.value;
        value = (this.enableHtmlEncode && this.value) ? decode(value) : value;
        var getTextArea = this.element.querySelector('.e-rte-srctextarea');
        if (value) {
            if (getTextArea && getTextArea.style.display === 'block') {
                getTextArea.value = this.value;
            }
            if (this.valueContainer) {
                this.valueContainer.value = (this.enableHtmlEncode) ? this.value : value;
            }
            if (this.editorMode === 'HTML' && this.inputElement && this.inputElement.innerHTML.trim() !== value.trim()) {
                this.inputElement.innerHTML = value;
            }
            else if (this.editorMode === 'Markdown' && this.inputElement
                && this.inputElement.value.trim() !== value.trim()) {
                this.inputElement.value = value;
            }
        }
        else {
            if (getTextArea && getTextArea.style.display === 'block') {
                getTextArea.value = '';
            }
            if (this.editorMode === 'HTML') {
                this.inputElement.innerHTML = '<p><br/></p>';
            }
            else {
                this.inputElement.value = '';
            }
            if (this.valueContainer) {
                this.valueContainer.value = '';
            }
        }
        if (this.showCharCount) {
            this.countModule.refresh();
        }
    };
    RichTextEditor.prototype.setHeight = function (height) {
        if (height !== 'auto') {
            this.element.style.height = formatUnit(height);
        }
        else {
            this.element.style.height = 'auto';
        }
        if (this.toolbarSettings.type === 'Expand' && (typeof (this.height) === 'string' &&
            this.height.indexOf('px') > -1 || typeof (this.height) === 'number')) {
            this.element.classList.add(classes.CLS_RTE_FIXED_TB_EXPAND);
        }
        else {
            this.element.classList.remove(classes.CLS_RTE_FIXED_TB_EXPAND);
        }
    };
    /**
     * setPlaceHolder method
     * @hidden

     */
    RichTextEditor.prototype.setPlaceHolder = function () {
        if (this.inputElement && this.placeholder && this.iframeSettings.enable !== true) {
            if (this.editorMode !== 'Markdown') {
                if (!this.placeHolderWrapper) {
                    this.placeHolderWrapper = this.createElement('span', { className: 'rte-placeholder' });
                    if (this.inputElement) {
                        this.inputElement.parentElement.insertBefore(this.placeHolderWrapper, this.inputElement);
                    }
                    attributes(this.placeHolderWrapper, {
                        'style': 'font-size: 14px; padding: 16px; margin-left: 0px; margin-right: 0px;'
                    });
                }
                this.placeHolderWrapper.innerHTML = this.placeholder;
                if (this.inputElement.textContent.length === 0 &&
                    !isNOU(this.inputElement.firstChild) && this.inputElement.firstChild.nodeName === 'P' &&
                    !isNOU(this.inputElement.firstChild.firstChild) && this.inputElement.firstChild.firstChild.nodeName === 'BR') {
                    this.placeHolderWrapper.style.display = 'block';
                }
                else {
                    this.placeHolderWrapper.style.display = 'none';
                }
            }
            else {
                this.inputElement.setAttribute('placeholder', this.placeholder);
            }
        }
    };
    RichTextEditor.prototype.setWidth = function (width) {
        if (width !== 'auto') {
            setStyleAttribute(this.element, { 'width': formatUnit(this.width) });
        }
        else {
            this.element.style.width = 'auto';
        }
    };
    RichTextEditor.prototype.setCssClass = function (cssClass) {
        if (!isNOU(cssClass)) {
            this.element.classList.add(cssClass);
        }
    };
    RichTextEditor.prototype.updateRTL = function () {
        this.notify(events.rtlMode, { enableRtl: this.enableRtl });
        if (this.enableRtl) {
            this.element.classList.add(classes.CLS_RTL);
        }
        else {
            this.element.classList.remove(classes.CLS_RTL);
        }
    };
    RichTextEditor.prototype.updateReadOnly = function () {
        this.notify(events.readOnlyMode, { editPanel: this.inputElement, mode: this.readonly });
    };
    /**
     * setReadOnly method
     * @hidden

     */
    RichTextEditor.prototype.setReadOnly = function (initial) {
        this.updateReadOnly();
        if (!initial) {
            if (this.readonly && this.enabled) {
                this.unbindEvents();
            }
            else if (this.enabled) {
                this.bindEvents();
            }
        }
    };
    /**
     * By default, prints all the pages of the RichTextEditor.
     * @return {void}
     */
    RichTextEditor.prototype.print = function () {
        var _this = this;
        var printWind;
        var printArgs = {
            element: this.inputElement,
            requestType: 'print',
            cancel: false
        };
        this.trigger(events.actionBegin, printArgs, function (printingArgs) {
            printWind = window.open('', 'print', 'height=' + window.outerHeight + ',width=' + window.outerWidth);
            if (Browser.info.name === 'msie') {
                printWind.resizeTo(screen.availWidth, screen.availHeight);
            }
            printWind = printWindow(_this.inputElement, printWind);
            if (!printingArgs.cancel) {
                var actionArgs = {
                    requestType: 'print'
                };
                _this.trigger(events.actionComplete, actionArgs);
            }
        });
    };
    /**
     * Refresh the view of the editor.
     * @public
     */
    RichTextEditor.prototype.refreshUI = function () {
        this.renderModule.refresh();
    };
    /**
     * Shows the Rich Text Editor component in full-screen mode.
     */
    RichTextEditor.prototype.showFullScreen = function () {
        if (this.readonly) {
            return;
        }
        this.fullScreenModule.showFullScreen();
    };
    /**
     * Enables the give toolbar items in the Rich Text Editor component.
     * @param {boolean} muteToolbarUpdate enable/disables the toolbar item status in RichTextEditor.
     * @param {string | string[]} items - Specifies the single or collection of items
     * that you want to be enable in Rich Text Editor’s Toolbar.
     * @public
     */
    RichTextEditor.prototype.enableToolbarItem = function (items, muteToolbarUpdate) {
        this.toolbarModule.enableTBarItems(this.getBaseToolbarObject(), items, true, muteToolbarUpdate);
    };
    /**
     * Disables the given toolbar items in the Rich Text Editor component.
     * @param {boolean} muteToolbarUpdate enable/disables the toolbar item status in RichTextEditor.
     * @param {string | string[]} items - Specifies the single or collection of items
     * that you want to be disable in Rich Text Editor’s Toolbar.
     * @public
     */
    RichTextEditor.prototype.disableToolbarItem = function (items, muteToolbarUpdate) {
        this.toolbarModule.enableTBarItems(this.getBaseToolbarObject(), items, false, muteToolbarUpdate);
    };
    /**
     * Removes the give toolbar items from the Rich Text Editor component.
     * @param {string | string[]} items - Specifies the single or collection of items
     * that you want to be remove from Rich Text Editor’s Toolbar.
     * @public
     */
    RichTextEditor.prototype.removeToolbarItem = function (items) {
        this.toolbarModule.removeTBarItems(items);
    };
    /**
     * Get the selected range from the RichTextEditor's content.
     * @public

     */
    RichTextEditor.prototype.getRange = function () {
        return this.formatter.editorManager.nodeSelection.getRange(this.contentModule.getDocument());
    };
    RichTextEditor.prototype.initializeServices = function () {
        this.serviceLocator.register('rendererFactory', new RendererFactory);
        this.serviceLocator.register('rteLocale', this.localeObj = new L10n(this.getModuleName(), defaultLocale, this.locale));
        this.serviceLocator.register('dialogRenderObject', new DialogRenderer(this));
    };
    RichTextEditor.prototype.RTERender = function () {
        var rendererFactory = this.serviceLocator.getService('rendererFactory');
        this.contentModule = rendererFactory.getRenderer(RenderType.Content);
        this.fullScreenModule = new FullScreen(this);
        this.renderModule.render();
        this.inputElement = this.contentModule.getEditPanel();
        this.setHeight(this.height);
        setAttributes(this.htmlAttributes, this, false, true);
        if (this.iframeSettings) {
            this.setIframeSettings();
        }
        this.setCssClass(this.cssClass);
        this.updateEnable();
        this.setPlaceHolder();
        this.updateRTL();
        this.updateReadOnly();
        this.updatePanelValue();
        if (this.enableHtmlEncode && !isNOU(this.value)) {
            this.setProperties({ value: this.encode(decode(this.value)) });
        }
    };
    RichTextEditor.prototype.setIframeSettings = function () {
        if (this.iframeSettings.resources) {
            var styleSrc = this.iframeSettings.resources.styles;
            var scriptSrc = this.iframeSettings.resources.scripts;
            if (this.iframeSettings.resources.scripts.length > 0) {
                this.InjectSheet(true, scriptSrc);
            }
            if (this.iframeSettings.resources.styles.length > 0) {
                this.InjectSheet(false, styleSrc);
            }
        }
        if (this.iframeSettings.attributes) {
            setAttributes(this.iframeSettings.attributes, this, true, false);
        }
    };
    RichTextEditor.prototype.InjectSheet = function (scriptSheet, srcList) {
        try {
            if (srcList && srcList.length > 0) {
                var iFrame = this.contentModule.getDocument();
                var target = iFrame.querySelector('head');
                for (var i = 0; i < srcList.length; i++) {
                    if (scriptSheet) {
                        var scriptEle = this.createScriptElement();
                        scriptEle.src = srcList[i];
                        target.appendChild(scriptEle);
                    }
                    else {
                        var styleEle = this.createStyleElement();
                        styleEle.href = srcList[i];
                        target.appendChild(styleEle);
                    }
                }
            }
        }
        catch (e) {
            return;
        }
    };
    RichTextEditor.prototype.createScriptElement = function () {
        var scriptEle = this.createElement('script', {
            className: classes.CLS_SCRIPT_SHEET
        });
        scriptEle.type = 'text/javascript';
        return scriptEle;
    };
    RichTextEditor.prototype.createStyleElement = function () {
        var styleEle = this.createElement('link', {
            className: classes.CLS_STYLE_SHEET
        });
        styleEle.rel = 'stylesheet';
        return styleEle;
    };
    RichTextEditor.prototype.isBlazor = function () {
        return (!isBlazor() ? false : true);
    };
    RichTextEditor.prototype.setValue = function () {
        if (this.valueTemplate) {
            if (typeof this.valueTemplate === 'string') {
                this.setProperties({ value: this.valueTemplate });
            }
            else {
                var compiledString = void 0;
                compiledString = compile(this.valueTemplate);
                var compiledTemplate = compiledString({});
                for (var i = 0; i < compiledTemplate.length; i++) {
                    var item = compiledTemplate[i];
                    append([item], this.element);
                }
                this.setProperties({ value: this.element.innerHTML.trim() });
            }
        }
        else {
            var innerHtml = !isNOU(this.element.innerHTML) && this.element.innerHTML.replace(/<(\/?|\!?)(!--!--)>/g, '').trim();
            if (innerHtml !== '') {
                if (this.element.tagName === 'TEXTAREA') {
                    this.setProperties({ value: decode(innerHtml) });
                }
                else {
                    this.setProperties({ value: innerHtml });
                }
            }
        }
    };
    /**
     * setContentHeight method
     * @hidden

     */
    RichTextEditor.prototype.setContentHeight = function (target, isExpand) {
        var heightValue;
        var topValue = 0;
        var rteHeightPercent;
        var heightPercent;
        var cntEle = (this.sourceCodeModule.getPanel() &&
            this.sourceCodeModule.getPanel().parentElement.style.display === 'block') ? this.sourceCodeModule.getPanel().parentElement :
            this.contentModule.getPanel();
        var rteHeight = this.element.offsetHeight;
        if (this.element.offsetHeight === 0 && this.height !== 'auto' && !this.getToolbar()) {
            rteHeight = parseInt(this.height, 10);
            heightPercent = typeof (this.height) === 'string' && this.height.indexOf('%') > -1;
            if (heightPercent) {
                rteHeightPercent = this.height;
            }
        }
        var tbHeight = this.getToolbar() ? this.toolbarModule.getToolbarHeight() : 0;
        var rzHeight = this.enableResize ?
            this.element.querySelector('.' + classes.CLS_RTE_RES_HANDLE).offsetHeight + 8 : 0;
        var expandPopHeight = this.getToolbar() ? this.toolbarModule.getExpandTBarPopHeight() : 0;
        if (this.toolbarSettings.type === ToolbarType.Expand && isExpand && target !== 'preview') {
            heightValue = (this.height === 'auto' && rzHeight === 0) ? 'auto' : rteHeight - (tbHeight + expandPopHeight + rzHeight) + 'px';
            topValue = (!this.toolbarSettings.enableFloating) ? expandPopHeight : 0;
        }
        else {
            if (this.height === 'auto' && !(this.element.classList.contains('e-rte-full-screen'))) {
                heightValue = 'auto';
            }
            else {
                heightValue = heightPercent ? rteHeightPercent : rteHeight - (tbHeight + rzHeight) + 'px';
            }
        }
        setStyleAttribute(cntEle, { height: heightValue, marginTop: topValue + 'px' });
        if (this.iframeSettings.enable && target === 'sourceCode') {
            var codeElement = select('.' + classes.CLS_RTE_CONTENT, this.element);
            setStyleAttribute(codeElement, { height: heightValue, marginTop: topValue + 'px' });
        }
        if (this.toolbarSettings.enableFloating && this.getToolbar() && !this.inlineMode.enable) {
            var tbWrapHeight = (isExpand ? (tbHeight + expandPopHeight) : tbHeight) + 'px';
            setStyleAttribute(this.getToolbar().parentElement, { height: tbWrapHeight });
        }
        if (rzHeight === 0) {
            this.autoResize();
        }
    };
    /**
     * Retrieves the HTML from RichTextEditor.
     * @public
     */
    RichTextEditor.prototype.getHtml = function () {
        return this.value;
    };
    /**
     * Shows the source HTML/MD markup.
     * @public
     */
    RichTextEditor.prototype.showSourceCode = function () {
        if (this.readonly) {
            return;
        }
        this.notify(events.sourceCode, {});
    };
    /**
     * Returns the maximum number of characters in the Rich Text Editor.
     * @public
     */
    RichTextEditor.prototype.getCharCount = function () {
        var htmlText = this.editorMode === 'Markdown' ? this.inputElement.value.trim() :
            this.inputElement.textContent.trim();
        return htmlText.length;
    };
    /**
     * @hidden

     */
    RichTextEditor.prototype.getBaseToolbarObject = function () {
        var tbObj;
        if (this.inlineMode.enable && (!Browser.isDevice || isIDevice())) {
            tbObj = this.quickToolbarModule && this.quickToolbarModule.getInlineBaseToolbar();
        }
        else {
            tbObj = this.toolbarModule && this.toolbarModule.getBaseToolbar();
        }
        return tbObj;
    };
    /**
     * @hidden

     */
    RichTextEditor.prototype.getToolbar = function () {
        return this.toolbarModule ? this.toolbarModule.getToolbarElement() : null;
    };
    /**
     * @hidden

     */
    RichTextEditor.prototype.getToolbarElement = function () {
        return this.toolbarModule && this.toolbarModule.getToolbarElement();
    };
    /**
     * getID method
     * @hidden

     */
    RichTextEditor.prototype.getID = function () {
        return (this.originalElement.tagName === 'TEXTAREA' ? this.valueContainer.id : this.element.id);
    };
    RichTextEditor.prototype.mouseDownHandler = function (e) {
        var touch = (e.touches ? e.changedTouches[0] : e);
        addClass([this.element], [classes.CLS_FOCUS]);
        this.preventDefaultResize(e);
        this.notify(events.mouseDown, { args: e });
        this.clickPoints = { clientX: touch.clientX, clientY: touch.clientY };
    };
    RichTextEditor.prototype.preventImgResize = function (e) {
        if (e.target.nodeName.toLocaleLowerCase() === 'img') {
            e.preventDefault();
        }
    };
    /**
     * preventDefaultResize method
     * @hidden

     */
    RichTextEditor.prototype.preventDefaultResize = function (e) {
        if (Browser.info.name === 'msie') {
            this.contentModule.getEditPanel().addEventListener('mscontrolselect', this.preventImgResize);
        }
        else if (Browser.info.name === 'mozilla') {
            this.contentModule.getDocument().execCommand('enableObjectResizing', false, 'false');
            this.contentModule.getDocument().execCommand('enableInlineTableEditing', false, 'false');
        }
    };
    RichTextEditor.prototype.defaultResize = function (e) {
        if (Browser.info.name === 'msie') {
            this.contentModule.getEditPanel().removeEventListener('mscontrolselect', this.preventImgResize);
        }
        else if (Browser.info.name === 'mozilla') {
            this.contentModule.getDocument().execCommand('enableObjectResizing', true, 'true');
            this.contentModule.getDocument().execCommand('enableInlineTableEditing', true, 'true');
        }
    };
    RichTextEditor.prototype.resizeHandler = function () {
        var isExpand = false;
        if (this.toolbarSettings.enable && !this.inlineMode.enable) {
            this.toolbarModule.refreshToolbarOverflow();
            isExpand = this.toolbarModule.baseToolbar.toolbarObj.element.classList.contains(classes.CLS_EXPAND_OPEN);
        }
        this.setContentHeight('', isExpand);
    };
    RichTextEditor.prototype.scrollHandler = function (e) {
        this.notify(events.scroll, { args: e });
    };
    RichTextEditor.prototype.contentScrollHandler = function (e) {
        this.notify(events.contentscroll, { args: e });
    };
    RichTextEditor.prototype.focusHandler = function (e) {
        if ((!this.isRTE || this.isFocusOut)) {
            this.isRTE = this.isFocusOut ? false : true;
            this.isFocusOut = false;
            addClass([this.element], [classes.CLS_FOCUS]);
            if (this.editorMode === 'HTML') {
                this.cloneValue = (this.inputElement.innerHTML === '<p><br></p>') ? null : this.enableHtmlEncode ?
                    this.encode(decode(this.inputElement.innerHTML)) : this.inputElement.innerHTML;
            }
            else {
                this.cloneValue = this.inputElement.value === '' ? null :
                    this.inputElement.value;
            }
            var active = document.activeElement;
            if (active === this.element || active === this.getToolbarElement() || active === this.contentModule.getEditPanel()
                || ((this.iframeSettings.enable && active === this.contentModule.getPanel()) &&
                    e.target && !e.target.classList.contains('e-img-inner')
                    && (e.target && e.target.parentElement
                        && !e.target.parentElement.classList.contains('e-img-wrap')))
                || closest(active, '.e-rte-toolbar') === this.getToolbarElement()) {
                this.contentModule.getEditPanel().focus();
                if (!isNOU(this.getToolbarElement())) {
                    this.getToolbarElement().setAttribute('tabindex', '-1');
                    var items = this.getToolbarElement().querySelectorAll('[tabindex="0"]');
                    for (var i = 0; i < items.length; i++) {
                        items[i].setAttribute('tabindex', '-1');
                    }
                }
            }
            this.preventDefaultResize(e);
            this.trigger('focus', { event: e, isInteracted: Object.keys(e).length === 0 ? false : true });
            if (!isNOU(this.saveInterval) && this.saveInterval > 0 && !this.autoSaveOnIdle) {
                this.timeInterval = setInterval(this.updateValueOnIdle.bind(this), this.saveInterval);
            }
            EventHandler.add(document, 'mousedown', this.onDocumentClick, this);
        }
        if (!isNOU(this.getToolbarElement())) {
            var toolbarItem = this.getToolbarElement().querySelectorAll('input,select,button,a,[tabindex]');
            for (var i = 0; i < toolbarItem.length; i++) {
                if ((!toolbarItem[i].classList.contains('e-rte-dropdown-btn') &&
                    !toolbarItem[i].classList.contains('e-insert-table-btn')) &&
                    (!toolbarItem[i].hasAttribute('tabindex') ||
                        toolbarItem[i].getAttribute('tabindex') !== '-1')) {
                    toolbarItem[i].setAttribute('tabindex', '-1');
                }
            }
        }
    };
    RichTextEditor.prototype.getUpdatedValue = function () {
        var value;
        if (this.editorMode === 'HTML') {
            value = (this.inputElement.innerHTML === '<p><br></p>') ? null : this.enableHtmlEncode ?
                this.encode(decode(this.inputElement.innerHTML)) : this.inputElement.innerHTML;
        }
        else {
            value = this.inputElement.value === '' ? null :
                this.inputElement.value;
        }
        return value;
    };
    RichTextEditor.prototype.updateValueOnIdle = function () {
        this.setProperties({ value: this.getUpdatedValue() }, true);
        this.valueContainer.value = this.value;
        this.invokeChangeEvent();
    };
    RichTextEditor.prototype.updateIntervalValue = function () {
        clearTimeout(this.idleInterval);
        this.idleInterval = setTimeout(this.updateValueOnIdle.bind(this), 0);
    };
    RichTextEditor.prototype.onDocumentClick = function (e) {
        var target = e.target;
        var rteElement = closest(target, '.' + classes.CLS_RTE);
        if (!this.element.contains(e.target) && document !== e.target && rteElement !== this.element &&
            !closest(target, '[aria-owns="' + this.getID() + '"]')) {
            this.isBlur = true;
            this.isRTE = false;
        }
        this.notify(events.docClick, { args: e });
    };
    RichTextEditor.prototype.blurHandler = function (e) {
        var trg = e.relatedTarget;
        if (trg) {
            var rteElement = closest(trg, '.' + classes.CLS_RTE);
            if (rteElement && rteElement === this.element) {
                this.isBlur = false;
                if (trg === this.getToolbarElement()) {
                    trg.setAttribute('tabindex', '-1');
                }
            }
            else if (closest(trg, '[aria-owns="' + this.getID() + '"]')) {
                this.isBlur = false;
            }
            else {
                this.isBlur = true;
                trg = null;
            }
        }
        if (this.isBlur && isNOU(trg)) {
            removeClass([this.element], [classes.CLS_FOCUS]);
            this.notify(events.focusChange, {});
            var value = this.getUpdatedValue();
            this.setProperties({ value: value });
            this.notify(events.toolbarRefresh, { args: e, documentNode: document });
            this.invokeChangeEvent();
            this.isFocusOut = true;
            this.isBlur = false;
            dispatchEvent(this.valueContainer, 'focusout');
            this.defaultResize(e);
            this.trigger('blur', { event: e, isInteracted: Object.keys(e).length === 0 ? false : true });
            if (!isNOU(this.timeInterval)) {
                clearInterval(this.timeInterval);
                this.timeInterval = null;
            }
            EventHandler.remove(document, 'mousedown', this.onDocumentClick);
        }
        else {
            this.isRTE = true;
        }
    };
    /**
     * invokeChangeEvent method
     * @hidden

     */
    RichTextEditor.prototype.contentChanged = function () {
        if (this.autoSaveOnIdle) {
            if (!isNOU(this.saveInterval)) {
                clearTimeout(this.timeInterval);
                this.timeInterval = setTimeout(this.updateIntervalValue.bind(this), this.saveInterval);
            }
        }
    };
    /**
     * invokeChangeEvent method
     * @hidden

     */
    RichTextEditor.prototype.invokeChangeEvent = function () {
        var eventArgs = {
            value: this.value
        };
        if (this.value !== this.cloneValue) {
            this.trigger('change', eventArgs);
            this.cloneValue = this.value;
        }
    };
    /**
     * @hidden

     */
    RichTextEditor.prototype.wireScrollElementsEvents = function () {
        this.scrollParentElements = getScrollableParent(this.element);
        for (var _i = 0, _a = this.scrollParentElements; _i < _a.length; _i++) {
            var element = _a[_i];
            EventHandler.add(element, 'scroll', this.scrollHandler, this);
        }
        if (!this.iframeSettings.enable) {
            EventHandler.add(this.contentModule.getPanel(), 'scroll', this.contentScrollHandler, this);
        }
    };
    RichTextEditor.prototype.wireContextEvent = function () {
        if (this.quickToolbarSettings.showOnRightClick) {
            EventHandler.add(this.inputElement, 'contextmenu', this.contextHandler, this);
            if (Browser.isDevice) {
                this.touchModule = new EJ2Touch(this.inputElement, { tapHold: this.touchHandler.bind(this), tapHoldThreshold: 500 });
            }
        }
    };
    RichTextEditor.prototype.unWireContextEvent = function () {
        EventHandler.remove(this.inputElement, 'contextmenu', this.contextHandler);
        if (Browser.isDevice && this.touchModule) {
            this.touchModule.destroy();
        }
    };
    /**
     * @hidden

     */
    RichTextEditor.prototype.unWireScrollElementsEvents = function () {
        this.scrollParentElements = getScrollableParent(this.element);
        for (var _i = 0, _a = this.scrollParentElements; _i < _a.length; _i++) {
            var element = _a[_i];
            EventHandler.remove(element, 'scroll', this.scrollHandler);
        }
        if (!this.iframeSettings.enable) {
            EventHandler.remove(this.contentModule.getPanel(), 'scroll', this.contentScrollHandler);
        }
    };
    RichTextEditor.prototype.touchHandler = function (e) {
        this.notifyMouseUp(e.originalEvent);
        this.triggerEditArea(e.originalEvent);
    };
    RichTextEditor.prototype.contextHandler = function (e) {
        var closestElem = closest(e.target, 'a, table, img');
        if (this.inlineMode.onSelection === false || (!isNOU(closestElem) && this.inputElement.contains(closestElem)
            && (closestElem.tagName === 'IMG' || closestElem.tagName === 'TABLE' || closestElem.tagName === 'A'))) {
            e.preventDefault();
        }
    };
    RichTextEditor.prototype.resetHandler = function () {
        var defaultValue = this.valueContainer.defaultValue.trim();
        this.setProperties({ value: defaultValue === '' ? null : (this.isBlazor() ? this.defaultResetValue : defaultValue) });
    };
    /**
     * @hidden

     */
    RichTextEditor.prototype.autoResize = function () {
        var _this = this;
        if (this.height === 'auto') {
            if (this.editorMode === 'Markdown') {
                setTimeout(function () { _this.setAutoHeight(_this.inputElement); }, 0);
            }
            else if (this.iframeSettings.enable) {
                var iframeElement_1 = this.element.querySelector('#' + this.getID() + '_rte-view');
                setTimeout(function () { _this.setAutoHeight(iframeElement_1); }, 100);
                this.inputElement.style.overflow = 'hidden';
            }
        }
        else {
            this.inputElement.style.overflow = null;
        }
    };
    RichTextEditor.prototype.setAutoHeight = function (element) {
        if (!isNOU(element)) {
            element.style.height = '';
            element.style.height = this.inputElement.scrollHeight + 'px';
            element.style.overflow = 'hidden';
        }
    };
    RichTextEditor.prototype.wireEvents = function () {
        this.element.addEventListener('focusin', this.onFocusHandler, true);
        this.element.addEventListener('focusout', this.onBlurHandler, true);
        this.on(events.contentChanged, this.contentChanged, this);
        if (this.readonly && this.enabled) {
            return;
        }
        this.bindEvents();
    };
    RichTextEditor.prototype.restrict = function (e) {
        if (this.maxLength >= 0) {
            var element = this.editorMode === 'Markdown' ? this.contentModule.getText() :
                e.currentTarget.textContent.trim();
            var array = [8, 16, 17, 37, 38, 39, 40, 46, 65];
            var arrayKey = void 0;
            for (var i = 0; i <= array.length - 1; i++) {
                if (e.which === array[i]) {
                    if (e.ctrlKey && e.which === 65) {
                        return;
                    }
                    else if (e.which !== 65) {
                        arrayKey = array[i];
                        return;
                    }
                }
            }
            if ((element.length >= this.maxLength && this.maxLength !== -1) && e.which !== arrayKey) {
                e.preventDefault();
            }
        }
    };
    RichTextEditor.prototype.bindEvents = function () {
        this.keyboardModule = new KeyboardEvents(this.inputElement, {
            keyAction: this.keyDown.bind(this), keyConfigs: __assign({}, this.formatter.keyConfig, this.keyConfig), eventName: 'keydown'
        });
        var formElement = closest(this.valueContainer, 'form');
        if (formElement) {
            EventHandler.add(formElement, 'reset', this.resetHandler, this);
        }
        EventHandler.add(this.inputElement, 'keyup', this.keyUp, this);
        EventHandler.add(this.inputElement, 'paste', this.onPaste, this);
        EventHandler.add(this.inputElement, Browser.touchEndEvent, debounce(this.mouseUp, 30), this);
        EventHandler.add(this.inputElement, Browser.touchStartEvent, this.mouseDownHandler, this);
        this.wireContextEvent();
        this.formatter.editorManager.observer.on(CONSTANT.KEY_DOWN_HANDLER, this.editorKeyDown, this);
        this.element.ownerDocument.defaultView.addEventListener('resize', this.onResizeHandler, true);
        if (this.iframeSettings.enable) {
            EventHandler.add(this.inputElement, 'focusin', this.focusHandler, this);
            EventHandler.add(this.inputElement, 'focusout', this.blurHandler, this);
            EventHandler.add(this.inputElement.ownerDocument, 'scroll', this.contentScrollHandler, this);
            EventHandler.add(this.inputElement.ownerDocument, Browser.touchStartEvent, this.onIframeMouseDown, this);
        }
        this.wireScrollElementsEvents();
    };
    RichTextEditor.prototype.onIframeMouseDown = function (e) {
        this.isBlur = false;
        this.notify(events.iframeMouseDown, e);
    };
    RichTextEditor.prototype.editorKeyDown = function (e) {
        switch (e.event.action) {
            case 'copy':
                this.onCopy();
                break;
            case 'cut':
                this.onCut();
                break;
        }
        if (e.callBack && (e.event.action === 'copy' || e.event.action === 'cut' || e.event.action === 'delete')) {
            e.callBack({
                requestType: e.event.action,
                editorMode: 'HTML',
                event: e.event
            });
        }
    };
    RichTextEditor.prototype.unWireEvents = function () {
        this.element.removeEventListener('focusin', this.onFocusHandler, true);
        this.element.removeEventListener('focusout', this.onBlurHandler, true);
        this.off(events.contentChanged, this.contentChanged);
        if (this.readonly && this.enabled) {
            return;
        }
        this.unbindEvents();
    };
    RichTextEditor.prototype.unbindEvents = function () {
        if (this.keyboardModule) {
            this.keyboardModule.destroy();
        }
        var formElement = closest(this.valueContainer, 'form');
        if (formElement) {
            EventHandler.remove(formElement, 'reset', this.resetHandler);
        }
        EventHandler.remove(this.inputElement, 'keyup', this.keyUp);
        EventHandler.remove(this.inputElement, 'paste', this.onPaste);
        EventHandler.remove(this.inputElement, Browser.touchEndEvent, debounce(this.mouseUp, 30));
        EventHandler.remove(this.inputElement, Browser.touchStartEvent, this.mouseDownHandler);
        this.unWireContextEvent();
        if (this.formatter) {
            this.formatter.editorManager.observer.off(CONSTANT.KEY_DOWN_HANDLER, this.editorKeyDown);
        }
        this.element.ownerDocument.defaultView.removeEventListener('resize', this.onResizeHandler, true);
        if (this.iframeSettings.enable) {
            EventHandler.remove(this.inputElement, 'focusin', this.focusHandler);
            EventHandler.remove(this.inputElement, 'focusout', this.blurHandler);
            EventHandler.remove(this.inputElement.ownerDocument, 'scroll', this.contentScrollHandler);
            EventHandler.remove(this.inputElement.ownerDocument, Browser.touchStartEvent, this.onIframeMouseDown);
        }
        this.unWireScrollElementsEvents();
    };
    __decorate([
        Complex({}, ToolbarSettings)
    ], RichTextEditor.prototype, "toolbarSettings", void 0);
    __decorate([
        Complex({}, QuickToolbarSettings)
    ], RichTextEditor.prototype, "quickToolbarSettings", void 0);
    __decorate([
        Complex({}, PasteCleanupSettings)
    ], RichTextEditor.prototype, "pasteCleanupSettings", void 0);
    __decorate([
        Complex({}, IFrameSettings)
    ], RichTextEditor.prototype, "iframeSettings", void 0);
    __decorate([
        Complex({}, ImageSettings)
    ], RichTextEditor.prototype, "insertImageSettings", void 0);
    __decorate([
        Complex({}, TableSettings)
    ], RichTextEditor.prototype, "tableSettings", void 0);
    __decorate([
        Property(0)
    ], RichTextEditor.prototype, "floatingToolbarOffset", void 0);
    __decorate([
        Complex({}, InlineMode)
    ], RichTextEditor.prototype, "inlineMode", void 0);
    __decorate([
        Property('100%')
    ], RichTextEditor.prototype, "width", void 0);
    __decorate([
        Property(false)
    ], RichTextEditor.prototype, "enablePersistence", void 0);
    __decorate([
        Property(false)
    ], RichTextEditor.prototype, "enableResize", void 0);
    __decorate([
        Property({})
    ], RichTextEditor.prototype, "htmlAttributes", void 0);
    __decorate([
        Property(null)
    ], RichTextEditor.prototype, "placeholder", void 0);
    __decorate([
        Property(false)
    ], RichTextEditor.prototype, "autoSaveOnIdle", void 0);
    __decorate([
        Property(false)
    ], RichTextEditor.prototype, "readonly", void 0);
    __decorate([
        Property(true)
    ], RichTextEditor.prototype, "enabled", void 0);
    __decorate([
        Property(true)
    ], RichTextEditor.prototype, "enableHtmlSanitizer", void 0);
    __decorate([
        Property(false)
    ], RichTextEditor.prototype, "enableHtmlEncode", void 0);
    __decorate([
        Property(false)
    ], RichTextEditor.prototype, "enableXhtml", void 0);
    __decorate([
        Property('auto')
    ], RichTextEditor.prototype, "height", void 0);
    __decorate([
        Property(null)
    ], RichTextEditor.prototype, "cssClass", void 0);
    __decorate([
        Property(null)
    ], RichTextEditor.prototype, "value", void 0);
    __decorate([
        Property(30)
    ], RichTextEditor.prototype, "undoRedoSteps", void 0);
    __decorate([
        Property(300)
    ], RichTextEditor.prototype, "undoRedoTimer", void 0);
    __decorate([
        Property('HTML')
    ], RichTextEditor.prototype, "editorMode", void 0);
    __decorate([
        Property(null)
    ], RichTextEditor.prototype, "keyConfig", void 0);
    __decorate([
        Property(false)
    ], RichTextEditor.prototype, "showCharCount", void 0);
    __decorate([
        Property(false)
    ], RichTextEditor.prototype, "enableTabKey", void 0);
    __decorate([
        Property(false)
    ], RichTextEditor.prototype, "enableAutoUrl", void 0);
    __decorate([
        Property(-1)
    ], RichTextEditor.prototype, "maxLength", void 0);
    __decorate([
        Complex({}, Format)
    ], RichTextEditor.prototype, "format", void 0);
    __decorate([
        Complex({}, FontFamily)
    ], RichTextEditor.prototype, "fontFamily", void 0);
    __decorate([
        Complex({}, FontSize)
    ], RichTextEditor.prototype, "fontSize", void 0);
    __decorate([
        Complex({}, FontColor)
    ], RichTextEditor.prototype, "fontColor", void 0);
    __decorate([
        Complex({}, BackgroundColor)
    ], RichTextEditor.prototype, "backgroundColor", void 0);
    __decorate([
        Property(null)
    ], RichTextEditor.prototype, "valueTemplate", void 0);
    __decorate([
        Property(10000)
    ], RichTextEditor.prototype, "saveInterval", void 0);
    __decorate([
        Event()
    ], RichTextEditor.prototype, "actionBegin", void 0);
    __decorate([
        Event()
    ], RichTextEditor.prototype, "actionComplete", void 0);
    __decorate([
        Event()
    ], RichTextEditor.prototype, "beforeDialogOpen", void 0);
    __decorate([
        Event()
    ], RichTextEditor.prototype, "dialogOpen", void 0);
    __decorate([
        Event()
    ], RichTextEditor.prototype, "beforeDialogClose", void 0);
    __decorate([
        Event()
    ], RichTextEditor.prototype, "dialogClose", void 0);
    __decorate([
        Event()
    ], RichTextEditor.prototype, "beforeQuickToolbarOpen", void 0);
    __decorate([
        Event()
    ], RichTextEditor.prototype, "quickToolbarOpen", void 0);
    __decorate([
        Event()
    ], RichTextEditor.prototype, "quickToolbarClose", void 0);
    __decorate([
        Event()
    ], RichTextEditor.prototype, "toolbarStatusUpdate", void 0);
    __decorate([
        Event()
    ], RichTextEditor.prototype, "imageSelected", void 0);
    __decorate([
        Event()
    ], RichTextEditor.prototype, "beforeImageUpload", void 0);
    __decorate([
        Event()
    ], RichTextEditor.prototype, "imageUploading", void 0);
    __decorate([
        Event()
    ], RichTextEditor.prototype, "imageUploadSuccess", void 0);
    __decorate([
        Event()
    ], RichTextEditor.prototype, "imageUploadFailed", void 0);
    __decorate([
        Event()
    ], RichTextEditor.prototype, "imageRemoving", void 0);
    __decorate([
        Event()
    ], RichTextEditor.prototype, "afterImageDelete", void 0);
    __decorate([
        Event()
    ], RichTextEditor.prototype, "created", void 0);
    __decorate([
        Event()
    ], RichTextEditor.prototype, "destroyed", void 0);
    __decorate([
        Event()
    ], RichTextEditor.prototype, "beforeSanitizeHtml", void 0);
    __decorate([
        Event()
    ], RichTextEditor.prototype, "blur", void 0);
    __decorate([
        Event()
    ], RichTextEditor.prototype, "toolbarClick", void 0);
    __decorate([
        Event()
    ], RichTextEditor.prototype, "focus", void 0);
    __decorate([
        Event()
    ], RichTextEditor.prototype, "change", void 0);
    __decorate([
        Event()
    ], RichTextEditor.prototype, "resizing", void 0);
    __decorate([
        Event()
    ], RichTextEditor.prototype, "resizeStart", void 0);
    __decorate([
        Event()
    ], RichTextEditor.prototype, "resizeStop", void 0);
    __decorate([
        Property(null)
    ], RichTextEditor.prototype, "formatter", void 0);
    RichTextEditor = __decorate([
        NotifyPropertyChanges
    ], RichTextEditor);
    return RichTextEditor;
}(Component));
export { RichTextEditor };

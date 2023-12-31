import { addClass, Browser, removeClass, EventHandler, formatUnit, isNullOrUndefined } from '@syncfusion/ej2-base';
import { getInstance, closest, selectAll, detach } from '@syncfusion/ej2-base';
import { Toolbar } from '@syncfusion/ej2-navigations';
import { DropDownButton } from '@syncfusion/ej2-splitbuttons';
import { Popup } from '@syncfusion/ej2-popups';
import * as classes from '../base/classes';
import * as events from '../base/constant';
import { CLS_TOOLBAR, CLS_DROPDOWN_BTN, CLS_RTE_ELEMENTS, CLS_TB_BTN, CLS_INLINE_DROPDOWN, CLS_COLOR_CONTENT, CLS_FONT_COLOR_DROPDOWN, CLS_BACKGROUND_COLOR_DROPDOWN, CLS_COLOR_PALETTE, CLS_FONT_COLOR_PICKER, CLS_BACKGROUND_COLOR_PICKER, CLS_CUSTOM_TILE, CLS_NOCOLOR_ITEM } from '../base/classes';
import { ColorPicker } from '@syncfusion/ej2-inputs';
import { hasClass } from '../base/util';
/**
 * `Toolbar renderer` module is used to render toolbar in RichTextEditor.
 * @hidden

 */
var ToolbarRenderer = /** @class */ (function () {
    /**
     * Constructor for toolbar renderer module
     */
    function ToolbarRenderer(parent) {
        this.parent = parent;
        this.wireEvent();
    }
    ToolbarRenderer.prototype.wireEvent = function () {
        this.parent.on(events.destroy, this.unWireEvent, this);
    };
    ToolbarRenderer.prototype.unWireEvent = function () {
        this.parent.off(events.destroy, this.unWireEvent);
        if (this.popupOverlay) {
            EventHandler.remove(this.popupOverlay, 'click touchmove', this.onPopupOverlay);
        }
        this.removePopupContainer();
    };
    ToolbarRenderer.prototype.toolbarBeforeCreate = function (e) {
        if (this.mode === 'Extended') {
            e.enableCollision = false;
        }
    };
    ToolbarRenderer.prototype.toolbarCreated = function () {
        this.parent.notify(events.toolbarCreated, this);
    };
    ToolbarRenderer.prototype.toolbarClicked = function (args) {
        if (!this.parent.enabled) {
            return;
        }
        if (!this.parent.readonly) {
            this.parent.notify(events.toolbarClick, args);
        }
        this.parent.trigger('toolbarClick', args);
    };
    ToolbarRenderer.prototype.dropDownSelected = function (args) {
        this.parent.notify(events.dropDownSelect, args);
        this.onPopupOverlay();
    };
    ToolbarRenderer.prototype.beforeDropDownItemRender = function (args) {
        if (this.parent.readonly || !this.parent.enabled) {
            return;
        }
        this.parent.notify(events.beforeDropDownItemRender, args);
    };
    ToolbarRenderer.prototype.dropDownOpen = function (args) {
        if (Browser.isDevice && !args.element.parentElement.classList.contains(classes.CLS_QUICK_DROPDOWN)) {
            this.popupModal(args.element.parentElement);
        }
        this.parent.notify(events.selectionSave, args);
    };
    ToolbarRenderer.prototype.dropDownClose = function (args) {
        this.removePopupContainer();
        this.parent.notify(events.selectionRestore, args);
    };
    ToolbarRenderer.prototype.removePopupContainer = function () {
        if (Browser.isDevice && !isNullOrUndefined(this.popupContainer)) {
            var popupEle = this.popupContainer.querySelector('.e-dropdown-popup.e-tbar-btn.e-control');
            if (popupEle) {
                this.popupContainer.parentNode.insertBefore(popupEle, this.popupContainer.nextSibling);
                popupEle.style.removeProperty('position');
                removeClass([popupEle], 'e-popup-modal');
            }
            detach(this.popupContainer);
            this.popupContainer = undefined;
        }
    };
    /**
     * renderToolbar method
     * @hidden

     */
    ToolbarRenderer.prototype.renderToolbar = function (args) {
        this.setPanel(args.target);
        this.renderPanel();
        this.mode = args.overflowMode;
        args.rteToolbarObj.toolbarObj = new Toolbar({
            items: args.items,
            width: '100%',
            overflowMode: args.overflowMode,
            beforeCreate: this.toolbarBeforeCreate.bind(this),
            created: this.toolbarCreated.bind(this),
            clicked: this.toolbarClicked.bind(this),
            enablePersistence: args.enablePersistence,
            enableRtl: args.enableRtl
        });
        args.rteToolbarObj.toolbarObj.isStringTemplate = true;
        args.rteToolbarObj.toolbarObj.createElement = this.parent.createElement;
        args.rteToolbarObj.toolbarObj.appendTo(args.target);
    };
    /**
     * renderDropDownButton method
     * @hidden

     */
    ToolbarRenderer.prototype.renderDropDownButton = function (args) {
        var _this = this;
        var css;
        args.element.classList.add(CLS_DROPDOWN_BTN);
        css = args.cssClass + ' ' + CLS_RTE_ELEMENTS + ' ' + CLS_TB_BTN;
        if (this.parent.inlineMode.enable && Browser.isDevice) {
            css = css + ' ' + CLS_INLINE_DROPDOWN;
        }
        var proxy = this;
        var dropDown = new DropDownButton({
            items: args.items,
            iconCss: args.iconCss,
            cssClass: css,
            content: args.content,
            enablePersistence: this.parent.enablePersistence,
            enableRtl: this.parent.enableRtl,
            select: this.dropDownSelected.bind(this),
            beforeOpen: function (args) {
                if (proxy.parent.readonly || !proxy.parent.enabled) {
                    args.cancel = true;
                    return;
                }
                for (var index = 0; index < args.element.childNodes.length; index++) {
                    var divNode = _this.parent.createElement('div');
                    divNode.innerHTML = dropDown.content.trim();
                    if (divNode.textContent.trim() !== ''
                        && args.element.childNodes[index].textContent.trim() === divNode.textContent.trim()) {
                        if (!args.element.childNodes[index].classList.contains('e-active')) {
                            addClass([args.element.childNodes[index]], 'e-active');
                        }
                    }
                    else {
                        removeClass([args.element.childNodes[index]], 'e-active');
                    }
                }
                proxy.parent.notify(events.beforeDropDownOpen, args);
            },
            close: this.dropDownClose.bind(this),
            open: this.dropDownOpen.bind(this),
            beforeItemRender: this.beforeDropDownItemRender.bind(this)
        });
        dropDown.isStringTemplate = true;
        dropDown.createElement = proxy.parent.createElement;
        dropDown.appendTo(args.element);
        args.element.tabIndex = -1;
        var popupElement = document.getElementById(dropDown.element.id + '-popup');
        popupElement.setAttribute('aria-owns', this.parent.getID());
        return dropDown;
    };
    ToolbarRenderer.prototype.onPopupOverlay = function (args) {
        if (!isNullOrUndefined(this.popupOverlay)) {
            closest(this.popupOverlay, '.e-popup-container').style.display = 'none';
            this.popupOverlay.style.display = 'none';
            removeClass([this.popupOverlay], 'e-popup-overlay');
        }
    };
    ToolbarRenderer.prototype.setIsModel = function (element) {
        if (!closest(element, '.e-popup-container')) {
            this.popupContainer = this.parent.createElement('div', {
                className: 'e-rte-modal-popup e-popup-container e-center'
            });
            element.parentNode.insertBefore(this.popupContainer, element);
            this.popupContainer.appendChild(element);
            this.popupContainer.style.zIndex = element.style.zIndex;
            this.popupContainer.style.display = 'flex';
            element.style.position = 'relative';
            addClass([element], 'e-popup-modal');
            this.popupOverlay = this.parent.createElement('div', { className: 'e-popup-overlay' });
            this.popupOverlay.style.zIndex = (parseInt(element.style.zIndex, null) - 1).toString();
            this.popupOverlay.style.display = 'block';
            this.popupContainer.appendChild(this.popupOverlay);
            EventHandler.add(this.popupOverlay, 'click touchmove', this.onPopupOverlay, this);
        }
        else {
            element.parentElement.style.display = 'flex';
            this.popupOverlay = element.nextElementSibling;
            this.popupOverlay.style.display = 'block';
            addClass([this.popupOverlay], 'e-popup-overlay');
        }
    };
    ToolbarRenderer.prototype.paletteSelection = function (dropDownArgs, currentElement) {
        var ele = dropDownArgs.element.querySelector('.e-control.e-colorpicker');
        var colorbox = [].slice.call(selectAll('.e-tile', ele.parentElement));
        removeClass(colorbox, 'e-selected');
        var style = currentElement.querySelector('.' + CLS_RTE_ELEMENTS).style.borderBottomColor;
        (colorbox.filter(function (colorbox) {
            if (colorbox.style.backgroundColor === style) {
                addClass([colorbox], 'e-selected');
            }
        }));
    };
    /**
     * renderColorPickerDropDown method
     * @hidden

     */
    ToolbarRenderer.prototype.renderColorPickerDropDown = function (args, item, colorPicker) {
        var _this = this;
        var proxy = this;
        var css = CLS_RTE_ELEMENTS + ' ' + CLS_TB_BTN + ((this.parent.inlineMode) ? (' ' + CLS_INLINE_DROPDOWN) : '');
        css += (' ' + ((item === 'backgroundcolor') ? CLS_BACKGROUND_COLOR_DROPDOWN : CLS_FONT_COLOR_DROPDOWN));
        var content = proxy.parent.createElement('span', { className: CLS_COLOR_CONTENT });
        var inlineEle = proxy.parent.createElement('span', { className: args.cssClass });
        var range;
        inlineEle.style.borderBottomColor = (item === 'backgroundcolor') ?
            proxy.parent.backgroundColor.default : proxy.parent.fontColor.default;
        content.appendChild(inlineEle);
        var dropDown = new DropDownButton({
            target: colorPicker.element.parentElement, cssClass: css,
            enablePersistence: this.parent.enablePersistence, enableRtl: this.parent.enableRtl,
            beforeOpen: function (dropDownArgs) {
                if (proxy.parent.readonly || !proxy.parent.enabled) {
                    dropDownArgs.cancel = true;
                    return;
                }
                var element = (dropDownArgs.event) ? dropDownArgs.event.target : null;
                proxy.currentElement = dropDown.element;
                proxy.currentDropdown = dropDown;
                proxy.paletteSelection(dropDownArgs, proxy.currentElement);
                if (dropDownArgs.event && dropDownArgs.event.type === 'click' && (element.classList.contains(CLS_COLOR_CONTENT)
                    || element.parentElement.classList.contains(CLS_COLOR_CONTENT))) {
                    dropDownArgs.cancel = true;
                    var colorpickerValue = element.classList.contains(CLS_RTE_ELEMENTS) ? element.style.borderBottomColor :
                        element.querySelector('.' + CLS_RTE_ELEMENTS).style.borderBottomColor;
                    proxy.parent.notify(events.selectionRestore, {});
                    range = proxy.parent.formatter.editorManager.nodeSelection.getRange(proxy.parent.contentModule.getDocument());
                    var parentNode = range.startContainer.parentNode;
                    if ((range.startContainer.nodeName === 'TD' || range.startContainer.nodeName === 'TH' ||
                        (closest(range.startContainer.parentNode, 'td,th')) ||
                        (proxy.parent.iframeSettings.enable && !hasClass(parentNode.ownerDocument.querySelector('body'), 'e-lib')))
                        && range.collapsed && args.subCommand === 'BackgroundColor') {
                        proxy.parent.notify(events.tableColorPickerChanged, { item: { command: args.command, subCommand: args.subCommand,
                                value: colorpickerValue }
                        });
                    }
                    else {
                        proxy.parent.notify(events.colorPickerChanged, { item: { command: args.command, subCommand: args.subCommand,
                                value: colorpickerValue }
                        });
                    }
                    return;
                }
                else {
                    var ele = dropDownArgs.element.querySelector('.e-control.e-colorpicker');
                    var inst = getInstance(ele, ColorPicker);
                    inst.showButtons = (dropDownArgs.element.querySelector('.e-color-palette')) ? false : true;
                    inst.dataBind();
                }
                dropDownArgs.element.onclick = function (args) {
                    if (args.target.classList.contains('e-cancel')) {
                        dropDown.toggle();
                    }
                };
            },
            open: function (dropDownArgs) {
                _this.setColorPickerContentWidth(colorPicker);
                var focusEle;
                var ele = dropDownArgs.element.querySelector('.e-control.e-colorpicker');
                if (dropDownArgs.element.querySelector('.e-color-palette')) {
                    focusEle = ele.parentElement.querySelector('.e-palette');
                }
                else {
                    focusEle = ele.parentElement.querySelector('e-handler');
                }
                if (focusEle) {
                    focusEle.focus();
                }
                if (Browser.isDevice) {
                    _this.popupModal(dropDownArgs.element.parentElement);
                }
                _this.pickerRefresh(dropDownArgs);
            },
            beforeClose: function (dropDownArgs) {
                var element = (dropDownArgs.event) ? dropDownArgs.event.target : null;
                if (dropDownArgs.event && dropDownArgs.event.type === 'click' && (element.classList.contains(CLS_COLOR_CONTENT)
                    || element.parentElement.classList.contains(CLS_COLOR_CONTENT))) {
                    var colorpickerValue = element.classList.contains(CLS_RTE_ELEMENTS) ? element.style.borderBottomColor :
                        element.querySelector('.' + CLS_RTE_ELEMENTS).style.borderBottomColor;
                    range = proxy.parent.formatter.editorManager.nodeSelection.getRange(proxy.parent.contentModule.getDocument());
                    if ((range.startContainer.nodeName === 'TD' || range.startContainer.nodeName === 'TH' ||
                        closest(range.startContainer.parentNode, 'td,th')) && range.collapsed) {
                        proxy.parent.notify(events.tableColorPickerChanged, { item: { command: args.command, subCommand: args.subCommand,
                                value: colorpickerValue }
                        });
                    }
                    else {
                        proxy.parent.notify(events.colorPickerChanged, { item: { command: args.command, subCommand: args.subCommand,
                                value: colorpickerValue }
                        });
                    }
                    return;
                }
            },
            close: function (dropDownArgs) {
                proxy.parent.notify(events.selectionRestore, {});
                var dropElement = closest(dropDownArgs.element.parentElement, '.e-popup-container');
                if (dropElement) {
                    dropElement.style.display = 'none';
                    dropElement.lastElementChild.style.display = 'none';
                    removeClass([dropElement.lastElementChild], 'e-popup-overlay');
                }
                if (Browser.isDevice && !isNullOrUndefined(dropElement)) {
                    var popupEle = dropElement.querySelector('.e-dropdown-popup.e-tbar-btn.e-control');
                    if (popupEle) {
                        dropElement.parentNode.insertBefore(popupEle, dropElement.nextSibling);
                        popupEle.style.removeProperty('position');
                        removeClass([popupEle], 'e-popup-modal');
                    }
                    detach(dropElement);
                    proxy.popupContainer = undefined;
                }
            }
        });
        dropDown.isStringTemplate = true;
        dropDown.createElement = proxy.parent.createElement;
        dropDown.appendTo(args.element);
        var popupElement = document.getElementById(dropDown.element.id + '-popup');
        popupElement.setAttribute('aria-owns', this.parent.getID());
        dropDown.element.insertBefore(content, dropDown.element.querySelector('.e-caret'));
        args.element.tabIndex = -1;
        dropDown.element.removeAttribute('type');
        dropDown.element.onmousedown = function () { proxy.parent.notify(events.selectionSave, {}); };
        dropDown.element.onkeydown = function () { proxy.parent.notify(events.selectionSave, {}); };
        return dropDown;
    };
    ToolbarRenderer.prototype.pickerRefresh = function (dropDownArgs) {
        if (this.parent.backgroundColor.mode === 'Picker') {
            var popupElem = dropDownArgs.element.parentElement;
            popupElem.style.width = (popupElem.offsetWidth + 5).toString() + 'px';
            getInstance(popupElem, Popup).refreshPosition(popupElem);
            popupElem.style.width = (popupElem.offsetWidth - 5).toString() + 'px';
        }
    };
    ToolbarRenderer.prototype.popupModal = function (element) {
        var popupInst = getInstance(element, Popup);
        popupInst.relateTo = document.body;
        popupInst.position = { X: 0, Y: 0 };
        popupInst.targetType = 'container';
        popupInst.collision = { X: 'fit', Y: 'fit' };
        popupInst.offsetY = 4;
        popupInst.dataBind();
        this.setIsModel(element);
    };
    ToolbarRenderer.prototype.setColorPickerContentWidth = function (colorPicker) {
        var colorPickerContent = colorPicker.element.nextSibling;
        if (colorPickerContent.style.width === '0px') {
            colorPickerContent.style.width = '';
            var borderWidth = parseInt(getComputedStyle(colorPickerContent).borderBottomWidth, 10);
            colorPickerContent.style.width = formatUnit(colorPickerContent.children[0].offsetWidth
                + borderWidth + borderWidth);
        }
    };
    /**
     * renderColorPicker method
     * @hidden

     */
    ToolbarRenderer.prototype.renderColorPicker = function (args, item) {
        var proxy = this;
        var value;
        var colorPicker = new ColorPicker({
            enablePersistence: this.parent.enablePersistence,
            enableRtl: this.parent.enableRtl,
            inline: true,
            created: function () {
                var value = (item === 'backgroundcolor') ? proxy.parent.backgroundColor.default : proxy.parent.fontColor.default;
                colorPicker.setProperties({ value: value });
            },
            mode: ((item === 'backgroundcolor') ? proxy.parent.backgroundColor.mode : proxy.parent.fontColor.mode),
            modeSwitcher: ((item === 'backgroundcolor') ? proxy.parent.backgroundColor.modeSwitcher : proxy.parent.fontColor.modeSwitcher),
            beforeTileRender: function (args) {
                args.element.classList.add(CLS_COLOR_PALETTE);
                args.element.classList.add(CLS_CUSTOM_TILE);
                if (args.value === '') {
                    args.element.classList.add(CLS_NOCOLOR_ITEM);
                }
            },
            change: function (colorPickerArgs) {
                var colorpickerValue = colorPickerArgs.currentValue.rgba;
                colorPickerArgs.item = {
                    command: args.command,
                    subCommand: args.subCommand,
                    value: colorpickerValue
                };
                proxy.parent.notify(events.selectionRestore, {});
                proxy.currentElement.querySelector('.' + CLS_RTE_ELEMENTS).style.borderBottomColor = colorpickerValue;
                var range = proxy.parent.formatter.editorManager.nodeSelection.getRange(proxy.parent.contentModule.getDocument());
                if ((range.startContainer.nodeName === 'TD' || range.startContainer.nodeName === 'TH' ||
                    closest(range.startContainer.parentNode, 'td,th')) && range.collapsed && args.subCommand === 'BackgroundColor') {
                    proxy.parent.notify(events.tableColorPickerChanged, colorPickerArgs);
                }
                else {
                    proxy.parent.notify(events.colorPickerChanged, colorPickerArgs);
                }
                proxy.currentDropdown.toggle();
            },
            beforeModeSwitch: function (args) {
                value = colorPicker.value;
                if (value === '') {
                    colorPicker.setProperties({ value: ((args.mode === 'Picker') ? '#008000ff' : '') }, true);
                }
                colorPicker.showButtons = args.mode === 'Palette' ? false : true;
            }
        });
        colorPicker.isStringTemplate = true;
        colorPicker.columns = (item === 'backgroundcolor') ? this.parent.backgroundColor.columns : this.parent.fontColor.columns;
        colorPicker.presetColors = (item === 'backgroundcolor') ? this.parent.backgroundColor.colorCode :
            this.parent.fontColor.colorCode;
        colorPicker.cssClass = (item === 'backgroundcolor') ? CLS_BACKGROUND_COLOR_PICKER : CLS_FONT_COLOR_PICKER;
        colorPicker.createElement = this.parent.createElement;
        colorPicker.appendTo(document.body.querySelector(args.target));
        return colorPicker;
    };
    /**
     * The function is used to render Rich Text Editor toolbar
     * @hidden

     */
    ToolbarRenderer.prototype.renderPanel = function () {
        this.getPanel().classList.add(CLS_TOOLBAR);
    };
    /**
     * Get the toolbar element of RichTextEditor
     * @return {Element}
     * @hidden

     */
    ToolbarRenderer.prototype.getPanel = function () {
        return this.toolbarPanel;
    };
    /**
     * Set the toolbar element of RichTextEditor
     * @param  {Element} panel
     * @hidden

     */
    ToolbarRenderer.prototype.setPanel = function (panel) {
        this.toolbarPanel = panel;
    };
    return ToolbarRenderer;
}());
export { ToolbarRenderer };

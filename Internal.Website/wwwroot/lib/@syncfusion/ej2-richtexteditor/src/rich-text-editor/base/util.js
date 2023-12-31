/**
 * Defines util methods used by Rich Text Editor.
 */
import { isNullOrUndefined as isNOU, addClass, removeClass, selectAll, createElement, Browser, detach } from '@syncfusion/ej2-base';
import * as classes from '../base/classes';
import * as model from '../models/items';
import { toolsLocale } from '../models/default-locale';
import { SanitizeHtmlHelper, extend, isNullOrUndefined } from '@syncfusion/ej2-base';
var undoRedoItems = ['Undo', 'Redo'];
var inlineNode = ['a', 'abbr', 'acronym', 'audio', 'b', 'bdi', 'bdo', 'big', 'br', 'button',
    'canvas', 'cite', 'code', 'data', 'datalist', 'del', 'dfn', 'em', 'embed', 'font', 'i', 'iframe', 'img', 'input',
    'ins', 'kbd', 'label', 'map', 'mark', 'meter', 'noscript', 'object', 'output', 'picture', 'progress',
    'q', 'ruby', 's', 'samp', 'script', 'select', 'slot', 'small', 'span', 'strong', 'strike', 'sub', 'sup', 'svg',
    'template', 'textarea', 'time', 'u', 'tt', 'var', 'video', 'wbr'];
export function getIndex(val, items) {
    var index = -1;
    items.some(function (item, i) {
        if (typeof item === 'string' && val === item.toLocaleLowerCase()) {
            index = i;
            return true;
        }
        return false;
    });
    return index;
}
export function hasClass(element, className) {
    var hasClass = false;
    if (element.classList.contains(className)) {
        hasClass = true;
    }
    return hasClass;
}
export function getDropDownValue(items, value, type, returnType) {
    var data;
    var result;
    for (var k = 0; k < items.length; k++) {
        if (type === 'value' && items[k].value.toLocaleLowerCase() === value.toLocaleLowerCase()) {
            data = items[k];
            break;
        }
        else if (type === 'text' && items[k].text.toLocaleLowerCase() === value.toLocaleLowerCase()) {
            data = items[k];
            break;
        }
        else if (type === 'subCommand' && items[k].subCommand.toLocaleLowerCase() === value.toLocaleLowerCase()) {
            data = items[k];
            break;
        }
    }
    if (!isNOU(data)) {
        switch (returnType) {
            case 'text':
                result = data.text;
                break;
            case 'value':
                result = data.value;
                break;
            case 'iconCss':
                result = data.iconCss;
                break;
        }
    }
    return result;
}
export function isIDevice() {
    var result = false;
    if (Browser.isDevice && Browser.isIos) {
        result = true;
    }
    return result;
}
export function getFormattedFontSize(value) {
    if (isNOU(value)) {
        return '';
    }
    return value;
}
export function pageYOffset(e, parentElement, isIFrame) {
    var y = 0;
    if (isIFrame) {
        y = window.pageYOffset + parentElement.getBoundingClientRect().top + e.clientY;
    }
    else {
        y = e.pageY;
    }
    return y;
}
export function getTooltipText(item, serviceLocator) {
    var i10n = serviceLocator.getService('rteLocale');
    var itemLocale = toolsLocale[item];
    var tooltipText = i10n.getConstant(itemLocale);
    return tooltipText;
}
export function setToolbarStatus(e, isPopToolbar) {
    var dropDown = e.dropDownModule;
    var data = e.args;
    var keys = Object.keys(e.args);
    for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
        var key = keys_1[_i];
        for (var j = 0; j < e.tbItems.length; j++) {
            var item = e.tbItems[j].subCommand;
            var itemStr = item && item.toLocaleLowerCase();
            if (item && (itemStr === key) || (item === 'UL' && key === 'unorderedlist') || (item === 'OL' && key === 'orderedlist') ||
                (itemStr === 'pre' && key === 'insertcode')) {
                if (typeof data[key] === 'boolean') {
                    if (data[key] === true) {
                        addClass([e.tbElements[j]], [classes.CLS_ACTIVE]);
                    }
                    else {
                        removeClass([e.tbElements[j]], [classes.CLS_ACTIVE]);
                    }
                }
                else if ((typeof data[key] === 'string' || data[key] === null) &&
                    getIndex(key, e.parent.toolbarSettings.items) > -1) {
                    var value = ((data[key]) ? data[key] : '');
                    var result = '';
                    switch (key) {
                        case 'formats':
                            if (isNOU(dropDown.formatDropDown) || isPopToolbar ||
                                (!isNOU(dropDown.formatDropDown) && dropDown.formatDropDown.isDestroyed)) {
                                break;
                            }
                            var formatItems = e.parent.format.types;
                            result = getDropDownValue(formatItems, value, 'subCommand', 'text');
                            var formatContent = isNOU(e.parent.format.default) ? formatItems[0].text :
                                e.parent.format.default;
                            dropDown.formatDropDown.content = ('<span style="display: inline-flex;' +
                                'width:' + e.parent.format.width + '" >' +
                                '<span class="e-rte-dropdown-btn-text">'
                                + (isNOU(result) ? formatContent : result) +
                                '</span></span>');
                            dropDown.formatDropDown.dataBind();
                            break;
                        case 'alignments':
                            if (isNOU(dropDown.alignDropDown) ||
                                (!isNOU(dropDown.alignDropDown) && dropDown.alignDropDown.isDestroyed)) {
                                break;
                            }
                            var alignItems = model.alignmentItems;
                            result = getDropDownValue(alignItems, value, 'subCommand', 'iconCss');
                            dropDown.alignDropDown.iconCss = isNOU(result) ? 'e-icons e-justify-left' : result;
                            dropDown.alignDropDown.dataBind();
                            break;
                        case 'fontname':
                            if (isNOU(dropDown.fontNameDropDown) || isPopToolbar ||
                                (!isNOU(dropDown.fontNameDropDown) && dropDown.fontNameDropDown.isDestroyed)) {
                                break;
                            }
                            var fontNameItems = e.parent.fontFamily.items;
                            result = getDropDownValue(fontNameItems, value, 'value', 'text');
                            var fontNameContent = isNOU(e.parent.fontFamily.default) ? fontNameItems[0].text :
                                e.parent.fontFamily.default;
                            var name_1 = (isNOU(result) ? fontNameContent : result);
                            e.tbElements[j].title = name_1;
                            dropDown.fontNameDropDown.content = ('<span style="display: inline-flex;' +
                                'width:' + e.parent.fontFamily.width + '" >' +
                                '<span class="e-rte-dropdown-btn-text">'
                                + name_1 + '</span></span>');
                            dropDown.fontNameDropDown.dataBind();
                            break;
                        case 'fontsize':
                            if (isNOU(dropDown.fontSizeDropDown) ||
                                (!isNOU(dropDown.fontSizeDropDown) && dropDown.fontSizeDropDown.isDestroyed)) {
                                break;
                            }
                            var fontSizeItems = e.parent.fontSize.items;
                            var fontSizeContent = isNOU(e.parent.fontSize.default) ? fontSizeItems[1].text :
                                e.parent.fontSize.default;
                            result = getDropDownValue(fontSizeItems, (value === '' ? fontSizeContent.replace(/\s/g, '') : value), 'value', 'text');
                            dropDown.fontSizeDropDown.content = ('<span style="display: inline-flex;' +
                                'width:' + e.parent.fontSize.width + '" >' +
                                '<span class="e-rte-dropdown-btn-text">'
                                + getFormattedFontSize(result) + '</span></span>');
                            dropDown.fontSizeDropDown.dataBind();
                            break;
                    }
                }
            }
        }
    }
}
export function getCollection(items) {
    if (typeof items === 'object') {
        return items;
    }
    else {
        return [items];
    }
}
export function getTBarItemsIndex(items, toolbarItems) {
    var itemsIndex = [];
    for (var i = 0; i < items.length; i++) {
        for (var j = 0; j < toolbarItems.length; j++) {
            if (toolbarItems[j].type === 'Separator') {
                continue;
            }
            else {
                if (items[i] === 'OrderedList' && toolbarItems[j].subCommand === 'OL') {
                    itemsIndex.push(j);
                    break;
                }
                else if (items[i] === 'UnorderedList' && toolbarItems[j].subCommand === 'UL') {
                    itemsIndex.push(j);
                    break;
                }
                else if (items[i] === 'InsertCode' && toolbarItems[j].subCommand === 'Pre') {
                    itemsIndex.push(j);
                    break;
                }
                else if (items[i] === toolbarItems[j].subCommand) {
                    itemsIndex.push(j);
                    break;
                }
            }
        }
    }
    return itemsIndex;
}
export function updateUndoRedoStatus(baseToolbar, undoRedoStatus) {
    var i = 0;
    var trgItems = getTBarItemsIndex(getCollection(undoRedoItems), baseToolbar.toolbarObj.items);
    var tbItems = selectAll('.' + classes.CLS_TB_ITEM, baseToolbar.toolbarObj.element);
    var keys = Object.keys(undoRedoStatus);
    for (var _i = 0, keys_2 = keys; _i < keys_2.length; _i++) {
        var key = keys_2[_i];
        var target = tbItems[trgItems[i]];
        if (target) {
            baseToolbar.toolbarObj.enableItems(target, undoRedoStatus[key]);
        }
        i++;
    }
}
/**
 * To dispatch the event manually
 * @hidden

 */
export function dispatchEvent(element, type) {
    var evt = document.createEvent('HTMLEvents');
    evt.initEvent(type, false, true);
    element.dispatchEvent(evt);
}
export function parseHtml(value) {
    var tempNode = createElement('template');
    tempNode.innerHTML = value;
    if (tempNode.content instanceof DocumentFragment) {
        return tempNode.content;
    }
    else {
        return document.createRange().createContextualFragment(value);
    }
}
export function getTextNodesUnder(docElement, node) {
    var nodes = [];
    for (node = node.firstChild; node; node = node.nextSibling) {
        if (node.nodeType === 3) {
            nodes.push(node);
        }
        else {
            nodes = nodes.concat(getTextNodesUnder(docElement, node));
        }
    }
    return nodes;
}
export function toObjectLowerCase(obj) {
    var convertedValue = {};
    var keys = Object.keys(obj);
    for (var i = 0; i < Object.keys(obj).length; i++) {
        convertedValue[keys[i].toLocaleLowerCase()] = obj[keys[i]];
    }
    return convertedValue;
}
export function getEditValue(value, rteObj) {
    var val;
    if (value !== null && value !== '') {
        val = rteObj.enableHtmlEncode ? updateTextNode(decode(value)) : updateTextNode(value);
        rteObj.setProperties({ value: val }, true);
    }
    else {
        val = rteObj.enableHtmlEncode ? '&lt;p&gt;&lt;br/&gt;&lt;/p&gt;' : '<p><br/></p>';
    }
    return val;
}
export function updateTextNode(value) {
    var tempNode = document.createElement('div');
    tempNode.innerHTML = value;
    tempNode.setAttribute('class', 'tempDiv');
    var resultElm = document.createElement('div');
    var childNodes = tempNode.childNodes;
    if (childNodes.length > 0) {
        var isPreviousInlineElem = void 0;
        var previousParent = void 0;
        var paraElm = void 0;
        while (tempNode.firstChild) {
            if ((tempNode.firstChild.nodeName === '#text' &&
                (tempNode.firstChild.textContent.indexOf('\n') < 0 || tempNode.firstChild.textContent.trim() !== '')) ||
                inlineNode.indexOf(tempNode.firstChild.nodeName.toLocaleLowerCase()) >= 0) {
                if (!isPreviousInlineElem) {
                    paraElm = createElement('p');
                    resultElm.appendChild(paraElm);
                    paraElm.appendChild(tempNode.firstChild);
                }
                else {
                    previousParent.appendChild(tempNode.firstChild);
                }
                previousParent = paraElm;
                isPreviousInlineElem = true;
            }
            else if (tempNode.firstChild.nodeName === '#text' && (tempNode.firstChild.textContent === '\n' ||
                (tempNode.firstChild.textContent.indexOf('\n') >= 0 && tempNode.firstChild.textContent.trim() === ''))) {
                detach(tempNode.firstChild);
            }
            else {
                resultElm.appendChild(tempNode.firstChild);
                isPreviousInlineElem = false;
            }
        }
        var imageElm = resultElm.querySelectorAll('img');
        for (var i = 0; i < imageElm.length; i++) {
            if (!imageElm[i].classList.contains(classes.CLS_RTE_IMAGE)) {
                imageElm[i].classList.add(classes.CLS_RTE_IMAGE);
            }
            if (!(imageElm[i].classList.contains(classes.CLS_IMGINLINE) ||
                imageElm[i].classList.contains(classes.CLS_IMGBREAK))) {
                imageElm[i].classList.add(classes.CLS_IMGINLINE);
            }
        }
    }
    return resultElm.innerHTML;
}
export function isEditableValueEmpty(value) {
    return (value === '<p><br></p>' || value === '&lt;p&gt;&lt;br&gt;&lt;/p&gt;' || value === '') ? true : false;
}
export function decode(value) {
    return value.replace(/&amp;/g, '&').replace(/&amp;lt;/g, '<')
        .replace(/&lt;/g, '<').replace(/&amp;gt;/g, '>')
        .replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ')
        .replace(/&amp;nbsp;/g, ' ').replace(/&quot;/g, '');
}
export function sanitizeHelper(value, parent) {
    if (parent.enableHtmlSanitizer) {
        var item = SanitizeHtmlHelper.beforeSanitize();
        var beforeEvent = {
            cancel: false,
            helper: null
        };
        extend(item, item, beforeEvent);
        parent.trigger('beforeSanitizeHtml', item);
        if (item.cancel && !isNullOrUndefined(item.helper)) {
            value = item.helper(value);
        }
        else if (!item.cancel) {
            value = SanitizeHtmlHelper.serializeValue(item, value);
        }
    }
    return value;
}
//Converting the base64 url to blob
export function convertToBlob(dataUrl) {
    var arr = dataUrl.split(',');
    var mime = arr[0].match(/:(.*?);/)[1];
    var bstr = atob(arr[1]);
    var n = bstr.length;
    var u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
}

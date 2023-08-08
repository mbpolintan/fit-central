/**
 * Defines common util methods used by Rich Text Editor.
 */
import { isNullOrUndefined, Browser, createElement, detach } from '@syncfusion/ej2-base';
import * as classes from '../rich-text-editor/base/classes';
var inlineNode = ['a', 'abbr', 'acronym', 'audio', 'b', 'bdi', 'bdo', 'big', 'br', 'button',
    'canvas', 'cite', 'code', 'data', 'datalist', 'del', 'dfn', 'em', 'embed', 'font', 'i', 'iframe', 'img', 'input',
    'ins', 'kbd', 'label', 'map', 'mark', 'meter', 'noscript', 'object', 'output', 'picture', 'progress',
    'q', 'ruby', 's', 'samp', 'script', 'select', 'slot', 'small', 'span', 'strong', 'strike', 'sub', 'sup', 'svg',
    'template', 'textarea', 'time', 'u', 'tt', 'var', 'video', 'wbr'];
export function isIDevice() {
    var result = false;
    if (Browser.isDevice && Browser.isIos) {
        result = true;
    }
    return result;
}
export function setEditFrameFocus(editableElement, selector) {
    if (editableElement.nodeName === 'BODY' && !isNullOrUndefined(selector)) {
        var iframe = top.window.document.querySelector(selector);
        if (!isNullOrUndefined(iframe)) {
            iframe.contentWindow.focus();
        }
    }
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
        var tableElm = resultElm.querySelectorAll('table');
        for (var i = 0; i < tableElm.length; i++) {
            if (tableElm[i].getAttribute('border') === '0') {
                tableElm[i].removeAttribute('border');
            }
            var tdElm = tableElm[i].querySelectorAll('td');
            for (var j = 0; j < tdElm.length; j++) {
                tdElm[j].style.removeProperty('border');
            }
            if (!tableElm[i].classList.contains(classes.CLS_TABLE)) {
                tableElm[i].classList.add(classes.CLS_TABLE);
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

import { NodeSelection } from './../../selection/index';
import { NodeCutter } from './nodecutter';
import * as CONSTANT from './../base/constant';
import { detach, Browser, isNullOrUndefined as isNOU, createElement } from '@syncfusion/ej2-base';
import { InsertMethods } from './insert-methods';
import { updateTextNode } from './../../common/util';
/**
 * Insert a HTML Node or Text
 * @hidden

 */
var InsertHtml = /** @class */ (function () {
    function InsertHtml() {
    }
    InsertHtml.Insert = function (docElement, insertNode, editNode, isExternal) {
        var node;
        if (typeof insertNode === 'string') {
            var divNode = document.createElement('div');
            divNode.innerHTML = insertNode;
            node = isExternal ? divNode : divNode.firstChild;
        }
        else {
            if (isExternal && !(!isNOU(insertNode) && !isNOU(insertNode.classList) &&
                insertNode.classList.contains('pasteContent'))) {
                var divNode = document.createElement('div');
                divNode.appendChild(insertNode);
                node = divNode;
            }
            else {
                node = insertNode;
            }
        }
        var nodeSelection = new NodeSelection();
        var nodeCutter = new NodeCutter();
        var range = nodeSelection.getRange(docElement);
        var isCursor = range.startOffset === range.endOffset && range.startOffset === 0 &&
            range.startContainer === range.endContainer;
        var isCollapsed = range.collapsed;
        var nodes = this.getNodeCollection(range, nodeSelection);
        var closestParentNode = (node.nodeName.toLowerCase() === 'table') ? this.closestEle(nodes[0].parentNode, editNode) : nodes[0];
        if (isExternal || (!isNOU(node) && !isNOU(node.classList) &&
            node.classList.contains('pasteContent'))) {
            this.pasteInsertHTML(nodes, node, range, nodeSelection, nodeCutter, docElement, isCollapsed, closestParentNode, editNode);
            return;
        }
        if (editNode !== range.startContainer && ((!isCollapsed && !(closestParentNode.nodeType === Node.ELEMENT_NODE &&
            CONSTANT.TABLE_BLOCK_TAGS.indexOf(closestParentNode.tagName.toLocaleLowerCase()) !== -1))
            || (node.nodeName.toLowerCase() === 'table' && closestParentNode &&
                CONSTANT.TABLE_BLOCK_TAGS.indexOf(closestParentNode.tagName.toLocaleLowerCase()) === -1))) {
            var preNode = nodeCutter.GetSpliceNode(range, closestParentNode);
            var sibNode = preNode.previousSibling;
            var parentNode = preNode.parentNode;
            if (nodes.length === 1) {
                nodeSelection.setSelectionContents(docElement, preNode);
                range = nodeSelection.getRange(docElement);
            }
            else {
                var lasNode = nodeCutter.GetSpliceNode(range, nodes[nodes.length - 1].parentElement);
                lasNode = isNOU(lasNode) ? preNode : lasNode;
                nodeSelection.setSelectionText(docElement, preNode, lasNode, 0, (lasNode.nodeType === 3) ?
                    lasNode.textContent.length : lasNode.childNodes.length);
                range = nodeSelection.getRange(docElement);
            }
            range.extractContents();
            if (insertNode.tagName === 'TABLE') {
                this.removeEmptyElements(editNode);
            }
            for (var index = 0; index < nodes.length; index++) {
                if (nodes[index].nodeType !== 3 && nodes[index].parentNode != null) {
                    if (nodes[index].nodeName === 'IMG') {
                        continue;
                    }
                    nodes[index].parentNode.removeChild(nodes[index]);
                }
            }
            if (sibNode) {
                InsertMethods.AppendBefore(node, sibNode, true);
            }
            else {
                var previousNode = null;
                while (parentNode !== editNode && parentNode.firstChild &&
                    (parentNode.textContent.trim() === '')) {
                    var parentNode1 = parentNode.parentNode;
                    previousNode = parentNode;
                    parentNode = parentNode1;
                }
                if (previousNode !== null) {
                    parentNode = previousNode;
                }
                if (parentNode.firstChild && (parentNode !== editNode ||
                    (node.nodeName === 'TABLE' && isCursor && parentNode === range.startContainer &&
                        parentNode === range.endContainer))) {
                    if (parentNode.textContent.trim() === '' && parentNode !== editNode) {
                        InsertMethods.AppendBefore(node, parentNode, false);
                        detach(parentNode);
                    }
                    else {
                        InsertMethods.AppendBefore(node, parentNode.firstChild, false);
                    }
                }
                else {
                    parentNode.appendChild(node);
                }
            }
            if (node.nodeName === 'IMG') {
                this.imageFocus(node, nodeSelection, docElement);
            }
            else if (node.nodeType !== 3) {
                nodeSelection.setSelectionText(docElement, node, node, 0, node.childNodes.length);
            }
            else {
                nodeSelection.setSelectionText(docElement, node, node, 0, node.textContent.length);
            }
        }
        else {
            range.deleteContents();
            if (isCursor && range.startContainer.textContent === '') {
                range.startContainer.innerHTML = '';
            }
            if (Browser.isIE) {
                var frag = docElement.createDocumentFragment();
                frag.appendChild(node);
                range.insertNode(frag);
            }
            else {
                range.insertNode(node);
            }
            if (node.nodeType !== 3 && node.childNodes.length > 0) {
                nodeSelection.setSelectionText(docElement, node, node, 1, 1);
            }
            else if (node.nodeName === 'IMG') {
                this.imageFocus(node, nodeSelection, docElement);
            }
            else if (node.nodeType !== 3) {
                nodeSelection.setSelectionContents(docElement, node);
            }
            else {
                nodeSelection.setSelectionText(docElement, node, node, node.textContent.length, node.textContent.length);
            }
        }
    };
    InsertHtml.pasteInsertHTML = function (nodes, node, range, nodeSelection, nodeCutter, docElement, isCollapsed, closestParentNode, editNode) {
        var isCursor = range.startOffset === range.endOffset &&
            range.startContainer === range.endContainer;
        if (isCursor && range.startContainer === editNode && editNode.textContent === '') {
            var currentBlockNode = this.getImmediateBlockNode(nodes[nodes.length - 1], editNode);
            nodeSelection.setSelectionText(docElement, currentBlockNode, currentBlockNode, 0, 0);
            range = nodeSelection.getRange(docElement);
        }
        var lasNode;
        var sibNode;
        var isSingleNode;
        var preNode;
        if (editNode !== range.startContainer && ((!isCollapsed && !(closestParentNode.nodeType === Node.ELEMENT_NODE &&
            CONSTANT.TABLE_BLOCK_TAGS.indexOf(closestParentNode.tagName.toLocaleLowerCase()) !== -1))
            || (node.nodeName.toLowerCase() === 'table' && closestParentNode &&
                CONSTANT.TABLE_BLOCK_TAGS.indexOf(closestParentNode.tagName.toLocaleLowerCase()) === -1))) {
            preNode = nodeCutter.GetSpliceNode(range, closestParentNode);
            sibNode = isNOU(preNode.previousSibling) ? preNode.parentNode.previousSibling : preNode.previousSibling;
            if (nodes.length === 1) {
                nodeSelection.setSelectionContents(docElement, preNode);
                range = nodeSelection.getRange(docElement);
                isSingleNode = true;
            }
            else {
                lasNode = nodeCutter.GetSpliceNode(range, nodes[nodes.length - 1].parentElement);
                lasNode = isNOU(lasNode) ? preNode : lasNode;
                nodeSelection.setSelectionText(docElement, preNode, lasNode, 0, (lasNode.nodeType === 3) ?
                    lasNode.textContent.length : lasNode.childNodes.length);
                range = nodeSelection.getRange(docElement);
                isSingleNode = false;
            }
        }
        var containsBlockNode = false;
        this.removingComments(node);
        var allChildNodes = node.childNodes;
        for (var i = 0; i < allChildNodes.length; i++) {
            if (CONSTANT.BLOCK_TAGS.indexOf(allChildNodes[i].nodeName.toLocaleLowerCase()) >= 0) {
                containsBlockNode = true;
                break;
            }
        }
        var lastSelectionNode;
        var fragment = document.createDocumentFragment();
        if (!containsBlockNode) {
            if (!isCursor) {
                while (node.firstChild) {
                    lastSelectionNode = node.firstChild;
                    fragment.appendChild(node.firstChild);
                }
                if (isSingleNode) {
                    preNode.parentNode.replaceChild(fragment, preNode);
                }
                else {
                    range.deleteContents();
                    detach(lasNode);
                    !isNOU(sibNode) ? sibNode.parentNode.appendChild(fragment) : editNode.appendChild(fragment);
                }
            }
            else {
                var tempSpan = createElement('span', { className: 'tempSpan' });
                range.insertNode(tempSpan);
                while (node.firstChild) {
                    lastSelectionNode = node.firstChild;
                    fragment.appendChild(node.firstChild);
                }
                tempSpan.parentNode.replaceChild(fragment, tempSpan);
            }
        }
        else {
            this.insertTempNode(range, node, nodes, nodeCutter, editNode);
            var isFirstTextNode = true;
            var isPreviousInlineElem = void 0;
            var paraElm = void 0;
            var previousParent = void 0;
            range.deleteContents();
            while (node.firstChild) {
                if (node.firstChild.nodeName === '#text' && node.firstChild.textContent.trim() === '') {
                    detach(node.firstChild);
                    continue;
                }
                if (node.firstChild.nodeName === '#text' && isFirstTextNode ||
                    (this.inlineNode.indexOf(node.firstChild.nodeName.toLocaleLowerCase()) >= 0 && isFirstTextNode)) {
                    lastSelectionNode = node.firstChild;
                    if (isNOU(node.previousElementSibling)) {
                        var firstParaElm = createElement('p');
                        node.parentElement.insertBefore(firstParaElm, node);
                    }
                    node.previousElementSibling.appendChild(node.firstChild);
                }
                else {
                    lastSelectionNode = node.firstChild;
                    if (node.firstChild.nodeName === '#text' ||
                        (this.inlineNode.indexOf(node.firstChild.nodeName.toLocaleLowerCase()) >= 0)) {
                        if (!isPreviousInlineElem) {
                            paraElm = createElement('p');
                            paraElm.appendChild(node.firstChild);
                            fragment.appendChild(paraElm);
                        }
                        else {
                            previousParent.appendChild(node.firstChild);
                            fragment.appendChild(previousParent);
                        }
                        previousParent = paraElm;
                        isPreviousInlineElem = true;
                    }
                    else {
                        fragment.appendChild(node.firstChild);
                        isPreviousInlineElem = false;
                    }
                    isFirstTextNode = false;
                }
            }
            node.parentNode.replaceChild(fragment, node);
        }
        if (lastSelectionNode.nodeName === '#text') {
            this.placeCursorEnd(lastSelectionNode, node, nodeSelection, docElement, editNode);
        }
        else {
            this.cursorPos(lastSelectionNode, node, nodeSelection, docElement, editNode);
        }
    };
    InsertHtml.placeCursorEnd = function (lastSelectionNode, node, nodeSelection, docElement, editNode) {
        lastSelectionNode = lastSelectionNode.nodeName === 'BR' ? lastSelectionNode.previousSibling : lastSelectionNode;
        while (!isNOU(lastSelectionNode) && lastSelectionNode.nodeName !== '#text' && lastSelectionNode.nodeName !== 'IMG' &&
            lastSelectionNode.nodeName !== 'BR') {
            lastSelectionNode = lastSelectionNode.lastChild;
        }
        lastSelectionNode = isNOU(lastSelectionNode) ? node : lastSelectionNode;
        if (lastSelectionNode.nodeName === 'IMG') {
            this.imageFocus(lastSelectionNode, nodeSelection, docElement);
        }
        else {
            nodeSelection.setSelectionText(docElement, lastSelectionNode, lastSelectionNode, lastSelectionNode.textContent.length, lastSelectionNode.textContent.length);
        }
        this.removeEmptyElements(editNode);
    };
    InsertHtml.getNodeCollection = function (range, nodeSelection) {
        var nodes = [];
        if (range.startOffset === range.endOffset && range.startContainer === range.endContainer &&
            range.startContainer.nodeName === 'TD') {
            nodes.push(range.startContainer.childNodes[range.endOffset]);
        }
        else {
            nodes = nodeSelection.getInsertNodeCollection(range);
        }
        return nodes;
    };
    InsertHtml.insertTempNode = function (range, node, nodes, nodeCutter, editNode) {
        if (range.startContainer === editNode && !isNOU(range.startContainer.childNodes[range.endOffset - 1]) &&
            range.startContainer.childNodes[range.endOffset - 1].nodeName === 'TABLE') {
            if (isNOU(range.startContainer.childNodes[range.endOffset - 1].nextSibling)) {
                range.startContainer.appendChild(node);
            }
            else {
                range.startContainer.insertBefore(node, range.startContainer.childNodes[range.endOffset - 1].nextSibling);
            }
        }
        else if (range.startContainer === editNode && !isNOU(range.startContainer.childNodes[range.endOffset]) &&
            range.startContainer.childNodes[range.endOffset].nodeName === 'TABLE') {
            range.startContainer.insertBefore(node, range.startContainer.childNodes[range.endOffset]);
        }
        else {
            var blockNode = this.getImmediateBlockNode(nodes[nodes.length - 1], editNode);
            if (blockNode.nodeName === 'TD' || blockNode.nodeName === 'TH') {
                var tempSpan = createElement('span', { className: 'tempSpan' });
                range.insertNode(tempSpan);
                tempSpan.parentNode.replaceChild(node, tempSpan);
            }
            else {
                var splitedElm = nodeCutter.GetSpliceNode(range, blockNode);
                splitedElm.parentNode.replaceChild(node, splitedElm);
            }
        }
    };
    InsertHtml.cursorPos = function (lastSelectionNode, node, nodeSelection, docElement, editNode) {
        lastSelectionNode.classList.add('lastNode');
        editNode.innerHTML = updateTextNode(editNode.innerHTML);
        lastSelectionNode = editNode.querySelector('.lastNode');
        this.placeCursorEnd(lastSelectionNode, node, nodeSelection, docElement, editNode);
        lastSelectionNode.classList.remove('lastNode');
        if (lastSelectionNode.classList.length === 0) {
            lastSelectionNode.removeAttribute('class');
        }
    };
    InsertHtml.imageFocus = function (node, nodeSelection, docElement) {
        var focusNode = document.createTextNode(' ');
        node.parentNode.insertBefore(focusNode, node.nextSibling);
        nodeSelection.setSelectionText(docElement, node.nextSibling, node.nextSibling, 0, 0);
    };
    InsertHtml.getImmediateBlockNode = function (node, editNode) {
        do {
            node = node.parentNode;
        } while (CONSTANT.BLOCK_TAGS.indexOf(node.nodeName.toLocaleLowerCase()) < 0);
        return node;
    };
    InsertHtml.removingComments = function (elm) {
        var innerElement = elm.innerHTML;
        innerElement = innerElement.replace(/<!--[\s\S]*?-->/g, '');
        elm.innerHTML = innerElement;
    };
    InsertHtml.findDetachEmptyElem = function (element) {
        var removableElement;
        if (!isNOU(element.parentElement)) {
            if (element.parentElement.textContent.trim() === '' && element.parentElement.contentEditable !== 'true') {
                removableElement = this.findDetachEmptyElem(element.parentElement);
            }
            else {
                removableElement = element;
            }
        }
        else {
            removableElement = null;
        }
        return removableElement;
    };
    InsertHtml.removeEmptyElements = function (element) {
        var emptyElements = element.querySelectorAll(':empty');
        for (var i = 0; i < emptyElements.length; i++) {
            if (emptyElements[i].tagName !== 'IMG' && emptyElements[i].tagName !== 'BR' &&
                emptyElements[i].tagName !== 'IFRAME' && emptyElements[i].tagName !== 'TD') {
                var detachableElement = this.findDetachEmptyElem(emptyElements[i]);
                if (!isNOU(detachableElement)) {
                    detach(detachableElement);
                }
            }
        }
    };
    InsertHtml.closestEle = function (element, editNode) {
        var el = element;
        while (el && el.nodeType === 1) {
            if (el.parentNode === editNode ||
                (!isNOU(el.parentNode.tagName) &&
                    CONSTANT.IGNORE_BLOCK_TAGS.indexOf(el.parentNode.tagName.toLocaleLowerCase()) !== -1)) {
                return el;
            }
            el = el.parentNode;
        }
        return null;
    };
    /**
     * Insert method
     * @hidden

     */
    InsertHtml.inlineNode = ['a', 'abbr', 'acronym', 'audio', 'b', 'bdi', 'bdo', 'big', 'br', 'button',
        'canvas', 'cite', 'code', 'data', 'datalist', 'del', 'dfn', 'em', 'embed', 'font', 'i', 'iframe', 'img', 'input',
        'ins', 'kbd', 'label', 'map', 'mark', 'meter', 'noscript', 'object', 'output', 'picture', 'progress',
        'q', 'ruby', 's', 'samp', 'script', 'select', 'slot', 'small', 'span', 'strong', 'sub', 'sup', 'svg',
        'template', 'textarea', 'time', 'u', 'tt', 'var', 'video', 'wbr'];
    return InsertHtml;
}());
export { InsertHtml };

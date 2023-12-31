/**
 * `Clear Format` module is used to handle Clear Format.
 */
import { NodeSelection } from './../../selection/index';
import { NodeCutter } from './nodecutter';
import { InsertMethods } from './insert-methods';
import { IsFormatted } from './isformatted';
import { isIDevice, setEditFrameFocus } from '../../common/util';
var ClearFormat = /** @class */ (function () {
    function ClearFormat() {
    }
    /**
     * clear method
     * @hidden

     */
    ClearFormat.clear = function (docElement, endNode, selector) {
        var nodeSelection = new NodeSelection();
        var nodeCutter = new NodeCutter();
        var range = nodeSelection.getRange(docElement);
        var isCollapsed = range.collapsed;
        var nodes = nodeSelection.getInsertNodeCollection(range);
        var save = nodeSelection.save(range, docElement);
        if (!isCollapsed) {
            var preNode = nodeCutter.GetSpliceNode(range, nodes[0]);
            if (nodes.length === 1) {
                nodeSelection.setSelectionContents(docElement, preNode);
                range = nodeSelection.getRange(docElement);
            }
            else {
                var i = 1;
                var lastText = nodes[nodes.length - i];
                while (nodes[nodes.length - i].nodeName === 'BR') {
                    i++;
                    lastText = nodes[nodes.length - i];
                }
                var lasNode = nodeCutter.GetSpliceNode(range, lastText);
                nodeSelection.setSelectionText(docElement, preNode, lasNode, 0, (lasNode.nodeType === 3) ?
                    lasNode.textContent.length : lasNode.childNodes.length);
                range = nodeSelection.getRange(docElement);
            }
            var exactNodes = nodeSelection.getNodeCollection(range);
            var cloneSelectNodes = exactNodes.slice();
            this.clearInlines(nodeSelection.getSelectionNodes(cloneSelectNodes), cloneSelectNodes, nodeSelection.getRange(docElement), nodeCutter, endNode);
            this.reSelection(docElement, save, exactNodes);
            range = nodeSelection.getRange(docElement);
            exactNodes = nodeSelection.getNodeCollection(range);
            var cloneParentNodes = exactNodes.slice();
            this.clearBlocks(docElement, cloneParentNodes, endNode, nodeCutter, nodeSelection);
            if (isIDevice()) {
                setEditFrameFocus(endNode, selector);
            }
            this.reSelection(docElement, save, exactNodes);
        }
    };
    ClearFormat.reSelection = function (docElement, save, exactNodes) {
        var selectionNodes = save.getInsertNodes(exactNodes);
        save.startContainer = save.getNodeArray(selectionNodes[0], true, docElement);
        save.startOffset = 0;
        save.endContainer = save.getNodeArray(selectionNodes[selectionNodes.length - 1], false, docElement);
        var endIndexNode = selectionNodes[selectionNodes.length - 1];
        save.endOffset = (endIndexNode.nodeType === 3) ? endIndexNode.textContent.length
            : endIndexNode.childNodes.length;
        save.restore();
    };
    ClearFormat.clearBlocks = function (docElement, nodes, endNode, nodeCutter, nodeSelection) {
        var parentNodes = [];
        for (var index = 0; index < nodes.length; index++) {
            if (this.BLOCK_TAGS.indexOf(nodes[index].nodeName.toLocaleLowerCase()) > -1
                && parentNodes.indexOf(nodes[index]) === -1) {
                parentNodes.push(nodes[index]);
            }
            else if ((this.BLOCK_TAGS.indexOf(nodes[index].parentNode.nodeName.toLocaleLowerCase()) > -1)
                && parentNodes.indexOf(nodes[index].parentNode) === -1
                && endNode !== nodes[index].parentNode) {
                parentNodes.push(nodes[index].parentNode);
            }
        }
        parentNodes = this.spliceParent(parentNodes, nodes)[0];
        parentNodes = this.removeParent(parentNodes);
        this.unWrap(docElement, parentNodes, nodeCutter, nodeSelection);
    };
    ClearFormat.spliceParent = function (parentNodes, nodes) {
        for (var index1 = 0; index1 < parentNodes.length; index1++) {
            var len = parentNodes[index1].childNodes.length;
            for (var index2 = 0; index2 < len; index2++) {
                if ((nodes.indexOf(parentNodes[index1].childNodes[index2]) > 0)
                    && (parentNodes[index1].childNodes[index2].childNodes.length > 0)) {
                    nodes = this.spliceParent([parentNodes[index1].childNodes[index2]], nodes)[1];
                }
                if ((nodes.indexOf(parentNodes[index1].childNodes[index2]) <= -1) &&
                    (parentNodes[index1].childNodes[index2].textContent.trim() !== '')) {
                    for (var index3 = 0; index3 < len; index3++) {
                        if (nodes.indexOf(parentNodes[index1].childNodes[index3]) > -1) {
                            nodes.splice(nodes.indexOf(parentNodes[index1].childNodes[index3]), 1);
                        }
                    }
                    index2 = parentNodes[index1].childNodes.length;
                    var parentIndex = parentNodes.indexOf(parentNodes[index1].parentNode);
                    var nodeIndex = nodes.indexOf(parentNodes[index1].parentNode);
                    if (parentIndex > -1) {
                        parentNodes.splice(parentIndex, 1);
                    }
                    if (nodeIndex > -1) {
                        nodes.splice(nodeIndex, 1);
                    }
                    var elementIndex = nodes.indexOf(parentNodes[index1]);
                    if (elementIndex > -1) {
                        nodes.splice(elementIndex, 1);
                    }
                    parentNodes.splice(index1, 1);
                    index1--;
                }
            }
        }
        return [parentNodes, nodes];
    };
    ClearFormat.removeChild = function (parentNodes, parentNode) {
        var count = parentNode.childNodes.length;
        if (count > 0) {
            for (var index = 0; index < count; index++) {
                if (parentNodes.indexOf(parentNode.childNodes[index]) > -1) {
                    parentNodes = this.removeChild(parentNodes, parentNode.childNodes[index]);
                    parentNodes.splice(parentNodes.indexOf(parentNode.childNodes[index]), 1);
                }
            }
        }
        return parentNodes;
    };
    ClearFormat.removeParent = function (parentNodes) {
        for (var index = 0; index < parentNodes.length; index++) {
            if (parentNodes.indexOf(parentNodes[index].parentNode) > -1) {
                parentNodes = this.removeChild(parentNodes, parentNodes[index]);
                parentNodes.splice(index, 1);
                index--;
            }
        }
        return parentNodes;
    };
    ClearFormat.unWrap = function (docElement, parentNodes, nodeCutter, nodeSelection) {
        for (var index1 = 0; index1 < parentNodes.length; index1++) {
            if (this.NONVALID_TAGS.indexOf(parentNodes[index1].nodeName.toLowerCase()) > -1
                && parentNodes[index1].parentNode
                && this.NONVALID_PARENT_TAGS.indexOf(parentNodes[index1].parentNode.nodeName.toLowerCase()) > -1) {
                nodeSelection.setSelectionText(docElement, parentNodes[index1], parentNodes[index1], 0, parentNodes[index1].childNodes.length);
                InsertMethods.unwrap(nodeCutter.GetSpliceNode(nodeSelection.getRange(docElement), parentNodes[index1].parentNode));
            }
            if (parentNodes[index1].nodeName.toLocaleLowerCase() !== 'p') {
                if (this.NONVALID_PARENT_TAGS.indexOf(parentNodes[index1].nodeName.toLowerCase()) < 0
                    && parentNodes[index1].parentNode.nodeName.toLocaleLowerCase() !== 'p'
                    && !((parentNodes[index1].nodeName.toLocaleLowerCase() === 'blockquote'
                        || parentNodes[index1].nodeName.toLocaleLowerCase() === 'li')
                        && this.IGNORE_PARENT_TAGS.indexOf(parentNodes[index1].childNodes[0].nodeName.toLocaleLowerCase()) > -1)
                    && !(parentNodes[index1].childNodes.length === 1
                        && parentNodes[index1].childNodes[0].nodeName.toLocaleLowerCase() === 'p')) {
                    InsertMethods.Wrap(parentNodes[index1], docElement.createElement('p'));
                }
                var childNodes = InsertMethods.unwrap(parentNodes[index1]);
                if (childNodes.length === 1
                    && childNodes[0].parentNode.nodeName.toLocaleLowerCase() === 'p') {
                    InsertMethods.Wrap(parentNodes[index1], docElement.createElement('p'));
                    InsertMethods.unwrap(parentNodes[index1]);
                }
                for (var index2 = 0; index2 < childNodes.length; index2++) {
                    if (this.NONVALID_TAGS.indexOf(childNodes[index2].nodeName.toLowerCase()) > -1) {
                        this.unWrap(docElement, [childNodes[index2]], nodeCutter, nodeSelection);
                    }
                    else if (this.BLOCK_TAGS.indexOf(childNodes[index2].nodeName.toLocaleLowerCase()) > -1 &&
                        childNodes[index2].nodeName.toLocaleLowerCase() !== 'p') {
                        var blockNodes = this.removeParent([childNodes[index2]]);
                        this.unWrap(docElement, blockNodes, nodeCutter, nodeSelection);
                    }
                    else if (this.BLOCK_TAGS.indexOf(childNodes[index2].nodeName.toLocaleLowerCase()) > -1 &&
                        childNodes[index2].parentNode.nodeName.toLocaleLowerCase() === childNodes[index2].nodeName.toLocaleLowerCase()) {
                        InsertMethods.unwrap(childNodes[index2]);
                    }
                    else if (this.BLOCK_TAGS.indexOf(childNodes[index2].nodeName.toLocaleLowerCase()) > -1 &&
                        childNodes[index2].nodeName.toLocaleLowerCase() === 'p') {
                        InsertMethods.Wrap(childNodes[index2], docElement.createElement('p'));
                        InsertMethods.unwrap(childNodes[index2]);
                    }
                }
            }
            else {
                InsertMethods.Wrap(parentNodes[index1], docElement.createElement('p'));
                InsertMethods.unwrap(parentNodes[index1]);
            }
        }
    };
    ClearFormat.clearInlines = function (textNodes, nodes, range, nodeCutter, endNode) {
        for (var index = 0; index < textNodes.length; index++) {
            if (textNodes[index].parentNode &&
                IsFormatted.inlineTags.indexOf(textNodes[index].parentNode.nodeName.toLocaleLowerCase()) > -1) {
                nodeCutter.GetSpliceNode(range, textNodes[index].parentNode);
                this.removeInlineParent(textNodes[index].parentNode);
            }
        }
    };
    ClearFormat.removeInlineParent = function (textNodes) {
        var nodes = InsertMethods.unwrap(textNodes);
        for (var index = 0; index < nodes.length; index++) {
            if (nodes[index].parentNode.childNodes.length === 1
                && IsFormatted.inlineTags.indexOf(nodes[index].parentNode.nodeName.toLocaleLowerCase()) > -1) {
                this.removeInlineParent(nodes[index].parentNode);
            }
            else if (IsFormatted.inlineTags.indexOf(nodes[index].nodeName.toLocaleLowerCase()) > -1) {
                this.removeInlineParent(nodes[index]);
            }
        }
    };
    ClearFormat.BLOCK_TAGS = ['address', 'article', 'aside', 'blockquote',
        'details', 'dd', 'div', 'dl', 'dt', 'fieldset', 'figcaption', 'figure', 'footer',
        'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header', 'hgroup', 'li', 'main', 'nav',
        'noscript', 'ol', 'p', 'pre', 'section', 'table', 'tbody', 'td', 'tfoot', 'th',
        'thead', 'tr', 'ul'];
    ClearFormat.NONVALID_PARENT_TAGS = ['thead', 'tbody', 'ul', 'ol', 'table', 'tfoot', 'tr'];
    ClearFormat.IGNORE_PARENT_TAGS = ['ul', 'ol', 'table'];
    ClearFormat.NONVALID_TAGS = ['thead', 'tbody', 'figcaption', 'td', 'tr',
        'th', 'tfoot', 'figcaption', 'li'];
    return ClearFormat;
}());
export { ClearFormat };

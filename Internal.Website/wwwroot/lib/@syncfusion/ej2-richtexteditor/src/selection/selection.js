/**
 * `Selection` module is used to handle RTE Selections.
 */
var NodeSelection = /** @class */ (function () {
    function NodeSelection() {
        this.startNodeName = [];
        this.endNodeName = [];
    }
    NodeSelection.prototype.saveInstance = function (range, body) {
        this.range = range.cloneRange();
        this.rootNode = this.documentFromRange(range);
        this.body = body;
        this.startContainer = this.getNodeArray(range.startContainer, true);
        this.endContainer = this.getNodeArray(range.endContainer, false);
        this.startOffset = range.startOffset;
        this.endOffset = range.endOffset;
        this.html = this.body.innerHTML;
        return this;
    };
    NodeSelection.prototype.documentFromRange = function (range) {
        return (9 === range.startContainer.nodeType) ? range.startContainer : range.startContainer.ownerDocument;
    };
    NodeSelection.prototype.getRange = function (docElement) {
        var select = this.get(docElement);
        var range = select && select.rangeCount > 0 ? select.getRangeAt(select.rangeCount - 1) : docElement.createRange();
        return (range.startContainer !== docElement || range.endContainer !== docElement
            || range.startOffset || range.endOffset || (range.setStart(docElement.body, 0),
            range.collapse(!0)),
            range);
    };
    /**
     * get method
     * @hidden

     */
    NodeSelection.prototype.get = function (docElement) {
        return docElement.defaultView.getSelection();
    };
    /**
     * save method
     * @hidden

     */
    NodeSelection.prototype.save = function (range, docElement) {
        range = (range) ? range.cloneRange() : this.getRange(docElement);
        return this.saveInstance(range, docElement.body);
    };
    /**
     * getIndex method
     * @hidden

     */
    NodeSelection.prototype.getIndex = function (node) {
        var index;
        var num = 0;
        node = !node.previousSibling && node.tagName === 'BR' ? node : node.previousSibling;
        if (node) {
            for (var type = node.nodeType; node; null) {
                index = node.nodeType;
                num++;
                type = index;
                node = node.previousSibling;
            }
        }
        return num;
    };
    NodeSelection.prototype.isChildNode = function (nodeCollection, parentNode) {
        for (var index = 0; index < parentNode.childNodes.length; index++) {
            if (nodeCollection.indexOf(parentNode.childNodes[index]) > -1) {
                return true;
            }
        }
        return false;
    };
    NodeSelection.prototype.getNode = function (startNode, endNode, nodeCollection) {
        if (endNode === startNode &&
            (startNode.nodeType === 3 || !startNode.firstChild || nodeCollection.indexOf(startNode.firstChild) !== -1
                || this.isChildNode(nodeCollection, startNode))) {
            return null;
        }
        if (nodeCollection.indexOf(startNode.firstChild) === -1 && startNode.firstChild && !this.isChildNode(nodeCollection, startNode)) {
            return startNode.firstChild;
        }
        if (startNode.nextSibling) {
            return startNode.nextSibling;
        }
        if (!startNode.parentNode) {
            return null;
        }
        else {
            return startNode.parentNode;
        }
    };
    /**
     * getNodeCollection method
     * @hidden

     */
    NodeSelection.prototype.getNodeCollection = function (range) {
        var startNode = range.startContainer.childNodes[range.startOffset]
            || range.startContainer;
        var endNode = range.endContainer.childNodes[(range.endOffset > 0) ? (range.endOffset - 1) : range.endOffset]
            || range.endContainer;
        if (startNode === endNode && startNode.childNodes.length === 0) {
            return [startNode];
        }
        if (range.startOffset === range.endOffset && range.startOffset !== 0 && range.startContainer.nodeName === 'PRE') {
            return [startNode.nodeName === 'BR' || startNode.nodeName === '#text' ? startNode : startNode.childNodes[0]];
        }
        var nodeCollection = [];
        do {
            if (nodeCollection.indexOf(startNode) === -1) {
                nodeCollection.push(startNode);
            }
            startNode = this.getNode(startNode, endNode, nodeCollection);
        } while (startNode);
        return nodeCollection;
    };
    /**
     * getParentNodeCollection method
     * @hidden

     */
    NodeSelection.prototype.getParentNodeCollection = function (range) {
        return this.getParentNodes(this.getNodeCollection(range), range);
    };
    /**
     * getParentNodes method
     * @hidden

     */
    NodeSelection.prototype.getParentNodes = function (nodeCollection, range) {
        nodeCollection = nodeCollection.reverse();
        for (var index = 0; index < nodeCollection.length; index++) {
            if ((nodeCollection.indexOf(nodeCollection[index].parentNode) !== -1)
                || (nodeCollection[index].nodeType === 3 &&
                    range.startContainer !== range.endContainer &&
                    range.startContainer.parentNode !== range.endContainer.parentNode)) {
                nodeCollection.splice(index, 1);
                index--;
            }
            else if (nodeCollection[index].nodeType === 3) {
                nodeCollection[index] = nodeCollection[index].parentNode;
            }
        }
        return nodeCollection;
    };
    /**
     * getSelectionNodeCollection method
     * @hidden

     */
    NodeSelection.prototype.getSelectionNodeCollection = function (range) {
        return this.getSelectionNodes(this.getNodeCollection(range));
    };
    /**
     * getSelectionNodeCollection along with BR node method
     * @hidden

     */
    NodeSelection.prototype.getSelectionNodeCollectionBr = function (range) {
        return this.getSelectionNodesBr(this.getNodeCollection(range));
    };
    /**
     * getParentNodes method
     * @hidden

     */
    NodeSelection.prototype.getSelectionNodes = function (nodeCollection) {
        nodeCollection = nodeCollection.reverse();
        var regEx = new RegExp(String.fromCharCode(8203), 'g');
        for (var index = 0; index < nodeCollection.length; index++) {
            if (nodeCollection[index].nodeType !== 3 || (nodeCollection[index].textContent.trim() === '' ||
                (nodeCollection[index].textContent.length === 1 && nodeCollection[index].textContent.match(regEx)))) {
                nodeCollection.splice(index, 1);
                index--;
            }
        }
        return nodeCollection.reverse();
    };
    /**
     * Get selection text nodes with br method.
     * @hidden

     */
    NodeSelection.prototype.getSelectionNodesBr = function (nodeCollection) {
        nodeCollection = nodeCollection.reverse();
        var regEx = new RegExp(String.fromCharCode(8203), 'g');
        for (var index = 0; index < nodeCollection.length; index++) {
            if (nodeCollection[index].nodeName !== 'BR' &&
                (nodeCollection[index].nodeType !== 3 || (nodeCollection[index].textContent.trim() === '' ||
                    (nodeCollection[index].textContent.length === 1 && nodeCollection[index].textContent.match(regEx))))) {
                nodeCollection.splice(index, 1);
                index--;
            }
        }
        return nodeCollection.reverse();
    };
    /**
     * getInsertNodeCollection method
     * @hidden

     */
    NodeSelection.prototype.getInsertNodeCollection = function (range) {
        return this.getInsertNodes(this.getNodeCollection(range));
    };
    /**
     * getInsertNodes method
     * @hidden

     */
    NodeSelection.prototype.getInsertNodes = function (nodeCollection) {
        nodeCollection = nodeCollection.reverse();
        for (var index = 0; index < nodeCollection.length; index++) {
            if ((nodeCollection[index].childNodes.length !== 0 &&
                nodeCollection[index].nodeType !== 3) ||
                (nodeCollection[index].nodeType === 3 &&
                    nodeCollection[index].textContent === '')) {
                nodeCollection.splice(index, 1);
                index--;
            }
        }
        return nodeCollection.reverse();
    };
    /**
     * getNodeArray method
     * @hidden

     */
    NodeSelection.prototype.getNodeArray = function (node, isStart, root) {
        var array = [];
        ((isStart) ? (this.startNodeName = []) : (this.endNodeName = []));
        for (; node !== (root ? root : this.rootNode); null) {
            (isStart) ? this.startNodeName.push(node.nodeName.toLowerCase()) : this.endNodeName.push(node.nodeName.toLowerCase());
            array.push(this.getIndex(node));
            node = node.parentNode;
        }
        return array;
    };
    NodeSelection.prototype.setRangePoint = function (range, isvalid, num, size) {
        var node = this.rootNode;
        var index = num.length;
        var constant = size;
        for (; index--; null) {
            node = node && node.childNodes[num[index]];
        }
        if (node && constant >= 0) {
            range[isvalid ? 'setStart' : 'setEnd'](node, constant);
        }
        return range;
    };
    /**
     * restore method
     * @hidden

     */
    NodeSelection.prototype.restore = function () {
        var range = this.range.cloneRange();
        range = this.setRangePoint(range, true, this.startContainer, this.startOffset);
        range = this.setRangePoint(range, false, this.endContainer, this.endOffset);
        this.selectRange(this.rootNode, range);
        return range;
    };
    NodeSelection.prototype.selectRange = function (docElement, range) {
        this.setRange(docElement, range);
        this.save(range, docElement);
    };
    /**
     * setRange method
     * @hidden

     */
    NodeSelection.prototype.setRange = function (docElement, range) {
        var selection = this.get(docElement);
        selection.removeAllRanges();
        selection.addRange(range);
    };
    /**
     * setSelectionText method
     * @hidden

     */
    NodeSelection.prototype.setSelectionText = function (docElement, startNode, endNode, startIndex, endIndex) {
        var range = docElement.createRange();
        range.setStart(startNode, startIndex);
        range.setEnd(endNode, endIndex);
        this.setRange(docElement, range);
    };
    /**
     * setSelectionContents method
     * @hidden

     */
    NodeSelection.prototype.setSelectionContents = function (docElement, element) {
        var range = docElement.createRange();
        range.selectNode(element);
        this.setRange(docElement, range);
    };
    /**
     * setSelectionNode method
     * @hidden

     */
    NodeSelection.prototype.setSelectionNode = function (docElement, element) {
        var range = docElement.createRange();
        range.selectNodeContents(element);
        this.setRange(docElement, range);
    };
    /**
     * getSelectedNodes method
     * @hidden

     */
    NodeSelection.prototype.getSelectedNodes = function (docElement) {
        return this.getNodeCollection(this.getRange(docElement));
    };
    /**
     * Clear method
     * @hidden

     */
    NodeSelection.prototype.Clear = function (docElement) {
        this.get(docElement).removeAllRanges();
    };
    /**
     * insertParentNode method
     * @hidden

     */
    NodeSelection.prototype.insertParentNode = function (docElement, newNode, range) {
        range.surroundContents(newNode);
        this.selectRange(docElement, range);
    };
    /**
     * setCursorPoint method
     * @hidden

     */
    NodeSelection.prototype.setCursorPoint = function (docElement, element, point) {
        var range = docElement.createRange();
        var selection = docElement.defaultView.getSelection();
        range.setStart(element, point);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
    };
    return NodeSelection;
}());
export { NodeSelection };

import * as events from '../base/constant';
import { detach } from '@syncfusion/ej2-base';
/**
 * XhtmlValidation module called when set enableXhtml as true
 */
var XhtmlValidation = /** @class */ (function () {
    function XhtmlValidation(parent) {
        this.parent = parent;
        this.addEventListener();
    }
    XhtmlValidation.prototype.addEventListener = function () {
        this.parent.on(events.xhtmlValidation, this.enableXhtmlValidation, this);
        this.parent.on(events.destroy, this.removeEventListener, this);
    };
    XhtmlValidation.prototype.removeEventListener = function () {
        this.parent.off(events.xhtmlValidation, this.enableXhtmlValidation);
        this.parent.off(events.destroy, this.removeEventListener);
    };
    XhtmlValidation.prototype.enableXhtmlValidation = function () {
        if (this.parent.enableXhtml) {
            this.clean(this.parent.inputElement);
            this.AddRootElement();
            this.ImageTags();
            this.removeTags();
            this.RemoveUnsupported();
            this.parent.setProperties({ value: this.parent.inputElement.innerHTML }, true);
        }
    };
    XhtmlValidation.prototype.AddRootElement = function () {
        if ((this.parent.inputElement.childNodes.length === 1 && this.parent.inputElement.firstChild.nodeName !== 'DIV') ||
            this.parent.inputElement.childNodes.length > 1) {
            var parentEle = this.parent.createElement('div');
            while (this.parent.inputElement.childNodes.length > 0) {
                parentEle.appendChild(this.parent.inputElement.childNodes[0]);
            }
            this.parent.inputElement.appendChild(parentEle);
        }
    };
    ;
    XhtmlValidation.prototype.clean = function (node) {
        for (var n = 0; n < node.childNodes.length; n++) {
            var child = node.childNodes[n];
            if (child.nodeType === 8 || child.nodeName === 'V:IMAGE') {
                node.removeChild(child);
                n--;
            }
            else if (child.nodeType === 1) {
                this.clean(child);
            }
        }
        return this.parent.inputElement.innerHTML;
    };
    XhtmlValidation.prototype.ImageTags = function () {
        var imgNodes = this.parent.inputElement.querySelectorAll('IMG');
        for (var i = imgNodes.length - 1; i >= 0; i--) {
            if (!imgNodes[i].hasAttribute('alt')) {
                var img = imgNodes[i];
                img.setAttribute('alt', '');
            }
        }
    };
    ;
    XhtmlValidation.prototype.removeTags = function () {
        var removeAttribute = [['br', 'ul'], ['br', 'ol'], ['table', 'span'], ['div', 'span'], ['p', 'span']];
        for (var i = 0; i < removeAttribute.length; i++) {
            this.RemoveElementNode(removeAttribute[i][0], removeAttribute[i][1]);
        }
    };
    ;
    XhtmlValidation.prototype.RemoveElementNode = function (rmvNode, parentNode) {
        var parentArray = this.parent.inputElement.querySelectorAll(parentNode);
        for (var i = 0; i < parentArray.length; i++) {
            var rmvArray = parentArray[i].querySelectorAll(rmvNode);
            for (var j = rmvArray.length; j > 0; j--) {
                detach(rmvArray[j - 1]);
            }
        }
    };
    ;
    XhtmlValidation.prototype.RemoveUnsupported = function () {
        var underlineEle = this.parent.inputElement.querySelectorAll('u');
        for (var i = underlineEle.length - 1; i >= 0; i--) {
            var spanEle = this.parent.createElement('span');
            spanEle.style.textDecoration = 'underline';
            spanEle.innerHTML = underlineEle[i].innerHTML;
            underlineEle[i].parentNode.insertBefore(spanEle, underlineEle[i]);
            detach(underlineEle[i]);
        }
        var strongEle = this.parent.inputElement.querySelectorAll('strong');
        for (var i = strongEle.length - 1; i >= 0; i--) {
            var boldEle = this.parent.createElement('b');
            boldEle.innerHTML = strongEle[i].innerHTML;
            strongEle[i].parentNode.insertBefore(boldEle, strongEle[i]);
            detach(strongEle[i]);
        }
        var attrArray = ['language', 'role', 'target', 'contenteditable', 'cellspacing',
            'cellpadding', 'border', 'valign', 'colspan'];
        for (var i = 0; i <= attrArray.length; i++) {
            this.RemoveAttributeByName(attrArray[i]);
        }
    };
    ;
    XhtmlValidation.prototype.RemoveAttributeByName = function (attrName) {
        if (this.parent.inputElement.firstChild !== null) {
            if (this.parent.inputElement.firstChild.nodeType !== 3) {
                for (var i = 0; i < this.parent.inputElement.childNodes.length; i++) {
                    var ele = this.parent.inputElement.childNodes[i];
                    if (ele.nodeType !== 3 && ele.nodeName !== 'TABLE' && ele.nodeName !== 'TBODY' && ele.nodeName !== 'THEAD' &&
                        ele.nodeName !== 'TH' && ele.nodeName !== 'TR' && ele.nodeName !== 'TD') {
                        if (ele.hasAttribute(attrName)) {
                            ele.removeAttribute(attrName);
                        }
                        if (ele.hasChildNodes()) {
                            for (var j = 0; j < ele.childNodes.length; j++) {
                                var childEle = ele.childNodes[j];
                                if (childEle.nodeType !== 3 && childEle.nodeName !== 'TABLE' && childEle.nodeName !== 'TBODY' &&
                                    childEle.nodeName !== 'THEAD' && childEle.nodeName !== 'TH' && childEle.nodeName !== 'TR' &&
                                    childEle.nodeName !== 'TD' && childEle.hasAttribute(attrName)) {
                                    childEle.removeAttribute(attrName);
                                }
                                if (childEle.hasChildNodes()) {
                                    for (var k = 0; k < childEle.childNodes.length; k++) {
                                        if (childEle.childNodes[k].nodeType !== 3 && childEle.childNodes[k].nodeName !== 'TABLE' &&
                                            childEle.childNodes[k].nodeName !== 'TBODY' && childEle.childNodes[k].nodeName !== 'THEAD' &&
                                            childEle.childNodes[k].nodeName !== 'TH' && childEle.childNodes[k].nodeName !== 'TR'
                                            && childEle.childNodes[k].nodeName !== 'TD'
                                            && childEle.childNodes[k].hasAttribute(attrName)) {
                                            childEle.childNodes[k].removeAttribute(attrName);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    };
    ;
    return XhtmlValidation;
}());
export { XhtmlValidation };

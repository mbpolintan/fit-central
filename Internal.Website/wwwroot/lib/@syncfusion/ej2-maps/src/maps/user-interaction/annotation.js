import { annotationRendering } from '../index';
import { createElement, isNullOrUndefined, updateBlazorTemplate } from '@syncfusion/ej2-base';
import { getTemplateFunction, getElementOffset, getElementByID } from '../utils/helper';
/**
 * Represents the annotation elements for map.
 */
var Annotations = /** @class */ (function () {
    function Annotations(map) {
        this.map = map;
    }
    Annotations.prototype.renderAnnotationElements = function () {
        var _this = this;
        var secondaryID = this.map.element.id + '_Secondary_Element';
        var annotationGroup = createElement('div', { id: this.map.element.id + '_Annotations_Group' });
        annotationGroup.style.position = 'absolute';
        annotationGroup.style.top = '0px';
        annotationGroup.style.left = '0px';
        this.map.annotations.map(function (annotation, index) {
            if (annotation.content !== null) {
                _this.createAnnotationTemplate(annotationGroup, annotation, index);
            }
        });
        if (annotationGroup.childElementCount > 0 && !(isNullOrUndefined(getElementByID(secondaryID)))) {
            getElementByID(secondaryID).appendChild(annotationGroup);
            for (var i = 0; i < this.map.annotations.length; i++) {
                updateBlazorTemplate(this.map.element.id + '_ContentTemplate_' + i, 'ContentTemplate', this.map.annotations[i]);
            }
        }
    };
    /**
     * To create annotation elements
     */
    Annotations.prototype.createAnnotationTemplate = function (parentElement, annotation, annotationIndex) {
        var _this = this;
        var left;
        var top;
        var templateFn;
        var map = this.map;
        var templateElement;
        var availSize = map.availableSize;
        var id = map.element.id + '_Annotation_' + annotationIndex;
        var childElement = createElement('div', {
            id: map.element.id + '_Annotation_' + annotationIndex, styles: 'position: absolute; z-index:' + annotation.zIndex + ';'
        });
        var argsData = {
            cancel: false, name: annotationRendering, content: annotation.content,
            annotation: annotation
        };
        this.map.trigger(annotationRendering, argsData, function (annotationArgs) {
            if (argsData.cancel) {
                return;
            }
            var blazor = 'Blazor';
            templateFn = getTemplateFunction(argsData.content);
            if (templateFn && (!window[blazor] ? templateFn(_this.map, null, null, _this.map.element.id + '_ContentTemplate_' + annotationIndex).length : {})) {
                templateElement = Array.prototype.slice.call(templateFn(!window[blazor] ? _this.map : {}, null, null, _this.map.element.id + '_ContentTemplate_' + annotationIndex));
                var length_1 = templateElement.length;
                for (var i = 0; i < length_1; i++) {
                    childElement.appendChild(templateElement[i]);
                }
            }
            else {
                childElement.appendChild(createElement('div', {
                    innerHTML: argsData.content
                }));
            }
        });
        var offset = getElementOffset(childElement.cloneNode(true), map.element);
        var elementRect = map.element.getBoundingClientRect();
        var bounds = map.svgObject.getBoundingClientRect();
        left = Math.abs(bounds.left - elementRect.left);
        top = Math.abs(bounds.top - elementRect.top);
        var annotationXValue = (annotation.x.indexOf('%') > -1) ? (availSize.width / 100) * parseFloat(annotation.x) :
            parseFloat(annotation.x);
        var annotationYValue = (annotation.y.indexOf('%') > -1) ? (availSize.height / 100) * parseFloat(annotation.y) :
            parseFloat(annotation.y);
        left = (annotation.horizontalAlignment === 'None') ? (left + annotationXValue) : left;
        top = (annotation.verticalAlignment === 'None') ? (top + annotationYValue) : top;
        switch (annotation.verticalAlignment) {
            case 'Near':
                top = (top + annotationYValue);
                break;
            case 'Center':
                top = (top + annotationYValue) + ((bounds.height / 2) - (offset.height / 2));
                break;
            case 'Far':
                top = (top + bounds.height + annotationYValue) - offset.height;
                break;
        }
        switch (annotation.horizontalAlignment) {
            case 'Near':
                left = (left + annotationXValue);
                break;
            case 'Center':
                left = (left + annotationXValue) + ((bounds.width / 2) - (offset.width / 2));
                break;
            case 'Far':
                left = (left + bounds.width + annotationXValue) - offset.width;
                break;
        }
        childElement.style.left = left + 'px';
        childElement.style.top = top + 'px';
        parentElement.appendChild(childElement);
    };
    /*
   * Get module name.
   */
    Annotations.prototype.getModuleName = function () {
        return 'Annotations';
    };
    /**
     * To destroy the annotation.
     * @return {void}
     * @private
     */
    Annotations.prototype.destroy = function (map) {
        // Destroy method performed here
    };
    return Annotations;
}());
export { Annotations };

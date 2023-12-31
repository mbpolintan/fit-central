import { createHtmlElement, getDiagramElement } from '@syncfusion/ej2-drawings';
import { setAttributeSvg, createSvgElement } from '@syncfusion/ej2-drawings';
/**
 * @hidden
 */
export function renderAdornerLayer(bounds, commonStyle, cavas, index, pdfViewer) {
    var divElement = createHtmlElement('div', {
        'id': pdfViewer.element.id + index + '_diagramAdornerLayer',
        'style': 'width:' + bounds.width + 'px;height:' + bounds.height + 'px;' + commonStyle
    });
    if (!getDiagramElement(divElement.id)) {
        var svgAdornerSvg = createSvg(pdfViewer.element.id + index + '_diagramAdorner_svg', bounds.width, bounds.height);
        svgAdornerSvg.setAttribute('class', 'e-adorner-layer' + index);
        svgAdornerSvg.setAttribute('style', 'pointer-events:none;');
        pdfViewer.adornerSvgLayer = createSvgElement('g', { 'id': pdfViewer.element.id + '_diagramAdorner' });
        pdfViewer.adornerSvgLayer.setAttribute('style', ' pointer-events: all; ');
        svgAdornerSvg.appendChild(pdfViewer.adornerSvgLayer);
        divElement.appendChild(svgAdornerSvg);
        cavas.parentElement.appendChild(divElement);
        var svgSelector = createSvgElement('g', { 'id': pdfViewer.element.id + '_SelectorElement' });
        pdfViewer.adornerSvgLayer.appendChild(svgSelector);
        setAttributeSvg(svgAdornerSvg, { style: 'pointer-events:none;' });
    }
    pdfViewer.viewerBase.applyElementStyles(divElement, index);
}
/**
 * @hidden
 */
export function createSvg(id, width, height) {
    var svgObj = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    setAttributeSvg(svgObj, { 'id': id, 'width': width, 'height': height });
    return svgObj;
}

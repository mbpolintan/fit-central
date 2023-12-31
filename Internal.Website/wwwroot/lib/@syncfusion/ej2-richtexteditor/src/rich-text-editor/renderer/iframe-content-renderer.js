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
import { ContentRender } from '../renderer/content-renderer';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { getEditValue } from '../base/util';
/* tslint:disable */
var IFRAMEHEADER = "\n<!DOCTYPE html> \n    <html>\n         <head>\n            <meta charset='utf-8' /> \n            <style>\n                @charset \"UTF-8\";\n                body {\n                    font-family: \"Roboto\", sans-serif;\n                    font-size: 14px;\n                }\n                html, body{height: 100%;margin: 0;}\n                body.e-cursor{cursor:default}\n                span.e-selected-node\t{background-color: #939393;color: white;}\n                span.e-selected-node.e-highlight {background-color: #1d9dd8;}\n                body{color:#333;word-wrap:break-word;padding: 8px;box-sizing: border-box;}\n                .e-rte-image {border: 0;cursor: pointer;display: block;float: none;height: auto;margin: 5px auto;max-width: 100%;position: relative;}\n                .e-img-caption { display: inline-block; float: none; margin: 5px auto; max-width: 100%;position: relative;}\n                .e-img-caption.e-caption-inline {display: inline-block;float: none;margin: 5px auto;margin-left: 5px;margin-right: 5px;max-width: calc(100% - (2 * 5px));position: relativetext-align: center;vertical-align: bottom;}\n                .e-img-inner {box-sizing: border-box;display: block;font-size: 16px;font-weight: initial;margin: auto;opacity: .9;text-align: center;width: 100%;}\n                .e-img-wrap {display: inline-block;margin: auto;padding: 0;text-align: center;width: 100%;}\n                .e-imgleft {float: left;margin: 0 5px 0 0;text-align: left;}\n                .e-imgright {float: right;margin: 0 0 0 5px;text-align: right;}\n                .e-imgcenter {cursor: pointer;display: block;float: none;height: auto;margin: 5px auto;max-width: 100%;position: relative;}\n                .e-control img:not(.e-resize) {border: 2px solid transparent; z-index: 1000}\n                .e-imginline {display: inline-block;float: none;margin-left: 5px;margin-right: 5px;max-width: calc(100% - (2 * 5px));vertical-align: bottom;}\n                .e-imgbreak {border: 0;cursor: pointer;display: block;float: none;height: auto;margin: 5px auto;max-width: 100%;position: relative;}\n                .e-rte-image.e-img-focus:not(.e-resize) {border: solid 2px #4a90e2;}\n                img::selection { background: transparent;color: transparent;}\n                span.e-rte-imageboxmark {  width: 10px; height: 10px; position: absolute; display: block; background: #4a90e2; border: 1px solid #fff; z-index: 1000;}\n                .e-mob-rte.e-mob-span span.e-rte-imageboxmark { background: #4a90e2; border: 1px solid #fff; }\n                .e-mob-rte span.e-rte-imageboxmark { background: #fff; border: 1px solid #4a90e2; border-radius: 15px; height: 20px; width: 20px; }\n                .e-mob-rte.e-mob-span span.e-rte-imageboxmark { background: #4a90e2; border: 1px solid #fff; }\n                .e-rte-content .e-content img.e-resize { z-index: 1000; }\n                .e-img-caption .e-img-inner { outline: 0; }\n                .e-img-caption .e-rte-image.e-imgright, .e-img-caption .e-rte-image.e-imgleft { float: none; margin: 0;}\n                body{box-sizing: border-box;min-height: 100px;outline: 0 solid transparent;overflow-x: auto;padding: 16px;position: relative;text-align: inherit;z-index: 2;}\n                p{margin: 0 0 10px;margin-bottom: 10px;}\n                li{margin-bottom: 10px;}\n                h1{font-size: 2.17em;font-weight: 400;line-height: 1;margin: 10px 0;}\n                h2{font-size: 1.74em;font-weight: 400;margin: 10px 0;}\n                h3{font-size: 1.31em;font-weight: 400;margin: 10px 0;}\n                h4{font-size: 1em;font-weight: 400;margin: 0;}\n                h5{font-size: 00.8em;font-weight: 400;margin: 0;}\n                h6{font-size: 00.65em;font-weight: 400;margin: 0;}\n                blockquote{margin: 10px 0;margin-left: 0;padding-left: 5px;border-left: solid 2px #5c5c5c;}\n                pre{background-color: inherit;border: 0;border-radius: 0;color: #333;font-size: inherit;line-height: inherit;margin: 0 0 10px;overflow: visible;padding: 0;white-space: pre-wrap;word-break: inherit;word-wrap: break-word;}\n                strong, b{font-weight: 700;}\n                a{text-decoration: none;user-select: auto;}\n                a:hover{text-decoration: underline;};\n                p:last-child, pre:last-child, blockquote:last-child{margin-bottom: 0;}\n                h3+h4, h4+h5, h5+h6{margin-top: 00.6em;}\n                ul:last-child{margin-bottom: 0;}\n                table { border-collapse: collapse; empty-cells: show;}\n                table td,table th {border: 1px solid #BDBDBD; height: 20px; vertical-align: middle;}\n                table.e-alternate-border tbody tr:nth-child(2n) {background-color: #F5F5F5;}\n                table th {background-color: #E0E0E0;}\n                table.e-dashed-border td,table.e-dashed-border th { border: 1px dashed #BDBDBD} \n                table .e-cell-select {border: 1px double #4a90e2;}\n                span.e-table-box { cursor: nwse-resize; display: block; height: 10px; position: absolute; width: 10px; }\n                span.e-table-box.e-rmob {height: 14px;width: 14px;}\n                .e-row-resize, .e-column-resize { background-color: transparent; background-repeat: repeat; bottom: 0;cursor: col-resize;height: 1px;overflow: visible;position: absolute;width: 1px; }\n                .e-row-resize { cursor: row-resize; height: 1px;}\n                .e-table-rhelper { cursor: col-resize; opacity: .87;position: absolute;}\n                .e-table-rhelper.e-column-helper { width: 1px; }\n                .e-table-rhelper.e-row-helper {height: 1px;}\n                .e-reicon::before { border-bottom: 6px solid transparent; border-right: 6px solid; border-top: 6px solid transparent; content: ''; display: block; height: 0; position: absolute; right: 4px; top: 4px; width: 20px; }\n                .e-reicon::after { border-bottom: 6px solid transparent; border-left: 6px solid; border-top: 6px solid transparent; content: ''; display: block; height: 0; left: 4px; position: absolute; top: 4px; width: 20px; z-index: 3; }\n                .e-row-helper.e-reicon::after { top: 10px; transform: rotate(90deg); }\n                .e-row-helper.e-reicon::before { left: 4px; top: -20px; transform: rotate(90deg); }\n                span.e-table-box { background-color: #ffffff; border: 1px solid #BDBDBD; }\n                span.e-table-box.e-rbox-select { background-color: #BDBDBD; border: 1px solid #BDBDBD; }\n                .e-table-rhelper { background-color: #4a90e2;}\n                .e-rtl { direction: rtl; }\n            </style>\n        </head>";
/* tslint:enable */
/**
 * Content module is used to render Rich Text Editor content
 * @hidden

 */
var IframeContentRender = /** @class */ (function (_super) {
    __extends(IframeContentRender, _super);
    function IframeContentRender() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * The function is used to render Rich Text Editor iframe
     * @hidden

     */
    IframeContentRender.prototype.renderPanel = function () {
        var rteObj = this.parent;
        var rteContent = getEditValue(rteObj.value, rteObj);
        var iFrameBodyContent = '<body spellcheck="false" autocorrect="off" contenteditable="true">' +
            rteContent + '</body></html>';
        var iFrameContent = IFRAMEHEADER + iFrameBodyContent;
        var iframe = this.parent.createElement('iframe', {
            innerHTML: iFrameContent,
            id: this.parent.getID() + '_rte-view',
            className: 'e-rte-content',
            styles: 'display:block;'
        });
        this.setPanel(iframe);
        rteObj.element.appendChild(iframe);
        iframe.contentDocument.body.id = this.parent.getID() + '_rte-edit-view';
        iframe.contentDocument.body.setAttribute('aria-owns', this.parent.getID());
        iframe.contentDocument.open();
        iFrameContent = this.setThemeColor(iFrameContent, { color: '#333' });
        iframe.contentDocument.write(iFrameContent);
        iframe.contentDocument.close();
        if (rteObj.enableRtl) {
            this.contentPanel.contentDocument.body.setAttribute('class', 'e-rtl');
        }
    };
    IframeContentRender.prototype.setThemeColor = function (content, styles) {
        var fontColor = getComputedStyle(this.parent.element, '.e-richtexteditor').getPropertyValue('color');
        return content.replace(styles.color, fontColor);
    };
    /**
     * Get the editable element of RichTextEditor
     * @return {Element}
     * @hidden

     */
    IframeContentRender.prototype.getEditPanel = function () {
        var editNode;
        if (!isNullOrUndefined(this.contentPanel.contentDocument)) {
            editNode = this.contentPanel.contentDocument.body;
        }
        else {
            editNode = this.parent.inputElement;
        }
        return editNode;
    };
    /**
     * Get the document of RichTextEditor
     * @param  {Document}
     * @hidden

     */
    IframeContentRender.prototype.getDocument = function () {
        return this.getEditPanel().ownerDocument;
    };
    return IframeContentRender;
}(ContentRender));
export { IframeContentRender };

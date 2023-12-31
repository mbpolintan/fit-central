import { IToolsItemConfigs, IRichTextEditor } from '../base/interface';
import { IToolbarItems, IDropDownItemModel, ISetToolbarStatusArgs, IToolbarItemModel } from './interface';
import { BaseToolbar } from '../actions/base-toolbar';
import { ServiceLocator } from '../services/service-locator';
export declare function getIndex(val: string, items: (string | IToolbarItems)[]): number;
export declare function hasClass(element: Element | HTMLElement, className: string): boolean;
export declare function getDropDownValue(items: IDropDownItemModel[], value: string, type: string, returnType: string): string;
export declare function isIDevice(): boolean;
export declare function getFormattedFontSize(value: string): string;
export declare function pageYOffset(e: MouseEvent | Touch, parentElement: HTMLElement, isIFrame: boolean): number;
export declare function getTooltipText(item: string, serviceLocator: ServiceLocator): string;
export declare function setToolbarStatus(e: ISetToolbarStatusArgs, isPopToolbar: boolean): void;
export declare function getCollection(items: string | string[]): string[];
export declare function getTBarItemsIndex(items: string[], toolbarItems: IToolbarItemModel[]): number[];
export declare function updateUndoRedoStatus(baseToolbar: BaseToolbar, undoRedoStatus: {
    [key: string]: boolean;
}): void;
/**
 * To dispatch the event manually
 * @hidden

 */
export declare function dispatchEvent(element: Element | HTMLDocument, type: string): void;
export declare function parseHtml(value: string): DocumentFragment;
export declare function getTextNodesUnder(docElement: Document, node: Element): Node[];
export declare function toObjectLowerCase(obj: {
    [key: string]: IToolsItemConfigs;
}): {
    [key: string]: IToolsItemConfigs;
};
export declare function getEditValue(value: string, rteObj: IRichTextEditor): string;
export declare function updateTextNode(value: string): string;
export declare function isEditableValueEmpty(value: string): boolean;
export declare function decode(value: string): string;
export declare function sanitizeHelper(value: string, parent?: IRichTextEditor): string;
export declare function convertToBlob(dataUrl: string): Blob;

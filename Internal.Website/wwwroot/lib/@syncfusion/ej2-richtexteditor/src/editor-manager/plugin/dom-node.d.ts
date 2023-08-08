import { NodeSelection } from './../../selection/index';
export declare const markerClassName: {
    [key: string]: string;
};
/**
 * DOMNode internal plugin
 * @hidden

 */
export declare class DOMNode {
    private parent;
    private currentDocument;
    private nodeSelection;
    /**
     * Constructor for creating the DOMNode plugin
     * @hidden

     */
    constructor(parent: Element, currentDocument: Document);
    /**
     * contents method
     * @hidden

     */
    contents(element: Element): Node[];
    /**
     * isBlockNode method
     * @hidden

     */
    isBlockNode(element: Element): boolean;
    /**
     * isLink method
     * @hidden

     */
    isLink(element: Element): boolean;
    /**
     * blockParentNode method
     * @hidden

     */
    blockParentNode(element: Element): Element;
    /**
     * rawAttributes method
     * @hidden

     */
    rawAttributes(element: Element): {
        [key: string]: string;
    };
    /**
     * attributes method
     * @hidden

     */
    attributes(element?: Element): string;
    /**
     * clearAttributes method
     * @hidden

     */
    clearAttributes(element: Element): void;
    /**
     * openTagString method
     * @hidden

     */
    openTagString(element: Element): string;
    /**
     * closeTagString method
     * @hidden

     */
    closeTagString(element: Element): string;
    /**
     * createTagString method
     * @hidden

     */
    createTagString(tagName: string, relativeElement: Element, innerHTML: string): string;
    /**
     * isList method
     * @hidden

     */
    isList(element: Element): boolean;
    /**
     * isElement method
     * @hidden

     */
    isElement(element: Element): boolean;
    /**
     * isEditable method
     * @hidden

     */
    isEditable(element: Element): boolean;
    /**
     * hasClass method
     * @hidden

     */
    hasClass(element: Element, className: string): boolean;
    /**
     * replaceWith method
     * @hidden

     */
    replaceWith(element: Element, value: string): void;
    /**
     * parseHTMLFragment method
     * @hidden

     */
    parseHTMLFragment(value: string): Element;
    /**
     * wrap method
     * @hidden

     */
    wrap(element: Element, wrapper: Element): Element;
    /**
     * insertAfter method
     * @hidden

     */
    insertAfter(newNode: Element, referenceNode: Element): void;
    /**
     * wrapInner method
     * @hidden

     */
    wrapInner(parent: Element, wrapper: Element): Element;
    /**
     * unWrap method
     * @hidden

     */
    unWrap(element: Element): Element[];
    /**
     * getSelectedNode method
     * @hidden

     */
    getSelectedNode(element: Element, index: number): Element;
    /**
     * nodeFinds method
     * @hidden

     */
    nodeFinds(element: Element, elements: Element[]): Element[];
    /**
     * isEditorArea method
     * @hidden

     */
    isEditorArea(): boolean;
    /**
     * getRangePoint method
     * @hidden

     */
    getRangePoint(point?: number): Range | Range[];
    getSelection(): Selection;
    /**
     * getPreviousNode method
     * @hidden

     */
    getPreviousNode(element: Element): Element;
    /**
     * encode method
     * @hidden

     */
    encode(value: string): string;
    /**
     * saveMarker method
     * @hidden

     */
    saveMarker(save: NodeSelection, action?: string): NodeSelection;
    private marker;
    /**
     * setMarker method
     * @hidden

     */
    setMarker(save: NodeSelection): void;
    /**
     * ensureSelfClosingTag method
     * @hidden

     */
    ensureSelfClosingTag(start: Element, className: string, range: Range): void;
    /**
     * createTempNode method
     * @hidden

     */
    createTempNode(element: Element): Element;
    /**
     * getImageTagInSelection method
     * @hidden

     */
    getImageTagInSelection(): NodeListOf<HTMLImageElement>;
    /**
     * blockNodes method
     * @hidden

     */
    blockNodes(): Node[];
    private ignoreTableTag;
}

/**
 * `Selection` module is used to handle RTE Selections.
 */
export declare class NodeSelection {
    range: Range;
    rootNode: Node;
    body: HTMLBodyElement;
    html: string;
    startContainer: number[];
    endContainer: number[];
    startOffset: number;
    endOffset: number;
    startNodeName: string[];
    endNodeName: string[];
    private saveInstance;
    private documentFromRange;
    getRange(docElement: Document): Range;
    /**
     * get method
     * @hidden

     */
    get(docElement: Document): Selection;
    /**
     * save method
     * @hidden

     */
    save(range: Range, docElement: Document): NodeSelection;
    /**
     * getIndex method
     * @hidden

     */
    getIndex(node: Node): number;
    private isChildNode;
    private getNode;
    /**
     * getNodeCollection method
     * @hidden

     */
    getNodeCollection(range: Range): Node[];
    /**
     * getParentNodeCollection method
     * @hidden

     */
    getParentNodeCollection(range: Range): Node[];
    /**
     * getParentNodes method
     * @hidden

     */
    getParentNodes(nodeCollection: Node[], range: Range): Node[];
    /**
     * getSelectionNodeCollection method
     * @hidden

     */
    getSelectionNodeCollection(range: Range): Node[];
    /**
     * getSelectionNodeCollection along with BR node method
     * @hidden

     */
    getSelectionNodeCollectionBr(range: Range): Node[];
    /**
     * getParentNodes method
     * @hidden

     */
    getSelectionNodes(nodeCollection: Node[]): Node[];
    /**
     * Get selection text nodes with br method.
     * @hidden

     */
    getSelectionNodesBr(nodeCollection: Node[]): Node[];
    /**
     * getInsertNodeCollection method
     * @hidden

     */
    getInsertNodeCollection(range: Range): Node[];
    /**
     * getInsertNodes method
     * @hidden

     */
    getInsertNodes(nodeCollection: Node[]): Node[];
    /**
     * getNodeArray method
     * @hidden

     */
    getNodeArray(node: Node, isStart: boolean, root?: Document): number[];
    private setRangePoint;
    /**
     * restore method
     * @hidden

     */
    restore(): Range;
    selectRange(docElement: Document, range: Range): void;
    /**
     * setRange method
     * @hidden

     */
    setRange(docElement: Document, range: Range): void;
    /**
     * setSelectionText method
     * @hidden

     */
    setSelectionText(docElement: Document, startNode: Node, endNode: Node, startIndex: number, endIndex: number): void;
    /**
     * setSelectionContents method
     * @hidden

     */
    setSelectionContents(docElement: Document, element: Node): void;
    /**
     * setSelectionNode method
     * @hidden

     */
    setSelectionNode(docElement: Document, element: Node): void;
    /**
     * getSelectedNodes method
     * @hidden

     */
    getSelectedNodes(docElement: Document): Node[];
    /**
     * Clear method
     * @hidden

     */
    Clear(docElement: Document): void;
    /**
     * insertParentNode method
     * @hidden

     */
    insertParentNode(docElement: Document, newNode: Node, range: Range): void;
    /**
     * setCursorPoint method
     * @hidden

     */
    setCursorPoint(docElement: Document, element: Element, point: number): void;
}

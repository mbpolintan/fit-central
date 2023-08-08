/**
 * Split the Node based on selection
 * @hidden

 */
export declare class NodeCutter {
    position: number;
    private nodeSelection;
    /**
     * GetSpliceNode method
     * @hidden

     */
    GetSpliceNode(range: Range, node: HTMLElement): Node;
    /**
     * @hidden

     */
    SplitNode(range: Range, node: HTMLElement, isCollapsed: boolean): HTMLElement;
    private isImgElm;
    private spliceEmptyNode;
    private GetCursorStart;
    /**
     * GetCursorRange method
     * @hidden

     */
    GetCursorRange(docElement: Document, range: Range, node: Node): Range;
    /**
     * GetCursorNode method
     * @hidden

     */
    GetCursorNode(docElement: Document, range: Range, node: Node): Node;
    /**
     * TrimLineBreak method
     * @hidden

     */
    TrimLineBreak(line: string): string;
}

/**
 * Is formatted or not.
 * @hidden

 */
export declare class IsFormatted {
    static inlineTags: string[];
    /**
     * getFormattedNode method
     * @hidden

     */
    getFormattedNode(node: Node, format: string, endNode: Node): Node;
    private getFormatParent;
    private isFormattedNode;
    /**
     * isBold method
     * @hidden

     */
    static isBold(node: Node): boolean;
    /**
     * isItalic method
     * @hidden

     */
    static isItalic(node: Node): boolean;
    /**
     * isUnderline method
     * @hidden

     */
    static isUnderline(node: Node): boolean;
    /**
     * isStrikethrough method
     * @hidden

     */
    static isStrikethrough(node: Node): boolean;
    /**
     * isSuperscript method
     * @hidden

     */
    static isSuperscript(node: Node): boolean;
    /**
     * isSubscript method
     * @hidden

     */
    static isSubscript(node: Node): boolean;
    private isFontColor;
    private isBackgroundColor;
    private isFontSize;
    private isFontName;
}

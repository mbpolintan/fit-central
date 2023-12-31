import { Spreadsheet } from '../base/index';
import { IOffset } from '../common/index';
/**
 * The `Scroll` module is used to handle scrolling behavior.
 * @hidden
 */
export declare class Scroll {
    private parent;
    private onScroll;
    offset: {
        left: IOffset;
        top: IOffset;
    };
    private topIndex;
    private leftIndex;
    private initScrollValue;
    /** @hidden */
    prevScroll: {
        scrollLeft: number;
        scrollTop: number;
    };
    /**
     * Constructor for the Spreadsheet scroll module.
     * @private
     */
    constructor(parent: Spreadsheet);
    private onContentScroll;
    private updateNonVirtualRows;
    private updateNonVirtualCols;
    private updateTopLeftCell;
    private getRowOffset;
    private getColOffset;
    private contentLoaded;
    private setScrollEvent;
    private initProps;
    private getThreshold;
    /**
     * @hidden
     */
    setPadding(): void;
    private addEventListener;
    private destroy;
    private removeEventListener;
}

import { Spreadsheet } from '../base/index';
/**
 * VirtualScroll module
 * @hidden
 */
export declare class VirtualScroll {
    private parent;
    private rowHeader;
    private colHeader;
    private content;
    private translateX;
    private translateY;
    private scroll;
    constructor(parent: Spreadsheet);
    private createVirtualElement;
    private initScroll;
    private setScrollCount;
    private getRowAddress;
    private getColAddress;
    private updateScrollCount;
    private onVerticalScroll;
    private skipHiddenIdx;
    private hiddenCount;
    private checkLastIdx;
    private onHorizontalScroll;
    private getThresholdHeight;
    private getThresholdWidth;
    private translate;
    private updateColumnWidth;
    private updateUsedRange;
    private createHeaderElement;
    private getVTrackHeight;
    private updateVTrackHeight;
    private updateVTrackWidth;
    private updateVTrack;
    private deInitProps;
    private updateScrollProps;
    private sliceScrollProps;
    private addEventListener;
    private destroy;
    private removeEventListener;
}

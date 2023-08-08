import { FreezeContentRender, FreezeRender } from './freeze-renderer';
import { IGrid, IRenderer, NotifyArgs } from '../base/interface';
import { ServiceLocator } from '../services/service-locator';
import { Row } from '../models/row';
import { Column } from '../models/column';
/**
 * VirtualFreezeRenderer is used to render the virtual table within the frozen table
 * @hidden
 */
export declare class VirtualFreezeRenderer extends FreezeContentRender implements IRenderer {
    private serviceLoc;
    constructor(parent?: IGrid, locator?: ServiceLocator);
    private freezeRowGenerator;
    private virtualRenderer;
    private frzeeLoad;
    private firstPageRecords;
    /**
     * @hidden
     */
    renderTable(): void;
    /**
     * @hidden
     */
    appendContent(target: HTMLElement, newChild: DocumentFragment, e: NotifyArgs): void;
    /**
     * @hidden
     */
    generateRows(data: Object[], notifyArgs?: NotifyArgs): Row<Column>[];
    /**
     * @hidden
     */
    getRowByIndex(index: number): Element;
    /**
     * @hidden
     */
    getMovableRowByIndex(index: number): Element;
    /**
     * @hidden
     */
    getMovableRows(): Row<Column>[] | HTMLCollectionOf<HTMLTableRowElement>;
    /**
     * @hidden
     */
    getRows(): Row<Column>[] | HTMLCollectionOf<HTMLTableRowElement>;
    /**
     * @hidden
     */
    getColGroup(): Element;
    /**
     * @hidden
     */
    getReorderedFrozenRows(args: NotifyArgs): Row<Column>[];
    private splitReorderedRows;
    private isXaxis;
    private getHeaderCells;
    private getVirtualFreezeHeader;
    private ensureFrozenCols;
    /**
     * @hidden
     */
    getRowObjectByIndex(index: number): Object;
}
export declare class VirtualFreezeHdrRenderer extends FreezeRender implements IRenderer {
    private serviceLoc;
    constructor(parent?: IGrid, locator?: ServiceLocator);
    private virtualHdrRenderer;
    private virtualEle;
    /**
     * @hidden
     */
    renderTable(): void;
    private rfhMovable;
    /**
     * @hidden
     */
    getTable(): Element;
}

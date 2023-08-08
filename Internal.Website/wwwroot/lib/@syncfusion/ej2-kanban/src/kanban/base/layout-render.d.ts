import { Kanban } from '../base/kanban';
import { HeaderArgs } from '../base/interface';
import { MobileLayout } from './mobile-layout';
/**
 * Kanban layout rendering module
 */
export declare class LayoutRender extends MobileLayout {
    parent: Kanban;
    kanbanRows: HeaderArgs[];
    columnKeys: string[];
    swimlaneIndex: number;
    scrollLeft: number;
    swimlaneRow: HeaderArgs[];
    private columnData;
    private swimlaneData;
    /**
     * Constructor for layout module
     */
    constructor(parent: Kanban);
    private initRender;
    private renderHeader;
    private renderContent;
    private initializeSwimlaneTree;
    private renderSwimlaneRow;
    private renderCards;
    private renderColGroup;
    private getRows;
    private createStackedRow;
    private scrollUiUpdate;
    private onContentScroll;
    private onAdaptiveScroll;
    private isColumnVisible;
    private renderLimits;
    private renderValidation;
    private getColumnData;
    private sortCategory;
    private sortOrder;
    private documentClick;
    disableAttributeSelection(cards: HTMLElement[] | Element): void;
    getColumnCards(data?: Object[]): {
        [key: string]: Object[];
    };
    getSwimlaneCards(): {
        [key: string]: Object[];
    };
    refreshHeaders(): void;
    refreshCards(): void;
    wireEvents(): void;
    unWireEvents(): void;
    wireDragEvent(): void;
    unWireDragEvent(): void;
    destroy(): void;
}

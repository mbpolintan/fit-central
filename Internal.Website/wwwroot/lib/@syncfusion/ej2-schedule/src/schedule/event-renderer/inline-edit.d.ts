import { Schedule } from '../base/schedule';
/**
 * Inline Edit interactions
 */
export declare class InlineEdit {
    private parent;
    /**
     * Constructor for InlineEdit
     */
    constructor(parent: Schedule);
    private inlineEdit;
    private cellEdit;
    private eventEdit;
    private createVerticalViewInline;
    private createMonthViewInline;
    private createTimelineViewInline;
    private getEventDaysCount;
    private generateEventData;
    documentClick(): void;
    inlineCrudActions(target: HTMLTableCellElement): void;
    createInlineAppointmentElement(inlineData?: {
        [key: string]: Object;
    }): HTMLElement;
    removeInlineAppointmentElement(): void;
    destroy(): void;
}

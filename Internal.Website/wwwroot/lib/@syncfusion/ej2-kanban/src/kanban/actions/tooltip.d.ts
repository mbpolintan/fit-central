import { Tooltip } from '@syncfusion/ej2-popups';
import { Kanban } from '../base';
/**
 * Tooltip for Kanban board
 */
export declare class KanbanTooltip {
    private parent;
    tooltipObj: Tooltip;
    constructor(parent: Kanban);
    private renderTooltip;
    private onBeforeRender;
    destroy(): void;
}

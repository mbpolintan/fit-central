import { Schedule } from '../base/schedule';
import { View } from '../base/type';
/**
 * Schedule DOM rendering
 */
export declare class Render {
    parent: Schedule;
    /**
     * Constructor for render
     */
    constructor(parent: Schedule);
    render(viewName: View, isDataRefresh?: boolean): void;
    private initializeLayout;
    updateHeader(): void;
    updateLabelText(view: string): void;
    refreshDataManager(): void;
    private dataManagerSuccess;
    dataManagerFailure(e: {
        result: Object[];
    }): void;
}

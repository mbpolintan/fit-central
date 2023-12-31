import { TreeGrid } from './treegrid';
import { BeforeDataBoundArgs } from '@syncfusion/ej2-grids';
/**
 * Internal dataoperations for tree grid
 * @hidden
 */
export declare class DataManipulation {
    private taskIds;
    private parentItems;
    private zerothLevelData;
    private storedIndex;
    private batchChanges;
    private addedRecords;
    private parent;
    private dataResults;
    private sortedData;
    private hierarchyData;
    private isSelfReference;
    private isSortAction;
    constructor(grid: TreeGrid);
    /**
     * @hidden
     */
    addEventListener(): void;
    /**
     * @hidden
     */
    removeEventListener(): void;
    /**
     * To destroy the dataModule
     * @return {void}
     * @hidden
     */
    destroy(): void;
    /** @hidden */
    isRemote(): boolean;
    /**
     * Function to manipulate datasource
     * @hidden
     */
    convertToFlatData(data: Object): void;
    private convertJSONData;
    private selfReferenceUpdate;
    /**
     * Function to update the zeroth level parent records in remote binding
     * @hidden
     */
    private updateParentRemoteData;
    /**
     * Function to manipulate datasource
     * @hidden
     */
    private collectExpandingRecs;
    private fetchRemoteChildData;
    private remoteVirtualAction;
    private beginSorting;
    private createRecords;
    /**
     * Function to perform filtering/sorting action for local data
     * @hidden
     */
    dataProcessor(args?: BeforeDataBoundArgs): void;
    private paging;
    /**
     * update for datasource
     */
    private updateData;
    private updateAction;
}

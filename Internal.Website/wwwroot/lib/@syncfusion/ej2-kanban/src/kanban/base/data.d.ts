import { DataManager, Query } from '@syncfusion/ej2-data';
import { Kanban } from '../base/kanban';
/**
 * data module is used to generate query and data source.
 * @hidden
 */
export declare class Data {
    private parent;
    dataManager: DataManager;
    private query;
    /**
     * Constructor for data module
     * @private
     */
    constructor(parent: Kanban);
    /**
     * The function used to initialize dataManager and query
     * @return {void}
     * @private
     */
    private initDataManager;
    /**
     * The function used to generate updated Query from schedule model
     * @return {void}
     * @private
     */
    generateQuery(): Query;
    /**
     * The function used to get dataSource by executing given Query
     * @param  {Query} query - A Query that specifies to generate dataSource
     * @return {void}
     * @private
     */
    private getData;
    /**
     * The function is used to send the request and get response form datamanager
     * @return {void}
     * @private
     */
    refreshDataManager(): void;
    /**
     * The function is used to handle the success response from dataManager
     * @return {void}
     * @private
     */
    private dataManagerSuccess;
    /**
     * The function is used to handle the failure response from dataManager
     * @return {void}
     * @private
     */
    private dataManagerFailure;
}

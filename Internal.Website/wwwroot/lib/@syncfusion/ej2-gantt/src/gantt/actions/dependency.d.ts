/**
 * Predecessor calculation goes here
 */
import { IGanttData, ITaskData, IPredecessor, IConnectorLineObject } from '../base/interface';
import { Gantt } from '../base/gantt';
export declare class Dependency {
    private parent;
    private dateValidateModule;
    constructor(gantt: Gantt);
    /**
     * Method to populate predecessor collections in records
     * @private
     */
    ensurePredecessorCollection(): void;
    /**
     *
     * @param ganttData
     * @param ganttProp
     * @private
     */
    ensurePredecessorCollectionHelper(ganttData: IGanttData, ganttProp: ITaskData): void;
    /**
     * To render unscheduled empty task with 1 day duration during predecessor map
     * @private
     */
    updateUnscheduledDependency(data: IGanttData): void;
    /**
     *
     * @param ganttData Method to check parent dependency in predecessor
     * @param fromId
     */
    private checkIsParent;
    /**
     * Get predecessor collection object from predecessor string value
     * @param predecessorValue
     * @param ganttRecord
     * @private
     */
    calculatePredecessor(predecessorValue: string | number, ganttRecord?: IGanttData): IPredecessor[];
    /**
     * Get predecessor value as string with offset values
     * @param data
     * @private
     */
    getPredecessorStringValue(data: IGanttData): string;
    private getOffsetDurationUnit;
    /**
     * Update predecessor object in both from and to tasks collection
     * @private
     */
    updatePredecessors(): void;
    /**
     * To update predecessor collection to successor tasks
     * @param ganttRecord
     * @param predecessorsCollection
     * @private
     */
    updatePredecessorHelper(ganttRecord: IGanttData, predecessorsCollection?: IGanttData[]): void;
    /**
     * Method to validate date of tasks with predecessor values for all records
     * @private
     */
    updatedRecordsDateByPredecessor(): void;
    /**
     * To validate task date values with dependency
     * @param ganttRecord
     * @private
     */
    validatePredecessorDates(ganttRecord: IGanttData): void;
    /**
     * Method to validate task with predecessor
     * @param parentGanttRecord
     * @param childGanttRecord
     */
    private validateChildGanttRecord;
    /**
     *
     * @param ganttRecord
     * @param predecessorsCollection
     * @private
     */
    getPredecessorDate(ganttRecord: IGanttData, predecessorsCollection: IPredecessor[]): Date;
    /**
     * Get validated start date as per predecessor type
     * @param ganttRecord
     * @param parentGanttRecord
     * @param predecessor
     */
    private getValidatedStartDate;
    /**
     *
     * @param date
     * @param predecessor
     * @param isMilestone
     * @param record
     */
    private updateDateByOffset;
    /**
     *
     * @param records
     * @private
     */
    createConnectorLinesCollection(records?: IGanttData[]): void;
    /**
     *
     * @param predecessorsCollection
     */
    private addPredecessorsCollection;
    /**
     * To refresh connector line object collections
     * @param parentGanttRecord
     * @param childGanttRecord
     * @param predecessor
     * @private
     */
    updateConnectorLineObject(parentGanttRecord: IGanttData, childGanttRecord: IGanttData, predecessor: IPredecessor): IConnectorLineObject;
    /**
     *
     * @param childGanttRecord
     * @param previousValue
     * @param validationOn
     * @private
     */
    validatePredecessor(childGanttRecord: IGanttData, previousValue: IPredecessor[], validationOn: string): void;
    /**
     * Method to get validate able predecessor alone from record
     * @param record
     * @private
     */
    getValidPredecessor(record: IGanttData): IPredecessor[];
}

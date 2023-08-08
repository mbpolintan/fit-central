import { extend } from '@syncfusion/ej2-base';
import { DataManager, Query } from '@syncfusion/ej2-data';
import * as events from '../base/constant';
/**
 * data module is used to generate query and data source.
 * @hidden
 */
var Data = /** @class */ (function () {
    /**
     * Constructor for data module
     * @private
     */
    function Data(parent) {
        this.parent = parent;
        this.initDataManager(parent.dataSource, parent.query);
        this.refreshDataManager();
    }
    /**
     * The function used to initialize dataManager and query
     * @return {void}
     * @private
     */
    Data.prototype.initDataManager = function (dataSource, query) {
        this.dataManager = dataSource instanceof DataManager ? dataSource : new DataManager(dataSource);
        this.query = query instanceof Query ? query : new Query();
    };
    /**
     * The function used to generate updated Query from schedule model
     * @return {void}
     * @private
     */
    Data.prototype.generateQuery = function () {
        return this.query.clone();
    };
    /**
     * The function used to get dataSource by executing given Query
     * @param  {Query} query - A Query that specifies to generate dataSource
     * @return {void}
     * @private
     */
    Data.prototype.getData = function (query) {
        return this.dataManager.executeQuery(query);
    };
    /**
     * The function is used to send the request and get response form datamanager
     * @return {void}
     * @private
     */
    Data.prototype.refreshDataManager = function () {
        var _this = this;
        var dataManager = this.getData(this.generateQuery());
        dataManager.then(function (e) { return _this.dataManagerSuccess(e); }).catch(function (e) { return _this.dataManagerFailure(e); });
    };
    /**
     * The function is used to handle the success response from dataManager
     * @return {void}
     * @private
     */
    Data.prototype.dataManagerSuccess = function (e) {
        var _this = this;
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.trigger(events.dataBinding, e, function (args) {
            var resultData = extend([], args.result, null, true);
            _this.parent.kanbanData = resultData;
            _this.parent.notify(events.dataReady, { processedData: resultData });
            _this.parent.trigger(events.dataBound, null, function () { return _this.parent.hideSpinner(); });
        });
    };
    /**
     * The function is used to handle the failure response from dataManager
     * @return {void}
     * @private
     */
    Data.prototype.dataManagerFailure = function (e) {
        var _this = this;
        if (this.parent.isDestroyed) {
            return;
        }
        this.parent.trigger(events.actionFailure, { error: e }, function () { return _this.parent.hideSpinner(); });
    };
    return Data;
}());
export { Data };

import * as events from '../base/constant';
/**
 * Kanban CRUD operations
 */
var Crud = /** @class */ (function () {
    function Crud(parent) {
        this.parent = parent;
        this.keyField = this.parent.cardSettings.headerField;
    }
    Crud.prototype.getQuery = function () {
        return this.parent.dataModule.generateQuery();
    };
    Crud.prototype.getTable = function () {
        if (this.parent.query) {
            var query = this.parent.query.clone();
            return query.fromTable;
        }
        return null;
    };
    Crud.prototype.refreshData = function (args) {
        var _this = this;
        var actionArgs = {
            requestType: args.requestType, cancel: false, addedRecords: args.addedRecords,
            changedRecords: args.changedRecords, deletedRecords: args.deletedRecords
        };
        if (this.parent.dataModule.dataManager.dataSource.offline) {
            this.parent.trigger(events.actionComplete, actionArgs, function (offlineArgs) {
                if (!offlineArgs.cancel) {
                    _this.parent.dataModule.refreshDataManager();
                }
            });
        }
        else {
            args.promise.then(function (e) {
                if (_this.parent.isDestroyed) {
                    return;
                }
                _this.parent.trigger(events.actionComplete, actionArgs, function (onlineArgs) {
                    if (!onlineArgs.cancel) {
                        _this.parent.dataModule.refreshDataManager();
                    }
                });
            }).catch(function (e) {
                if (_this.parent.isDestroyed) {
                    return;
                }
                _this.parent.trigger(events.actionFailure, { error: e });
            });
        }
    };
    Crud.prototype.addCard = function (cardData) {
        var _this = this;
        var args = {
            cancel: false, requestType: 'cardCreate', addedRecords: (cardData instanceof Array) ? cardData : [cardData],
            changedRecords: [], deletedRecords: []
        };
        this.parent.trigger(events.actionBegin, args, function (addArgs) {
            if (!addArgs.cancel) {
                _this.parent.showSpinner();
                var promise = null;
                var modifiedData = [];
                if (_this.parent.sortSettings.field && _this.parent.sortSettings.sortBy === 'Index') {
                    cardData instanceof Array ? modifiedData = cardData : modifiedData.push(cardData);
                    if (!_this.parent.isBlazorRender()) {
                        modifiedData = _this.priorityOrder(modifiedData, addArgs);
                    }
                }
                var addedRecords = (cardData instanceof Array) ? cardData : [cardData];
                var changedRecords = (_this.parent.sortSettings.field && _this.parent.sortSettings.sortBy === 'Index') ? modifiedData : [];
                var editParms = { addedRecords: addedRecords, changedRecords: changedRecords, deletedRecords: [] };
                if (cardData instanceof Array || modifiedData.length > 0) {
                    if (!_this.parent.isBlazorRender()) {
                        promise = _this.parent.dataModule.dataManager.saveChanges(editParms, _this.keyField, _this.getTable(), _this.getQuery());
                    }
                    else {
                        // tslint:disable-next-line
                        _this.parent.interopAdaptor.invokeMethodAsync('AddCards', { AddedRecords: addedRecords, ChangedRecords: changedRecords }, _this.keyField);
                    }
                }
                else {
                    if (!_this.parent.isBlazorRender()) {
                        promise = _this.parent.dataModule.dataManager.insert(cardData, _this.getTable(), _this.getQuery());
                    }
                    else {
                        // tslint:disable-next-line
                        _this.parent.interopAdaptor.invokeMethodAsync('AddCard', { Record: cardData });
                    }
                }
                if (!_this.parent.isBlazorRender()) {
                    var crudArgs = {
                        requestType: 'cardCreated', cancel: false, promise: promise, addedRecords: editParms.addedRecords,
                        changedRecords: editParms.changedRecords, deletedRecords: editParms.deletedRecords
                    };
                    _this.refreshData(crudArgs);
                }
            }
        });
    };
    Crud.prototype.updateCard = function (cardData) {
        var _this = this;
        var args = {
            requestType: 'cardChange', cancel: false, addedRecords: [],
            changedRecords: (cardData instanceof Array) ? cardData : [cardData], deletedRecords: []
        };
        this.parent.trigger(events.actionBegin, args, function (updateArgs) {
            if (!updateArgs.cancel) {
                _this.parent.showSpinner();
                var promise = null;
                if (_this.parent.sortSettings.field && _this.parent.sortSettings.sortBy === 'Index') {
                    var modifiedData = [];
                    cardData instanceof Array ? modifiedData = cardData : modifiedData.push(cardData);
                    if (!_this.parent.isBlazorRender()) {
                        cardData = _this.priorityOrder(modifiedData, updateArgs);
                    }
                }
                var editParms = {
                    addedRecords: [], changedRecords: (cardData instanceof Array) ? cardData : [cardData], deletedRecords: []
                };
                if (cardData instanceof Array) {
                    if (!_this.parent.isBlazorRender()) {
                        promise = _this.parent.dataModule.dataManager.saveChanges(editParms, _this.keyField, _this.getTable(), _this.getQuery());
                    }
                    else {
                        // tslint:disable-next-line
                        _this.parent.interopAdaptor.invokeMethodAsync('UpdateCards', { ChangedRecords: cardData }, _this.keyField);
                    }
                }
                else {
                    if (!_this.parent.isBlazorRender()) {
                        promise = _this.parent.dataModule.dataManager.update(_this.keyField, cardData, _this.getTable(), _this.getQuery());
                    }
                    else {
                        // tslint:disable-next-line
                        _this.parent.interopAdaptor.invokeMethodAsync('UpdateCard', _this.keyField, { Record: cardData });
                    }
                }
                if (!_this.parent.isBlazorRender()) {
                    var crudArgs = {
                        requestType: 'cardChanged', cancel: false, promise: promise, addedRecords: editParms.addedRecords,
                        changedRecords: editParms.changedRecords, deletedRecords: editParms.deletedRecords
                    };
                    _this.refreshData(crudArgs);
                }
            }
        });
    };
    Crud.prototype.deleteCard = function (cardData) {
        var _this = this;
        var editParms = { addedRecords: [], changedRecords: [], deletedRecords: [] };
        if (typeof cardData === 'string' || typeof cardData === 'number') {
            editParms.deletedRecords = this.parent.kanbanData.filter(function (data) {
                return data[_this.keyField] === cardData;
            });
        }
        else {
            editParms.deletedRecords = (cardData instanceof Array) ? cardData : [cardData];
        }
        var args = {
            requestType: 'cardRemove', cancel: false, addedRecords: [],
            changedRecords: [], deletedRecords: editParms.deletedRecords
        };
        this.parent.trigger(events.actionBegin, args, function (deleteArgs) {
            if (!deleteArgs.cancel) {
                _this.parent.showSpinner();
                var promise = null;
                if (editParms.deletedRecords.length > 1) {
                    if (!_this.parent.isBlazorRender()) {
                        promise = _this.parent.dataModule.dataManager.saveChanges(editParms, _this.keyField, _this.getTable(), _this.getQuery());
                    }
                    else {
                        // tslint:disable-next-line
                        _this.parent.interopAdaptor.invokeMethodAsync('DeleteCards', { DeletedRecords: cardData }, _this.keyField);
                    }
                }
                else {
                    if (!_this.parent.isBlazorRender()) {
                        promise = _this.parent.dataModule.dataManager.remove(_this.keyField, editParms.deletedRecords[0], _this.getTable(), _this.getQuery());
                    }
                    else {
                        // tslint:disable-next-line
                        _this.parent.interopAdaptor.invokeMethodAsync('DeleteCard', _this.keyField, { Record: cardData });
                    }
                }
                if (!_this.parent.isBlazorRender()) {
                    var crudArgs = {
                        requestType: 'cardRemoved', cancel: false, promise: promise, addedRecords: editParms.addedRecords,
                        changedRecords: editParms.changedRecords, deletedRecords: editParms.deletedRecords
                    };
                    _this.refreshData(crudArgs);
                }
            }
        });
    };
    Crud.prototype.priorityOrder = function (cardData, args) {
        var _this = this;
        var cardsId = cardData.map(function (obj) { return obj[_this.parent.cardSettings.headerField]; });
        var allModifiedKeys = cardData.map(function (obj) { return obj[_this.parent.keyField]; });
        var modifiedKey = allModifiedKeys.filter(function (key, index) { return allModifiedKeys.indexOf(key) === index; }).sort();
        var columnAllDatas;
        var finalData = [];
        var _loop_1 = function (columnKey) {
            var keyData = cardData.filter(function (cardObj) { return cardObj[_this.parent.keyField] === columnKey; });
            columnAllDatas = this_1.parent.getColumnData(columnKey);
            if (this_1.parent.sortSettings.direction === 'Descending') {
                columnAllDatas = this_1.removeData(columnAllDatas, keyData);
            }
            var customOrder = 1;
            var initialOrder = void 0;
            for (var _i = 0, _a = keyData; _i < _a.length; _i++) {
                var data = _a[_i];
                var order = void 0;
                if (data[this_1.parent.sortSettings.field]) {
                    order = data[this_1.parent.sortSettings.field];
                }
                else {
                    if (customOrder === 1) {
                        initialOrder = columnAllDatas.slice(-1)[0][this_1.parent.sortSettings.field];
                    }
                    order = data[this_1.parent.sortSettings.field] = (customOrder > 1 ? initialOrder :
                        columnAllDatas.slice(-1)[0][this_1.parent.sortSettings.field]) + customOrder;
                    customOrder++;
                }
                if (this_1.parent.swimlaneSettings.keyField) {
                    var swimlaneDatas = this_1.parent.getSwimlaneData(data[this_1.parent.swimlaneSettings.keyField]);
                    columnAllDatas = this_1.parent.getColumnData(columnKey, swimlaneDatas);
                    if (this_1.parent.sortSettings.direction === 'Descending') {
                        columnAllDatas = this_1.removeData(columnAllDatas, keyData);
                    }
                }
                var count = [];
                for (var j = 0; j < columnAllDatas.length; j++) {
                    if (columnAllDatas[j][this_1.parent.sortSettings.field] === order) {
                        count.push(j + 1);
                        break;
                    }
                }
                if (args.requestType === 'cardChange') {
                    finalData.push(data);
                }
                var finalCardsId = finalData.map(function (obj) { return obj[_this.parent.cardSettings.headerField]; });
                if (this_1.parent.sortSettings.direction === 'Ascending') {
                    for (var i = count[0]; i <= columnAllDatas.length; i++) {
                        var dataObj = columnAllDatas[i - 1];
                        var index = cardsId.indexOf(dataObj[this_1.parent.cardSettings.headerField]);
                        if (index === -1 && order >= dataObj[this_1.parent.sortSettings.field]) {
                            dataObj[this_1.parent.sortSettings.field] = ++order;
                            var isData = finalCardsId.indexOf(dataObj[this_1.parent.cardSettings.headerField]);
                            (isData === -1) ? finalData.push(dataObj) : finalData[isData] = dataObj;
                        }
                    }
                }
                else {
                    for (var i = count[0]; i > 0; i--) {
                        var dataObj = columnAllDatas[i - 1];
                        dataObj[this_1.parent.sortSettings.field] = ++order;
                        finalData.push(dataObj);
                    }
                }
            }
        };
        var this_1 = this;
        for (var _i = 0, modifiedKey_1 = modifiedKey; _i < modifiedKey_1.length; _i++) {
            var columnKey = modifiedKey_1[_i];
            _loop_1(columnKey);
        }
        return finalData;
    };
    Crud.prototype.removeData = function (columnAllDatas, keyData) {
        keyData.map(function (cardObj) {
            if (columnAllDatas.indexOf(cardObj) !== -1) {
                columnAllDatas.splice(columnAllDatas.indexOf(cardObj), 1);
            }
        });
        return columnAllDatas;
    };
    return Crud;
}());
export { Crud };

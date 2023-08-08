import { extend, isNullOrUndefined } from '@syncfusion/ej2-base';
/**
 * This is a file to create MDX query for the provided OLAP datasource
 * @hidden
 */
/** @hidden */
var MDXQuery = /** @class */ (function () {
    function MDXQuery() {
    }
    /* tslint:disable:no-any */
    /* tslint:disable-next-line:max-line-length */
    MDXQuery.getCellSets = function (dataSourceSettings, olapEngine, refPaging, drillInfo, isQueryUpdate) {
        /* tslint:enable:no-any */
        this.engine = olapEngine;
        this.isMondrian = olapEngine.isMondrian;
        this.isMeasureAvail = olapEngine.isMeasureAvail;
        this.isPaging = olapEngine.isPaging;
        this.pageSettings = olapEngine.pageSettings;
        this.rows = olapEngine.rows;
        this.columns = olapEngine.columns;
        this.values = olapEngine.values;
        this.filters = olapEngine.filters;
        this.allowLabelFilter = olapEngine.allowLabelFilter;
        this.allowValueFilter = olapEngine.allowValueFilter;
        this.valueSortSettings = dataSourceSettings.valueSortSettings ? dataSourceSettings.valueSortSettings : undefined;
        this.drilledMembers = olapEngine.updateDrilledItems(dataSourceSettings.drilledMembers);
        this.calculatedFieldSettings = olapEngine.calculatedFieldSettings;
        this.valueAxis = dataSourceSettings.valueAxis === 'row' ? 'rows' : 'columns';
        if (drillInfo) {
            drillInfo.axis = drillInfo.axis === 'row' ? 'rows' : 'columns';
        }
        this.filterMembers = extend({}, olapEngine.filterMembers, null, true);
        this.fieldDataObj = olapEngine.fieldListObj;
        this.fieldList = olapEngine.fieldList;
        /* tslint:disable-next-line:max-line-length */
        this.cellSetInfo = '\nDIMENSION PROPERTIES PARENT_UNIQUE_NAME, HIERARCHY_UNIQUE_NAME, CHILDREN_CARDINALITY, MEMBER_TYPE, MEMBER_VALUE';
        var measureQuery = this.getMeasuresQuery(this.values);
        var rowQuery = this.getDimensionsQuery(this.rows, measureQuery, 'rows', drillInfo).replace(/\&/g, '&amp;');
        var columnQuery = this.getDimensionsQuery(this.columns, measureQuery, 'columns', drillInfo).replace(/\&/g, '&amp;');
        if (this.isPaging && refPaging && this.pageSettings !== undefined) {
            var pagingQuery = this.getPagingQuery(rowQuery, columnQuery);
            rowQuery = pagingQuery.rowQuery;
            columnQuery = pagingQuery.columnQuery;
        }
        else if (this.isPaging && !refPaging && this.pageSettings !== undefined) {
            var pagingQuery = this.getPagingCountQuery(rowQuery, columnQuery);
            rowQuery = pagingQuery.rowQuery;
            columnQuery = pagingQuery.columnQuery;
        }
        rowQuery = (rowQuery.length > 0 ? rowQuery + (this.isPaging && !refPaging ? '' : this.cellSetInfo + ' ON ROWS') : '');
        columnQuery = (columnQuery.length > 0 ? columnQuery + (this.isPaging && !refPaging ? '' : this.cellSetInfo + ' ON COLUMNS') : '');
        var slicerQuery = this.getSlicersQuery(this.filters, 'filters').replace(/\&/g, '&amp;');
        /* tslint:disable-next-line:max-line-length */
        var filterQuery = this.getfilterQuery(this.filterMembers, dataSourceSettings.cube).replace(/\&/g, '&amp;').replace(/\>/g, '&gt;').replace(/\</g, '&lt;');
        var caclQuery = this.getCalculatedFieldQuery(this.calculatedFieldSettings).replace(/\&/g, '&amp;');
        var query = this.frameMDXQuery(rowQuery, columnQuery, slicerQuery, filterQuery, caclQuery, refPaging);
        var args = {
            catalog: dataSourceSettings.catalog,
            cube: dataSourceSettings.cube,
            url: dataSourceSettings.url,
            request: query,
            LCID: dataSourceSettings.localeIdentifier.toString()
        };
        olapEngine.mdxQuery = query.replace(/\&amp;/g, '&').replace(/\&gt;/g, '>').replace(/\&lt;/g, '<').replace(/%280/g, '\"');
        // console.log(olapEngine.mdxQuery);
        if (drillInfo) {
            drillInfo.axis = drillInfo.axis === 'rows' ? 'row' : 'column';
        }
        /* tslint:disable */
        if (!isQueryUpdate) {
            this.getTableCellData(args, (this.isPaging && !refPaging ? this.engine.generatePagingData.bind(this.engine) : this.engine.generateEngine.bind(this.engine)), drillInfo ? { action: drillInfo.action, drillInfo: drillInfo } : { dataSourceSettings: dataSourceSettings, action: 'loadTableElements' });
        }
        /* tslint:enable */
    };
    /* tslint:disable:max-line-length */
    MDXQuery.getTableCellData = function (args, successMethod, customArgs) {
        var connectionString = this.engine.getConnectionInfo(args.url, args.LCID);
        var soapMessage = '<Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/"> <Header></Header> <Body> <Execute xmlns="urn:schemas-microsoft-com:xml-analysis"> <Command> <Statement>' +
            args.request + '</Statement> </Command> <Properties> <PropertyList> <Catalog>' +
            args.catalog + '</Catalog> <LocaleIdentifier>' + connectionString.LCID +
            '</LocaleIdentifier> </PropertyList> </Properties></Execute> </Body> </Envelope>';
        this.engine.doAjaxPost('POST', connectionString.url, soapMessage, successMethod, customArgs);
    };
    MDXQuery.frameMDXQuery = function (rowQuery, columnQuery, slicerQuery, filterQuery, caclQuery, refPaging) {
        var query = ((this.isPaging && !refPaging) ? caclQuery !== '' ? '' : '\nWITH' : '\nSelect ');
        if (columnQuery.length > 0) {
            query = query + columnQuery;
        }
        if (rowQuery.length > 0) {
            query = query + (columnQuery.length > 0 ? this.isPaging && !refPaging ? '' : ', ' : '') + rowQuery;
        }
        query = caclQuery + query + (this.isPaging && !refPaging ? '\nMEMBER [Measures].[3d268ce0-664d-4092-b9cb-fece97175006] AS Count([e16a30d0-2174-4874-8dae-a5085a75a3e2]) ' +
            'MEMBER [Measures].[8d7fe8c1-f09f-410e-b9ba-eaab75a1fc3e] AS Count ([d1876d2b-e50e-4547-85fe-5b8ed9d629de])' +
            '\nSELECT { [Measures].[3d268ce0-664d-4092-b9cb-fece97175006] , [Measures].[8d7fe8c1-f09f-410e-b9ba-eaab75a1fc3e] } ON AXIS(0)' : '') +
            filterQuery + slicerQuery + '\nCELL PROPERTIES VALUE, FORMAT_STRING, FORMATTED_VALUE\n';
        return query;
    };
    MDXQuery.getPagingQuery = function (rowQuery, columnQuery) {
        // let colCurrentPage: number = (Math.ceil(this.engine.columnCount / this.pageSettings.columnSize) < this.pageSettings.columnCurrentPage || this.pageSettings.columnCurrentPage === 0) ? ((Math.ceil(this.engine.columnCount / this.pageSettings.columnSize) < this.pageSettings.columnCurrentPage && this.engine.columnCount > 0) ? Math.ceil(this.engine.columnCount / this.pageSettings.columnSize) : this.pageSettings.columnCurrentPage) : this.pageSettings.columnCurrentPage;
        // let rowCurrentPage: number = (Math.ceil(this.engine.rowCount / this.pageSettings.rowSize) < this.pageSettings.rowCurrentPage || this.pageSettings.rowCurrentPage === 0) ? ((Math.ceil(this.engine.rowCount / this.pageSettings.rowSize) < this.pageSettings.rowCurrentPage && this.engine.rowCount > 0) ? Math.ceil(this.engine.rowCount / this.pageSettings.rowSize) : this.pageSettings.rowSize) : this.pageSettings.rowCurrentPage;
        rowQuery = rowQuery.replace('NON EMPTY ( ', '').slice(0, -1);
        columnQuery = columnQuery.replace('NON EMPTY ( ', '').slice(0, -1);
        var rowQueryCpy = rowQuery;
        // let axisQuery: pagingQuery = {
        //     rowQuery: rowQuery !== '' ? ('\nSUBSET ({ ' + (this.isMondrian ? '' : 'NONEMPTY') + ' (' + rowQuery + (!this.isMondrian && columnQuery !== '' ? ',' + columnQuery : '') + ')},' + (((rowCurrentPage === 0 ? 1 : rowCurrentPage) - 1) * (this.pageSettings.rowSize)) + ',' + this.pageSettings.rowSize + ')') : '',
        //     columnQuery: columnQuery !== '' ? ('\nSUBSET ({ ' + (this.isMondrian ? '' : 'NONEMPTY') + ' (' + columnQuery + (!this.isMondrian && rowQueryCpy !== '' ? ',' + rowQueryCpy : '') + ')},' + (((colCurrentPage === 0 ? 1 : colCurrentPage) - 1) * (this.pageSettings.columnSize)) + ',' + this.pageSettings.columnSize + ')') : ''
        // }
        var calRowPage = (this.pageSettings.rowCurrentPage - 1) * this.pageSettings.rowSize;
        var calColPage = (this.pageSettings.columnCurrentPage - 1) * this.pageSettings.columnSize;
        var calRowSize = this.pageSettings.rowSize * 3;
        var calColumnSize = this.pageSettings.columnSize * 3;
        calRowPage = (this.engine.rowCount < (calRowPage + calRowSize)) ?
            (this.engine.rowCount > calRowSize ? (this.engine.rowCount - calRowSize) : 0) : calRowPage;
        this.engine.pageRowStartPos = calRowPage;
        calColPage = (this.engine.columnCount < (calColPage + calColumnSize)) ?
            (this.engine.columnCount > calColumnSize ? (this.engine.columnCount - calColumnSize) : 0) : calColPage;
        this.engine.pageColStartPos = calColPage;
        var axisQuery = {
            rowQuery: rowQuery !== '' ? ('\nSUBSET ({ ' + (this.isMondrian ? '' : 'NONEMPTY') + ' (' + rowQuery + (!this.isMondrian && columnQuery !== '' ? ',' + columnQuery : '') + ')},' + (calRowPage) + ',' + calRowSize + ')') : '',
            columnQuery: columnQuery !== '' ? ('\nSUBSET ({ ' + (this.isMondrian ? '' : 'NONEMPTY') + ' (' + columnQuery + (!this.isMondrian && rowQueryCpy !== '' ? ',' + rowQueryCpy : '') + ')},' + (calColPage) + ',' + calColumnSize + ')') : ''
        };
        return axisQuery;
    };
    MDXQuery.getPagingCountQuery = function (rowQuery, columnQuery) {
        /* tslint:disable */
        rowQuery = rowQuery.replace('NON EMPTY ( ', '').slice(0, -1);
        columnQuery = columnQuery.replace('NON EMPTY ( ', '').slice(0, -1);
        var rowQueryCpy = rowQuery;
        'WITH  SET [e16a30d0-2174-4874-8dae-a5085a75a3e2] as';
        'SET [d1876d2b-e50e-4547-85fe-5b8ed9d629de] as';
        var axisQuery = {
            rowQuery: rowQuery !== '' ? ('\SET [d1876d2b-e50e-4547-85fe-5b8ed9d629de] as ' + (this.isMondrian ? '' : 'NONEMPTY') + ' (' + rowQuery + (!this.isMondrian && columnQuery !== '' ? ',' + columnQuery : '') + ')\n') : '',
            columnQuery: columnQuery !== '' ? ('\nSET [e16a30d0-2174-4874-8dae-a5085a75a3e2] as ' + (this.isMondrian ? '' : 'NONEMPTY') + ' (' + columnQuery + (!this.isMondrian && rowQueryCpy !== '' ? ',' + rowQueryCpy : '') + ')\n') : ''
        };
        return axisQuery;
        /* tslint:enable */
    };
    /* tslint:enable:max-line-length */
    MDXQuery.getDimensionsQuery = function (dimensions, measureQuery, axis, drillInfo) {
        var query = '';
        if (dimensions.length > 0) {
            query = '\nNON EMPTY ( ' + (this.drilledMembers.length > 0 ? 'HIERARCHIZE ({' : '');
            var i = 0;
            while (i < dimensions.length) {
                var hierarchy = '';
                if (i === 0) {
                    if (dimensions[i].name.toLowerCase() === '[measures]') {
                        if (measureQuery !== '') {
                            query = query + measureQuery;
                        }
                    }
                    else {
                        hierarchy = '({' + this.getDimensionQuery(dimensions[i], axis) + '})';
                        query = query + hierarchy;
                    }
                }
                else {
                    if (dimensions[i].name.toLowerCase() === '[measures]') {
                        if (measureQuery !== '') {
                            query = query + ' * ' + measureQuery;
                        }
                    }
                    else {
                        hierarchy = '({' + this.getDimensionQuery(dimensions[i], axis) + '})';
                        query = query + ' * ' + hierarchy;
                    }
                }
                i++;
            }
            // if (!this.isMeasureAvail && measureQuery !== '' && this.valueAxis === axis) {
            //     query = query + ' * ' + measureQuery;
            // }
            /* tslint:disable:max-line-length */
            var drillQueryObj = this.getDrillQuery(dimensions, measureQuery, axis, drillInfo);
            query = (drillInfo && drillInfo.axis === axis ? '\nNON EMPTY ( ' + (this.drilledMembers.length > 0 ? 'HIERARCHIZE ({' : '') + drillQueryObj.query : query + (drillQueryObj.query !== '' ? ',' : '') + drillQueryObj.query);
            query = (this.valueAxis !== axis ? this.updateValueSortQuery(query, this.valueSortSettings) : query) +
                (this.drilledMembers.length > 0 ? '})' : '') + (this.isPaging && axis === 'columns' && drillQueryObj.query !== '' ? '-' + drillQueryObj.collection.join('-') : '') + ')';
        }
        // else if (!this.isMeasureAvail && measureQuery !== '' && this.valueAxis === axis) {
        //     query = 'NON EMPTY (' + (this.drilledMembers.length > 0 ? 'HIERARCHIZE({' : '') + measureQuery;
        //     query = (this.valueAxis !== axis ? this.updateValueSortQuery(query, this.valueSortSettings) : query) +
        //         (this.drilledMembers.length > 0 ? '})' : '') + ') ' + this.cellSetInfo + ' ON ' + axis.toUpperCase();
        // }
        /* tslint:enable:max-line-length */
        return query;
    };
    /* tslint:disable-next-line:max-line-length */
    MDXQuery.getDrillQuery = function (dimensions, measureQuery, axis, drillInfo) {
        var query = '';
        var rawDrillQuery = [];
        var drilledMembers = [];
        var isOnDemandDrill = false;
        var onDemandDrillQuery = '';
        if (drillInfo && drillInfo.axis === axis && drillInfo.action.toLowerCase() === 'down') {
            isOnDemandDrill = true;
            drilledMembers = [{ name: drillInfo.fieldName, items: [drillInfo.memberName], delimiter: '~~' }];
        }
        else {
            drilledMembers = this.drilledMembers;
        }
        for (var _i = 0, drilledMembers_1 = drilledMembers; _i < drilledMembers_1.length; _i++) {
            var field = drilledMembers_1[_i];
            for (var _a = 0, _b = field.items; _a < _b.length; _a++) {
                var item = _b[_a];
                var drillQuery = [];
                var rawQuery = [];
                var i = 0;
                var drillInfo_1 = item.split(field.delimiter ? field.delimiter : '~~');
                /* tslint:disable:max-line-length */
                while (i < dimensions.length) {
                    if (drillInfo_1[i] && drillInfo_1[i].indexOf(dimensions[i].name) !== -1) {
                        if (drillInfo_1[drillInfo_1.length - 1].indexOf(dimensions[i].name) !== -1) {
                            if (isOnDemandDrill) {
                                onDemandDrillQuery = onDemandDrillQuery + (onDemandDrillQuery !== '' ? ' * ' : '') + '({' + drillInfo_1[i] + '.CHILDREN})';
                            }
                            else {
                                drillQuery.push('(' + drillInfo_1[i] + '.CHILDREN)');
                                rawQuery.push('(' + drillInfo_1[i] + ')');
                            }
                        }
                        else {
                            if (drillInfo_1[i].toLowerCase() === '[measures]' && measureQuery !== '') {
                                if (isOnDemandDrill) {
                                    onDemandDrillQuery = onDemandDrillQuery + (onDemandDrillQuery !== '' ? ' * ' : '') + '(' + measureQuery + ')';
                                }
                                else {
                                    drillQuery.push('(' + measureQuery + ')');
                                    rawQuery.push('(' + measureQuery + ')');
                                }
                            }
                            else if (drillInfo_1[i].toLowerCase().indexOf('[measures]') !== -1) {
                                if (isOnDemandDrill) {
                                    onDemandDrillQuery = onDemandDrillQuery + (onDemandDrillQuery !== '' ? ' * ' : '') + '({' + drillInfo_1[i] + '})';
                                }
                                else {
                                    drillQuery.push('({' + drillInfo_1[i] + '})');
                                    rawQuery.push('({' + drillInfo_1[i] + '})');
                                }
                            }
                            else {
                                if (isOnDemandDrill) {
                                    onDemandDrillQuery = onDemandDrillQuery + (onDemandDrillQuery !== '' ? ' * ' : '') + '({' + drillInfo_1[i] + '})';
                                }
                                else {
                                    drillQuery.push('(' + drillInfo_1[i] + ')');
                                    rawQuery.push('(' + drillInfo_1[i] + ')');
                                }
                            }
                        }
                    }
                    else if (!drillInfo_1[i] && dimensions[i]) {
                        if (dimensions[i].name.toLowerCase() === '[measures]' && measureQuery !== '') {
                            if (isOnDemandDrill) {
                                onDemandDrillQuery = onDemandDrillQuery + (onDemandDrillQuery !== '' ? ' * ' : '') + '(' + measureQuery + ')';
                            }
                            else {
                                drillQuery.push('(' + measureQuery + ')');
                                rawQuery.push('(' + measureQuery + ')');
                            }
                        }
                        else {
                            if (isOnDemandDrill) {
                                onDemandDrillQuery = onDemandDrillQuery + (onDemandDrillQuery !== '' ? ' * ' : '') + '({' + this.getDimensionQuery(dimensions[i], axis) + '})';
                            }
                            else {
                                drillQuery.push('(' + this.getDimensionQuery(dimensions[i], axis) + ')');
                                rawQuery.push('(' + this.getDimensionQuery(dimensions[i], axis) + ')');
                            }
                        }
                    }
                    else {
                        drillQuery = [];
                        break;
                    }
                    i++;
                }
                if (drillQuery.length > 0 && drillQuery.length < drillInfo_1.length) {
                    drillQuery = [];
                    rawQuery = [];
                }
                // query = query + (query !== '' && drillQuery.length > 0 ? ',' : '') + (drillQuery.length > 0 ? '(' + drillQuery.toString().replace(/\&/g, "&amp;") + ')' : '');
                query = query + (query !== '' && drillQuery.length > 0 ? ',' : '') + (drillQuery.length > 0 ? '(' + drillQuery.toString() + ')' : '');
                /* tslint:enable:max-line-length */
                if (rawQuery.length > 0) {
                    rawDrillQuery.push(('(' + rawQuery.toString() + ')'));
                }
            }
        }
        // return (isOnDemandDrill ? onDemandDrillQuery.replace(/\&/g, "&amp;") : query);
        var queryCollection = {
            query: (isOnDemandDrill ? onDemandDrillQuery : query),
            collection: (isOnDemandDrill ? [onDemandDrillQuery] : rawDrillQuery)
        };
        return queryCollection;
    };
    MDXQuery.updateValueSortQuery = function (query, valueSortSettings) {
        if (valueSortSettings && valueSortSettings.measure && valueSortSettings.measure !== '') {
            var heirarchize = (this.drilledMembers.length > 0 ? 'HIERARCHIZE ({' : '');
            var measure = (this.fieldList[valueSortSettings.measure].isCalculatedField ?
                this.fieldList[valueSortSettings.measure].tag : valueSortSettings.measure);
            switch (valueSortSettings.sortOrder) {
                case 'Ascending':
                    query = query.replace('NON EMPTY ( ' + heirarchize, 'NON EMPTY ( ' + heirarchize + ' ORDER ({');
                    query = query + '},(' + measure + '), ASC)';
                    // query = query + '},(' + valueSortSettings.measure + '), ' +
                    //     (valueSortSettings.preserveHierarchy ? 'BASC' : 'ASC') + ')';
                    break;
                case 'Descending':
                    query = query.replace('NON EMPTY ( ' + heirarchize, 'NON EMPTY ( ' + heirarchize + ' ORDER ({');
                    query = query + '},(' + measure + '), DESC)';
                    // query = query + '},(' + valueSortSettings.measure + '), ' +
                    //     (valueSortSettings.preserveHierarchy ? 'BDESC' : 'DESC') + ')';
                    break;
            }
        }
        return query;
    };
    /* tslint:disable */
    MDXQuery.getSlicersQuery = function (slicers, axis) {
        var _this = this;
        var query = '';
        var dataFields = extend([], this.rows, null, true);
        dataFields = dataFields.concat(this.columns);
        if (slicers.length > 0) {
            var i_1 = 0;
            while (i_1 < slicers.length) {
                var isCol = dataFields.filter(function (field) {
                    var colUqName = _this.getDimensionUniqueName(field.name);
                    var slicerUqName = _this.getDimensionUniqueName(slicers[i_1].name);
                    var isMatch = false;
                    isMatch = colUqName === slicerUqName &&
                        !(_this.isMondrian && slicerUqName === '' && colUqName === '');
                    return (isMatch);
                }).length > 0;
                if (!isCol) {
                    if (slicers[i_1].name !== undefined && !this.filterMembers[slicers[i_1].name]) {
                        query = query + (query !== '' ? ' * ' : '') + '{' + this.getDimensionQuery(slicers[i_1], axis) + '}';
                    }
                    else if (this.filterMembers[slicers[i_1].name]) {
                        query = query + (query !== '' ? ' * ' : '') + '{' + (this.filterMembers[slicers[i_1].name].toString()) + '}';
                    }
                }
                i_1++;
            }
            query = query === '' ? '' : '\nWHERE (' + query.replace(/DrilldownLevel/g, '') + ')';
        }
        return query;
    };
    /* tslint:enable */
    MDXQuery.getDimensionQuery = function (dimension, axis) {
        var query = '';
        var name = dimension.isCalculatedField ? this.fieldList[dimension.name].tag : dimension.name;
        var hasAllMember = this.fieldList[dimension.name].hasAllMember;
        if (!hasAllMember && !dimension.isNamedSet && !dimension.isCalculatedField) {
            query = '((' + name + ').levels(0).AllMembers)';
        }
        else {
            query = (dimension.isNamedSet ? '{' + name + '}' : this.isPaging ? name + '.CHILDREN' :
                'DrilldownLevel({' + name + '}' + ((axis === 'rows' || axis === 'columns') ? ',,,INCLUDE_CALC_MEMBERS' : '') + ')');
        }
        return query;
    };
    MDXQuery.getDimensionUniqueName = function (headerText) {
        var hierarchyNode = this.fieldDataObj.hierarchy;
        var curElement = [];
        if (hierarchyNode) {
            // let curElement: IOlapField[] = hierarchyNode.filter((item: IOlapField) => {
            //     return (item.id.toLowerCase() === headerText.toLowerCase());
            // });
            for (var _i = 0, hierarchyNode_1 = hierarchyNode; _i < hierarchyNode_1.length; _i++) {
                var item = hierarchyNode_1[_i];
                if (item.id.toLowerCase() === headerText.toLowerCase()) {
                    curElement.push(item);
                }
            }
            return (curElement.length > 0 ? curElement[0].pid : '');
        }
        else {
            return headerText.split('.')[0];
        }
    };
    MDXQuery.getMeasuresQuery = function (measures) {
        var query = '';
        if (measures.length > 0) {
            query = '{{';
            var values = '';
            for (var _i = 0, measures_1 = measures; _i < measures_1.length; _i++) {
                var measure = measures_1[_i];
                var name_1 = (measure.isCalculatedField ? this.fieldList[measure.name].tag : measure.name);
                if (values.length > 0) {
                    values = values + ', ' + name_1;
                }
                else {
                    values = name_1;
                }
            }
            query = query + values + '}}';
        }
        return query;
    };
    MDXQuery.getfilterQuery = function (filters, cube) {
        var query = '\nFROM [' + cube + ']';
        var filterQuery = '\nFROM( SELECT (';
        var advancedFilters = [];
        var advancedFilterQuery = [];
        var rowFilter = [];
        var columnFilter = [];
        for (var _i = 0, _a = this.rows; _i < _a.length; _i++) {
            var field = _a[_i];
            if (filters[field.name] && filters[field.name].length > 0) {
                if (typeof filters[field.name][0] === 'string') {
                    rowFilter.push(filters[field.name]);
                }
                else {
                    filters[field.name][1] = filters[field.name][0].type;
                    advancedFilters.push(filters[field.name]);
                    delete filters[field.name];
                }
            }
        }
        for (var _b = 0, _c = this.columns; _b < _c.length; _b++) {
            var field = _c[_b];
            if (filters[field.name] && filters[field.name].length > 0) {
                if (typeof filters[field.name][0] === 'string') {
                    columnFilter.push(filters[field.name]);
                }
                else {
                    /* tslint:disable:no-any */
                    var filter = filters[field.name];
                    /* tslint:enable:no-any */
                    filter[1] = filter[0].type;
                    advancedFilters.push(filters[field.name]);
                    delete filters[field.name];
                }
            }
        }
        for (var _d = 0, _e = this.filters; _d < _e.length; _d++) {
            var field = _e[_d];
            var isFound = false;
            for (var _f = 0, _g = this.columns; _f < _g.length; _f++) {
                var column = _g[_f];
                if (this.getDimensionUniqueName(column.name) === this.getDimensionUniqueName(field.name)) {
                    if (filters[field.name]) {
                        columnFilter.push(filters[field.name]);
                        isFound = true;
                    }
                }
            }
            if (!isFound) {
                for (var _h = 0, _j = this.rows; _h < _j.length; _h++) {
                    var row = _j[_h];
                    if (this.getDimensionUniqueName(row.name) === this.getDimensionUniqueName(field.name)) {
                        if (filters[field.name]) {
                            rowFilter.push(filters[field.name]);
                        }
                    }
                }
            }
        }
        if ((this.allowLabelFilter || this.allowValueFilter) && advancedFilters.length > 0) {
            var axes = ['Value', 'Label'];
            for (var _k = 0, axes_1 = axes; _k < axes_1.length; _k++) {
                var axis = axes_1[_k];
                for (var _l = 0, advancedFilters_1 = advancedFilters; _l < advancedFilters_1.length; _l++) {
                    var filterItems = advancedFilters_1[_l];
                    if (filterItems && filterItems.length === 2 &&
                        typeof filterItems[1] === 'string' && filterItems[1] === axis) {
                        advancedFilterQuery.push(this.getAdvancedFilterQuery(filterItems[0], filterQuery, 'COLUMNS'));
                    }
                }
            }
        }
        for (var i = 0, cnt = columnFilter.length; i < cnt; i++) {
            /* tslint:disable-next-line:max-line-length */
            filterQuery = i === 0 ? filterQuery + '{' + columnFilter[i].toString() + '}' : filterQuery + ',{' + columnFilter[i].toString() + '}';
        }
        if (columnFilter.length > 0) {
            filterQuery = (rowFilter.length > 0) ? filterQuery + ' ) ON COLUMNS ' + ',(' : filterQuery + ' ) ON COLUMNS';
        }
        for (var i = 0, cnt = rowFilter.length; i < cnt; i++) {
            filterQuery = (i > 0) ? filterQuery + ',{' + rowFilter[i].toString() + '}' : filterQuery + '{' + rowFilter[i].toString() + '}';
        }
        filterQuery = (columnFilter.length > 0 && rowFilter.length > 0) ?
            filterQuery = filterQuery + ') ON ROWS ' : (columnFilter.length === 0 && rowFilter.length > 0) ?
            filterQuery + ') ON COLUMNS ' : filterQuery;
        var updatedFilterQuery = '';
        if (advancedFilterQuery.length > 0) {
            updatedFilterQuery = advancedFilterQuery.join(' ') + ' ' +
                ((columnFilter.length > 0 || rowFilter.length > 0) ? filterQuery : '') + ' '
                + query + Array(advancedFilterQuery.length + 1 +
                ((columnFilter.length > 0 || rowFilter.length > 0) ? 1 : 0)).join(')');
        }
        query = (columnFilter.length === 0 && rowFilter.length === 0) ? query : filterQuery + query + ')';
        return (updatedFilterQuery.length > 0) ? updatedFilterQuery : query;
    };
    /* tslint:disable:max-line-length */
    MDXQuery.getAdvancedFilterQuery = function (filterItem, query, currentAxis) {
        var filterQuery = '\nFROM (SELECT Filter(' + filterItem.selectedField + '.AllMembers, ' +
            this.getAdvancedFilterCondtions(filterItem.name, filterItem.condition, filterItem.value1, filterItem.value2, filterItem.type, filterItem.measure) +
            ')) on ' + currentAxis;
        return filterQuery;
    };
    MDXQuery.getAdvancedFilterCondtions = function (fieldName, filterOperator, value1, value2, filterType, measures) {
        var advancedFilterQuery = '';
        switch (filterOperator) {
            case 'Equals':
                advancedFilterQuery = '(' + (filterType !== 'Value' ? (fieldName + '.CurrentMember.member_caption =\"' + value1 + '\"') : (measures + ' = ' + value1));
                break;
            case 'DoesNotEquals':
                advancedFilterQuery = '(' + (filterType !== 'Value' ? (fieldName + '.CurrentMember.member_caption <>\"' + value1 + '\"') : (measures + ' <>' + value1));
                break;
            case 'Contains':
                advancedFilterQuery = '( InStr (1,' + fieldName + '.CurrentMember.member_caption,\"' + value1 + '\") >0';
                break;
            case 'DoesNotContains':
                advancedFilterQuery = '( InStr (1,' + fieldName + '.CurrentMember.member_caption,\"' + value1 + '\")=0';
                break;
            case 'BeginWith':
                advancedFilterQuery = '( Left (' + fieldName + '.CurrentMember.member_caption,' + value1.length + ')=\"' + value1 + '\"';
                break;
            case 'DoesNotBeginWith':
                advancedFilterQuery = '( Left (' + fieldName + '.CurrentMember.member_caption,' + value1.length + ') <>\"' + value1 + '\"';
                break;
            case 'EndsWith':
                advancedFilterQuery = '( Right (' + fieldName + '.CurrentMember.member_caption,' + value1.length + ')=\"' + value1 + '\"';
                break;
            case 'DoesNotEndsWith':
                advancedFilterQuery = '( Right (' + fieldName + '.CurrentMember.member_caption,' + value1.length + ') <>\"' + value1 + '\"';
                break;
            case 'GreaterThan':
                advancedFilterQuery = '(' + (filterType !== 'Value' ? (fieldName + '.CurrentMember.member_caption >\"' + value1 + '\"') : (measures + ' >' + value1 + ''));
                break;
            case 'GreaterThanOrEqualTo':
                advancedFilterQuery = '(' + (filterType !== 'Value' ? (fieldName + '.CurrentMember.member_caption >=\"' + value1 + '\"') : (measures + ' >=' + value1 + ''));
                break;
            case 'LessThan':
                advancedFilterQuery = '(' + (filterType !== 'Value' ? (fieldName + '.CurrentMember.member_caption <\"' + value1 + '\"') : (measures + ' <' + value1 + ''));
                break;
            case 'LessThanOrEqualTo':
                advancedFilterQuery = '(' + (filterType !== 'Value' ? (fieldName + '.CurrentMember.member_caption <=\"' + value1 + '\"') : (measures + ' <=' + value1 + ''));
                break;
            case 'Between':
                advancedFilterQuery = '(' + (filterType !== 'Value' ? (fieldName + '.CurrentMember.member_caption >=\"' + value1 + '\"AND ' + fieldName + '.CurrentMember.member_caption <=\"' + value2 + '\"') : (measures + ' >=' + value1 + ' AND ' + measures + ' <=' + value2));
                break;
            case 'NotBetween':
                advancedFilterQuery = '(' + (filterType !== 'Value' ? (fieldName + '.CurrentMember.member_caption >=\"' + value1 + '\"OR ' + fieldName + '.CurrentMember.member_caption <=\"' + value2 + '\"') : (measures + ' >=' + value1 + ' OR ' + measures + ' <=' + value2));
                break;
            default:
                advancedFilterQuery = '( InStr (1,' + fieldName + '.CurrentMember.member_caption,\"' + value1 + '\") >0';
                break;
        }
        return advancedFilterQuery;
    };
    /* tslint:enable:max-line-length */
    MDXQuery.getCalculatedFieldQuery = function (calcMembers) {
        var calcQuery = '';
        if (calcMembers.length > 0) {
            calcQuery = '\nWITH';
            for (var _i = 0, calcMembers_1 = calcMembers; _i < calcMembers_1.length; _i++) {
                var member = calcMembers_1[_i];
                var prefixName = (member.formula.indexOf('Measure') > -1 ? '[Measures].' : member.hierarchyUniqueName + '.');
                var aliasName = prefixName + '[' + member.name + ']';
                /* tslint:disable-next-line:max-line-length */
                var formatString = (!isNullOrUndefined(member.formatString) ? member.formatString : null);
                calcQuery += ('\nMEMBER ' + aliasName + 'as (' + member.formula + ') ' + (!isNullOrUndefined(formatString) ? ', FORMAT_STRING =\"' + formatString.trim() + '\"' : ''));
            }
        }
        return calcQuery;
    };
    return MDXQuery;
}());
export { MDXQuery };

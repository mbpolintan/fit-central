import { WParagraphFormat } from '../format/paragraph-format';
import { WCharacterFormat } from '../format/index';
import { LineWidget, ParagraphWidget, BodyWidget, TextElementBox, FieldElementBox, TableRowWidget, TableCellWidget, ImageElementBox, ListTextElementBox, BookmarkElementBox, EditRangeStartElementBox, EditRangeEndElementBox, ChartElementBox, CommentCharacterElementBox, TextFormField, CheckBoxFormField, ShapeElementBox } from '../viewer/page';
import { BlockWidget } from '../viewer/page';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { HelperMethods } from '../editor/editor-helper';
import { StreamWriter } from '@syncfusion/ej2-file-utils';
/**
 * Exports the document to Sfdt format.
 */
var SfdtExport = /** @class */ (function () {
    /**
     * documentHelper definition
     */
    function SfdtExport(documentHelper) {
        /* tslint:disable:no-any */
        this.endLine = undefined;
        this.endOffset = undefined;
        this.endCell = undefined;
        this.startColumnIndex = undefined;
        this.endColumnIndex = undefined;
        this.lists = undefined;
        this.document = undefined;
        this.writeInlineStyles = undefined;
        this.editRangeId = -1;
        /**
         * @private
         */
        this.isExport = true;
        this.checkboxOrDropdown = false;
        /**
         * @private
         */
        this.copyWithTrackChange = false;
        this.documentHelper = documentHelper;
    }
    Object.defineProperty(SfdtExport.prototype, "viewer", {
        get: function () {
            return this.documentHelper.owner.viewer;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SfdtExport.prototype, "owner", {
        get: function () {
            return this.documentHelper.owner;
        },
        enumerable: true,
        configurable: true
    });
    SfdtExport.prototype.getModuleName = function () {
        return 'SfdtExport';
    };
    SfdtExport.prototype.clear = function () {
        this.writeInlineStyles = undefined;
        this.endLine = undefined;
        this.lists = undefined;
        this.document = undefined;
        this.endCell = undefined;
        this.startColumnIndex = undefined;
        this.endColumnIndex = undefined;
    };
    /**
     * Serialize the data as Syncfusion document text.
     * @private
     */
    SfdtExport.prototype.serialize = function () {
        return JSON.stringify(this.write());
    };
    /**
     * @private
     */
    SfdtExport.prototype.saveAsBlob = function (documentHelper) {
        var streamWriter = new StreamWriter();
        streamWriter.write(this.serialize());
        var blob = streamWriter.buffer;
        streamWriter.destroy();
        var promise;
        return new Promise(function (resolve, reject) {
            resolve(blob);
        });
    };
    SfdtExport.prototype.updateEditRangeId = function () {
        var index = -1;
        for (var i = 0; i < this.documentHelper.editRanges.keys.length; i++) {
            var keys = this.documentHelper.editRanges.keys;
            for (var j = 0; j < keys[i].length; j++) {
                var editRangeStart = this.documentHelper.editRanges.get(keys[i]);
                for (var z = 0; z < editRangeStart.length; z++) {
                    index++;
                    editRangeStart[z].editRangeId = index;
                    editRangeStart[z].editRangeEnd.editRangeId = index;
                }
            }
        }
    };
    /**
     * @private
     */
    // tslint:disable-next-line:max-line-length
    SfdtExport.prototype.write = function (line, startOffset, endLine, endOffset, writeInlineStyles, isExport) {
        if (writeInlineStyles) {
            this.writeInlineStyles = true;
        }
        this.Initialize();
        this.updateEditRangeId();
        if (line instanceof LineWidget && endLine instanceof LineWidget) {
            this.isExport = false;
            if (!isNullOrUndefined(isExport)) {
                this.isExport = isExport;
            }
            // For selection
            var startPara = line.paragraph;
            var endPara = endLine.paragraph;
            var startCell = startPara.associatedCell;
            var endCell = endPara.associatedCell;
            // Creates section
            var bodyWidget = startPara.bodyWidget;
            var section = this.createSection(line.paragraph.bodyWidget);
            this.document.sections.push(section);
            if (startCell === endCell || isNullOrUndefined(endCell)) {
                this.endLine = endLine;
                this.endOffset = endOffset;
            }
            else {
                // Todo: Handle nested table cases
                if (startCell instanceof TableCellWidget) {
                    var startTable = startCell.getContainerTable();
                    var endTable = endCell.getContainerTable();
                    if (startTable.tableFormat === endTable.tableFormat) {
                        this.endCell = endCell;
                        if (this.endCell.ownerTable !== startCell.ownerTable && startCell.ownerTable.associatedCell
                            && startCell.ownerTable.associatedCell.ownerTable === this.endCell.ownerTable &&
                            (startCell.ownerTable.associatedCell.childWidgets.indexOf(startCell.ownerTable) === 0)) {
                            startCell = startCell.ownerTable.associatedCell;
                        }
                        this.endColumnIndex = this.endCell.columnIndex + this.endCell.cellFormat.columnSpan;
                        this.startColumnIndex = startCell.columnIndex;
                    }
                }
                else {
                    this.endCell = endCell;
                }
            }
            var nextBlock = void 0;
            if (startCell === endCell || isNullOrUndefined(startCell)) {
                var paragraph = this.createParagraph(line.paragraph);
                section.blocks.push(paragraph);
                nextBlock = this.writeParagraph(line.paragraph, paragraph, section.blocks, line.indexInOwner, startOffset);
                while (nextBlock) {
                    nextBlock = this.writeBlock(nextBlock, 0, section.blocks);
                }
                // Todo:continue in next section
            }
            else {
                // Specially handled for nested table cases
                // selection start inside table and end in paragraph outside table
                if (isNullOrUndefined(endCell) && startCell.ownerTable.associatedCell) {
                    var startTable = startCell.getContainerTable();
                    var lastRow = startTable.childWidgets[startTable.childWidgets.length - 1];
                    var endCell_1 = lastRow.childWidgets[lastRow.childWidgets.length - 1];
                    if (endCell_1.ownerTable !== startCell.ownerTable && startCell.ownerTable.associatedCell
                        && (startCell.ownerTable.associatedCell.childWidgets.indexOf(startCell.ownerTable) === 0)) {
                        while (startCell.ownerTable !== endCell_1.ownerTable) {
                            startCell = startCell.ownerTable.associatedCell;
                        }
                    }
                    this.endColumnIndex = endCell_1.columnIndex + endCell_1.cellFormat.columnSpan;
                    this.startColumnIndex = startCell.columnIndex;
                }
                var table = this.createTable(startCell.ownerTable);
                section.blocks.push(table);
                nextBlock = this.writeTable(startCell.ownerTable, table, startCell.ownerRow.indexInOwner, section.blocks);
                while (nextBlock) {
                    nextBlock = this.writeBlock(nextBlock, 0, section.blocks);
                }
            }
        }
        else {
            this.isExport = true;
            if (this.documentHelper.pages.length > 0) {
                var page = this.documentHelper.pages[0];
                this.writePage(page);
            }
        }
        this.writeStyles(this.documentHelper);
        this.writeLists(this.documentHelper);
        this.writeComments(this.documentHelper);
        this.writeRevisions(this.documentHelper);
        var doc = this.document;
        this.clear();
        return doc;
    };
    /**
     * @private
     */
    SfdtExport.prototype.Initialize = function () {
        this.lists = [];
        this.document = {};
        this.document.sections = [];
        this.document.characterFormat = this.writeCharacterFormat(this.documentHelper.characterFormat);
        this.document.paragraphFormat = this.writeParagraphFormat(this.documentHelper.paragraphFormat);
        this.document.defaultTabWidth = this.documentHelper.defaultTabWidth;
        this.document.trackChanges = this.owner.enableTrackChanges;
        this.document.enforcement = this.documentHelper.isDocumentProtected;
        this.document.hashValue = this.documentHelper.hashValue;
        this.document.saltValue = this.documentHelper.saltValue;
        this.document.formatting = this.documentHelper.restrictFormatting;
        this.document.protectionType = this.documentHelper.protectionType;
        this.document.dontUseHTMLParagraphAutoSpacing = this.documentHelper.dontUseHtmlParagraphAutoSpacing;
    };
    /**
     * @private
     */
    SfdtExport.prototype.writePage = function (page) {
        if (page.bodyWidgets.length > 0) {
            var nextBlock = page.bodyWidgets[0];
            do {
                nextBlock = this.writeBodyWidget(nextBlock, 0);
            } while (!isNullOrUndefined(nextBlock));
        }
        return this.document;
    };
    SfdtExport.prototype.writeBodyWidget = function (bodyWidget, index) {
        if (!(bodyWidget instanceof BodyWidget)) {
            return undefined;
        }
        var section = this.createSection(bodyWidget);
        this.document.sections.push(section);
        this.writeHeaderFooters(this.documentHelper.headersFooters[bodyWidget.index], section);
        var firstBlock = bodyWidget.childWidgets[index];
        do {
            firstBlock = this.writeBlock(firstBlock, 0, section.blocks);
        } while (firstBlock);
        var next = bodyWidget;
        do {
            bodyWidget = next;
            next = next.nextRenderedWidget;
        } while (next instanceof BodyWidget && next.index === bodyWidget.index);
        return next;
    };
    SfdtExport.prototype.writeHeaderFooters = function (hfs, section) {
        if (isNullOrUndefined(hfs)) {
            return;
        }
        section.headersFooters.header = this.writeHeaderFooter(hfs[0]);
        section.headersFooters.footer = this.writeHeaderFooter(hfs[1]);
        section.headersFooters.evenHeader = this.writeHeaderFooter(hfs[2]);
        section.headersFooters.evenFooter = this.writeHeaderFooter(hfs[3]);
        section.headersFooters.firstPageHeader = this.writeHeaderFooter(hfs[4]);
        section.headersFooters.firstPageFooter = this.writeHeaderFooter(hfs[5]);
    };
    SfdtExport.prototype.writeHeaderFooter = function (widget) {
        if (isNullOrUndefined(widget) || widget.isEmpty) {
            return undefined;
        }
        var headerFooter = {};
        if (widget && widget.childWidgets && widget.childWidgets.length > 0) {
            headerFooter.blocks = [];
            var firstBlock = widget.firstChild;
            do {
                firstBlock = this.writeBlock(firstBlock, 0, headerFooter.blocks);
            } while (firstBlock);
        }
        return headerFooter;
    };
    SfdtExport.prototype.createSection = function (bodyWidget) {
        var section = {};
        section.sectionFormat = {};
        section.sectionFormat.pageWidth = bodyWidget.sectionFormat.pageWidth;
        section.sectionFormat.pageHeight = bodyWidget.sectionFormat.pageHeight;
        section.sectionFormat.leftMargin = bodyWidget.sectionFormat.leftMargin;
        section.sectionFormat.rightMargin = bodyWidget.sectionFormat.rightMargin;
        section.sectionFormat.topMargin = bodyWidget.sectionFormat.topMargin;
        section.sectionFormat.bottomMargin = bodyWidget.sectionFormat.bottomMargin;
        section.sectionFormat.differentFirstPage = bodyWidget.sectionFormat.differentFirstPage;
        section.sectionFormat.differentOddAndEvenPages = bodyWidget.sectionFormat.differentOddAndEvenPages;
        section.sectionFormat.headerDistance = bodyWidget.sectionFormat.headerDistance;
        section.sectionFormat.footerDistance = bodyWidget.sectionFormat.footerDistance;
        section.sectionFormat.bidi = bodyWidget.sectionFormat.bidi;
        section.blocks = [];
        section.headersFooters = {};
        return section;
    };
    SfdtExport.prototype.writeBlock = function (widget, index, blocks) {
        if (!(widget instanceof BlockWidget)) {
            return undefined;
        }
        if (widget instanceof ParagraphWidget) {
            var paragraph = this.createParagraph(widget);
            blocks.push(paragraph);
            return this.writeParagraph(widget, paragraph, blocks);
        }
        else {
            var tableWidget = widget;
            var table = this.createTable(tableWidget);
            blocks.push(table);
            return this.writeTable(tableWidget, table, 0, blocks);
        }
    };
    SfdtExport.prototype.writeParagraph = function (paragraphWidget, paragraph, blocks, lineIndex, start) {
        if (isNullOrUndefined(lineIndex)) {
            lineIndex = 0;
        }
        if (isNullOrUndefined(start)) {
            start = 0;
        }
        var next = paragraphWidget;
        while (next instanceof ParagraphWidget) {
            if (this.writeLines(next, lineIndex, start, paragraph.inlines)) {
                return undefined;
            }
            lineIndex = 0;
            start = 0;
            paragraphWidget = next;
            next = paragraphWidget.nextSplitWidget;
        }
        next = paragraphWidget.nextRenderedWidget;
        return (next instanceof BlockWidget && paragraphWidget.containerWidget.index === next.containerWidget.index) ? next : undefined;
    };
    SfdtExport.prototype.writeInlines = function (paragraph, line, inlines) {
        var lineWidget = line.clone();
        var isformField = false;
        var bidi = paragraph.paragraphFormat.bidi;
        if (bidi || this.documentHelper.layout.isContainsRtl(lineWidget)) {
            this.documentHelper.layout.reArrangeElementsForRtl(lineWidget, bidi);
        }
        for (var i = 0; i < lineWidget.children.length; i++) {
            var element = lineWidget.children[i];
            if (this.isExport && this.checkboxOrDropdown) {
                if (isformField && element instanceof TextElementBox) {
                    continue;
                }
                if (element instanceof FieldElementBox && element.fieldType === 2) {
                    isformField = true;
                }
            }
            if (element instanceof ListTextElementBox) {
                continue;
            }
            var inline = this.writeInline(element);
            if (!isNullOrUndefined(inline)) {
                inlines.push(inline);
            }
            if (this.isExport && element instanceof FieldElementBox && element.fieldType === 1) {
                isformField = false;
                this.checkboxOrDropdown = false;
            }
        }
    };
    /* tslint:disable:max-func-body-length */
    SfdtExport.prototype.writeInline = function (element) {
        var inline = {};
        if (element.removedIds.length > 0) {
            for (var i = 0; i < element.removedIds.length; i++) {
                element.revisions[i] = this.documentHelper.revisionsInternal.get(element.removedIds[i]);
            }
        }
        inline.characterFormat = this.writeCharacterFormat(element.characterFormat);
        if (element instanceof FieldElementBox) {
            inline.fieldType = element.fieldType;
            if (element.fieldType === 0) {
                inline.hasFieldEnd = true;
                if (element.formFieldData) {
                    inline.formFieldData = {};
                    inline.formFieldData.name = element.formFieldData.name;
                    inline.formFieldData.enabled = element.formFieldData.enabled;
                    inline.formFieldData.helpText = element.formFieldData.helpText;
                    inline.formFieldData.statusText = element.formFieldData.statusText;
                    if (element.formFieldData instanceof TextFormField) {
                        inline.formFieldData.textInput = {};
                        inline.formFieldData.textInput.type = element.formFieldData.type;
                        inline.formFieldData.textInput.maxLength = element.formFieldData.maxLength;
                        inline.formFieldData.textInput.defaultValue = element.formFieldData.defaultValue;
                        inline.formFieldData.textInput.format = element.formFieldData.format;
                    }
                    else if (element.formFieldData instanceof CheckBoxFormField) {
                        inline.formFieldData.checkBox = {};
                        this.checkboxOrDropdown = true;
                        inline.formFieldData.checkBox.sizeType = element.formFieldData.sizeType;
                        inline.formFieldData.checkBox.size = element.formFieldData.size;
                        inline.formFieldData.checkBox.defaultValue = element.formFieldData.defaultValue;
                        inline.formFieldData.checkBox.checked = element.formFieldData.checked;
                    }
                    else {
                        inline.formFieldData.dropDownList = {};
                        this.checkboxOrDropdown = true;
                        inline.formFieldData.dropDownList.dropDownItems = element.formFieldData.dropdownItems;
                        inline.formFieldData.dropDownList.selectedIndex = element.formFieldData.selectedIndex;
                    }
                }
            }
            if (element.fieldCodeType && element.fieldCodeType !== '') {
                inline.fieldCodeType = element.fieldCodeType;
            }
        }
        else if (element instanceof ChartElementBox) {
            this.writeChart(element, inline);
        }
        else if (element instanceof ImageElementBox) {
            inline.imageString = element.imageString;
            inline.width = HelperMethods.convertPixelToPoint(element.width);
            inline.height = HelperMethods.convertPixelToPoint(element.height);
        }
        else if (element instanceof BookmarkElementBox) {
            inline.bookmarkType = element.bookmarkType;
            inline.name = element.name;
        }
        else if (element instanceof TextElementBox) {
            // replacing the no break hyphen character by '-'
            if (element.text.indexOf('\u001e') !== -1) {
                inline.text = element.text.replace('\u001e', '-');
            }
            else if (element.text.indexOf('\u001f') !== -1) {
                inline.text = element.text.replace('\u001f', '');
            }
            else if (element.revisions.length !== 0) {
                if (!this.isExport && this.owner.enableTrackChanges) {
                    this.copyWithTrackChange = true;
                    for (var x = 0; x < element.revisions.length; x++) {
                        if (element.revisions[x].revisionType === 'Deletion') {
                            element.revisions.pop();
                        }
                        else if (element.revisions[x].revisionType === 'Insertion') {
                            element.revisions.pop();
                            inline.text = element.text;
                        }
                        else {
                            inline.text = element.text;
                        }
                    }
                }
                else {
                    inline.text = element.text;
                }
            }
            else {
                inline.text = element.text;
            }
        }
        else if (element instanceof EditRangeStartElementBox) {
            inline.user = element.user;
            inline.group = element.group;
            inline.columnFirst = element.columnFirst;
            inline.columnLast = element.columnLast;
            inline.editRangeId = element.editRangeId.toString();
        }
        else if (element instanceof EditRangeEndElementBox) {
            inline.editableRangeStart = {
                'user': element.editRangeStart.user,
                'group': element.editRangeStart.group,
                'columnFirst': element.editRangeStart.columnFirst,
                'columnLast': element.editRangeStart.columnLast
            };
            inline.editRangeId = element.editRangeId.toString();
        }
        else if (element instanceof CommentCharacterElementBox) {
            inline.commentCharacterType = element.commentType;
            inline.commentId = element.commentId;
        }
        else if (element instanceof ShapeElementBox) {
            this.writeShape(element, inline);
        }
        else {
            inline = undefined;
        }
        if (element.revisions.length > 0) {
            inline.revisionIds = [];
            for (var x = 0; x < element.revisions.length; x++) {
                //revisionIdes[x] = element.revisions[x];
                inline.revisionIds.push(element.revisions[x].revisionID);
                //this.document.revisionIdes.push(inline.revisionIds)
            }
        }
        /*if(element.removedIds.length > 0){
            inline.revisionIds = [];
            for(let x:number = 0;x < element.removedIds.length; x++){
            inline.revisionIds.push(element.removedIds);
            }
        }*/
        return inline;
    };
    SfdtExport.prototype.writeShape = function (element, inline) {
        inline.shapeId = element.shapeId;
        inline.name = element.name;
        inline.alternativeText = element.alternativeText;
        inline.title = element.title;
        inline.visible = element.visible;
        inline.width = HelperMethods.convertPixelToPoint(element.width);
        inline.height = HelperMethods.convertPixelToPoint(element.height);
        inline.widthScale = element.widthScale;
        inline.heightScale = element.heightScale;
        inline.verticalPosition = HelperMethods.convertPixelToPoint(element.verticalPosition);
        inline.verticalOrigin = element.verticalOrigin;
        inline.verticalAlignment = element.verticalAlignment;
        inline.horizontalPosition = HelperMethods.convertPixelToPoint(element.horizontalPosition);
        inline.horizontalOrigin = element.horizontalOrigin;
        inline.horizontalAlignment = element.horizontalAlignment;
        inline.zOrderPosition = element.zOrderPosition;
        inline.allowOverlap = element.allowOverlap;
        inline.layoutInCell = element.layoutInCell;
        inline.lockAnchor = element.lockAnchor;
        inline.autoShapeType = element.autoShapeType;
        if (element.lineFormat) {
            inline.lineFormat = {};
            inline.lineFormat.lineFormatType = element.lineFormat.lineFormatType;
            inline.lineFormat.color = element.lineFormat.color;
            inline.lineFormat.weight = element.lineFormat.weight;
            inline.lineFormat.lineStyle = element.lineFormat.dashStyle;
        }
        if (element.textFrame) {
            inline.textFrame = {};
            inline.textFrame.textVerticalAlignment = element.textFrame.textVerticalAlignment;
            inline.textFrame.leftMargin = HelperMethods.convertPixelToPoint(element.textFrame.marginLeft);
            inline.textFrame.rightMargin = HelperMethods.convertPixelToPoint(element.textFrame.marginRight);
            inline.textFrame.topMargin = HelperMethods.convertPixelToPoint(element.textFrame.marginTop);
            inline.textFrame.bottomMargin = HelperMethods.convertPixelToPoint(element.textFrame.marginBottom);
            inline.textFrame.blocks = [];
            for (var j = 0; j < element.textFrame.childWidgets.length; j++) {
                var textFrameBlock = element.textFrame.childWidgets[j];
                this.writeBlock(textFrameBlock, 0, inline.textFrame.blocks);
            }
        }
    };
    SfdtExport.prototype.writeChart = function (element, inline) {
        inline.chartLegend = {};
        inline.chartTitleArea = {};
        inline.chartArea = {};
        inline.plotArea = {};
        inline.chartCategory = [];
        inline.chartSeries = [];
        inline.chartPrimaryCategoryAxis = {};
        inline.chartPrimaryValueAxis = {};
        this.writeChartTitleArea(element.chartTitleArea, inline.chartTitleArea);
        this.writeChartArea(element.chartArea, inline.chartArea);
        this.writeChartArea(element.chartPlotArea, inline.plotArea);
        this.writeChartCategory(element, inline.chartCategory);
        this.createChartSeries(element, inline.chartSeries);
        this.writeChartLegend(element.chartLegend, inline.chartLegend);
        this.writeChartCategoryAxis(element.chartPrimaryCategoryAxis, inline.chartPrimaryCategoryAxis);
        this.writeChartCategoryAxis(element.chartPrimaryValueAxis, inline.chartPrimaryValueAxis);
        if (element.chartDataTable.showSeriesKeys !== undefined) {
            inline.chartDataTable = {};
            this.writeChartDataTable(element.chartDataTable, inline.chartDataTable);
        }
        inline.chartTitle = element.title;
        inline.chartType = element.type;
        inline.gapWidth = element.chartGapWidth;
        inline.overlap = element.chartOverlap;
        inline.height = HelperMethods.convertPixelToPoint(element.height);
        inline.width = HelperMethods.convertPixelToPoint(element.width);
    };
    SfdtExport.prototype.writeChartTitleArea = function (titleArea, chartTitleArea) {
        chartTitleArea.fontName = titleArea.chartfontName;
        chartTitleArea.fontSize = titleArea.chartFontSize;
        chartTitleArea.layout = {};
        chartTitleArea.dataFormat = this.writeChartDataFormat(titleArea.dataFormat);
        this.writeChartLayout(titleArea.layout, chartTitleArea.layout);
    };
    SfdtExport.prototype.writeChartDataFormat = function (format) {
        var chartDataFormat = {};
        chartDataFormat.fill = {};
        chartDataFormat.line = {};
        chartDataFormat.fill.foreColor = format.fill.color;
        chartDataFormat.fill.rgb = format.fill.rgb;
        chartDataFormat.line.color = format.line.color;
        chartDataFormat.line.rgb = format.line.rgb;
        return chartDataFormat;
    };
    SfdtExport.prototype.writeChartLayout = function (layout, chartLayout) {
        chartLayout.layoutX = layout.chartLayoutLeft;
        chartLayout.layoutY = layout.chartLayoutTop;
    };
    SfdtExport.prototype.writeChartArea = function (area, chartArea) {
        chartArea.foreColor = area.chartForeColor;
    };
    SfdtExport.prototype.writeChartLegend = function (legend, chartLegend) {
        chartLegend.position = legend.chartLegendPostion;
        chartLegend.chartTitleArea = {};
        this.writeChartTitleArea(legend.chartTitleArea, chartLegend.chartTitleArea);
    };
    SfdtExport.prototype.writeChartCategoryAxis = function (categoryAxis, primaryCategoryAxis) {
        primaryCategoryAxis.chartTitle = categoryAxis.categoryAxisTitle;
        primaryCategoryAxis.chartTitleArea = {};
        this.writeChartTitleArea(categoryAxis.chartTitleArea, primaryCategoryAxis.chartTitleArea);
        primaryCategoryAxis.categoryType = categoryAxis.categoryAxisType;
        primaryCategoryAxis.fontSize = categoryAxis.axisFontSize;
        primaryCategoryAxis.fontName = categoryAxis.axisFontName;
        primaryCategoryAxis.numberFormat = categoryAxis.categoryNumberFormat;
        primaryCategoryAxis.maximumValue = categoryAxis.max;
        primaryCategoryAxis.minimumValue = categoryAxis.min;
        primaryCategoryAxis.majorUnit = categoryAxis.interval;
        primaryCategoryAxis.hasMajorGridLines = categoryAxis.majorGridLines;
        primaryCategoryAxis.hasMinorGridLines = categoryAxis.minorGridLines;
        primaryCategoryAxis.majorTickMark = categoryAxis.majorTick;
        primaryCategoryAxis.minorTickMark = categoryAxis.minorTick;
        primaryCategoryAxis.tickLabelPosition = categoryAxis.tickPosition;
    };
    SfdtExport.prototype.writeChartDataTable = function (chartDataTable, dataTable) {
        dataTable.showSeriesKeys = chartDataTable.showSeriesKeys;
        dataTable.hasHorzBorder = chartDataTable.hasHorzBorder;
        dataTable.hasVertBorder = chartDataTable.hasVertBorder;
        dataTable.hasBorders = chartDataTable.hasBorders;
    };
    SfdtExport.prototype.writeChartCategory = function (element, chartCategory) {
        var data = element.chartCategory;
        chartCategory.chartData = [];
        for (var i = 0; i < data.length; i++) {
            var xData = data[i];
            var categories = this.createChartCategory(xData, element.chartType);
            chartCategory.push(categories);
        }
    };
    SfdtExport.prototype.createChartCategory = function (data, type) {
        var chartCategory = {};
        chartCategory.chartData = [];
        this.writeChartData(data, chartCategory.chartData, type);
        chartCategory.categoryXName = data.categoryXName;
        return chartCategory;
    };
    SfdtExport.prototype.writeChartData = function (element, chartData, type) {
        var data = element.chartData;
        for (var i = 0; i < data.length; i++) {
            var yData = data[i];
            var yCategory = this.createChartData(yData, type);
            chartData.push(yCategory);
        }
    };
    SfdtExport.prototype.createChartData = function (data, type) {
        var chartData = {};
        chartData.yValue = data.yValue;
        if (type === 'Bubble') {
            chartData.size = data.size;
        }
        return chartData;
    };
    SfdtExport.prototype.createChartSeries = function (element, chartSeries) {
        var data = element.chartSeries;
        var type = element.chartType;
        for (var i = 0; i < data.length; i++) {
            var yData = data[i];
            var series = this.writeChartSeries(yData, type);
            chartSeries.push(series);
        }
    };
    SfdtExport.prototype.writeChartSeries = function (series, type) {
        var isPieType = (type === 'Pie' || type === 'Doughnut');
        var chartSeries = {};
        var errorBar = {};
        var errorBarData = series.errorBar;
        chartSeries.dataPoints = [];
        chartSeries.seriesName = series.seriesName;
        if (isPieType) {
            if (!isNullOrUndefined(series.firstSliceAngle)) {
                chartSeries.firstSliceAngle = series.firstSliceAngle;
            }
            if (type === 'Doughnut') {
                chartSeries.holeSize = series.doughnutHoleSize;
            }
        }
        if (!isNullOrUndefined(series.dataLabels.labelPosition)) {
            var dataLabel = this.writeChartDataLabels(series.dataLabels);
            chartSeries.dataLabel = dataLabel;
        }
        if (!isNullOrUndefined(series.seriesFormat.markerStyle)) {
            var seriesFormat = {};
            var format = series.seriesFormat;
            seriesFormat.markerStyle = format.markerStyle;
            seriesFormat.markerSize = format.numberValue;
            seriesFormat.markerColor = format.markerColor;
            chartSeries.seriesFormat = seriesFormat;
        }
        if (!isNullOrUndefined(errorBarData.type)) {
            errorBar.type = errorBarData.type;
            errorBar.direction = errorBarData.direction;
            errorBar.endStyle = errorBarData.endStyle;
            errorBar.numberValue = errorBarData.numberValue;
            chartSeries.errorBar = errorBarData;
        }
        if (series.trendLines.length > 0) {
            chartSeries.trendLines = [];
            for (var i = 0; i < series.trendLines.length; i++) {
                var trendLine = this.writeChartTrendLines(series.trendLines[i]);
                chartSeries.trendLines.push(trendLine);
            }
        }
        for (var i = 0; i < series.chartDataFormat.length; i++) {
            var format = this.writeChartDataFormat(series.chartDataFormat[i]);
            chartSeries.dataPoints.push(format);
        }
        return chartSeries;
    };
    SfdtExport.prototype.writeChartDataLabels = function (dataLabels) {
        var dataLabel = {};
        dataLabel.position = dataLabels.position;
        dataLabel.fontName = dataLabels.fontName;
        dataLabel.fontColor = dataLabels.fontColor;
        dataLabel.fontSize = dataLabels.fontSize;
        dataLabel.isLegendKey = dataLabels.isLegendKey;
        dataLabel.isBubbleSize = dataLabels.isBubbleSize;
        dataLabel.isCategoryName = dataLabels.isCategoryName;
        dataLabel.isSeriesName = dataLabels.isSeriesName;
        dataLabel.isValue = dataLabels.isValue;
        dataLabel.isPercentage = dataLabels.isPercentage;
        dataLabel.isLeaderLines = dataLabels.isLeaderLines;
        return dataLabel;
    };
    SfdtExport.prototype.writeChartTrendLines = function (trendLines) {
        var trendLine = {};
        trendLine.name = trendLines.trendLineName;
        trendLine.type = trendLines.trendLineType;
        trendLine.forward = trendLines.forwardValue;
        trendLine.backward = trendLines.backwardValue;
        trendLine.intercept = trendLines.interceptValue;
        trendLine.isDisplayEquation = trendLines.isDisplayEquation;
        trendLine.isDisplayRSquared = trendLines.isDisplayRSquared;
        return trendLine;
    };
    SfdtExport.prototype.writeLines = function (paragraph, lineIndex, offset, inlines) {
        var startIndex = lineIndex;
        var endParagraph = this.endLine instanceof LineWidget && this.endLine.paragraph === paragraph;
        var endIndex = endParagraph ? this.endLine.indexInOwner : paragraph.childWidgets.length - 1;
        for (var i = startIndex; i <= endIndex; i++) {
            var child = paragraph.childWidgets[i];
            if (this.endLine === child || (lineIndex === i && offset !== 0)) {
                this.writeLine(child, offset, inlines);
            }
            else {
                this.writeInlines(paragraph, child, inlines);
            }
        }
        return endParagraph;
    };
    SfdtExport.prototype.writeLine = function (line, offset, inlines) {
        var isEnd = line === this.endLine;
        var lineWidget = line.clone();
        var bidi = line.paragraph.paragraphFormat.bidi;
        if (bidi || this.documentHelper.layout.isContainsRtl(lineWidget)) {
            this.documentHelper.layout.reArrangeElementsForRtl(lineWidget, bidi);
        }
        var started = false;
        var ended = false;
        var length = 0;
        for (var j = 0; j < lineWidget.children.length; j++) {
            var element = lineWidget.children[j];
            if (element instanceof ListTextElementBox) {
                continue;
            }
            var inline = undefined;
            length += element.length;
            started = length > offset;
            ended = isEnd && length >= this.endOffset;
            if (!started) {
                continue;
            }
            inline = this.writeInline(element);
            inlines[inlines.length] = inline;
            if (length > offset || ended) {
                if (inline.hasOwnProperty('text')) {
                    var startIndex = length - element.length;
                    var indexInInline = offset - startIndex;
                    var endIndex = ended ? this.endOffset - startIndex : element.length;
                    inline.text = inline.text.substring(indexInInline, endIndex);
                }
                offset = -1;
            }
            if (!this.isExport && !inline.hasOwnProperty('text') && this.owner.enableTrackChanges) {
                var index = inlines.length - 1;
                inlines.splice(index, 1);
            }
            if (ended) {
                break;
            }
        }
    };
    SfdtExport.prototype.createParagraph = function (paragraphWidget) {
        var paragraph = {};
        var isParaSelected = false;
        if (this.documentHelper.selection && !this.documentHelper.selection.isEmpty && !this.isExport) {
            var endPos = this.documentHelper.selection.end;
            if (!this.documentHelper.selection.isForward) {
                endPos = this.documentHelper.selection.start;
            }
            var lastLine = endPos.paragraph.childWidgets[endPos.paragraph.childWidgets.length - 1];
            isParaSelected = this.documentHelper.selection.isParagraphLastLine(lastLine) && endPos.currentWidget === lastLine
                && endPos.offset === this.documentHelper.selection.getLineLength(lastLine) + 1;
        }
        else {
            isParaSelected = true;
        }
        // tslint:disable-next-line:max-line-length
        paragraph.paragraphFormat = this.writeParagraphFormat(isParaSelected ? paragraphWidget.paragraphFormat : new WParagraphFormat(paragraphWidget));
        paragraph.characterFormat = this.writeCharacterFormat(isParaSelected ? paragraphWidget.characterFormat : new WCharacterFormat(paragraphWidget));
        paragraph.inlines = [];
        return paragraph;
    };
    /**
     * @private
     */
    SfdtExport.prototype.writeCharacterFormat = function (format, isInline) {
        var characterFormat = {};
        HelperMethods.writeCharacterFormat(characterFormat, isInline, format);
        if (this.writeInlineStyles && !isInline) {
            characterFormat.inlineFormat = this.writeCharacterFormat(format, true);
        }
        return characterFormat;
    };
    SfdtExport.prototype.writeParagraphFormat = function (format, isInline) {
        var paragraphFormat = {};
        paragraphFormat.leftIndent = isInline ? format.leftIndent : format.getValue('leftIndent');
        paragraphFormat.rightIndent = isInline ? format.rightIndent : format.getValue('rightIndent');
        paragraphFormat.firstLineIndent = isInline ? format.firstLineIndent : format.getValue('firstLineIndent');
        paragraphFormat.textAlignment = isInline ? format.textAlignment : format.getValue('textAlignment');
        paragraphFormat.beforeSpacing = isInline ? format.beforeSpacing : format.getValue('beforeSpacing');
        paragraphFormat.afterSpacing = isInline ? format.afterSpacing : format.getValue('afterSpacing');
        paragraphFormat.lineSpacing = isInline ? format.lineSpacing : format.getValue('lineSpacing');
        paragraphFormat.lineSpacingType = isInline ? format.lineSpacingType : format.getValue('lineSpacingType');
        paragraphFormat.styleName = !isNullOrUndefined(format.baseStyle) ? format.baseStyle.name : undefined;
        paragraphFormat.outlineLevel = isInline ? format.outlineLevel : format.getValue('outlineLevel');
        paragraphFormat.listFormat = this.writeListFormat(format.listFormat, isInline);
        paragraphFormat.tabs = this.writeTabs(format.tabs);
        paragraphFormat.bidi = isInline ? format.bidi : format.getValue('bidi');
        paragraphFormat.contextualSpacing = isInline ? format.contextualSpacing : format.getValue('contextualSpacing');
        if (this.writeInlineStyles && !isInline) {
            paragraphFormat.inlineFormat = this.writeParagraphFormat(format, true);
        }
        return paragraphFormat;
    };
    SfdtExport.prototype.writeTabs = function (tabStops) {
        if (isNullOrUndefined(tabStops) || tabStops.length < 1) {
            return undefined;
        }
        var tabs = [];
        for (var i = 0; i < tabStops.length; i++) {
            var tabStop = tabStops[i];
            var tab = {};
            tab.position = tabStop.position;
            tab.deletePosition = tabStop.deletePosition;
            tab.tabJustification = tabStop.tabJustification;
            tab.tabLeader = tabStop.tabLeader;
            tabs.push(tab);
        }
        return tabs;
    };
    /**
     * @private
     */
    SfdtExport.prototype.writeListFormat = function (format, isInline) {
        var listFormat = {};
        var listIdValue = format.getValue('listId');
        if (!isNullOrUndefined(listIdValue)) {
            listFormat.listId = listIdValue;
            if (this.lists.indexOf(format.listId) < 0) {
                this.lists.push(format.listId);
            }
        }
        var listLevelNumber = format.getValue('listLevelNumber');
        if (!isNullOrUndefined(listLevelNumber)) {
            listFormat.listLevelNumber = listLevelNumber;
        }
        return listFormat;
    };
    SfdtExport.prototype.writeTable = function (tableWidget, table, index, blocks) {
        var widget = tableWidget.childWidgets[index];
        if (widget instanceof TableRowWidget) {
            if (this.writeRow(widget, table.rows)) {
                return undefined;
            }
        }
        var next = tableWidget;
        do {
            tableWidget = next;
            next = tableWidget.nextSplitWidget;
        } while (next instanceof BlockWidget);
        next = tableWidget.nextRenderedWidget;
        return (next instanceof BlockWidget && next.containerWidget.index === tableWidget.containerWidget.index) ? next : undefined;
    };
    SfdtExport.prototype.writeRow = function (rowWidget, rows) {
        if (!(rowWidget instanceof TableRowWidget)) {
            return false;
        }
        var row = this.createRow(rowWidget);
        rows.push(row);
        for (var i = 0; i < rowWidget.childWidgets.length; i++) {
            var widget = rowWidget.childWidgets[i];
            if (widget instanceof TableCellWidget) {
                if (rowWidget.index === widget.rowIndex
                    && (isNullOrUndefined(this.startColumnIndex) || widget.columnIndex >= this.startColumnIndex)
                    && (isNullOrUndefined(this.endColumnIndex) || widget.columnIndex < this.endColumnIndex)) {
                    if (this.writeCell(widget, row.cells)) {
                        return true;
                    }
                }
            }
        }
        var next = rowWidget;
        do {
            rowWidget = next;
            next = rowWidget.nextRenderedWidget;
            if (next && rowWidget.ownerTable.index !== next.ownerTable.index) {
                next = undefined;
            }
        } while (next instanceof TableRowWidget && next.index === rowWidget.index);
        return this.writeRow(next, rows);
    };
    SfdtExport.prototype.writeCell = function (cellWidget, cells) {
        var cell = this.createCell(cellWidget);
        cells.push(cell);
        var firstBlock = cellWidget.firstChild;
        do {
            firstBlock = this.writeBlock(firstBlock, 0, cell.blocks);
        } while (firstBlock);
        return this.endCell instanceof TableCellWidget ? this.endCell.cellFormat === cellWidget.cellFormat : false;
    };
    SfdtExport.prototype.createTable = function (tableWidget) {
        var table = {};
        table.rows = [];
        table.grid = [];
        for (var i = 0; i < tableWidget.tableHolder.columns.length; i++) {
            table.grid[i] = tableWidget.tableHolder.columns[i].preferredWidth;
        }
        table.tableFormat = this.writeTableFormat(tableWidget.tableFormat);
        table.description = tableWidget.description;
        table.title = tableWidget.title;
        table.columnCount = tableWidget.tableHolder.columns.length;
        return table;
    };
    SfdtExport.prototype.createRow = function (rowWidget) {
        var row = {};
        row.cells = [];
        row.rowFormat = this.writeRowFormat(rowWidget.rowFormat);
        return row;
    };
    SfdtExport.prototype.createCell = function (cellWidget) {
        var cell = {};
        cell.blocks = [];
        cell.cellFormat = this.writeCellFormat(cellWidget.cellFormat);
        cell.columnIndex = cellWidget.columnIndex;
        return cell;
    };
    SfdtExport.prototype.writeShading = function (wShading) {
        var shading = {};
        shading.backgroundColor = wShading.hasValue('backgroundColor') ? wShading.backgroundColor : undefined;
        shading.foregroundColor = wShading.hasValue('foregroundColor') ? wShading.foregroundColor : undefined;
        shading.textureStyle = wShading.hasValue('textureStyle') ? wShading.textureStyle : undefined;
        return shading;
    };
    SfdtExport.prototype.writeBorder = function (wBorder) {
        var border = {};
        border.color = wBorder.hasValue('color') ? wBorder.color : undefined;
        border.hasNoneStyle = wBorder.hasValue('hasNoneStyle') ? wBorder.hasNoneStyle : undefined;
        border.lineStyle = wBorder.hasValue('lineStyle') ? wBorder.lineStyle : undefined;
        border.lineWidth = wBorder.hasValue('lineWidth') ? wBorder.lineWidth : undefined;
        border.shadow = wBorder.hasValue('shadow') ? wBorder.shadow : undefined;
        border.space = wBorder.hasValue('space') ? wBorder.space : undefined;
        return border;
    };
    SfdtExport.prototype.writeBorders = function (wBorders) {
        var borders = {};
        borders.top = this.writeBorder(wBorders.top);
        borders.left = this.writeBorder(wBorders.left);
        borders.right = this.writeBorder(wBorders.right);
        borders.bottom = this.writeBorder(wBorders.bottom);
        borders.diagonalDown = this.writeBorder(wBorders.diagonalDown);
        borders.diagonalUp = this.writeBorder(wBorders.diagonalUp);
        borders.horizontal = this.writeBorder(wBorders.horizontal);
        borders.vertical = this.writeBorder(wBorders.vertical);
        return borders;
    };
    SfdtExport.prototype.writeCellFormat = function (wCellFormat) {
        var cellFormat = {};
        cellFormat.borders = this.writeBorders(wCellFormat.borders);
        cellFormat.shading = this.writeShading(wCellFormat.shading);
        cellFormat.topMargin = wCellFormat.hasValue('topMargin') ? wCellFormat.topMargin : undefined;
        cellFormat.rightMargin = wCellFormat.hasValue('rightMargin') ? wCellFormat.rightMargin : undefined;
        cellFormat.leftMargin = wCellFormat.hasValue('leftMargin') ? wCellFormat.leftMargin : undefined;
        cellFormat.bottomMargin = wCellFormat.hasValue('bottomMargin') ? wCellFormat.bottomMargin : undefined;
        cellFormat.preferredWidth = wCellFormat.hasValue('preferredWidth') ? wCellFormat.preferredWidth : undefined;
        cellFormat.preferredWidthType = wCellFormat.hasValue('preferredWidthType') ? wCellFormat.preferredWidthType : undefined;
        cellFormat.cellWidth = wCellFormat.hasValue('cellWidth') ? wCellFormat.cellWidth : undefined;
        cellFormat.columnSpan = wCellFormat.columnSpan;
        cellFormat.rowSpan = wCellFormat.rowSpan;
        cellFormat.verticalAlignment = wCellFormat.hasValue('verticalAlignment') ? wCellFormat.verticalAlignment : undefined;
        return cellFormat;
    };
    SfdtExport.prototype.writeRowFormat = function (wRowFormat) {
        var rowFormat = {};
        var revisionIds = [];
        rowFormat.height = wRowFormat.hasValue('height') ? wRowFormat.height : undefined;
        rowFormat.allowBreakAcrossPages = wRowFormat.hasValue('allowBreakAcrossPages') ? wRowFormat.allowBreakAcrossPages : undefined;
        rowFormat.heightType = wRowFormat.hasValue('heightType') ? wRowFormat.heightType : undefined;
        rowFormat.isHeader = wRowFormat.hasValue('isHeader') ? wRowFormat.isHeader : undefined;
        rowFormat.borders = this.writeBorders(wRowFormat.borders);
        rowFormat.gridBefore = wRowFormat.gridBefore;
        rowFormat.gridBeforeWidth = wRowFormat.hasValue('gridBeforeWidth') ? wRowFormat.gridBeforeWidth : undefined;
        rowFormat.gridBeforeWidthType = wRowFormat.hasValue('gridBeforeWidthType') ? wRowFormat.gridBeforeWidthType : undefined;
        rowFormat.gridAfter = wRowFormat.gridAfter;
        rowFormat.gridAfterWidth = wRowFormat.hasValue('gridAfterWidth') ? wRowFormat.gridAfterWidth : undefined;
        rowFormat.gridAfterWidthType = wRowFormat.hasValue('gridAfterWidthType') ? wRowFormat.gridAfterWidthType : undefined;
        rowFormat.leftMargin = wRowFormat.hasValue('leftMargin') ? wRowFormat.leftMargin : undefined;
        rowFormat.topMargin = wRowFormat.hasValue('topMargin') ? wRowFormat.topMargin : undefined;
        rowFormat.rightMargin = wRowFormat.hasValue('rightMargin') ? wRowFormat.rightMargin : undefined;
        rowFormat.bottomMargin = wRowFormat.hasValue('bottomMargin') ? wRowFormat.bottomMargin : undefined;
        rowFormat.leftIndent = wRowFormat.hasValue('leftIndent') ? wRowFormat.leftIndent : undefined;
        for (var j = 0; j < wRowFormat.revisions.length; j++) {
            rowFormat.revisionIds = this.writeRowRevisions(wRowFormat.revisions[j], revisionIds);
        }
        return rowFormat;
    };
    SfdtExport.prototype.writeRowRevisions = function (wrevisions, revisionIds) {
        revisionIds.push(wrevisions.revisionID);
        return revisionIds;
    };
    SfdtExport.prototype.writeTableFormat = function (wTableFormat) {
        var tableFormat = {};
        tableFormat.borders = this.writeBorders(wTableFormat.borders);
        tableFormat.shading = this.writeShading(wTableFormat.shading);
        tableFormat.cellSpacing = wTableFormat.hasValue('cellSpacing') ? wTableFormat.cellSpacing : undefined;
        tableFormat.leftIndent = wTableFormat.hasValue('leftIndent') ? wTableFormat.leftIndent : undefined;
        tableFormat.tableAlignment = wTableFormat.hasValue('tableAlignment"') ? wTableFormat.tableAlignment : undefined;
        tableFormat.topMargin = wTableFormat.hasValue('topMargin') ? wTableFormat.topMargin : undefined;
        tableFormat.rightMargin = wTableFormat.hasValue('rightMargin') ? wTableFormat.rightMargin : undefined;
        tableFormat.leftMargin = wTableFormat.hasValue('leftMargin') ? wTableFormat.leftMargin : undefined;
        tableFormat.bottomMargin = wTableFormat.hasValue('bottomMargin') ? wTableFormat.bottomMargin : undefined;
        tableFormat.preferredWidth = wTableFormat.hasValue('preferredWidth') ? wTableFormat.preferredWidth : undefined;
        tableFormat.preferredWidthType = wTableFormat.hasValue('preferredWidthType') ? wTableFormat.preferredWidthType : undefined;
        tableFormat.bidi = wTableFormat.hasValue('bidi') ? wTableFormat.bidi : undefined;
        tableFormat.allowAutoFit = wTableFormat.hasValue('allowAutoFit') ? wTableFormat.allowAutoFit : undefined;
        return tableFormat;
    };
    SfdtExport.prototype.writeStyles = function (documentHelper) {
        var styles = [];
        this.document.styles = [];
        for (var i = 0; i < documentHelper.styles.length; i++) {
            this.document.styles.push(this.writeStyle(documentHelper.styles.getItem(i)));
        }
    };
    SfdtExport.prototype.writeStyle = function (style) {
        var wStyle = {};
        wStyle.name = style.name;
        if (style.type === 'Paragraph') {
            wStyle.type = 'Paragraph';
            wStyle.paragraphFormat = this.writeParagraphFormat(style.paragraphFormat);
            wStyle.characterFormat = this.writeCharacterFormat(style.characterFormat);
        }
        if (style.type === 'Character') {
            wStyle.type = 'Character';
            wStyle.characterFormat = this.writeCharacterFormat(style.characterFormat);
        }
        if (!isNullOrUndefined(style.basedOn)) {
            wStyle.basedOn = style.basedOn.name;
        }
        if (!isNullOrUndefined(style.link)) {
            wStyle.link = style.link.name;
        }
        if (!isNullOrUndefined(style.next)) {
            wStyle.next = style.next.name;
        }
        return wStyle;
    };
    SfdtExport.prototype.writeRevisions = function (documentHelper) {
        this.document.revisions = [];
        for (var i = 0; i < documentHelper.owner.revisions.changes.length; i++) {
            this.document.revisions.push(this.writeRevision(documentHelper.owner.revisions.changes[i]));
        }
    };
    SfdtExport.prototype.writeRevision = function (revisions) {
        var revision = {};
        revision.author = revisions.author;
        revision.date = revisions.date;
        revision.revisionType = revisions.revisionType;
        revision.revisionId = revisions.revisionID;
        return revision;
    };
    SfdtExport.prototype.writeComments = function (documentHelper) {
        this.document.comments = [];
        for (var i = 0; i < documentHelper.comments.length; i++) {
            this.document.comments.push(this.writeComment(documentHelper.comments[i]));
        }
    };
    SfdtExport.prototype.writeComment = function (comments) {
        var comment = {};
        comment.commentId = comments.commentId;
        comment.author = comments.author;
        comment.date = comments.date;
        comment.blocks = [];
        comment.blocks.push(this.commentInlines(comments.text));
        comment.done = comments.isResolved;
        comment.replyComments = [];
        for (var i = 0; i < comments.replyComments.length; i++) {
            comment.replyComments.push(this.writeComment(comments.replyComments[i]));
        }
        return comment;
    };
    SfdtExport.prototype.commentInlines = function (ctext) {
        var blocks = {};
        blocks.inlines = [{ text: ctext }];
        return blocks;
    };
    SfdtExport.prototype.writeLists = function (documentHelper) {
        var abstractLists = [];
        this.document.lists = [];
        for (var i = 0; i < documentHelper.lists.length; i++) {
            var list = documentHelper.lists[i];
            if (this.lists.indexOf(list.listId) > -1) {
                this.document.lists.push(this.writeList(list));
                if (abstractLists.indexOf(list.abstractListId) < 0) {
                    abstractLists.push(list.abstractListId);
                }
            }
        }
        this.document.abstractLists = [];
        for (var i = 0; i < documentHelper.abstractLists.length; i++) {
            var abstractList = documentHelper.abstractLists[i];
            if (abstractLists.indexOf(abstractList.abstractListId) > -1) {
                this.document.abstractLists.push(this.writeAbstractList(abstractList));
            }
        }
    };
    SfdtExport.prototype.writeAbstractList = function (wAbstractList) {
        var abstractList = {};
        abstractList.abstractListId = wAbstractList.abstractListId;
        abstractList.levels = [];
        for (var i = 0; i < wAbstractList.levels.length; i++) {
            abstractList.levels[i] = this.writeListLevel(wAbstractList.levels[i]);
        }
        return abstractList;
    };
    SfdtExport.prototype.writeList = function (wList) {
        var list = {};
        list.abstractListId = wList.abstractListId;
        list.levelOverrides = [];
        for (var i = 0; i < wList.levelOverrides.length; i++) {
            list.levelOverrides.push(this.writeLevelOverrides(wList.levelOverrides[i]));
        }
        list.listId = wList.listId;
        return list;
    };
    SfdtExport.prototype.writeLevelOverrides = function (wlevel) {
        var levelOverrides = {};
        levelOverrides.levelNumber = wlevel.levelNumber;
        if (wlevel.overrideListLevel) {
            levelOverrides.overrideListLevel = this.writeListLevel(wlevel.overrideListLevel);
        }
        levelOverrides.startAt = wlevel.startAt;
        return levelOverrides;
    };
    SfdtExport.prototype.writeListLevel = function (wListLevel) {
        var listLevel = {};
        listLevel.characterFormat = this.writeCharacterFormat(wListLevel.characterFormat);
        listLevel.paragraphFormat = this.writeParagraphFormat(wListLevel.paragraphFormat);
        listLevel.followCharacter = wListLevel.followCharacter;
        listLevel.listLevelPattern = wListLevel.listLevelPattern;
        listLevel.numberFormat = wListLevel.numberFormat;
        listLevel.restartLevel = wListLevel.restartLevel;
        listLevel.startAt = wListLevel.startAt;
        return listLevel;
    };
    /**
     * @private
     */
    SfdtExport.prototype.destroy = function () {
        this.lists = undefined;
        this.endLine = undefined;
        this.endOffset = undefined;
        this.documentHelper = undefined;
    };
    return SfdtExport;
}());
export { SfdtExport };

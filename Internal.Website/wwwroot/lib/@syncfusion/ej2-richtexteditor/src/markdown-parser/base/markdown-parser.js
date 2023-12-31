import { Observer } from '@syncfusion/ej2-base';
import * as CONSTANT from './constant';
import { MDLists } from './../plugin/lists';
import { MDFormats } from './../plugin/formats';
import { MDSelectionFormats } from './../plugin/md-selection-formats';
import { MarkdownSelection } from './../plugin/markdown-selection';
import { extend } from '@syncfusion/ej2-base';
import { markdownFormatTags, markdownListsTags, markdownSelectionTags } from './../../common/config';
import { UndoRedoCommands } from './../plugin/undo';
import { MDLink } from './../plugin/link';
import { MDTable } from './../plugin/table';
import * as EVENTS from './../../common/constant';
import { ClearFormat } from './../plugin/clearformat';
/**
 * MarkdownParser internal component
 * @hidden

 */
var MarkdownParser = /** @class */ (function () {
    /**
     * Constructor for creating the component
     * @hidden

     */
    function MarkdownParser(options) {
        this.initialize();
        extend(this, this, options, true);
        this.observer = new Observer(this);
        this.markdownSelection = new MarkdownSelection();
        this.listObj = new MDLists({ parent: this, syntax: this.listTags });
        this.formatObj = new MDFormats({ parent: this, syntax: this.formatTags });
        this.undoRedoManager = new UndoRedoCommands(this, options.options);
        this.mdSelectionFormats = new MDSelectionFormats({ parent: this, syntax: this.selectionTags });
        this.linkObj = new MDLink(this);
        this.tableObj = new MDTable({ parent: this, syntaxTag: ({ Formats: this.formatTags, List: this.listTags }) });
        this.clearObj = new ClearFormat(this);
        this.wireEvents();
    }
    MarkdownParser.prototype.initialize = function () {
        this.formatTags = markdownFormatTags;
        this.listTags = markdownListsTags;
        this.selectionTags = markdownSelectionTags;
    };
    MarkdownParser.prototype.wireEvents = function () {
        this.observer.on(EVENTS.KEY_DOWN, this.editorKeyDown, this);
        this.observer.on(EVENTS.KEY_UP, this.editorKeyUp, this);
        this.observer.on(EVENTS.MODEL_CHANGED, this.onPropertyChanged, this);
    };
    MarkdownParser.prototype.onPropertyChanged = function (props) {
        this.observer.notify(EVENTS.MODEL_CHANGED_PLUGIN, props);
    };
    MarkdownParser.prototype.editorKeyDown = function (e) {
        this.observer.notify(EVENTS.KEY_DOWN_HANDLER, e);
    };
    MarkdownParser.prototype.editorKeyUp = function (e) {
        this.observer.notify(EVENTS.KEY_UP_HANDLER, e);
    };
    /**
     * markdown execCommand method
     * @hidden

     */
    MarkdownParser.prototype.execCommand = function (command, value, event, callBack, text, exeValue) {
        switch (command.toLocaleLowerCase()) {
            case 'lists':
                this.observer.notify(CONSTANT.LISTS_COMMAND, { subCommand: value, event: event, callBack: callBack });
                break;
            case 'formats':
                this.observer.notify(EVENTS.FORMAT_TYPE, { subCommand: value, event: event, callBack: callBack });
                break;
            case 'actions':
                this.observer.notify(EVENTS.ACTION, { subCommand: value, event: event, callBack: callBack });
                break;
            case 'style':
            case 'effects':
            case 'casing':
                this.observer.notify(CONSTANT.selectionCommand, { subCommand: value, event: event, callBack: callBack });
                break;
            case 'links':
            case 'images':
                this.observer.notify(CONSTANT.LINK_COMMAND, { subCommand: value, event: event, callBack: callBack, item: exeValue });
                break;
            case 'table':
                switch (value.toString().toLocaleLowerCase()) {
                    case 'createtable':
                        this.observer.notify(CONSTANT.MD_TABLE, { subCommand: value, item: exeValue, event: event, callBack: callBack });
                        break;
                }
                break;
            case 'clear':
                this.observer.notify(CONSTANT.CLEAR_COMMAND, { subCommand: value, event: event, callBack: callBack });
                break;
        }
    };
    return MarkdownParser;
}());
export { MarkdownParser };

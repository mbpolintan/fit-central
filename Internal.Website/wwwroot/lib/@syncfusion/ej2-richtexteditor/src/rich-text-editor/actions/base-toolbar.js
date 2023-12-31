import { RenderType } from '../base/enum';
import { CLS_HR_SEPARATOR } from '../base/classes';
import * as events from '../base/constant';
import { getTooltipText, toObjectLowerCase } from '../base/util';
import { tools, templateItems } from '../models/items';
import { isNullOrUndefined, extend } from '@syncfusion/ej2-base';
/**
 * `Toolbar` module is used to handle Toolbar actions.
 */
var BaseToolbar = /** @class */ (function () {
    function BaseToolbar(parent, serviceLocator) {
        this.tools = {};
        this.parent = parent;
        this.locator = serviceLocator;
        this.renderFactory = this.locator.getService('rendererFactory');
        this.addEventListener();
        if (this.parent.toolbarSettings && Object.keys(this.parent.toolbarSettings.itemConfigs).length > 0) {
            extend(this.tools, tools, toObjectLowerCase(this.parent.toolbarSettings.itemConfigs), true);
        }
        else {
            this.tools = tools;
        }
    }
    BaseToolbar.prototype.addEventListener = function () {
        this.parent.on(events.rtlMode, this.setRtl, this);
        this.parent.on(events.destroy, this.removeEventListener, this);
    };
    BaseToolbar.prototype.removeEventListener = function () {
        this.parent.off(events.rtlMode, this.setRtl);
        this.parent.off(events.destroy, this.removeEventListener);
    };
    BaseToolbar.prototype.setRtl = function (args) {
        if (!isNullOrUndefined(this.toolbarObj)) {
            this.toolbarObj.setProperties({ enableRtl: args.enableRtl });
        }
    };
    BaseToolbar.prototype.getTemplateObject = function (itemStr, container) {
        var tagName;
        switch (itemStr) {
            case 'fontcolor':
            case 'backgroundcolor':
                tagName = 'span';
                break;
            default:
                tagName = 'button';
                break;
        }
        return {
            command: this.tools[itemStr.toLocaleLowerCase()].command,
            subCommand: this.tools[itemStr.toLocaleLowerCase()].subCommand,
            template: this.parent.createElement(tagName, {
                id: this.parent.getID() + '_' + container
                    + '_' + this.tools[itemStr.toLocaleLowerCase()].id
            }).outerHTML,
            tooltipText: getTooltipText(itemStr, this.locator)
        };
    };
    /**
     * getObject method
     * @hidden

     */
    BaseToolbar.prototype.getObject = function (item, container) {
        var itemStr = item.toLowerCase();
        if (templateItems.indexOf(itemStr) !== -1) {
            return this.getTemplateObject(itemStr, container);
        }
        else {
            switch (itemStr) {
                case '|':
                    return { type: 'Separator' };
                case '-':
                    return { type: 'Separator', cssClass: CLS_HR_SEPARATOR };
                default:
                    return {
                        id: this.parent.getID() + '_' + container + '_' + this.tools[itemStr.toLocaleLowerCase()].id,
                        prefixIcon: this.tools[itemStr.toLocaleLowerCase()].icon,
                        tooltipText: getTooltipText(itemStr, this.locator),
                        command: this.tools[itemStr.toLocaleLowerCase()].command,
                        subCommand: this.tools[itemStr.toLocaleLowerCase()].subCommand
                    };
            }
        }
    };
    /**
     * @hidden

     */
    BaseToolbar.prototype.getItems = function (tbItems, container) {
        var _this = this;
        if (this.parent.toolbarSettings.items.length < 1) {
            return [];
        }
        var items = [];
        var _loop_1 = function (item) {
            switch (typeof item) {
                case 'string':
                    items.push(this_1.getObject(item, container));
                    break;
                default:
                    if (!isNullOrUndefined(item.click)) {
                        var proxy_1 = item;
                        var callback_1 = proxy_1.click;
                        proxy_1.click = function () {
                            if (proxy_1.undo && _this.parent.formatter.getUndoRedoStack().length === 0) {
                                _this.parent.formatter.saveData();
                            }
                            callback_1.call(_this);
                            if ((_this.parent.formatter.getUndoRedoStack()[_this.parent.formatter.getUndoRedoStack().length - 1].text.trim()
                                === _this.parent.inputElement.innerHTML.trim())) {
                                return;
                            }
                            if (proxy_1.undo) {
                                _this.parent.formatter.saveData();
                            }
                        };
                    }
                    items.push(item);
            }
        };
        var this_1 = this;
        for (var _i = 0, tbItems_1 = tbItems; _i < tbItems_1.length; _i++) {
            var item = tbItems_1[_i];
            _loop_1(item);
        }
        return items;
    };
    BaseToolbar.prototype.getToolbarOptions = function (args) {
        return {
            target: args.target,
            rteToolbarObj: this,
            items: this.getItems(args.items, args.container),
            overflowMode: args.mode,
            enablePersistence: this.parent.enablePersistence,
            enableRtl: this.parent.enableRtl
        };
    };
    /**
     * render method
     * @hidden

     */
    BaseToolbar.prototype.render = function (args) {
        this.toolbarRenderer = this.renderFactory.getRenderer(RenderType.Toolbar);
        this.toolbarRenderer.renderToolbar(this.getToolbarOptions(args));
    };
    return BaseToolbar;
}());
export { BaseToolbar };

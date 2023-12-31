import { WShading } from '../format/index';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { WList } from '../list/list';
import { WAbstractList } from '../list/abstract-list';
import { WListLevel } from '../list/list-level';
/**
 * Selection character format implementation
 */
var SelectionCharacterFormat = /** @class */ (function () {
    /**
     * @private
     */
    function SelectionCharacterFormat(selection) {
        this.boldIn = undefined;
        this.italicIn = undefined;
        this.underlineIn = undefined;
        this.strikeThroughIn = undefined;
        this.baselineAlignmentIn = undefined;
        this.highlightColorIn = undefined;
        this.fontSizeIn = 0;
        this.fontColorIn = undefined;
        /**
         * @private
         */
        this.boldBidi = undefined;
        /**
         * @private
         */
        this.italicBidi = undefined;
        /**
         * @private
         */
        this.fontSizeBidi = 0;
        /**
         * @private
         */
        this.bidi = undefined;
        /**
         * @private
         */
        this.bdo = undefined;
        this.selection = selection;
    }
    Object.defineProperty(SelectionCharacterFormat.prototype, "fontSize", {
        /**
         * Gets the font size of selected contents.
         * @aspType int
         * @blazorType int
         */
        get: function () {
            return this.fontSizeIn;
        },
        /**
         * Sets the font size of selected contents.
         * @aspType int
         * @blazorType int
         */
        set: function (value) {
            if (value === this.fontSizeIn) {
                return;
            }
            this.fontSizeIn = value;
            this.notifyPropertyChanged('fontSize');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SelectionCharacterFormat.prototype, "fontFamily", {
        /**
         * Gets or sets the font family of selected contents.
         * @aspType string
         * @blazorType string
         */
        get: function () {
            return this.fontFamilyIn;
        },
        /**
         * Sets the font family of selected contents.
         * @aspType string
         * @blazorType string
         */
        set: function (value) {
            if (value === this.fontFamilyIn) {
                return;
            }
            this.fontFamilyIn = value;
            this.notifyPropertyChanged('fontFamily');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SelectionCharacterFormat.prototype, "fontColor", {
        /**
         * Gets or sets the font color of selected contents.
         * @aspType string
         * @blazorType string
         */
        get: function () {
            return this.fontColorIn;
        },
        /**
         * Sets the font color of selected contents.
         * @aspType string
         * @blazorType string
         */
        set: function (value) {
            if (value === this.fontColorIn) {
                return;
            }
            this.fontColorIn = value;
            this.notifyPropertyChanged('fontColor');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SelectionCharacterFormat.prototype, "bold", {
        /**
         * Gets or sets the bold formatting of selected contents.
         * @aspType bool
         * @blazorType bool
         */
        get: function () {
            return this.boldIn;
        },
        /**
         * Sets the bold formatting of selected contents.
         * @aspType bool
         * @blazorType bool
         */
        set: function (value) {
            if (value === this.boldIn) {
                return;
            }
            this.boldIn = value;
            this.notifyPropertyChanged('bold');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SelectionCharacterFormat.prototype, "italic", {
        /**
         * Gets or sets the italic formatting of selected contents.
         * @aspType bool
         * @blazorType bool
         */
        get: function () {
            return this.italicIn;
        },
        /**
         * Sets the italic formatting of selected contents.
         * @aspType bool
         * @blazorType bool
         */
        set: function (value) {
            if (value === this.italic) {
                return;
            }
            this.italicIn = value;
            this.notifyPropertyChanged('italic');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SelectionCharacterFormat.prototype, "strikethrough", {
        /**
         * Gets or sets the strikethrough property of selected contents.
         */
        get: function () {
            return this.strikeThroughIn;
        },
        /**
         * Sets the strikethrough property of selected contents.
         */
        set: function (value) {
            if (value === this.strikeThroughIn) {
                return;
            }
            this.strikeThroughIn = value;
            this.notifyPropertyChanged('strikethrough');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SelectionCharacterFormat.prototype, "baselineAlignment", {
        /**
         * Gets or sets the baseline alignment property of selected contents.
         */
        get: function () {
            return this.baselineAlignmentIn;
        },
        /**
         * Sets the baseline alignment property of selected contents.
         */
        set: function (value) {
            if (value === this.baselineAlignmentIn) {
                return;
            }
            this.baselineAlignmentIn = value;
            this.notifyPropertyChanged('baselineAlignment');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SelectionCharacterFormat.prototype, "underline", {
        /**
         * Gets or sets the underline style of selected contents.
         */
        get: function () {
            return this.underlineIn;
        },
        /**
         * Sets the underline style of selected contents.
         */
        set: function (value) {
            if (value === this.underlineIn) {
                return;
            }
            this.underlineIn = value;
            this.notifyPropertyChanged('underline');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SelectionCharacterFormat.prototype, "highlightColor", {
        /**
         * Gets or sets the highlight color of selected contents.
         */
        get: function () {
            return this.highlightColorIn;
        },
        /**
         * Sets the highlight color of selected contents.
         */
        set: function (value) {
            if (value === this.highlightColorIn) {
                return;
            }
            this.highlightColorIn = value;
            this.notifyPropertyChanged('highlightColor');
        },
        enumerable: true,
        configurable: true
    });
    SelectionCharacterFormat.prototype.getPropertyValue = function (property) {
        switch (property) {
            case 'bold':
                return this.bold;
            case 'italic':
                return this.italic;
            case 'fontSize':
                if (this.fontSize >= 1) {
                    return this.fontSize;
                }
                return undefined;
            case 'fontFamily':
                return this.fontFamily;
            case 'strikethrough':
                return this.strikethrough;
            case 'baselineAlignment':
                return this.baselineAlignment;
            case 'highlightColor':
                return this.highlightColor;
            case 'underline':
                return this.underline;
            case 'fontColor':
                return this.fontColor;
            default:
                return undefined;
        }
    };
    /**
     * Notifies whenever property gets changed.
     * @param  {string} propertyName
     */
    SelectionCharacterFormat.prototype.notifyPropertyChanged = function (propertyName) {
        // tslint:disable-next-line:max-line-length
        if (!isNullOrUndefined(this.selection) && (this.selection.isCleared || (this.selection.owner.isReadOnlyMode && !this.selection.isInlineFormFillMode()) ||
            !this.selection.owner.isDocumentLoaded || this.selection.owner.isPastingContent) && !this.selection.isRetrieveFormatting) {
            return;
        }
        if (!isNullOrUndefined(this.selection) && !isNullOrUndefined(this.selection.start) && !this.selection.isRetrieveFormatting) {
            var propertyValue = this.getPropertyValue(propertyName);
            if (!isNullOrUndefined(propertyValue)) {
                this.selection.owner.editorModule.onApplyCharacterFormat(propertyName, propertyValue);
            }
        }
    };
    /**
     * Copies the source format.
     * @param  {WCharacterFormat} format
     * @returns void
     * @private
     */
    SelectionCharacterFormat.prototype.copyFormat = function (format) {
        this.styleName = !isNullOrUndefined(format.baseCharStyle) ? format.baseCharStyle.name : 'Default Paragraph Font';
        this.fontSize = format.fontSize;
        this.fontFamily = format.fontFamily;
        this.bold = format.bold;
        this.italic = format.italic;
        this.baselineAlignment = format.baselineAlignment;
        this.underline = format.underline;
        this.fontColor = format.fontColor;
        this.highlightColor = format.highlightColor;
        this.strikethrough = format.strikethrough;
        this.bidi = format.bidi;
        this.bdo = format.bdo;
        this.boldBidi = format.boldBidi;
        this.italicBidi = format.italicBidi;
        this.fontFamilyBidi = format.fontFamilyBidi;
        this.fontSizeBidi = format.fontSizeBidi;
    };
    /**
     * Combines the format.
     * @param  {WCharacterFormat} format
     * @private
     */
    SelectionCharacterFormat.prototype.combineFormat = function (format) {
        if (!isNullOrUndefined(this.bold) && this.bold !== format.bold) {
            this.bold = undefined;
        }
        if (!isNullOrUndefined(this.italic) && this.italic !== format.italic) {
            this.italic = undefined;
        }
        if (this.fontSize !== 0 && this.fontSize !== format.fontSize) {
            this.fontSize = 0;
        }
        if (!isNullOrUndefined(this.fontFamily) && this.fontFamily !== format.fontFamily) {
            this.fontFamily = undefined;
        }
        if (!isNullOrUndefined(this.highlightColor) && this.highlightColor !== format.highlightColor) {
            this.highlightColor = undefined;
        }
        if (!isNullOrUndefined(this.baselineAlignment) && this.baselineAlignment !== format.baselineAlignment) {
            this.baselineAlignment = undefined;
        }
        if (!isNullOrUndefined(this.fontColor) && (this.fontColor !== format.fontColor)) {
            this.fontColor = undefined;
        }
        if (!isNullOrUndefined(this.underline) && this.underline !== format.underline) {
            this.underline = undefined;
        }
        if (!isNullOrUndefined(this.strikethrough) && this.strikethrough !== format.strikethrough) {
            this.strikethrough = undefined;
        }
        if (!isNullOrUndefined(this.boldBidi) && this.boldBidi !== format.boldBidi) {
            this.boldBidi = undefined;
        }
        if (!isNullOrUndefined(this.italicBidi) && this.italicBidi !== format.italicBidi) {
            this.italicBidi = undefined;
        }
        if (this.fontSizeBidi !== 0 && this.fontSizeBidi !== format.fontSizeBidi) {
            this.fontSizeBidi = 0;
        }
        if (!isNullOrUndefined(this.fontFamilyBidi) && this.fontFamilyBidi !== format.fontFamilyBidi) {
            this.fontFamilyBidi = undefined;
        }
        if (!isNullOrUndefined(this.bidi) && this.bidi !== format.bidi) {
            this.bidi = undefined;
        }
        if (!isNullOrUndefined(this.bdo) && this.bdo !== format.bdo) {
            this.bdo = undefined;
        }
    };
    /**
     * Clones the format.
     * @param  {SelectionCharacterFormat} selectionCharacterFormat
     * @returns void
     * @private
     */
    SelectionCharacterFormat.prototype.cloneFormat = function (selectionCharacterFormat) {
        this.bold = selectionCharacterFormat.bold;
        this.italic = selectionCharacterFormat.italic;
        this.underline = selectionCharacterFormat.underline;
        this.strikethrough = selectionCharacterFormat.strikethrough;
        this.baselineAlignment = selectionCharacterFormat.baselineAlignment;
        this.highlightColor = selectionCharacterFormat.highlightColor;
        this.fontSize = selectionCharacterFormat.fontSize;
        this.fontFamily = selectionCharacterFormat.fontFamily;
        this.fontColor = selectionCharacterFormat.fontColor;
        this.styleName = selectionCharacterFormat.styleName;
        this.bidi = selectionCharacterFormat.bidi;
        this.bdo = selectionCharacterFormat.bdo;
        this.boldBidi = selectionCharacterFormat.boldBidi;
        this.italicBidi = selectionCharacterFormat.italicBidi;
        this.fontSizeBidi = selectionCharacterFormat.fontSizeBidi;
        this.fontFamilyBidi = selectionCharacterFormat.fontFamilyBidi;
    };
    /**
     * Checks whether current format is equal to the source format or not.
     * @param  {SelectionCharacterFormat} format
     * @returns boolean
     * @private
     */
    SelectionCharacterFormat.prototype.isEqualFormat = function (format) {
        return (this.fontSize === format.fontSize
            && this.strikethrough === format.strikethrough
            && this.bold === format.bold
            && this.fontFamily === format.fontFamily
            && this.underline === format.underline
            && this.highlightColor === format.highlightColor
            && this.italic === format.italic
            && this.baselineAlignment === format.baselineAlignment
            && this.fontColor === format.fontColor);
    };
    /**
     * Clears the format.
     * @returns void
     * @private
     */
    SelectionCharacterFormat.prototype.clearFormat = function () {
        this.fontSizeIn = 0;
        this.boldIn = undefined;
        this.italicIn = undefined;
        this.fontFamilyIn = undefined;
        this.fontColorIn = undefined;
        this.underlineIn = undefined;
        this.strikeThroughIn = undefined;
        this.highlightColorIn = undefined;
        this.baselineAlignmentIn = undefined;
        this.styleName = undefined;
        this.bidi = undefined;
        this.bdo = undefined;
        this.boldBidi = undefined;
        this.italicBidi = undefined;
        this.fontFamilyBidi = undefined;
        this.fontSizeBidi = undefined;
    };
    /**
     * Destroys the maintained resources.
     * @returns void
     * @private
     */
    SelectionCharacterFormat.prototype.destroy = function () {
        this.fontSizeIn = undefined;
        this.boldIn = undefined;
        this.italicIn = undefined;
        this.fontFamilyIn = undefined;
        this.fontColorIn = undefined;
        this.underlineIn = undefined;
        this.strikeThroughIn = undefined;
        this.baselineAlignmentIn = undefined;
        this.highlightColorIn = undefined;
        this.selection = undefined;
        this.styleName = undefined;
        this.bidi = undefined;
        this.bdo = undefined;
        this.boldBidi = undefined;
        this.italicBidi = undefined;
        this.fontFamilyBidi = undefined;
        this.fontSizeBidi = undefined;
    };
    return SelectionCharacterFormat;
}());
export { SelectionCharacterFormat };
/**
 * Selection paragraph format implementation
 */
var SelectionParagraphFormat = /** @class */ (function () {
    /**
     * @private
     */
    function SelectionParagraphFormat(selection, documentHelper) {
        // Declaring the character format properties.
        this.leftIndentIn = 0;
        this.rightIndentIn = 0;
        this.beforeSpacingIn = 0;
        this.afterSpacingIn = 0;
        this.textAlignmentIn = undefined;
        this.firstLineIndentIn = 0;
        this.lineSpacingIn = 1;
        this.lineSpacingTypeIn = undefined;
        this.bidiIn = undefined;
        this.contextualSpacingIn = undefined;
        this.listLevelNumberIn = -1;
        this.selection = selection;
        this.documentHelper = documentHelper;
    }
    Object.defineProperty(SelectionParagraphFormat.prototype, "leftIndent", {
        /**
         * Gets or Sets the left indent for selected paragraphs.
         * @default undefined
         * @aspType int
         * @blazorType int
         */
        get: function () {
            return this.leftIndentIn;
        },
        /**
         * Sets the left indent for selected paragraphs.
         * @default undefined
         * @aspType int
         * @blazorType int
         */
        set: function (value) {
            if (value === this.leftIndentIn) {
                return;
            }
            this.leftIndentIn = value;
            this.notifyPropertyChanged('leftIndent');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SelectionParagraphFormat.prototype, "rightIndent", {
        /**
         * Gets or Sets the right indent for selected paragraphs.
         * @default undefined
         * @aspType int
         * @blazorType int
         */
        get: function () {
            return this.rightIndentIn;
        },
        /**
         * Sets the right indent for selected paragraphs.
         * @default undefined
         * @aspType int
         * @blazorType int
         */
        set: function (value) {
            if (value === this.rightIndentIn) {
                return;
            }
            this.rightIndentIn = value;
            this.notifyPropertyChanged('rightIndent');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SelectionParagraphFormat.prototype, "firstLineIndent", {
        /**
         * Gets or Sets the first line indent for selected paragraphs.
         * @default undefined
         * @aspType int
         * @blazorType int
         */
        get: function () {
            return this.firstLineIndentIn;
        },
        /**
         * Sets the first line indent for selected paragraphs.
         * @default undefined
         * @aspType int
         * @blazorType int
         */
        set: function (value) {
            if (value === this.firstLineIndentIn) {
                return;
            }
            this.firstLineIndentIn = value;
            this.notifyPropertyChanged('firstLineIndent');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SelectionParagraphFormat.prototype, "textAlignment", {
        /**
         * Gets or Sets the text alignment for selected paragraphs.
         * @default undefined
         */
        get: function () {
            return this.textAlignmentIn;
        },
        /**
         * Sets the text alignment for selected paragraphs.
         * @default undefined
         */
        set: function (value) {
            if (value === this.textAlignmentIn) {
                return;
            }
            this.textAlignmentIn = value;
            this.notifyPropertyChanged('textAlignment');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SelectionParagraphFormat.prototype, "afterSpacing", {
        /**
         * Sets the after spacing for selected paragraphs.
         * @default undefined
         * @aspType int
         * @blazorType int
         */
        get: function () {
            return this.afterSpacingIn;
        },
        /**
         * Gets or Sets the after spacing for selected paragraphs.
         * @default undefined
         * @aspType int
         * @blazorType int
         */
        set: function (value) {
            if (value === this.afterSpacingIn) {
                return;
            }
            this.afterSpacingIn = value;
            this.notifyPropertyChanged('afterSpacing');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SelectionParagraphFormat.prototype, "beforeSpacing", {
        /**
         * Gets or Sets the before spacing for selected paragraphs.
         * @default undefined
         * @aspType int
         * @blazorType int
         */
        get: function () {
            return this.beforeSpacingIn;
        },
        /**
         * Sets the before spacing for selected paragraphs.
         * @default undefined
         * @aspType int
         * @blazorType int
         */
        set: function (value) {
            if (value === this.beforeSpacingIn) {
                return;
            }
            this.beforeSpacingIn = value;
            this.notifyPropertyChanged('beforeSpacing');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SelectionParagraphFormat.prototype, "lineSpacing", {
        /**
         * Gets or Sets the line spacing for selected paragraphs.
         * @default undefined
         * @aspType int
         * @blazorType int
         */
        get: function () {
            return this.lineSpacingIn;
        },
        /**
         * Sets the line spacing for selected paragraphs.
         * @default undefined
         * @aspType int
         * @blazorType int
         */
        set: function (value) {
            if (value === this.lineSpacingIn) {
                return;
            }
            this.lineSpacingIn = value;
            this.notifyPropertyChanged('lineSpacing');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SelectionParagraphFormat.prototype, "lineSpacingType", {
        /**
         * Gets or Sets the line spacing type for selected paragraphs.
         * @default undefined
         */
        get: function () {
            return this.lineSpacingTypeIn;
        },
        /**
         * Gets or Sets the line spacing type for selected paragraphs.
         * @default undefined
         */
        set: function (value) {
            if (value === this.lineSpacingTypeIn) {
                return;
            }
            this.lineSpacingTypeIn = value;
            this.notifyPropertyChanged('lineSpacingType');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SelectionParagraphFormat.prototype, "listLevelNumber", {
        /**
         * Sets the list level number for selected paragraphs.
         * @default undefined
         * @aspType int
         * @blazorType int
         */
        get: function () {
            return this.listLevelNumberIn;
        },
        /**
         * Gets or Sets the list level number for selected paragraphs.
         * @default undefined
         * @aspType int
         * @blazorType int
         */
        set: function (value) {
            if (value === this.listLevelNumberIn) {
                return;
            }
            this.listLevelNumberIn = value;
            this.notifyPropertyChanged('listLevelNumber');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SelectionParagraphFormat.prototype, "bidi", {
        /**
         * Gets or Sets the bidirectional property for selected paragraphs
         * @aspType bool
         * @blazorType bool
         */
        get: function () {
            return this.bidiIn;
        },
        /**
         * Sets the bidirectional property for selected paragraphs
         * @aspType bool
         * @blazorType bool
         */
        set: function (value) {
            this.bidiIn = value;
            this.notifyPropertyChanged('bidi');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SelectionParagraphFormat.prototype, "contextualSpacing", {
        /**
         * Gets or sets a value indicating whether to add space between the paragraphs of same style.
         * @aspType bool
         * @blazorType bool
         */
        get: function () {
            return this.contextualSpacingIn;
        },
        /**
         * Sets a value indicating whether to add space between the paragraphs of same style.
         * @aspType bool
         * @blazorType bool
         */
        set: function (value) {
            this.contextualSpacingIn = value;
            this.notifyPropertyChanged('contextualSpacing');
        },
        enumerable: true,
        configurable: true
    });
    SelectionParagraphFormat.prototype.validateLineSpacing = function () {
        if (this.lineSpacingType !== 'Multiple' && this.lineSpacingIn < 12) {
            return true;
        }
        return false;
    };
    Object.defineProperty(SelectionParagraphFormat.prototype, "listText", {
        /**
         * Gets the list text for selected paragraphs.
         * @aspType string
         * @blazorType string
         */
        get: function () {
            var listFormat = undefined;
            var list = this.documentHelper.getListById(this.listId);
            if (list instanceof WList && this.listLevelNumberIn > -1 && this.listLevelNumberIn < 9) {
                var listLevel = list.getListLevel(this.listLevelNumber);
                if (listLevel instanceof WListLevel) {
                    if (listLevel.listLevelPattern === 'Bullet') {
                        listFormat = listLevel.numberFormat;
                    }
                    else {
                        listFormat = listLevel.numberFormat;
                        for (var i = 0; i < 9; i++) {
                            var levelPattern = '%' + (i + 1);
                            if (listFormat.indexOf(levelPattern) > -1) {
                                var level = i === this.listLevelNumberIn ? listLevel : list.getListLevel(i);
                                var listTextElement = this.selection.getListTextElementBox(this.selection.start.paragraph);
                                var listText = listTextElement ? listTextElement.text : '';
                                listFormat = listText;
                            }
                        }
                    }
                }
            }
            return listFormat;
        },
        enumerable: true,
        configurable: true
    });
    SelectionParagraphFormat.prototype.getPropertyValue = function (property) {
        switch (property) {
            case 'leftIndent':
                return this.leftIndent;
            case 'rightIndent':
                return this.rightIndent;
            case 'firstLineIndent':
                return this.firstLineIndent;
            case 'beforeSpacing':
                return this.beforeSpacing;
            case 'afterSpacing':
                return this.afterSpacing;
            case 'textAlignment':
                return this.textAlignment;
            case 'lineSpacing':
                return this.lineSpacing;
            case 'lineSpacingType':
                return this.lineSpacingType;
            case 'bidi':
                return this.bidi;
            case 'contextualSpacing':
                return this.contextualSpacing;
            default:
                return undefined;
        }
    };
    /**
     * Notifies whenever the property gets changed.
     * @param  {string} propertyName
     */
    SelectionParagraphFormat.prototype.notifyPropertyChanged = function (propertyName) {
        if (!isNullOrUndefined(this.selection) &&
            ((this.selection.owner.isReadOnlyMode && !this.selection.isInlineFormFillMode()) || !this.selection.owner.isDocumentLoaded)
            && !this.selection.isRetrieveFormatting) {
            return;
        }
        if (!isNullOrUndefined(this.selection) && !isNullOrUndefined(this.selection.start) && !this.selection.isRetrieveFormatting) {
            var editorModule = this.selection.owner.editorModule;
            if (propertyName === 'lineSpacing' || propertyName === 'lineSpacingType') {
                var editorHistory = this.selection.owner.editorHistory;
                if (!(editorHistory && (editorHistory.isUndoing || editorHistory.isRedoing)) && this.validateLineSpacing()) {
                    this.selection.owner.editorHistory.initComplexHistory(this.selection, 'LineSpacing');
                    if (propertyName === 'lineSpacing') {
                        this.lineSpacingTypeIn = 'Multiple';
                        var value_1 = this.getPropertyValue('lineSpacingType');
                        editorModule.onApplyParagraphFormat('lineSpacingType', value_1, false, false);
                        editorModule.onApplyParagraphFormat(propertyName, this.getPropertyValue(propertyName), false, false);
                    }
                    else {
                        editorModule.onApplyParagraphFormat(propertyName, this.getPropertyValue(propertyName), false, false);
                        this.lineSpacingIn = 12;
                        editorModule.onApplyParagraphFormat('lineSpacing', this.getPropertyValue('lineSpacing'), false, false);
                    }
                    this.selection.owner.editorHistory.updateComplexHistory();
                    return;
                }
            }
            var value = this.getPropertyValue(propertyName);
            if ((propertyName === 'leftIndent' || propertyName === 'rightIndent' || propertyName === 'firstLineIndent')
                && !(value >= -1056 && value < 1056)) {
                return;
            }
            if (propertyName === 'listLevelNumber') {
                editorModule.onApplyListInternal(this.documentHelper.getListById(this.listId), this.listLevelNumber);
            }
            else {
                editorModule.onApplyParagraphFormat(propertyName, value, propertyName === 'textAlignment' ? true : false, false);
            }
        }
    };
    /**
     * Copies the format.
     * @param  {WParagraphFormat} format
     * @returns void
     * @private
     */
    SelectionParagraphFormat.prototype.copyFormat = function (format) {
        this.styleName = !isNullOrUndefined(format.baseStyle) ? format.baseStyle.name : 'Normal';
        this.leftIndent = format.leftIndent;
        this.rightIndent = format.rightIndent;
        this.firstLineIndent = format.firstLineIndent;
        this.afterSpacing = format.afterSpacing;
        this.beforeSpacing = format.beforeSpacing;
        this.lineSpacing = format.lineSpacing;
        this.lineSpacingType = format.lineSpacingType;
        this.textAlignment = format.textAlignment;
        this.bidi = format.bidi;
        this.contextualSpacing = format.contextualSpacing;
        if (!isNullOrUndefined(format.listFormat) && !isNullOrUndefined(format.listFormat.listId)) {
            this.listId = format.listFormat.listId;
            this.listLevelNumber = format.listFormat.listLevelNumber;
        }
        else {
            this.listId = undefined;
            this.listLevelNumber = 0;
        }
    };
    /**
     * Copies to format.
     * @param  {WParagraphFormat} format
     * @private
     */
    SelectionParagraphFormat.prototype.copyToFormat = function (format) {
        if (isNullOrUndefined(format)) {
            return;
        }
        if (!isNullOrUndefined(this.afterSpacing)) {
            format.afterSpacing = this.afterSpacing;
        }
        if (!isNullOrUndefined(this.beforeSpacing)) {
            format.beforeSpacing = this.beforeSpacing;
        }
        if (!isNullOrUndefined(this.leftIndent)) {
            format.leftIndent = this.leftIndent;
        }
        if (!isNullOrUndefined(this.rightIndent)) {
            format.rightIndent = this.rightIndent;
        }
        if (!isNullOrUndefined(this.textAlignment)) {
            format.textAlignment = this.textAlignment;
        }
        if (!isNullOrUndefined(this.lineSpacing)) {
            format.lineSpacing = this.lineSpacing;
        }
        if (!isNullOrUndefined(this.lineSpacingType)) {
            format.lineSpacingType = this.lineSpacingType;
        }
        if (!isNullOrUndefined(this.firstLineIndent)) {
            format.firstLineIndent = this.firstLineIndent;
        }
        if (!isNullOrUndefined(this.bidi)) {
            format.bidi = this.bidi;
        }
        if (!isNullOrUndefined(this.contextualSpacing)) {
            format.contextualSpacing = this.contextualSpacing;
        }
    };
    /**
     * Combines the format.
     * @param  {WParagraphFormat} format
     * @private
     */
    SelectionParagraphFormat.prototype.combineFormat = function (format) {
        if (!isNullOrUndefined(this.leftIndent) && this.leftIndent !== format.leftIndent) {
            this.leftIndent = undefined;
        }
        if (!isNullOrUndefined(this.rightIndent) && this.rightIndent !== format.rightIndent) {
            this.rightIndent = undefined;
        }
        if (!isNullOrUndefined(this.firstLineIndent) && this.firstLineIndent !== format.firstLineIndent) {
            this.firstLineIndent = undefined;
        }
        if (this.lineSpacing !== 0 && this.lineSpacing !== format.lineSpacing) {
            this.lineSpacing = 0;
        }
        if (this.beforeSpacing !== -1 && this.beforeSpacing !== format.beforeSpacing) {
            this.beforeSpacing = -1;
        }
        if (this.afterSpacing !== -1 && this.afterSpacing !== format.afterSpacing) {
            this.afterSpacing = -1;
        }
        if (!isNullOrUndefined(this.lineSpacingType) && this.lineSpacingType !== format.lineSpacingType) {
            this.lineSpacingType = undefined;
        }
        if (!isNullOrUndefined(this.textAlignment) && this.textAlignment !== format.textAlignment) {
            this.textAlignment = undefined;
        }
        // tslint:disable-next-line:max-line-length
        if (this.listLevelNumber >= 0 && !isNullOrUndefined(this.listId) && (isNullOrUndefined(format.listFormat) || format.listFormat.listLevelNumber !== this.listLevelNumber)) {
            this.listLevelNumber = -1;
        }
        // tslint:disable-next-line:max-line-length
        if (isNullOrUndefined(format.listFormat) || isNullOrUndefined(format.listFormat.listId) || (!isNullOrUndefined(this.listId) && this.listId !== format.listFormat.listId)) {
            this.listId = undefined;
        }
        if (!isNullOrUndefined(this.bidi) && this.bidi !== format.bidi) {
            this.bidi = undefined;
        }
        if (!isNullOrUndefined(this.contextualSpacing) && this.contextualSpacing !== format.contextualSpacing) {
            this.contextualSpacing = undefined;
        }
        if (!isNullOrUndefined(this.styleName) && format.baseStyle && this.styleName !== format.baseStyle.name) {
            this.styleName = undefined;
        }
    };
    /**
     * Clears the format.
     * @returns void
     * @private
     */
    SelectionParagraphFormat.prototype.clearFormat = function () {
        this.leftIndent = 0;
        this.rightIndent = 0;
        this.beforeSpacing = 0;
        this.afterSpacing = 0;
        this.firstLineIndent = 0;
        this.lineSpacing = 1;
        this.textAlignment = undefined;
        this.lineSpacingType = undefined;
        this.listId = undefined;
        this.listLevelNumber = -1;
        this.styleName = undefined;
        this.bidi = undefined;
        this.contextualSpacing = undefined;
    };
    /**
     * Gets the clone of list at current selection.
     * @returns WList
     * @private
     */
    SelectionParagraphFormat.prototype.getList = function () {
        var list = this.documentHelper.getListById(this.listId);
        if (!isNullOrUndefined(list)) {
            var listAdv = new WList();
            var abstractList = new WAbstractList();
            var currentAbstractList = this.documentHelper.getAbstractListById(list.abstractListId);
            var editor = this.selection.owner.editorModule;
            if (!isNullOrUndefined(currentAbstractList)) {
                for (var i = 0; i < currentAbstractList.levels.length; i++) {
                    var level = editor.cloneListLevel(currentAbstractList.levels[i]);
                    abstractList.levels.push(level);
                    level.ownerBase = abstractList;
                }
            }
            else {
                abstractList.levels.push(new WListLevel(abstractList));
            }
            if (!isNullOrUndefined(list.levelOverrides)) {
                for (var i = 0; i < list.levelOverrides.length; i++) {
                    var levelOverride = editor.cloneLevelOverride(list.levelOverrides[i]);
                    listAdv.levelOverrides.push(levelOverride);
                }
            }
            listAdv.abstractList = abstractList;
            listAdv.abstractListId = abstractList.abstractListId;
            listAdv.sourceListId = list.listId;
            return listAdv;
        }
        return undefined;
    };
    /**
     * Modifies the list at current selection.
     * @param  {WList} listAdv
     * @private
     */
    SelectionParagraphFormat.prototype.setList = function (listAdv) {
        // tslint:disable-next-line:max-line-length
        if ((this.documentHelper.owner.isReadOnlyMode && !this.selection.isInlineFormFillMode()) || !this.documentHelper.owner.isDocumentLoaded) {
            return;
        }
        var list = this.documentHelper.getListById(this.listId);
        var collection = undefined;
        var currentAbstractList = listAdv ? this.documentHelper.getAbstractListById(listAdv.abstractListId) : undefined;
        if (!isNullOrUndefined(list) && !isNullOrUndefined(listAdv)
            && !isNullOrUndefined(currentAbstractList) && listAdv.sourceListId === list.listId) {
            var history_1 = this.documentHelper.owner.editorHistory;
            var listLevel = this.documentHelper.layout.getListLevel(list, 1);
            this.selection.owner.isLayoutEnabled = false;
            this.documentHelper.owner.editorModule.setOffsetValue(this.selection);
            if (history_1) {
                collection = history_1.updateListChangesInHistory(currentAbstractList, list);
            }
            this.documentHelper.owner.editorModule.updateListParagraphs();
            if (history_1) {
                history_1.applyListChanges(this.selection, collection);
            }
            this.selection.owner.isLayoutEnabled = true;
            this.documentHelper.renderedLists.clear();
            this.documentHelper.renderedLevelOverrides = [];
            // this.viewer.pages = [];
            this.documentHelper.owner.editorModule.layoutWholeDocument();
            this.documentHelper.owner.editorModule.updateSelectionTextPosition(false);
            if (history_1 && history_1.currentBaseHistoryInfo) {
                if (history_1.currentBaseHistoryInfo.modifiedProperties.length > 0) {
                    history_1.currentBaseHistoryInfo.updateSelection();
                }
                history_1.updateHistory();
            }
            this.documentHelper.owner.editorModule.fireContentChange();
        }
        else if (!isNullOrUndefined(listAdv)) {
            this.selection.owner.isLayoutEnabled = false;
            if (!isNullOrUndefined(currentAbstractList) && this.documentHelper.abstractLists.indexOf(currentAbstractList) === -1) {
                this.documentHelper.abstractLists.push(currentAbstractList);
            }
            if (this.documentHelper.lists.indexOf(listAdv) === -1) {
                this.documentHelper.lists.push(listAdv);
            }
            //currentAbstractList.listType = 'Numbering';
            this.selection.owner.isLayoutEnabled = true;
            this.selection.owner.editorModule.onApplyList(listAdv);
        }
        else {
            this.selection.owner.editorModule.onApplyList(undefined);
        }
    };
    /**
     * Destroys the managed resources.
     * @returns void
     * @private
     */
    SelectionParagraphFormat.prototype.destroy = function () {
        this.leftIndentIn = undefined;
        this.rightIndentIn = undefined;
        this.beforeSpacingIn = undefined;
        this.afterSpacingIn = undefined;
        this.firstLineIndentIn = undefined;
        this.lineSpacingIn = undefined;
        this.textAlignmentIn = undefined;
        this.lineSpacingTypeIn = undefined;
        this.listId = undefined;
        this.listLevelNumberIn = undefined;
        this.documentHelper = undefined;
        this.selection = undefined;
        this.styleName = undefined;
        this.bidi = undefined;
        this.contextualSpacing = undefined;
    };
    return SelectionParagraphFormat;
}());
export { SelectionParagraphFormat };
/**
 * Selection section format implementation
 */
var SelectionSectionFormat = /** @class */ (function () {
    /**
     * @private
     */
    function SelectionSectionFormat(selection) {
        this.differentFirstPageIn = undefined;
        this.differentOddAndEvenPagesIn = undefined;
        /**
         * private
         */
        this.bidi = undefined;
        this.selection = selection;
    }
    Object.defineProperty(SelectionSectionFormat.prototype, "pageHeight", {
        /**
         * Gets or sets the page height.
         * @aspType int
         * @blazorType int
         */
        get: function () {
            return this.pageHeightIn;
        },
        /**
         * Gets or sets the page height.
         * @aspType int
         * @blazorType int
         */
        set: function (value) {
            this.pageHeightIn = value;
            this.notifyPropertyChanged('pageHeight');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SelectionSectionFormat.prototype, "pageWidth", {
        /**
         * Gets or sets the page width.
         * @aspType int
         * @blazorType int
         */
        get: function () {
            return this.pageWidthIn;
        },
        /**
         * Gets or sets the page width.
         * @aspType int
         * @blazorType int
         */
        set: function (value) {
            this.pageWidthIn = value;
            this.notifyPropertyChanged('pageWidth');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SelectionSectionFormat.prototype, "leftMargin", {
        /**
         * Gets or sets the page left margin.
         * @aspType int
         * @blazorType int
         */
        get: function () {
            return this.leftMarginIn;
        },
        /**
         * Gets or sets the page left margin.
         * @aspType int
         * @blazorType int
         */
        set: function (value) {
            this.leftMarginIn = value;
            this.notifyPropertyChanged('leftMargin');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SelectionSectionFormat.prototype, "bottomMargin", {
        /**
         * Gets or sets the page bottom margin.
         * @aspType int
         * @blazorType int
         */
        get: function () {
            return this.bottomMarginIn;
        },
        /**
         * Gets or sets the page bottom margin.
         * @aspType int
         * @blazorType int
         */
        set: function (value) {
            this.bottomMarginIn = value;
            this.notifyPropertyChanged('bottomMargin');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SelectionSectionFormat.prototype, "topMargin", {
        /**
         * Gets or sets the page top margin.
         * @aspType int
         * @blazorType int
         */
        get: function () {
            return this.topMarginIn;
        },
        /**
         * Gets or sets the page top margin.
         * @aspType int
         * @blazorType int
         */
        set: function (value) {
            this.topMarginIn = value;
            this.notifyPropertyChanged('topMargin');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SelectionSectionFormat.prototype, "rightMargin", {
        /**
         * Gets or sets the page right margin.
         * @aspType int
         * @blazorType int
         */
        get: function () {
            return this.rightMarginIn;
        },
        /**
         * Gets or sets the page right margin.
         * @aspType int
         * @blazorType int
         */
        set: function (value) {
            this.rightMarginIn = value;
            this.notifyPropertyChanged('rightMargin');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SelectionSectionFormat.prototype, "headerDistance", {
        /**
         * Gets or sets the header distance.
         * @aspType int
         * @blazorType int
         */
        get: function () {
            return this.headerDistanceIn;
        },
        /**
         * Gets or sets the header distance.
         * @aspType int
         * @blazorType int
         */
        set: function (value) {
            this.headerDistanceIn = value;
            this.notifyPropertyChanged('headerDistance');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SelectionSectionFormat.prototype, "footerDistance", {
        /**
         * Gets or sets the footer distance.
         * @aspType int
         * @blazorType int
         */
        get: function () {
            return this.footerDistanceIn;
        },
        /**
         * Gets or sets the footer distance.
         * @aspType int
         * @blazorType int
         */
        set: function (value) {
            this.footerDistanceIn = value;
            this.notifyPropertyChanged('footerDistance');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SelectionSectionFormat.prototype, "differentFirstPage", {
        /**
         * Gets or sets a value indicating whether the section has different first page.
         * @aspType bool
         * @blazorType bool
         */
        get: function () {
            return this.differentFirstPageIn;
        },
        /**
         * Gets or sets a value indicating whether the section has different first page.
         * @aspType bool
         * @blazorType bool
         */
        set: function (value) {
            this.differentFirstPageIn = value;
            this.notifyPropertyChanged('differentFirstPage');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SelectionSectionFormat.prototype, "differentOddAndEvenPages", {
        /**
         * Gets or sets a value indicating whether the section has different odd and even page.
         * @aspType bool
         * @blazorType bool
         */
        get: function () {
            return this.differentOddAndEvenPagesIn;
        },
        /**
         * Gets or sets a value indicating whether the section has different odd and even page.
         * @aspType bool
         * @blazorType bool
         */
        set: function (value) {
            this.differentOddAndEvenPagesIn = value;
            this.notifyPropertyChanged('differentOddAndEvenPages');
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Copies the format.
     * @param  {WSectionFormat} format
     * @returns void
     * @private
     */
    SelectionSectionFormat.prototype.copyFormat = function (format) {
        this.pageHeight = format.pageHeight;
        this.pageWidth = format.pageWidth;
        this.leftMargin = format.leftMargin;
        this.topMargin = format.topMargin;
        this.rightMargin = format.rightMargin;
        this.bottomMargin = format.bottomMargin;
        this.headerDistance = format.headerDistance;
        this.footerDistance = format.footerDistance;
        this.differentFirstPage = format.differentFirstPage;
        this.differentOddAndEvenPages = format.differentOddAndEvenPages;
        this.bidi = format.bidi;
    };
    SelectionSectionFormat.prototype.notifyPropertyChanged = function (propertyName) {
        var selection = this.selection;
        if (!isNullOrUndefined(selection) && (selection.isCleared || selection.owner.isPastingContent
            || selection.owner.isReadOnlyMode || !selection.owner.isDocumentLoaded)
            && !selection.isRetrieveFormatting) {
            return;
        }
        if (!isNullOrUndefined(selection) && !isNullOrUndefined(selection.start) && !selection.isRetrieveFormatting) {
            var value = this.getPropertyvalue(propertyName);
            if (!isNullOrUndefined(value)) {
                selection.owner.editorModule.onApplySectionFormat(propertyName, value);
            }
        }
    };
    SelectionSectionFormat.prototype.getPropertyvalue = function (propertyName) {
        switch (propertyName) {
            case 'pageHeight':
                if (this.pageHeight > 0) {
                    return this.pageHeight;
                }
                return undefined;
            case 'pageWidth':
                if (this.pageWidth > 0) {
                    return this.pageWidth;
                }
                return undefined;
            case 'leftMargin':
                if (this.leftMargin >= 0) {
                    return this.leftMargin;
                }
                return undefined;
            case 'rightMargin':
                if (this.rightMargin >= 0) {
                    return this.rightMargin;
                }
                return undefined;
            case 'topMargin':
                if (this.topMargin >= 0) {
                    return this.topMargin;
                }
                return undefined;
            case 'bottomMargin':
                if (this.bottomMargin >= 0) {
                    return this.bottomMargin;
                }
                return undefined;
            case 'differentFirstPage':
                if (!isNullOrUndefined(this.differentFirstPage)) {
                    return this.differentFirstPage;
                }
                return undefined;
            case 'differentOddAndEvenPages':
                if (!isNullOrUndefined(this.differentOddAndEvenPages)) {
                    return this.differentOddAndEvenPages;
                }
                return undefined;
            case 'headerDistance':
                return this.headerDistanceIn;
            case 'footerDistance':
                return this.footerDistance;
            default:
                return undefined;
        }
    };
    /**
     * Combines the format.
     * @param  {WSectionFormat} format
     * @private
     */
    SelectionSectionFormat.prototype.combineFormat = function (format) {
        if (this.pageHeight > 0 && this.pageHeight !== format.pageHeight) {
            this.pageHeight = 0;
        }
        if (this.pageWidth > 0 && this.pageWidth !== format.pageWidth) {
            this.pageWidth = 0;
        }
        if (this.leftMargin > -1 && this.leftMargin !== format.leftMargin) {
            this.leftMargin = -1;
        }
        if (this.topMargin > -1 && this.topMargin !== format.topMargin) {
            this.topMargin = -1;
        }
        if (this.rightMargin > -1 && this.rightMargin !== format.rightMargin) {
            this.rightMargin = -1;
        }
        if (this.bottomMargin > -1 && this.bottomMargin !== format.bottomMargin) {
            this.bottomMargin = -1;
        }
        if (this.headerDistance !== 0 && this.headerDistance !== format.headerDistance) {
            this.headerDistance = 0;
        }
        if (this.footerDistance !== 0 && this.footerDistance !== format.footerDistance) {
            this.footerDistance = 0;
        }
        if (!isNullOrUndefined(this.differentFirstPage) && this.differentFirstPage !== format.differentFirstPage) {
            this.differentFirstPage = undefined;
        }
        if (!isNullOrUndefined(this.differentOddAndEvenPages) && this.differentOddAndEvenPages !== format.differentOddAndEvenPages) {
            this.differentOddAndEvenPages = undefined;
        }
        if (!isNullOrUndefined(this.bidi) && this.bidi !== format.bidi) {
            this.bidi = undefined;
        }
    };
    /**
     * Clears the format.
     * @returns void
     * @private
     */
    SelectionSectionFormat.prototype.clearFormat = function () {
        this.headerDistance = 0;
        this.footerDistance = 0;
        this.pageHeight = 0;
        this.pageWidth = 0;
        this.leftMargin = -1;
        this.rightMargin = -1;
        this.topMargin = -1;
        this.bottomMargin = -1;
        this.differentFirstPage = undefined;
        this.differentOddAndEvenPages = undefined;
        this.bidi = undefined;
    };
    /**
     * Destroys the managed resources.
     * @returns void
     * @private
     */
    SelectionSectionFormat.prototype.destroy = function () {
        this.headerDistanceIn = undefined;
        this.footerDistanceIn = undefined;
        this.pageHeightIn = undefined;
        this.pageWidthIn = undefined;
        this.leftMarginIn = undefined;
        this.rightMarginIn = undefined;
        this.topMarginIn = undefined;
        this.bottomMarginIn = undefined;
        this.differentFirstPageIn = undefined;
        this.differentOddAndEvenPagesIn = undefined;
        this.selection = undefined;
        this.bidi = undefined;
    };
    return SelectionSectionFormat;
}());
export { SelectionSectionFormat };
/**
 * Selection table format implementation
 */
var SelectionTableFormat = /** @class */ (function () {
    /**
     * @private
     */
    function SelectionTableFormat(selection) {
        this.leftIndentIn = 0;
        this.backgroundIn = undefined;
        this.tableAlignmentIn = undefined;
        this.cellSpacingIn = 0;
        this.leftMarginIn = 0;
        this.rightMarginIn = 0;
        this.topMarginIn = 0;
        this.bottomMarginIn = 0;
        this.preferredWidthIn = 0;
        this.bidiIn = undefined;
        this.selection = selection;
    }
    Object.defineProperty(SelectionTableFormat.prototype, "table", {
        /**
         * Gets or sets the table.
         * @private
         */
        get: function () {
            return this.tableIn;
        },
        set: function (value) {
            this.tableIn = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SelectionTableFormat.prototype, "leftIndent", {
        /**
         * Gets or Sets the left indent for selected table.
         * @aspType int
         * @blazorType int
         */
        get: function () {
            return this.leftIndentIn;
        },
        /**
         * Gets or Sets the left indent for selected table.
         * @aspType int
         * @blazorType int
         */
        set: function (value) {
            if (value === this.leftIndentIn) {
                return;
            }
            this.leftIndentIn = value;
            this.notifyPropertyChanged('leftIndent');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SelectionTableFormat.prototype, "topMargin", {
        /**
         * Gets or Sets the default top margin of cell for selected table.
         * @default undefined
         * @aspType int
         * @blazorType int
         */
        get: function () {
            return this.topMarginIn;
        },
        /**
         * Gets or Sets the default top margin of cell for selected table.
         * @default undefined
         * @aspType int
         * @blazorType int
         */
        set: function (value) {
            if (value === this.topMarginIn) {
                return;
            }
            this.topMarginIn = value;
            this.notifyPropertyChanged('topMargin');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SelectionTableFormat.prototype, "background", {
        /**
         * Gets or Sets the background for selected table.
         * @default undefined
         * @aspType string
         * @blazorType string
         */
        get: function () {
            return this.backgroundIn;
        },
        /**
         * Gets or Sets the background for selected table.
         * @default undefined
         * @aspType string
         * @blazorType string
         */
        set: function (value) {
            if (value === this.backgroundIn) {
                return;
            }
            this.backgroundIn = value;
            this.notifyPropertyChanged('background');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SelectionTableFormat.prototype, "tableAlignment", {
        /**
         * Gets or Sets the table alignment for selected table.
         * @default undefined
         */
        get: function () {
            return this.tableAlignmentIn;
        },
        /**
         * Gets or Sets the table alignment for selected table.
         * @default undefined
         */
        set: function (value) {
            if (value === this.tableAlignmentIn) {
                return;
            }
            this.tableAlignmentIn = value;
            this.notifyPropertyChanged('tableAlignment');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SelectionTableFormat.prototype, "leftMargin", {
        /**
         * Gets or Sets the default left margin of cell for selected table.
         * @default undefined
         * @aspType int
         * @blazorType int
         */
        get: function () {
            return this.leftMarginIn;
        },
        /**
         * Gets or Sets the default left margin of cell for selected table.
         * @default undefined
         * @aspType int
         * @blazorType int
         */
        set: function (value) {
            if (value === this.leftMarginIn) {
                return;
            }
            this.leftMarginIn = value;
            this.notifyPropertyChanged('leftMargin');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SelectionTableFormat.prototype, "bottomMargin", {
        /**
         * Gets or Sets the default bottom margin of cell for selected table.
         * @default undefined
         * @aspType int
         * @blazorType int
         */
        get: function () {
            return this.bottomMarginIn;
        },
        /**
         * Gets or Sets the default bottom margin of cell for selected table.
         * @default undefined
         * @aspType int
         * @blazorType int
         */
        set: function (value) {
            if (value === this.bottomMarginIn) {
                return;
            }
            this.bottomMarginIn = value;
            this.notifyPropertyChanged('bottomMargin');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SelectionTableFormat.prototype, "cellSpacing", {
        /**
         * Gets or Sets the cell spacing for selected table.
         * @default undefined
         * @aspType int
         * @blazorType int
         */
        get: function () {
            return this.cellSpacingIn;
        },
        /**
         * Gets or Sets the cell spacing for selected table.
         * @default undefined
         * @aspType int
         * @blazorType int
         */
        set: function (value) {
            if (value === this.cellSpacingIn) {
                return;
            }
            this.cellSpacingIn = value;
            this.notifyPropertyChanged('cellSpacing');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SelectionTableFormat.prototype, "rightMargin", {
        /**
         * Gets or Sets the default right margin of cell for selected table.
         * @default undefined
         * @aspType int
         * @blazorType int
         */
        get: function () {
            return this.rightMarginIn;
        },
        /**
         * Gets or Sets the default right margin of cell for selected table.
         * @default undefined
         * @aspType int
         * @blazorType int
         */
        set: function (value) {
            if (value === this.rightMarginIn) {
                return;
            }
            this.rightMarginIn = value;
            this.notifyPropertyChanged('rightMargin');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SelectionTableFormat.prototype, "preferredWidth", {
        /**
         * Gets or Sets the preferred width for selected table.
         * @default undefined
         * @aspType int
         * @blazorType int
         */
        get: function () {
            return this.preferredWidthIn;
        },
        /**
         * Gets or Sets the preferred width for selected table.
         * @default undefined
         * @aspType int
         * @blazorType int
         */
        set: function (value) {
            if (value === this.preferredWidthIn) {
                return;
            }
            this.preferredWidthIn = value;
            this.notifyPropertyChanged('preferredWidth');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SelectionTableFormat.prototype, "preferredWidthType", {
        /**
         * Gets or Sets the preferred width type for selected table.
         * @default undefined
         */
        get: function () {
            return this.preferredWidthTypeIn;
        },
        /**
         * Gets or Sets the preferred width type for selected table.
         * @default undefined
         */
        set: function (value) {
            if (value === this.preferredWidthTypeIn) {
                return;
            }
            this.preferredWidthTypeIn = value;
            this.notifyPropertyChanged('preferredWidthType');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SelectionTableFormat.prototype, "bidi", {
        /**
         * Gets or sets the bidi property
         * @aspType bool
         * @blazorType bool
         */
        get: function () {
            return this.bidiIn;
        },
        /**
         * Gets or sets the bidi property
         * @aspType bool
         * @blazorType bool
         */
        set: function (value) {
            this.bidiIn = value;
            this.notifyPropertyChanged('bidi');
        },
        enumerable: true,
        configurable: true
    });
    SelectionTableFormat.prototype.getPropertyValue = function (propertyName) {
        switch (propertyName) {
            case 'tableAlignment':
                return this.tableAlignment;
            case 'leftIndent':
                return this.leftIndent;
            case 'cellSpacing':
                return this.cellSpacing;
            case 'leftMargin':
                return this.leftMargin;
            case 'rightMargin':
                return this.rightMargin;
            case 'topMargin':
                return this.topMargin;
            case 'bottomMargin':
                return this.bottomMargin;
            case 'background':
                var shading = new WShading();
                shading.backgroundColor = this.background;
                return shading;
            case 'preferredWidth':
                return this.preferredWidth;
            case 'preferredWidthType':
                return this.preferredWidthType;
            case 'bidi':
                return this.bidi;
            default:
                return undefined;
        }
    };
    SelectionTableFormat.prototype.notifyPropertyChanged = function (propertyName) {
        if (!isNullOrUndefined(this.selection) && (this.selection.isCleared
            || !this.selection.owner.isDocumentLoaded || this.selection.owner.isReadOnlyMode
            || this.selection.owner.isPastingContent) && !this.selection.isRetrieveFormatting) {
            return;
        }
        if (!isNullOrUndefined(this.selection) && !isNullOrUndefined(this.selection.start) && !this.selection.isRetrieveFormatting) {
            var value = this.getPropertyValue(propertyName);
            if (propertyName === 'background') {
                propertyName = 'shading';
            }
            if (!isNullOrUndefined(value)) {
                this.selection.owner.editorModule.onApplyTableFormat(propertyName, value);
            }
        }
    };
    /**
     * Copies the format.
     * @param  {WTableFormat} format Format to copy.
     * @returns void
     * @private
     */
    SelectionTableFormat.prototype.copyFormat = function (format) {
        this.leftIndent = format.leftIndent;
        this.background = format.shading.backgroundColor;
        this.tableAlignment = format.tableAlignment;
        this.leftMargin = format.leftMargin;
        this.rightMargin = format.rightMargin;
        this.topMargin = format.topMargin;
        this.bottomMargin = format.bottomMargin;
        this.cellSpacing = format.cellSpacing;
        this.preferredWidth = format.preferredWidth;
        this.preferredWidthType = format.preferredWidthType;
        this.bidi = format.bidi;
    };
    /**
     * Clears the format.
     * @returns void
     * @private
     */
    SelectionTableFormat.prototype.clearFormat = function () {
        this.table = undefined;
        this.leftIndent = 0;
        this.background = undefined;
        this.leftIndent = 0;
        this.leftMargin = 0;
        this.rightMargin = 0;
        this.topMargin = 0;
        this.bottomMargin = 0;
        this.cellSpacing = 0;
        this.tableAlignment = undefined;
        this.bidi = undefined;
    };
    /**
     * Destroys the managed resources.
     * @returns void
     * @private
     */
    SelectionTableFormat.prototype.destroy = function () {
        this.leftIndentIn = undefined;
        this.backgroundIn = undefined;
        this.leftIndentIn = undefined;
        this.leftMarginIn = undefined;
        this.rightMarginIn = undefined;
        this.topMarginIn = undefined;
        this.bottomMarginIn = undefined;
        this.cellSpacingIn = undefined;
        this.tableAlignmentIn = undefined;
        this.tableIn = undefined;
        this.selection = undefined;
        this.bidi = undefined;
    };
    return SelectionTableFormat;
}());
export { SelectionTableFormat };
/**
 * Selection cell format implementation
 */
var SelectionCellFormat = /** @class */ (function () {
    /**
     * @private
     */
    function SelectionCellFormat(selection) {
        this.verticalAlignmentIn = undefined;
        this.leftMarginIn = 0;
        this.rightMarginIn = 0;
        this.topMarginIn = 0;
        this.bottomMarginIn = 0;
        this.backgroundIn = undefined;
        this.preferredWidthTypeIn = undefined;
        this.selection = selection;
    }
    Object.defineProperty(SelectionCellFormat.prototype, "verticalAlignment", {
        /**
         * Gets or sets the vertical alignment of the selected cells.
         * @default undefined
         */
        get: function () {
            return this.verticalAlignmentIn;
        },
        /**
         * Gets or sets the vertical alignment of the selected cells.
         * @default undefined
         */
        set: function (value) {
            if (value === this.verticalAlignmentIn) {
                return;
            }
            this.verticalAlignmentIn = value;
            this.notifyPropertyChanged('verticalAlignment');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SelectionCellFormat.prototype, "leftMargin", {
        /**
         * Gets or Sets the left margin for selected cells.
         * @default undefined
         * @aspType int
         * @blazorType int
         */
        /* tslint:disable */
        get: function () {
            return this.leftMarginIn;
        },
        /**
         * Gets or Sets the left margin for selected cells.
         * @default undefined
         * @aspType int
         * @blazorType int
         */
        set: function (value) {
            if (value === this.leftMarginIn) {
                return;
            }
            this.leftMarginIn = value;
            this.notifyPropertyChanged('leftMargin');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SelectionCellFormat.prototype, "rightMargin", {
        /**
         * Gets or Sets the right margin for selected cells.
         * @default undefined
         * @aspType int
         * @blazorType int
         */
        get: function () {
            return this.rightMarginIn;
        },
        /**
         * Gets or Sets the right margin for selected cells.
         * @default undefined
         * @aspType int
         * @blazorType int
         */
        set: function (value) {
            if (value === this.rightMarginIn) {
                return;
            }
            this.rightMarginIn = value;
            this.notifyPropertyChanged('rightMargin');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SelectionCellFormat.prototype, "topMargin", {
        /**
         * Gets or Sets the top margin for selected cells.
         * @default undefined
         * @aspType int
         * @blazorType int
         */
        get: function () {
            return this.topMarginIn;
        },
        /**
         * Gets or Sets the top margin for selected cells.
         * @default undefined
         * @aspType int
         * @blazorType int
         */
        set: function (value) {
            if (value === this.topMarginIn) {
                return;
            }
            this.topMarginIn = value;
            this.notifyPropertyChanged('topMargin');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SelectionCellFormat.prototype, "bottomMargin", {
        /**
         * Gets or Sets the bottom margin for selected cells.
         * @default undefined
         * @aspType int
         * @blazorType int
         */
        get: function () {
            return this.bottomMarginIn;
        },
        /**
         * Gets or Sets the bottom margin for selected cells.
         * @default undefined
         * @aspType int
         * @blazorType int
         */
        set: function (value) {
            if (value === this.bottomMarginIn) {
                return;
            }
            this.bottomMarginIn = value;
            this.notifyPropertyChanged('bottomMargin');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SelectionCellFormat.prototype, "background", {
        /**
         * Gets or Sets the background for selected cells.
         * @default undefined
         * @aspType string
         * @blazorType string
         */
        get: function () {
            return this.backgroundIn;
        },
        /**
         * Gets or Sets the background for selected cells.
         * @default undefined
         * @aspType string
         * @blazorType string
         */
        /* tslint:enable */
        set: function (value) {
            if (value === this.backgroundIn) {
                return;
            }
            this.backgroundIn = value;
            this.notifyPropertyChanged('background');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SelectionCellFormat.prototype, "preferredWidthType", {
        /* tslint:disable */
        /**
         * Gets or Sets the preferred width type for selected cells.
         * @default undefined
         */
        get: function () {
            return this.preferredWidthTypeIn;
        },
        /**
         * Gets or Sets the preferred width type for selected cells.
         * @default undefined
         */
        set: function (value) {
            if (value === this.preferredWidthTypeIn) {
                return;
            }
            this.preferredWidthTypeIn = value;
            this.notifyPropertyChanged('preferredWidthType');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SelectionCellFormat.prototype, "preferredWidth", {
        /**
         * Gets or Sets the preferred width  for selected cells.
         * @default undefined
         * @aspType int
         * @blazorType int
         */
        get: function () {
            return this.preferredWidthIn;
        },
        /**
         * Gets or Sets the preferred width  for selected cells.
         * @default undefined
         * @aspType int
         * @blazorType int
         */
        set: function (value) {
            if (value === this.preferredWidthIn) {
                return;
            }
            this.preferredWidthIn = value;
            this.notifyPropertyChanged('preferredWidth');
        },
        enumerable: true,
        configurable: true
    });
    /* tslint:enable */
    SelectionCellFormat.prototype.notifyPropertyChanged = function (propertyName) {
        var selection = this.selection;
        if (!isNullOrUndefined(selection)) {
            if ((selection.isCleared || !selection.owner.isDocumentLoaded
                || selection.owner.isReadOnlyMode || selection.owner.isPastingContent) && !selection.isRetrieveFormatting) {
                return;
            }
            if (!isNullOrUndefined(this.selection.start) && !this.selection.isRetrieveFormatting) {
                var value = this.getPropertyValue(propertyName);
                if (propertyName === 'background') {
                    propertyName = 'shading';
                }
                if (!isNullOrUndefined(value)) {
                    this.selection.owner.editorModule.onApplyTableCellFormat(propertyName, value);
                }
            }
        }
    };
    SelectionCellFormat.prototype.getPropertyValue = function (propertyName) {
        switch (propertyName) {
            case 'verticalAlignment':
                return this.verticalAlignment;
            case 'leftMargin':
                return this.leftMargin;
            case 'rightMargin':
                return this.rightMargin;
            case 'topMargin':
                return this.topMargin;
            case 'bottomMargin':
                return this.bottomMargin;
            case 'preferredWidth':
                return this.preferredWidth;
            case 'preferredWidthType':
                return this.preferredWidthType;
            case 'background':
                var shading = new WShading();
                shading.backgroundColor = this.background;
                return shading;
            default:
                return undefined;
        }
    };
    /**
     * Copies the format.
     * @param  {WCellFormat} format Source Format to copy.
     * @returns void
     * @private
     */
    SelectionCellFormat.prototype.copyFormat = function (format) {
        this.leftMargin = format.leftMargin;
        this.rightMargin = format.rightMargin;
        this.topMargin = format.topMargin;
        this.bottomMargin = format.bottomMargin;
        this.background = format.shading.backgroundColor;
        this.verticalAlignment = format.verticalAlignment;
        this.preferredWidth = format.preferredWidth;
        this.preferredWidthType = format.preferredWidthType;
    };
    /**
     * Clears the format.
     * @returns void
     * @private
     */
    SelectionCellFormat.prototype.clearCellFormat = function () {
        this.leftMargin = undefined;
        this.rightMargin = undefined;
        this.topMargin = undefined;
        this.bottomMargin = undefined;
        this.background = undefined;
        this.verticalAlignment = undefined;
    };
    /**
     * Combines the format.
     * @param  {WCellFormat} format
     * @private
     */
    SelectionCellFormat.prototype.combineFormat = function (format) {
        if (!isNullOrUndefined(this.leftMargin) && this.leftMargin !== format.leftMargin) {
            this.leftMargin = undefined;
        }
        if (!isNullOrUndefined(this.topMargin) && this.topMargin !== format.topMargin) {
            this.topMargin = undefined;
        }
        if (!isNullOrUndefined(this.rightMargin) && this.rightMargin !== format.rightMargin) {
            this.rightMargin = undefined;
        }
        if (!isNullOrUndefined(this.bottomMargin) && this.bottomMargin !== format.bottomMargin) {
            this.bottomMargin = undefined;
        }
        if (!isNullOrUndefined(this.background) && this.background !== format.shading.backgroundColor) {
            this.background = undefined;
        }
        if (!isNullOrUndefined(this.verticalAlignment) && this.verticalAlignment !== format.verticalAlignment) {
            this.verticalAlignment = undefined;
        }
        if (!isNullOrUndefined(this.preferredWidth) && this.preferredWidth !== format.preferredWidth) {
            this.preferredWidth = undefined;
        }
        if (!isNullOrUndefined(this.preferredWidthType) && this.preferredWidthType !== format.preferredWidthType) {
            this.preferredWidthType = undefined;
        }
    };
    /**
     * Clears the format.
     * @returns void
     * @private
     */
    SelectionCellFormat.prototype.clearFormat = function () {
        this.background = undefined;
        this.bottomMargin = 0;
        this.leftMargin = 0;
        this.rightMargin = 0;
        this.topMargin = 0;
        this.verticalAlignment = undefined;
    };
    /**
     * Destroys the manages resources.
     * @returns void
     * @private
     */
    SelectionCellFormat.prototype.destroy = function () {
        this.backgroundIn = undefined;
        this.verticalAlignmentIn = undefined;
        this.bottomMarginIn = undefined;
        this.leftMarginIn = undefined;
        this.rightMarginIn = undefined;
        this.topMarginIn = undefined;
        this.selection = undefined;
    };
    return SelectionCellFormat;
}());
export { SelectionCellFormat };
/**
 * Selection row format implementation
 */
var SelectionRowFormat = /** @class */ (function () {
    /**
     * @private
     */
    function SelectionRowFormat(selection) {
        this.heightIn = undefined;
        this.heightTypeIn = undefined;
        this.isHeaderIn = undefined;
        this.allowRowBreakAcrossPagesIn = undefined;
        this.selection = selection;
    }
    Object.defineProperty(SelectionRowFormat.prototype, "height", {
        /**
         * Gets or Sets the height for selected rows.
         * @default undefined
         * @aspType int
         * @blazorType int
         */
        get: function () {
            return this.heightIn;
        },
        /**
         * Gets or Sets the height for selected rows.
         * @default undefined
         * @aspType int
         * @blazorType int
         */
        set: function (value) {
            if (value === this.heightIn) {
                return;
            }
            this.heightIn = value;
            this.notifyPropertyChanged('height');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SelectionRowFormat.prototype, "heightType", {
        /**
         * Gets or Sets the height type for selected rows.
         * @default undefined
         */
        get: function () {
            return this.heightTypeIn;
        },
        /**
         * Gets or Sets the height type for selected rows.
         * @default undefined
         */
        set: function (value) {
            if (value === this.heightTypeIn) {
                return;
            }
            this.heightTypeIn = value;
            this.notifyPropertyChanged('heightType');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SelectionRowFormat.prototype, "isHeader", {
        /**
         * Gets or Sets a value indicating whether the selected rows are header rows or not.
         * @default undefined
         * @aspType bool
         * @blazorType bool
         */
        get: function () {
            return this.isHeaderIn;
        },
        /**
         * Gets or Sets a value indicating whether the selected rows are header rows or not.
         * @default undefined
         * @aspType bool
         * @blazorType bool
         */
        set: function (value) {
            if (value === this.isHeaderIn) {
                return;
            }
            this.isHeaderIn = value;
            this.notifyPropertyChanged('isHeader');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SelectionRowFormat.prototype, "allowBreakAcrossPages", {
        /**
         * Gets or Sets a value indicating whether to allow break across pages for selected rows.
         * @default undefined
         * @aspType bool
         * @blazorType bool
         */
        get: function () {
            return this.allowRowBreakAcrossPagesIn;
        },
        /**
         * Gets or Sets a value indicating whether to allow break across pages for selected rows.
         * @default undefined
         * @aspType bool
         * @blazorType bool
         */
        set: function (value) {
            if (value === this.allowRowBreakAcrossPagesIn) {
                return;
            }
            this.allowRowBreakAcrossPagesIn = value;
            this.notifyPropertyChanged('allowBreakAcrossPages');
        },
        enumerable: true,
        configurable: true
    });
    SelectionRowFormat.prototype.notifyPropertyChanged = function (propertyName) {
        var selection = this.selection;
        if (!isNullOrUndefined(selection) && (selection.isCleared || selection.owner.isReadOnlyMode
            || !selection.owner.isDocumentLoaded || selection.owner.isPastingContent) && !selection.isRetrieveFormatting) {
            return;
        }
        if (!isNullOrUndefined(selection) && !isNullOrUndefined(selection.start) && !selection.isRetrieveFormatting) {
            var value = this.getPropertyValue(propertyName);
            if (!isNullOrUndefined(value)) {
                selection.owner.editorModule.onApplyTableRowFormat(propertyName, value);
            }
        }
    };
    SelectionRowFormat.prototype.getPropertyValue = function (propertyName) {
        switch (propertyName) {
            case 'height':
                return this.height;
            case 'heightType':
                return this.heightType;
            case 'isHeader':
                return this.isHeader;
            case 'allowBreakAcrossPages':
                return this.allowBreakAcrossPages;
            default:
                return undefined;
        }
    };
    /**
     * Copies the format.
     * @param  {WRowFormat} format
     * @returns void
     * @private
     */
    SelectionRowFormat.prototype.copyFormat = function (format) {
        this.height = format.height;
        this.heightType = format.heightType;
        this.allowBreakAcrossPages = format.allowBreakAcrossPages;
        this.isHeader = format.isHeader;
    };
    /**
     * Combines the format.
     * @param  {WRowFormat} format
     * @private
     */
    SelectionRowFormat.prototype.combineFormat = function (format) {
        if (!isNullOrUndefined(this.height) && this.height !== format.height) {
            this.height = undefined;
        }
        if (!isNullOrUndefined(this.heightType) && this.heightType !== format.heightType) {
            this.heightType = undefined;
        }
        if (!isNullOrUndefined(this.allowBreakAcrossPages) && this.allowBreakAcrossPages !== format.allowBreakAcrossPages) {
            this.allowBreakAcrossPages = undefined;
        }
        if (!isNullOrUndefined(this.isHeader) && this.isHeader !== format.isHeader) {
            this.isHeader = undefined;
        }
    };
    /**
     * Clears the row format.
     * @returns void
     * @private
     */
    SelectionRowFormat.prototype.clearRowFormat = function () {
        this.height = undefined;
        this.heightType = undefined;
        this.allowBreakAcrossPages = undefined;
        this.isHeader = undefined;
    };
    /**
     * Clears the format.
     * @returns void
     * @private
     */
    SelectionRowFormat.prototype.clearFormat = function () {
        this.height = 0;
        this.heightType = undefined;
        this.allowBreakAcrossPages = undefined;
        this.isHeader = undefined;
    };
    /**
     * Destroys the managed resources.
     * @returns void
     * @private
     */
    SelectionRowFormat.prototype.destroy = function () {
        this.heightIn = undefined;
        this.heightTypeIn = undefined;
        this.allowRowBreakAcrossPagesIn = undefined;
        this.isHeaderIn = undefined;
        this.selection = undefined;
    };
    return SelectionRowFormat;
}());
export { SelectionRowFormat };
/**
 * Selection image format implementation
 */
var SelectionImageFormat = /** @class */ (function () {
    /**
     * @private
     */
    function SelectionImageFormat(selection) {
        this.selection = selection;
    }
    Object.defineProperty(SelectionImageFormat.prototype, "width", {
        /**
         * Gets the width of the image.
         * @aspType int
         * @blazorType int
         */
        get: function () {
            if (this.image) {
                return this.image.width;
            }
            return 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SelectionImageFormat.prototype, "height", {
        /**
         * Gets the height of the image.
         * @aspType int
         * @blazorType int
         */
        get: function () {
            if (this.image) {
                return this.image.height;
            }
            return 0;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Resizes the image based on given size.
     * @param width
     * @param height
     */
    SelectionImageFormat.prototype.resize = function (width, height) {
        this.updateImageFormat(width, height);
    };
    /**
     * Update image width and height
     * @private
     */
    SelectionImageFormat.prototype.updateImageFormat = function (width, height) {
        if (this.image) {
            if (this.selection.owner.editorModule) {
                this.selection.owner.editorModule.onImageFormat(this.image, width, height);
            }
        }
    };
    /**
     * @private
     */
    SelectionImageFormat.prototype.copyImageFormat = function (image) {
        this.image = image;
    };
    /**
     * @private
     */
    SelectionImageFormat.prototype.clearImageFormat = function () {
        this.image = undefined;
    };
    return SelectionImageFormat;
}());
export { SelectionImageFormat };
/* tslint:enable */ 

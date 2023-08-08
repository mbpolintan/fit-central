// tslint:disable-next-line:max-line-length
import { TextSearchResults } from '../index';
import { Dictionary } from '../../base/dictionary';
import { TextElementBox, ErrorTextElementBox, TableCellWidget, FieldElementBox } from '../viewer/page';
import { isNullOrUndefined } from '@syncfusion/ej2-base';
/**
 * The spell checker module
 */
var SpellChecker = /** @class */ (function () {
    /**
     *
     */
    function SpellChecker(documentHelper) {
        this.langIDInternal = 0;
        /**
         * Specifies whether spell check has to be performed or not.
         */
        this.enableSpellCheck = true;
        this.spellSuggestionInternal = true;
        /**
         * @private
         */
        this.uniqueKey = '';
        this.removeUnderlineInternal = false;
        /**
         * @default 1000
         */
        this.uniqueWordsCountInternal = 10000;
        this.performOptimizedCheck = false;
        this.documentHelper = documentHelper;
        this.errorWordCollection = new Dictionary();
        this.errorSuggestions = new Dictionary();
        this.ignoreAllItems = [];
        this.uniqueSpelledWords = [];
        this.textSearchResults = new TextSearchResults(this.documentHelper.owner);
        this.uniqueKey = this.documentHelper.owner.element.id + '_' + this.createGuid();
    }
    /**
     * Gets module name.
     */
    SpellChecker.prototype.getModuleName = function () {
        return 'SpellChecker';
    };
    Object.defineProperty(SpellChecker.prototype, "enableOptimizedSpellCheck", {
        /**
         * Gets the boolean indicating whether optimized spell check to be performed.
         * @aspType bool
         * @blazorType bool
         */
        get: function () {
            return this.performOptimizedCheck;
        },
        /**
         * Sets the boolean indicating whether optimized spell check to be performed.
         * @aspType bool
         * @blazorType bool
         */
        set: function (value) {
            this.performOptimizedCheck = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SpellChecker.prototype, "uniqueWordsCount", {
        /**
         * Gets the spell checked Unique words.
         * @aspType int
         * @blazorType int
         */
        get: function () {
            return isNullOrUndefined(this.uniqueWordsCountInternal) ? 0 : this.uniqueWordsCountInternal;
        },
        /**
         * Sets the spell checked Unique words.
         * @aspType int
         * @blazorType int
         */
        set: function (value) {
            this.uniqueWordsCountInternal = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SpellChecker.prototype, "languageID", {
        /**
         * Gets the languageID.
         * @aspType int
         * @blazorType int
         */
        get: function () {
            return isNullOrUndefined(this.langIDInternal) ? 0 : this.langIDInternal;
        },
        /**
         * Sets the languageID.
         * @aspType int
         * @blazorType int
         */
        set: function (value) {
            this.langIDInternal = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SpellChecker.prototype, "allowSpellCheckAndSuggestion", {
        /**
         * Getter indicates whether suggestion enabled.
         * @aspType bool
         * @blazorType bool
         */
        get: function () {
            return this.spellSuggestionInternal;
        },
        /**
         * Setter to enable or disable suggestion
         * @aspType bool
         * @blazorType bool
         */
        set: function (value) {
            this.spellSuggestionInternal = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SpellChecker.prototype, "removeUnderline", {
        /**
         * Getter indicates whether underline removed for mis-spelled word.
         * @aspType bool
         * @blazorType bool
         */
        get: function () {
            return this.removeUnderlineInternal;
        },
        /**
         * Setter to enable or disable underline for mis-spelled word
         * @aspType bool
         * @blazorType bool
         */
        set: function (value) {
            this.removeUnderlineInternal = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SpellChecker.prototype, "viewer", {
        get: function () {
            return this.documentHelper.owner.viewer;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Method to manage replace logic
     * @private
     */
    SpellChecker.prototype.manageReplace = function (content, dialogElement) {
        this.documentHelper.triggerSpellCheck = true;
        var exactText = '';
        var elementInfo;
        if (!isNullOrUndefined(dialogElement) && dialogElement instanceof ErrorTextElementBox) {
            var exactText_1 = dialogElement.text;
            this.documentHelper.selection.start = dialogElement.start;
            this.documentHelper.selection.end = dialogElement.end;
            if (content !== 'Ignore Once') {
                content = this.manageSpecialCharacters(exactText_1, content);
                this.documentHelper.owner.editor.insertTextInternal(content, true);
                this.documentHelper.selection.start.setPositionInternal(this.documentHelper.selection.end);
                this.documentHelper.clearSelectionHighlight();
                return;
            }
            else {
                this.currentContextInfo = { 'text': exactText_1, 'element': dialogElement };
            }
        }
        if (!isNullOrUndefined(this.currentContextInfo) && this.currentContextInfo.element && content !== 'Ignore Once') {
            var elementBox = this.currentContextInfo.element;
            exactText = this.currentContextInfo.element.text;
            this.documentHelper.selection.start = elementBox.start;
            this.documentHelper.selection.end = elementBox.end;
        }
        else {
            this.handleReplace(content);
        }
        if (content !== 'Ignore Once') {
            this.documentHelper.owner.editor.insertTextInternal(content, true);
            if (!isNullOrUndefined(this.currentContextInfo)) {
                this.removeErrorsFromCollection(this.currentContextInfo);
            }
            this.documentHelper.selection.start.setPositionInternal(this.documentHelper.selection.end);
            this.documentHelper.clearSelectionHighlight();
        }
        //this.documentHelper.owner.errorWordCollection.remove(content);
        this.documentHelper.triggerSpellCheck = false;
    };
    /**
     * Method to handle replace logic
     * @param {string} content
     * @private
     */
    SpellChecker.prototype.handleReplace = function (content) {
        var startPosition = this.documentHelper.selection.start;
        var offset = startPosition.offset;
        var startIndex = 0;
        var startInlineObj = startPosition.currentWidget.getInline(offset, startIndex, false, true);
        var startOffset = startInlineObj.element.line.getOffset(startInlineObj.element, 0) + startInlineObj.element.length;
        if (startOffset === offset) {
            this.retrieveExactElementInfo(startInlineObj);
        }
        var exactText = startInlineObj.element.text;
        // tslint:disable-next-line:max-line-length
        var startPattern = new RegExp('^[#\\@\\!\\~\\$\\%\\^\\&\\*\\(\\)\\-\\_\\+\\=\\{\\}\\[\\]\\:\\;\\"\'\\,\\<\\.\\>\\/\\?\\`\\s]+', 'g');
        var matches = [];
        var matchInfo;
        //tslint:disable no-conditional-assignment
        while (!isNullOrUndefined(matchInfo = startPattern.exec(exactText))) {
            matches.push(matchInfo);
        }
        if (content === 'Ignore Once') {
            this.handleIgnoreOnce(startInlineObj);
            return;
        }
        startPosition.offset = offset - startInlineObj.index;
        if (!isNullOrUndefined(matches) && matches.length > 0) {
            startPosition.offset += matches[0].toString().length;
        }
        // tslint:disable-next-line:max-line-length
        startPosition.location = this.documentHelper.owner.selection.getPhysicalPositionInternal(startPosition.currentWidget, startPosition.offset, true);
        // tslint:disable-next-line:max-line-length
        startPosition = this.documentHelper.owner.searchModule.textSearch.getTextPosition(startPosition.currentWidget, startPosition.offset.toString());
        //startPosition.location = this.owner.selection.getPhysicalPositionInternal(span.line, offset, true);
        startPosition.setPositionParagraph(startPosition.currentWidget, startPosition.offset);
        var index = (startPosition.offset + startInlineObj.element.length) - startPosition.offset;
        var endOffset = startPosition.currentWidget.getOffset(startInlineObj.element, index);
        var lineWidget = startPosition.currentWidget;
        // tslint:disable-next-line:max-line-length
        var endPattern = new RegExp('[#\\@\\!\\~\\$\\%\\^\\&\\*\\(\\)\\-\\_\\+\\=\\{\\}\\[\\]\\:\\;\\"\'\\,\\<\\.\\>\\/\\?\\s\\`]+$', 'g');
        matches = [];
        //tslint:disable no-conditional-assignment
        while (!isNullOrUndefined(matchInfo = endPattern.exec(exactText))) {
            matches.push(matchInfo);
        }
        if (!isNullOrUndefined(matches) && matches.length > 0) {
            endOffset -= matches[0].toString().length;
        }
        // tslint:disable-next-line:max-line-length
        this.documentHelper.selection.end = this.documentHelper.owner.searchModule.textSearch.getTextPosition(lineWidget, endOffset.toString());
        // tslint:disable-next-line:max-line-length
        this.documentHelper.selection.end.location = this.documentHelper.owner.selection.getPhysicalPositionInternal(startPosition.currentWidget, endOffset, true);
        this.documentHelper.selection.end.setPositionParagraph(lineWidget, endOffset);
        this.currentContextInfo = { 'element': startInlineObj.element, 'text': startInlineObj.element.text };
    };
    /**
     * Method to retrieve exact element info
     * @param {ElementInfo} startInlineObj
     * @private
     */
    SpellChecker.prototype.retrieveExactElementInfo = function (startInlineObj) {
        var nextElement = startInlineObj.element.nextElement;
        // tslint:disable-next-line:max-line-length
        startInlineObj.element = (!isNullOrUndefined(nextElement) && nextElement instanceof TextElementBox) ? startInlineObj.element.nextElement : startInlineObj.element;
    };
    /**
     * Method to handle to ignore error Once
     * @param {ElementInfo} startInlineObj
     * @private
     */
    SpellChecker.prototype.handleIgnoreOnce = function (startInlineObj) {
        var textElement = startInlineObj.element;
        var exactText = '';
        if (!isNullOrUndefined(this.currentContextInfo) && this.currentContextInfo.element) {
            exactText = this.currentContextInfo.element.text;
        }
        else {
            exactText = textElement.text;
        }
        exactText = this.manageSpecialCharacters(exactText, undefined, true);
        if (textElement.ignoreOnceItems.indexOf(exactText) === -1) {
            textElement.ignoreOnceItems.push(exactText);
        }
        this.documentHelper.owner.editor.reLayout(this.documentHelper.selection);
    };
    /**
     * Method to handle ignore all items
     * @private
     */
    SpellChecker.prototype.handleIgnoreAllItems = function (contextElement) {
        var contextItem = (!isNullOrUndefined(contextElement)) ? contextElement : this.retriveText();
        var retrievedText = this.manageSpecialCharacters(contextItem.text, undefined, true);
        if (this.ignoreAllItems.indexOf(retrievedText) === -1) {
            this.ignoreAllItems.push(retrievedText);
            this.removeErrorsFromCollection(contextItem);
            this.documentHelper.triggerSpellCheck = true;
            this.documentHelper.owner.editor.reLayout(this.documentHelper.selection);
            this.documentHelper.triggerSpellCheck = false;
            this.documentHelper.clearSelectionHighlight();
        }
    };
    /**
     * Method to handle dictionary
     * @private
     */
    SpellChecker.prototype.handleAddToDictionary = function (contextElement) {
        var _this = this;
        var contextItem = (!isNullOrUndefined(contextElement)) ? contextElement : this.retriveText();
        var retrievedText = this.manageSpecialCharacters(contextItem.text, undefined, true);
        // tslint:disable-next-line:max-line-length
        /* tslint:disable:no-any */
        this.CallSpellChecker(this.languageID, retrievedText, false, false, true).then(function (data) {
            _this.documentHelper.triggerSpellCheck = true;
            _this.removeErrorsFromCollection(contextItem);
            _this.ignoreAllItems.push(retrievedText);
            _this.documentHelper.owner.editor.reLayout(_this.documentHelper.selection, true);
            _this.documentHelper.triggerSpellCheck = false;
        });
    };
    /**
     * Method to append/remove special characters
     * @param {string} exactText
     * @param {boolean} isRemove
     * @private
     */
    // tslint:disable-next-line:max-line-length
    SpellChecker.prototype.manageSpecialCharacters = function (exactText, replaceText, isRemove) {
        if (!isNullOrUndefined(exactText)) {
            if (isNullOrUndefined(replaceText)) {
                replaceText = exactText;
            }
            // tslint:disable-next-line:max-line-length
            var pattern = new RegExp('^[#\\@\\!\\~\\$\\%\\^\\&\\*\\(\\)\\-\\_\\+\\=\\{\\}\\[\\]\\:\\;\\"\\”\'\\,\\<\\.\\>\\/\\?\\`\\s]+', 'g');
            var matches = [];
            var matchInfo = void 0;
            //tslint:disable no-conditional-assignment
            while (!isNullOrUndefined(matchInfo = pattern.exec(exactText))) {
                matches.push(matchInfo);
            }
            if (matches.length > 0) {
                for (var i = 0; i < matches.length; i++) {
                    /* tslint:disable:no-any */
                    var match = matches[i];
                    replaceText = (!isRemove) ? match[0] + replaceText : replaceText.replace(match[0], '');
                }
            }
            // tslint:disable-next-line:max-line-length
            var endPattern = new RegExp('[#\\@\\!\\~\\$\\%\\^\\&\\*\\(\\)\\-\\_\\+\\=\\{\\}\\[\\]\\:\\;\\"\\”\'\\,\\<\\.\\>\\/\\?\\s\\`]+$', 'g');
            matches = [];
            //tslint:disable no-conditional-assignment
            while (!isNullOrUndefined(matchInfo = endPattern.exec(replaceText))) {
                matches.push(matchInfo);
            }
            if (matches.length > 0) {
                for (var i = 0; i < matches.length; i++) {
                    /* tslint:disable:no-any */
                    var match = matches[i];
                    replaceText = (!isRemove) ? replaceText + match[0] : replaceText.slice(0, match.index);
                }
            }
        }
        return replaceText;
    };
    /**
     * Method to remove errors
     * @param {ContextElementInfo} contextItem
     * @private
     */
    SpellChecker.prototype.removeErrorsFromCollection = function (contextItem) {
        if (this.errorWordCollection.containsKey(contextItem.text)) {
            var textElement = this.errorWordCollection.get(contextItem.text);
            if (textElement.indexOf(contextItem.element) >= 0) {
                textElement.splice(0, 1);
            }
            if (textElement.length === 0) {
                this.errorWordCollection.remove(contextItem.text);
            }
        }
    };
    /**
     * Method to retrieve exact text
     * @private
     */
    SpellChecker.prototype.retriveText = function () {
        var exactText;
        var currentElement;
        if (!isNullOrUndefined(this.currentContextInfo) && this.currentContextInfo.element) {
            currentElement = this.currentContextInfo.element;
            exactText = this.currentContextInfo.element.text;
            this.documentHelper.selection.start = currentElement.start;
            this.documentHelper.selection.end = currentElement.end;
        }
        else {
            var startPosition = this.documentHelper.selection.start;
            var offset = startPosition.offset;
            var startIndex = 0;
            var startInlineObj = startPosition.currentWidget.getInline(offset, startIndex);
            currentElement = startInlineObj.element;
            exactText = startInlineObj.element.text;
        }
        return { 'text': exactText, 'element': currentElement };
    };
    /**
     * Method to handle suggestions
     * @param {any} jsonObject
     * @param {PointerEvent} event
     * @private
     */
    /* tslint:disable:no-any */
    SpellChecker.prototype.handleSuggestions = function (allsuggestions) {
        this.spellCheckSuggestion = [];
        if (allsuggestions.length === 0) {
            this.spellCheckSuggestion.push('Add To Dictionary');
        }
        else {
            // tslint:disable-next-line:max-line-length
            allsuggestions = (allsuggestions.length === 5) ? this.constructInlineMenu(allsuggestions) : allsuggestions;
            this.spellCheckSuggestion.push('Add To Dictionary');
        }
        /* tslint:disable:no-any */
        var spellSuggestion = [];
        if (this.spellCheckSuggestion.length > 0) {
            for (var _i = 0, _a = this.spellCheckSuggestion; _i < _a.length; _i++) {
                var str = _a[_i];
                spellSuggestion.push({
                    text: str,
                    id: this.documentHelper.owner.element.id + '_contextmenu_otherSuggestions_spellcheck_' + str,
                    iconCss: ''
                });
            }
        }
        return spellSuggestion;
    };
    /**
     * Method to check whether text element has errors
     * @param {string} text
     * @param {any} element
     * @param {number} left
     * @private
     */
    SpellChecker.prototype.checktextElementHasErrors = function (text, element, left) {
        var hasError = false;
        var erroElements = [];
        text = text.replace(/[\s]+/g, '');
        if (!isNullOrUndefined(element.errorCollection) && element.errorCollection.length > 0) {
            // tslint:disable-next-line:max-line-length
            if (!this.documentHelper.isScrollHandler && (element.ischangeDetected || element.paragraph.isChangeDetected)) {
                this.updateStatusForGlobalErrors(element.errorCollection, element);
                element.errorCollection = [];
                element.ischangeDetected = true;
                return { 'errorFound': hasError, 'elements': erroElements };
            }
            for (var i = 0; i < element.errorCollection.length; i++) {
                if (this.handleErrorCollection(element.errorCollection[i])) {
                    hasError = true;
                    erroElements.push(element.errorCollection[i]);
                }
            }
        }
        else if (!this.documentHelper.isScrollHandler && element.paragraph.isChangeDetected) {
            element.ischangeDetected = true;
        }
        else if (!element.ischangeDetected && this.handleErrorCollection(element)) {
            hasError = true;
            erroElements.push(element);
        }
        return { 'errorFound': hasError, 'elements': erroElements };
    };
    /**
     * Method to update status for error elements
     * @param {ErrorTextElementBox[]} erroElements
     */
    SpellChecker.prototype.updateStatusForGlobalErrors = function (erroElements, parentElement) {
        if (erroElements.length > 0) {
            for (var i = 0; i < erroElements.length; i++) {
                var exactText = this.manageSpecialCharacters(erroElements[i].text, undefined, true);
                if (this.errorWordCollection.containsKey(exactText)) {
                    var elements = this.errorWordCollection.get(exactText);
                    for (var j = 0; j < elements.length; j++) {
                        if (elements[j] instanceof ErrorTextElementBox && elements[j] === erroElements[i]) {
                            elements[j].ischangeDetected = true;
                            // tslint:disable-next-line:max-line-length
                            elements[j].start.offset = parentElement.line.getOffset(parentElement.istextCombined ? this.getCombinedElement(parentElement) : parentElement, 0);
                            elements[j].line = parentElement.line;
                            break;
                        }
                    }
                }
            }
        }
    };
    /**
     * Method to handle document error collection.
     * @param {string} errorInElement
     * @private
     */
    SpellChecker.prototype.handleErrorCollection = function (errorInElement) {
        var errors = this.errorWordCollection;
        var exactText = this.manageSpecialCharacters(errorInElement.text, undefined, true);
        if (errors.containsKey(exactText) && errorInElement.length > 1) {
            var ignoreAllIndex = this.ignoreAllItems.indexOf(exactText);
            if (ignoreAllIndex > -1) {
                if (errors.containsKey(exactText)) {
                    errors.remove(exactText);
                }
                return false;
            }
            return true;
        }
        return false;
    };
    /**
     * Method to construct inline menu
     */
    /* tslint:disable:no-any */
    SpellChecker.prototype.constructInlineMenu = function (inlineSuggestion) {
        /* tslint:disable:no-any */
        for (var i = inlineSuggestion.length - 1; i > 0; i--) {
            if (inlineSuggestion.length > 3) {
                this.spellCheckSuggestion.push(inlineSuggestion[i]);
                inlineSuggestion.pop();
            }
        }
        return inlineSuggestion;
    };
    /**
     * Method to retrieve error element text
     * @private
     */
    SpellChecker.prototype.findCurretText = function () {
        var insertPosition = this.documentHelper.selection.start;
        /* tslint:disable:no-any */
        var element;
        /* tslint:disable:no-any */
        var inlineObj = insertPosition.currentWidget.getInline(this.documentHelper.selection.start.offset, 0);
        var text;
        if (!isNullOrUndefined(inlineObj.element)) {
            if (!isNullOrUndefined(inlineObj.element.errorCollection) && inlineObj.element.errorCollection.length > 0) {
                for (var i = 0; i < inlineObj.element.errorCollection.length; i++) {
                    var errorElement = inlineObj.element.errorCollection[i];
                    // tslint:disable-next-line:max-line-length
                    if (errorElement.start.location.x <= insertPosition.location.x && errorElement.end.location.x >= insertPosition.location.x) {
                        text = errorElement.text;
                        element = errorElement;
                        break;
                    }
                }
            }
            else {
                text = inlineObj.element.text;
            }
            if (text === ' ') {
                inlineObj = insertPosition.currentWidget.getInline(this.documentHelper.selection.start.offset + 1, 0);
                text = inlineObj.element.text;
            }
        }
        return { 'text': text, 'element': element };
    };
    /**
     * Method to add error word in document error collection
     * @param text
     * @param element
     */
    SpellChecker.prototype.addErrorCollection = function (text, elementToCompare, suggestions) {
        text = this.manageSpecialCharacters(text, undefined, true);
        if (this.errorWordCollection.containsKey(text)) {
            var errorElements = this.errorWordCollection.get(text);
            if (elementToCompare instanceof ErrorTextElementBox) {
                if (!this.compareErrorTextElement(elementToCompare, errorElements)) {
                    errorElements.push(elementToCompare);
                }
            }
            else if (elementToCompare instanceof TextElementBox) {
                if (!this.compareTextElement(elementToCompare, errorElements)) {
                    errorElements.push(elementToCompare);
                }
            }
        }
        else {
            if (!isNullOrUndefined(suggestions) && suggestions.length > 0) {
                this.errorSuggestions.add(text, suggestions);
            }
            this.errorWordCollection.add(text, [elementToCompare]);
        }
    };
    /**
     * Method to compare error text elements
     * @param {ErrorTextElementBox} errorElement
     * @param {ElementBox[]} errorCollection
     */
    SpellChecker.prototype.compareErrorTextElement = function (errorElement, errorCollection) {
        var copyElement = [];
        var isChanged = false;
        for (var i = 0; i < errorCollection.length; i++) {
            copyElement.push(errorCollection[i]);
        }
        var length = errorCollection.length;
        for (var i = 0; i < length; i++) {
            if (copyElement[i] instanceof ErrorTextElementBox) {
                if (copyElement[i].ischangeDetected) {
                    var exactText = this.manageSpecialCharacters(copyElement[i].text, undefined, true);
                    isChanged = true;
                    // tslint:disable-next-line:max-line-length
                    this.removeErrorsFromCollection({ 'element': copyElement[i], 'text': exactText });
                }
                else {
                    var currentElement = copyElement[i];
                    // tslint:disable-next-line:max-line-length
                    if (errorElement.start.offset === currentElement.start.offset && errorElement.end.offset === currentElement.end.offset) {
                        return true;
                    }
                }
            }
        }
        if (isChanged) {
            // tslint:disable-next-line:max-line-length
            this.errorWordCollection.add(this.manageSpecialCharacters(errorElement.text, undefined, true), [errorElement]);
        }
        return false;
    };
    /**
     * Method to compare text elements
     * @param {TextElementBox} errorElement
     * @param {ElementBox[]} errorCollection
     * @private
     */
    SpellChecker.prototype.compareTextElement = function (errorElement, errorCollection) {
        for (var i = 0; i < errorCollection.length; i++) {
            if (errorCollection[i] instanceof TextElementBox) {
                var currentElement = errorCollection[i];
                if (currentElement === errorElement) {
                    return true;
                }
            }
        }
        return false;
    };
    /**
     * Method to handle Word by word spell check
     * @param {any} jsonObject
     *  @param {TextElementBox} elementBox
     * @param {number} left
     * @param {number} top
     * @param {number} underlineY
     * @param {BaselineAlignment} baselineAlignment
     * @param {boolean} isSamePage
     * @private
     */
    // tslint:disable-next-line:max-line-length
    SpellChecker.prototype.handleWordByWordSpellCheck = function (jsonObject, elementBox, left, top, underlineY, baselineAlignment, isSamePage) {
        if (jsonObject.HasSpellingError && isSamePage) {
            this.addErrorCollection(elementBox.text, elementBox, jsonObject.Suggestions);
            // tslint:disable-next-line:max-line-length
            var backgroundColor = (elementBox.line.paragraph.containerWidget instanceof TableCellWidget) ? elementBox.line.paragraph.containerWidget.cellFormat.shading.backgroundColor : this.documentHelper.backgroundColor;
            this.documentHelper.render.renderWavyline(elementBox, left, top, underlineY, '#FF0000', 'Single', baselineAlignment, backgroundColor);
            elementBox.isSpellChecked = true;
        }
        else {
            elementBox.isSpellChecked = true;
        }
    };
    /**
     * Method to check errors for combined elements
     * @param {TextElementBox} elementBox
     * @param {number} underlineY
     * @private
     */
    // tslint:disable-next-line:max-line-length
    SpellChecker.prototype.checkElementCanBeCombined = function (elementBox, underlineY, beforeIndex, callSpellChecker, textToCombine, isNext, isPrevious, canCombine) {
        var currentText = isNullOrUndefined(textToCombine) ? '' : textToCombine;
        var isCombined = isNullOrUndefined(canCombine) ? false : canCombine;
        var checkPrevious = !isNullOrUndefined(isPrevious) ? isPrevious : true;
        var checkNext = !isNullOrUndefined(isNext) ? isNext : true;
        var combinedElements = [];
        var line = this.documentHelper.selection.getLineWidget(elementBox, 0);
        var index = line.children.indexOf(elementBox);
        var prevText = elementBox.text;
        combinedElements.push(elementBox);
        var difference = (isPrevious) ? 0 : 1;
        var prevCombined = false;
        var isPrevField = false;
        if (elementBox.text !== '\v') {
            if (checkPrevious) {
                var textElement = undefined;
                for (var i = index - difference; i >= 0; i--) {
                    textElement = line.children[i];
                    if (textElement instanceof TextElementBox && !isPrevField) {
                        if (prevText.indexOf(' ') !== 0 && textElement.text.lastIndexOf(' ') !== textElement.text.length - 1) {
                            prevCombined = !isNullOrUndefined(textToCombine) ? true : false;
                            currentText = textElement.text + currentText;
                            prevText = textElement.text;
                            isPrevField = false;
                            combinedElements.push(textElement);
                            isCombined = true;
                        }
                        else if (!isNullOrUndefined(textElement)) {
                            textElement = textElement.nextElement;
                            break;
                        }
                    }
                    else if (textElement instanceof FieldElementBox && textElement.fieldType !== 1) {
                        isPrevField = true;
                    }
                }
                var currentElement = (isCombined) ? textElement : elementBox;
                if (this.lookThroughPreviousLine(currentText, prevText, currentElement, underlineY, beforeIndex)) {
                    return true;
                }
            }
            if (isPrevious) {
                currentText = (prevCombined) ? currentText : elementBox.text + currentText;
            }
            else {
                currentText += elementBox.text;
            }
            isPrevField = false;
            var nextText = elementBox.text;
            if (checkNext) {
                var canCombine_1 = false;
                var element = undefined;
                for (var i = index + 1; i < line.children.length; i++) {
                    element = line.children[i];
                    if (element instanceof TextElementBox && !isPrevField) {
                        if (nextText.lastIndexOf(' ') !== nextText.length - 1 && element.text.indexOf(' ') !== 0) {
                            currentText += element.text;
                            nextText = element.text;
                            isPrevField = false;
                            combinedElements.push(element);
                            canCombine_1 = true;
                            isCombined = true;
                        }
                        else if (!isNullOrUndefined(element)) {
                            element = element.previousElement;
                            break;
                        }
                    }
                    else if (element instanceof FieldElementBox && element.fieldType !== 2) {
                        isPrevField = true;
                    }
                }
                var currentElement = (canCombine_1) ? element : elementBox;
                // tslint:disable-next-line:max-line-length
                if (currentElement.text !== '\f' && this.lookThroughNextLine(currentText, prevText, currentElement, underlineY, beforeIndex)) {
                    return true;
                }
            }
        }
        if (isCombined && callSpellChecker && !this.checkCombinedElementsBeIgnored(combinedElements, currentText)) {
            this.handleCombinedElements(elementBox, currentText, underlineY, beforeIndex);
        }
        return isCombined;
    };
    // tslint:disable-next-line:max-line-length
    SpellChecker.prototype.lookThroughPreviousLine = function (currentText, prevText, currentElement, underlineY, beforeIndex) {
        // tslint:disable-next-line:max-line-length
        if (!isNullOrUndefined(currentElement) && currentElement.indexInOwner === 0 && !isNullOrUndefined(currentElement.line.previousLine)) {
            var previousLine = currentElement.line.previousLine;
            var index = previousLine.children.length - 1;
            if (!isNullOrUndefined(previousLine.children[index]) && previousLine.children[index] instanceof TextElementBox) {
                var firstElement = previousLine.children[index];
                if (currentElement.text.indexOf(' ') !== 0 && firstElement.text.lastIndexOf(' ') !== firstElement.text.length - 1) {
                    currentText = (currentText.length > 0) ? currentText : prevText;
                    this.checkElementCanBeCombined(firstElement, underlineY, beforeIndex, true, currentText, false, true, true);
                    return true;
                }
            }
        }
        return false;
    };
    // tslint:disable-next-line:max-line-length
    SpellChecker.prototype.lookThroughNextLine = function (currentText, prevText, elementBox, underlineY, beforeIndex) {
        // tslint:disable-next-line:max-line-length
        if (!isNullOrUndefined(elementBox) && elementBox.indexInOwner === elementBox.line.children.length - 1 && !isNullOrUndefined(elementBox.line.nextLine)) {
            var nextLine = elementBox.line.nextLine;
            if (!isNullOrUndefined(nextLine.children[0]) && nextLine.children[0] instanceof TextElementBox) {
                var firstElement = nextLine.children[0];
                if (elementBox.text.lastIndexOf(' ') !== elementBox.text.length - 1 && firstElement.text.indexOf(' ') !== 0) {
                    currentText = (currentText.length > 0) ? currentText : prevText;
                    this.checkElementCanBeCombined(firstElement, underlineY, beforeIndex, true, currentText, true, false, true);
                    return true;
                }
            }
        }
        return false;
    };
    /**
     * Method to handle combined elements
     * @param {TextElementBox} elementBox
     * @param {string} currentText
     * @param {number} underlineY
     * @param {number} beforeIndex
     * @private
     */
    SpellChecker.prototype.handleCombinedElements = function (elementBox, currentText, underlineY, beforeIndex) {
        elementBox.istextCombined = true;
        var splittedText = currentText.split(/[\s]+/);
        // tslint:disable-next-line:max-line-length
        if (this.ignoreAllItems.indexOf(currentText) === -1 && elementBox instanceof TextElementBox && elementBox.ignoreOnceItems.indexOf(currentText) === -1) {
            if (splittedText.length > 1) {
                for (var i = 0; i < splittedText.length; i++) {
                    var currentText_1 = splittedText[i];
                    currentText_1 = this.manageSpecialCharacters(currentText_1, undefined, true);
                    // tslint:disable-next-line:max-line-length
                    this.documentHelper.render.handleUnorderdElements(currentText_1, elementBox, underlineY, i, 0, i === splittedText.length - 1, beforeIndex);
                }
            }
            else {
                currentText = this.manageSpecialCharacters(currentText, undefined, true);
                this.documentHelper.render.handleUnorderdElements(currentText, elementBox, underlineY, 0, 0, true, beforeIndex);
            }
        }
    };
    /**
     * Method to check error element collection has unique element
     * @param {ErrorTextElementBox[]} errorCollection
     * @param {ErrorTextElementBox} elementToCheck
     * @private
     */
    SpellChecker.prototype.CheckArrayHasSameElement = function (errorCollection, elementToCheck) {
        for (var i = 0; i < errorCollection.length; i++) {
            var errorText = errorCollection[i];
            // tslint:disable-next-line:max-line-length
            if ((errorText.start.location.x === elementToCheck.start.location.x) && (errorText.start.location.y === elementToCheck.start.location.y)) {
                return true;
            }
        }
        return false;
    };
    /**
     * Method to handle splitted and combined words for spell check.
     * @param {any} jsonObject
     * @param {string} currentText
     * @param {ElementBox} elementBox
     * @param {boolean} isSamePage
     * @private
     */
    // tslint:disable-next-line:max-line-length
    SpellChecker.prototype.handleSplitWordSpellCheck = function (jsonObject, currentText, elementBox, isSamePage, underlineY, iteration, markIndex, isLastItem) {
        if (jsonObject.HasSpellingError && elementBox.text !== ' ' && isSamePage) {
            var matchResults = this.getMatchedResultsFromElement(elementBox, currentText);
            // tslint:disable-next-line:max-line-length
            markIndex = (elementBox.istextCombined) ? elementBox.line.getOffset(this.getCombinedElement(elementBox), 0) : markIndex;
            // tslint:disable-next-line:max-line-length
            this.documentHelper.owner.searchModule.textSearch.updateMatchedTextLocation(matchResults.matches, matchResults.textResults, matchResults.elementInfo, 0, elementBox, false, null, markIndex);
            this.handleMatchedResults(matchResults.textResults, elementBox, underlineY, iteration, jsonObject.Suggestions, isLastItem);
        }
        else if (isLastItem) {
            elementBox.isSpellChecked = true;
        }
    };
    /**
     * Method to include matched results in element box and to render it
     * @param {TextSearchResults} results
     * @param {TextElementBox} elementBox
     * @param {number} wavyLineY
     * @param {number} index
     */
    // tslint:disable-next-line:max-line-length
    SpellChecker.prototype.handleMatchedResults = function (results, elementBox, wavyLineY, index, suggestions, isLastItem) {
        if (results.length === 0 && isLastItem) {
            elementBox.isSpellChecked = true;
            return;
        }
        for (var i = 0; i < results.length; i++) {
            var span = this.createErrorElementWithInfo(results.innerList[i], elementBox);
            var color = '#FF0000';
            // tslint:disable-next-line:max-line-length
            if (!isNullOrUndefined(elementBox.errorCollection) && !this.CheckArrayHasSameElement(elementBox.errorCollection, span)) {
                elementBox.errorCollection.splice(index, 0, span);
            }
            this.addErrorCollection(span.text, span, suggestions);
            // tslint:disable-next-line:max-line-length
            var backgroundColor = (elementBox.line.paragraph.containerWidget instanceof TableCellWidget) ? elementBox.paragraph.containerWidget.cellFormat.shading.backgroundColor : this.documentHelper.backgroundColor;
            this.documentHelper.render.renderWavyline(span, span.start.location.x, span.start.location.y - elementBox.margin.top, wavyLineY, color, 'Single', elementBox.characterFormat.baselineAlignment, backgroundColor);
            if (isLastItem) {
                elementBox.isSpellChecked = true;
            }
        }
    };
    /**
     * Calls the spell checker service
     * @param {number} languageID
     * @param {string} word
     * @param {boolean} checkSpellingAndSuggestion
     * @param {boolean} addWord
     * @private
     */
    /* tslint:disable:no-any */
    // tslint:disable-next-line:max-line-length
    SpellChecker.prototype.CallSpellChecker = function (languageID, word, checkSpelling, checkSuggestion, addWord, isByPage) {
        var _this = this;
        var spellchecker = this;
        return new Promise(function (resolve, reject) {
            if (!isNullOrUndefined(_this)) {
                var httpRequest_1 = new XMLHttpRequest();
                // tslint:disable-next-line:max-line-length
                var service_1 = _this.documentHelper.owner.serviceUrl + _this.documentHelper.owner.serverActionSettings.spellCheck;
                service_1 = (isByPage) ? service_1 + 'ByPage' : service_1;
                httpRequest_1.open('POST', service_1, true);
                httpRequest_1.setRequestHeader('Content-Type', 'application/json');
                _this.setCustomHeaders(httpRequest_1);
                // tslint:disable-next-line:max-line-length
                /* tslint:disable:no-any */
                var spellCheckData = { LanguageID: languageID, TexttoCheck: word, CheckSpelling: checkSpelling, CheckSuggestion: checkSuggestion, AddWord: addWord };
                httpRequest_1.send(JSON.stringify(spellCheckData));
                httpRequest_1.onreadystatechange = function () {
                    if (httpRequest_1.readyState === 4) {
                        if (httpRequest_1.status === 200 || httpRequest_1.status === 304) {
                            resolve(httpRequest_1.response);
                        }
                        else {
                            var result = {
                                name: 'onFailure',
                                status: httpRequest_1.status,
                                statusText: httpRequest_1.responseText,
                                url: service_1
                            };
                            spellchecker.documentHelper.owner.fireServiceFailure(result);
                            reject(httpRequest_1.response);
                        }
                    }
                };
            }
        });
    };
    SpellChecker.prototype.setCustomHeaders = function (httpRequest) {
        for (var i = 0; i < this.documentHelper.owner.headers.length; i++) {
            var header = this.documentHelper.owner.headers[i];
            for (var _i = 0, _a = Object.keys(header); _i < _a.length; _i++) {
                var key = _a[_i];
                httpRequest.setRequestHeader(key, header[key]);
            }
        }
    };
    /**
     * Method to check for next error
     * @private
     */
    SpellChecker.prototype.checkForNextError = function () {
        if (!isNullOrUndefined(this.viewer)) {
            var errorWords = this.errorWordCollection;
            if (errorWords.length > 0) {
                for (var i = 0; i < errorWords.length; i++) {
                    var errorElements = errorWords.get(errorWords.keys[i]);
                    for (var j = 0; j < errorElements.length; j++) {
                        if (errorElements[j] instanceof ErrorTextElementBox && !errorElements[j].ischangeDetected) {
                            this.updateErrorElementTextBox(errorWords.keys[i], errorElements[j]);
                        }
                        else if (errorElements[j] instanceof TextElementBox) {
                            var matchResults = this.getMatchedResultsFromElement(errorElements[j]);
                            var results = matchResults.textResults;
                            // tslint:disable-next-line:max-line-length
                            var markIndex = (errorElements[j].ischangeDetected) ? errorElements[j].start.offset : errorElements[j].line.getOffset(errorElements[j], 0);
                            // tslint:disable-next-line:max-line-length
                            this.documentHelper.owner.searchModule.textSearch.updateMatchedTextLocation(matchResults.matches, results, matchResults.elementInfo, 0, errorElements[j], false, null, markIndex);
                            for (var i_1 = 0; i_1 < results.length; i_1++) {
                                var element = this.createErrorElementWithInfo(results.innerList[i_1], errorElements[j]);
                                this.updateErrorElementTextBox(element.text, element);
                                break;
                            }
                        }
                        break;
                    }
                    break;
                }
            }
            else {
                this.documentHelper.clearSelectionHighlight();
            }
        }
    };
    /**
     * Method to create error element with matched results
     * @param {TextSearchResult} result
     * @param {ElementBox} errorElement
     * @private
     */
    SpellChecker.prototype.createErrorElementWithInfo = function (result, errorElement) {
        var element = new ErrorTextElementBox();
        element.text = result.text;
        element.start = result.start;
        element.end = result.end;
        element.height = errorElement.height;
        element.canTrigger = errorElement.canTrigger;
        element.characterFormat.copyFormat(errorElement.characterFormat);
        element.width = this.documentHelper.textHelper.getWidth(element.text, errorElement.characterFormat);
        return element;
    };
    /**
     * Method to get matched results from element box
     * @param {ElementBox} errorElement
     * @private
     */
    SpellChecker.prototype.getMatchedResultsFromElement = function (errorElement, currentText) {
        var line = errorElement.line;
        // tslint:disable-next-line:max-line-length
        var pattern = this.documentHelper.owner.searchModule.textSearch.stringToRegex((isNullOrUndefined(currentText)) ? errorElement.text : currentText, 'CaseSensitive');
        this.textSearchResults.clearResults();
        var results = this.textSearchResults;
        var textLineInfo = this.documentHelper.owner.searchModule.textSearch.getElementInfo(line.children[0], 0, false);
        var text = textLineInfo.fullText;
        var matches = [];
        var spans = textLineInfo.elementsWithOffset;
        var matchObject;
        //tslint:disable no-conditional-assignment
        while (!isNullOrUndefined(matchObject = pattern.exec(text))) {
            matches.push(matchObject);
        }
        return { 'matches': matches, 'elementInfo': spans, 'textResults': results };
    };
    /**
     * Method to update error element information
     * @param {string} error
     * @param {ErrorTextElementBox} errorElement
     * @private
     */
    SpellChecker.prototype.updateErrorElementTextBox = function (error, errorElement) {
        var element = errorElement;
        this.documentHelper.clearSelectionHighlight();
        this.documentHelper.selection.start = element.start;
        this.documentHelper.selection.end = element.end;
        this.documentHelper.selection.highlight(errorElement.start.paragraph, errorElement.start, errorElement.end);
        this.documentHelper.owner.spellCheckDialog.updateSuggestionDialog(error, element);
    };
    /**
     * Method to retrieve space information in a text
     * @param {string} text
     * @param {WCharacterFormat} characterFormat
     * @private
     */
    SpellChecker.prototype.getWhiteSpaceCharacterInfo = function (text, characterFormat) {
        /* tslint:disable:no-any */
        var matchedText = [];
        var width = 0;
        var length = 0;
        matchedText = text.match(/[\s]+/);
        if (!isNullOrUndefined(matchedText) && matchedText.length > 0) {
            for (var i = 0; i < matchedText.length; i++) {
                width += this.documentHelper.textHelper.getWidth(matchedText[i], characterFormat);
                length += matchedText[i].length;
            }
        }
        return { 'width': width, 'wordLength': length, 'isBeginning': (!isNullOrUndefined(matchedText) && matchedText.index === 0) };
    };
    /**
     * Retrieve Special character info
     * @param {string} text
     * @param {WCharacterFormat} characterFormat
     * @private
     */
    SpellChecker.prototype.getSpecialCharactersInfo = function (text, characterFormat) {
        /* tslint:disable:no-any */
        var matchedText = [];
        var beginingwidth = 0;
        var endWidth = 0;
        var length = 0;
        matchedText = text.match(/^[\#\@\!\~\$\%\^\&\*\(\)\-\_\+\=\{\}\[\]\:\;\"\'\,\<\.\>\/\?\`]*/);
        for (var i = 0; i < matchedText.length; i++) {
            if (!isNullOrUndefined(matchedText[i]) && matchedText[i].length > 0) {
                beginingwidth = this.documentHelper.textHelper.getWidth(matchedText[i], characterFormat);
            }
            length = matchedText.length;
        }
        matchedText = text.match(/[\#\@\!\~\$\%\^\&\*\(\)\-\_\+\=\{\}\[\]\:\;\"\'\,\<\.\>\/\?\`]*$/);
        for (var i = 0; i < matchedText.length; i++) {
            if (!isNullOrUndefined(matchedText[i]) && matchedText[i].length > 0) {
                endWidth = this.documentHelper.textHelper.getWidth(matchedText[i], characterFormat);
            }
            length = matchedText.length;
        }
        return { 'beginningWidth': beginingwidth, 'endWidth': endWidth, 'wordLength': length };
    };
    /**
     * Method to retrieve next available combined element
     * @param {ElementBox} element
     * @private
     */
    SpellChecker.prototype.getCombinedElement = function (element) {
        var prevElement = element;
        while (!isNullOrUndefined(element) && element instanceof TextElementBox && element.istextCombined) {
            prevElement = element;
            element = element.previousElement;
        }
        return prevElement;
    };
    /**
     * Method to retrieve next available combined element
     * @param {ElementBox} element
     */
    SpellChecker.prototype.checkCombinedElementsBeIgnored = function (elements, exactText) {
        exactText = this.manageSpecialCharacters(exactText, undefined, true);
        for (var i = 0; i < elements.length; i++) {
            if (elements[i].ignoreOnceItems.indexOf(exactText) !== -1) {
                return true;
            }
        }
        return false;
    };
    /**
     * Method to update error collection
     * @param {TextElementBox} currentElement
     * @param {TextElementBox} splittedElement
     * @private
     */
    SpellChecker.prototype.updateSplittedElementError = function (currentElement, splittedElement) {
        var errorCount = currentElement.errorCollection.length;
        if (errorCount > 0) {
            var errorCollection = [];
            for (var i = 0; i < errorCount; i++) {
                errorCollection.push(currentElement.errorCollection[i]);
            }
            for (var i = 0; i < errorCount; i++) {
                if (currentElement.text.indexOf(errorCollection[i].text) === -1) {
                    splittedElement.ischangeDetected = true;
                    currentElement.errorCollection.splice(0, 1);
                }
            }
        }
    };
    /**
     * @private
     */
    SpellChecker.prototype.getPageContent = function (page) {
        var content = '';
        if (this.documentHelper.owner.sfdtExportModule) {
            var sfdtExport = this.documentHelper.owner.sfdtExportModule;
            sfdtExport.Initialize();
            var document_1 = sfdtExport.writePage(page);
            if (this.documentHelper.owner.textExportModule) {
                var textExport = this.documentHelper.owner.textExportModule;
                textExport.pageContent = '';
                textExport.setDocument(document_1);
                textExport.writeInternal();
                content = textExport.pageContent;
            }
        }
        return content;
    };
    /**
     * @private
     * @param spelledWords
     */
    SpellChecker.prototype.updateUniqueWords = function (spelledWords) {
        if (!isNullOrUndefined(localStorage.getItem(this.uniqueKey))) {
            this.uniqueSpelledWords = JSON.parse(localStorage.getItem(this.uniqueKey));
        }
        var totalCount = spelledWords.length + this.uniqueSpelledWords.length;
        if (totalCount <= this.uniqueWordsCount) {
            for (var i = 0; i < spelledWords.length; i++) {
                this.checkForUniqueWords(spelledWords[i]);
            }
        }
        localStorage.setItem(this.uniqueKey, JSON.stringify(this.uniqueSpelledWords));
        this.uniqueSpelledWords = [];
    };
    SpellChecker.prototype.checkForUniqueWords = function (spellData) {
        var identityMatched = false;
        for (var i = 0; i < this.uniqueSpelledWords.length; i++) {
            if (this.uniqueSpelledWords[i].Text === spellData.Text) {
                identityMatched = true;
                break;
            }
        }
        if (!identityMatched) {
            this.uniqueSpelledWords.push(spellData);
        }
    };
    /**
     * Method to clear cached words for spell check
     */
    SpellChecker.prototype.clearCache = function () {
        if (!isNullOrUndefined(localStorage.getItem(this.uniqueKey))) {
            localStorage.removeItem(this.uniqueKey);
        }
    };
    /**
     * Method to create GUID
     */
    SpellChecker.prototype.createGuid = function () {
        var dateTime = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (char) {
            var randNo = (dateTime + Math.random() * 16) % 16 | 0;
            dateTime = Math.floor(dateTime / 16);
            return (char === 'x' ? randNo : (randNo & 0x3 | 0x8)).toString(16);
        });
        return uuid;
    };
    /**
     * Check spelling in page data
     * @private
     * @param {string} wordToCheck
     */
    SpellChecker.prototype.checkSpellingInPageInfo = function (wordToCheck) {
        var hasError = false;
        var elementPresent = false;
        /* tslint:disable:no-any */
        var uniqueWords = JSON.parse(localStorage.getItem(this.documentHelper.owner.spellChecker.uniqueKey));
        if (!isNullOrUndefined(uniqueWords)) {
            for (var i = 0; i < uniqueWords.length; i++) {
                if (uniqueWords[i].Text === wordToCheck) {
                    return { hasSpellError: uniqueWords[i].HasSpellError, isElementPresent: true };
                }
            }
        }
        return { hasSpellError: hasError, isElementPresent: elementPresent };
    };
    /**
     * @private
     */
    SpellChecker.prototype.destroy = function () {
        this.errorWordCollection = undefined;
        this.ignoreAllItems = undefined;
        this.errorSuggestions = undefined;
        this.uniqueSpelledWords = [];
        this.textSearchResults = undefined;
        if (!isNullOrUndefined(localStorage.getItem(this.uniqueKey))) {
            localStorage.removeItem(this.uniqueKey);
        }
    };
    return SpellChecker;
}());
export { SpellChecker };

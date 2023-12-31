import { LayoutViewer, ContextElementInfo, ElementInfo, ErrorInfo, WCharacterFormat, SpecialCharacterInfo, SpaceCharacterInfo, TextSearchResult, MatchResults, WordSpellInfo } from '../index';
import { Dictionary } from '../../base/dictionary';
import { ElementBox, TextElementBox, ErrorTextElementBox, Page } from '../viewer/page';
import { BaselineAlignment } from '../../base/types';
import { DocumentHelper } from '../viewer';
/**
 * The spell checker module
 */
export declare class SpellChecker {
    private langIDInternal;
    /**
     * Specifies whether spell check has to be performed or not.
     */
    enableSpellCheck: boolean;
    /**
     * @private
     */
    uniqueSpelledWords: any[];
    private spellSuggestionInternal;
    /**
     * @private
     */
    errorWordCollection: Dictionary<string, ElementBox[]>;
    /**
     * @private
     */
    ignoreAllItems: string[];
    /**
     * @private
     */
    documentHelper: DocumentHelper;
    /**
     * @private
     */
    currentContextInfo: ContextElementInfo;
    /**
     * @private
     */
    uniqueKey: string;
    private removeUnderlineInternal;
    private spellCheckSuggestion;
    /**
     * @default 1000
     */
    private uniqueWordsCountInternal;
    /**
     * @private
     */
    errorSuggestions: Dictionary<string, string[]>;
    private performOptimizedCheck;
    private textSearchResults;
    /**
     * Gets module name.
     */
    private getModuleName;
    /**
     * Gets the boolean indicating whether optimized spell check to be performed.
     * @aspType bool
     * @blazorType bool
     */
    /**
    * Sets the boolean indicating whether optimized spell check to be performed.
    * @aspType bool
    * @blazorType bool
    */
    enableOptimizedSpellCheck: boolean;
    /**
     * Gets the spell checked Unique words.
     * @aspType int
     * @blazorType int
     */
    /**
    * Sets the spell checked Unique words.
    * @aspType int
    * @blazorType int
    */
    uniqueWordsCount: number;
    /**
     * Gets the languageID.
     * @aspType int
     * @blazorType int
     */
    /**
    * Sets the languageID.
    * @aspType int
    * @blazorType int
    */
    languageID: number;
    /**
     * Getter indicates whether suggestion enabled.
     * @aspType bool
     * @blazorType bool
     */
    /**
    * Setter to enable or disable suggestion
    * @aspType bool
    * @blazorType bool
    */
    allowSpellCheckAndSuggestion: boolean;
    /**
     * Getter indicates whether underline removed for mis-spelled word.
     * @aspType bool
     * @blazorType bool
     */
    /**
    * Setter to enable or disable underline for mis-spelled word
    * @aspType bool
    * @blazorType bool
    */
    removeUnderline: boolean;
    /**
     *
     */
    constructor(documentHelper: DocumentHelper);
    readonly viewer: LayoutViewer;
    /**
     * Method to manage replace logic
     * @private
     */
    manageReplace(content: string, dialogElement?: ElementBox): void;
    /**
     * Method to handle replace logic
     * @param {string} content
     * @private
     */
    handleReplace(content: string): void;
    /**
     * Method to retrieve exact element info
     * @param {ElementInfo} startInlineObj
     * @private
     */
    retrieveExactElementInfo(startInlineObj: ElementInfo): void;
    /**
     * Method to handle to ignore error Once
     * @param {ElementInfo} startInlineObj
     * @private
     */
    handleIgnoreOnce(startInlineObj: ElementInfo): void;
    /**
     * Method to handle ignore all items
     * @private
     */
    handleIgnoreAllItems(contextElement?: ContextElementInfo): void;
    /**
     * Method to handle dictionary
     * @private
     */
    handleAddToDictionary(contextElement?: ContextElementInfo): void;
    /**
     * Method to append/remove special characters
     * @param {string} exactText
     * @param {boolean} isRemove
     * @private
     */
    manageSpecialCharacters(exactText: string, replaceText: string, isRemove?: boolean): string;
    /**
     * Method to remove errors
     * @param {ContextElementInfo} contextItem
     * @private
     */
    removeErrorsFromCollection(contextItem: ContextElementInfo): void;
    /**
     * Method to retrieve exact text
     * @private
     */
    retriveText(): ContextElementInfo;
    /**
     * Method to handle suggestions
     * @param {any} jsonObject
     * @param {PointerEvent} event
     * @private
     */
    handleSuggestions(allsuggestions: any): string[];
    /**
     * Method to check whether text element has errors
     * @param {string} text
     * @param {any} element
     * @param {number} left
     * @private
     */
    checktextElementHasErrors(text: string, element: any, left: number): ErrorInfo;
    /**
     * Method to update status for error elements
     * @param {ErrorTextElementBox[]} erroElements
     */
    private updateStatusForGlobalErrors;
    /**
     * Method to handle document error collection.
     * @param {string} errorInElement
     * @private
     */
    handleErrorCollection(errorInElement: TextElementBox): boolean;
    /**
     * Method to construct inline menu
     */
    private constructInlineMenu;
    /**
     * Method to retrieve error element text
     * @private
     */
    findCurretText(): ContextElementInfo;
    /**
     * Method to add error word in document error collection
     * @param text
     * @param element
     */
    private addErrorCollection;
    /**
     * Method to compare error text elements
     * @param {ErrorTextElementBox} errorElement
     * @param {ElementBox[]} errorCollection
     */
    private compareErrorTextElement;
    /**
     * Method to compare text elements
     * @param {TextElementBox} errorElement
     * @param {ElementBox[]} errorCollection
     * @private
     */
    compareTextElement(errorElement: TextElementBox, errorCollection: ElementBox[]): boolean;
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
    handleWordByWordSpellCheck(jsonObject: any, elementBox: TextElementBox, left: number, top: number, underlineY: number, baselineAlignment: BaselineAlignment, isSamePage: boolean): void;
    /**
     * Method to check errors for combined elements
     * @param {TextElementBox} elementBox
     * @param {number} underlineY
     * @private
     */
    checkElementCanBeCombined(elementBox: TextElementBox, underlineY: number, beforeIndex: number, callSpellChecker: boolean, textToCombine?: string, isNext?: boolean, isPrevious?: boolean, canCombine?: boolean): boolean;
    private lookThroughPreviousLine;
    private lookThroughNextLine;
    /**
     * Method to handle combined elements
     * @param {TextElementBox} elementBox
     * @param {string} currentText
     * @param {number} underlineY
     * @param {number} beforeIndex
     * @private
     */
    handleCombinedElements(elementBox: TextElementBox, currentText: string, underlineY: number, beforeIndex: number): void;
    /**
     * Method to check error element collection has unique element
     * @param {ErrorTextElementBox[]} errorCollection
     * @param {ErrorTextElementBox} elementToCheck
     * @private
     */
    CheckArrayHasSameElement(errorCollection: ErrorTextElementBox[], elementToCheck: ErrorTextElementBox): boolean;
    /**
     * Method to handle splitted and combined words for spell check.
     * @param {any} jsonObject
     * @param {string} currentText
     * @param {ElementBox} elementBox
     * @param {boolean} isSamePage
     * @private
     */
    handleSplitWordSpellCheck(jsonObject: any, currentText: string, elementBox: TextElementBox, isSamePage: boolean, underlineY: number, iteration: number, markIndex: number, isLastItem?: boolean): void;
    /**
     * Method to include matched results in element box and to render it
     * @param {TextSearchResults} results
     * @param {TextElementBox} elementBox
     * @param {number} wavyLineY
     * @param {number} index
     */
    private handleMatchedResults;
    /**
     * Calls the spell checker service
     * @param {number} languageID
     * @param {string} word
     * @param {boolean} checkSpellingAndSuggestion
     * @param {boolean} addWord
     * @private
     */
    CallSpellChecker(languageID: number, word: string, checkSpelling: boolean, checkSuggestion: boolean, addWord?: boolean, isByPage?: boolean): Promise<any>;
    private setCustomHeaders;
    /**
     * Method to check for next error
     * @private
     */
    checkForNextError(): void;
    /**
     * Method to create error element with matched results
     * @param {TextSearchResult} result
     * @param {ElementBox} errorElement
     * @private
     */
    createErrorElementWithInfo(result: TextSearchResult, errorElement: ElementBox): ErrorTextElementBox;
    /**
     * Method to get matched results from element box
     * @param {ElementBox} errorElement
     * @private
     */
    getMatchedResultsFromElement(errorElement: ElementBox, currentText?: string): MatchResults;
    /**
     * Method to update error element information
     * @param {string} error
     * @param {ErrorTextElementBox} errorElement
     * @private
     */
    updateErrorElementTextBox(error: string, errorElement: ErrorTextElementBox): void;
    /**
     * Method to retrieve space information in a text
     * @param {string} text
     * @param {WCharacterFormat} characterFormat
     * @private
     */
    getWhiteSpaceCharacterInfo(text: string, characterFormat: WCharacterFormat): SpaceCharacterInfo;
    /**
     * Retrieve Special character info
     * @param {string} text
     * @param {WCharacterFormat} characterFormat
     * @private
     */
    getSpecialCharactersInfo(text: string, characterFormat: WCharacterFormat): SpecialCharacterInfo;
    /**
     * Method to retrieve next available combined element
     * @param {ElementBox} element
     * @private
     */
    getCombinedElement(element: ElementBox): ElementBox;
    /**
     * Method to retrieve next available combined element
     * @param {ElementBox} element
     */
    private checkCombinedElementsBeIgnored;
    /**
     * Method to update error collection
     * @param {TextElementBox} currentElement
     * @param {TextElementBox} splittedElement
     * @private
     */
    updateSplittedElementError(currentElement: TextElementBox, splittedElement: TextElementBox): void;
    /**
     * @private
     */
    getPageContent(page: Page): string;
    /**
     * @private
     * @param spelledWords
     */
    updateUniqueWords(spelledWords: any[]): void;
    private checkForUniqueWords;
    /**
     * Method to clear cached words for spell check
     */
    clearCache(): void;
    /**
     * Method to create GUID
     */
    private createGuid;
    /**
     * Check spelling in page data
     * @private
     * @param {string} wordToCheck
     */
    checkSpellingInPageInfo(wordToCheck: string): WordSpellInfo;
    /**
     * @private
     */
    destroy(): void;
}

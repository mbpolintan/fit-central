/**
 * Is formatted or not.
 * @hidden

 */
var IsFormatted = /** @class */ (function () {
    function IsFormatted() {
    }
    /**
     * getFormattedNode method
     * @hidden

     */
    IsFormatted.prototype.getFormattedNode = function (node, format, endNode) {
        var parentNode = this.getFormatParent(node, format, endNode);
        if (parentNode !== null && parentNode !== endNode) {
            return parentNode;
        }
        return null;
    };
    IsFormatted.prototype.getFormatParent = function (node, format, endNode) {
        do {
            node = node.parentNode;
        } while (node && (node !== endNode) && !this.isFormattedNode(node, format));
        return node;
    };
    IsFormatted.prototype.isFormattedNode = function (node, format) {
        switch (format) {
            case 'bold':
                return IsFormatted.isBold(node);
            case 'italic':
                return IsFormatted.isItalic(node);
            case 'underline':
                return IsFormatted.isUnderline(node);
            case 'strikethrough':
                return IsFormatted.isStrikethrough(node);
            case 'superscript':
                return IsFormatted.isSuperscript(node);
            case 'subscript':
                return IsFormatted.isSubscript(node);
            case 'fontcolor':
                return this.isFontColor(node);
            case 'fontname':
                return this.isFontName(node);
            case 'fontsize':
                return this.isFontSize(node);
            case 'backgroundcolor':
                return this.isBackgroundColor(node);
            default:
                return false;
        }
    };
    /**
     * isBold method
     * @hidden

     */
    IsFormatted.isBold = function (node) {
        var validTags = ['strong', 'b'];
        if (validTags.indexOf(node.nodeName.toLowerCase()) !== -1) {
            return true;
        }
        else if (this.inlineTags.indexOf(node.nodeName.toLowerCase()) !== -1 &&
            node.style && node.style.fontWeight === 'bold') {
            return true;
        }
        else {
            return false;
        }
    };
    /**
     * isItalic method
     * @hidden

     */
    IsFormatted.isItalic = function (node) {
        var validTags = ['em', 'i'];
        if (validTags.indexOf(node.nodeName.toLowerCase()) !== -1) {
            return true;
        }
        else if (this.inlineTags.indexOf(node.nodeName.toLowerCase()) !== -1 &&
            node.style && node.style.fontStyle === 'italic') {
            return true;
        }
        else {
            return false;
        }
    };
    /**
     * isUnderline method
     * @hidden

     */
    IsFormatted.isUnderline = function (node) {
        var validTags = ['u'];
        if (validTags.indexOf(node.nodeName.toLowerCase()) !== -1) {
            return true;
        }
        else if (this.inlineTags.indexOf(node.nodeName.toLowerCase()) !== -1 &&
            node.style && node.style.textDecoration === 'underline') {
            return true;
        }
        else {
            return false;
        }
    };
    /**
     * isStrikethrough method
     * @hidden

     */
    IsFormatted.isStrikethrough = function (node) {
        var validTags = ['del', 'strike'];
        if (validTags.indexOf(node.nodeName.toLowerCase()) !== -1) {
            return true;
        }
        else if (this.inlineTags.indexOf(node.nodeName.toLowerCase()) !== -1 &&
            node.style && node.style.textDecoration === 'line-through') {
            return true;
        }
        else {
            return false;
        }
    };
    /**
     * isSuperscript method
     * @hidden

     */
    IsFormatted.isSuperscript = function (node) {
        var validTags = ['sup'];
        if (validTags.indexOf(node.nodeName.toLowerCase()) !== -1) {
            return true;
        }
        else {
            return false;
        }
    };
    /**
     * isSubscript method
     * @hidden

     */
    IsFormatted.isSubscript = function (node) {
        var validTags = ['sub'];
        if (validTags.indexOf(node.nodeName.toLowerCase()) !== -1) {
            return true;
        }
        else {
            return false;
        }
    };
    IsFormatted.prototype.isFontColor = function (node) {
        var color = node.style && node.style.color;
        if (IsFormatted.inlineTags.indexOf(node.nodeName.toLowerCase()) !== -1 &&
            color !== null && color !== '' && color !== undefined) {
            return true;
        }
        else {
            return false;
        }
    };
    IsFormatted.prototype.isBackgroundColor = function (node) {
        var backColor = node.style && node.style.backgroundColor;
        if (IsFormatted.inlineTags.indexOf(node.nodeName.toLowerCase()) !== -1 &&
            backColor !== null && backColor !== '' && backColor !== undefined) {
            return true;
        }
        else {
            return false;
        }
    };
    IsFormatted.prototype.isFontSize = function (node) {
        var size = node.style && node.style.fontSize;
        if (IsFormatted.inlineTags.indexOf(node.nodeName.toLowerCase()) !== -1 &&
            size !== null && size !== '' && size !== undefined) {
            return true;
        }
        else {
            return false;
        }
    };
    IsFormatted.prototype.isFontName = function (node) {
        var name = node.style && node.style.fontFamily;
        if (IsFormatted.inlineTags.indexOf(node.nodeName.toLowerCase()) !== -1 &&
            name !== null && name !== '' && name !== undefined) {
            return true;
        }
        else {
            return false;
        }
    };
    // Get Formatted Node
    IsFormatted.inlineTags = [
        'a',
        'abbr',
        'acronym',
        'b',
        'bdo',
        'big',
        'cite',
        'code',
        'dfn',
        'em',
        'i',
        'kbd',
        'label',
        'q',
        'samp',
        'small',
        'span',
        'strong',
        'sub',
        'sup',
        'tt',
        'u',
        'var'
    ];
    return IsFormatted;
}());
export { IsFormatted };

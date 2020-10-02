// IMPORTANT - adding imports here can create problems for Base class

/**
 * @module Core/helper/StringHelper
 */

const
    camelLettersRe      = /([a-z])([A-Z])/g,
    escapeRegExpRe      = /[.*+?^${}()|[\]\\]/g, // same as NPM escape-string-regexp
    idRe                = /(^[^a-z]+|[^\w]+)/gi,
    whiteSpaceRe        = /\s+/,
    replaceCamelLetters = (all, g1, g2) => {
        return g1 + '-' + g2.toLowerCase();
    },
    replaceNonIdChar    = c => {
        if (c) {
            return `_x${c.charCodeAt(0).toString(16)}`;
        }
        return '__blank__';
    },
    hyphenateCache      = {};

/**
 * Helper for string manipulation.
 */
export default class StringHelper {
    /**
     * Capitalizes the first letter of a string, myString -> MyString.
     * @param {String} string The string to capitalize
     * @returns {String} The capitalized string or the value of `string` if falsy.
     */
    static capitalize(string) {
        return string && (string[0].toUpperCase() + string.substr(1));
    }

    /**
     * Capitalizes the first letter of a string, myString -> MyString.
     * If the parameter is falsy, `null` is returned.
     * @param {String} string The string to capitalize
     * @returns {String} The capitalized string or `null` if `string` is falsy.
     * @deprecated Use {@link #function-capitalize} instead.
     */
    static capitalizeFirstLetter(string) {
        if (!string) return null;
        return string[0].toUpperCase() + string.substr(1);
    }

    /**
     * Makes the first letter of a string lowercase, MyString -> myString.
     * If the parameter is falsy, `null` is returned.
     * @param {String} string The string to lowercase.
     * @returns {String} The lowercased string or `null` if `string` is falsy.
     * @deprecated Use {@link #function-uncapitalize} instead.
     */
    static lowercaseFirstLetter(string) {
        if (!string) return null;
        return string[0].toLowerCase() + string.substr(1);
    }

    /**
     * Makes the first letter of a string lowercase, MyString -> myString.
     * @param {String} string The string to un-capitalize.
     * @returns {String} The un-capitalized string or the value of `string` if falsy.
     */
    static uncapitalize(string) {
        return string && (string[0].toLowerCase() + string.substr(1));
    }

    /**
     * Converts the passed camelCased string to a hyphen-separated string. eg "minWidth" -> "min-width"
     * @param string The string to convert.
     * @return {String} The string with adjoining lower and upper case letters
     * separated by hyphens and converted to lower case.
     */
    static hyphenate(string) {
        // Cached since it is used heavily with DomHelper.sync()
        const cached = hyphenateCache[string];
        if (cached) {
            return cached;
        }
        return hyphenateCache[string] = string.replace(camelLettersRe, replaceCamelLetters);
    }

    /**
     * Parses JSON within a try-catch.
     * @param {String} string String to parse
     * @returns {Object} Resulting object or null if parse failed
     */
    static safeJsonParse(string) {
        let parsed = null;

        try {
            parsed = JSON.parse(string);
        }
        catch (e) {
            console.error(e);
        }

        return parsed;
    }

    /**
     * Stringifies an object within a try-catch.
     * @param {Object} object The object to stringify
     * @returns {Object} Resulting object or null if stringify failed
     */
    static safeJsonStringify(obj) {
        let result = null;

        try {
            result = JSON.stringify(obj);
        }
        catch (e) {
            console.error(e);
        }

        return result;
    }

    /**
     * Creates an alphanuneric identifier from any passed string. Encodes spaces and non-alpha characters.
     * @param inString The string from which to strip non-identifier characters.
     * @return {String}
     */
    static createId(inString) {
        return String(inString).replace(idRe, replaceNonIdChar);
    }

    // https://stackoverflow.com/questions/3446170/escape-string-for-use-in-javascript-regex
    static escapeRegExp(string, flags) {
        // $& means the whole matched string
        let ret = string.replace(escapeRegExpRe, '\\$&');

        if (flags !== undefined) {
            ret = new RegExp(ret, flags);
        }

        return ret;
    }

    /**
     * Joins all given paths together using the separator as a delimiter and normalizes the resulting path.
     * @param paths {Array} array of paths to join
     * @param pathSeparator [{String}] path separator. Default value is '/'
     * @return {String}
     */
    static joinPaths(paths, pathSeparator = '/') {
        return paths.join(pathSeparator).replace(new RegExp('\\' + pathSeparator + '+', 'g'), pathSeparator);
    }

    /**
     * Returns the provided string split on whitespace. If the string is empty or consists of only whitespace, the
     * returned array will be empty. If `str` is not a string, it is simply returned. This allows `null` or already
     * split strings (arrays) to be passed through.
     *
     * For example:
     * ```
     *  console.log(StringHelper.split(' abc def xyz   '));
     *  > ['abc', 'def', 'xyz']
     *  console.log(StringHelper.split(''));
     *  > []
     * ```
     * Compare to the standard `split()` method:
     * ```
     *  console.log(' abc def xyz   '.split(/\s+/));
     *  > ['', 'abc', 'def', 'xyz', '']
     *  console.log(''.split(/\s+/));
     *  > ['']
     * ```
     * @param {String} str
     * @param {String|RegExp} delimiter
     * @returns {String[]}
     */
    static split(str, delimiter = whiteSpaceRe) {
        let ret = str;

        if (typeof ret === 'string') {
            ret = str.trim();  // w/o trim() whitespace on the ends will give us '' in the array
            ret = ret ? ret.split(delimiter) : []; // also ''.split() = ['']
        }

        return ret;
    }
}

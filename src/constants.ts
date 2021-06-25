/**
 * Symbol for separating pathItems in a route string.
 */
export const PATH_ITEM_DELIMITER = '/';

/**
 * Prefix which determines that the PathItem is a dynamic path item.
 */
export const DYNAMIC_PATH_PREFIX = ':';

/**
 * Prefix which determines that the pathItem is a spread path item.
 */
export const SPREAD_PATH_PREFIX = '...';

/**
 * Open symbol for switchRouter pathItem expressions.
 */
export const OPEN_SWITCH_EXPR_SYMBOL = '[';

/**
 * Close symbol for switchRouter pathItem expressions.
 */
export const CLOSE_SWITCH_EXPR_SYMBOL = ']';

/**
 * Equal symbol for switchRouter pathItem expressions.
 */
export const EQUAL_SWITCH_EXPR_SYMBOL = '=';

/**
 * Symbol to wrap a literal values in Switch Expression
 */
export const SINGLE_QUOTE_LITERAL = `'`;

/**
 * Symbol to wrap a literal values in Switch Expression
 */
export const DOUBLE_QUOTE_LITERAL = `"`;

/**
 * keyword that can be returned in callback meaning stop processing next callbacks
 */
export const STOP = 'stop';

/**
 * Symbol to skip matchRuntimeAndDefinedSwitches (used for help plugin)
 */
export const SKIP_matchRuntimeAndDefinedSwitches = 'SKIP_matchRuntimeAndDefinedSwitches';

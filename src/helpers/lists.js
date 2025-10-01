"use strict";

const Result = require("crocks/Result");

const compose = require("crocks/helpers/compose");
const converge = require("crocks/combinators/converge");
const curry = require("crocks/helpers/curry");
const fanout = require("crocks/Pair/fanout");
const flip = require("crocks/combinators/flip");
const identity = require("crocks/combinators/identity");
const ifElse = require("crocks/logic/ifElse");
const option = require("crocks/pointfree/option");
const substitution = require("crocks/combinators/substitution");

const { getKeys, getValue, reduceToMap, setValue } = require("../Map");
const { inc } = require("../math");
const { isGreaterThanEqualTo } = require("../predicates");

// countItem :: Map a Integer -> a -> Map a Integer
const countItem = flip((key) =>
	converge(
		setValue(key),
		compose(inc, option(0), getValue(key)),
		identity,
	)
)

/*
 * We use a Map so that any value can be a key
 */
// countItems :: Foldable f => f a -> Map a Integer
const countItems = reduceToMap(countItem)

// length :: [ a ] -> Number
const length = (a) => a.length

// slice :: Integer -> Integer -> [ a ] -> [ a ]
const slice = curry((start, end, arr) =>
	arr.slice(start, end)
)

/*
 * Slice from a position to the end of the list.
 */
// sliceFrom :: Integer -> [ a ] -> [ a ]
const sliceFrom = (start) =>
	substitution(flip(slice(start)), length)

/*
 * Slice from the start of the list to a position.
 */
// sliceTo :: Integer -> [ a ] -> [ a ]
const sliceTo = slice(0)

// take :: Integer -> [a] -> Result [a] (Pair [a] [a])
const take = curry((n) =>
	ifElse(
		compose(isGreaterThanEqualTo(n), length),
		compose(Result.Ok, fanout(sliceFrom(n), sliceTo(n))),
		Result.Err
	)
)

/*
 * Filters a list of data for unique items
 */
// unique :: Foldable f => f a -> [ a ]
const unique =
	compose(getKeys, countItems)

module.exports = {
	length,
	slice,
	sliceFrom,
	sliceTo,
	take,
	unique
}

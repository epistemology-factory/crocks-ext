"use strict";

const applyTo = require("crocks/combinators/applyTo");
const compose = require("crocks/helpers/compose");
const composeB = require("crocks/combinators/composeB");
const constant = require("crocks/combinators/constant");
const converge = require("crocks/combinators/converge");
const curry = require("crocks/helpers/curry");
const either = require("crocks/pointfree/either");
const head = require("crocks/pointfree/head");
const ifElse = require("crocks/logic/ifElse");
const init = require("crocks/pointfree/init");
const last = require("crocks/pointfree/last");
const option = require("crocks/pointfree/option");
const tail = require("crocks/pointfree/tail");

// rest :: Foldable f => (f a -> Maybe (f a)) -> f a -> f a
const rest = composeB(option([]))

/*
 * `ifItem` tests the item against a predicate. If true, the item is passed to the
 * reducer function. If false, the item is ignored and the accumulator is returned.
 */
// ifItem :: Foldable f => (b -> Boolean) -> (b -> (f b -> a) -> (() -> (f b -> a) -> b -> (f b -> a)
const ifItem = ifElse

/*
 * `noItem` returns a function that when given a Foldable will return a function that
 * returns the initial value.
 */
// noItem :: Foldable f => a -> (f b -> a)
const noItem = constant

/*
 * `reduceItem` takes an item from a list and applies a function to it.
 * The result is a function (continuation) that can be applied to a list to continue reducing.
 */
// reduceItem :: Foldable f => (f b -> Maybe b) -> (b -> (f b -> a)) -> (() -> (f b -> a)) -> f b -> (f b -> a)
const reduceItem = curry((item, ifItem, noItem) =>
	compose(either(noItem, ifItem), item)
)

/*
 * `reduce` reduces a list as long as the predicate function holds true.
 *
 * `reduce` uses continuations to branch the flow of execution by returning a function that
 * can be applied to a list of items to continue reducing, or to just return the accumulator.
 *
 * Due to the predicate function being curried, if the predicate is only interested in the
 * accumulator, it should return a function wrapping the test so that the item is ignored.
 * Alternatively, if the predicate is only interested in testing the item, have a factory
 * function that ignores the accumulator and returns the predicate function for the item.
 *
 * The `reducer` and `rest` functions are passed so that the `reduce` function can be used
 * either left-right or right-left.
 */
// reduce :: Foldable f => ((b -> (f b -> a)) -> (() -> (f b -> a)) -> f b -> (f b -> a)) -> (f b -> f b) -> (a -> b -> Boolean) -> (a -> b -> a) -> a -> f b -> a
const reduce = curry((step, rest, pred, reducer, a) =>
	/*
	 * We want to apply the function to the entire array.
	 * Using `map` would see the array mapped over.
	 */
	converge(
		applyTo,
		rest,
		step
			(ifItem(pred(a))(compose(reduce(step)(rest)(pred)(reducer), reducer(a)))(constant(constant(a))))
			(noItem(constant(a)))
	)
)

const reduceRightWhile = reduce(reduceItem(last))(rest(init))

const reduceWhile = reduce(reduceItem(head))(rest(tail))

module.exports = {
	reduceRightWhile,
	reduceWhile
}

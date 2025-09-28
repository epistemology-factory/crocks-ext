"use strict";

const applyTo = require("crocks/combinators/applyTo");
const compose = require("crocks/helpers/compose");
const constant = require("crocks/combinators/constant");
const converge = require("crocks/combinators/converge");
const curry = require("crocks/helpers/curry");
const either = require("crocks/pointfree/either");
const head = require("crocks/pointfree/head");
const ifElse = require("crocks/logic/ifElse");
const option = require("crocks/pointfree/option");
const tail = require("crocks/pointfree/tail");

// rest :: Foldable f => f a -> f a
const rest = compose(option([]), tail)

/*
 * `ifHead` tests the item (head) against a predicate. If true, the item is passed to the
 * reducer function, and the result is passed to `reduceWhile` to continue reducing. If false,
 * the item is ignored and the initial value is returned.
 */
// ifHead :: Foldable f => (a -> b -> Boolean) -> (a -> b -> a) -> a -> b -> (f b -> a)
const ifHead = curry((pred, f, init) =>
	ifElse(pred(init), compose(reduceWhile(pred)(f), f(init)), constant(constant(init)))
)

/*
 * `noHead` returns a function that when given a Foldable will return the initial value.
 */
// noHead :: Foldable f => a -> (f b -> a)
const noHead = constant

/*
 * `reduceHead` takes the head of a list and applies a function to it.
 */
// reduceHead :: Foldable f => (b -> (f b -> a)) -> (f b -> a) -> f b -> (f b -> a)
const reduceHead = curry((ifHead, noHead) =>
	compose(either(constant(noHead), ifHead), head)
)

/*
 * `reduceWhile` reduces a list as long as the predicate function holds true.
 *
 * Due to the predicate function being curried, if the predicate is only interested in the
 * accumulator, it should return a function wrapping the test so that the item is ignored.
 * Alternatively, if the predicate is only interested in testing the item, have a factory
 * function that ignores the accumulator and returns the predicate function for the item.
 */
// reduceWhile :: Foldable f => (a -> b -> Boolean) -> (a -> b -> a) -> a -> f b -> a
const reduceWhile = curry((pred, f, acc) =>
	/*
	 * We want to apply the function to the entire array.
	 * Using `map` would see the array mapped over.
	 */
	converge(applyTo, rest, reduceHead(ifHead(pred)(f)(acc), noHead(acc)))
)

module.exports = {
	reduceWhile
}

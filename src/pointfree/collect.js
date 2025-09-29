"use strict";

const compose2 = require("crocks/combinators/compose2");
const converge = require("crocks/combinators/converge");
const curry = require("crocks/helpers/curry");
const head = require("crocks/pointfree/head");
const init = require("crocks/pointfree/init");
const last = require("crocks/pointfree/last");
const liftA2 = require("crocks/helpers/liftA2");
const reduce = require("crocks/pointfree/reduce");
const reduceRight = require("crocks/pointfree/reduce");
const tail = require("crocks/pointfree/tail");

/*
 * `collect` is similar to `reduce` where the accumulator is the first item in the list.
 * However, `collect` is more expressive than a simple fold as the reducer allows arbitrary
 * behaviour on the collection as opposed to a simple concatenation (fold).
 *
 * `collect` returns a Maybe as if the list has less than 2 items, there are not enough items
 * to apply the reducer too. Therefore, `collect` returns a Just with the accumulator, or
 * Nothing.
 *
 * The `reduce`, `item` and `rest` functions are arguments so that `collect` can be used
 * either left-right or right-left.
 */
// collect :: Foldable f => ((a -> a -> a) -> a -> f a -> a) -> (f a -> Maybe a) -> (f a -> Maybe (f a)) -> (a -> a -> a) -> f a -> Maybe a
const collect = curry((reduce, item, rest, fn) =>
	converge(liftA2(reduce(fn)), item, rest)
)

// collectLeft :: Foldable f => (a -> a -> a) -> f a -> Maybe a
const collectLeft = collect(reduce)(head)(tail)

// collectRight :: Foldable f => (a -> a -> a) -> f a -> Maybe a
const collectRight = collect(reduceRight)(last)(init)

// mapCollect :: Foldable f => ((b -> b -> a) -> f b -> Maybe a) -> (b -> a) -> (a -> a -> a) -> f b -> Maybe a
const mapCollect = curry((reducer, map, reduce) =>
	reducer(compose2(reduce)(map)(map))
)

// mapCollectLeft :: Foldable f => (b -> a) -> (a -> a -> a) -> f b -> Maybe a
const mapCollectLeft = mapCollect(collectLeft)

// mapCollectRight :: Foldable f => (b -> a) -> (a -> a -> a) -> f b -> Maybe a
const mapCollectRight = mapCollect(collectRight)

module.exports = {
	collect: collectLeft,
	collectRight,
	mapCollect: mapCollectLeft,
	mapCollectRight
}

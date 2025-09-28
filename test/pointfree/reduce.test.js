"use strict";

const { compose, constant, curry, flip, ifElse } = require("crocks");

const { assertThat, is } = require("hamjest");

const { reduceRightWhile, reduceWhile } = require("../../src/pointfree/reduce");

describe("reduce", function() {
	// lt :: Number -> Number -> Boolean
	const lt = curry((a, b) => b < a)

	// gt :: Number -> Number -> Boolean
	const gt = flip(lt)

	// pred :: (Number -> Number -> Boolean) -> Number -> Number -> Number -> Boolean)
	const pred = (fn) => (limit) =>
		compose(constant, fn(limit))

	// isGreaterThan :: Number -> Number -> Number -> Boolean
	const isGreaterThan = pred(gt)

	// isLessThan :: Number -> Number -> Number -> Boolean
	const isLessThan = pred(lt)

	const minus = curry((a, b) => a - b)

	const sum = curry((a, b) => a + b)

	const data = [ 1, 2, 3, 4, 5, 6 ];

	describe("reduceWhile", function() {
		it("should reduce empty list to init value", function() {
			const init = 0;
			const result = reduceWhile(isLessThan(5), sum, init, []);

			assertThat(result, is(init));
		});

		it("should reduce list of single item", function() {
			const result = reduceWhile(isLessThan(5), sum, 0, [ 1 ]);

			assertThat(result, is(1));
		});

		it("should reduce entire list", function() {
			const result = reduceWhile(isLessThan(100), sum, 0, data);

			assertThat(result, is(21));
		});

		it("should short circuit when predicate is false", function() {
			const result = reduceWhile(isLessThan(5), sum, 0, data);

			assertThat(result, is(6));
		});

		it("should pass accumulator and item to predicate function", function() {
			const isEven = (a) => a % 2 === 0

			// pred :: Number -> (Number -> Boolean)
			const pred = ifElse(
				lt(5),
				constant(isEven),
				constant(constant(false))
			);

			const init = 0;
			const result = reduceWhile(pred, sum, init, data);

			// as the first number is odd
			assertThat(result, is(init));
		});
	});

	describe("reduceRightWhile", function() {
		it("should reduce empty list to init value", function() {
			const init = 100;
			const result = reduceRightWhile(isGreaterThan(50), minus, init, []);

			assertThat(result, is(init));
		});

		it("should reduce list of single item", function() {
			const result = reduceRightWhile(isGreaterThan(50), minus, 100, [ 1 ]);

			assertThat(result, is(99));
		});

		it("should reduce entire list", function() {
			const result = reduceRightWhile(isGreaterThan(50), minus, 100, data);

			assertThat(result, is(79));
		});

		it("should short circuit when predicate is false", function() {
			const result = reduceRightWhile(isGreaterThan(85), minus, 100, data);

			assertThat(result, is(85));
		});

		it("should pass accumulator and item to predicate function", function() {
			const isOdd = (a) => a % 2 !== 0

			// pred :: Number -> (Number -> Boolean)
			const pred = ifElse(
				gt(0),
				constant(isOdd),
				constant(constant(false))
			);

			const init = 100;
			const result = reduceRightWhile(pred, sum, init, data);

			// as the first number is even
			assertThat(result, is(init));
		});
	});
});

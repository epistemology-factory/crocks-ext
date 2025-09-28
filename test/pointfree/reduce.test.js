"use strict";

const { compose, constant, curry, ifElse } = require("crocks");

const { assertThat, is } = require("hamjest");

const { reduceWhile } = require("../../src/pointfree/reduce");

describe("reduce", function() {
	// lt :: Number -> Number -> Boolean
	const lt = curry((a, b) => b < a)

	// isLessThan :: Number -> Number -> Number -> Boolean
	const isLessThan = (limit) =>
		compose(constant, lt(limit))

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
});

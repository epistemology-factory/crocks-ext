"use strict";

const { curry } = require("crocks");

const { assertThat, is } = require("hamjest");

const {
	collect,
	collectRight,
	mapCollect,
	mapCollectRight
} = require("../../src/pointfree/collect");

describe("collect", function() {
	const minus = curry((a, b) => a - b)
	const sum = curry((a, b) => a + b)

	// toString :: Number -> String
	const toString = (x) => x.toString()

	// toInt :: String -> Number
	const toInt = (a) => {
		// this makes sure we're not mapping the accumulator multiple times.
		if (typeof a !== "string") {
			throw new TypeError("toInt: a must be a string")
		}

		return parseInt(a)
	}

	const nums = [ 1, 2, 3, 4, 5, 6 ];
	const strs = nums.map(toString);

	describe("collect", function() {
		it("should return nothing for empty list", function() {
			const result = collect(sum)([]).option(null);

			assertThat(result, is(null));
		});

		it("should return nothing for list with single item", function() {
			const result = collect(sum)([ 1 ]).option(null);

			assertThat(result, is(null));
		});

		it("should reduce list", function() {
			const result = collect(sum)(nums).option(null);

			assertThat(result, is(21));
		});
	});

	describe("collectRight", function() {
		it("should return nothing for empty list", function() {
			const result = collectRight(minus)([]).option(null);

			assertThat(result, is(null));
		});

		it("should return nothing for list with single item", function() {
			const result = collectRight(minus)([ 1 ]).option(null);

			assertThat(result, is(null));
		});

		it("should reduce list", function() {
			const result = collectRight(minus)(nums).option(null);

			assertThat(result, is(-9));
		});
	});

	describe("mapCollect", function() {
		it("should return nothing for empty list", function() {
			const result = mapCollect(toInt)(sum)([]).option(null);

			assertThat(result, is(null));
		});

		it("should return nothing for list with single item", function() {
			const result = mapCollect(toInt)(sum)([ "1" ]).option(null);

			assertThat(result, is(null));
		});

		it("should reduce list", function() {
			const result = mapCollect(toInt)(sum)(strs).option(null);

			assertThat(result, is(21));
		});
	});

	describe("mapCollectRight", function() {
		it("should return nothing for empty list", function() {
			const result = mapCollectRight(toInt)(minus)([]).option(null);

			assertThat(result, is(null));
		});

		it("should return nothing for list with single item", function() {
			const result = mapCollectRight(toInt)(minus)([ "1" ]).option(null);

			assertThat(result, is(null));
		});

		it("should reduce list", function() {
			const result = mapCollectRight(toInt)(minus)(strs).option(null);

			assertThat(result, is(-9));
		});
	});
});

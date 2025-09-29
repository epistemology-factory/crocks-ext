"use strict";

const { curry } = require("crocks");

const { assertThat, is } = require("hamjest");

const { collect, collectRight } = require("../../src/pointfree/collect");

describe("collect", function() {
	const minus = curry((a, b) => a - b)

	const sum = curry((a, b) => a + b)

	const data = [ 1, 2, 3, 4, 5, 6 ];

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
			const result = collect(sum)(data).option(null);

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
			const result = collectRight(minus)(data).option(null);

			assertThat(result, is(-9));
		});
	});
});

"use strict";

const { assertThat, equalTo, hasItem, hasSize, is } = require("hamjest");

const { identity } = require("crocks/combinators");

const { throwContents, throwResult } = require("../../src/utils");

const {
	take,
	unique
} = require("../../src/helpers/lists");

describe("list helpers", function() {
	const items = [
		"milk",
		"bread",
		"jam",
		"bread",
		"milk"
	];

	describe("unique", function() {
		it("should filter list for unique items", function() {
			const result = unique(items);

			assertThat(result, hasSize(3));
			assertThat(result, hasItem("milk"));
			assertThat(result, hasItem("bread"));
			assertThat(result, hasItem("jam"));
		});
	});

	describe("take", function() {
		it("should return error with list when not enough items in list", function() {
			const result = take(100, items).either(identity, throwResult);

			assertThat(result, is(items));
		});

		it("should take first n items from list", function() {
			const n = 2;
			const x = take(n, items).either(throwContents, identity);

			assertThat(x.fst(), is(equalTo(items.slice(n))));
			assertThat(x.snd(), is(equalTo(items.slice(0, n))));
		});
	});
});

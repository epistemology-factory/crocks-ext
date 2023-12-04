"use strict";

const { compose, constant, isSame } = require("crocks");
const { assertThat, is, throws, typedError } = require("hamjest");

const { choose, when, otherwise } = require("../../src/logic/choice");
const { mod } = require("../../src/math");

// divides :: Number -> Number -> Boolean
const divides = (x) => compose(isSame(0), mod(x))

describe("choose", function() {
	it("should throw error if no cases given", function() {
		assertThat(() => choose(), throws(typeError("choose: Functions required")));
	});

	it("should throw error if cases not functions", function() {
		assertThat(() => choose("a"), throws(typeError("choose: Functions required")));
	});

	it("should throw error if no default given", function() {
		assertThat(
			() => choose(when(divides(15), constant("fizzbuzz"))),
			throws(typeError("choose: Default function required"))
		);
	});

	it("should should choose path", function() {
		const chooser = choose(
			when(divides(15), constant("fizzbuzz")),
			when(divides(5), constant("buzz")),
			when(divides(3), constant("fizz")),
			otherwise(constant(""))
		)

		assertThat(chooser(30), is("fizzbuzz"));
		assertThat(chooser(10), is("buzz"));
		assertThat(chooser(6), is("fizz"));
		assertThat(chooser(7), is(""));
	});
});

function typeError(message) {
	return typedError(TypeError, message);
}

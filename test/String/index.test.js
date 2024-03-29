"use strict";

const { assertThat, is } = require("hamjest");

const {
	capitalise,
	changeCase,
	contains,
	fromKebabCase,
	join,
	joinPair,
	length,
	lowerCase,
	replace,
	split,
	stringify,
	trim,
	toCamelCase,
	toKebabCase,
	upperCase
} = require("../../src/String");

describe("String", function() {
	it("should capitalise word", function() {
		assertThat(capitalise("hello"), is("Hello"));
	})

	it("should return true when string includes word", function() {
		assertThat(contains("hello")("hello world"), is(true));
	});

	it("should join word", function() {
		assertThat(join("-", [ "a", "b", "c" ]), is("a-b-c"))
	});

	it("should join string pair", function() {
		assertThat(joinPair("=", "a", "b"), is("a=b"));
	});

	it("should split word", function() {
		assertThat(split("-", "a-b-c"), is([ "a", "b", "c" ]))
	});

	it("should lower case word", function() {
		assertThat(lowerCase("HELLO"), is("hello"))
	});

	it("should upper case word", function() {
		assertThat(upperCase("hello"), is("HELLO"))
	});

	it("should replace string", function() {
		assertThat(replace(/l/g, "w", "hello"), is("hewwo"));
	});

	it("should stringify data", function() {
		assertThat(stringify({ a: 1 }), is('{"a":1}'))
	});

	it("should trim data", function() {
		assertThat(trim("    hello   "), is("hello"));
	});

	it("should return string length", function() {
		assertThat(length("hello"), is(5));
	})

	describe("camelCase", function() {
		it("should camel case words", function() {
			assertThat(toCamelCase([ "a", "var" ]), is("aVar"))
		});

		it("should passthrough single word", function() {
			assertThat(toCamelCase([ "var" ]), is("var"));
		});

		it("should return blank string for empty list", function() {
			assertThat(toCamelCase([]), is(""));
		});
	});

	describe("kebab case", function() {
		it("should kebab case words", function() {
			assertThat(toKebabCase([ "A", "VAR" ]), is("a-var"));
		});

		it("should return blank string for empty list", function() {
			assertThat(toKebabCase([]), is(""));
		});
	});

	it("should change case", function() {
		assertThat(changeCase(fromKebabCase, toCamelCase)("a-var"), is("aVar"));
	});
});

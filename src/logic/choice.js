"use strict";

const All = require("crocks/All");

const applyTo = require("crocks/combinators/applyTo");
const binary = require("crocks/helpers/binary");
const identity = require("crocks/combinators/identity");
const ifElse = require("crocks/logic/ifElse");
const isFunction = require("crocks/core/isFunction");
const mreduceMap = require("crocks/helpers/mreduceMap");

// allFunctions :: [ a ] -> Boolean
const allFunctions = mreduceMap(All, isFunction)

// choose :: [(a -> b)] -> a -> b
const choose = (...cases) => {
	if (cases.length < 1 || !allFunctions(cases)) {
		throw new TypeError("choose: Functions required");
	}

	if (cases.length < 2) {
		throw new TypeError("choose: Default function required")
	}

	const last = cases[cases.length - 1];
	const rest = cases.slice(0, -1);

	return rest.reduceRight(binary(applyTo), last);
};

// when :: (a -> Boolean) | Pred -> (a -> b) -> (a -> c) -> a -> (b | c)
const when = ifElse

// otherwise :: a -> a
const otherwise = identity

module.exports = {
	choose,
	otherwise,
	when
}

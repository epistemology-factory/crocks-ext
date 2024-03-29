"use strict";

const fs = require("fs");
const os = require("os");
const path = require("path");

const rimraf = require("rimraf");

const {
	allOf,
	assertThat,
	hasProperty,
	instanceOf,
	is,
	isRejectedWith,
	promiseThat,
} = require("hamjest");

const {
	readDir,
	readDirContents,
	readFile,
	readJSON,
	writeFile,
	writeToDir
} = require("../../src/node/fs");

describe("fs", function() {
	const testDataDir = `${os.tmpdir()}/crocks-ext`;

	beforeEach(async function() {
		await rmFile(testDataDir);

		fs.mkdirSync(testDataDir, { recursive: true });
	});

	afterEach(rmFile(testDataDir));

	describe("readDir", function() {
		const filename = "tmp.txt";
		const contents = "Hello World";

		beforeEach(function() {
			fs.writeFileSync(`${testDataDir}/${filename}`, contents);
		});

		it("should read dir", async function() {
			const contents = await readDir(testDataDir).toPromise();

			assertThat(contents.length, is(1));
			assertThat(contents[0], is(`${testDataDir}/${filename}`));
		});
	});

	describe("readDirContents", function() {
		const filename = "tmp.txt";
		const contents = "Hello World";

		beforeEach(function() {
			fs.writeFileSync(`${testDataDir}/${filename}`, contents, { encoding: "utf8" });
		});

		it("should read dir contents", async function() {
			const result = await readDirContents({ encoding: "utf8" }, testDataDir).toPromise();

			assertThat(result.length, is(1));
			assertThat(result[0].fst(), is(`${testDataDir}/${filename}`));
			assertThat(result[0].snd(), is(contents));
		});
	});

	describe("readFile", function() {
		const filename = `${testDataDir}/tmp.txt`;
		const contents = "Hello World";

		beforeEach(function() {
			fs.writeFileSync(filename, contents, { encoding: "utf8" });
		});

		it("should read file contents", async function() {
			const result = await readFile({ encoding: "utf8" }, filename).toPromise();

			assertThat(result, is(contents));
		});
	});

	describe("readJSON", function() {
		const filename = `${testDataDir}/fs.test.json`;

		it("should read json", async function() {
			fs.writeFileSync(filename, '{ "a": 1 }')

			const result = await readJSON(filename).toPromise();

			assertThat(result.a, is(1));
		});
	});

	describe("writeFile", function() {
		const writeStringFile = writeFile({ encoding: "utf8" });
		const filename = `${testDataDir}/a/b/c/fs.test.json`

		it("should create directories when saving file", async function() {
			const result = await writeStringFile(filename, '{ "a": 1 }').toPromise()

			assertThat(result, is(undefined));
			await fs.promises.stat(filename);
		});

		it("should reuse existing directories when saving file", async function() {
			const dirs = path.dirname(filename);
			await fs.promises.mkdir(dirs, { recursive: true });

			const result = await writeStringFile(filename, '{ "a": 1 }').toPromise()

			assertThat(result, is(undefined));
			await fs.promises.stat(filename);
		});

		it("should return error when unable to mkdir", async function() {
			const dir = path.dirname(filename);
			const parent = dirParent(dir)

			await fs.promises.mkdir(parent, { recursive: true });

			// make the parent directory non writeable so that we force an error
			await fs.promises.chmod(parent, 0o500);

			await promiseThat(
				writeStringFile(filename, '{ "a": 1 }').toPromise(),
				isRejectedWith(
					allOf(
						instanceOf(Error),
						hasProperty("message", `EACCES: permission denied, mkdir '${dir}'`)
					)
				)
			)
		});
	});

	describe("writeToDir", function() {
		const writeStringFile = writeToDir({ encoding: "utf8" }, testDataDir);
		const filename = "a/b/c/fs.test.json";
		const absoluteFilename = `${testDataDir}/${filename}`;

		it("should write file to dir", async function() {
			const result = await writeStringFile(filename, '{ "a": 1 }').toPromise()

			assertThat(result, is(undefined));
			await fs.promises.stat(absoluteFilename);
		});
	});

	function rmFile(filename) {
		return async function() {
			await rimraf.sync(filename);
		}
	}

	function dirParent(dir) {
		const segments = dir.split("/");
		segments.pop();

		return segments.join("/");
	}
});

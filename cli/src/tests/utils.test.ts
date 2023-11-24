import { afterEach, beforeEach, describe } from "mocha";
import { copyDirectoryContents, getFilesIgnoredByGit, getParameterNames } from "../utils.js";
import * as fs from 'fs'
import { expect } from "chai";
import assert from 'assert'
import { spawnSync } from "child_process";

describe("Testing utils.ts", function () {

    describe("copyDirectoryContents", function () {

        beforeEach(() => {
            if (fs.existsSync('tmp')) fs.rmSync('tmp', { recursive: true })
            fs.mkdirSync('tmp')
        })

        afterEach(() => {
            if (fs.existsSync('tmp')) fs.rmSync('tmp', { recursive: true })
        })

        it("copy to existing empty dir", async () => {
            this.timeout(-1)
            fs.mkdirSync('tmp/src')
            fs.writeFileSync('tmp/src/test.txt', 'test')
            fs.mkdirSync('tmp/dest')

            await copyDirectoryContents({ fromPath: './tmp/src', toPath: './tmp/dest' })

            expect(fs.existsSync('tmp/dest/test.txt')).to.be.true
        });

        it("Throws error when trying to co to non-existing dir", async () => {
            this.timeout(-1)
            fs.mkdirSync('tmp/src')
            fs.writeFileSync('tmp/src/test.txt', 'test')

            await assert.rejects((async () => await copyDirectoryContents({ fromPath: './tmp/src', toPath: './tmp/dest' }))())
        })

        it("Skips files not passing custom validation. Utilizing file name.", async () => {
            this.timeout(-1)
            fs.mkdirSync('tmp/src')
            fs.writeFileSync('tmp/src/test1.txt', 'test1')
            fs.writeFileSync('tmp/src/test2.txt', 'test2')
            fs.mkdirSync('tmp/dest')

            await copyDirectoryContents({
                fromPath: './tmp/src',
                toPath: './tmp/dest',
                validate: ({ createName, createPath, isFile, sourcePath }) => {
                    if (createName === 'test1.txt') return false
                    return true
                }
            })

            expect(fs.existsSync('tmp/dest/test1.txt')).to.be.false
            expect(fs.existsSync('tmp/dest/test2.txt')).to.be.true
        })
    })

    describe("getParameterNames", function () {
        it("Returns parameter names of an arrow function", () => {
            const func1 = new Function("a", "b", `(a, b) => { }`)
            const func2 = new Function("name_", `(name_) => { }`)
            const func3 = new Function("val1", `(val1) => (val1)`)
            const func4 = new Function("val1", 'val2', `(val1, val2) => (val1)`)
            const func5 = new Function("val1", `async (val1) => (val1)`)
            const func6 = new Function("a", `a => b => a + b`)

            expect(getParameterNames(func1)).to.deep.equal(['a', 'b'])
            expect(getParameterNames(func2)).to.deep.equal(["name_"])
            expect(getParameterNames(func3)).to.deep.equal(["val1"])
            expect(getParameterNames(func4)).to.deep.equal(["val1", "val2"])
            expect(getParameterNames(func5)).to.deep.equal(["val1"])
            expect(getParameterNames(func6)).to.deep.equal(["a"])
        })
    })

    describe("getFilesIgnoredByGit", function () {
        beforeEach(() => {
            if (fs.existsSync('tmp')) fs.rmSync('tmp', { recursive: true })
            fs.mkdirSync('tmp')
        })

        afterEach(() => {
            if (fs.existsSync('tmp')) fs.rmSync('tmp', { recursive: true })
        })

        it("Returns array of files ignored by git", async () => {
            spawnSync('git', ['init', '.'], { cwd: 'tmp' })
            fs.writeFileSync('tmp/ignored.txt', 'test')
            fs.writeFileSync('tmp/not-ignored.txt', 'test2')
            fs.writeFileSync('tmp/.gitignore', 'ignored.txt')
            spawnSync('git', ['add', '.'], { cwd: 'tmp' })

            const results = await getFilesIgnoredByGit('tmp')
            expect(results).to.deep.equal(['ignored.txt', '.git'])
        })
    })
})

import { afterEach, beforeEach, describe } from "mocha";
import { copyDirectoryContents } from "../utils.js";
import * as fs from 'fs'
import { expect } from "chai";
import assert from 'assert'

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
})

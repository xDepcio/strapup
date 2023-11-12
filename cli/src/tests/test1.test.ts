import { afterEach, beforeEach, describe, } from "mocha";
import { copyDirectoryContents } from "../utils.js";
import * as fs from 'fs'
import { expect } from "chai";

describe("Test", () => {
    it("should pass", () => {
        console.log("Test passed");
    });
})

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
})

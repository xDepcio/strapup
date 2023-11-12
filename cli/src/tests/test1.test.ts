import { describe, } from "mocha";
import { copyDirectoryContents } from "../utils.js";

describe("Test", () => {
    it("should pass", () => {
        console.log("Test passed");
    });
})

describe("copyDirectoryContents", function () {
    this.timeout(-1)
    it("copies from exisitng dir to another existing dir", async () => {
        await copyDirectoryContents({ fromPath: './src', toPath: './src2' })
    });
})

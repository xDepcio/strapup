import { afterEach, beforeEach, describe } from "mocha";
import { copyDirectoryContents, getFilesIgnoredByGit, getParameterNames } from "../utils.js";
import * as fs from 'fs'
import { expect } from "chai";
import assert from 'assert'
import { spawnSync } from "child_process";

describe('Testing headless mode', function()
{
    beforeEach(() => {
        if (fs.existsSync('tmp')) fs.rmSync('tmp', { recursive: true })
        fs.mkdirSync('tmp')
    })

    afterEach(() => {
        if (fs.existsSync('tmp')) fs.rmSync('tmp', { recursive: true })
    })

    it('Attempts to download a template from server'), async() => 
    {
        spawnSync('npm', ['start', 'paste', '@xDepcio/template1', 'tmp/test_folder'], {cwd: 'tmp'})
        
        expect(fs.existsSync('tmp/test_folder')).to.be.true;
        expect(fs.existsSync('tmp/test_folder/_strapupmetadata.json')).to.be.true;
        expect(fs.existsSync('tmp/test_folder/hooks.ts')).to.be.true;
    
    }
})
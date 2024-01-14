import { afterEach, beforeEach, describe } from "mocha";
import { copyDirectoryContents, getFilesIgnoredByGit, getParameterNames } from "../utils.js";
import * as fs from 'fs'
import { expect } from "chai";
import assert from 'assert'
import { spawnSync } from "child_process";
import { runInThisContext } from "vm";

describe('Testing headless mode', function()
{
    beforeEach(() => {
        if (fs.existsSync('tmp')) fs.rmSync('tmp', { recursive: true })
        fs.mkdirSync('tmp')
    })

    afterEach(() => {
        if (fs.existsSync('tmp')) fs.rmSync('tmp', { recursive: true })
    })

    it('Attempts to download a template from server', function(done)
    {
        this.timeout(9999999999999);
        spawnSync('npm', ['start', 'paste', '@xDepcio/template1', 'tmp/test_folder'])
        
        expect(fs.existsSync('tmp/test_folder')).to.be.true;
        expect(fs.existsSync('tmp/test_folder/features')).to.be.true;
        expect(fs.existsSync('tmp/test_folder/hooks.ts')).to.be.true;
        done();
    
    })

    it('Pastes existing template', function(done)
    {
        this.timeout(9999999999999);
        spawnSync('npm', ['start', 'paste', 'python_project', 'tmp/test_folder1'])
        
        expect(fs.existsSync('tmp/test_folder1')).to.be.true;
        expect(fs.existsSync('tmp/test_folder1/python_project')).to.be.true;
        expect(fs.existsSync('tmp/test_folder1/setup.py')).to.be.true;

        done();
    
    })

    it('Run existing script', function(done) 
    {
        this.timeout(9999999999999);
        spawnSync('npm', ['start', 'run-script', '@xDepcio_-_script1.mjs'])
        //expect(fs.readFileSync('tmp/out'))
        done();
    })
})
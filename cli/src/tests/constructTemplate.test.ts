import { afterEach, beforeEach, describe } from "mocha";
import { copyDirectoryContents, getFilesIgnoredByGit, getParameterNames } from "../utils.js";
import * as fs from 'fs'
import { expect } from "chai";
import assert from 'assert'
import { execSync, spawnSync } from "child_process";
import path from "path"
import { paste } from "../commandsHandlers.js"

describe("Testing constructTemplate", function()
{   
    
    // const folderStruct = commandHandler.__get__('folderStruct')

    beforeEach(() => {
        if (fs.existsSync('tmp')) fs.rmSync('tmp', { recursive: true })
        fs.mkdirSync('tmp')
    })

    afterEach(() => {
        if (fs.existsSync('tmp')) fs.rmSync('tmp', { recursive: true })
    })

    it("tests the constructTemplate function", async() =>
    {
    //pasted from commandHandler.ts idk how to import private function

    interface folderStruct{
        name: string,
        isDir: boolean,
        children: folderStruct[] | null
    }
    
    async function constructTemplate(my_struct: folderStruct, my_relative_path: string, my_absolute_path: string)
    {    
        if(my_struct.isDir)
        {
            
            const cur_absolute_path = path.normalize(`${my_absolute_path}${my_struct.name.replace("/", "_-_")}/`)
            const cur_relative_path = path.normalize(`${my_relative_path}${my_struct.name}/`)
    
            //p.log.info(`Creating folder ${cur_relative_path}`)
            
            try    
            {
                fs.mkdirSync(cur_absolute_path, {recursive: true})
            }
            catch (err)
            {
                throw new Error(`Failed to create folder ${cur_absolute_path}. Error: ${err}`)
            }
            if(my_struct.children)
            {
                let children_promises: any[] = []
                my_struct.children.forEach((child: folderStruct) =>
                {
                    children_promises.push(constructTemplate(child, cur_relative_path, cur_absolute_path))
                })
                return Promise.all(children_promises)
            }
        }
        else
        {
            const cur_absolute_path = path.normalize(`${my_absolute_path}${my_struct.name.replace("/", "_-_")}`)
            const cur_relative_path = path.normalize(`${my_relative_path}${my_struct.name}`)
    
            // p.log.info(`Downloading file ${cur_relative_path}`)
    
            // const curFileContentResponse = await fetch(`${GO_BACKEND_URL}/api/templates/file?name=${cur_relative_path}`,{
            //     method: 'GET',
            //     headers: {
            //         'Authorization': `${loadSettings().githubToken}`
            //     }
            // })
            
            // if(!curFileContentResponse.ok)
            // {
            //     throw new Error(`Failed to download file ${cur_relative_path}. Error: ${curFileContentResponse.statusText}`)
            // }
            // const curFileContent: string = await curFileContentResponse.text() 
    
            fs.writeFileSync(cur_absolute_path, cur_relative_path)
        }
        return Promise.resolve()
    }

    let mock_folder_struct: folderStruct = 
    {
        name: "@user/test_folder",
        isDir: true,
        children: [
            {
                name: "test_folder1",
                isDir: true,
                children: [
                    {
                        name: "test_file2",
                        isDir: false,
                        children: null
                    }, 
                    {
                        name: "test_file3",
                        isDir: false,
                        children: null
                    }
                ]
            },
            {
                name: "test_file1",
                isDir: false,
                children: null
            }
        ]

    }

        await constructTemplate(mock_folder_struct, '', 'tmp/')
        expect(fs.existsSync('tmp/@user_-_test_folder')).to.be.true;
        expect(fs.existsSync('tmp/@user_-_test_folder/test_folder1')).to.be.true;
        expect(fs.existsSync('tmp/@user_-_test_folder/test_folder1/test_file2')).to.be.true;
        expect(fs.existsSync('tmp/@user_-_test_folder/test_folder1/test_file3')).to.be.true;
        expect(fs.existsSync('tmp/@user_-_test_folder/test_file1')).to.be.true;


    })
})

// describe('Testing paste', function()
// {
//     paste({templateName: "@xDepcio/template1", destinationRelativePath: "test_template" })

// })
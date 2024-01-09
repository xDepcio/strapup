import { afterEach, beforeEach, describe } from "mocha";
import { copyDirectoryContents, getFilesIgnoredByGit, getParameterNames } from "../utils.js";
import * as fs from 'fs'
import { expect } from "chai";
import assert from 'assert'
import { spawnSync } from "child_process";
import path from "path"

describe("Testing constructTemplate", function()
{
    interface folderStruct{
        Name: string,
        IsDir: boolean,
        Children: folderStruct[] | null
    }
    async function constructTemplate(my_struct: folderStruct, my_relative_path: string, my_absolute_path: string)
{
    
    if(my_struct.IsDir)
    {
        const cur_absolute_path = path.normalize(`${my_absolute_path}${my_struct.Name.replace("/", "_-_")}/`)
        const cur_relative_path = path.normalize(`${my_relative_path}${my_struct.Name}/`)
        try    
        {
            fs.mkdirSync(cur_absolute_path, {recursive: true})
        }
        catch (err)
        {
            throw new Error(`Failed to create folder ${cur_absolute_path}. Error: ${err}`)
        }
        if(my_struct.Children)
        {
            my_struct.Children.forEach((child: folderStruct) =>
            {
                constructTemplate(child, cur_relative_path, cur_absolute_path)
            })
        }
    }
    else
    {
        const cur_absolute_path = path.normalize(`${my_absolute_path}${my_struct.Name.replace("/", "_-_")}`)
        const cur_relative_path = path.normalize(`${my_relative_path}${my_struct.Name}`)
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

        fs.writeFileSync(cur_absolute_path, my_struct.Name)
    }
    return
}

    let mock_folder_struct: folderStruct = 
    {
        Name: "@user/test_folder",
        IsDir: true,
        Children: [
            {
                Name: "test_folder1",
                IsDir: true,
                Children: [
                    {
                        Name: "test_file2",
                        IsDir: false,
                        Children: null
                    }, 
                    {
                        Name: "test_file3",
                        IsDir: false,
                        Children: null
                    }
                ]
            },
            {
                Name: "test_file1",
                IsDir: false,
                Children: null
            }
        ]

    }

    constructTemplate(mock_folder_struct, '', `${path.resolve()}/`)

})
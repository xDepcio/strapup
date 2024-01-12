#!/usr/bin/env node

import { spawn } from "child_process";
import * as fs from "fs";
import * as path from "path";
import { unEscape } from "./helpers";

export async function getScriptMdx(scriptPath: string) {
    type Script = {
        description: string
        command: (...args: string[]) => string[]
    }

    const scriptConent = fs.readFileSync(scriptPath, "utf-8")
    const scripts: Script = await import(scriptPath).then(module => module.default)
    const params = getParameterNames(scripts.command)
    const args = params.map((param) => `\${${param}}`)
    const script = {
        name: unEscape(path.basename(scriptPath, ".mjs")),
        description: scripts.description,
        // command: scripts.command(...args),
        command: scripts.command.toString(),
        content: scriptConent
    }
    console.log("scr OBJ", script)
    const mdxContent = getMdxScriptsContent({ sortNum: 1, script })
    return mdxContent
}

const getMdxScriptsContent = ({ script, sortNum }: { sortNum: number, script: { name: string, description?: string, command: string, content: string } }) => {
    return `---
title: ${escapeAt(script.name)}
sortNum: ${sortNum}
---
### ${escapeAt(script.name)}
${escapeAt(script.description || '')}

To run use:
\`\`\`command
npx strapup run-script ${script.name}
\`\`\`
### Executed commands
\`\`\`bash
${script.command}
\`\`\`
### Script content
\`\`\`javascript
${script.content}
\`\`\`
`
}

function escapeAt(str: string) {
    return str.replace(/@/g, "\\@")
}

export async function getTemplateMdx(templatePath: string, templateName: string) {
    const dirStructure = await getTreeString(templatePath)
    let description = ''
    if (fs.existsSync(`${templatePath}/_strapupmetadata.json`)) {
        const templateInfo = JSON.parse(fs.readFileSync(`${templatePath}/_strapupmetadata.json`, "utf-8"))
        if (templateInfo.templateDesc) description = templateInfo.templateDesc
    }
    const filesNames = getAllFilesNameDepthFirst(templatePath)
    const codeBlocks = getCodeBlocks(filesNames, templatePath)
    const mdxContent = getMdxContent({ sortNum: 1, title: templateName, codeBlocks, treeString: dirStructure, description })
    return mdxContent
}


const getCodeBlocks = (files: string[], storagePath: string) => files.map((file) => {
    const fileContent = fs.readFileSync(file, "utf-8")
    const fileExtension = path.extname(file).replace(".", "")
    console.log('------')
    console.log(file, storagePath)
    console.log('------')
    return `\`\`\`${fileExtension} title="${path.relative(storagePath, file)}"
${fileContent}\`\`\``
}).join("\n")

const getMdxContent = ({ sortNum, title, codeBlocks, description, treeString }: { title: string, sortNum: number, treeString?: string, description?: string, codeBlocks?: string }) => {
    return `---
title: ${escapeAt(title)}
sortNum: ${sortNum}
---
### ${title}
${description || ""}
${treeString ? `#### Pasted files structure
\`\`\`bash
${treeString}\`\`\`` : ''}
#### Files contents
${codeBlocks || ''}
`
}

function getTreeString(dirPath: string) {
    const ignoredFilesNames = new RegExp(`.*_strapupmetadata.json.*\n|.*directories.*files.*|\n\n|.*${dirPath}.*\n|0 directories, 1 file`, "g")

    return new Promise<string>((resolve, reject) => {
        resolve("xd")
        // const shell = spawn("tree", [dirPath])
        // let treeString = ""
        // shell.stdout.on("data", (data) => {
        //     treeString += data.toString()
        // })
        // shell.on("close", () => {
        //     resolve(treeString.replace(ignoredFilesNames, ""))
        // })
    })
}

function getAllFilesNameDepthFirst(dirPath: string) {
    const ignoreNames = ['_strapupmetadata.json']
    const files = fs.readdirSync(dirPath)
    let filesNameDepthFirst: string[] = []
    for (const file of files) {
        if (ignoreNames.includes(file)) continue
        const filePath = path.join(dirPath, file)
        const isDirectory = fs.statSync(filePath).isDirectory()
        if (isDirectory) {
            filesNameDepthFirst = [...filesNameDepthFirst, ...getAllFilesNameDepthFirst(filePath)]
        } else {
            filesNameDepthFirst.push(filePath)
        }
    }
    return filesNameDepthFirst
}

export function getParameterNames(func: Function) {
    const funcString = func.toString();
    const parameterNames = funcString
        .slice(funcString.indexOf('(') + 1, funcString.indexOf(')'))
        .split(',')
        .map((param) => param.trim());
    return parameterNames.filter(Boolean); // Removes empty strings
}
